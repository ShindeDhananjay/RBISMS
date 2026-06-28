import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect them to their dashboard
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'Super Admin') {
          navigate('/superadmin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        // invalid JSON, ignore
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      
      const { token, user } = res.data;
      
      // Strict role validation based on portal chosen
      if (isSuperAdmin && user.role !== 'Super Admin') {
        setError('Unauthorized: You are not a Super Admin.');
        setLoading(false);
        return;
      }
      
      if (!isSuperAdmin && user.role === 'Super Admin') {
        setError('Super Admins must log in through the Super Admin portal.');
        setLoading(false);
        return;
      }

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Route based on actual role
      if (user.role === 'Super Admin') {
        navigate('/superadmin');
      } else {
        navigate('/'); // Both ADMIN and USER go to the main dashboard layout
      }
    } catch (err: any) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'var(--bg-color)', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      
      {/* Super Admin Toggle Button in Top Right Header */}
      <div style={{ position: 'absolute', top: '32px', right: '32px', zIndex: 10 }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSuperAdmin(!isSuperAdmin)}
          style={{ 
            background: isSuperAdmin ? 'rgba(244, 114, 182, 0.15)' : 'transparent', 
            color: isSuperAdmin ? '#f472b6' : 'var(--text-secondary)', 
            border: `1px solid ${isSuperAdmin ? '#f472b6' : 'var(--panel-border)'}`, 
            padding: '10px 20px', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            transition: 'all 0.3s', 
            fontWeight: 700, 
            fontSize: '0.85rem',
            backdropFilter: 'blur(10px)',
            boxShadow: isSuperAdmin ? '0 0 15px rgba(244,114,182,0.2)' : 'none'
          }}
        >
          {isSuperAdmin ? '⚡ Super Admin Mode' : 'Admin Portal'}
        </motion.button>
      </div>
      
      {/* Abstract Animated Background Elements */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.8, pointerEvents: 'none' }}>
        {/* Main glow */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '80vw', height: '80vw', background: isSuperAdmin ? 'radial-gradient(circle, rgba(244, 114, 182, 0.08) 0%, rgba(0,0,0,0) 60%)' : 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(0,0,0,0) 60%)', top: '-40%', left: '-20%', filter: 'blur(60px)' }}
        />
        {/* Secondary glow */}
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, rgba(0,0,0,0) 60%)', bottom: '-20%', right: '-10%', filter: 'blur(80px)' }}
        />
        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 80%)' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          padding: '48px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          zIndex: 1, 
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: '40px', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isSuperAdmin ? 'linear-gradient(135deg, #f472b6, #db2777)' : 'linear-gradient(135deg, var(--ip-red), #b91c1c)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: isSuperAdmin ? '0 10px 20px rgba(244, 114, 182, 0.3)' : '0 10px 20px rgba(239, 68, 68, 0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 style={{ color: '#000', letterSpacing: '0.5px', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>RBISMS</h1>
              <p style={{ color: isSuperAdmin ? '#f472b6' : 'var(--ip-red)', fontSize: '0.85rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Intelligence Platform</p>
            </div>
          </div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 800, margin: '24px 0 8px 0', fontFamily: '"Georgia", serif' }}>
            {isSuperAdmin ? 'Super Admin Login' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {isSuperAdmin ? 'Authenticate to manage system configuration and users.' : 'Enter your credentials to access the division dashboard.'}
          </p>
        </motion.div>

        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleLogin}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '14px', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isSuperAdmin ? 'Super Admin Email' : 'Username or Employee ID'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="username" 
                  placeholder={isSuperAdmin ? "admin@platform.com" : "Enter your ID"}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s', outline: 'none', fontSize: '1rem' }} 
                  onFocus={(e) => { e.target.style.borderColor = isSuperAdmin ? '#f472b6' : 'var(--ip-red)'; e.target.style.background = 'rgba(0,0,0,0.25)'; }} 
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.15)'; }} 
                />
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', transition: 'all 0.3s', outline: 'none', fontSize: '1rem', letterSpacing: '2px' }} 
                  onFocus={(e) => { e.target.style.borderColor = isSuperAdmin ? '#f472b6' : 'var(--ip-red)'; e.target.style.background = 'rgba(0,0,0,0.25)'; }} 
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.15)'; }} 
                />
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: isSuperAdmin ? 'linear-gradient(135deg, #f472b6, #db2777)' : 'linear-gradient(135deg, var(--ip-red), #b91c1c)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 800, 
              fontSize: '1.05rem', 
              marginTop: '16px', 
              boxShadow: isSuperAdmin ? '0 10px 25px rgba(244, 114, 182, 0.4)' : '0 10px 25px rgba(239, 68, 68, 0.4)', 
              transition: 'all 0.3s', 
              opacity: loading ? 0.8 : 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                Authenticating...
              </>
            ) : (
              <>
                {isSuperAdmin ? 'Secure Login' : 'Sign In'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
