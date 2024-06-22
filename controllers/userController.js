const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const Order = require('../models/Order');



exports.userProfile = async (req, res) => {

    try {
        const userData = req.session.passport.user;

        const user2 = await User.findById(userData.id);

        const user = await User.findById(userData.id)
            .populate({
                path: 'rentals._id',

                select: 'returnDate rentalCost rentalStartDate rentalEndDate status paymentStatus',

                model: 'Rental',
                populate: {
                    path: 'productId',
                    select: 'name imageUrl ',

                    model: 'Product'
                } // populate productId if needed
            })
            .populate({
                path: 'orders._id',
                // select: 'totalAmount orderDate',
                model: 'Order',
            });




        // .populate({
        //     path: 'rentals._id',
        //     model: 'Rental',
        //     populate: { path: 'productId', model: 'Product' } // populate productId if needed
        // })
        //     .populate({
        //         path: 'orders._id',
        //         model: 'Order',
        //         populate: { path: 'products.product.imageUrl', model: 'Product' } // populate products.product if needed
        //     });

        // res.json(user2);
        // console.log(user.rentals[0]._id.status);
        // res.json(user);


        res.render('user/profile2', 
        { 
            user, 
            pageTitle: 'Profile', 
            path: '/profile',
        }
        );
    }
    catch (err) {
        console.log(err);
    }


}


