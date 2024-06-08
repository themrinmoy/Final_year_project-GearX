// Import any necessary models or services
//  controllers/adminController.js
const Product = require('../models/Product');

const express = require('express');
const router = express.Router();
// const 
// const multer = require('multer');
const fs = require('fs'); // Add this line to include the fs module



// getadmin page

exports.getAdminPage = (req, res) => {
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
}


exports.getAllProducts = (req, res) => {

    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;
    const warningMessage = req.query.warning || '';
    Product.find()
        .then((products) => {
            res.render('./admin/admin-products', {
                products,
                path: '/admin/products',
                pageTitle: 'Admin - Products',
                username, profilePic, warningMessage
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};


exports.showAddProductPage = (req, res) => {

    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;
    const warningMessage = req.query.warning || '';


    res.render('./admin/update-product',
        {
            pageTitle: 'Add Product', editing: false,
            errorMessage: null,
            product: null,
            path: '/admin/add-product',
            username, profilePic,
            warningMessage
        });
};





exports.postAddProduct = (req, res) => {
    const image = req.file;

    if (!image) {
        // Handle the case where no file was uploaded (optional)
        return res.status(400).send('Please upload an image.');
    }

    // Create a new Product instance 
    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        type: req.body.type,
        imageUrl: image.path,
        isAvailable: true, // You can set availability based on your business logic

        // Rental-specific fields

        rentalInfo: {
            rentalPricePerDay: req.body.rentalPricePerDay,
            rentalDeposit: req.body.rentalDeposit,
            rentalPeriod: req.body.rentalPeriod,
            // Add more rental-specific fields as needed
        },
    });



    product.save() // Save the product to your database
        .then(result => {
            res.redirect('/admin/products'); // Or any success response you prefer
        })
        .catch(err => {
            // Handle database save errors
            console.error(err);
            res.status(500).send('Error saving product.');
        });
};





exports.getUpdateProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Assuming you have the 'product' object available

            let username = req.user ? req.user.username : null;
            let profilePic = req.user ? req.user.profilePic : null;
            const warningMessage = req.query.warning || '';

            res.render('admin/update-product',
                {
                    product: product,
                    errorMessage: null,
                    editing: true, pageTitle: 'Update Product',
                    path: '/admin/products',
                    username, profilePic, warningMessage
                });

            // res.render('./admin/update-product', { product, pageTitle: 'Update Product', editing: true, errorMessage: null });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};




exports.postUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        // console.log('productId', productId);
        const image = req.file; // Check if a new image has been uploaded

        // 1. Find the product you want to update
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // 2. Gather updated data, including potential new image
        const updatedProductData = {
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            type: req.body.type,
            // isAvailable: 'true' // Handle boolean conversion
        };


        if (image) {
            updatedProductData.imageUrl = image.path;
        }

        if (image && product.imageUrl) {
            const oldImagePath = product.imageUrl; // Store the old image path
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                    // You might still update the product but notify the user about the image issue
                } else {
                    console.log('Old image deleted successfully');
                }
            }
            );
        }
        // 3. Update rentalInfo (if product type is 'rentable')
        if (req.body.type === 'rentable') {
            updatedProductData.rentalInfo = {
                rentalPricePerDay: req.body.rentalPricePerDay,
                rentalDeposit: req.body.rentalDeposit,
                rentalPeriod: req.body.rentalPeriod,
            };
        } else {
            updatedProductData.rentalInfo = undefined; // Reset if becoming 'sellable'
        }

        // 4. Update the product
        await Product.findByIdAndUpdate(productId, updatedProductData);

        res.redirect('/admin/products'); // Or any relevant success response 

    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product.');
    }
};




exports.removeProduct = (req, res) => {
    Product.findByIdAndDelete({ _id: req.params.productId })
        .then(result => {
            console.log('Product removed successfully', result);

            // Remove the associated image file from the file system
            const imagePath = result.imageUrl; // Assuming imageUrl is the field where the image path is stored
            if (imagePath) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully');
                    }
                });
            }

            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};
