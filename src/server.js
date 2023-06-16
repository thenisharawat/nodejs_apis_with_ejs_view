const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const PORT = process.env.PORT || 2020

const parentDirectory = path.resolve(__dirname, '..');

app.use(session(
    {
        secret: 'secret@123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000 // Set the session time to 1 hour (in milliseconds)
        }
    }
));

app.use(express.static(path.join(parentDirectory, 'public')));

app.set('views', path.join(parentDirectory, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const indexRouter = require('./home/routes/index.routes');
const userRouter = require('./home/routes/user.routes');

app.use('/', indexRouter);

app.use('/user', userRouter)


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});