from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from typing import Optional
import joblib

import bcrypt
from jose import JWTError, jwt

from database import SessionLocal, AttendanceLog, Student, Admin, SystemSettings

# ─── Security config ─────────────────────────────────────────────────────────
SECRET_KEY = "ats-super-secret-key-change-in-production-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# ─── DB dependency ────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Auth middleware ──────────────────────────────────────────────────────────
def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db: Session = Depends(get_db)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(credentials.credentials)
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if not email or role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="Attendance System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ML Model ─────────────────────────────────────────────────────────────────
try:
    model = joblib.load("attendance_model.pkl")
    print("[OK] ML model loaded.")
except FileNotFoundError:
    model = None
    print("[WARN] attendance_model.pkl not found - predictions will default to PRESENT.")


# ─── Seeding ──────────────────────────────────────────────────────────────────
def seed_defaults():
    db = SessionLocal()
    # Seed default admin
    if not db.query(Admin).filter(Admin.email == "admin@university.edu").first():
        db.add(Admin(
            email="admin@university.edu",
            password=hash_password("admin123"),
            name="Administrator"
        ))
        print("[OK] Default admin seeded.")

    # Seed default settings row
    if not db.query(SystemSettings).first():
        db.add(SystemSettings())
        print("[OK] Default settings seeded.")

    db.commit()
    db.close()


seed_defaults()


# ─── Pydantic schemas ─────────────────────────────────────────────────────────
class StudentRegister(BaseModel):
    full_name: str
    email: str
    student_id: str
    password: str
    device_id: str


class LoginRequest(BaseModel):
    id_or_email: str
    password: str


class ScanRequest(BaseModel):
    student_id: str
    device_id: str
    clock_in_time: float
    frequency_score: float


class SettingsUpdate(BaseModel):
    attendance_window_start: Optional[str] = None
    attendance_window_end: Optional[str] = None
    anomaly_sensitivity: Optional[str] = None


class AdminPasswordChange(BaseModel):
    current_password: str
    new_password: str


