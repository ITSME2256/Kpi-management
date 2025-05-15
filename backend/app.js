require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const kpiRoutes = require("./routes/kpi");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", authRoutes);
app.use("/kpi", kpiRoutes);

app.get("/", (req, res) => {
    res.json({ ข้อความ: "ยินดีต้อนรับสู่ระบบบริหาร KPI" });
});


const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("เชื่อมต่อ MongoDB สำเร็จ");
        app.listen(PORT, () => {
            console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("เกิดข้อผิดพลาดในการเชื่อม MongoDB:", err);
    });
