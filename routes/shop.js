const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController')
// const productController = require('../controllers/productsController.js');
// const ProductController = require('../controllers/productsController')


router.get('/', (req, res, next) => {
    res.render('shop/index', { pageTitle: 'Home' });
});

router.get('/rent', productController.productsByType);

router.get('/products', productController.productsByCategory);
router.get('/products/:productId', productController.productDetails);

// router.get('/rent', productController.productController);

// router.get('/products', ProductController.productsByCategory);
// router.get('/products/:productId', ProductController.productDetails);

// router.get('/products/category/:category', productController.productsByCategory);
router.get('/products/category/:category', productController.productsByCategory);


// router.get('/products:productId', (req, res, next) => {
//     res.send('product-detail');
// });
router.get('/order', (req, res, next) => {
    res.render('user/order', { pageTitle: 'Order' });
});
router.get('/about', (req, res, next) => {
    res.render('shop/about', { pageTitle: 'About' });
});
 router.get('/contact', (req, res, next) => {
    res.render('shop/contact', { pageTitle: 'Contact' });
}); router.get('/favorites', (req, res, next) => {
    res.render('user/favorites', { pageTitle: 'Favorites' });
});


// Removing a Product from Cart
// app.post('/cart/remove', CartController.removeFromCart);



module.exports = router;