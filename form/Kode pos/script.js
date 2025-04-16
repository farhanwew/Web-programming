const apiBase = 'https://alamat.thecloudalert.com/api';

      document.getElementById('mode').addEventListener('change', function() {
        if (this.value === 'daerah') {
          document.getElementById('form-daerah').style.display = 'block';
          document.getElementById('form-kodepos').style.display = 'none';
        } else {
          document.getElementById('form-daerah').style.display = 'none';
          document.getElementById('form-kodepos').style.display = 'block';
        }
        document.getElementById('hasil').innerHTML = '';
      });

      async function fetchData(endpoint) {
        try {
          const response = await fetch(`${apiBase}/${endpoint}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data.result;
        } catch (error) {
          console.error('Fetch error:', error);
          document.getElementById('hasil').innerHTML = `<div class="error">Terjadi kesalahan saat mengambil data: ${error.message}</div>`;
          return [];
        }
      }

      function showLoading(elementId) {
        const element = document.getElementById(elementId);
        const loadingSpan = document.createElement('span');
        loadingSpan.className = 'loading';
        loadingSpan.id = `${elementId}-loading`;
        loadingSpan.textContent = 'Memuat data...';
        
        // Remove any existing loading indicator
        const existingLoading = document.getElementById(`${elementId}-loading`);
        if (existingLoading) {
          existingLoading.remove();
        }
        
        element.parentNode.insertBefore(loadingSpan, element.nextSibling);
      }

      function hideLoading(elementId) {
        const loadingElement = document.getElementById(`${elementId}-loading`);
        if (loadingElement) {
          loadingElement.remove();
        }
      }

      async function populateSelect(id, data, placeholder = '') {
        const select = document.getElementById(id);
        select.innerHTML = '';
        
        if (placeholder) {
          const option = document.createElement('option');
          option.value = '';
          option.text = placeholder;
          select.add(option);
        }
        
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.text = item.text;
          select.add(option);
        });
        
        select.disabled = data.length === 0;
      }

      function resetDropdown(id, placeholder) {
        const select = document.getElementById(id);
        select.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = placeholder;
        select.add(option);
        select.disabled = true;
      }

      async function init() {
        try {
          showLoading('provinsi');
          const provinsi = await fetchData('provinsi/get');
          populateSelect('provinsi', provinsi, '-- Pilih Provinsi --');
          hideLoading('provinsi');
        } catch (error) {
          console.error('Initialization error:', error);
          document.getElementById('hasil').innerHTML = '<div class="error">Gagal memuat data provinsi.</div>';
          hideLoading('provinsi');
        }
      }

      document.getElementById('provinsi').addEventListener('change', async function() {
        // Reset dependent dropdowns
        resetDropdown('kabupaten', '-- Pilih Kabupaten/Kota --');
        resetDropdown('kecamatan', '-- Pilih Kecamatan --');
        resetDropdown('kelurahan', '-- Pilih Kelurahan/Desa --');
        
        if (!this.value) return;
        
        try {
          showLoading('kabupaten');
          const kabupaten = await fetchData(`kabkota/get/?d_provinsi_id=${this.value}`);
          populateSelect('kabupaten', kabupaten, '-- Pilih Kabupaten/Kota --');
          hideLoading('kabupaten');
        } catch (error) {
          console.error('Kabupaten fetch error:', error);
          hideLoading('kabupaten');
        }
      });

      document.getElementById('kabupaten').addEventListener('change', async function() {
        // Reset dependent dropdowns
        resetDropdown('kecamatan', '-- Pilih Kecamatan --');
        resetDropdown('kelurahan', '-- Pilih Kelurahan/Desa --');
        
        if (!this.value) return;
        
        try {
          showLoading('kecamatan');
          const kecamatan = await fetchData(`kecamatan/get/?d_kabkota_id=${this.value}`);
          populateSelect('kecamatan', kecamatan, '-- Pilih Kecamatan --');
          hideLoading('kecamatan');
        } catch (error) {
          console.error('Kecamatan fetch error:', error);
          hideLoading('kecamatan');
        }
      });

      document.getElementById('kecamatan').addEventListener('change', async function() {
        // Reset kelurahan dropdown
        resetDropdown('kelurahan', '-- Pilih Kelurahan/Desa --');
        
        if (!this.value) return;
        
        try {
          showLoading('kelurahan');
          const kelurahan = await fetchData(`kelurahan/get/?d_kecamatan_id=${this.value}`);
          populateSelect('kelurahan', kelurahan, '-- Pilih Kelurahan/Desa --');
          hideLoading('kelurahan');
        } catch (error) {
          console.error('Kelurahan fetch error:', error);
          hideLoading('kelurahan');
        }
      });

      document.getElementById('cari-daerah').addEventListener('click', async function() {
    const kabupatenId = document.getElementById('kabupaten').value;
    const kecamatanId = document.getElementById('kecamatan').value;
    const hasilDiv = document.getElementById('hasil');

    if (!kabupatenId || !kecamatanId) {
        hasilDiv.innerHTML = '<div class="error">Silakan pilih Kabupaten/Kota dan Kecamatan terlebih dahulu.</div>';
        return;
    }

    try {
        hasilDiv.innerHTML = '<div class="loading">Mencari kode pos...</div>';

        // Use the correct API endpoint for postal code search
        const kodeposData = await fetchData(`kodepos/get/?d_kabkota_id=${kabupatenId}&d_kecamatan_id=${kecamatanId}`);

        if (!kodeposData || kodeposData.length === 0) {
            hasilDiv.innerHTML = '<div class="error">Kode Pos tidak ditemukan untuk daerah yang dipilih.</div>';
            return;
        }

        const provinsiText = document.getElementById('provinsi').options[document.getElementById('provinsi').selectedIndex].text;
        const kabupatenText = document.getElementById('kabupaten').options[document.getElementById('kabupaten').selectedIndex].text;
        const kecamatanText = document.getElementById('kecamatan').options[document.getElementById('kecamatan').selectedIndex].text;

        let resultsHtml = '<div class="results">';
        kodeposData.forEach((kp, index) => {
            resultsHtml += `
                <div class="result-item">
                    <h3>Hasil ${index + 1}</h3>
                    <ul>
                        <li><strong>Kode Pos:</strong> ${kp.text}</li>
                        <li><strong>Provinsi:</strong> ${provinsiText}</li>
                        <li><strong>Kabupaten/Kota:</strong> ${kabupatenText}</li>
                        <li><strong>Kecamatan:</strong> ${kecamatanText}</li>
                    </ul>
                </div>
            `;
        });
        resultsHtml += '</div>';
        hasilDiv.innerHTML = resultsHtml;

    } catch (error) {
        console.error('Kode pos search error:', error);
        hasilDiv.innerHTML = `
            <div class="error">
                Terjadi kesalahan saat mencari kode pos: ${error.message}
                <br>
                Silakan coba lagi atau hubungi administrator.
            </div>`;
    }
});

      
function searchByArea() {
    const provinsi = document.getElementById('provinsi').value;
    const kabupaten = document.getElementById('kabupaten').value;
    const kecamatan = document.getElementById('kecamatan').value;
    const kelurahan = document.getElementById('kelurahan').value;
    const hasilDiv = document.getElementById('hasil');

    // Create a unique key combining all location details
    const searchKey = `${provinsi}-${kabupaten}-${kecamatan}-${kelurahan}`.toLowerCase();
    
    fetch('kodepos.json')
        .then(response => response.json())
        .then(data => {
            const results = data.filter(item => {
                const itemKey = `${item.province}-${item.city}-${item.district}-${item.subdistrict}`.toLowerCase();
                return itemKey === searchKey;
            });

            if (results.length > 0) {
                const resultHTML = results.map(item => `
                    <div class="result-item">
                        <h3>Kode Pos: ${item.postal_code}</h3>
                        <p>Provinsi: ${item.province}</p>
                        <p>Kabupaten/Kota: ${item.city}</p>
                        <p>Kecamatan: ${item.district}</p>
                        <p>Kelurahan/Desa: ${item.subdistrict}</p>
                    </div>
                `).join('');
                hasilDiv.innerHTML = resultHTML;
            } else {
                hasilDiv.innerHTML = '<p class="error">Data tidak ditemukan</p>';
            }
        })
        .catch(error => {
            hasilDiv.innerHTML = '<p class="error">Terjadi kesalahan saat mengambil data</p>';
            console.error('Error:', error);
        });
}

      document.getElementById('cari-kodepos').addEventListener('click', async function() {
    const kodepos = document.getElementById('input-kodepos').value.trim();
    const hasilDiv = document.getElementById('hasil');
    
    // Validate postal code format (5 digits)
    if (!kodepos || !/^\d{5}$/.test(kodepos)) {
        hasilDiv.innerHTML = '<div class="error">Masukkan kode pos yang valid (5 digit angka).</div>';
        return;
    }
    
    try {
        hasilDiv.innerHTML = '<div class="loading">Mencari informasi daerah...</div>';
        const response = await fetch(`${apiBase}/cari/index/?keyword=${kodepos}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
            // Create a Map to store unique locations
            const uniqueLocations = new Map();
            
            data.result.forEach(item => {
                const key = `${item.kecamatan}-${item.kabkota}-${item.provinsi}`;
                if (!uniqueLocations.has(key)) {
                    uniqueLocations.set(key, {
                        kecamatan: item.kecamatan,
                        kabkota: item.kabkota,
                        provinsi: item.provinsi,
                        desa: new Set()
                    });
                }
                uniqueLocations.get(key).desa.add(item.desakel);
            });

            let resultsHtml = '<div class="results">';
            [...uniqueLocations.values()].forEach((location, index) => {
                resultsHtml += `
                    <div class="result-item">
                        <h3>Lokasi ${index + 1}</h3>
                        <ul>
                            <li><strong>Kode Pos:</strong> ${kodepos}</li>
                            <li><strong>Provinsi:</strong> ${location.provinsi || '-'}</li>
                            <li><strong>Kabupaten/Kota:</strong> ${location.kabkota || '-'}</li>
                            <li><strong>Kecamatan:</strong> ${location.kecamatan || '-'}</li>
                            <li><strong>Desa/Kelurahan:</strong> ${[...location.desa].join(', ') || '-'}</li>
                        </ul>
                    </div>
                `;
            });
            resultsHtml += '</div>';
            hasilDiv.innerHTML = resultsHtml;
        } else {
            hasilDiv.innerHTML = '<div class="error">Kode pos tidak ditemukan.</div>';
        }
    } catch (error) {
        console.error('Search error:', error);
        hasilDiv.innerHTML = '<div class="error">Terjadi kesalahan saat mencari data. Silakan coba lagi.</div>';
    }
});

      init();