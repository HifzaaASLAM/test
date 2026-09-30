import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin', { state: { skipWelcome: true } });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="fw-bold mb-1" style={{ fontSize: '22px', color: '#111827' }}>Dashboard</h2>
      <p className="mb-1" style={{ fontSize: '14px', color: '#6B7280' }}>Welcome, {user.name}</p>
      <p className="mb-4" style={{ fontSize: '13px', color: '#9CA3AF' }}>Role: {user.role}</p>
      <button
        onClick={handleLogout}
        className="btn text-white fw-semibold"
        style={{ backgroundColor: '#1C3470', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', border: 'none' }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;