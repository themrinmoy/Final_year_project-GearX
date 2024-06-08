// middlewares/globalVariables.js
module.exports = (req, res, next) => {
    if (req.user) {
        // res.locals.username = req.user.username;
        res.locals.username = req.user.name;
        if(req.user.name == null){
            res.locals.username = req.user.username;
        }
        res.locals.profilePic = req.user.profilePic;
    } else {
        res.locals.username = null;
        res.locals.profilePic = null;
    }
    next();
};
