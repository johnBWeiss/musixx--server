const mongoose = require("mongoose");
const { Song } = require("./song");
const { UserName } = require("./UserName");

const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL;
    return await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};
const models = { Song, UserName };
module.exports = { connectDB, models };