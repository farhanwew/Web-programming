from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk production, ganti dengan domain frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model data mahasiswa
class Mahasiswa(BaseModel):
    id: Optional[str] = None
    nama: str
    alamat: str
    jenis_kelamin: str
    prodi: str

# Database sementara (in-memory)
mahasiswa_db = []

# Endpoint untuk mendapatkan semua data mahasiswa
@app.get("/mahasiswa", response_model=List[Mahasiswa])
async def get_all_mahasiswa():
    return mahasiswa_db

# Endpoint untuk mendapatkan mahasiswa berdasarkan ID
@app.get("/mahasiswa/{mahasiswa_id}", response_model=Mahasiswa)
async def get_mahasiswa(mahasiswa_id: str):
    for mahasiswa in mahasiswa_db:
        if mahasiswa.id == mahasiswa_id:
            return mahasiswa
    raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")

# Endpoint untuk menambahkan mahasiswa baru
@app.post("/mahasiswa", response_model=Mahasiswa)
async def create_mahasiswa(mahasiswa: Mahasiswa):
    mahasiswa.id = str(uuid.uuid4())
    mahasiswa_db.append(mahasiswa)
    return mahasiswa

# Endpoint untuk mengupdate data mahasiswa
@app.put("/mahasiswa/{mahasiswa_id}", response_model=Mahasiswa)
async def update_mahasiswa(mahasiswa_id: str, updated_mahasiswa: Mahasiswa):
    for i, mahasiswa in enumerate(mahasiswa_db):
        if mahasiswa.id == mahasiswa_id:
            updated_mahasiswa.id = mahasiswa_id
            mahasiswa_db[i] = updated_mahasiswa
            return updated_mahasiswa
    raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")

# Endpoint untuk menghapus data mahasiswa
@app.delete("/mahasiswa/{mahasiswa_id}")
async def delete_mahasiswa(mahasiswa_id: str):
    for i, mahasiswa in enumerate(mahasiswa_db):
        if mahasiswa.id == mahasiswa_id:
            del mahasiswa_db[i]
            return {"message": "Mahasiswa berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "API Pendaftaran Mahasiswa"}
