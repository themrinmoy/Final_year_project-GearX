// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const User = require('../models/User');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mailService = require('../services/mailService');



const callbackURL = process.env.NODE_ENV === 'production'
    ? `https://${process.env.DOMAIN}/google/callback`
    : 'http://localhost:3000/google/callback';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // Find the user by Google ID or email
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: email }] });

        if (!user) {
            // Create new user if they don't exist
            user = new User({
                googleId: profile.id,
                username: email.substring(0, email.indexOf('@')),
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
                verified: true,
                userType: 'buyer'
            });
            await user.save();
            mailService.signupSuccess( user);
        }

        else if (!user.googleId) {
            user.googleId = profile.id;
            user.verified = true;
            if (!user.profilePic || user.profilePic === '/img/user.png') {
                user.profilePic = profile.photos[0].value;
            }
            if (!user.name) {
                user.name = profile.displayName;
            }
            // user.profilePic = profile.photos[0].value;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// get login
router.get('/login', authController.getLogin);

// post login
router.post('/login', authController.postLogin);

// get signup
router.get('/signup', authController.getSingup);

// post signup
router.post('/signup', authController.postSignup);

// email verification via jwt token
router.get('/verify/:token', authController.verifyEmail);

// get forget-password page
router.get('/forget-password', authController.getForgetPassword);


// post forget-password and send user an email with token for verification
router.post('/forget-password', authController.postForgetPassword);


// Endpoint to reset password with token for verification
router.get('/reset-password/:token', authController.getResetPassword);

// Endpoint to set a new password with token for verification
router.post('/reset-password/:token', authController.postResetPassword );


// logout
router.get('/logout', authController.getLogout);












module.exports = router;

