const User = require('../models/User');



exports.userProfile = async (req, res) => {

    try{
    const userData = req.session.passport.user;

    const user = await User.findById(userData.id);

    let username = req.user ? req.user.username : null;
    let profilePic = req.user ? req.user.profilePic : null;

    res.render('user/profile', 
    { 
        user, 
        pageTitle: 'Profile', 
        path: '/profile',
        username: username, 
        profilePic: profilePic
    }
    );
    }
    catch(err){
        console.log(err);
    }


}


