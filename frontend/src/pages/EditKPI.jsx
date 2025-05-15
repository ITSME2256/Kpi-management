import { useState, useEffect } from 'react';
import './AddKPI.css';

function EditKPI({ kpi, onCancel, onUpdateSuccess }) {
    const [title, setTitle] = useState(kpi.title);
    const [description, setDescription] = useState(kpi.description);
    const [targetValue, setTargetValue] = useState(kpi.targetValue);
    const [startDate, setStartDate] = useState(kpi.startDate?.substring(0, 10));
    const [endDate, setEndDate] = useState(kpi.endDate?.substring(0, 10));
    const [ข้อความ, setข้อความ] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setข้อความ('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/kpi/edit/${kpi._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, targetValue, startDate, endDate }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.ข้อความ || 'แก้ไขไม่สำเร็จ');

            onUpdateSuccess();
        } catch (err) {
            setข้อความ(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addkpi-container">
            <h2>แก้ไข KPI</h2>
            <form onSubmit={handleUpdate}>
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
                    {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
                <button type="button" onClick={onCancel} style={{ marginTop: '1rem' }}>
                    ❌ ยกเลิก
                </button>
            </form>
            {ข้อความ && <p className="message">{ข้อความ}</p>}
        </div>
    );
}

export default EditKPI;
