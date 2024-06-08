// const express = require('express');
// const router = express.Router();

// // Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
// };

// Protected route
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
            // console.log('User has the required userType, proceeding to the next middleware or route handler', req.user.userType);
            return next();
        }
        else if (req.isAuthenticated() && req.user && req.user.userType === 'buyer') {
            // User has the required userType, proceed to the next middleware or route handler
            // console.log('User has the required userType, proceeding to the next middleware or route handler', req.user.userType);
            // alert('User does not have the required userType, redirecting to login page');
        //    res.redirect('/shop');

           return res.redirect(`/?warning=${encodeURIComponent('Unauthorized access! Please log in as an admin.')}`);

        }
         else {
            // User does not have the required userType, send a forbidden response
            // return res.status(403).json({ error: 'Unauthorized access' });
            // console.log('User does not have the required userType, redirecting to login page');
            // alert('User does not have the required userType, redirecting to login page');
            // // redirect to login page
            // return res.redirect('/login');
            // const warningMessage = 'User does not have the required userType. Please log in.';
            const warningMessage = 'Unauthorized access!'
            console.log(warningMessage);

            // Redirect to login page with the warning message as a query parameter
            return res.redirect(`/login?warning=${encodeURIComponent(warningMessage)}`);
        }
    };
};

// module.exports = checkUserType ;
module.exports = checkUserType;
// module.exports = isAuthenticated;
// This middleware checks if the user has the required userType to access a route. If the user has the required userType, the middleware calls the next middleware or route handler. If the user does not have the required userType, the middleware sends a forbidden response.
