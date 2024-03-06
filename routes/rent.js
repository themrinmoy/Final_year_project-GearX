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




router.post('/update-date-range', async (req, res) => {
    try {
        console.log('Updating date range:', req.body.startDate, req.body.endDate);

        // Get the user from the session or request
        const user = req.user; // You might need to adjust this based on your authentication setup

        // Update the rental cart date range in the user model
        user.rentalCart.StartDate = new Date(req.body.startDate);
        user.rentalCart.EndDate = new Date(req.body.endDate);

        // Save the user model to update the database
        await user.save();

        // Redirect or send a response as needed
        res.redirect('/rent/cart'); // Redirect to the cart page or update the page content
    } catch (error) {
        console.error('Error updating date range:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/remove-from-cart', async (req, res) => {
    try {
        // Extract the product ID from the request body
        // const { productId } = ;

        const prodId = req.body.productId;
        req.user.removeFromRentalCart(prodId)
            .then(result => {
                res.redirect('/rent/cart')
            })
            .catch(err => {
                console.log(err);
            });

    } catch (error) {
        console.error('Error removing product from rental cart:', error);
        res.status(500).send('Internal Server Error');
    }

});

module.exports = router;
