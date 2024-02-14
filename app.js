// working hour   5pm to 7pm    -     10feb2024 - express, mongose , routes,views.
// working hour   12pm to 6am   -     11feb2024 - passport, session, localstrategy, user model.
// working hour   6am to 7am    -     11feb2024 - admin routes, checkUserType middleware.
// working hour   3am to 8.30am -     12feb2024 - Routes for buyers and admin add product, views product,views by catagory wise
// discussion     9:30pm to 12:30am   13feb2024 - with team members
// working hour   12am to 6am   -     14feb2024 - cart routes, views, add to cart, remove from cart, checkout
// taking break   14feb2024     -     25feb2024  - 10 days 12*7 = 84   
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const User = require('./models/User');





const app = express();


// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require('./middleware/is-auth'));
// app.use(require('./routes/logout'))
// app.use(require('./routes/admin'))

// this is for Express session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));


// passport config
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

passport.use(new LocalStrategy((username, password, done) => {
    User.authenticate(username, password)
        .then(
            user => {
                done(null, user);
            })
        .catch(
            err => {
                done(null, false,
                    { message: err.message })
            });
}));

// passport.serializeUser(User.serializeUser());
passport.serializeUser((user, done) => {
    done(null, { id: user.id, userType: user.userType });
})
// passport.deserializeUser(User.deserializeUser());

passport.deserializeUser((data, done) => {
    User.findById(data.id)
        .then(user => { done(null, user); })
        .catch(err => { done(null, false); })
})



app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});


app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');



app.use(authRoutes);
app.use(shopRoutes);
app.use('/cart', cartRoutes);

app.use('/admin', adminRoutes);





// Connect to MongoDB
mongoose.connect
    ('mongodb+srv://deployment_user:WsbVw2k7aJbs7Tad@apitest.lspf3mf.mongodb.net/final_year_project')
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);

    });

