// CartController.js

const Product = require('../models/Product');
const User = require('../models/User');

class CartController {
    addToCart(req, res) {
        const { productId } = req.body;

        // Check if the product exists
        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                // Check if the user is authenticated
                if (!req.isAuthenticated()) {
                    return res.status(401).json({ message: 'User not authenticated' });
                }

                // Get the authenticated user
                const user = req.user;

                // Add the product to the user's shopping cart
                user.shoppingCart.push({
                    product: productId,
                    quantity: 1, // You can adjust this based on your requirements
                });

                // Save the user with the updated shopping cart
                return user.save();
            })
            .then(() => {
                return res.status(200).json({ message: 'Product added to cart successfully' });
            })
            .catch((error) => {
                console.error('Error adding product to cart:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    };



    removeFromCart(req, res) {

        const productIdToRemove = req.body.product_id;

        const userCart = req.session.cart;

        const indexOfProduct = userCart.findIndex(item => item.productId === productIdToRemove);

        if (indexOfProduct !== -1) {

            userCart.splice(indexOfProduct, 1);

            req.session.cart = userCart;

            return res.json({ message: 'Product removed from cart successfully' });
        }
        else {

            return res.status(404).json({ message: 'Product not found in the cart' });
        }
    }

    showCart(req, res) {
        const userCart = req.session.cart;

        return res.json(userCart);
    }

    showCart(req, res) {
        // Assuming the user is logged in and you're using Passport
        const user = req.user;

        user.populate('cart.items.productId').execPopulate()
            .then(() => {
                const cartContents = user.cart.items;
                res.render('cart', { cartContents }); // Render a view with the cart contents
            })
            .catch((error) => {
                console.error('Error fetching cart contents:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    };

    checkout(req, res) {

        const userCart = req.session.cart;

        // Assuming you have a Cart model
        const cart = new Cart({
            items: userCart,
            user: req.user._id,
        });

        cart.save()
            .then(() => {
                req.session.cart = [];
                return res.json({ message: 'Checkout successful' });
            })
            .catch((error) => {
                console.error('Error checking out:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    }

    // Other methods...





}

// // Other methods for showCart and checkout can be added here





// Assuming you have a Cart model
// const Cart = require('./models/Cart');

// Other imports...

// // class CartController {
//     // Existing methods...

//     static removeFromCart(req, res) {
//         // Extract product information from the request
//         const productIdToRemove = req.body.product_id;

//         // Assuming you have a user session storing the cart information
//         const userCart = req.session.cart;

//         // Check if the product is in the cart
//         const indexOfProduct = userCart.findIndex(item => item.productId === productIdToRemove);

//         if (indexOfProduct !== -1) {
//             // Remove the product from the cart
//             userCart.splice(indexOfProduct, 1);

//             // Update the session cart
//             req.session.cart = userCart;

//             // Return a success response
//             return res.json({ message: 'Product removed from cart successfully' });
//         } else {
//             // Return an error response if the product is not found in the cart
//             return res.status(404).json({ message: 'Product not found in the cart' });
//         }
//     }

//     // Other methods...
// // }

//   // Other methods for showCart and checkout can be added here


module.exports = new CartController();
