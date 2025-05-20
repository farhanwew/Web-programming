const API_URL = 'http://localhost:8000';

// Element references
const mainContent = document.getElementById('main-content');
const daftarBaruLink = document.getElementById('daftar-baru');
const lihatPendaftarLink = document.getElementById('lihat-pendaftar');

// Event listeners for navigation
daftarBaruLink.addEventListener('click', showForm);
lihatPendaftarLink.addEventListener('click', showList);

// Load form content
function showForm() {
    fetch('form.html')
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            
            // Setup form submission after form is loaded
            const form = document.getElementById('mahasiswa-form');
            const formMessage = document.getElementById('form-message');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const mahasiswaData = {
                    nama: document.getElementById('nama').value,
                    alamat: document.getElementById('alamat').value,
                    jenis_kelamin: document.querySelector('input[name="jenis_kelamin"]:checked').value,
                    prodi: document.getElementById('prodi').value
                };
                
                // Send data to API
                fetch(`${API_URL}/mahasiswa`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mahasiswaData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Gagal menambahkan data');
                    }
                    return response.json();
                })
                .then(data => {
                    formMessage.textContent = 'Data berhasil ditambahkan!';
                    formMessage.className = 'message success';
                    form.reset();
                    
                    // Redirect to list after 2 seconds
                    setTimeout(() => {
                        showList();
                    }, 2000);
                })
                .catch(error => {
                    formMessage.textContent = error.message;
                    formMessage.className = 'message error';
                });
            });
        })
        .catch(error => {
            mainContent.innerHTML = `<p>Error loading form: ${error.message}</p>`;
        });
}

// Load list content
function showList() {
    fetch('list.html')
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            
            // Setup elements after list is loaded
            const tambahBaruLink = document.getElementById('tambah-baru');
            const mahasiswaList = document.getElementById('mahasiswa-list');
            const listMessage = document.getElementById('list-message');
            const editModal = document.getElementById('edit-modal');
            const closeBtn = document.querySelector('.close');
            const editForm = document.getElementById('edit-form');
            
            // Add new student link
            tambahBaruLink.addEventListener('click', showForm);
            
            // Close modal
            closeBtn.addEventListener('click', () => {
                editModal.style.display = 'none';
            });
            
            // Click outside to close modal
            window.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    editModal.style.display = 'none';
                }
            });
            
            // Fetch and display mahasiswa list
            fetchAndDisplayMahasiswa();
            
            // Handle edit form submission
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const mahasiswaId = document.getElementById('edit-id').value;
                const updatedData = {
                    nama: document.getElementById('edit-nama').value,
                    alamat: document.getElementById('edit-alamat').value,
                    jenis_kelamin: document.querySelector('input[name="edit_jenis_kelamin"]:checked').value,
                    prodi: document.getElementById('edit-prodi').value
                };
                
                // Send update to API
                fetch(`${API_URL}/mahasiswa/${mahasiswaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Gagal mengupdate data');
                    }
                    return response.json();
                })
                .then(data => {
                    editModal.style.display = 'none';
                    listMessage.textContent = 'Data berhasil diupdate!';
                    listMessage.className = 'message success';
                    
                    // Refresh the list
                    fetchAndDisplayMahasiswa();
                    
                    // Hide message after 3 seconds
                    setTimeout(() => {
                        listMessage.style.display = 'none';
                    }, 3000);
                })
                .catch(error => {
                    listMessage.textContent = error.message;
                    listMessage.className = 'message error';
                });
            });
            
            // Function to fetch and display mahasiswa list
            function fetchAndDisplayMahasiswa() {
                fetch(`${API_URL}/mahasiswa`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Gagal mengambil data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        mahasiswaList.innerHTML = '';
                        
                        if (data.length === 0) {
                            mahasiswaList.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada data mahasiswa</td></tr>`;
                            return;
                        }
                        
                        data.forEach((mahasiswa, index) => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${index + 1}</td>
                                <td>${mahasiswa.nama}</td>
                                <td>${mahasiswa.alamat}</td>
                                <td>${mahasiswa.jenis_kelamin}</td>
                                <td>${mahasiswa.prodi}</td>
                                <td class="action-buttons">
                                    <button class="edit-btn" data-id="${mahasiswa.id}">Edit</button>
                                    <button class="delete-btn" data-id="${mahasiswa.id}">Hapus</button>
                                </td>
                            `;
                            mahasiswaList.appendChild(row);
                        });
                        
                        // Setup edit buttons
                        document.querySelectorAll('.edit-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                const mahasiswaId = this.getAttribute('data-id');
                                editMahasiswa(mahasiswaId);
                            });
                        });
                        
                        // Setup delete buttons
                        document.querySelectorAll('.delete-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                const mahasiswaId = this.getAttribute('data-id');
                                deleteMahasiswa(mahasiswaId);
                            });
                        });
                    })
                    .catch(error => {
                        listMessage.textContent = error.message;
                        listMessage.className = 'message error';
                    });
            }
            
            // Function to edit mahasiswa
            function editMahasiswa(id) {
                fetch(`${API_URL}/mahasiswa/${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Gagal mengambil data');
                        }
                        return response.json();
                    })
                    .then(mahasiswa => {
                        document.getElementById('edit-id').value = mahasiswa.id;
                        document.getElementById('edit-nama').value = mahasiswa.nama;
                        document.getElementById('edit-alamat').value = mahasiswa.alamat;
                        
                        if (mahasiswa.jenis_kelamin === 'Laki-laki') {
                            document.getElementById('edit-laki').checked = true;
                        } else {
                            document.getElementById('edit-perempuan').checked = true;
                        }
                        
                        document.getElementById('edit-prodi').value = mahasiswa.prodi;
                        
                        // Show modal
                        editModal.style.display = 'block';
                    })
                    .catch(error => {
                        listMessage.textContent = error.message;
                        listMessage.className = 'message error';
                    });
            }
            
            // Function to delete mahasiswa
            function deleteMahasiswa(id) {
                if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                    fetch(`${API_URL}/mahasiswa/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Gagal menghapus data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        listMessage.textContent = 'Data berhasil dihapus!';
                        listMessage.className = 'message success';
                        
                        // Refresh the list
                        fetchAndDisplayMahasiswa();
                        
                        // Hide message after 3 seconds
                        setTimeout(() => {
                            listMessage.style.display = 'none';
                        }, 3000);
                    })
                    .catch(error => {
                        listMessage.textContent = error.message;
                        listMessage.className = 'message error';
                    });
                }
            }
        })
        .catch(error => {
            mainContent.innerHTML = `<p>Error loading list: ${error.message}</p>`;
        });
}

// Initial load - show welcome message
document.addEventListener('DOMContentLoaded', function() {
    // Optional: Auto-load either form or list instead of welcome message
    // showForm(); // or showList();
});
