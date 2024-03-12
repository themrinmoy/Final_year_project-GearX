const express = require('express');
const router = express.Router();
//const productController = require('../controllers/productsController');
const productController = require('../controllers/product')

router.get('/', (req, res, next) => {
    res.render('shop/index', { pageTitle: 'Home', path: '/'});
});

// router.get('/rent', productController.productsByType);

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
    res.render('user/order', { pageTitle: 'Order' , path: '/order'});
});
router.get('/about', (req, res, next) => {
    res.render('shop/about', { pageTitle: 'About' , path: '/about'});
});
 router.get('/contact', (req, res, next) => {
    res.render('shop/contact', { pageTitle: 'Contact', path: '/contact' });
}); router.get('/favorites', (req, res, next) => {
    res.render('user/favorites', { pageTitle: 'Favorites', path: '/favorites' });
});


// Removing a Product from Cart
// app.post('/cart/remove', CartController.removeFromCart);



module.exports = router;