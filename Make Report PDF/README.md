# Student Report System Documentation (Flask + MongoDB + PDF)

## Live Deployment

Try the deployed app here:  
[https://farwew-registration-system.hf.space](https://farwew-registration-system.hf.space)


## Description
This web application is a student report system built with Flask, MongoDB, and fpdf2 for generating PDF reports. Student data can be added, edited, deleted, and exported as PDF.

---

## Folder Structure

```
Make Report PDF/
│
├── app.py                # Main Flask app
├── database.py           # MongoDB connection & operations
├── create_db.py          # Database initialization & sample data script
├── requirements.txt      # Python dependencies
├── Dockerfile            # Docker configuration
├── .env                  # Environment configuration (do not upload publicly)
├── templates/            # HTML templates (Jinja2)
│   ├── index.html
│   ├── tambah_siswa.html
│   └── edit_siswa.html
└── __pycache__/          # Python cache (ignore)
```

---

## Installation & Running

### 1. Clone & Enter the Folder
```sh
git clone <your-repo>
cd "Make Report PDF"
```

### 2. Create Virtual Environment (optional but recommended)
```sh
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
```

### 4. Configure `.env`
Edit the `.env` file and set `MONGO_URI` to your MongoDB Atlas connection string.

### 5. Initialize Database (optional, for sample data)
```sh
python create_db.py
```

### 6. Run the Application
```sh
python app.py
```
Access in your browser: [http://localhost:7860](http://localhost:7860)

---

## Features

- **Add Student**  
  Input form for new student data.

- **Edit Student**  
  Update existing student data.

- **Delete Student**  
  Confirmation before deleting data.

- **Export PDF**  
  Download student report in PDF format.

---

## Deploy with Docker

### Build Image
```sh
docker build -t student-report .
```

### Run Container
```sh
docker run -d -p 7860:7860 --env-file .env student-report
```

---

## Important Files

- `app.py`: Flask routing, main application logic.
- `database.py`: CRUD functions for MongoDB.
- `templates/index.html`: Main student list view.
- `templates/tambah_siswa.html`: Add student form.
- `templates/edit_siswa.html`: Edit student form.

---

## Notes

- Do not upload your `.env` file publicly.
- For production, set `debug=False` in `app.run()`.
- Make sure your MongoDB Atlas allows access from your app's IP.

---


