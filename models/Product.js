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
        type: {
            type: String,
            enum: ['sellable', 'rentable'],
            default: 'sellable',
        },
        imageUrl: {
            type: String,
            required: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        rentalInfo: {
            rentalPricePerDay: {
                type: Number,
                default: 0, // You can adjust the default based on your needs
                // required: function () {
                //     return this.type === 'rentable';
                // },
            },
            rentalDeposit: {
                type: Number,
                default: 0, // You can adjust the default based on your needs
                // required: function () {
                //     return this.type === 'rentable';
                // },
            },
            rentalPeriod: {
                type: String,
                enum: ['day', 'week', 'month'],
                default: 'day', // You can adjust the default based on your needs
            },
            // Add more rental-specific fields as needed
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
