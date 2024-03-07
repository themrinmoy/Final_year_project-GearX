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


