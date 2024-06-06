const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const session = require('express-session');
const stripe = require('stripe')('sk_test_51OaQJHSJMzEXtTp5BWhpMqM7N5000X4Mt2M9bR31hvgJnb7OGnBw8n1AjFnlgOI9NHYnRtKPUO9CSQPI27q55b6L001og14MAB')


// const User = require('../models/User');
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

exports.getCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'cart.items.productId',
      model: 'Product'
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total price of cart items
    const totalPrice = user.cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    const cartItems = user.cart.items;

    const successUrl = req.protocol + '://' + req.get('host') + '/shop/checkout/success';
    // const successUrl = `${req.protocol}://${req.get('host')}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = req.protocol + '://' + req.get('host') + '/shop/checkout/cancel';
    const sessionId = generateUniqueSessionId(); // Implement your own function

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          // currency: 'usd',
          currency: 'INR',  // Modify as needed

          product_data: {
            name: item.productId.name,
            description: item.productId.description,

            // images: [constructImageUrl(item.productId.imageUrl)], // Construct the image URL




            // images: [item.productId.imageUrl],
          },
          unit_amount: item.productId.price * 100,
          // unit_amount: item.productId.rentalInfo.rentalPricePerDay * durationInDays * 100,
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
    req.session.expectedSessionId = sessionId;
    await req.session.save();
    let profilePic = req.user ? req.user.profilePic : null;
    let username = req.user ? req.user.username : null;

    res.render('./user/shopCheckout', {
      items: cartItems,
      user: user,
      totalPrice: totalPrice,
      pageTitle: 'Shop Checkout',
      // session,
      sessionId: session.id,
      path: '/checkout',
      username: username,
      profilePic: profilePic
    });
    // res.json({ user, items: user.cart.items, totalPrice });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};


exports.postOrder = async (req, res, next) => {
  try {
    res.json({ message: 'Order submitted successfully' });
  }
  catch (error) {
    next(error); // Pass error to the error-handling middleware
  }

};

exports.getShopCheckoutSuccess = async (req, res, next) => {
  try {
    const sessionId = req.query.session_id;
    // const { userId, products, totalPrice, shippingAddress } = req.body; // Assuming you receive this data from the payment success webhook or frontend
    console.log(req.user);

    console.log(sessionId);
    const expectedSessionId = req.session.expectedSessionId;
    if (sessionId !== expectedSessionId) {
      return res.status(400).send('Invalid session ID');
    }
    if (!sessionId) {
      return res.status(400).send('Invalid session ID');
    }

    if (sessionId === expectedSessionId) {
      console.log('session id is valid');
    }


    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }


    // const productItems = products.map(product => ({
    //   product: product.productId,
    //   quantity: product.quantity
    // }));
    const products = req.user.cart.items.map(i => {
      // return { quantity: i.quantity, product: { ...i.productId._doc } };
      return { quantity: i.quantity, product: { ...i.productId._doc } };

  });

    // Create a new order
    const order = new Order({
      userId: req.user.id,
      userEmail: req.user.email,
      productId: req.user.rentalCart.items.map(item => item.productId),

      // products: products,
      // totalPrice,
      // shippingAddress,
      paymentStatus: 'Paid', // Set payment status as paid
      status: 'Pending' // Set initial status as pending
      // status: 'Pendin' // Set initial status as pending
    });

    // Save the order to the database
    // if (session.payment_status === 'paid') {
    //   newRental.paymentStatus = 'paid';
    // }
    await order.save();


    req.user.cart.items = [];
    req.session.expectedSessionId = null;
    req.user.save();

    res.json({ message: 'Order placed successfully', order });


  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }

};

exports.getShopCheckoutCancel = async (req, res, next) => {
  try {

  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }

};


