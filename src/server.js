const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const PORT = process.env.PORT || 2020

const parentDirectory = path.resolve(__dirname, '..');



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