# ─── Student Auth ─────────────────────────────────────────────────────────────
@app.post("/register/student")
def register_student(req: StudentRegister, db: Session = Depends(get_db)):
    if db.query(Student).filter(Student.student_id == req.student_id).first():
        raise HTTPException(status_code=400, detail="Student ID already registered")
    if db.query(Student).filter(Student.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already in use")

    new_student = Student(
        full_name=req.full_name,
        email=req.email,
        student_id=req.student_id,
        password=hash_password(req.password),
        device_id=req.device_id,
        date_joined=str(date.today())
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    token = create_token({"sub": new_student.student_id, "role": "student"})
    return {
        "message": "Registration successful",
        "token": token,
        "fullName": new_student.full_name,
        "studentID": new_student.student_id,
        "email": new_student.email,
        "device": new_student.device_id
    }


@app.post("/login/student")
def login_student(req: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(
        (Student.student_id == req.id_or_email) | (Student.email == req.id_or_email)
    ).first()

    if not student or not verify_password(req.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid Student ID or Password")

    if student.is_active == 0:
        raise HTTPException(status_code=403, detail="Account deactivated")

    token = create_token({"sub": student.student_id, "role": "student"})
    return {
        "token": token,
        "fullName": student.full_name,
        "studentID": student.student_id,
        "email": student.email,
        "device": student.device_id
    }


# ─── Admin Auth ───────────────────────────────────────────────────────────────
@app.post("/login/admin")
def login_admin(req: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == req.id_or_email).first()
    if not admin or not verify_password(req.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": admin.email, "role": "admin"})
    return {
        "token": token,
        "name": admin.name,
        "email": admin.email,
        "role": "System Admin"
    }


@app.post("/admin/change-password")
def change_admin_password(
    req: AdminPasswordChange,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_admin.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    current_admin.password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# ─── Attendance Scan ──────────────────────────────────────────────────────────
@app.post("/scan")
def scan(request: ScanRequest, db: Session = Depends(get_db)):
    today_str = str(date.today())
    student = db.query(Student).filter(Student.student_id == request.student_id).first()

    if not student:
        return {"status": "ERROR", "reason": "Unregistered Student"}

    if student.is_active == 0:
        return {"status": "ERROR", "reason": "Student account is deactivated"}

    if student.device_id != request.device_id:
        status = "FLAGGED"
        reason = "Unrecognized Device used for Check-in"
    else:
        existing = db.query(AttendanceLog).filter(
            AttendanceLog.student_id == request.student_id,
            AttendanceLog.date == today_str
        ).first()
        if existing:
            return {"status": "FLAGGED", "reason": "Duplicate Scan Detected Today"}

        device_flag = 0
        features = [request.clock_in_time, device_flag, request.frequency_score]
        prediction = 1
        if model:
            prediction = model.predict([features])[0]

        status = "PRESENT" if prediction == 1 else "FLAGGED"
        reason = "Normal attendance" if prediction == 1 else "Anomalous interaction pattern"

    new_log = AttendanceLog(
        student_id=request.student_id,
        device_id=request.device_id,
        date=today_str,
        timestamp=request.clock_in_time,
        status=status,
        reason=reason
    )
    db.add(new_log)
    db.commit()
    return {"student_id": request.student_id, "status": status, "reason": reason}


# ─── Admin – Stats ────────────────────────────────────────────────────────────
@app.get("/admin/stats")
def get_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    today_str = str(date.today())
    total_students = db.query(Student).filter(Student.is_active == 1).count()
    today_logs = db.query(AttendanceLog).filter(AttendanceLog.date == today_str).all()
    today_attendance = len(today_logs)
    flagged_today = sum(1 for log in today_logs if log.status == "FLAGGED")
    present_today = sum(1 for log in today_logs if log.status == "PRESENT")

    # Weekly attendance counts (last 7 days for chart)
    from datetime import timedelta
    weekly = []
    for i in range(6, -1, -1):
        day = date.today() - timedelta(days=i)
        day_str = str(day)
        count = db.query(AttendanceLog).filter(
            AttendanceLog.date == day_str,
            AttendanceLog.status == "PRESENT"
        ).count()
        weekly.append({"day": day.strftime("%a"), "count": count})

    # Flagging reason breakdown from real data
    total_flagged = db.query(AttendanceLog).filter(AttendanceLog.status == "FLAGGED").count()
    device_flags = db.query(AttendanceLog).filter(
        AttendanceLog.status == "FLAGGED",
        AttendanceLog.reason.like("%Device%")
    ).count()
    duplicate_flags = db.query(AttendanceLog).filter(
        AttendanceLog.status == "FLAGGED",
        AttendanceLog.reason.like("%Duplicate%")
    ).count()
    anomaly_flags = db.query(AttendanceLog).filter(
        AttendanceLog.status == "FLAGGED",
        AttendanceLog.reason.like("%Anomal%")
    ).count()

    def pct(n): return round(n / total_flagged * 100) if total_flagged > 0 else 0

    return {
        "totalStudents": total_students,
        "todayAttendance": today_attendance,
        "flaggedToday": flagged_today,
        "activeSessions": present_today,
        "weeklyData": weekly,
        "flaggingReasons": [
            {"label": "Device Mismatch", "value": pct(device_flags)},
            {"label": "Duplicate Scan",  "value": pct(duplicate_flags)},
            {"label": "Anomalous Pattern", "value": pct(anomaly_flags)},
        ]
    }


# ─── Admin – Students ─────────────────────────────────────────────────────────
@app.get("/admin/students")
def get_all_students(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    students = db.query(Student).all()
    result = []
    for s in students:
        total_attendance = db.query(AttendanceLog).filter(
            AttendanceLog.student_id == s.student_id,
            AttendanceLog.status == "PRESENT"
        ).count()
        result.append({
            "id": s.id,
            "name": s.full_name,
            "studentId": s.student_id,
            "email": s.email,
            "device": s.device_id,
            "dateJoined": s.date_joined or "N/A",
            "totalAttendance": total_attendance,
            "isActive": s.is_active
        })
    return result


@app.post("/admin/students/deactivate/{student_id}")
def deactivate_student(
    student_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.is_active = 0
    db.commit()
    return {"message": "Student deactivated"}


@app.post("/admin/students/reactivate/{student_id}")
def reactivate_student(
    student_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.is_active = 1
    db.commit()
    return {"message": "Student reactivated"}


# ─── Admin – Logs ─────────────────────────────────────────────────────────────
@app.get("/admin/logs")
def get_logs(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    results = db.query(AttendanceLog, Student.full_name).outerjoin(
        Student, AttendanceLog.student_id == Student.student_id
    ).order_by(AttendanceLog.id.desc()).all()

    enriched_logs = []
    for log, name in results:
        try:
            time_str = datetime.fromtimestamp(log.timestamp).strftime("%H:%M:%S")
        except Exception:
            time_str = "00:00:00"

        enriched_logs.append({
            "id": log.id,
            "studentName": name or "Unknown",
            "studentId": log.student_id,
            "device": log.device_id,
            "date": log.date,
            "time": time_str,
            "status": log.status,
            "reason": log.reason
        })
    return enriched_logs


# ─── Admin – Settings ─────────────────────────────────────────────────────────
@app.get("/admin/settings")
def get_settings(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    s = db.query(SystemSettings).first()
    return {
        "attendanceWindowStart": s.attendance_window_start,
        "attendanceWindowEnd": s.attendance_window_end,
        "anomalySensitivity": s.anomaly_sensitivity
    }


@app.patch("/admin/settings")
def update_settings(
    req: SettingsUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    s = db.query(SystemSettings).first()
    if req.attendance_window_start is not None:
        s.attendance_window_start = req.attendance_window_start
    if req.attendance_window_end is not None:
        s.attendance_window_end = req.attendance_window_end
    if req.anomaly_sensitivity is not None:
        s.anomaly_sensitivity = req.anomaly_sensitivity
    db.commit()
    return {"message": "Settings updated"}
