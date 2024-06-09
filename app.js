const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');





const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');


const fs = require('fs');
const multer = require('multer');
const compression = require('compression');

const User = require('./models/User');
const errorController = require('./controllers/error');


const MONGODB_URI = `${process.env.MONGODB_URI}`

const globalVariables = require('./middleware/globalVariables');



app.use(bodyParser.urlencoded({ extended: false }));
// app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// this is for Express session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    // store: store,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions',
        // collection: 'sessions',

    }),

    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));



app.use((req, res, next) => {
    res.locals.pageTitle = 'home';
    next();
});
app.use((req, res, next) => {
    res.locals.warningMessage = '';

    next();
});

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


app.use(globalVariables);

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



app.get('/user', (req, res) => {
    // Check if the user is authenticated
    if (req.session) {
        // Access user-related data from the session
        const userData = req.session.passport.user;
        // Search in database for this user

        User.findById(userData.id)
            .then(user => {
                // Do something with the user data
                // res.render('profile', { user });
                res.json({ user });
            })


        // res.render('profile', { userData });

        // res.json({ userData });
    } else {
        // Redirect to the login page or handle accordingly if the user is not authenticated
        res.redirect('/login');
    }
});


const Order = require('./models/Order');
app.get('/test-order', async (req, res) => {
    try {
      const products = [
        { productId: '60c72b2f5f1b2c6d88f8d0d9', quantity: 2 }, // Replace with valid ObjectId strings
        { productId: '60c72b2f5f1b2c6d88f8d0da', quantity: 1 }
      ];
  
      const totalPrice = 100; // Example total price
      const shippingAddress = '123 Test St, Test City, TX';
  
      const order = new Order({
        userId: new mongoose.Types.ObjectId('60c72b2f5f1b2c6d88f8d0d8'), // Replace with a valid ObjectId string
        userEmail: 'test@example.com',
        productId: products.map(p => new mongoose.Types.ObjectId(p.productId)),
        products: products.map(p => ({
          quantity: p.quantity,
          product: new mongoose.Types.ObjectId(p.productId)
        })),
        totalPrice,
        shippingAddress,
        paymentStatus: 'Paid',
        status: 'Pending'
      });
  
      await order.save();
      res.send('Order created successfully');
    } catch (error) {
      console.error(error);
      res.send(`Error: ${error.message}`);
    }
  });
  
  
// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const rentalRoutes = require('./routes/rent');
const userRoutes = require('./routes/user');


app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/rent', rentalRoutes);
app.use('/cart', cartRoutes);
app.use('/user', userRoutes);
// app.use(rentalRoutes);
app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));


// app.get('/google/callback', passport.authenticate('google', {
//     failureRedirect: '/login',
//     successRedirect: '/admin'
// }));


app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect based on user type
        if (req.user.userType === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    }
);

app.use( errorController.get404);


app.use((req, res, next) => {
    console.log(`404 handler called for path: ${req.originalUrl}`);
    errorController.get404(req, res, next);
});





const connectWithRetry = () => {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            startServer(); // Start the server once MongoDB connection is successful
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
            console.log('Retrying connection...');
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
};

// Start the server function
const PORT = process.env.PORT || 3000;

// console.log for domain
console.log("Domain: ", process.env.DOMAIN);


const startServer = () => {
    app.listen( PORT || 3000, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Call the connectWithRetry function to initiate MongoDB connection
connectWithRetry();


