// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


const mail = require('./mail');

const User = require('../models/User');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;



const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://gearx.mrinmoy.org/google/callback'
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
                verified: true,
                userType: 'buyer'
            });
            await user.save();
            mail.signupSuccess(email, user);
        }

        else if (!user.googleId) {
            user.googleId = profile.id;
            user.verified = true;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

router.post('/login', passport.authenticate('local'), (req, res) => {
    const userType = req.user.userType;
    console.log('User type:', userType);
    if (!req.user.verified) {
        // req.logout();
        return res.status(401).json({ message: 'Email not verified. Please verify your email.' });
    }

    if (userType === 'admin') {
        res.redirect('/admin');
        console.log('Administrator login successful!');
    } else if (userType === 'buyer') {
        res.redirect('/');
        console.log('Buyer login successful!');
    } else {
        res.status(500).json({ message: 'Unknown user type' });
        console.log('Unknown user type');
    }
});


router.post('/forget-password', async (req, res) => {
    const { identifier } = req.body;


    try {
        // Find the user by email or username
        let user;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(identifier)) {
            console.log('emailRegex.test(identifier)', emailRegex.test(identifier));
            console.log('identifier', identifier);
            user = await User.findOne({ email: identifier });
        } else {
            user = await User.findOne({ username: identifier });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 24 hour

        await user.save();
        // Send email with the reset token
        mail.passwordReset(user.email, token);

        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// router.get('/reset/:token', async (req, res) => {
// const
router.get('/reset-password/:token', async (req, res) => {
    const token = req.params.token;
    // console.log(token, 'token');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(payload, 'payload');

        const user = await
            User.findById(payload.userId);
        // console.log(user, 'user');
        if (!user) {
            return res.status(404).send('User not found');
        }

       
        if (typeof user.resetTokenExpiration === 'undefined' || user.resetTokenExpiration < Date.now()) {
            console.log('Token expired');
            return res.json({ message: 'Token expired' });
        }
        res.render('./auth/resetPassword', { token, pageTitle: 'Reset-Password', path: '/resetPassword' });
    } catch (err) {
        res.status(400).send('Invalid or expired token');
    }
});

// Endpoint to set a new password
router.post('/reset-password/:token', async (req, res) => {
    const token = req.params.token;
    const newPassword = req.body.password;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        if (user.resetTokenExpiration < Date.now()) {
            return res.status(400).send('Token expired');
        }


        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save().then(result => {
            console.log('Password set successfully');
        }).catch(error => {
            console.error('Password setting failed:', error);
        });


        // res.send('Password set successfully');
        res.redirect('/login');

    } catch (err) {
        res.status(400).send('Invalid or expired token');
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);


        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        await user.save();

        res.send('Password set successfully');
    } catch (err) {
        res.status(400).send('Invalid or expired token');
    }
});

// router.get

router.get('/forget-password', async (req, res) => {

    // If user is already logged in, redirect to home page
    if (req.isAuthenticated()) {
        if (req.user.userType === 'admin') {
            console.log('alredy logged in as admin');
            res.redirect('/admin');
        }
        else if (req.user.userType === 'buyer') {
            console.log('alredy logged in as buyer');
            res.redirect('/');
        }
    }
    else {
        res.render('./auth/forgetPassword',
            {
                pageTitle: 'Forget-Password',
                path: '/forgetPassword'
            });
    }
});


router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        // res.json({ message: 'You are authenticated!' });
        if (req.user.userType === 'admin') {
            console.log('alredy logged in as admin');
            res.redirect('/admin');

            // res.json({ message: 'Administrator login successfull!' });
        }
        else if (req.user.userType === 'buyer') {
            console.log('alredy logged in as buyer');
            res.redirect('/');
        }

        // res.redirect('/', message = 'You are authenticated!');
        // res.redirect('/');
    }
    else {
        res.render('./auth/login', { pageTitle: 'Login', path: '/login' });
    }
}
);






router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }
        console.log('Session destroyed');



        res.redirect('/');

    });
});




router.get('/signup', (req, res) => {

    if (req.isAuthenticated()) {
        res.json({ message: 'You are authenticated!' });
    }
    else {
        res.render('./auth/signup', { pageTitle: 'Signup', path: '/signup' });
    }
}
);
router.post('/signup', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // If both username and email are not taken, hash the password and create a new user
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            userType: req.body.userType
        });

        const result = await user.save();

        const token = result.generateAuthToken();
        // Send verification email...
        mail.sendVerificationEmail(req.body.email, token);
        // sendVerificationEmail(req.body.email, token);
        console.log('Email sent to:', req.body.email);
        // res.redirect('/login');
        res.status(201).json({ message: 'Registration successful! Please verify your email' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});





router.get('/verify/:token', async (req, res) => {
    const token = req.params.token;

    try {
        // Verify the token
        const decodedToken = await User.verifyAuthToken(token);
        console.log('Token verification from:', decodedToken);



        // Find the user associated with the token
        const user = await User.findById(decodedToken._id);
        console.log('Token verification from:', user);



        if (!user) {

            return res.status(404).json({ error, message: 'User not found' });

        }

        // console.log(user.verified, 'user.verified');
        if (user.verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        if (!user.verified) {
            user.verified = true;
            // return res.status(400).json({ message: 'Email already verified' });
            await user.save();

            return res.status(200).json({ message: 'Email verification successful' });
            // res.status(200).json({ message: 'Email verification successful' });
            // res.redirect('/login');
        }

        // res.redirect('/login');
    } catch (error) {
        console.error(error);
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error', error: error.message });
    }
});



module.exports = router;

