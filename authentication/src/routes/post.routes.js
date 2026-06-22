const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model")
const router = express.Router();

router.post("/create", async (req,res) => {
    
    const token = req.cookies.token; // post tabhi jab token user k pas ho 

    if (!token) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await UserModel.findOne({
            _id : decoded.id 
        })

        console.log(user)

    } catch (err) {
        return res.status(401).json({
            message : "Token is invalid"
        })
    }

    res.send("post created successfully")

})

module.exports = router;