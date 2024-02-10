// routes/auth.js
const express = require('express');


const router = express.Router();



router.get('/login', (req, res, next) => {
    res.render('login');
    res.send('login');
});
























// const passport = require('passport');
// const User = require('../models/User');

// const router = express.Router();

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
