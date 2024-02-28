// controllers/CartController.js

const User = require('../models/User');
const Product = require('../models/Product');

const CartController = {


    showCart: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).populate({
                path: 'cart.items.productId',
                model: 'Product',
                select: 'name price imageUrl', // Specify the fields you want to select
            });
            res.render('./user/cart', { cart: user.cart });
        } catch (error) {
            console.error('Error displaying cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    addToCart: (req, res) => {
        const productId = req.params.productId;
        const user = req.user; // Assuming you're using Passport for authentication

        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                const existingCartItem = user.cart.items.find(item => item.productId.equals(product._id));

                if (existingCartItem) {
                    // If the product is already in the cart, increment the quantity
                    existingCartItem.quantity += 1;
                } else {
                    // If the product is not in the cart, add it with a quantity of 1
                    user.cart.items.push({ productId: product._id, quantity: 1 });
                }

                return user.save();
            })
            .then(() => {
                // res.json({ message: 'Item added to cart successfully' });
                console.log('Item added to cart successfully');
                res.redirect('/cart');
            })
            .catch((error) => {
                console.error('Error adding item to cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },


    postCartDeleteProduct : (req, res, next) => {
        console.log('postCartDeleteProduct()')
    
        const prodId = req.body.productId;
        req.user
            .removeFromcart(prodId)
            .then(result => {
                res.redirect('/cart')
            })
            .catch(err => {
                console.log(err);
            });
    
    }


};

module.exports = CartController;
