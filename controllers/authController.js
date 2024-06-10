const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mailService');

// controllers/authController.js

exports.getLogin = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.userType === 'admin') {
            console.log('already logged in as admin');
            res.redirect('/admin?warning=You are already logged in as admin!');
        } else if (req.user.userType === 'buyer') {
            console.log('already logged in as buyer');
            res.redirect('/?warning=You are already logged in!');
        }
    } else {
        const warningMessage = req.query.warning || '';
        res.render('./auth/login', { pageTitle: 'Login', path: '/login', warningMessage });
    }
};

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect(`/login?error=${info.message}`);
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            const userType = user.userType;
            if (userType === 'admin') {
                return res.redirect(`/admin?success=Login successful! Welcome ${user.username}!`);
            } else if (userType === 'buyer') {
                return res.redirect(`/?success=Login successful! Welcome ${user.username}!`);
            } else {
                return res.redirect('/login?warning=Unknown user type');
            }
        });
    })(req, res, next);
};

exports.getSingup = (req, res) => {
    const warningMessage = req.query.warning || '';
    if (req.isAuthenticated()) {
        if (req.user.userType === 'admin') {
            console.log('already logged in as admin');
            res.redirect(`/admin?warning=You are already logged in as admin!`);
        } else if (req.user.userType === 'buyer') {
            console.log('already logged in as buyer');
            res.redirect(`/?warning=You are already logged in!`);
        }
    } else {
        res.render('./auth/signup', { pageTitle: 'Signup', path: '/signup', warningMessage });
    }
};

exports.postSignup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.redirect('/signup?error=Invalid email format.');
        }
        let username = req.body.username;
        let email = req.body.email;
        if (username === undefined) {
            username = email.split('@')[0];
        }
        if (existingUser) {
            if (existingUser.username === req.body.username && req.body.username !== undefined) {
                return res.redirect(`/signup?warning=Username already taken. Please try another username.`);
            } else if (existingUser.email === req.body.email) {
                return res.redirect('/signup?warning=You are already registered with this email. Please login.');
            }
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            username: username,
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            userType: req.body.userType
        });
        const result = await user.save();
        const token = result.generateAuthToken();
        mailService.sendVerificationEmail(req.body.email, token);
        console.log('Email sent to:', req.body.email);
        res.redirect('/login?success=Signup successful. Please verify your email.');
    } catch (err) {
        return res.redirect(`/signup?error=${err.message}`);
    }
};

exports.getLogout = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }
        console.log('Session destroyed');
        res.redirect('/login?success=Logout successful!');
    });
};

exports.verifyEmail = async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = await User.verifyAuthToken(token);
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.redirect('/login?error=User not found');
        }
        if (user.verified) {
            return res.redirect('/login?info=Email already verified');
        }
        if (!user.verified) {
            user.verified = true;
            await user.save();
            return res.redirect('/login?success=Email verification successful');
        }
    } catch (error) {
        console.error(error);
        res.redirect(`/login?error=${error.message}`);
    }
};

exports.getForgetPassword = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.userType === 'admin') {
            console.log('already logged in as admin');
            res.redirect('/admin?warning=You are already logged in as admin!');
        } else if (req.user.userType === 'buyer') {
            console.log('already logged in as buyer');
            res.redirect('/?warning=You are already logged in!');
        }
    } else {
        const warningMessage = req.query.warning || '';
        res.render('./auth/forgetPassword', {
            pageTitle: 'Forget-Password',
            path: '/forgetPassword',
            warningMessage
        });
    }
};

exports.postForgetPassword = async (req, res) => {
    const { identifier } = req.body;
    try {
        let user;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(identifier)) {
            user = await User.findOne({ email: identifier });
        } else {
            user = await User.findOne({ username: identifier });
        }
        if (!user) {
            const warningMessage = req.query.warning || 'User not found';
            return res.render('./auth/forgetPassword', {
                pageTitle: 'Forget-Password',
                path: '/forgetPassword',
                warningMessage
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 24 hour
        await user.save();
        mailService.passwordReset(user, token);
        res.redirect('/login?success=Please check your email to reset password');
    } catch (err) {
        console.error(err);
        res.redirect('/forget-password?error=Password reset failed');
    }
};

exports.getResetPassword = async (req, res) => {
    const token = req.params.token;
    const warningMessage = req.query.warning || '';
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.redirect('/login?error=User not found');
        }
        if (typeof user.resetTokenExpiration === 'undefined' || user.resetTokenExpiration < Date.now()) {
            return res.redirect('/login?error=Token expired or invalid');
        }
        res.render('./auth/resetPassword', { token, pageTitle: 'Reset-Password', path: '/resetPassword', warningMessage });
    } catch (err) {
        res.redirect('/login?error=Invalid or expired token');
    }
};

exports.postResetPassword = async (req, res) => {
    const token = req.params.token;
    const newPassword = req.body.password;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.redirect('/login?error=User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        if (user.resetTokenExpiration < Date.now()) {
            return res.status(400).send('Token expired');
        }
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.redirect('/login?success=Password reset successful');
    } catch (err) {
        res.redirect('/login?error=Invalid or expired token');
    }
};
