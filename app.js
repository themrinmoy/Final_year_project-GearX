const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const app = express();



app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');


app.use(homeRoutes);
// app.use(authRoutes);



// Connect to MongoDB
mongoose.connect
    ('mongodb+srv://deployment_user:WsbVw2k7aJbs7Tad@apitest.lspf3mf.mongodb.net/final_year_project')
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);

    });

