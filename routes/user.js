const express = require('express');

const router = express.Router();

const rentalController = require('../controllers/rentalController');

// GET /users
router.get('/', (req, res) => {
    // Logic to fetch all users from the database
    // Send the users as a response
});

// GET /users/:id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to fetch a specific user by ID from the database
    // Send the user as a response
});

// POST /users
router.post('/', (req, res) => {
    // Logic to create a new user based on the request body
    // Send the created user as a response
});

// PUT /users/:id
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to update a specific user by ID based on the request body
    // Send the updated user as a response
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to delete a specific user by ID from the database
    // Send a success message as a response
});

router.get('/user/rentals', rentalController.getRentedItemsByUser);

module.exports = router;