// middlewares/globalVariables.js
module.exports = (req, res, next) => {
    if (req.user) {
        res.locals.username = req.user.name || req.user.username;
        res.locals.profilePic = req.user.profilePic;
    } else {
        res.locals.username = null;
        res.locals.profilePic = null;
    }

    // Set the warningMessage based on the query parameters
    res.locals.warningMessage = req.query.warning || req.query.success || req.query.info || req.query.error || '';

    next();
};
