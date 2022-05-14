const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const UserName = require("../Models/UserName");

router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userAlreadyExists = await UserName.findOne({ username: req.body.username })
        if (userAlreadyExists) return res.status(401).send("username already exists    ")
        const user = new UserName({
            username: req.body.username,
            password: hashedPassword,
        });
        const savedUser = await user.save();
        console.log("New user saved successfully");
        res.json(savedUser);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await UserName.findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);
            res.json([{ accessToken }, user]);
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/", async (req, res) => {
    let users = await UserName.find({});
    res.send(users);
});
module.exports = router;