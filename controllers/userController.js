const User = require('../models/User');



exports.userProfile = async (req, res) => {

    try{
    const userData = req.session.passport.user;

    const user = await User.findById(userData.id);

    res.render('user/profile', 
    { 
        user, 
        pageTitle: 'Profile', 
        path: '/profile',
    }
    );
    }
    catch(err){
        console.log(err);
    }


}


