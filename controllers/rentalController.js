const Rental = require('../models/Rental');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new rental



// Get all rentals
exports.getAllRentals = (req, res, next) => {
    // const { type } = req.params;
    // const  type  = "rentable";
    // Fetch all products from the database
    Product.find({ type: "rentable" }).then((products) => {
        // Modify the response to include image path or URL
        // const productsWithImages = products.map((product) => ({
        //   _id: product._id,
        //   name: product.name,
        //   description: product.description,
        //   price: product.price,
        //   type: product.type,
        //   imageUrl: product.imageUrl, 
        // }));

        // res.status(200).json(productsWithImages);

        // Render an EJS view with the product data
        // res.json(productsWithImages);

        res.render('rent/all.ejs', { products, pageTitle: ' for Rent', categoryTitle: "Ready for Rent" });
        // res.render('rent/allcopy.ejs', { products, pageTitle: ' for Rent', categoryTitle: "Ready for Rent" });
        // res.render('rent/rent-all.ejs', { products, pageTitle: ' for Rent', categoryTitle: "Ready for Rent" });
        console.log(products);
    })
        .catch((error) => {
            console.error('Error fetching products:', error);
            res.status(500).render('error', { message: 'Internal Server Error' });
            // You may want to create an 'error.ejs' view to handle error messages
        });
};


// exports.getRentalCart = async (req, res, next) => {
//     try {
//         const userId = req.user._id;

//         // 1. Fetch User with Cart Data
//         const user = await User.findById(userId).populate({
//             path: 'rentalCart.items.productId',
//             model: 'Product'
//         });

//         // 2. Handle Possible Scenarios
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // 3. Data for the View
//         const cartItems = user.rentalCart.items;

//         // 4. Optionally Fetch Additional Rental Details
//         if (cartItems.length > 0) {
//             const rentalPromises = cartItems.map(item =>
//                 Rental.findOne({ productId: item.productId, userId }) // Adapt as needed
//             );
//             const rentals = await Promise.all(rentalPromises);

//             // Augment cartItems with rental details, if available
//         }

//         // 5. Render the View
//         function calculateRentalCost(rentalStartDate, rentalEndDate, productPrice) {
//             const durationInMilliseconds = rentalEndDate - rentalStartDate;
//             const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days

//             // Customize your pricing strategy here
//             const dailyRentalRate = productPrice * 0.1; // Adjust the multiplier as needed
//             const totalCost = dailyRentalRate * durationInDays;

//             return totalCost;
//         } 
//         let totalCost = calculateRentalCost(user.rentalCart.StartDate, user.rentalCart.EndDate, cartItems.price);
//         console.log(totalCost)

//         console.log(user.rentalCart.StartDate);
//         console.log(user.rentalCart.EndDate);
//         // res.render('./rent/rent-cart', { items: cartItems, user, pageTitle: 'Rental Cart' });
//         res.status(200).json(cartItems);
//         // res.status(200).json(user);

//     } catch (error) {
//         next(error);
//     }
// };

const calculateRentalCost = (rentalStartDate, rentalEndDate, rentPerday, quantity) => {
    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);

    // Calculate the duration in milliseconds
    const durationInMilliseconds = endDate - startDate;

    // Convert the duration to days
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

    console.log("Duration in days:", durationInDays);

    // Calculate the total cost
    const totalCost = rentPerday * durationInDays * quantity;

    return totalCost;
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
            return res.status(404).json({ message: "User not found" });
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

        // 5. Calculate Total Cost
        const totalCost = calculateRentalCost(user.rentalCart.StartDate, user.rentalCart.EndDate, cartItems[0].productId.rentalInfo.rentalPricePerDay, cartItems[0].quantity);
        const s = new Date(user.rentalCart.startDate);
        const e = new Date(user.rentalCart.endDate);

        // Calculate the duration in milliseconds
        const durationInMilliseconds = e - s;

        // Convert the duration to days
        const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

        console.log("Duration in days:", durationInDays);
        console.log(user.rentalCart.StartDate);
        console.log(user.rentalCart.EndDate);
        console.log(cartItems[0].productId.rentalInfo.rentalPricePerDay);
        console.log(cartItems[0].quantity);
        console.log(totalCost);
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

        console.log(fStartDate); // Output: "2024-03-05"
        console.log(fEndDate); // Output: "2024-03-10"
        // Render the View or return JSON as needed
        res.render('./rent/rent-cart', { items: cartItems, fStartDate, fEndDate, user, totalCost, pageTitle: 'Rental Cart' });
        // res.status(200).json({ items: cartItems, user, totalCost });

    } catch (error) {
        next(error);
    }
};

// exports.postRentalCart = async (req, res, next) => {
//     try {
//         const productId = req.body.productId;
//         const startDate = req.body.startDate;
//         const endDate = req.body.endDate;
//         // ... Retrieve other POSTed data (quantity, etc.) as needed

//         // Logic to obtain cart (depends on your storage method)
//         let cart = await RentalCart.findById(req.session.cartId);
//         if (!cart) { 
//             cart = await RentalCart.create({}); // ... Or similar with a new cart  
//         }

//         // ... Add/update item logic based on your model

//         await cart.save(); 

//         res.redirect('/cart'); // Or a success page of your choice
//     } catch (error) {
//         next(error);
//     }
// };
// const User = require('./models/User');
// const Product = require('./models/Product'); // ...assuming you have a Product model

exports.postRentalCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const rentalStartDate = req.body.rentalStartDate; // Assuming start date comes from the frontend
        const rentalEndDate = req.body.rentalEndDate;     // Assuming end date comes from the frontend
        const quantity = req.body.quantity || 1;          // Assuming a default quantity of 1 if not provided

        // 1. Validate User and Product
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please Log In" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        // 2. Retrieve User (might be adapted depending on your authentication system)
        const user = await User.findById(req.user._id);

        // 3. Update the Rental Cart
        const existingRentalItem = user.rentalCart.items.find(
            item => item.productId.toString() === productId.toString()
        );

        if (existingRentalItem) {
            // Update quantity only (adjust if different logic needed)
            existingRentalItem.quantity += quantity;
        } else {
            // Add new item
            user.rentalCart.items.push({
                productId,
                quantity,
                // rentalStartDate,
                // rentalEndDate
            });
        }

        await user.save();

        // 4. Response
        // res.status(200).json({ message: "Product added to rental cart!" });
        res.redirect('/rent/cart');
        console.log(user);
        console.log(product);

    } catch (error) {
        next(error); // Pass error to your error handling middleware
    }
};


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
