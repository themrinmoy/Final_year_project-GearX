// controllers/adminController.js

// Import any necessary models or services
const Product = require('../models/Product');


exports.getAllProducts = (req, res) => {
    Product.find()
        .then((products) => {



            res.render('./admin/admin-products', { products, pageTitle: 'Admin - Products' });
            // res.json({ message: 'Products fetched successfully', data: products });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
}


// Controller functions for administrator functionalities
exports.addProduct = (req, res) => {
    Product.create(req.body)
        .then((newProduct) => {
            pageTitle = 'Add Product';
            // res.status(201).json({ message: 'Product added successfully', data: newProduct });
            // res.status(201).json({ message: 'Product added successfully', data: newProduct });
            console.log('Product added successfully', newProduct);

            // res.redirect('/admin/products', pageTitle: 'Add Product' );
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
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
        }
        )
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        )
};



exports.postUpdateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        .then((updatedProduct) => {
            console.log('Product updated successfully', updatedProduct);
            // Redirect after update to prevent issues on refresh
            res.redirect('/admin/products'); 

        })
        .catch((error) => {
            console.error(error);
            // Consider rendering the edit page again with an error message
            res.status(500).render('./admin/update-product', { 
                pageTitle: 'Update Product',
                editing: true,
                product: req.body, // Include the submitted data to repopulate the form
                errorMessage: 'Failed to update product'
            });
        });
};

exports.removeProduct = (req, res) => {
    // Product.findOneAndDelete(req.params.productId)
    // Product.deleteOne({ _id: req.params.productId })
    Product.findByIdAndDelete({ _id: req.params.productId })
        // Product.findByIdAndDelete(req.params.productId)
        // Product.findByIdAndRemove(req.params.productId)
        .then(result => {
            console.log('Product removed successfully', result);
            res.redirect('/admin/products');
            // res.json({ message: 'Product removed successfully' });
        })
        .catch((error) => {
            console.error(error);

            res.status(500).json({ message: 'Internal Server Error' });
        });
};

