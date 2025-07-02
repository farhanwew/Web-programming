from flask import Flask, render_template, request, redirect, url_for, send_file, Response
from fpdf import FPDF
import database
import io
from datetime import datetime
import os # Import os module for environment variables

app = Flask(__name__)

@app.route('/')
def index():
    mahasiswa_data = database.get_all_mahasiswa()
    status = request.args.get('status')
    return render_template('index.html', mahasiswa=mahasiswa_data, status=status)

@app.route('/tambah_siswa', methods=['GET', 'POST'])
def tambah_siswa():
    if request.method == 'POST':
        NRP = request.form['NRP']
        nama_lengkap = request.form['nama_lengkap']
        no_hp = request.form['no_hp']
        tanggal_lahir = request.form['tanggal_lahir'] # Format YYYY-MM-DD from HTML date input

        if database.add_mahasiswa(NRP, nama_lengkap, no_hp, tanggal_lahir):
            return redirect(url_for('index', status='success'))
        else:
            # Handle error, maybe show an error message on the form
            return "Error adding data. Please check server logs.", 500
    return render_template('tambah_siswa.html')

@app.route('/cetak_pdf')
def cetak_pdf():
    try:
        pdf = FPDF('L', 'mm', 'A5')
        pdf.add_page()

        # School Header
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(190, 7, 'SEKOLAH MENENGAH KEJURUAN NEGERI 5 Cilegon', 0, 1, 'C')
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(190, 7, 'DAFTAR SISWA KELAS IX JURUSAN REKAYASA KECERDASAN ARTIFISIAL', 0, 1, 'C')
        pdf.cell(10, 7, '', 0, 1)  # Space

        # Table Header
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(30, 6, 'NRP', 1, 0, 'C')
        pdf.cell(80, 6, 'NAMA MAHASISWA', 1, 0, 'C')
        pdf.cell(40, 6, 'NO HP', 1, 0, 'C')
        pdf.cell(40, 6, 'TANGGAL LHR', 1, 1, 'C')

        # Table Data
        pdf.set_font('Arial', '', 10)
        mahasiswa_data = database.get_all_mahasiswa()
        for row in mahasiswa_data:
            # Get NRP/NIM value
            nim_value = str(row.get('NRP', row.get('nim', '')))
            pdf.cell(30, 6, nim_value, 1, 0, 'C')
            pdf.cell(80, 6, row['nama_lengkap'], 1, 0)
            pdf.cell(40, 6, str(row['no_hp']), 1, 0, 'C')
            
            # Improved date handling in the PDF generation
            tanggal = row['tanggal_lahir']
            try:
                if isinstance(tanggal, datetime):
                    formatted_date = tanggal.strftime('%d-%m-%Y')
                else:
                    # Try to convert if it's a string in YYYY-MM-DD format
                    formatted_date = datetime.strptime(tanggal, '%Y-%m-%d').strftime('%d-%m-%Y')
            except Exception:
                # Fallback if parsing fails
                formatted_date = str(tanggal)
                
            pdf.cell(40, 6, formatted_date, 1, 1, 'C')

        # Create a BytesIO object to hold the PDF data
        pdf_buffer = io.BytesIO()
        pdf_buffer.write(pdf.output(dest='S'))
        pdf_buffer.seek(0)
        
        # Return PDF as a response
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='daftar_siswa.pdf'
        )
    
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return f"Error generating PDF: {str(e)}", 500

@app.route('/edit_siswa/<id>', methods=['GET', 'POST'])
def edit_siswa(id):
    if request.method == 'POST':
        nama_lengkap = request.form['nama_lengkap']
        no_hp = request.form['no_hp']
        tanggal_lahir = request.form['tanggal_lahir']

        if database.update_mahasiswa(id, nama_lengkap, no_hp, tanggal_lahir):
            return redirect(url_for('index', status='updated'))
        else:
            return "Error updating data. Please check server logs.", 500
    
    # GET request - show the edit form with current data
    student = database.get_mahasiswa_by_id(id)
    if student:
        return render_template('edit_siswa.html', student=student)
    else:
        return "Student not found", 404

@app.route('/hapus_siswa', methods=['POST'])
def hapus_siswa():
    id = request.form['id']
    if database.delete_mahasiswa(id):
        return redirect(url_for('index', status='deleted'))
    else:
        return "Error deleting data. Please check server logs.", 500

if __name__ == '__main__':
    # Use environment variable for port (Hugging Face default is 7860)
    port = int(os.environ.get('PORT', 7860))
    # Run the Flask app
    app.run(host='0.0.0.0', port=port, debug=True) # Set debug=False for production