import mysql.connector
from mysql.connector import Error
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

def setup_database():
    host = os.getenv("DB_HOST")  # Default to localhost if not set
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            cursor.execute("CREATE DATABASE IF NOT EXISTS db_mahasiswa")
            print("Database db_mahasiswa berhasil dibuat atau sudah ada")
            
            cursor.execute("USE db_mahasiswa")
            
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS mahasiswa (
                id VARCHAR(36) PRIMARY KEY,
                nama VARCHAR(100) NOT NULL,
                alamat TEXT NOT NULL,
                jenis_kelamin VARCHAR(20) NOT NULL,
                prodi VARCHAR(100) NOT NULL
            )
            """)
            print("Tabel mahasiswa berhasil dibuat atau sudah ada")
            
            try:
                cursor.execute("CREATE INDEX idx_mahasiswa_id ON mahasiswa(id)")
                print("Indeks berhasil dibuat")
            except Error as e:
                if "Duplicate key name" in str(e):
                    print("Indeks sudah ada, melewati pembuatan indeks")
                else:
                    print(f"Error saat membuat indeks: {e}")
            
    except Error as e:
        print(f"Error saat koneksi ke MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("Koneksi MySQL ditutup")

# Database connection URL
DATABASE_URL = "mysql+pymysql://farhan:12345@localhost/db_mahasiswa"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    setup_database()
