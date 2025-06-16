import { useState } from 'react';

function AdminAddUser({ onSuccess }) {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
    const [ข้อความ, setข้อความ] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/user/addByadmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.ข้อความ);

            setข้อความ('✅ สร้างผู้ใช้สำเร็จ');
            setForm({ username: '', email: '', password: '', role: 'user' });
            onSuccess?.();
        } catch (err) {
            setข้อความ('❌ ' + err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <h1>เพิ่มผู้ใช้ใหม่</h1>
            <input name="username" placeholder="ชื่อผู้ใช้" value={form.username} onChange={handleChange} required />
            <input name="email" placeholder="อีเมล" type="email" value={form.email} onChange={handleChange} required />
            <input name="password" placeholder="รหัสผ่าน" type="password" value={form.password} onChange={handleChange} required />
            <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">user</option>
                <option value="admin">admin</option>
            </select>
            <button type="submit">➕ สร้างผู้ใช้</button>
            {ข้อความ && <p>{ข้อความ}</p>}
        </form>
    );
}

export default AdminAddUser;
