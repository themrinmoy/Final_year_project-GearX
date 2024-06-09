const express = require('express');
const router = express.Router();
//const productController = require('../controllers/productsController');
const productController = require('../controllers/product')
const checkoutController = require('../controllers/checkoutController');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')


router.get('/', (req, res, next) => {
    

    res.render('shop/index', { pageTitle: 'Home', path: '/' });
});



router.get('/products', productController.productsByCategory);
router.get('/products/:productId', productController.productDetails);


router.get('/products/category/:category', productController.productsByCategory);


router.get('/order', (req, res, next) => {

    

    res.render('user/order', {
        pageTitle: 'Order', path: '/order',
         
    });
});
router.get('/about', (req, res, next) => {
    res.render('shop/about', { pageTitle: 'About', path: '/about' });
});

router.get('/favorites', (req, res, next) => {
    

    res.render('user/favorites', {
        pageTitle: 'Favorites', path: '/favorites'

    });
});




// for payment integration

router.get('/shop/checkout', checkoutController.getCheckout);

// router.post('/shop/checkout', productController.postCheckout);

router.get('/shop/checkout/success', checkoutController.getShopCheckoutSuccess);

router.get('/shop/checkout/cancel', checkoutController.getShopCheckoutCancel);



module.exports = router;