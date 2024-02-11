// routes/admin.js

const express = require('express');
const router = express.Router();
const checkUserType = require('../middleware/checkUserType');

// This route is only accessible to users with the 'administrator' userType
router.get('/admin-dashboard', checkUserType('administrator'), (req, res) => {
    res.render('admin-dashboard', { user: req.user });
});

module.exports = router;
