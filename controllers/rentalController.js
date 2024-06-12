const Rental = require('../models/Rental');
const Product = require('../models/Product');
const User = require('../models/User');


const MongoStore = require('connect-mongo');
const session = require('express-session');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')






// Get all rentals
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
            // You may want to create an 'error.ejs' view to handle error messages
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

        // 4. Optionally Fetch Additional Rental Details
        if (cartItems.length > 0) {
            const rentalPromises = cartItems.map(item =>
                Rental.findOne({ productId: item.productId, userId }) // Adapt as needed
            );
            const rentals = await Promise.all(rentalPromises);

            // Augment cartItems with rental details, if available
        }




        let totalCost = 0;
        let durationInDays = 0;

        for (const cartItem of cartItems) {
            // Assuming cartItem.productId.rentalInfo.rentalPricePerDay is the rental price per day for the product
            const rentalPricePerDay = cartItem.productId.rentalInfo.rentalPricePerDay;
            const quantity = cartItem.quantity;

            // Assuming cartItem.productId.rentalInfo.rentalPricePerDay is the rental price per day for the product
            const rentalStartDate = new Date(user.rentalCart.StartDate);
            const rentalEndDate = new Date(user.rentalCart.EndDate);

            // Calculate the duration in milliseconds
            const durationInMilliseconds = rentalEndDate - rentalStartDate;

            // Convert the duration to days
            durationInDays = (durationInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

            // Calculate the total cost for this item
            const itemTotalCost = rentalPricePerDay * quantity * durationInDays;

            // Accumulate the total cost
            totalCost += itemTotalCost;
        }

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
        // console.log('durationInDays:', durationInDays);

        // console.log(fStartDate); // Output: "2024-03-05"
        // console.log(fEndDate); // Output: "2024-03-10"
        // Render the View or return JSON as needed



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

        // 1. Fetch User with Cart Data
        const user = await User.findById(userId).populate({
            path: 'rentalCart.items.productId',
            model: 'Product'
        });

        // const rental = await Rental.find({ userId: userId });

        // 2. Handle Possible Scenarios
        if (!user) {
            return res.redirect(`/login?warning=User not found`);
        }

        // 3. Data for the View
        const cartItems = user.rentalCart.items;

        if (cartItems.length === 0) {
            return res.redirect('/rent/cart?warning=Cart is empty');
        }

        // 4. Optionally Fetch Additional Rental Details
        if (cartItems.length > 0) {
            const rentalPromises = cartItems.map(item =>
                Rental.findOne({
                    productId: item.productId, userId

                }) // Adapt as needed
            );
            const rentals = await Promise.all(rentalPromises);

            // Augment cartItems with rental details, if available
        }
        // 5. Calculate Total Rental Cost
        // const totalCost = await calculateTotalRentalCost(cartItems, durationInDays);

        // rentals.calculateTotalRentalCost()


        let totalCost = 0;
        let durationInDays = 0;

        for (const cartItem of cartItems) {
            // Assuming cartItem.productId.rentalInfo.rentalPricePerDay is the rental price per day for the product
            const rentalPricePerDay = cartItem.productId.rentalInfo.rentalPricePerDay;
            const quantity = cartItem.quantity;

            // Assuming cartItem.productId.rentalInfo.rentalPricePerDay is the rental price per day for the product
            const rentalStartDate = new Date(user.rentalCart.StartDate);
            const rentalEndDate = new Date(user.rentalCart.EndDate);

            // Calculate the duration in milliseconds
            const durationInMilliseconds = rentalEndDate - rentalStartDate;

            // Convert the duration to days
            durationInDays = (durationInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

            // Calculate the total cost for this item
            const itemTotalCost = rentalPricePerDay * quantity * durationInDays;

            // Accumulate the total cost
            totalCost += itemTotalCost;
        }


        const startDate = new Date(user.rentalCart.StartDate);
        const endDate = new Date(user.rentalCart.EndDate);

        user.rentalCart.totalCost = totalCost;  // Add this line to store the total cost in the user's cart
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


        // function constructImageUrl(imageName) {
        //     let url = req.protocol + '://' + req.get('host') + '/' + imageName;
        //     console.log( url, 'url');
        //     return url;
        // }

        function constructImageUrl(imageName) {
            if (!imageName) {
                // return 
                return req.protocol + '://' + req.get('host') + '/images/fontPage.png'; // Default image URL
            }
            const normalizedImageName = imageName.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            let url = req.protocol + '://' + req.get('host') + '/' + normalizedImageName;
            console.log(url, 'url');
            return url;
            // return req.protocol + '://' + req.get('host') + '/images/' + normalizedImageName;
        }


        const successUrl = req.protocol + '://' + req.get('host') + '/rent/checkout/success';
        // const successUrl = `${req.protocol}://${req.get('host')}/rent/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

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

                        // images: [constructImageUrl(item.productId.imageUrl)], // Construct the image URL




                        // images: [item.productId.imageUrl],
                    },
                    unit_amount: item.productId.rentalInfo.rentalPricePerDay * durationInDays * 100,
                    // unit_amount: item.productId.rentalInfo.rentalPricePerDay * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            // success_url: successUrl,
            success_url: `${successUrl}?session_id=${sessionId}`, // Include session ID in the success URL


            // success_url: `${successUrl}?session_id=${sessionId}`, // Include session ID in the success URL

            cancel_url: cancelUrl,
            billing_address_collection: 'required', // Include this line for Indian regulations

        });
        // sessionId = sessionId;
        // req.session.expectedSessionId = session.id;
        req.session.expectedSessionId = sessionId;
        await req.session.save();

        // req.session.stripeSessionId = sessionId;


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


