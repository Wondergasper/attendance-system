from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./attendance.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class AttendanceLog(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    device_id = Column(String)
    date = Column(String, index=True)
    timestamp = Column(Float)
    status = Column(String)
    reason = Column(String)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    student_id = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)   # hashed with bcrypt
    device_id = Column(String)
    is_active = Column(Integer, default=1)
    date_joined = Column(String)                # ISO date string


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)   # hashed with bcrypt
    name = Column(String)


class SystemSettings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    attendance_window_start = Column(String, default="07:00")
    attendance_window_end = Column(String, default="19:00")
    anomaly_sensitivity = Column(String, default="medium")


Base.metadata.create_all(bind=engine)
