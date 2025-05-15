// models/KPI.js
const mongoose = require("mongoose");

const kpiSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "กรุณากรอกหัวข้อ KPI"],
        },
        description: String,
        targetValue: {
            type: Number,
            required: [true, "กรุณาระบุค่าเป้าหมาย"],
        },
        actualValue: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["On Track", "At Risk", "Off Track"],
            default: "On Track",
        },
        assignedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("KPI", kpiSchema);
