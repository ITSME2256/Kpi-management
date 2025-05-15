// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ ข้อความ: "ไม่ได้รับโทเคน หรือโทเคนไม่ถูกต้อง" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // เพิ่มข้อมูล user ลงใน req
        next();
    } catch (err) {
        return res.status(403).json({ ข้อความ: "โทเคนหมดอายุหรือไม่ถูกต้อง" });
    }
};

module.exports = verifyToken;
