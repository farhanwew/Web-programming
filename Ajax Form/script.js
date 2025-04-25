$(document).ready(function() {
    $('#ajaxForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Debug: log form data
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        // Show loading
        $('#loading').show();
        
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Show success message
                $('#response')
                    .removeClass('error')
                    .addClass('success')
                    .html('<strong>Sukses!</strong> Data berhasil dikirim.')
                    .show();
                
                // Reset form
                $('#ajaxForm')[0].reset();
                
                // Log response
                console.log('Respon dari server:', response);
            },
            error: function(xhr, status, error) {
                // Show error message
                $('#response')
                    .removeClass('success')
                    .addClass('error')
                    .html('<strong>Error!</strong> ' + error)
                    .show();
                
                console.error('Error:', error);
            },
            complete: function() {
                // Hide loading
                $('#loading').hide();
            }
        });
    });
});