import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (user) {
    // ✅ แสดงหน้า Admin หรือ User ตาม role
    if (user.role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    } else {
      return <Dashboard onLogout={handleLogout} />;
    }
  }

  return (
    <div>
      {isRegister ? (
        <>
          <Register onRegisterSuccess={() => setIsRegister(false)} />
          <p style={{ textAlign: 'center' }}>
            มีบัญชีแล้ว? <button onClick={() => setIsRegister(false)}>เข้าสู่ระบบ</button>
          </p>
        </>
      ) : (
        <>
          <Login onLoginSuccess={setUser} />
          <p style={{ textAlign: 'center' }}>
            ยังไม่มีบัญชี? <button onClick={() => setIsRegister(true)}>สมัครสมาชิก</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
