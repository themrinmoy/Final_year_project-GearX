const express = require('express');
const ProductController = require('../controllers/ProductsController');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('index');
});
router.get('/shop', (req, res, next) => {
    // res.render('index');
    // res.render('shop');
    res.send('shop');
});

router.get('/cart', (req, res, next) => {
    res.send('cart');
});

router.get('/checkout', (req, res, next) => {
    res.send('checkout');
});

router.get('/orders', (req, res, next) => {
    res.send('orders');
});

// router.get('/products', (req, res, next) => {
//     res.send('products');
// });
// router.get('/products', ProductController.index);
router.get('/products', ProductController.indexByCategory);
router.get('/products/:productId', ProductController.show);

router.get('/products/category/:category', ProductController.indexByCategory);


// router.get('/products:productId', (req, res, next) => {
//     res.send('product-detail');
// });


// Removing a Product from Cart
// app.post('/cart/remove', CartController.removeFromCart);



module.exports = router;