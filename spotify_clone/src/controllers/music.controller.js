const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service")
const albumModel = require("../models/album.model");


async function createMusic(req,res){

        const {title} = req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString("base64"))

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id
        })

        res.status(201).json({
            message : "Music created successfully",
            music : {
                id : music._id,
                uri : music.uri,
                title : music.title,
                artist : music.artist
            }
        })

}   


async function createAlbum(req,res){

        const { title , musicId } = req.body;

        const titleExists = await albumModel.findOne({title});

        if (titleExists){
            return res.status(400).json({
                message : "Album title already exists"
            })
        }

        const album = await albumModel.create({
            
            title,
            artist : req.user.id,
            musics : musicId
        })

        res.status(201).json({
            message : "Album created successfully",
            album : {
                id : album._id,
                title : album.title,
                artist : album.artist,
                musics : album.musics
            }
        })

}


async function getAllMusic(req,res){
    
    const music = await musicModel.find().populate("artist","username");

    res.status(200).json({
        message : "All music fetch successfully",
        music : music
    })
}


async function getAllAlbums(req,res){

    const albums = await albumModel.find().populate("artist","username").populate("musics","title");

    res.status(200).json({
        message : "All albums fetched successfully",
        albums : albums
    })
}


module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums };