## Deskripsi
Implementasi form sederhana menggunakan AJAX dengan Fetch API untuk pengiriman data secara asynchronous.

## Struktur Proyek
```text
├── index.html (HTML, CSS, dan JavaScript)
└── README.md
```

## Fitur Utama
- Form validasi client-side
- Pengiriman data asynchronous dengan AJAX
- Indikator loading
- Feedback sukses/error

## Elemen Koding Penting

### 1. HTML Form Structure
```html
<form id="ajaxForm">
    <div class="form-group">
        <label for="nama">Nama:</label>
        <input type="text" id="nama" name="nama" required>
    </div>
    <!-- Input email dan pesan -->
</form>
```

### 2. Event Listener dan Pengambilan Data
```javascript
document.getElementById('ajaxForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const formData = new FormData(form);
});
```

### 3. Implementasi AJAX dengan Fetch API
```javascript
fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: formData
})
```

### 4. Penanganan Response
```javascript
.then(response => {
    if (!response.ok) {
        throw new Error('Response tidak valid');
    }
    return response.json();
})
.then(data => {
    responseElement.className = 'success';
    responseElement.innerHTML = '<strong>Sukses!</strong> Data berhasil dikirim.';
    form.reset();
})
```

### 5. Error Handling
```javascript
.catch(error => {
    responseElement.className = 'error';
    responseElement.innerHTML = '<strong>Error!</strong> ' + error.message;
    responseElement.style.display = 'block';
})
```

## Cara Penggunaan
1. Buka index.html di browser
2. Isi form dengan data yang valid:
   - Nama
   - Email
   - Pesan
3. Klik tombol "Kirim"
4. Perhatikan indikator loading dan pesan response


## Notes
- Menggunakan endpoint demo: `jsonplaceholder.typicode.com/posts`
- Validasi form menggunakan HTML5 validation

