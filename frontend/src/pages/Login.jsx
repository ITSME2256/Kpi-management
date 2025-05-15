import { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ข้อความ, setข้อความ] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setข้อความ('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setข้อความ(data.ข้อความ || 'เข้าสู่ระบบไม่สำเร็จ');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.โทเคน);
            onLoginSuccess(data.ผู้ใช้); // ส่งข้อมูลผู้ใช้กลับไปยัง App
        } catch (error) {
            setข้อความ('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>เข้าสู่ระบบ</h2>
            <form onSubmit={handleSubmit}>
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
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>
            {ข้อความ && <p className="error">{ข้อความ}</p>}
        </div>
    );
}

export default Login;
