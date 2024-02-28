// models/User.js 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passportLocalMongoose = require('passport-local-mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    userType: { type: String, enum: ['buyer', 'admin'], default: 'buyer' },
    cart: {
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});
// userSchema.plugin(passportLocalMongoose); 
// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' } ); 


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
const User = mongoose.model('User', userSchema);
module.exports = User;