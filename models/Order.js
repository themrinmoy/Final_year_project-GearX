const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //user email

    userEmail: {
        type: String,
        // required: true
    },
    productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product', 
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
        min: 0
    },
    shippingAddress: {
        type: String,
        // required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
