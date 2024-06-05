const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const MongoStore = require('connect-mongo');

const multer = require('multer');
const fs = require('fs');
const errorController = require('./controllers/error');






const compression = require('compression');



const MONGODB_URI = `${process.env.MONGODB_URI}`

const User = require('./models/User');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));


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

// Example route that uses the stored user data
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

app.use((req, res, next) => {
    // page title
    res.locals.pageTitle = 'home';
    next();
});





app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const rentalRoutes = require('./routes/rent');

const userRoutes = require('./routes/user');

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));


// app.get('/google/callback', passport.authenticate('google', {
//     failureRedirect: '/login',
//     successRedirect: '/admin'
// }));
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));


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
// http://localhost:3000/google/callback
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/rent', rentalRoutes);
app.use('/cart', cartRoutes);
app.use(userRoutes);
// app.use(rentalRoutes);




app.use(errorController.get404);


// // Connect to MongoDB
// mongoose.connect
//     ('mongodb+srv://deployment_user:WsbVw2k7aJbs7Tad@apitest.lspf3mf.mongodb.net/final_year_project')
//     .then(() => {
//         app.listen(3000, () => {
//             console.log('Server running on port 3000');
//         });
//     })
//     .catch(err => {
//         // new Error('Error connecting to MongoDB:', err);
//         console.error('Error connecting to MongoDB:', err);
//         app.get('*', (req, res) => {
//             res.status(500).json({ error: 'Database connection error' });
//         });

//     });
// working
// const mongoose = require('mongoose');

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
const startServer = () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server running on port 3000');
    });
};

// Call the connectWithRetry function to initiate MongoDB connection
connectWithRetry();


// const retry = require('retry');

// const operation = retry.operation({
//   retries: 5, // Number of retries
//   factor: 2, // Exponential backoff factor
//   minTimeout: 1 * 1000, // 1 second
//   maxTimeout: 60 * 1000, // 1 minute
// });

// operation.attempt(() => {
//   mongoose.connect('mongodb+srv://deployment_user:WsbVw2k7aJbs7Tad@apitest.lspf3mf.mongodb.net/final_year_project', { /* options */ })
//     .then(() => {
//         app.listen(3000, () => {
//                         console.log('Server running on port 3000');
//                     });
//     })
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//         if (operation.retry(err)) {
//           return; // Tell the retry library to try again
//         }
//         process.exit(1); // Give up after retries are exhausted
//     });
// });

