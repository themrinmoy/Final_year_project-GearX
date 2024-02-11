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



// middleware/checkUserType.js

// This middleware checks if the user has the required userType to access a route
const checkUserType = (requiredUserType) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user && req.user.userType === requiredUserType) {
            // User has the required userType, proceed to the next middleware or route handler
            return next();
        } else {
            // User does not have the required userType, send a forbidden response
            return res.status(403).json({ error: 'Unauthorized access' });
        }
    };
};

module.exports = checkUserType;
// This middleware checks if the user has the required userType to access a route. If the user has the required userType, the middleware calls the next middleware or route handler. If the user does not have the required userType, the middleware sends a forbidden response.
