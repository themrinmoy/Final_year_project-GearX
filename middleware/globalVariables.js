// middlewares/globalVariables.js
module.exports = (req, res, next) => {
    if (req.user) {
        res.locals.username = req.user.name || req.user.username;
        res.locals.profilePic = req.user.profilePic;
    } else {
        res.locals.username = 'null';
        res.locals.profilePic = 'null';
    }

    // Set the message and messageType based on the query parameters
    if (req.query.warning) {
        res.locals.message = req.query.warning;
        res.locals.messageType = 'warning';
    } else if (req.query.success) {
        res.locals.message = req.query.success;
        res.locals.messageType = 'success';
    } else if (req.query.info) {
        res.locals.message = req.query.info;
        res.locals.messageType = 'info';
    } else if (req.query.error) {
        res.locals.message = req.query.error;
        res.locals.messageType = 'error';
    } else {
        res.locals.message = '';
        res.locals.messageType = '';
    }

    next();
};
