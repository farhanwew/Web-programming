from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session

# Import models dan database config
from database import engine, get_db
import models

# Buat tabel di database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk production, ganti dengan domain frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model data mahasiswa (Pydantic model untuk validasi request)
class Mahasiswa(BaseModel):
    id: Optional[str] = None
    nama: str
    alamat: str
    jenis_kelamin: str
    prodi: str
    
    class Config:
        orm_mode = True

# Endpoint untuk mendapatkan semua data mahasiswa
@app.get("/mahasiswa", response_model=List[Mahasiswa])
async def get_all_mahasiswa(db: Session = Depends(get_db)):
    mahasiswa_list = db.query(models.MahasiswaModel).all()
    return mahasiswa_list

# Endpoint untuk mendapatkan mahasiswa berdasarkan ID
@app.get("/mahasiswa/{mahasiswa_id}", response_model=Mahasiswa)
async def get_mahasiswa(mahasiswa_id: str, db: Session = Depends(get_db)):
    mahasiswa = db.query(models.MahasiswaModel).filter(models.MahasiswaModel.id == mahasiswa_id).first()
    if mahasiswa is None:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    return mahasiswa

# Endpoint untuk menambahkan mahasiswa baru
@app.post("/mahasiswa", response_model=Mahasiswa)
async def create_mahasiswa(mahasiswa: Mahasiswa, db: Session = Depends(get_db)):
    # Generate UUID
    mahasiswa_id = str(uuid.uuid4())
    
    # Buat instance model SQLAlchemy
    db_mahasiswa = models.MahasiswaModel(
        id=mahasiswa_id,
        nama=mahasiswa.nama,
        alamat=mahasiswa.alamat,
        jenis_kelamin=mahasiswa.jenis_kelamin,
        prodi=mahasiswa.prodi
    )
    
    # Tambahkan ke database
    db.add(db_mahasiswa)
    db.commit()
    db.refresh(db_mahasiswa)
    
    return db_mahasiswa

# Endpoint untuk mengupdate data mahasiswa
@app.put("/mahasiswa/{mahasiswa_id}", response_model=Mahasiswa)
async def update_mahasiswa(mahasiswa_id: str, mahasiswa: Mahasiswa, db: Session = Depends(get_db)):
    # Cari mahasiswa yang akan diupdate
    db_mahasiswa = db.query(models.MahasiswaModel).filter(models.MahasiswaModel.id == mahasiswa_id).first()
    
    # Periksa apakah mahasiswa ditemukan
    if db_mahasiswa is None:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    
    # Update data
    db_mahasiswa.nama = mahasiswa.nama
    db_mahasiswa.alamat = mahasiswa.alamat
    db_mahasiswa.jenis_kelamin = mahasiswa.jenis_kelamin
    db_mahasiswa.prodi = mahasiswa.prodi
    
    # Commit perubahan ke database
    db.commit()
    db.refresh(db_mahasiswa)
    
    return db_mahasiswa

# Endpoint untuk menghapus data mahasiswa
@app.delete("/mahasiswa/{mahasiswa_id}")
async def delete_mahasiswa(mahasiswa_id: str, db: Session = Depends(get_db)):
    # Cari mahasiswa yang akan dihapus
    db_mahasiswa = db.query(models.MahasiswaModel).filter(models.MahasiswaModel.id == mahasiswa_id).first()
    
    # Periksa apakah mahasiswa ditemukan
    if db_mahasiswa is None:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    
    # Hapus dari database
    db.delete(db_mahasiswa)
    db.commit()
    
    return {"message": "Mahasiswa berhasil dihapus"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "API Pendaftaran Mahasiswa"}