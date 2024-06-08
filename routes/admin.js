// routes/admin.js

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const checkUserType = require('../middleware/checkUserType');
const User = require('../models/User');
const fileHelper = require('../utill/file');

const rentalController = require('../controllers/rentalController');


const adminController = require('../controllers/adminController');
const { getRentCheckoutSuccess } = require('../controllers/rentalController');

//:/admin
// router.get('/', checkUserType('admin'), (req, res) => {
router.get('/', checkUserType('admin'), (req, res) => {
    console.log('admin page');
    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;
    const warningMessage = req.query.warning || '';

    res.render('./admin/admin.ejs', {
        user: req.user, pageTitle: 'Admin',
        path: '/admin',
         username,  profilePic, warningMessage
    });
    // res.send('admin');
});

router.get('/add-product', checkUserType('admin'), adminController.showAddProductPage);
// router.post('/add-product', checkUserType('admin'), adminController.addProduct);
router.post('/add-product', checkUserType('admin'), adminController.postAddProduct);



router.get('/products', checkUserType('admin'), adminController.getAllProducts);

// router.get('/update-product/', adminController.showUpdateProductPage);
router.get('/update-product/:productId', checkUserType('admin'), adminController.getUpdateProduct);

// Handle 'Update Product' form submission 
router.post('/update-product/:productId', checkUserType('admin'), adminController.postUpdateProduct);

router.delete('/delete-product/:productId', checkUserType('admin'), adminController.removeProduct);
router.post('/delete-product/:productId', checkUserType('admin'), adminController.removeProduct);

router.get('/all-rentals', checkUserType('admin'), rentalController.getAllRentedItems);






module.exports = router;
