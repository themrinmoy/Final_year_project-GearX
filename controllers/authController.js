const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mailService');



exports.getLogin = (req, res) => {
    if (req.isAuthenticated()) {
        
        if (req.user.userType === 'admin') {
            console.log('alredy logged in as admin');
            res.redirect('/admin?warning=You are already logged in as admin!');
        }
        else if (req.user.userType === 'buyer') {
            console.log('alredy logged in as buyer');
            res.redirect('/?warning=You are already logged in!');
        }

    }
    else {
        warningMessage = req.query.warning || '';
        // const warningMessage = req.query.message || '';
        //  warningMessage =  'hello world';

        res.render('./auth/login', { pageTitle: 'Logins', path: '/login', warningMessage});
    }
}


// POST Login
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed, redirect with error message
            return res.redirect(`/login?warning=${info.message}`);
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            // console.log(user, 'user')
            const userType = user.userType;
            if (userType === 'admin') {
                // Admin login successful, redirect to admin dashboard
                return res.redirect('/admin');
            } else if (userType === 'buyer') {
                // Buyer login successful, redirect to home page
                return res.redirect('/');
            } else {
                return res.redirect('/login?warning=Unknown user type');
            }
        });
    })(req, res, next);
}


// GET Register
exports.getSingup = (req, res) => {
    const warningMessage = req.query.warning || '';

    if (req.isAuthenticated()) {
        // res.json({ message: 'You are authenticated!' });
        if (req.user.userType === 'admin') {
            console.log('alredy logged in as admin');
            res.redirect('/admin?warning=You are already logged in as admin!');
        }
        else if (req.user.userType === 'buyer') {
            console.log('alredy logged in as buyer');
            res.redirect('/?warning=You are already logged in!');
        }
    }
    else {
        res.render('./auth/signup', { pageTitle: 'Signup', path: '/signup', warningMessage });
    }
}

// POST Signup
exports.postSignup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            // return res.status(400).json({ error: 'Invalid email format.' });
            return res.redirect('/signup?warning=Invalid email format.');
        }

        if (existingUser) {
            if (existingUser.username === req.body.username) {
                // return res.status(400).json({ error: 'Username already taken.' });
                return res.redirect('/signup?warning=Username already taken.');
            } else if (existingUser.email === req.body.email) {
                // return res.status(400).json({ error: 'Email already taken.' });
                return res.redirect('/signup?warning=You are already registered with this email. Please login.');
            }
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
        mailService.sendVerificationEmail(req.body.email, token);
        // sendVerificationEmail(req.body.email, token);
        console.log('Email sent to:', req.body.email);
        res.redirect('/login?warning=Signup successful. Please verify your email.');
    } catch (err) {
        // return res.status(500).json({ error: err.message });
        return res.redirect('/signup?warning=Signup failed. Please try again.');
    }
}

// GET Logout
exports.getLogout = (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        // If the user is not authenticated, simply redirect to the login page without displaying a message
        return res.redirect('/login');
    }

    // If the user is authenticated, destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }
        console.log('Session destroyed');

        // Redirect to the login page with the logout message
        res.redirect('/login?warning=Logout successful!');
    });
}

// token verification
exports.verifyEmail =  async (req, res) => {
    const token = req.params.token;

    try {
        // Verify the token
        const decodedToken = await User.verifyAuthToken(token);
        console.log('Token verification from:', decodedToken);



        // Find the user associated with the token
        const user = await User.findById(decodedToken._id);
        console.log('Token verification from:', user);



        if (!user) {

            // return res.status(404).json({ error, message: 'User not found' });
            // return res.redirect('/login?warning=User not found');
            const warningMessage = req.query.warning || '';

            return res.render('./auth/login', { pageTitle: 'Logins', path: '/login', warningMessage: info.message });

        }

        // console.log(user.verified, 'user.verified');
        if (user.verified) {
            // return res.status(400).json({ message: 'Email already verified' });
            return res.redirect('/login?warning=Email already verified');
        }
        if (!user.verified) {
            user.verified = true;
            // return res.status(400).json({ message: 'Email already verified' });
            await user.save();

            return res.redirect('/login?warning=Email verification successful');
            // return res.status(200).json({ message: 'Email verification successful' });
            // res.status(200).json({ message: 'Email verification successful' });
            // res.redirect('/login');
        }

        // res.redirect('/login');
    } catch (error) {
        console.error(error);
        console.error(error.message);
        // res.status(500).json({ error: 'Internal Server Error', error: error.message });
        res.redirect(`/login?warning=${error.message}`);

    }
}


// password reset or forget password

exports.getForgetPassword = async (req, res) => {

    // If user is already logged in, redirect to home page
    if (req.isAuthenticated()) {
        if (req.user.userType === 'admin') {
            console.log('alredy logged in as admin');
            res.redirect('/admin?warning=You are already logged in as admin!');
        }
        else if (req.user.userType === 'buyer') {
            console.log('alredy logged in as buyer');
            res.redirect('/?warning=You are already logged in!');
        }
    }
    else {

        const warningMessage = req.query.warning || '';
        res.render('./auth/forgetPassword',
            {
                pageTitle: 'Forget-Password',
                path: '/forgetPassword', warningMessage
            });
    }
}

// post forget password and send mail with reset token
exports.postForgetPassword = async (req, res) => {
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
            // return res.status(404).json({ message: 'User not found' });
            // return res.redirect('/forget-password?warning=User not found');

            const warningMessage = req.query.warning || 'User not found';
            return res.render('./auth/forgetPassword',
                {
                    pageTitle: 'Forget-Password',
                    path: '/forgetPassword', warningMessage
                });
        }

        // Generate a reset token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 24 hour

        await user.save();
        // Send email with the reset token
        mailService.passwordReset(user.email, token);

        res.redirect('/login?warning=Password reset link sent to your email');
    } catch (err) {
        console.error(err);
        res.redirect('/forget-password?warning=Password reset failed');
    }
}

// get reset password page with  token verification form user email
exports.getResetPassword = async (req, res) => {
    const token = req.params.token;
    // console.log(token, 'token');
    const warningMessage = req.query.warning || '';

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
        res.render('./auth/resetPassword', { token, pageTitle: 'Reset-Password', path: '/resetPassword', warningMessage });
    } catch (err) {
        res.redirect('/login?warning=Invalid or expired token');
    }
}

// post reset password again token verification and update password
exports.postResetPassword = async (req, res) => {
    const token = req.params.token;
    const newPassword = req.body.password;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.userId);
        if (!user) {
            return res.redirect('/login?warning=User not found');
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


        res.redirect('/login?warning=Password reset successful');

    } catch (err) {
        // res.status(400).send('Invalid or expired token');
        res.redirect('/login?warning=Invalid or expired token');
    }
}

