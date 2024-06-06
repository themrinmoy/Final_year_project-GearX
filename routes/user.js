const express = require('express');

const router = express.Router();

const rentalController = require('../controllers/rentalController');

const userController = require('../controllers/userController');

// GET /users
router.get('/profile', userController.userProfile);

// GET /users/:id
router.get('/favorites', (req, res, next) => {
    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;

    res.render('user/favorites', {
        pageTitle: 'Favorites', path: '/favorites',
        username: username, profilePic: profilePic

    });
});


router.get('/orders', (req, res, next) => {

    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;

    res.render('user/order', {
        pageTitle: 'Order', path: '/order',
        username: username, profilePic: profilePic
    });
});

router.get('/rentals', rentalController.getRentedItemsByUser);

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