const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

// Create a new rental
router.post('/create', rentalController.createRental);

// Get all rentals
router.get('/all', rentalController.getAllRentals);

// Get rental by ID
router.get('/:rentalId', rentalController.getRentalById);

// Update rental (e.g., return a rented product)
router.put('/:rentalId/update', rentalController.updateRental);

module.exports = router;
