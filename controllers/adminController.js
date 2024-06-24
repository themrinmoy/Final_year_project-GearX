// Import any necessary models or services
//  controllers/adminController.js
const Product = require('../models/Product');

const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const 
// const multer = require('multer');
const fs = require('fs'); // Add this line to include the fs module
const path = require('path');



// getadmin page

exports.getAdminPage = (req, res) => {
    console.log('admin page called by', req.user.email);


    res.render('./admin/admin.ejs', {
        user: req.user, pageTitle: 'Admin',
        path: '/admin'
    });
    // res.send('admin');
}


exports.getAllProducts = (req, res) => {


    Product.find()
        .then((products) => {
            res.render('./admin/admin-products', {
                products,
                path: '/admin/products',
                pageTitle: 'Admin - Products',

            });
        })
        .catch((error) => {
            console.error(error);
            res.redirect(`/admin?warning=Error fetching products,${error.message}`)
        });
};


exports.showAddProductPage = (req, res) => {




    res.render('./admin/update-product',
        {
            pageTitle: 'Add Product', editing: false,
            errorMessage: null,
            product: null,
            path: '/admin/add-product',
        });
};





exports.postAddProduct = (req, res) => {
    const image = req.file;

    if (!image) {
        // Handle the case where no file was uploaded (optional)
        return res.redirect('/admin/add-product?warning=No image uploaded.');
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
            console.log('Product added successfully', result);
            res.redirect('/admin/products?warning=Product added successfully.');
        })
        .catch(err => {
            // Handle database save errors
            console.error(err);
            res.redirect('/admin/add-product?warning=Error adding product,${err.message}');
        });
};





exports.getUpdateProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/admin/products?warning=Product not found.');
            }


            res.render('admin/update-product',
                {
                    product: product,
                    errorMessage: null,
                    editing: true, pageTitle: 'Update Product',
                    path: '/admin/products',

                });

            // res.render('./admin/update-product', { product, pageTitle: 'Update Product', editing: true, errorMessage: null });
        })
        .catch((error) => {
            console.error(error);
            res.redirect(`/admin/products?warning=Error updating product,${error.message}`)
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
            res.redirect('/admin/products?warning=Product not found.');
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

        res.redirect('/admin/products?warning=Product updated successfully.');

    } catch (err) {
        console.error(err);
        res.redirect(`/admin/products?warning=Error updating product,${err.message}`);
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

            res.redirect('/admin/products?warning=Product removed successfully.');
        })
        .catch((error) => {
            console.error(error);
            res.redirect(`/admin/products?warning=Error removing product,${error.message}`)
        });
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('rentals.rentalId orders.orderId');
        // res.json(users);
        res.render('./admin/admin-users', {
            users,
            pageTitle: 'Admin - Users',

            path: '/admin/products',
        });
    }
    catch (error) {
        console.error(error);
        res.redirect(`/admin?error=Error fetching users,${error.message}`)
    }

};




// Handle 'Update Product' form submission
exports.updateUser = async (req, res) => {
    const { username, name, email, userType, verified } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, {
            username,
            name,
            email,
            userType,
            verified: verified === 'true'
        });
        res.redirect('/admin/users?success=User updated successfully');
    } catch (error) {
        console.error(error);
        res.redirect(`/admin/users?error=Error updating user+${error.message} `);
    }
}


exports.getUserByusername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate('rentals.rentalId orders.orderId');
        if (!user) {
            return res.redirect('/admin/users?error=User not found.');
        }
        // res.json(user);
        res.render('admin/userbyid', {
            user,
            pageTitle: 'User',
            path: '/admin/users',
        });

    }
    catch (error) {
        console.error(error);
        res.redirect(`/admin/users?error=Error fetching user,${error.message}`)
    }
}