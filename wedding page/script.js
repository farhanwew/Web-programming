document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const openingScreen = document.getElementById('opening-screen');
    const enterBtn = document.getElementById('enter-btn');
    const navMenu = document.querySelector('.nav-menu');

    // Add no-scroll class when page loads
    document.body.classList.add('no-scroll');

    enterBtn.addEventListener('click', function() {
        openingScreen.style.display = 'none';
        document.body.classList.remove('no-scroll');
        // Show the nav menu
        navMenu.classList.add('visible');
    });
});


const weddingDate = new Date('June 29, 2025 08:00:00').getTime();
const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
    document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
}, 1000);


