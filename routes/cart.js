// routes/cart.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cartController = require('../controllers/CartController');

// router.get('/', (req, res) => {
//     const user = req.user; // Assuming you're using Passport for authentication
//     res.render('./user/cart', { cart: user.cart });
//     // res.send('cart');
// });




// /cart => GET
router.get('/', cartController.showCart);
router.post('/add-to-cart/:productId', cartController.addToCart);

router.post('/cart-delete-item',  cartController.postCartDeleteProduct);
// router.post('/cart-delete-item',  cartController.deleteFromCart);


// router.post('/remove-from-cart/:productId', cartController.removeFromCart);

module.exports = router;
