const mongoose = require('mongoose');
const {
    DB_USERNAME,
    DB_PASSWORD,
} = process.env;

mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.rnzvxoa.mongodb.net/Drool-pet`)
    .then((linkData) => {
        console.log("Connected to DB :", linkData.connection.name);
    }).catch((error) => {
        console.log("Error connecting to DB :", error);
    });

const db = mongoose.connection;

module.exports = db;