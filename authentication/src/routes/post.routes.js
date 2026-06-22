const express = require("express");

const router = express.Router();

router.post("/create", (req,res) => {
    
    const token = req.cookies.token; // post tabhi jab token user k pas ho 

    if (!token) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    res.send("post created successfully")

})

module.exports = router;