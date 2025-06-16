import { useEffect, useState } from 'react';
import './Dashboard.css';
import { unparse } from 'papaparse';
import AdminAddUser from './AdminAddUser'; // ✅ เพิ่ม import

function AdminDashboard({ onLogout }) {
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ข้อความ, setข้อความ] = useState('');
    const [showAddUser, setShowAddUser] = useState(false); // ✅ เพิ่ม useState

    const fetchAllKpis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/kpi/allUser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.ข้อความ || 'โหลดข้อมูล KPI ทั้งหมดไม่สำเร็จ');
            }

            setKpis(data.kpi || []);
        } catch (error) {
            setข้อความ(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllKpis();
    }, []);

    const handleExportCSV = () => {
        if (kpis.length === 0) {
            alert('ไม่มีข้อมูล KPI ให้ส่งออก');
            return;
        }

        const exportData = kpis.map((kpi) => ({
            หัวข้อ: kpi.title,
            คำอธิบาย: kpi.description || '',
            ค่าที่ทำได้: kpi.actualValue,
            ค่าเป้าหมาย: kpi.targetValue,
            สถานะ: kpi.status,
            เริ่มต้น: kpi.startDate?.substring(0, 10),
            สิ้นสุด: kpi.endDate?.substring(0, 10),
            ผู้ใช้: kpi.assignedUser?.username || '-',
        }));

        const csv = unparse(exportData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'kpi_all_users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Admin: รายการ KPI ทั้งหมด</h2>
                <div>
                    <button onClick={() => setShowAddUser(true)} style={{ backgroundColor: '#2196f3', color: 'white', marginRight: '1rem' }}>
                        ➕ เพิ่มผู้ใช้
                    </button>
                    <button onClick={handleExportCSV} style={{ backgroundColor: '#4caf50', color: 'white', marginRight: '1rem' }}>
                        📥 Export CSV
                    </button>
                    <button onClick={onLogout} style={{ backgroundColor: '#f44336', color: 'white' }}>
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            {showAddUser ? (
                <>
                    <AdminAddUser
                        onSuccess={() => {
                            setShowAddUser(false);
                            fetchAllKpis(); // ถ้าต้องการรีเฟรช KPI
                        }}
                    />
                    <button onClick={() => setShowAddUser(false)} style={{ marginTop: '1rem' }}>
                        ❌ ยกเลิก
                    </button>
                </>
            ) : loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : ข้อความ ? (
                <p className="error">{ข้อความ}</p>
            ) : kpis.length === 0 ? (
                <p>ยังไม่มี KPI ในระบบ</p>
            ) : (
                <ul className="kpi-list">
                    {kpis.map((kpi) => (
                        <li key={kpi._id} className="kpi-item">
                            <strong>{kpi.title}</strong>
                            <p>ผู้ใช้: {kpi.assignedUser?.username || 'ไม่ทราบ'}</p>
                            <p>
                                สถานะ:{' '}
                                <span className={`status-label ${kpi.status.replace(/\s/g, '')}`}>
                                    {kpi.status}
                                </span>
                            </p>
                            <p>
                                ค่าที่ทำได้: {kpi.actualValue} / {kpi.targetValue}
                            </p>
                            <p>
                                ช่วงเวลา: {kpi.startDate?.substring(0, 10)} - {kpi.endDate?.substring(0, 10)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminDashboard;
