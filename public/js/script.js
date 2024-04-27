// Navbar JavaScript


// Banner JavaScript
// const slides = document.querySelectorAll('.banner-slide');
// const prevBtn = document.querySelector('.banner-prev');
// const nextBtn = document.querySelector('.banner-next');
// let currentSlide = 0; 

// function showSlide(slideIndex) {
//     slides.forEach(slide => slide.classList.remove('active'));
//     slides[slideIndex].classList.add('active');
// }

// function nextSlide() {
//     currentSlide = (currentSlide + 1) % slides.length;
//     showSlide(currentSlide);
// }

// function prevSlide() {
//     currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//     showSlide(currentSlide);
// }

// prevBtn.addEventListener('click', prevSlide);
// nextBtn.addEventListener('click', nextSlide);

// Banner JavaScript end 


// new banner JavaScript
const slides = document.querySelectorAll('.banner-slide');
const prevBtn = document.querySelector('.banner-prev');
const nextBtn = document.querySelector('.banner-next');
const bannerContainer = document.querySelector('.banner-container');
let currentSlide = 0;

function showSlide(slideIndex) {
    // Calculate the left position based on the slide index
    const leftPosition = `-${slideIndex * 100}%`;
    bannerContainer.style.left = leftPosition;

    // Update the active slide class
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

// Automatically transition to the next slide every 5 seconds
let slideInterval = setInterval(nextSlide, 3000);

// Pause the automatic slideshow when interacting with navigation buttons
prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
});

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
});

// Restart the automatic slideshow after a manual interaction
function restartSlideShow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}





// new banner JavaScript end

// your-custom-script.js

// your-custom-script.js

// document.addEventListener('DOMContentLoaded', function () {
//     // Initialize Stripe.js with your publishable key
//     const stripe = Stripe('your_publishable_key'); // Replace with your actual publishable key

//     const checkoutButton = document.querySelector('.proceed-btn');

//     checkoutButton.addEventListener('click', function () {
//         // Create a PaymentIntent on your server and receive a client_secret
//         fetch('/create-payment-intent', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 items: yourCartItems, // Replace with your actual cart items
//             }),
//         })
//         .then(response => response.json())
//         .then(data => {
//             return stripe.confirmCardPayment(data.clientSecret, {
//                 payment_method: {
//                     card: stripe.elements.getElement('card'),
//                 },
//             });
//         })
//         .then(result => {
//             if (result.error) {
//                 // Show error to your customer (e.g., insufficient funds)
//                 console.error(result.error.message);
//             } else {
//                 // The payment has been processed!
//                 if (result.paymentIntent.status === 'succeeded') {
//                     // Redirect to a success page or perform any other success actions
//                     window.location.href = '/success'; // Replace with your success page
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });
// });


