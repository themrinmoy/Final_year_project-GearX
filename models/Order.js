const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: '60f3b3b3b3b3b3b3b3b3b3b3',
        required: true
    },
    //user email

    userEmail: {
        type: String,
        // required: true
        default: 'N/A'
    },

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                default: '60f3b3b3b3b3b3b3b3b3b3',

                // required: true
            },
            quantity: {
                type: Number,
                // required: true,
                min: 1
            }
        }
    ],
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        // required: true,
        min: 0,
        default: 0
    },
    shippingAddress: {
        type: String,
        default: 'N/A'
        // required: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
    }
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
