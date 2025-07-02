import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.environ.get('MONGO_URI')
DB_NAME = os.environ.get('MONGO_DB_NAME', 'student_reports')

def create_database_and_collection():
    try:
        # Connect to MongoDB Atlas
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Check if collection exists, create it if not
        if 'mahasiswa' not in db.list_collection_names():
            db.create_collection('mahasiswa')
            print(f"Collection 'mahasiswa' created successfully.")
        
        # Check if collection is empty and insert sample data if it is
        if db.mahasiswa.count_documents({}) == 0:
            sample_data = [
                {'NRP': '5054231012', 'nama_lengkap': 'Budi Santoso', 'no_hp': '089699935552', 'tanggal_lahir': datetime(2017, 9, 2)},
                {'NRP': '5054231013', 'nama_lengkap': 'Dewi Lestari', 'no_hp': '089699935553', 'tanggal_lahir': datetime(2017, 9, 2)},
                {'NRP': '5054231014', 'nama_lengkap': 'Ahmad Suryanto', 'no_hp': '089699935554', 'tanggal_lahir': datetime(2017, 9, 3)},
                {'NRP': '5054231015', 'nama_lengkap': 'Siti Rahayu', 'no_hp': '089699935555', 'tanggal_lahir': datetime(2017, 9, 3)}
            ]
            db.mahasiswa.insert_many(sample_data)
            print("Sample data inserted.")
        else:
            print("Collection already contains data. Skipping sample data insertion.")
        
        print(f"Database '{DB_NAME}' and 'mahasiswa' collection ensured successfully.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    create_database_and_collection()