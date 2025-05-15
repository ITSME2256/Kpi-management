import { useState } from 'react';
import './AddKPI.css';

function UpdateValue({ kpi, onCancel, onUpdateSuccess }) {
    const [actualValue, setActualValue] = useState(kpi.actualValue || 0);
    const [loading, setLoading] = useState(false);
    const [ข้อความ, setข้อความ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setข้อความ('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/kpi/update/${kpi._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ actualValue }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.ข้อความ || 'อัปเดตไม่สำเร็จ');

            onUpdateSuccess(); // โหลดใหม่
        } catch (err) {
            setข้อความ(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addkpi-container">
            <h2>อัปเดตผลลัพธ์ KPI</h2>
            <form onSubmit={handleSubmit}>
                <label>ค่าที่ทำได้ (Actual Value)</label>
                <input
                    type="number"
                    value={actualValue}
                    onChange={(e) => setActualValue(Number(e.target.value))}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'กำลังอัปเดต...' : 'บันทึกผลลัพธ์'}
                </button>
                <button type="button" onClick={onCancel} style={{ marginTop: '1rem' }}>
                    ❌ ยกเลิก
                </button>
            </form>
            {ข้อความ && <p className="message">{ข้อความ}</p>}
        </div>
    );
}

export default UpdateValue;
