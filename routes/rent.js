const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const productController = require('../controllers/productsController')


// Create a new rental
// rent
router.get('/', rentalController.getAllRentals);
//rental cart

// router.get('/cart', rentalController.getRentalCart);

router.post('/create', rentalController.createRental);

// Get all rentals
router.get('/all', rentalController.getAllRentals);

// Get rental by ID
router.get('/:rentalId', rentalController.getRentalById);

// Update rental (e.g., return a rented product)
router.put('/:rentalId/update', rentalController.updateRental);

module.exports = router;
