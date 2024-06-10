const cron = require('node-cron');
const Rental = require('../models/Rental');
const User = require('../models/User');
const mailService = require('./mailService');
const Product = require('../models/Product'); // Ensure this path is correct

const domain = process.env.NODE_ENV === 'production' ? `https://${process.env.DOMAIN}` : `http://localhost:${process.env.PORT}` || 'http://localhost:3000';

async function checkAndSendReturnReminders() {
    try {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        const rentals = await Rental.find({
            returnDate: {
                $gte: today,
                $lte: threeDaysFromNow,
            },
            status: 'active',
        }).populate('userId').populate('productId'); // Populate product details

        for (const rental of rentals) {
            const user = rental.userId;
            const products = rental.productId; // List of products
            if (user && products) {
                // Send reminder email with product details
                let e = "mrinmoy@mrinmoy.org"
                mailService.sendReturnReminderEmail(user.email, rental, products);
                // mailService.sendReturnReminderEmail(e, rental, products);
                

                console.log(`Reminder email sent to: ${user.email}`);
            }
        }
    } catch (error) {
        console.error('Error checking and sending return reminders:', error);
    }
}


cron.schedule('0 0 * * *', () => {
    console.log('Running daily rental return reminder check...');
    // checkAndSendReturnReminders();
});

module.exports = { checkAndSendReturnReminders };
