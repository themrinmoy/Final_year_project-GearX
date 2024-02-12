// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: false,
            min: 0,
        },
        category: {
            type: String,
            required: false,
        },
        imageUrl: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true, // Add timestamps for createdAt and updatedAt
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


