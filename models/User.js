// models/User.js 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passportLocalMongoose = require('passport-local-mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    userType: { type: String, enum: ['buyer', 'administrator'], default: 'buyer' },
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
const User = mongoose.model('User', userSchema);
module.exports = User;