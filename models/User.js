// models/User.js 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
// const passportLocalMongoose = require('passport-local-mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    googleId: { type: String, unique: true },
    // profilePic: { type: String },
    profilePic: { type: String, default: '/img/user.png' },
    resetToken: {
        type: String,
        require: false
    },
    resetTokenExpiration: Date,
    verified: { type: Boolean, default: false },

    userType: { type: String, enum: ['buyer', 'admin'], default: 'admin' },
    cart: {
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    },
    rentalCart: {
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: false },
        }],
        StartDate: {
            type: Date,
            // min: Date.now-1,

            default: Date.now,
            required: false
        },
        EndDate: {
            type: Date,
            default: Date.now,
            required: false
        },

    },
    usedTokens: [{ type: String }],
    rentals: [{
        rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]

    // rentals: [{
    //     rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
    // }],
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;

};


userSchema.statics.verifyAuthToken = async function (token) {


    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken._id);

        if (user.usedTokens.includes(token)) {
            console.log('Token has already been used:', token);
            throw new Error('Token has already been used');
        }
        user.usedTokens.push(token);
        await user.save().then(result => {
            console.log('Token saved:', token);
        }).catch(error => {
            console.error('Token saving failed:', error);
        });

        return decodedToken;


    } catch (error) {

        console.error('Token verification failed:', error);
        throw new Error(error.message);

    }

};








userSchema.statics.authenticate = async function (usernameOrEmail, password) {

    const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail);

    // const user = await this.findOne({ username });
    let user;
    if (isEmail) {
        // If input is an email address, find user by email
        user = await this.findOne({ email: usernameOrEmail });
    } else {
        // Otherwise, find user by username
        user = await this.findOne({ username: usernameOrEmail });
    }

    if (!user) {
        throw new Error(' User not found.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error(' Incorrect password.');
    }
     if (!user.verified) {
        throw new Error('Email not verified. Please verify your email');
    }
    return user;
}

userSchema.methods.removeFromcart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.removeFromRentalCart = function (productId) {
    const updatedRentalCartItems = this.rentalCart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.rentalCart.items = updatedRentalCartItems;
    return this.save();
}

const User = mongoose.model('User', userSchema);
module.exports = User;
