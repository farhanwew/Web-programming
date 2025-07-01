# Student Management System Documentation

## Application Description

Student Management System is a web application for managing student data. This application allows users to add, view, edit, and delete student information including their profile photos.

## Application URL
The application can be accessed at: [https://farwew-crud-upload-photo.hf.space/](https://farwew-crud-upload-photo.hf.space/)

## Main Features

1. **Student Data Management**
   - Add new student data
   - View list of all students
   - Edit existing student data
   - Delete student data

2. **Photo Upload and Management**
   - Upload student profile photos
   - View enlarged photos (zoom) by clicking on them
   - Support for standard image formats (JPG, PNG, etc.)

3. **Responsive Interface**
   - Responsive display for various screen sizes
   - Smooth transition animations
   - Card design for displaying student information

## How to Use

### Adding Student Data

1. Fill out the "Add Student Data" form with the required information:
   - NRP (required)
   - Full Name (required)
   - Gender (required)
   - Phone Number (required)
   - Address (required)
   - Photo (optional)

2. Click the "Save Data" button to save the student information.

### Viewing Student Data

- All student data is displayed as cards in the "Student List" section
- Click the "Refresh Data" button to update the display with the latest data

### Viewing Photos with Zoom

- Click on a student's photo to view it in a larger size
- Click outside the photo or press the 'Escape' key to close the zoom view
- Click the 'X' button in the top right corner to close the zoom view

### Editing Student Data

1. Click the "Edit" button on the student card you want to modify
2. The form will be filled with the selected student's data
3. Change the desired information
4. Click "Update Data" to save changes, or "Cancel" to cancel

### Deleting Student Data

1. Click the "Delete" button on the student card you want to remove
2. Confirm deletion in the dialog that appears

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Responsive design with CSS Grid and Flexbox
- Asynchronous communication using Fetch API
- Hosting: Hugging Face Spaces

## System Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection

## Additional Notes

- Data is stored on the server and will persist even if the browser is closed
- All fields marked with * are required
- Uploaded photos should ideally be square-shaped for optimal display

---
