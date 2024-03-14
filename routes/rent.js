const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const productController = require('../controllers/product')

const session = require('express-session');
const MongoStore = require('connect-mongo');
// const { check, validationResult } = require('express-validator');
const checkoutController = require('../controllers/checkoutController');
// const stripe = require('stripe')('your_secret_key');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')



// Create a new rental
// rent
// Get all rentals
router.get('/', rentalController.getAllRentals);
// router.get('/', rentalController.getRentalCart);
//rental cart

router.get('/cart', rentalController.getRentalCart);
// Add to rental cart
router.post('/add-to-cart/:productId', rentalController.postRentalCart);

// chekout
router.get('/checkout', rentalController.getRentChekout);

router.get('/checkout/success', rentalController.getRentCheckoutSuccess);
// router.get('/checkout/cancel', rentalController.getRentChekoutCancel);

router.get('/rentals', rentalController.getAllRentedItems);
router.get('/user/rentals', rentalController.getRentedItemsByUser);

// router.post('/add-to-rent/', rentalController.postRentalCart);

// router.post('/create', rentalController.createRental);

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


router.post('/create-payment-intent', async (req, res) => {
    try {
      const { items } = req.body;
  
      // Calculate the total amount based on your cart items
      const totalAmount = calculateTotalAmount(items);
  
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd', // Replace with your preferred currency
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Helper function to calculate the total amount
  function calculateTotalAmount(items) {
    // Calculate the total amount based on your cart items
    // Adjust this function based on your pricing logic
    const totalAmount = items.reduce((acc, item) => {
      return acc + item.quantity * item.productId.rentalInfo.rentalPricePerDay;
    }, 0);
  
    return totalAmount * 100; // Convert to cents (Stripe requires amounts in cents)
  }

module.exports = router;
