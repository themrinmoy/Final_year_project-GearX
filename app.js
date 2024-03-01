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
const multer = require('multer');
const fs = require('fs');

// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');

// const MongoStore = require('connect-mongo')(session);



const User = require('./models/User');

const app = express();

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 10, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//     onLimitReached: (req, res, options) => {
//         console.log(`Rate limit exceeded for IP ${req.ip}. Limit: ${options.max}, Window: ${options.windowMs}ms`);
//       },
//   });
// const rateLimit = require('express-rate-limit');
// app.use((req, res, next) => {
//     console.log(`Request from IP: ${req.ip}`);
//     next();
// });
// console.log('Request from IP has been logged');

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//     handler: (req, res, options) => {
//         console.log(`Rate limit exceeded for IP ${req.ip}. Limit: ${options.max}, Window: ${options.windowMs}ms`);
//         res.status(429).json({ message: options.message });
//     }
// });

// app.use(limiter);
// app.use(helmet()); 



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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        // cb(null, file.filename + '-' + file.originalname)
        // cb(null, new Date().toISOString() + '-' + file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)


    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, 'public/uploads')); 
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });



app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
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




app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (res.locals.isAuthenticated) {
        res.locals.userType = req.user.userType; // Adjust this based on your user object structure
    } else {
        res.locals.userType = null; // Set to a default value if the user is not authenticated
    }
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

