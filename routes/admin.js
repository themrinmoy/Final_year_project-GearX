// routes/admin.js

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const checkUserType = require('../middleware/checkUserType');
const User = require('../models/User');
const fileHelper = require('../utill/file');


const adminController = require('../controllers/adminController');

//:/admin
// router.get('/', checkUserType('admin'), (req, res) => {
router.get('/', (req, res) => {
    res.render('./admin/admin.ejs', { user: req.user, pageTitle: 'Admin', path: '/admin' });
    // res.send('admin');
});

// router.get('/', checkUserType('admin'), adminController.showAdminPage);


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
// router.get('/add-product', checkUserType('admin'), adminController.showAddProductPage);
router.get('/add-product', adminController.showAddProductPage);
// router.post('/add-product', checkUserType('admin'), adminController.addProduct);
router.post('/add-product', adminController.postAddProduct);

// router.post('/add-product', (req, res, next) => {
//     // Accessing the uploaded file

// });

// router.post('/add-product', checkUserType('admin'), adminController.addProduct);
// done
// router.get('edit-product', checkUserType('admin'), adminController.showEditProductPage);

router.get('/products', adminController.getAllProducts);

// router.get('/update-product/', adminController.showUpdateProductPage);
router.get('/update-product/:productId', adminController.getUpdateProduct);

// Handle 'Update Product' form submission 
router.post('/update-product/:productId', adminController.postUpdateProduct);
// router.put('/update-product/:productId', adminController.updateProduct);
// router.get('/update-product/:productId', adminController.showAddProductPage);
router.delete('/delete-product/:productId', adminController.removeProduct);
router.post('/delete-product/:productId', adminController.removeProduct);




// router.post('/products', checkUserType('administrator'), adminController.createProduct);

// router.put('/products/:productId', checkUserType('administrator'), adminController.updateProduct);

// router.delete('/products/:productId', checkUserType('administrator'), adminController.deleteProduct);

// router.get('/orders', checkUserType('administrator'), adminController.getAllOrders);

// router.get('/orders/:orderId', checkUserType('administrator'), adminController.getOrder);

// router.post('/orders', checkUserType('administrator'), adminController.createOrder);


// router.put('/orders/:orderId', checkUserType('administrator'), adminController.updateOrder);

// router.delete('/orders/:orderId', checkUserType('administrator'), adminController.deleteOrder);




module.exports = router;
