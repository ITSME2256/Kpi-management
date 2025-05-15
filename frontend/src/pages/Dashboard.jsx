import { useEffect, useState } from 'react';
import AddKPI from './AddKPI';
import EditKPI from './EditKPI';
import UpdateValue from './UpdateValue';
import './Dashboard.css';
import { unparse } from 'papaparse';

function Dashboard({ onLogout }) {
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ข้อความ, setข้อความ] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editKpi, setEditKpi] = useState(null);
    const [updateKpi, setUpdateKpi] = useState(null);

    const fetchKpis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/kpi/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.ข้อความ || 'ดึงข้อมูล KPI ไม่สำเร็จ');
            }

            setKpis(data.kpi || []);
        } catch (error) {
            setข้อความ(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKpis();
    }, []);

    const handleDelete = async (kpiId) => {
        const confirmDelete = window.confirm('คุณแน่ใจว่าต้องการลบ KPI นี้หรือไม่?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/kpi/delete/${kpiId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.ข้อความ || 'ลบไม่สำเร็จ');
            }

            fetchKpis(); // โหลดใหม่
        } catch (err) {
            alert('เกิดข้อผิดพลาด: ' + err.message);
        }
    };

    const handleExportCSV = () => {
        if (kpis.length === 0) {
            alert("ไม่มีข้อมูล KPI ให้ส่งออก");
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
        link.setAttribute('download', 'kpi_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>รายการ KPI ของคุณ</h2>
                <div>
                    <button onClick={handleExportCSV} style={{ backgroundColor: '#4caf50', color: '#fff', marginRight: '1rem' }}>
                        📥 Export CSV
                    </button>
                    <button onClick={onLogout} style={{ backgroundColor: '#f44336', color: 'white' }}>
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            {editKpi ? (
                <EditKPI
                    kpi={editKpi}
                    onCancel={() => setEditKpi(null)}
                    onUpdateSuccess={() => {
                        setEditKpi(null);
                        fetchKpis();
                    }}
                />
            ) : updateKpi ? (
                <UpdateValue
                    kpi={updateKpi}
                    onCancel={() => setUpdateKpi(null)}
                    onUpdateSuccess={() => {
                        setUpdateKpi(null);
                        fetchKpis();
                    }}
                />
            ) : showAddForm ? (
                <>
                    <AddKPI
                        onAddSuccess={() => {
                            setShowAddForm(false);
                            fetchKpis();
                        }}
                    />
                    <button onClick={() => setShowAddForm(false)}>❌ ยกเลิก</button>
                </>
            ) : (
                <>
                    <button onClick={() => setShowAddForm(true)}>➕ เพิ่ม KPI</button>

                    {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>
                    ) : ข้อความ ? (
                        <p className="error">{ข้อความ}</p>
                    ) : kpis.length === 0 ? (
                        <p>คุณยังไม่มี KPI</p>
                    ) : (
                        <ul className="kpi-list">
                            {kpis.map((kpi) => (
                                <li key={kpi._id} className="kpi-item">
                                    <strong>{kpi.title}</strong>
                                    <p>
                                        สถานะ:{' '}
                                        <span className={`status-label ${kpi.status.replace(/\s/g, '')}`}>
                                            {kpi.status}
                                        </span>
                                    </p>
                                    <p>ค่าที่ทำได้: {kpi.actualValue} / {kpi.targetValue}</p>
                                    <p>ช่วงเวลา: {kpi.startDate?.substring(0, 10)} - {kpi.endDate?.substring(0, 10)}</p>
                                    <button className="update-btn" onClick={() => setUpdateKpi(kpi)}>📈 อัปเดตผลลัพธ์</button>
                                    <button className="edit-btn" onClick={() => setEditKpi(kpi)}>✏️ แก้ไข</button>
                                    <button className="delete-btn" onClick={() => handleDelete(kpi._id)}>🗑️ ลบ</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default Dashboard;
