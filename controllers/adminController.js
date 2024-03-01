// Import any necessary models or services
//  adminController.js
const Product = require('../models/Product');

const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const fs = require('fs'); // Add this line to include the fs module

// Multer configuration
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images')
//     },
//     filename: (req, file, cb) => {
//         // cb(null, file.filename + '-' + file.originalname)
//         // cb(null, new Date().toISOString() + '-' + file.originalname)
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)


//     }
// })

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/webp' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, true);
//     }
// };
// const fileFilter = (req, file, cb) => {
//     // Allow only images
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true); // Accept the file
//     } else {
//       cb(null, false); // Reject the file 
//     }
//   };




// const upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl');

// Controller functions for administrator functionalities
// (Rest of your code remains unchanged)

// Controller functions for administrator functionalities
exports.getAllProducts = (req, res) => {
    Product.find()
        .then((products) => {
            res.render('./admin/admin-products', { products, pageTitle: 'Admin - Products' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

exports.postAddProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error(err);
            return res.status(500).json({ message: 'Error uploading image' });
        } else if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (req.file) {
            req.body.imageUrl = req.file.path;
        }

        Product.create(req.body)
            .then((newProduct) => {
                // res.status(201).json({ message: 'Product added successfully', data: newProduct });
                console.log('Product added successfully', newProduct);
                res.redirect('/admin/products');
            })
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ message: 'Validation failed', errors: error.errors });
                } else {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
            });
    });
};

exports.showAddProductPage = (req, res) => {
    res.render('./admin/update-product', { pageTitle: 'Add Product', editing: false, errorMessage: null });
};

exports.getUpdateProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.render('./admin/update-product', { product, pageTitle: 'Update Product', editing: true, errorMessage: null });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

exports.postUpdateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        .then((updatedProduct) => {
            console.log('Product updated successfully', updatedProduct);
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).render('./admin/update-product', {
                pageTitle: 'Update Product',
                editing: true,
                product: req.body,
                errorMessage: 'Failed to update product'
            });
        });
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
