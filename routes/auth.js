// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


const nodemailer = require('nodemailer');


var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: "c486150b023a89dbe3d0ba4d260d2baf"
    }
});



// const personalizedEmailContent = emailContent_reset
//     .replace('{{recipientName}}', name)
//     .replace('{{token}}', token);





// Login route

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
        res.render('./auth/login');
    }
}
);

router.post('/login', passport.authenticate('local'), (req, res) => {
    const userType = req.user.userType;

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


// Registration route

// router.post('/login', passport.authenticate('local'), (req, res) => {

//     const userType = req.user.userType;

//     if (userType === 'admin') {
//         // res.json({ message: 'Administrator login successfull!' });
//         res.redirect('/admin')
//         console.log('Administrator login successfull!');
//     }
//     else if (userType === 'buyer') {
//         res.redirect('/',)
//         // res.json({ message: 'Buyer login successfull!' });

//         console.log('Buyer login successfull!');
//     }
//     else {
//         res.status(500).json({ message: 'Unknown user type' });
//         console.log('Unknown user type');
//     }


//     // res.json({ message: 'Login successful!' }
// });

// router.get('/logout', (req, res) => {
//     req.logout()
//     .then(() => {
//         res.json({ message: 'Logout successful!' });
//     }).catch(err => {
//         res.json({ error: err.message });
//     });
//     // res.json({ message: 'Logout successful!' });
//     // console.log('Logout successful!');
//     res.redirect('/login');
// });

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error destroying session' });
        }
        // res.json({ message: 'Session destroyed' });
        console.log('Session destroyed');



        res.redirect('/');

    });
});




router.get('/signup', (req, res) => {

    if (req.isAuthenticated()) {
        res.json({ message: 'You are authenticated!' });
    }
    else {
        res.render('./auth/signup');
    }
}
);
router.post('/signup', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

        if (existingUser) {
            if (existingUser.username === req.body.username) {
                return res.status(400).json({ error: 'Username already exists. Choose a different username.' });
            } else {
                return res.status(400).json({ error: 'Email already exists. Choose a different email address.' });
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
        transport.sendMail({
            from: 'noreply@mrinmoy.org',
            to: req.body.email,
            subject: 'Signup succeeded!',
            html: `<h1>Welcome to our shop!</h1>
                <p>You successfully signed up!</p>
                // this will be expaired in 1 hour
                
                <p>Click this <a href="http://localhost:3000/verify/${token}">link</a> to verify your email address.</p>`,
                
        });
        res.redirect('/login');
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


// router.post('/signup', (req, res, next) => {
//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;
//     const userType = req.body.userType;


//     User.findOne({ $or: [{ username: username }, { email: email }] })
//         .then(existingUser => {
//             if (existingUser) {
//                 if (existingUser.username === username) {
//                     // Username is already taken, send an error response
//                     return res.status(400).json({ error: 'Username already exists. Choose a different username.' });
//                     // break;
//                 } else {
//                     // Email is already taken, send an error response
//                     return res.status(400).json({ error: 'Email already exists. Choose a different email address.' });
//                 }
//             }

//             // If both username and email are not taken, hash the password and create a new user
//             return bcrypt.hash(password, 12);
//         })
//         .then(hashedPassword => {
//             const user = new User({
//                 username: username,
//                 email: email,
//                 password: hashedPassword,
//                 userType: userType
//             });
//             return user.save();
//         })
//         .then(result => {
//             // res.json({ message: 'Registration successful!' });
//             const token = user.generateAuthToken();

//             transport.sendMail({
//                 from: 'norepley@mrinmoy.org',
//                 to: email,
//                 subject: 'Signup succeeded!',
//                 html: `<h1>Welcome to our shop!</h1>
//                 <p>You successfully signed up!</p>
//                 <p>Click this <a href="http://localhost:3000/verify/${token}">link</a> to verify your email address.</p>`
//             });
//             res.redirect('/login');
//             console.log('email sent');
//             console.log(result);
//         })
//         .catch(err => {
//             return res.status(500).json({ error: err.message });


//             // console.log(err);
//         });
// })


router.get('/verify/:token', async (req, res) => {
    const token = req.params.token;

    try {
        // Verify the token
        const decodedToken = await  User.verifyAuthToken(token);

        // if(decodedToken.message){
        //     // console.log('Token verification from:', decodedToken.message);
        //     // return res.status(404).json({ error: decodedToken.message, message: 'Invalid token' });
        // }
        
        // Find the user associated with the token
        const user = await User.findById(decodedToken._id);
        // console.log('Token verification from:', decodedToken);
        // console.log('Token verification successful:', user);
        // console.log('Token verification successful:');


        if (!user) {

            return res.status(404).json({ error, message: 'User not found'});
            // return res.status(404).json({'Token verification from:', decodedToken.message });
            // return res.status(404).json({'Token verification from:', decodedToken.message });
        }

        if (user.verified) {
        user.verified = true;
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



// router.post('/signup', (req, res) => {
//     // Create a new user
//     User.register(new
//         User({
//             username: req.body.username,
//             email: req.body.email,
//             userType: req.body.userType

//         }),
//         req.body.password, (err, user) => {
//             if (err) {
//                 return res.json({ error: err.message });
//             }
//             passport.authenticate('local')(req, res, () => {
//                 res.json({ message: 'Registration successful!' });
//             });
//         });
// }
// );
// router.get('/login', (req, res, next) => {
//     res.render('login');
//     // res.send('login');
// });

// router.get('/signup', (req, res, next) => {
//     res.render('signup');
//     // res.send('login');
// });

// router.post('/signup', (req, res, next) => {

//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;

//     const user = new User({
//         username: username,
//         email: email,
//         password: password
//     });

//     user.save();

//     res.send('signup');
//     // res.render('login');


// });








// // Registration route
// router.post('/register', (req, res) => {
//   // Create a new user
//   User.register(new User({ username: req.body.username, userType: req.body.userType }), req.body.password, (err, user) => {
//     if (err) {
//       return res.json({ error: err.message });
//     }
//     passport.authenticate('local')(req, res, () => {
//       res.json({ message: 'Registration successful!' });
//     });
//   });
// });

// // Login route
// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.json({ message: 'Login successful!' });
// });

module.exports = router;
// module.exports = router;
