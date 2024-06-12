const express = require('express');
const router = express.Router();
//const productController = require('../controllers/productsController');
const productController = require('../controllers/product')
const checkoutController = require('../controllers/checkoutController');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const bodyParser = require('body-parser');

// const endpointSecret = 'whsec_2c7f7301b37f8460085c4ff69c06a36c660046820ec6f8d0c4c4ac7b8d2456de';
// const endpointSecret = 'we_1PQzFVSJMzEXtTp5Uk4SqRCZ';
// create a env
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_2c7f7301b37f8460085c4ff69c06a36c660046820ec6f8d0c4c4ac7b8d2456de';
// const endpointSecret = '';

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await handlePaymentIntentSucceeded(paymentIntent);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
});

async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        // Update order status to 'paid'
        await Order.updateOne({ sessionId: paymentIntent.id }, { paymentStatus: 'Paid', status: 'Processing' });
        console.log('PaymentIntent was successful and order status updated!');
    } catch (error) {
        console.error('Error updating order:', error);
    }
}



router.get('/', (req, res, next) => {

    const bodyParser = require('body-parser');


    res.render('shop/index', { pageTitle: 'Home', path: '/', });
});
router.get('/products', productController.productsByCategory);
router.get('/products/:productId', productController.productDetails);


router.get('/products/category/:category', productController.productsByCategory);


router.get('/order', (req, res, next) => {


    res.redirect('/user/orders');
});
router.get('/about', (req, res, next) => {
    res.render('shop/about', { pageTitle: 'About', path: '/about' });
});

router.get('/favorites', (req, res, next) => {


    res.render('user/favorites', {
        pageTitle: 'Favorites', path: '/favorites'

    });
});


// router.get('/test-order2', checkoutController.getShopCheckoutSuccessTest);




// for payment integration

router.get('/shop/checkout', checkoutController.getCheckout);

// router.post('/shop/checkout', productController.postCheckout);

router.get('/shop/checkout/success', checkoutController.getShopCheckoutSuccess);

router.get('/shop/checkout/cancel', checkoutController.getShopCheckoutCancel);



module.exports = router;