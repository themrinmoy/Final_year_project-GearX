const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductsController');


router.get('/', (req, res, next) => {
    res.render('shop/index', { pageTitle: 'Home' });
});
router.get('/shop', (req, res, next) => {
    // res.render('index');
    // res.render('shop');
    res.send('shop');
});

// router.get('/cart', (req, res, next) => {
//     res.send('cart');
// });

// router.get('/checkout', (req, res, next) => {
//     res.send('checkout');
// });

// router.get('/orders', (req, res, next) => {
//     res.send('orders');
// });

// router.get('/products', (req, res, next) => {
//     res.send('products');
// });
// router.get('/products', ProductController.index);
router.get('/products', ProductController.productsByCategory);
router.get('/products/:productId', ProductController.productDetails);

router.get('/products/category/:category', ProductController.productsByCategory);


// router.get('/products:productId', (req, res, next) => {
//     res.send('product-detail');
// });


// Removing a Product from Cart
// app.post('/cart/remove', CartController.removeFromCart);



module.exports = router;