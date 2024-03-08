// routes/cart.js

const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');

const cartController = require('../controllers/cart');



// app.get('/protected-route', isAuthenticated, (req, res) => {
//     res.json({ message: 'You are authenticated and accessing the protected route.' });
// });
// router.get('/protected-route', isAuthenticated, (req, res) => {
//     res.json({ message: 'You are authenticated and accessing the protected route.' });
// });

router.get('/', isAuthenticated, cartController.showCart);

// /cart => GET
// router.get('/', isAuthenticated(), cartController.showCart);
router.post('/add-to-cart/:productId', cartController.addToCart);

router.post('/cart-delete-item', cartController.postCartDeleteProduct);
// router.post('/cart-delete-item',  cartController.deleteFromCart);


// router.post('/remove-from-cart/:productId', cartController.removeFromCart);

module.exports = router;
