const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');

require('dotenv').config();
console.log("process.env:-", process.env.PORT);

const passport = require('passport');

const bodyParser = require('body-parser');
const path = require('path');

const db = require('./db');
const indexRouter = require('./user/routes/index.routes');
const userRouter = require('./user/routes/user.routes');
const adminRouter = require('./admin/routes/admin.routes');
const { registerController } = require('./admin/controllers/admin.controller');



const PORT = process.env.PORT || 2020;


const parentDirectory = path.resolve(__dirname, '..');

// Configure session middleware
app.use(session(
    {
        secret: 'secret@123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    }
));

// Configure Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(parentDirectory, 'public')));

app.set('views', [
    path.join(parentDirectory, 'views'),
    path.join(parentDirectory, 'views/admin'),
]);

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This is the home route
app.use('/', indexRouter);

// This is user route and all request comes to '/user' will go through this
app.use('/user', userRouter)

// This is admin route and all request comes to '/admin' will go through this
app.use('/admin', adminRouter)


app.listen(PORT, () => {
    registerController();
    console.log(`server is running on port ${PORT}`);
});