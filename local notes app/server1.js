const express = require("express");

const app = express() // server instace creation 

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.get("/about",(req,res)=>{
    res.send("about page")
})

app.listen(3000, () => { // server ko start krne k liy app.listen
    console.log("server is running on port 3000");
});



