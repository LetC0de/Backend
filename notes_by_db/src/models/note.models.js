const mongoose = require("mongoose")
const { title } = require("node:process")

const noteschema = new mongoose.Schema({
    title : String,
    description : String
})

// we make model for easy operation performing like CRUD.
const notemodel =  mongoose.model("note", noteschema)

module.exports = notemodel