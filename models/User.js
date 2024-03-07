// models/User.js 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const passportLocalMongoose = require('passport-local-mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
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
    // rentals: [{
    //     rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
    // }],
});
// userSchema.plugin(passportLocalMongoose); 
// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' } ); 

// userSchema.add({
//     usedTokens: [{ type: String }]
// });
// Methods for generating and verifying tokens
// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ _id: this._id }, 'yourSecretKey'); // Change 'yourSecretKey' to a secure secret
//     return token;
// };
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, 'yourSecretKey', { expiresIn: '1h' });
    // Change 'yourSecretKey' to a secure secret, and '1h' to the desired expiration time

    // const token = jwt.sign({ _id: this._id }, 'yourSecretKey', { expiresIn: '1h' });
    // Store the generated token in the usedTokens array
    // this.usedTokens.push(token);


    this.usedTokens.push(token);
    this.save().then(result => {
        console.log('Token saved:', token);
    }).catch(error => {
        console.error('Token saving failed:', error);
    });
    // Save the user instance to the database
    return token;
    // return token;
};

// userSchema.methods.verifyAuthToken = function (token) {
userSchema.statics.verifyAuthToken = async function (token) {


    try {
        // Check if the token has been used before
        // if (this.usedTokens.includes(token)) {
        //     throw new Error('Token has already been used');
        // }

        // Verify the token
        const decodedToken = jwt.verify(token, 'yourSecretKey');

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
        // Handle the error (e.g., token expired, invalid signature, token already used)
        console.error('Token verification failed:', error);
        // console.log(error.message, 'error')
        throw new Error(error.message);

    }

};

// userSchema.statics.verifyAuthToken = async function (token) {
// userSchema.statics.verifyAuthToken = function (token) {
//     try {
//         // console.log(this , 'this')
//         // console.log(this , 'this')
//         // console.log('Token:', token);
//         // this.usedTokens.push(token);
//         // Check if the token has been used before
//         // if (this.usedTokens.includes(token)) {
//         //     console.log('Token has already been used:', token);
//         //     throw new Error('Token has already been used');
//         // }

//         // Verify the token
//         const decodedToken = jwt.verify(token, 'yourSecretKey');

//         // const user = User.findOne({ _id: decodedToken._id });
//         //  user.usedTokens.push(token).then;

//         // User.usedTokens.push(token);
//         // console.log(user, 'user')



//         // Mark the token as used
//         // this.usedTokens.push(token);

//         // this.save();

//         console.log('Token verification successful:', decodedToken);
//         return decodedToken;

//     } catch (error) {
//         // Handle the error (e.g., token expired, invalid signature, token already used)
//         console.error('Token verification failed:', error);
//         // throw new Error('Invalid token');
//     }
// };





// userSchema.statics.verifyAuthToken = function (token) {

//     try {
//         const decodedToken = jwt.verify(token, 'yourSecretKey');
//         return decodedToken;

//     }
//     catch (error) {
//         throw new Error('Invalid token');
//     }
// };
// userSchema.add({
// });

// userSchema.statics.verifyAuthToken = function (token) {
//     try {
//         // Check if the token has been used before
//         if (this.usedTokens.includes(token)) {
//             throw new Error('Token has already been used');
//         }

//         // Verify the token
//         const decodedToken = jwt.verify(token, 'yourSecretKey');

//         // If verification is successful, mark the token as used
//         this.usedTokens.push(token);

//         return decodedToken;
//     } catch (error) {
//         // Handle the error (e.g., token expired, invalid signature, token already used)
//         throw new Error('Invalid token');
//     }
// };


userSchema.statics.authenticate = async function (username, password) {
    const user = await this.findOne({ username });

    if (!user) {
        throw new Error('Authentication failed. User not found.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Authentication failed. Incorrect password.');
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


// userSchema.statics.authenticate = async function (username, password) {
//     const user = await this.findOne({ username });

//     if (!user) {
//         throw new Error('Authentication failed. User not found.');
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (!isPasswordMatch) {
//         throw new Error('Authentication failed. Incorrect password.');
//     }
//     return user;

// }


// userSchema.methods.removeFromcart = function (productId) {

//     const updatedCartItems = this.cart.items.filter(item => {
//         return item.productId.toString() !== productId.toString();
//     });

//     this.cart.items = updatedCartItems;
//     return this.save();
// }
// const User = mongoose.model('User', userSchema);
// module.exports = User;