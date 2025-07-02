import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Atlas connection string
MONGO_URI = os.environ.get('MONGO_URI')
DB_NAME = os.environ.get('MONGO_DB_NAME', 'student_reports')

def get_db_connection():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        db = client[DB_NAME]
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def get_all_mahasiswa():
    db = get_db_connection()
    if db is None:
        return []
    
    try:
        # Convert MongoDB documents to dictionaries
        mahasiswa = list(db.mahasiswa.find({}, {'_id': 0}))
        
        # Convert string dates to datetime objects for compatibility with the app
        for student in mahasiswa:
            if isinstance(student['tanggal_lahir'], str):
                student['tanggal_lahir'] = datetime.strptime(student['tanggal_lahir'], '%Y-%m-%d')
        
        return mahasiswa
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def add_mahasiswa(NRP, nama_lengkap, no_hp, tanggal_lahir):
    db = get_db_connection()
    if db is None:
        return False

    try:
        # Create a document
        student = {
            "NRP": NRP,
            "nama_lengkap": nama_lengkap,
            "no_hp": no_hp,
            "tanggal_lahir": datetime.strptime(tanggal_lahir, '%Y-%m-%d')
        }
        
        # Insert into collection
        db.mahasiswa.insert_one(student)
        return True
    except Exception as e:
        print(f"Error adding data: {e}")
        return False

def get_mahasiswa_by_id(id):
    db = get_db_connection()
    if db is None:
        return None
    
    try:
        # Find student by NRP/NIM
        student = db.mahasiswa.find_one({"NRP": id})
        
        # If not found with NRP, try with nim
        if student is None:
            student = db.mahasiswa.find_one({"nim": id})
            
        if student:
            # Remove MongoDB _id field before returning
            student.pop('_id', None)
            
            # Convert string dates to datetime objects if needed
            if isinstance(student['tanggal_lahir'], str):
                student['tanggal_lahir'] = datetime.strptime(student['tanggal_lahir'], '%Y-%m-%d')
                
        return student
    except Exception as e:
        print(f"Error fetching student: {e}")
        return None

def update_mahasiswa(id, nama_lengkap, no_hp, tanggal_lahir):
    db = get_db_connection()
    if db is None:
        return False
    
    try:
        # Find if student exists with NRP or nim
        student = db.mahasiswa.find_one({"NRP": id})
        id_field = "NRP"
        
        if student is None:
            student = db.mahasiswa.find_one({"nim": id})
            id_field = "nim"
            
        if student is None:
            return False
            
        # Update the document
        result = db.mahasiswa.update_one(
            {id_field: id},
            {"$set": {
                "nama_lengkap": nama_lengkap,
                "no_hp": no_hp,
                "tanggal_lahir": datetime.strptime(tanggal_lahir, '%Y-%m-%d')
            }}
        )
        
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating data: {e}")
        return False

def delete_mahasiswa(id):
    db = get_db_connection()
    if db is None:
        return False
    
    try:
        # Try to delete by NRP
        result = db.mahasiswa.delete_one({"NRP": id})
        
        # If nothing was deleted, try with nim
        if result.deleted_count == 0:
            result = db.mahasiswa.delete_one({"nim": id})
            
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting data: {e}")
        return False