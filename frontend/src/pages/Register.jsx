import { useState } from 'react';
import './Register.css';

function Register({ onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ข้อความ, setข้อความ] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setข้อความ('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setข้อความ(data.ข้อความ || 'สมัครไม่สำเร็จ');
                setLoading(false);
                return;
            }

            setข้อความ('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            setUsername('');
            setEmail('');
            setPassword('');
            onRegisterSuccess(); // ไปหน้าล็อกอิน
        } catch (error) {
            setข้อความ('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>สมัครสมาชิก</h2>
            <form onSubmit={handleRegister}>
                <label>ชื่อผู้ใช้</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>อีเมล</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>รหัสผ่าน</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                </button>
            </form>

            {ข้อความ && <p className="message">{ข้อความ}</p>}
        </div>
    );
}

export default Register;
