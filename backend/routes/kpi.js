// routes/kpi.js
const express = require("express");
const KPI = require("../models/KPI");
const verifyToken = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnly");
const router = express.Router();

// 🔸 เพิ่ม KPI (เฉพาะผู้ใช้ที่ login)
router.post("/add", verifyToken, async (req, res) => {
    try {
        const newKPI = new KPI({
            ...req.body,
            assignedUser: req.user.id, // จาก token
        });

        const saved = await newKPI.save();
        res.status(201).json({ ข้อความ: "เพิ่ม KPI สำเร็จ", kpi: saved });
    } catch (err) {
        res.status(500).json({ ข้อความ: "ไม่สามารถเพิ่ม KPI ได้", error: err.message });
    }
});

// 🔸 ดู KPI ของตนเอง
router.get("/me", verifyToken, async (req, res) => {
    try {
        const kpis = await KPI.find({ assignedUser: req.user.id });
        res.json({ ข้อความ: "รายการ KPI ของคุณ", kpi: kpis });
    } catch (err) {
        res.status(500).json({ ข้อความ: "ไม่สามารถดึง KPI ได้", error: err.message });
    }
});
router.get("/allUser", verifyToken, adminOnly, async (req, res) => {
    try {
        const kpis = await KPI.find().populate("assignedUser", "username email role");
        res.json({ ข้อความ: "KPI ทั้งหมด", kpi: kpis });
    } catch (err) {
        res.status(500).json({ ข้อความ: "ไม่สามารถดึง KPI ได้", error: err.message });
    }
});
// PUT /kpi/อัปเดต/:id
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const kpi = await KPI.findById(req.params.id);
        if (!kpi) return res.status(404).json({ ข้อความ: 'ไม่พบ KPI' });

        const isOwner = kpi.assignedUser.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin)
            return res.status(403).json({ ข้อความ: 'คุณไม่มีสิทธิ์อัปเดต KPI นี้' });

        // ✅ รับค่าที่จะอัปเดต
        const { actualValue } = req.body;

        if (actualValue != null) {
            kpi.actualValue = actualValue;

            // ✅ คำนวณสถานะจาก actualValue / targetValue
            const progress = actualValue / kpi.targetValue;

            if (progress >= 1) {
                kpi.status = 'On Track';
            } else if (progress >= 0.6) {
                kpi.status = 'At Risk';
            } else {
                kpi.status = 'Off Track';
            }
        }

        const updated = await kpi.save();
        res.json({ ข้อความ: 'อัปเดตค่าผลลัพธ์สำเร็จ', kpi: updated });
    } catch (err) {
        res.status(500).json({ ข้อความ: 'เกิดข้อผิดพลาด', error: err.message });
    }
});
  

router.put("/edit/:id", verifyToken, async (req, res) => {
    try {
        const kpi = await KPI.findById(req.params.id);
        if (!kpi) {
            return res.status(404).json({ ข้อความ: "ไม่พบ KPI" });
        }

        const isOwner = kpi.assignedUser.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ ข้อความ: "คุณไม่มีสิทธิ์แก้ไข KPI นี้" });
        }

        const fields = ["title", "description", "targetValue", "startDate", "endDate"];
        fields.forEach((key) => {
            if (req.body[key] != null) {
                kpi[key] = req.body[key];
            }
        });

        const updated = await kpi.save();
        res.json({ ข้อความ: "แก้ไข KPI สำเร็จ", kpi: updated });
    } catch (err) {
        res.status(500).json({ ข้อความ: "เกิดข้อผิดพลาด", error: err.message });
    }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const kpi = await KPI.findById(req.params.id);
        if (!kpi) {
            return res.status(404).json({ ข้อความ: "ไม่พบ KPI" });
        }

        const isOwner = kpi.assignedUser.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ ข้อความ: "คุณไม่มีสิทธิ์ลบ KPI นี้" });
        }

        await kpi.deleteOne();
        res.json({ ข้อความ: "ลบ KPI สำเร็จ" });
    } catch (err) {
        res.status(500).json({ ข้อความ: "เกิดข้อผิดพลาด", error: err.message });
    }
});
  

module.exports = router;
