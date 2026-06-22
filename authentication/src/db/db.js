const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DB");

    } catch (error) {
        console.error("Error connecting to the database: ",error);
    }
}

module.exports = connectDB;
