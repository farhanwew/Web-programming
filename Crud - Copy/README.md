# Student Registration System

A full-stack web application for managing student registrations with CRUD functionality.

## Overview

This project implements a student registration system with:
- FastAPI backend with MySQL database
- HTML/CSS/JavaScript frontend
- Complete CRUD operations (Create, Read, Update, Delete)
- Responsive design

## Project Structure

```
Student Registration System/
│
├── Back/                   # Backend code
│   ├── app.py              # Main FastAPI application
│   ├── database.py         # Database connection and operations
│   ├── models.py           # Data models
│   ├── setup_database.py   # Database initialization script
│   ├── Dockerfile          # Docker configuration for backend
│   └── requirements.txt    # Python dependencies
│
└── Front-end/              # Frontend code
    ├── HTML, CSS & JavaScript files
    └── Assets and resources
```

## Features

- **Student Management**: Add, view, edit, and delete student records
- **Data Validation**: Client and server-side validation of student information
- **Responsive Interface**: Works on desktop and mobile devices
- **RESTful API**: Clear API endpoints for all operations
- **Database Integration**: Persistent storage with MySQL

## Installation

### Prerequisites

- Python 3.8+
- MySQL 5.7+

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd "Crud - Copy/Back"
   ```

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

3. Configure your MySQL database settings in `database.py`

4. Run the database setup script:
   ```
   python setup_database.py
   ```

5. Start the FastAPI server:
   ```
   uvicorn app:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd "Crud - Copy/Front-end"
   ```

2. Open the HTML files directly in your browser or use a local server

### Docker Setup (Alternative)

You can also use Docker to run the backend:

1. Build the Docker image:
   ```
   docker build -t student-registration-system ./Back
   ```

2. Run the container:
   ```
   docker run -p 8000:8000 student-registration-system
   ```

## Local Development and Database Access

### Setting Up MySQL Database Locally

1. Install MySQL on your local machine if not already installed:
   - For Windows: Download and install from [MySQL Community Downloads](https://dev.mysql.com/downloads/installer/)
   - For Mac: `brew install mysql`
   - For Linux: `sudo apt install mysql-server`

2. Start MySQL service:
   - Windows: Use Services manager or run as administrator: `net start mysql`
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

3. Access MySQL command line:
   ```
   mysql -u root -p
   ```

4. Create a database for the application:
   ```sql
   CREATE DATABASE student_registration;
   ```

5. Create a user and grant permissions:
   ```sql
   CREATE USER 'student_app'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON student_registration.* TO 'student_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Configuring the Application to Use Your Local Database

1. Open `database.py` in the Back directory and update the connection string:
   ```python
   DATABASE_URL = "mysql+pymysql://student_app:your_password@localhost/student_registration"
   ```

2. Make sure the MySQL server is running when starting the application

### Accessing the Database Management Tools

1. **Using phpMyAdmin (Optional):**
   - Install phpMyAdmin or use a tool like XAMPP/MAMP which includes it
   - Access it at http://localhost/phpmyadmin

2. **Using MySQL Workbench:**
   - Download and install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
   - Connect to your local MySQL server
   - Navigate to the student_registration database

3. **Direct MySQL Console Access:**
   ```
   mysql -u student_app -p
   USE student_registration;
   ```

4. **Useful MySQL Commands:**
   ```sql
   -- View all tables
   SHOW TABLES;
   
   -- View table structure
   DESCRIBE students;
   
   -- View all students
   SELECT * FROM students;
   
   -- Backup database
   -- (Run this from terminal, not MySQL console)
   mysqldump -u student_app -p student_registration > backup.sql
   ```

### Troubleshooting Database Connections

- Ensure MySQL service is running
- Verify connection credentials are correct
- Check that the database has been created
- Ensure the user has correct permissions
- Check for port conflicts (default MySQL port is 3306)

## API Endpoints

| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| GET    | /students        | Get all students               |
| GET    | /students/{id}   | Get student by ID              |
| POST   | /students        | Create a new student           |
| PUT    | /students/{id}   | Update student information     |
| DELETE | /students/{id}   | Delete a student               |

## Usage Guide

1. **Adding a Student**: Fill in the registration form with student details and submit
2. **Viewing Students**: Navigate to the students list page to see all registered students
3. **Updating Information**: Click on the edit button for a student to modify their details
4. **Removing a Student**: Use the delete button to remove a student from the system

## Technologies Used

- **Backend**: FastAPI, MySQL, SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript
- **Containerization**: Docker