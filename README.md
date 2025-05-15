# Kpi-management
# 📊 KPI Management System – ระบบบริหารจัดการตัวชี้วัด (KPI)

โปรเจกต์นี้เป็นระบบบริหารจัดการ KPI สำหรับองค์กร  
พัฒนาเพื่อใช้ในการประเมินผลพนักงานและติดตามความคืบหน้าของเป้าหมาย  
สร้างขึ้นเพื่อใช้ประกอบการพิจารณาในตำแหน่ง **Software Engineer**  
ตามแบบทดสอบของบริษัท Intelligent Software Solutions (iSS)

---

## 🧱 เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|------|------------|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB |
| Authentication | JWT (JSON Web Token) |
| Styling | CSS |
| Export | CSV (ผ่าน `papaparse`) |
| ภาษา | 🇹🇭 UI และ API response เป็นภาษาไทย

---

## ✅ ฟีเจอร์หลัก

- 👤 ผู้ใช้ทั่วไป:
  - สมัคร / เข้าสู่ระบบ / ออกจากระบบ
  - เพิ่ม KPI
  - แก้ไข, ลบ, อัปเดตผลลัพธ์
  - ระบบคำนวณสถานะ KPI อัตโนมัติ (On Track, At Risk, Off Track)
  - Export ข้อมูล KPI เป็น CSV

- 🛡️ แอดมิน:
  - เข้าถึง KPI ของผู้ใช้ทุกคน
  - ดู Dashboard รวม + Export CSV รายงานทั้งหมด

---

## 🔧 วิธีติดตั้งและรันโปรเจกต์

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/yourusername/kpi-management.git
cd kpi-management

##ตั้งค่า Backend
cd backend
npm install
สร้างไฟล์ .env แล้วใส่
PORT=5000
MONGO_URI=mongodb://localhost:27017/kpi-management
JWT_SECRET=your_jwt_secret
แล้วรัน
npm run dev

#ตั้งค่า Frontend
cd ../frontend
npm install
npm run dev

##API ที่ใช้
| Method | Endpoint            | ใช้ทำอะไร                      |
| ------ | ------------------- | ------------------------------ |
| POST   | `/auth/register`    | สมัครสมาชิก                    |
| POST   | `/auth/login      ` | เข้าสู่ระบบ                    |
| GET    | `/kpi/me`           | ดึง KPI ของตัวเอง              |
| GET    | `/kpi/allUser`      | แอดมินดู KPI ทั้งหมด           |
| POST   | `/kpi/add`          | เพิ่ม KPI                      |
| PUT    | `/kpi/edit/:id`     | แก้ไข KPI                      |
| PUT    | `/kpi/update/:id`   | อัปเดตค่าผลลัพธ์ (actualValue) |
| DELETE | `/kpi/delete/:id`   | ลบ KPI                         |
