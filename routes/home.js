const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('index');
});
router.get('/shop', (req, res, next) => {
    // res.render('index');
    // res.render('shop');
    res.send('shop');
});


module.exports = router;