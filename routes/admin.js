// routes/admin.js

const express = require('express');
const router = express.Router();
const checkUserType = require('../middleware/checkUserType');
const User = require('../models/User');

const adminController = require('../controllers/adminController');

router.get('/', checkUserType('administrator'), (req, res) => {
    res.render('admin-dashboard', { user: req.user });
});

// router.get('/users', checkUserType('administrator'), adminController.getAllUsers);
// router.get('/users', checkUserType('administrator'), adminController.getAllUsers);

// router.get('/users/:userId', checkUserType('administrator'), adminController.getUser);

// router.post('/users', checkUserType('administrator'), adminController.createUser);

// router.put('/users/:userId', checkUserType('administrator'), adminController.updateUser);

// router.delete('/users/:userId', checkUserType('administrator'), adminController.deleteUser);

// router.get('/products', checkUserType('administrator'), adminController.getAllProducts);

// router.get('/products/:productId', checkUserType('administrator'), adminController.getProduct);

// router.post('/add-product', checkUserType('administrator'), adminController.addProduct);
// router.put('/update-product/:productId',checkUserType('administrator'), adminController.updateProduct);
// router.delete('/delete-product/:productId',checkUserType('administrator'), adminController.deleteProduct);
router.get('/add-product',  adminController.showAddProductPage);
router.post('/add-product',  adminController.addProduct);
router.put('/update-product/:productId', adminController.updateProduct);
router.delete('/delete-product/:productId', adminController.removeProduct);




// router.post('/products', checkUserType('administrator'), adminController.createProduct);

// router.put('/products/:productId', checkUserType('administrator'), adminController.updateProduct);

// router.delete('/products/:productId', checkUserType('administrator'), adminController.deleteProduct);

// router.get('/orders', checkUserType('administrator'), adminController.getAllOrders);

// router.get('/orders/:orderId', checkUserType('administrator'), adminController.getOrder);

// router.post('/orders', checkUserType('administrator'), adminController.createOrder);


// router.put('/orders/:orderId', checkUserType('administrator'), adminController.updateOrder);

// router.delete('/orders/:orderId', checkUserType('administrator'), adminController.deleteOrder);




module.exports = router;
