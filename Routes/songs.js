const express = require("express");
const router = express.Router();
const Song = require("../Models/song");
const jwt = require("jsonwebtoken");
const { set } = require("mongoose");

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post("/", authJWT, async (req, res) => {//i added authJWT as middleware, need to refrence the user somehwow
    console.log(req.body);
    // let songsList = await Song.find({ adder: req.params.user })
    const songsList = await Song.find({ url: req.body.url })
    console.log(songsList);
    if (songsList.length > 0) {


        if (songsList.length == 1 && songsList[0].adder != req.body.adder) {
            songsList[0].adder.push(req.body.adder)
            songsList[0].createdBy.push(req.body.createdBy)
            console.log(songsList[0].createdBy);
            await Song.updateOne({ url: req.body.url }, { adder: songsList[0].adder, createdBy: songsList[0].adder });
            res.send({ message: "updated successfully", })
        }
    }
    else {
        let newSong = await new Song({ ...req.body }).save();
        res.send(newSong);
    }

});

router.get("/:user", async (req, res) => {
    let songsCheck = await Song.find()
    let arrayReturn = []
    songsCheck.map((v) => {
        for (let i = 0; i < v.adder.length; i++) {
            if (v.adder[i] == String(req.params.user)) {
                arrayReturn.push(v)
            }
        }
    }

    )
    res.send(arrayReturn)

    // let songsList = await Song.find({ adder: req.params.user }).populate("createdBy")
    // res.send(songsList)
});

router.get("/", async (req, res) => {
    let songsList = await Song.find()
    res.send(songsList)

});

router.delete("/:url", authJWT, async (req, res) => {
    let song = await Song.findOne({ url: req.params.url });
    console.log(song);
    for (i in song.adder) {
        if (req.body.adder == song.adder[i])
            song.adder.splice(i, 1)
        console.log(song.adder);
    }

    await Song.updateOne({ url: req.params.url }, { adder: song.adder })
    console.log("song adder 2, ", song.adder);   // if (!song) return res.status(400);
    // if (req.user.username === song.user) {
    if (song.adder.length == 0) {
        deletedSong = await Song.deleteOne({ url: req.params.url });
        return res.send({ message: "OK", deletedSong });
    }
    // }
    // return res.status(401);
});
module.exports = router;