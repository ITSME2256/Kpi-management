// middlewares/adminOnly.js
const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ ข้อความ: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
    }
    next();
};

module.exports = adminOnly;
