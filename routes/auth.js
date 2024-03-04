// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');



// Login route

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        // res.json({ message: 'You are authenticated!' });
        if(req.user.userType === 'admin'){
            console.log('alredy logged in as admin');
            res.redirect('/admin');
            
            // res.json({ message: 'Administrator login successfull!' });
        }
        else if(req.user.userType === 'buyer'){
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


// Registration route

router.post('/login', passport.authenticate('local'), (req, res) => {

    const userType = req.user.userType;

    if (userType === 'admin') {
        // res.json({ message: 'Administrator login successfull!' });
        res.redirect('/admin')
        console.log('Administrator login successfull!');
    }
    else if (userType === 'buyer') {
        res.redirect('/',)
        // res.json({ message: 'Buyer login successfull!' });

        console.log('Buyer login successfull!');
    }
    else {
        res.status(500).json({ message: 'Unknown user type' });
        console.log('Unknown user type');
    }


    // res.json({ message: 'Login successful!' }
});

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

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;


    User.findOne({ username: username })
    .then(existingUser => {
        if (existingUser) {
            // Username is already taken, send an error response
            return res.status(400).json({ error: 'Username already exists. Choose a different username.' });
        }

        // If username is not taken, hash the password and create a new user
        return bcrypt.hash(password, 12);
    })

    // bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                userType: userType
            });
            return user.save();
        })
        .then(result => {
            // res.json({ message: 'Registration successful!' });
            res.redirect('/login');
            console.log('User created');
            console.log(result);
        })
        .catch(err => {
            res.json({ error: err.message });
        });
})



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
