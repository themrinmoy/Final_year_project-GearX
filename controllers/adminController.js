// controllers/adminController.js

// Import any necessary models or services
const Product = require('../models/Product');

// Controller functions for administrator functionalities
const addProduct = (req, res) => {
    Product.create(req.body)
        .then((newProduct) => {
            res.status(201).json({ message: 'Product added successfully', data: newProduct });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

const showAddProductPage = (req, res) => {
    res.render('./admin/update-product');
};

const updateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        .then((updatedProduct) => {
            res.json({ message: 'Product updated successfully', data: updatedProduct });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

const removeProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
        .then(() => {
            res.json({ message: 'Product removed successfully' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

module.exports = {
    addProduct,
    updateProduct,
    removeProduct,
    showAddProductPage
};
