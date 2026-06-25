const jwt = require("jsonwebtoken");


async function authArtist(req,res,next){

    const token = req.cookies.token;

    if(!token){
        return res.status(403).json({
            message : "Unauthorized User"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        if (decoded.role !== "artist" ) {
            return res.status(403).json({
                message : "You do not have access to create music "
            })
        }

        next();

        req.user = decoded;

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
} 

async function authUser(req,res,next){

    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({
            message : "Unauthorized User"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "user" && decoded.role !== "artist"){
            return res.status(403).json({
                message : "You do not have access to fetch all music"
            })
        }

        req.user = decoded;

        next();

    } catch (err){
        console.log(err);
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
}


module.exports = { authArtist, authUser };