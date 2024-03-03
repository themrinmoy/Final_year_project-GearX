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
  
        res.render('rent/all.ejs', {  products, pageTitle: ' for Rent', categoryTitle: "Ready for Rent"});
        console.log(products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
        // You may want to create an 'error.ejs' view to handle error messages
      });
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
