const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const productController = require('../controllers/productsController')


// Create a new rental
// rent
// Get all rentals
router.get('/', rentalController.getAllRentals);
//rental cart

router.get('/cart', rentalController.getRentalCart);
// Add to rental cart
router.post('/add-to-cart/:productId', rentalController.postRentalCart);
// router.post('/add-to-rent/', rentalController.postRentalCart);

router.post('/create', rentalController.createRental);

// router.get('/all', rentalController.getAllRentals);

// Get rental by ID
// router.get('/:rentalId', rentalController.getRentalById);

// Update rental (e.g., return a rented product)
// router.put('/:rentalId/update', rentalController.updateRental);

module.exports = router;
