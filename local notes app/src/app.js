// server ko create karna 

const express = require("express")

const app = express() 

app.use(express.json()) // middleware use to read and acept json

const notes = [] // stored in ram server off data gone for permanent use database to store 

// create note api
app.post("/notes",(req,res) => {
    notes.push(req.body)

    res.status(201).json({
        message: "note created successfully"
    })
})


// view notes api
app.get("/notes",(req,res) => {
    res.status(200).json({
        message : "notes fetch successfully",
        notes : notes 
    })
})


// delete notes api 
// notes/:index --> dynamic params 
app.delete("/notes/:index",(req,res) =>{

    const index = req.params.index

    delete notes[index]

    res.status(200).json({
        message : "note deleted successfully"
    })

})


//update note api 
app.patch("/notes/:index",(req,res) =>{
    
    const index = req.params.index

    const description = req.body.description

    notes[index].description = description

    res.status(200).json({
        message : "note updated successfully"
    })
})
module.exports = app