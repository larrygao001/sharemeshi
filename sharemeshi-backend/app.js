const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const users_provider = require('./providers/users_provider');
const all_users_provider = require('./providers/all_users_provider');

// Connect To Database - AWESOME
mongoose.connect(config.database);
// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+ config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
    console.log('Connected error '+ err);
});

const app = express();

// Routes
const users = require('./routes/users');
const all_users = require('./routes/all_users');

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({extended: true}) ); //parse url enconded

// app.use(multipart());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// set path for the uploaded images
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// Use Route
app.use('/users', users);
app.use('/all_users', all_users);
// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

// set root path when build as production
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Start Server
app.listen(port, () => {
    console.log('Server started on port : ' + port);
    
});