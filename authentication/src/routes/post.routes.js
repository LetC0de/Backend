const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/create", (req,res) => {
    
    const token = req.cookies.token; // post tabhi jab token user k pas ho 

    if (!token) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    try{
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message : "Token is invalid"
        })
    }

    res.send("post created successfully")

})

module.exports = router;