async function calculateTotalRentalCost(cartItems, durationInDays) {
    let totalCost = 0;

    if (Array.isArray(cartItems)) {
        for (const cartItem of cartItems) {
            try {
                // Fetch the product details using the productId
                const product = await Product.findById(cartItem.productId);

                if (product && product.rentalInfo) {
                    totalCost += product.rentalInfo.rentalPricePerDay * durationInDays * (cartItem.quantity || 1);
                } else {
                    console.error('Invalid product or rentalInfo:', product);
                    // Handle the case where product or rentalInfo is missing
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                // Handle the error (e.g., log, throw, or provide default values)
            }
        }
    } else {
        console.error('Invalid cartItems:', cartItems);
        // Handle the case where cartItems is not an array
    }

    return totalCost;
}




exports.getRentCheckoutSuccess = async (req, res, next) => {
    try {
        const sessionId = req.query.session_id;

        // const sessionId = req.query.session_id;
        // console.log(sessionId, 'session id');

        const expectedSessionId = req.session.expectedSessionId;
        if (sessionId !== expectedSessionId) {
            // return res.status(400).send('Invalid session ID');
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

        // Perform actions after a successful payment, such as updating the database, sending confirmation emails, etc.
        const rentalStartDate = new Date(req.user.rentalCart.StartDate);
        const rentalEndDate = new Date(req.user.rentalCart.EndDate);
        const durationInMilliseconds = rentalEndDate - rentalStartDate;
        const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24) + 1;
        // Assuming you have a function to calculate rental cost based on the cartItems and duration
        // console.log(req.user.rentalCart.items, 'items');
        const totalRentalCost = await calculateTotalRentalCost(req.user.rentalCart.items, durationInDays);



        // const totalRentalCost = 0
        console.log(durationInDays, 'days');
        console.log(totalRentalCost, 'total cost');
        // console.log(totalRentalCost);
        // Create a new rental
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
        req.user.rentalCart.items = [];
        // clear the session id
        req.session.expectedSessionId = null;

        if (!req.user.rentals) {
            req.user.rentals = [];
        }
        req.user.rentals.push(newRental._id);
        req.user.save();

        res.redirect('/user/rentals?success=Payment successful');
        // res.render('rent/rentalSuccessView.ejs', {title: 'Rent Checkout Success', rental: newRental, totalCost: totalRentalCost, durationInDays: durationInDays});
        // res.json({ message: 'Payment successful' });
    } catch (error) {
        // Handle any errors that may occur during database updates or email sending
        console.error('Error processing successful payment:', error);

        res.redirect('/rent/checkout?warning=An error occurred while processing the payment. Please contact support.');
        // Render an error view or redirect to an error page
        // res.render('errorView', {
        //     title: 'Error',
        //     errorMessage: 'An error occurred while processing the payment. Please contact support.',
        // });
    }
};




exports.getRentCheckoutCancel = async (req, res, next) => {

    try {

        res.redirect('/rent/checkout?warning=Payment canceled. Please try again.');
    } catch (error) {
        // Handle any errors that may occur during database updates or email sending
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
        // res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.redirect(`/rentals?warning=${error.message}`);
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
        res.redirect(`/rentals?warning=${err.message}`);
    }
};


exports.postRentalCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        // const rentalStartDate =  new Date(req.body.rentalStartDate);
        const rentalStartDate = new Date(req.body.rentalStartDate);
        const rentalEndDate = new Date(req.body.rentalEndDate);
        // const rentalEndDate = new Date(req.body.rentalEndDate);
        const quantity = req.body.quantity || 1;          // Default to 1 if quantity is not provided

        // console.log(productId, rentalStartDate, rentalEndDate, quantity);
        // 1. Validate User and Product
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized: Please Log In" });
            res.redirect('/login?warning=Unauthorized: Please Log In');
        }

        const product = await Product.findById(productId);
        if (!product) {
            // return res.status(404).json({ message: "Product not found" });
            res.redirect('/rent?warning=Product not found');
        }

        // 2. Retrieve User (might be adapted depending on your authentication system)
        const user = await User.findById(req.user._id);

        // 3. Update the Rental Cart
        const existingRentalItem = user.rentalCart.items.find(
            item => item.productId.toString() === productId.toString()
        );

        // 4. update the rental cart start and end date
        // if (user.rentalCart.StartDate !== rentalStartDate || user.rentalCart.EndDate !== rentalEndDate) {



        if(rentalStartDate < rentalEndDate && rentalStartDate){

            user.rentalCart.StartDate = rentalStartDate;
            user.rentalCart.EndDate = rentalEndDate;
            console.log(rentalStartDate, rentalEndDate, 'dates')
        }








        if (existingRentalItem) {
            // Update quantity only (adjust if different logic needed)
            existingRentalItem.quantity += quantity;

        } else {
            // Add new item
            user.rentalCart.items.push({
                productId,
                quantity,

            });
        }

        await user.save();

        // 4. Response
        // res.status(200).json({ message: "Product added to rental cart!" });
        res.redirect('/rent/cart?success=Product added to rental cart');
        // console.log(user);
        // console.log(product);

    } catch (error) {
        // next(error); // Pass error to your error handling middleware
        res.redirect('/rent/cart?warning=Error adding product to rental cart');
    }
};


exports.createRental = async (req, res) => {
    // exports.getRentChekoutSuccess = async (req, res) => {
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
        res.redirect(`/rent/checkout?warning=${error.message}`);
    }
};


// Get rental by ID
exports.getRentalById = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.rentalId);
        res.status(200).json(rental);
    } catch (error) {
        console.error('Error fetching rental:', error);
        res.redirect(`/rentals?warning=${error.message}`);
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
        res.redirect(`/rentals?warning=${error.message}`);
    }
};



