import { useState } from 'react';
import './AddKPI.css';

function AddKPI({ onAddSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetValue, setTargetValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ข้อความ, setข้อความ] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        setข้อความ('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/kpi/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    targetValue: Number(targetValue),
                    startDate,
                    endDate,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.ข้อความ || 'เพิ่ม KPI ไม่สำเร็จ');
            }

            setข้อความ('เพิ่ม KPI สำเร็จ!');
            setTitle('');
            setDescription('');
            setTargetValue('');
            setStartDate('');
            setEndDate('');

            onAddSuccess(); // กลับ Dashboard
        } catch (err) {
            setข้อความ(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addkpi-container">
            <h2>เพิ่ม KPI ใหม่</h2>
            <form onSubmit={handleAdd}>
                <label>หัวข้อ</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>คำอธิบาย</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>ค่าเป้าหมาย</label>
                <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    required
                />

                <label>วันที่เริ่มต้น</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

                <label>วันที่สิ้นสุด</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

                <button type="submit" disabled={loading}>
                    {loading ? 'กำลังเพิ่ม...' : 'เพิ่ม KPI'}
                </button>
            </form>

            {ข้อความ && <p className="message">{ข้อความ}</p>}
        </div>
    );
}

export default AddKPI;
