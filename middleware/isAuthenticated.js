// isAuthenticated.js

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.status(401).json({ error: 'Unauthorized' });
    console.log('Unauthorized access');

    res.redirect('/login');
};

module.exports = isAuthenticated;
