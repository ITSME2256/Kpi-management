// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middlewares/authMiddleware"); //ชั่วคราว

const router = express.Router();

// สมัครสมาชิก
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ ข้อความ: "อีเมลนี้ถูกใช้ไปแล้ว" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ ข้อความ: "สมัครสมาชิกสำเร็จ" });
    } catch (error) {
        res.status(500).json({ ข้อความ: "เกิดข้อผิดพลาด", error: error.message });
    }
});

// เข้าสู่ระบบ
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ ข้อความ: "ไม่พบผู้ใช้นี้" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ข้อความ: "รหัสผ่านไม่ถูกต้อง" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            ข้อความ: "เข้าสู่ระบบสำเร็จ",
            โทเคน: token,
            ผู้ใช้: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ ข้อความ: "เกิดข้อผิดพลาด", error: error.message });
    }
});
router.get("/userInfo", verifyToken, (req, res) => {
    res.json({
        ข้อความ: "เข้าถึงข้อมูลได้",
        ผู้ใช้: req.user, // แสดง user จาก token
    });
});

module.exports = router;
