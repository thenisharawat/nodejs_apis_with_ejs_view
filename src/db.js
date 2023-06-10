const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Website_Data")
    .then((linkData) => {
        console.log("Connected to DB :", linkData.connection.name);
    }).catch((error) => {
        console.log("Error connecting to DB :", error);
    });

const db = mongoose.connection;

module.exports = db;