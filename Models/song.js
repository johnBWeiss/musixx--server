const mongoose = require("mongoose");
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    // artist: { type: String, required: true },
    // src: { type: String, required: true },
    // user: { type: String, required: true },
    adder: [{ type: String }],
    createdBy:
        [ //  { type: String }
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "UserName",
                required: false,
            },]
    // provider: { type: String },
});
const Song = mongoose.model("Song", songSchema);
module.exports = Song;