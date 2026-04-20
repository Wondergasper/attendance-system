# Smart Attendance System

This document outlines how to start and run the full-stack Smart Attendance System.

The application has two main components that need to be running simultaneously: the Python Backend and the React Frontend.

## 1. Start the Backend (FastAPI + SQLite)

The backend handles the API requests, user authentication, model inferences, and stores data.

1. Open a new terminal.
2. Navigate to the backend folder:
   ```cmd
   cd "attendance-system backend"
   ```
3. Start the server using Uvicorn (on port 8000):
   ```cmd
   python -m uvicorn main:app --reload --port 8000
   ```
   *The backend will now be accessible at `http://localhost:8000`.*

---

## 2. Start the Frontend (React + Vite)

The frontend contains both the Student Portal (mobile-focused) and the Admin Dashboard.

1. Open a **second** terminal.
2. Navigate to the frontend folder:
   ```cmd
   cd atsf
   ```
3. Start the Vite development server:
   ```cmd
   npm run dev
   ```
   *The app UI will now be accessible at `http://localhost:5173`.*

---

## 3. (Optional) Retraining the ML Model

The backend uses a Scikit-Learn Machine Learning model (`attendance_model.pkl`) to identify anomalous attendance patterns. If you ever update the logic and need to generate a new model:

1. Navigate to the Machine Learning folder:
   ```cmd
   cd ml
   ```
2. Run the script:
   ```cmd
   python "ML logic.py"
   ```
3. The script will train a new `attendance_model.pkl` file, which you can move to the backend folder when ready.

---

## Access Points

* **Student Portal:** `http://localhost:5173/`
* **Admin Dashboard:** `http://localhost:5173/admin/login`
* **Backend API Docs:** `http://localhost:8000/docs`
