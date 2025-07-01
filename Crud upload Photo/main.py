from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os
import shutil
import uuid
from datetime import datetime

app = FastAPI(title="Student CRUD API")

# Create directories
os.makedirs("static", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database setup
def init_db():
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nrp TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            jenis_kelamin TEXT NOT NULL,
            telpon TEXT NOT NULL,
            alamat TEXT NOT NULL,
            photo TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models
class Student(BaseModel):
    nrp: str
    nama: str
    jenis_kelamin: str
    telpon: str
    alamat: str
    photo: Optional[str] = None

class StudentResponse(BaseModel):
    id: int
    nrp: str
    nama: str
    jenis_kelamin: str
    telpon: str
    alamat: str
    photo: Optional[str] = None
    created_at: str

# Serve main HTML page
@app.get("/", response_class=HTMLResponse)
async def read_root():
    return FileResponse('static/index.html')

# API Routes
@app.get("/api/students")
async def get_students():
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students ORDER BY created_at DESC')
    students = cursor.fetchall()
    conn.close()
    
    result = []
    for student in students:
        result.append({
            "id": student[0],
            "nrp": student[1],
            "nama": student[2],
            "jenis_kelamin": student[3],
            "telpon": student[4],
            "alamat": student[5],
            "photo": student[6],
            "created_at": student[7]
        })
    
    return result

@app.get("/api/students/{student_id}")
async def get_student(student_id: int):
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students WHERE id = ?', (student_id,))
    student = cursor.fetchone()
    conn.close()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        "id": student[0],
        "nrp": student[1],
        "nama": student[2],
        "jenis_kelamin": student[3],
        "telpon": student[4],
        "alamat": student[5],
        "photo": student[6],
        "created_at": student[7]
    }

@app.post("/api/students")
async def create_student(
    nrp: str = Form(...),
    nama: str = Form(...),
    jenis_kelamin: str = Form(...),
    telpon: str = Form(...),
    alamat: str = Form(...),
    photo: Optional[UploadFile] = File(None)
):
    photo_filename = None
    
    # Handle file upload
    if photo and photo.filename:
        file_extension = photo.filename.split('.')[-1]
        photo_filename = f"{uuid.uuid4()}.{file_extension}"
        photo_path = f"uploads/{photo_filename}"
        
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
    
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO students (nrp, nama, jenis_kelamin, telpon, alamat, photo)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nrp, nama, jenis_kelamin, telpon, alamat, photo_filename))
        
        student_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {"message": "Student created successfully", "id": student_id}
    
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="NRP already exists")

@app.put("/api/students/{student_id}")
async def update_student(
    student_id: int,
    nrp: str = Form(...),
    nama: str = Form(...),
    jenis_kelamin: str = Form(...),
    telpon: str = Form(...),
    alamat: str = Form(...),
    photo: Optional[UploadFile] = File(None)
):
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    
    # Check if student exists
    cursor.execute('SELECT photo FROM students WHERE id = ?', (student_id,))
    existing_student = cursor.fetchone()
    
    if not existing_student:
        conn.close()
        raise HTTPException(status_code=404, detail="Student not found")
    
    photo_filename = existing_student[0]  # Keep existing photo if no new one uploaded
    
    # Handle new file upload
    if photo and photo.filename:
        # Delete old photo if exists
        if photo_filename:
            old_photo_path = f"uploads/{photo_filename}"
            if os.path.exists(old_photo_path):
                os.remove(old_photo_path)
        
        file_extension = photo.filename.split('.')[-1]
        photo_filename = f"{uuid.uuid4()}.{file_extension}"
        photo_path = f"uploads/{photo_filename}"
        
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
    
    try:
        cursor.execute('''
            UPDATE students 
            SET nrp = ?, nama = ?, jenis_kelamin = ?, telpon = ?, alamat = ?, photo = ?
            WHERE id = ?
        ''', (nrp, nama, jenis_kelamin, telpon, alamat, photo_filename, student_id))
        
        conn.commit()
        conn.close()
        
        return {"message": "Student updated successfully"}
    
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="NRP already exists")

@app.delete("/api/students/{student_id}")
async def delete_student(student_id: int):
    conn = sqlite3.connect('/app/data/students.db')
    cursor = conn.cursor()
    
    # Get photo filename before deletion
    cursor.execute('SELECT photo FROM students WHERE id = ?', (student_id,))
    student = cursor.fetchone()
    
    if not student:
        conn.close()
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete photo file if exists
    if student[0]:
        photo_path = f"uploads/{student[0]}"
        if os.path.exists(photo_path):
            os.remove(photo_path)
    
    cursor.execute('DELETE FROM students WHERE id = ?', (student_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Student deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)