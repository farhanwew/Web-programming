from sqlalchemy import Column, String, Integer
from database import Base

class MahasiswaModel(Base):
    __tablename__ = "mahasiswa"
    
    id = Column(String(36), primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    alamat = Column(String(255), nullable=False)
    jenis_kelamin = Column(String(20), nullable=False)
    prodi = Column(String(100), nullable=False)