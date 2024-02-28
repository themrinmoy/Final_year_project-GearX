// Navbar JavaScript


// Banner JavaScript
const slides = document.querySelectorAll('.banner-slide');
const prevBtn = document.querySelector('.banner-prev');
const nextBtn = document.querySelector('.banner-next');
let currentSlide = 0; 

function showSlide(slideIndex) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideIndex].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);




