// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "กรุณากรอกชื่อผู้ใช้"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "กรุณากรอกอีเมล"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "กรุณากรอกรหัสผ่าน"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
