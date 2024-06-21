const Rental = require('../models/Rental');
const Product = require('../models/Product');
const User = require('../models/User');


const MongoStore = require('connect-mongo');
const session = require('express-session');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')


exports.getAllRentals = (req, res, next) => {

    Product.find({ type: "rentable" }).then((products) => {



        res.render('./rent/all.ejs', {
            products, pageTitle: 'For Rent',
            path: '/rent',
            categoryTitle: "Ready for Rent",

        });

    })
        .catch((error) => {
            console.error('Error fetching products:', error);
            res.redirect(`/products?warning=${error.message}`);

        });
};





exports.getRentalCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Fetch User with Cart Data
        const user = await User.findById(userId).populate({
            path: 'rentalCart.items.productId',
            model: 'Product'
        });

        // 2. Handle Possible Scenarios
        if (!user) {
            return res.redirect(`/login?warning=User not found`);
        }

        // 3. Data for the View
        const cartItems = user.rentalCart.items;





        let totalCost = await user.totalRentalCost();
        let durationInDays = await user.rentalDuration();


        const startDate = new Date(user.rentalCart.StartDate);
        const endDate = new Date(user.rentalCart.EndDate);


        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Format start and end dates
        const fStartDate = formatDate(startDate);
        const fEndDate = formatDate(endDate);

        res.render('./rent/rent-cart', {
            items: cartItems,
            path: '/rent/cart',
            fStartDate, fEndDate, durationInDays, totalCost, pageTitle: 'Rental Cart',

        });
        // res.status(200).json({ items: cartItems, user, totalCost });

    } catch (error) {
        next(error);
        res.redirect(`/rent/cart?warning=${error.message}`);
    }
};

function generateUniqueSessionId() {
    // Generate a random alphanumeric session ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const sessionIdLength = 16;
    let sessionId = '';
    for (let i = 0; i < sessionIdLength; i++) {
        sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return sessionId;
}

exports.getRentChekout = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'rentalCart.items.productId',
            model: 'Product'
        });


        if (!user) {
            return res.redirect(`/login?warning=User not found`);
        }


        const cartItems = user.rentalCart.items;

        if (cartItems.length === 0) {
            return res.redirect('/rent/cart?warning=Cart is empty');
        }



        const totalCost = await user.totalRentalCost(); // Calculate the total rental cost
        const durationInDays = await user.rentalDuration(); // Calculate the rental duration
        console.log('durationInDays:', durationInDays);
        console.log('totalCost:', totalCost);

        const startDate = new Date(user.rentalCart.StartDate);
        const endDate = new Date(user.rentalCart.EndDate);

        user.rentalCart.totalCost = user.totalRentalCost;  // Add this line to store the total cost in the user's cart
        await user.save();

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Format start and end dates
        const fStartDate = formatDate(startDate);
        const fEndDate = formatDate(endDate);

        function constructImageUrl(imageName) {
            if (!imageName) {
                // return 
                return req.protocol + '://' + req.get('host') + '/images/fontPage.png'; // Default image URL
            }
            const normalizedImageName = imageName.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            let url = req.protocol + '://' + req.get('host') + '/' + normalizedImageName;
            console.log(url, 'url');
            return url;

        }
        const address = {
            line1: '123 Main Street',
            city: 'Kolkata',
            state: 'West Bengal',
            postal_code: '700000',
            country: 'IN',
        };


        const successUrl = req.protocol + '://' + req.get('host') + '/rent/checkout/success';
        const cancelUrl = req.protocol + '://' + req.get('host') + '/rent/checkout/cancel';
        const sessionId = generateUniqueSessionId(); // Implement your own function

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map(item => ({
                price_data: {
                    // currency: 'usd',
                    currency: 'INR',  // Modify as needed

                    product_data: {
                        name: item.productId.name || 'No name provided',
                        description: item.productId.description || 'No description provided',

                    },
                    unit_amount: item.productId.rentalInfo.rentalPricePerDay * durationInDays * 100,

                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            // success_url: successUrl,
            customer_email: user.email, // Pass the user's email to Stripe

            success_url: `${successUrl}?session_id=${sessionId}`, // Include session ID in the success URL
            cancel_url: cancelUrl,
            billing_address_collection: 'required', // Include this line for Indian regulations
            // shipping_address_collection: {
            //     allowed_countries: ['IN'],
            // },

        });

        req.session.expectedSessionId = sessionId;
        await req.session.save();




        res.render('./user/rentCheckout', {
            items: cartItems,
            fStartDate,
            fEndDate,
            durationInDays,
            totalCost,
            pageTitle: 'checkout',
            sessionId: session.id,
            path: '/rent/checkout',

        });
        // res.status(200).json({ items: cartItems, user, totalCost });

    } catch (error) {
        next(error);
        res.redirect(`/rent/checkout?warning=${error.message}`);
    }
};







