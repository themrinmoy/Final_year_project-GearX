const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
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

exports.getCheckoutOld = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'cart.items.productId',
      model: 'Product'
    });

    if (!user) {
      return res.redirect('/login?warning=Unauthorized: Please Log In');
    }



    // Calculate total price of cart items
    const totalPrice = user.cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    const cartItems = user.cart.items;

    if (cartItems.length === 0) {
      return res.redirect('/cart?warning=Cart is empty');
    }

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
            description: item.productId.description || 'No description provided',

            // images: [constructImageUrl(item.productId.imageUrl)], // Construct the image URL




            // images: [item.productId.imageUrl],
          },
          unit_amount: item.productId.price * 100,

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


    res.render('user/shopCheckout', {
      items: cartItems,
      user: user,
      totalPrice: totalPrice,
      pageTitle: 'Shop Checkout',
      // session,
      sessionId: session.id,
      path: '/checkout'
    });
    // res.json({ user, items: user.cart.items, totalPrice });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware

    res.redirect('/shop/checkout?error=Error processing payment');
  }
};


exports.getCheckout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'cart.items.productId',
      model: 'Product'
    });

    if (!user) {
      return res.redirect('/login?warning=Unauthorized: Please Log In');
    }

    const cartItems = user.cart.items;

    if (cartItems.length === 0) {
      return res.redirect('/cart?warning=Cart is empty');
    }

    // Calculate total price of cart items
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    const successUrl = req.protocol + '://' + req.get('host') + '/shop/checkout/success';
    const cancelUrl = req.protocol + '://' + req.get('host') + '/shop/checkout/cancel';

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe uses the smallest currency unit
      currency: 'inr',
      metadata: { integration_check: 'accept_a_payment' },
      receipt_email: user.email,

    });

    req.session.paymentIntentId = paymentIntent.id;
    await req.session.save();
    const sessionId = generateUniqueSessionId();

    req.session.expectedSessionId = sessionId;
    await req.session.save();
    res.render('user/shopCheckout', {
      items: cartItems,
      user: user,
      totalPrice: totalPrice,
      sessionId,
      pageTitle: 'Shop Checkout',
      clientSecret: paymentIntent.client_secret,
      path: '/checkout'
    });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
    res.redirect('/shop/checkout?error=Error processing payment');
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
    const sessionId = req.query.session_id || "No session ID provided";
    // const { userId, products, totalPrice, shippingAddress } = req.body; // Assuming you receive this data from the payment success webhook or frontend
    // console.log(req.user);

    console.log(sessionId);
    const expectedSessionId = req.session.expectedSessionId || "No expected session ID provided";
    if (sessionId !== expectedSessionId) {
      // return res.redirect('/shop/checkout?warning=Invalid session ID');

    }
    if (!sessionId) {
      // return res.redirect('/shop/checkout?warning=Invalid session ID');
    }

    if (sessionId === expectedSessionId) {
      // console.log('session id is valid');
    }
    const products = req.user.cart.items.map(i => {

      return {
        quantity: i.quantity,
        product: i.productId
      };

    });
    const user = await User.findById(req.user._id);

    const cartTotal = await user.calculateCartTotal();

    // Create a new order
    const order = new Order({
      userId: req.user.id,
      userEmail: req.user.email,
      products: products,
      totalPrice: cartTotal,
      shippingAddress: req.user.address || 'No address provided',
      paymentStatus: 'Pending', // Set payment status as paid
      status: 'Processing' // Set initial status as pending
      // status: 'Pendin' // Set initial status as pending
    });

    // check webhook for payment status
    const paymentIntent = await stripe.paymentIntents.retrieve(req.session.paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      console.log(paymentIntent, 'paymentIntent');
      order.paymentStatus = 'Paid';
      await order.save();
    } else {
      return res.redirect('/shop/checkout?warning=Payment not successful');
    }



    req.user.cart.items = [];
    req.session.expectedSessionId = null;
    if (!req.user.orders) {
      req.user.orders = [];
    }
    req.user.orders.push(order._id);

    await req.user.save();
    console.log('Order submitted successfully');




    res.redirect('/order?success=Order submitted successfully');


  } catch (error) {
    res.redirect(`/shop/checkout?warning=${error.message}`);
    console.error(error);
    // res.json({ error: error.message });
  }

};

exports.getShopCheckoutCancel = async (req, res, next) => {
  try {

    res.redirect('/shop/checkout?warning=Payment cancelled');

  } catch (error) {

    res.redirect(`/shop/checkout?error=${error.message}`);

  }

};


