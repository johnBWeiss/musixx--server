const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);
const UserName = mongoose.model("UserName", userSchema);
module.exports = UserName || mongoose.models.UserName