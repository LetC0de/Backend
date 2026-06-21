// server se database ko connect kerne ka logic 

const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect("mongodb+srv://yt-backend:abhi8505@backend.ykoyywf.mongodb.net/database")

    console.log("Connected to DB")
}

module.exports = connectDB