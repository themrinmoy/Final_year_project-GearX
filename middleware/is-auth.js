// const express = require('express');
// const router = express.Router();

// // Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
// };

// // Protected route
// router.get('/shop', isAuthenticated, (req, res) => {
//     res.json({ message: 'You are authenticated and accessing the dashboard.' });
// });

// module.exports = router;
