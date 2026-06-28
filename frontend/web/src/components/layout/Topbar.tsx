import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Topbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="topbar glass-panel animate-slide-up">
      <div className="search-bar">
        <input type="text" placeholder="Search villages, branches, surveys..." />
      </div>
      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="avatar" style={{ textTransform: 'uppercase' }}>
            {user?.employeeName ? user.employeeName.charAt(0) : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.employeeName || 'Admin User'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user?.designation || user?.role || 'Administrator'}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--ip-red)', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
