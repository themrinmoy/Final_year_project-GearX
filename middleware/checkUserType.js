
const checkUserType = (requiredUserType) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user && req.user.userType === requiredUserType) {

            return next();
        }
        else if (req.isAuthenticated() && req.user && req.user.userType === 'buyer') {


           return res.redirect(`/?warning=${encodeURIComponent('Unauthorized access! Please log in as an admin.')}`);

        }
         else {

            const warningMessage = 'Unauthorized access!'
            console.log(warningMessage);
            return res.redirect(`/login?warning=${encodeURIComponent(warningMessage)}`);
        }
    };
};

module.exports = checkUserType;
