const express = require('express');

const router = express.Router();

const rentalController = require('../controllers/rentalController');

const userController = require('../controllers/userController');

const Order = require('../models/Order');

// GET /users
router.get('/profile', userController.userProfile);

// GET /users/:id
router.get('/favorites', (req, res, next) => {


    res.render('user/favorites', {
        pageTitle: 'Favorites', path: '/favorites'

    });
});


router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('products.product')
            // .exec( );


            // console.log(orders);
        // show me the products in the order
        console.log(orders[1].products[0]);
        res.render('user/order', {
        // res.render('user/orderStatic', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        });
    } catch (err) {
        console.error(err);
        res.redirect(`/?error=${err.message}`)
    }
});

router.get('/rentals',  rentalController.getRentedItemsByUser);

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