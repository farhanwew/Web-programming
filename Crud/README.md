# Student Registration System

## Overview

This application is a student registration system with CRUD (Create, Read, Update, Delete) functionality. It consists of a frontend built with HTML, CSS, and JavaScript that communicates with a backend API.

## Web Page
[*'Link to Pages'*](https://farhanwew.github.io/Web-programming/Crud/Front-end/index.html)

## API Endpoint

The backend API is hosted at:
```
https://farwew-api-coba.hf.space
```

This provides RESTful endpoints for managing student data. The API supports standard CRUD operations through HTTP methods.

## Architecture

The application has a client-server architecture:
- **Frontend**: HTML, CSS, and vanilla JavaScript
- **Backend**: Python API hosted on Hugging Face Spaces

## Project Structure

```
Crud/
├── README.md
├── Back/             # Backend API code
│   ├── .gitattributes
│   ├── app.py
│   ├── Dockerfile
│   ├── README.md
│   └── requirements.txt
└── Front-end/        # Frontend code
    ├── form.html
    ├── index.html
    ├── list.html
    ├── script.js
    └── style.css
```

## Frontend Components

### Main Page (index.html)
The entry point of the application with navigation links to:
- Register a new student
- View registered students

### Form Page (form.html)
Contains a form to add new student data with fields for:
- Name
- Address
- Gender
- Study Program

### List Page (list.html)
Displays all registered students in a table with options to:
- Edit student information
- Delete student records
- Add new students

## Backend API

The backend API is hosted at `https://farwew-api-coba.hf.space` and provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/mahasiswa` | Get all students |
| GET | `/mahasiswa/{id}` | Get student by ID |
| POST | `/mahasiswa` | Add a new student |
| PUT | `/mahasiswa/{id}` | Update student data |
| DELETE | `/mahasiswa/{id}` | Delete a student |

## Core Functionalities

### 1. Adding New Students
```javascript
fetch(`${API_URL}/mahasiswa`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(mahasiswaData)
})
```

### 2. Viewing Students
```javascript
function fetchAndDisplayMahasiswa() {
    fetch(`${API_URL}/mahasiswa`)
        .then(response => response.json())
        .then(data => {
            // Display data in table
        })
}
```

### 3. Updating Student Data
```javascript
fetch(`${API_URL}/mahasiswa/${mahasiswaId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
})
```

### 4. Deleting Students
```javascript
fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'DELETE'
})
```

## Installation and Setup

1. Clone the repository
2. Open `Front-end/index.html` in a web browser

Note: The backend API is already deployed and accessible, so no additional setup is required for the API.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for HTTP requests
- Python (FastAPI) for backend

