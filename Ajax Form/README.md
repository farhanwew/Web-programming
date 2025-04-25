## Deskripsi
Implementasi form sederhana menggunakan jQuery AJAX untuk pengiriman data secara asynchronous.

## Struktur Proyek
```text
├── index.html (HTML, CSS, dan jQuery)
└── README.md
```

## Features
- Form validasi client-side
- Pengiriman data asynchronous dengan jQuery AJAX
- Indikator loading
- Feedback sukses/error
- Penanganan FormData

## Elemen Koding Penting

### 1. HTML Form Structure dan jQuery CDN
```html
<!-- jQuery CDN -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

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
$(document).ready(function() {
    $('#ajaxForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
    });
});
```

### 3. Implementasi jQuery AJAX
```javascript
$.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
        // Handle success
    },
    error: function(xhr, status, error) {
        // Handle error
    },
    complete: function() {
        // Handle completion
    }
});
```

### 4. Penanganan Response
```javascript
success: function(response) {
    $('#response')
        .removeClass('error')
        .addClass('success')
        .html('<strong>Sukses!</strong> Data berhasil dikirim.')
        .show();
    
    $('#ajaxForm')[0].reset();
}
```

### 5. Error Handling
```javascript
error: function(xhr, status, error) {
    $('#response')
        .removeClass('success')
        .addClass('error')
        .html('<strong>Error!</strong> ' + error)
        .show();
}
```


## Notes
- Menggunakan endpoint demo: `jsonplaceholder.typicode.com/posts`
- Validasi form menggunakan HTML5 validation

