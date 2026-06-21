const express = require("express")
const multer = require("multer")
const path = require("path")
const postmodel = require("./models/post.model")
const uploadfile = require("./services/storage.service")


const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../frontend')));


const upload = multer({storage : multer.memoryStorage()})

// create post api 
app.post("/create-post", upload.single("image") , async (req,res) => {

    // console.log(req.body);
    // console.log(req.file);

    const result = await uploadfile(req.file.buffer)

    const post = await postmodel.create({

        image : result.url,
        caption : req.body.caption

    })

    return res.status(201).json({
        message : "post created successfully",
        post
    })
})


// fetch post api 
app.get("/posts", async (req,res) => {

    const posts = await postmodel.find()

    return res.status(200).json({
        message : "posts fetch successfully",
        posts
    })
})


//delete post api
app.delete("/delete-post/:id", async (req,res) => {

    const {id} = req.params;

    const post = await postmodel.findByIdAndDelete(id)

    return res.status(200).json({
        message : "post deleted successfully",
        post
    })
})


// update post api
app.put("/update-post/:id", async (req,res)=>{

    const {id} = req.params;

    const {caption, title} = req.body;


    const post = await postmodel.findByIdAndUpdate(
        id,
        {caption, title},
        {new:true}
    );


    res.status(200).json({
        message:"post updated successfully",
        post
    });

});

module.exports = app