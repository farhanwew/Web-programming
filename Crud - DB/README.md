# Student Registration CRUD Application

A simple web application for student registration using FastAPI (backend), MySQL (database), and HTML/CSS/JavaScript (frontend).

---

## Features

- Add, view, edit, and delete student data.
- Backend using FastAPI & SQLAlchemy.
- MySQL as the database.
- Simple frontend with HTML, CSS, and JavaScript.

---

## Project Structure

```
README.md
Back/
    app.py
    database.py
    models.py
    requirements.txt
    setup_database.py
    setup_database.sql
Front-end/
    index.html
    form.html
    list.html
    script.js
    style.css
```

---

## Database (MySQL) Emphasis

### 1. MySQL Installation

Make sure MySQL is installed and running on your system.

### 2. Student Table Structure

The `mahasiswa` table is used to store student data. Here is the table structure:

| Column        | Data Type     | Description         |
|---------------|--------------|---------------------|
| id            | VARCHAR(36)  | Primary Key, UUID   |
| nama          | VARCHAR(100) | Student name        |
| alamat        | VARCHAR(255) | Student address     |
| jenis_kelamin | VARCHAR(20)  | Gender             |
| prodi         | VARCHAR(100) | Study program       |

Example SQL table definition:
```sql
CREATE TABLE IF NOT EXISTS mahasiswa (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat VARCHAR(255) NOT NULL,
    jenis_kelamin VARCHAR(20) NOT NULL,
    prodi VARCHAR(100) NOT NULL
);
```

Python model definition (`Back/models.py`):
```python
class MahasiswaModel(Base):
    __tablename__ = "mahasiswa"
    
    id = Column(String(36), primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    alamat = Column(String(255), nullable=False)
    jenis_kelamin = Column(String(20), nullable=False)
    prodi = Column(String(100), nullable=False)
```

### 3. Creating the Database and Table

#### a. Using SQL

- Run the SQL script in [`Back/setup_database.sql`](Back/setup_database.sql).

#### b. Using Python Script

- Run:
    ```sh
    python Back/setup_database.py
    ```

### 4. Database Connection Configuration

- Connection settings are in [`Back/database.py`](Back/database.py):

    ```python
    DATABASE_URL = "mysql+pymysql://farhan:12345@localhost/db_mahasiswa"
    ```

- Change `farhan` and `12345` to your MySQL username and password.

---

## How the Database is Used in the Application

- The backend uses SQLAlchemy ORM to interact with the MySQL database.
- The table structure is defined in [`Back/models.py`](Back/models.py).
- All CRUD operations are performed on the `mahasiswa` table via API endpoints in [`Back/app.py`](Back/app.py).

---

## Running the Application

### 1. Install Backend Dependencies

```sh
pip install -r Back/requirements.txt
```

### 2. Start the Backend Server

```sh
uvicorn Back.app:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Open the Frontend

Open [`Front-end/index.html`](Front-end/index.html) in your browser.

---

## API Endpoints

- `GET /mahasiswa` : List all students
- `GET /mahasiswa/{id}` : Get student details
- `POST /mahasiswa` : Add a new student
- `PUT /mahasiswa/{id}` : Update student data
- `DELETE /mahasiswa/{id}` : Delete a student

---

## Notes

- Make sure the backend server is running before using the frontend.
- Update CORS settings in the backend if the frontend is hosted on a different domain.
- The database and table will be created automatically if they do not exist.

---
