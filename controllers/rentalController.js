const Rental = require('../models/Rental');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new rental
exports.createRental = async (req, res) => {
    try {
        // Extract required information from the request body
        const { userId, productId, rentalStartDate, rentalEndDate } = req.body;

        // Create a new rental entry
        const rental = new Rental({
            userId: userId,
            productId: productId,
            rentalStartDate: rentalStartDate,
            rentalEndDate: rentalEndDate,
        });

        // Save the rental entry
        const savedRental = await rental.save();

        // Update the product availability
        await Product.findByIdAndUpdate(productId, { isAvailable: false });

        res.status(201).json(savedRental);
    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all rentals
exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.rentalId);
        res.status(200).json(rental);
    } catch (error) {
        console.error('Error fetching rental:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update rental (e.g., return a rented product)
exports.updateRental = async (req, res) => {
    try {
        // Extract required information from the request body
        const { returnDate } = req.body;

        // Update rental entry with return date and set status to 'completed'
        const updatedRental = await Rental.findByIdAndUpdate(req.params.rentalId, {
            returnDate: returnDate,
            status: 'completed',
        });

        // Update the product availability
        await Product.findByIdAndUpdate(updatedRental.productId, { isAvailable: true });

        res.status(200).json(updatedRental);
    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