exports.getRentCheckoutSuccess = async (req, res, next) => {
    try {
        const sessionId = req.query.session_id;


        const expectedSessionId = req.session.expectedSessionId;
        if (sessionId !== expectedSessionId) {

            return res.redirect('/rent/checkout?warning=Invalid session ID');
        }
        if (!sessionId) {
            // return res.status(400).send('Invalid session ID');
            return res.redirect('/rent/checkout?warning=Invalid session ID');
        }

        if (sessionId === expectedSessionId) {
            console.log('session id is valid');
        }


        // const session = await stripe.checkout.sessions.retrieve(sessionId);


        const rentalStartDate = new Date(req.user.rentalCart.StartDate);
        const rentalEndDate = new Date(req.user.rentalCart.EndDate);
        const totalRentalCost = await req.user.totalRentalCost(); // Calculate the total rental cost



        // Create a new rental object
        const newRental = new Rental({
            userId: req.user.id,
            productId: req.user.rentalCart.items.map(item => item.productId),
            rentalStartDate,
            rentalEndDate,
            returnDate: rentalEndDate + 1,
            rentalCost: totalRentalCost,
            paymentStatus: 'paid', // Assuming payment is successful
        });
        if (session.payment_status === 'paid') {
            newRental.paymentStatus = 'paid';
        }
        // Save the new rental to the database
        await newRental.save();

        // Clear the rental cart in the user model after successful payment
        // clear the session id

        req.user.rentalCart.items = [];
        req.session.expectedSessionId = null;

        if (!req.user.rentals) {
            req.user.rentals = [];
        }
        req.user.rentals.push(newRental._id);
        req.user.save();

        res.redirect('/user/rentals?success=Payment successful');

    } catch (error) {

        console.error('Error processing successful payment:', error);

        res.redirect('/rent/checkout?warning=An error occurred while processing the payment. Please contact support.');

    }
};




exports.getRentCheckoutCancel = async (req, res, next) => {

    try {

        res.redirect('/rent/checkout?warning=Payment canceled. Please try again.');
    } catch (error) {

        console.error('Error processing canceled payment:', error);

        res.redirect('/rent/checkout?warning=Payment canceled. Please try again.');

    }
};


exports.getAllRentedItems = async (req, res, next) => {
    try {
        const rentals = await Rental.find();


        res.render('user/rentals', {
            rentals, pageTitle: 'Rentals',
            title: 'All Rentals', path: '/rentals',

        });

    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.redirect(`/rentals?error=${error.message}`);
    }
}

exports.getRentedItemsByUser = async (req, res) => {
    try {
        const rentals = await Rental.find({ userId: req.user._id })
            .populate('productId')
            .exec();

        // console.log(rentals[0].productId, 'rentals');
        res.render('user/rentals', {
            rentals, pageTitle: 'Rentals',
            title: 'My Rentals', path: '/rentals',

        });
    } catch (err) {
        console.error(err);
        res.redirect(`/rentals?error=${err.message}`);
    }
};


exports.postRentalCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const rentalStartDate = new Date(req.body.rentalStartDate);
        const rentalEndDate = new Date(req.body.rentalEndDate);

        const quantity = req.body.quantity || 1;          // Default to 1 if quantity is not provided

        if (!req.user) {

            return res.redirect('/login?warning=Please log in to add product to rental cart');
        }

        const product = await Product.findById(productId);
        if (!product) {

            return res.redirect('/rent?warning=Product not found');
        }


        const user = await User.findById(req.user._id);


        const existingRentalItem = user.rentalCart.items.find(
            item => item.productId.toString() === productId.toString()
        );




        if (rentalStartDate < rentalEndDate && rentalStartDate) {

            user.rentalCart.StartDate = rentalStartDate;
            user.rentalCart.EndDate = rentalEndDate;
            console.log(rentalStartDate, rentalEndDate, 'dates')
        }


        if (existingRentalItem) {
            // Update existing item
            existingRentalItem.quantity += quantity;

        } else {
            // Add new item
            user.rentalCart.items.push({
                productId,
                quantity,

            });
        }

        await user.save();


        res.redirect('/rent/cart?success=Product added to rental cart');
        // console.log(user);
        // console.log(product);

    } catch (error) {
        // next(error); // Pass error to your error handling middleware
        res.redirect('/rent/cart?warning=Error adding product to rental cart');
    }
};








