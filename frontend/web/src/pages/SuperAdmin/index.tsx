import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'edit'>('list');
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'list') {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/users');
      setAdmins(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      const res = await apiClient.get(`/admin/users/${id}/stats`);
      setAdminStats(res.data?.data?.stats);
      setSelectedAdmin(res.data?.data?.admin);
    } catch (err) {
      console.error('Error fetching stats', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());

    try {
      await apiClient.post('/admin/users', payload);
      alert('Admin created successfully!');
      (e.target as HTMLFormElement).reset();
      setActiveTab('list');
      fetchAdmins();
    } catch (err: any) {
      alert('Failed to create admin: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setIsCreating(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());

    try {
      await apiClient.put(`/admin/users/${selectedAdmin._id}`, payload);
      alert('Admin updated successfully!');
      setActiveTab('list');
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      alert('Failed to update admin: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}
      >
        <div>
          <h1 style={{ color: 'var(--ip-yellow)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', fontFamily: '"Georgia", serif' }}>Super Admin Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage administrative users and monitor system performance.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--ip-red)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Logout
        </button>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
        <button 
          onClick={() => { setActiveTab('list'); setSelectedAdmin(null); setAdminStats(null); }}
          style={{ background: activeTab === 'list' ? 'rgba(244, 114, 182, 0.1)' : 'transparent', color: activeTab === 'list' ? '#f472b6' : 'var(--text-secondary)', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
        >
          Admin Directory
        </button>
        <button 
          onClick={() => { setActiveTab('create'); setSelectedAdmin(null); setAdminStats(null); }}
          style={{ background: activeTab === 'create' ? 'rgba(244, 114, 182, 0.1)' : 'transparent', color: activeTab === 'create' ? '#f472b6' : 'var(--text-secondary)', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
        >
          Add New Admin
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'list' && !selectedAdmin && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel"
            style={{ padding: '24px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(244, 114, 182, 0.08)' }}
          >
            <h2 style={{ marginBottom: '24px', color: '#be185d', fontWeight: 800 }}>Active Administrators</h2>
            {loading ? <p style={{ color: '#6b7280' }}>Loading admins...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '16px 12px' }}>Name</th>
                    <th style={{ padding: '16px 12px' }}>Username</th>
                    <th style={{ padding: '16px 12px' }}>Mobile</th>
                    <th style={{ padding: '16px 12px' }}>Data Volume</th>
                    <th style={{ padding: '16px 12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <motion.tr 
                      key={admin._id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
                    >
                      <td style={{ padding: '20px 12px', fontWeight: 600, color: '#111827' }}>{admin.employeeName}</td>
                      <td style={{ padding: '20px 12px', color: '#6b7280' }}>{admin.username}</td>
                      <td style={{ padding: '20px 12px', color: '#6b7280' }}>{admin.mobile}</td>
                      <td style={{ padding: '20px 12px' }}>
                        <span style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700 }}>
                          {admin.dataVolumeScore} Records
                        </span>
                      </td>
                      <td style={{ padding: '20px 12px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => viewDetails(admin._id)} style={{ background: 'transparent', color: '#f472b6', border: '1.5px solid #f472b6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={(e) => {e.currentTarget.style.background = '#f472b6'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f472b6'}}>
                          View Details
                        </button>
                        <button onClick={() => { setSelectedAdmin(admin); setActiveTab('edit'); setAdminStats(null); }} style={{ background: 'transparent', color: '#6b7280', border: '1.5px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={(e) => {e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#111827'}} onMouseOut={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'}}>
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {admins.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No admins found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </motion.div>
        )}

        {selectedAdmin && adminStats && (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ padding: '40px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(244, 114, 182, 0.08)' }}
          >
            <button onClick={() => { setSelectedAdmin(null); setAdminStats(null); }} style={{ background: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#be185d'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}>
              ← Back to Directory
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
              <div style={{ background: '#f9fafb', padding: '32px', borderRadius: '20px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6 0%, #be185d 100%)', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 800, margin: '0 auto 24px auto', boxShadow: '0 10px 20px rgba(244, 114, 182, 0.3)' }}>
                  {selectedAdmin.employeeName.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#111827', fontWeight: 800 }}>{selectedAdmin.employeeName}</h2>
                <p style={{ color: '#f472b6', marginBottom: '24px', fontWeight: 600 }}>{selectedAdmin.designation}</p>
                
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <div style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', fontWeight: 700 }}>Username</span>
                    <span style={{ color: '#111827', fontWeight: 500 }}>{selectedAdmin.username}</span>
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', fontWeight: 700 }}>Mobile</span>
                    <span style={{ color: '#111827', fontWeight: 500 }}>{selectedAdmin.mobile}</span>
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', fontWeight: 700 }}>Password</span>
                    <span style={{ color: '#be185d', fontWeight: 600 }}>{selectedAdmin.initialPassword || '••••••••'}</span>
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', fontWeight: 700 }}>Status</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{selectedAdmin.status}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Volume Score</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f472b6' }}>{adminStats.dataVolumeScore}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leads Generated</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#3b82f6' }}>{adminStats.leadsGenerated}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Surveys Completed</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#10b981' }}>{adminStats.surveysCompleted}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance Score</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: adminStats.performanceScore > 80 ? '#10b981' : '#f59e0b' }}>{adminStats.performanceScore}<span style={{ fontSize: '1.25rem', color: '#9ca3af' }}>/100</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(activeTab === 'create' || activeTab === 'edit') && (
          <motion.div 
            key="create-edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-panel"
            style={{ padding: '48px', maxWidth: '700px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(244, 114, 182, 0.1)' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', marginBottom: '16px', fontSize: '24px' }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#be185d', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: '"Georgia", serif' }}>
                {activeTab === 'edit' ? 'Edit Administrator' : 'Register Administrator'}
              </h2>
              <p style={{ color: '#6b7280' }}>
                {activeTab === 'edit' ? 'Update details or reset password.' : 'Provision a new administrative account with elevated privileges.'}
              </p>
            </div>

            <form onSubmit={activeTab === 'edit' ? handleUpdate : handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                  <input type="text" name="employeeName" defaultValue={activeTab === 'edit' ? selectedAdmin?.employeeName : ''} placeholder="e.g. Jane Doe" required style={{ width: '100%', padding: '16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '1rem', transition: 'all 0.3s', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#f472b6'; e.target.style.background = '#ffffff'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Designation</label>
                  <input type="text" name="designation" defaultValue={activeTab === 'edit' ? selectedAdmin?.designation : ''} placeholder="e.g. Regional Manager" required style={{ width: '100%', padding: '16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '1rem', transition: 'all 0.3s', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#f472b6'; e.target.style.background = '#ffffff'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }} />
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Mobile Number</label>
                <input type="tel" name="mobile" defaultValue={activeTab === 'edit' ? selectedAdmin?.mobile : ''} placeholder="+91 XXXXX XXXXX" required style={{ width: '100%', padding: '16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '1rem', transition: 'all 0.3s', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#f472b6'; e.target.style.background = '#ffffff'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Username (Email)</label>
                  <input type="email" name="username" defaultValue={activeTab === 'edit' ? selectedAdmin?.username : ''} placeholder="admin@platform.com" required style={{ width: '100%', padding: '16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '1rem', transition: 'all 0.3s', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#f472b6'; e.target.style.background = '#ffffff'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{activeTab === 'edit' ? 'Reset Password (Optional)' : 'Secure Password'}</label>
                  <input type="text" name="password" defaultValue={activeTab === 'edit' ? selectedAdmin?.initialPassword : ''} placeholder={activeTab === 'edit' ? 'Leave blank to keep current' : '••••••••'} required={activeTab === 'create'} style={{ width: '100%', padding: '16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '1rem', transition: 'all 0.3s', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#f472b6'; e.target.style.background = '#ffffff'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }} />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                {activeTab === 'edit' && (
                  <button type="button" onClick={() => { setActiveTab('list'); setSelectedAdmin(null); }} style={{ width: '30%', padding: '18px', background: 'transparent', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s' }}>
                    Cancel
                  </button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -5px rgba(244, 114, 182, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCreating}
                  type="submit" 
                  style={{ flex: 1, padding: '18px', background: 'linear-gradient(135deg, #f472b6 0%, #be185d 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s' }}
                >
                  {isCreating ? 'Processing...' : activeTab === 'edit' ? 'Save Changes' : 'Complete Registration'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminDashboard;
