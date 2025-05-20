# Script untuk membuat database dan tabel

import mysql.connector
from mysql.connector import Error

def setup_database():
    # Koneksi parameters
    host = "localhost"      # Sesuaikan jika MySQL di server lain
    user = "farhan"           # Ganti dengan username MySQL Anda
    password = "12345"   # Ganti dengan password MySQL Anda
    
    try:
        # Koneksi ke MySQL server
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Buat database jika belum ada
            cursor.execute("CREATE DATABASE IF NOT EXISTS db_mahasiswa")
            print("Database db_mahasiswa berhasil dibuat atau sudah ada")
            
            # Gunakan database
            cursor.execute("USE db_mahasiswa")
            
            # Buat tabel mahasiswa
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
            
            # Periksa apakah indeks sudah ada
            cursor.execute("SHOW INDEX FROM mahasiswa WHERE Key_name = 'idx_mahasiswa_id'")
            index_exists = cursor.fetchone()
            
            # Buat indeks jika belum ada
            if not index_exists:
                cursor.execute("CREATE INDEX idx_mahasiswa_id ON mahasiswa(id)")
                print("Indeks berhasil dibuat")
            else:
                print("Indeks sudah ada")
            
    except Error as e:
        print(f"Error saat koneksi ke MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("Koneksi MySQL ditutup")

if __name__ == "__main__":
    setup_database()