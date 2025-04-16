
// Data mapping mata kuliah ke dosen yang mengampu
const dosenPerMataKuliah = {
    "Algoritma dan Pemrograman": ["Dr. Ahmad Santoso, M.Kom", "Eko Nugroho, S.Kom, M.Sc"],
    "Struktur Data": ["Prof. Budi Raharjo, Ph.D", "Diana Pratiwi, M.T"],
    "Pemrograman Berorientasi Objek": ["Dr. Ahmad Santoso, M.Kom", "Eko Nugroho, S.Kom, M.Sc"],
    "Kalkulus": ["Prof. Budi Raharjo, Ph.D"],
    "Pembelajaran Mesin": ["Diana Pratiwi, M.T"],
    "Konsep Kecerdasan Buatan": ["Prof. Budi Raharjo, Ph.D", "Diana Pratiwi, M.T"],
    "Basis Data": ["Eko Nugroho, S.Kom, M.Sc"],
    "Pemrosesan Bahasa Natural": ["Diana Pratiwi, M.T"],
    "Sistem Operasi": ["Dr. Ahmad Santoso, M.Kom"],
    "Analisis dan Perancangan Sistem": ["Prof. Budi Raharjo, Ph.D", "Eko Nugroho, S.Kom, M.Sc"],
    "Rekayasa Perangkat Lunak": ["Dr. Ahmad Santoso, M.Kom", "Diana Pratiwi, M.T"],
    "Pemrograman Web": ["Eko Nugroho, S.Kom, M.Sc"]
};

// Event listener untuk perubahan mata kuliah
document.getElementById('mataKuliah').addEventListener('change', function() {
    const mataKuliah = this.value;
    const dosenSelect = document.getElementById('dosen');
    
    // Kosongkan opsi dosen sebelumnya
    dosenSelect.innerHTML = '<option value="">Pilih Dosen</option>';
    
    if (mataKuliah && dosenPerMataKuliah[mataKuliah]) {
        // Aktifkan dropdown dosen
        dosenSelect.disabled = false;
        
        // Tambahkan opsi dosen yang sesuai
        dosenPerMataKuliah[mataKuliah].forEach(dosen => {
            const option = document.createElement('option');
            option.value = dosen;
            option.textContent = dosen;
            dosenSelect.appendChild(option);
        });
    } else {
        // Nonaktifkan jika tidak ada mata kuliah yang dipilih
        dosenSelect.disabled = true;
    }
});

// ...existing code...

document.getElementById('registrasiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value.trim();
    const nim = document.getElementById('nim').value.trim();
    const prodi = document.getElementById('Prodi').value;
    const mataKuliah = document.getElementById('mataKuliah').value;
    const dosen = document.getElementById('dosen').value;
    
    // Check each field and show specific error messages
    if (!nama) {
        alert('Nama mahasiswa harus diisi!');
        document.getElementById('nama').focus();
        return;
    }
    
    if (!nim) {
        alert('NRP harus diisi!');
        document.getElementById('nim').focus();
        return;
    }

    // Validate NRP format (must be 10 digits)
    if (!/^\d{10}$/.test(nim)) {
        alert('NRP harus terdiri dari 10 digit angka!');
        document.getElementById('nim').focus();
        return;
    }

    if (!prodi) {
        alert('Program Studi harus dipilih!');
        document.getElementById('Prodi').focus();
        return;
    }
    
    if (!mataKuliah) {
        alert('Mata Kuliah harus dipilih!');
        document.getElementById('mataKuliah').focus();
        return;
    }
    
    if (!dosen) {
        alert('Dosen Pengampu harus dipilih!');
        document.getElementById('dosen').focus();
        return;
    }

    // If all validations pass, redirect to success page
    window.location.href = 'success.html';
});

// ...existing code...

// // Function to read names from file and set up autocomplete
// function setupAutocomplete() {
//     fetch('https://gist.githubusercontent.com/maulvi/e443e22b82a1dc24e14344b47f0a80ea/raw/b8465b38366622daad2d841054ad155d16c5c3a5/nama.txt')
//         .then(response => response.text())
//         .then(data => {
//             const namaMahasiswa = data.split('\n').filter(name => name.trim());
//             $("#nama").autocomplete({
//                 source: namaMahasiswa,
//                 minLength: 1
//             });
//         })
//         .catch(error => {
//             console.error('Error loading names:', error);
//             // Fallback to empty array if file can't be loaded
//             $("#nama").autocomplete({
//                 source: [],
//                 minLength: 1
//             });
//         });
// }


$(document).ready(function() {
    const namaMahasiswa = [
        "Ahmad Farhan",
        "Budi Santoso",
        "Clara Wijaya",
        "Dewi Putri",
        "Erik Pratama",
        "Fitri Handayani",
        "Gandhi Putra",
        "Hana Kusuma",
    ];

    $("#nama").autocomplete({
        source: namaMahasiswa,
        minLength: 1
    });
});

// Initialize autocomplete when document is ready
$(document).ready(setupAutocomplete);
