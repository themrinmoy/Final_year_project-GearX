const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'overdue'], default: 'active' },
    rentalCost: { type: Number, default: 0 }, // Add a field for the rental cost
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }, // Add a field for payment status
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;



function calculateRentalCost(rentalStartDate, rentalEndDate, productPrice) {
    const durationInMilliseconds = rentalEndDate - rentalStartDate;
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    // Customize your pricing strategy here
    const dailyRentalRate = productPrice * 0.1; // Adjust the multiplier as needed
    const totalCost = dailyRentalRate * durationInDays;

    return totalCost;
}


