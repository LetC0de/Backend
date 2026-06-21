const express = require("express")
const notemodel = require("./models/note.models")

const app = express()
app.use(express.json()); // middleware use 


// creat note api 
app.post("/notes", async (req,res) =>{
    
    const data = req.body

    await notemodel.create({
        title : data.title,
        description : data.description 
    })

    res.status(201).json({
        message : "note created successfully"
    })
})


// fetch note api 
app.get("/notes", async (req,res) =>{

    const notes = await notemodel.find() // find always give [] 
                                         // also we can use findone and give condition 
    res.status(200).json({
        message : "notes fetched successfully",
        notes : notes                
    })
})


// delete note api 
app.delete("/notes/:id", async (req,res) =>{
    
    const id = req.params.id
    
    await notemodel.findOneAndDelete({
        _id : id
    })

    res.status(200).json({
        message : "note deleted successfully"
    })
})


// update note api 
app.patch("/notes/:id", async (req,res) => {

    const id = req.params.id

    const description = req.body.description

    await notemodel.findOneAndUpdate(
        { _id : id },
        { description : description }
    )

    res.status(200).json({
        message : "note updated successfully "
    })
})






module.exports = app
