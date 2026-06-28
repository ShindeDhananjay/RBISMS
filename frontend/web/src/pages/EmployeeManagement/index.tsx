import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

const AVAILABLE_MODULES = [
  { id: 'villages', label: 'Villages' },
  { id: 'subdivision', label: 'SubDivision' },
  { id: 'suboffice', label: 'SubOffice' },
  { id: 'branchoffice', label: 'BranchOffice' },
  { id: 'surveys', label: 'Surveys (Anganwadi/School/etc)' },
  { id: 'customers', label: 'Customers' },
  { id: 'businessvisits', label: 'Business Visits' },
  { id: 'leads', label: 'Lead Generation' },
  { id: 'sdhdiary', label: 'SDH Diary' },
  { id: 'franchisees', label: 'Franchisees' },
  { id: 'parcels', label: 'Parcel Monitoring' },
  { id: 'buildings', label: 'Building Maintenance' },
  { id: 'sdhinspection', label: 'SDH Inspection' }
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [createEmployeeName, setCreateEmployeeName] = useState('');
  const [createDesignation, setCreateDesignation] = useState('');
  const [createMobile, setCreateMobile] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createSelectedModules, setCreateSelectedModules] = useState<string[]>([]);

  // Edit form state
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await apiClient.get('/employees');
      setEmployees(res.data.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string, isEdit: boolean = false) => {
    if (isEdit) {
      setSelectedModules(prev => prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]);
    } else {
      setCreateSelectedModules(prev => prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await apiClient.post('/employees', {
        employeeName: createEmployeeName,
        designation: createDesignation,
        mobile: createMobile,
        username: createUsername,
        password: createPassword,
        accessibleModules: createSelectedModules
      });
      // Reset form
      setCreateEmployeeName('');
      setCreateDesignation('');
      setCreateMobile('');
      setCreateUsername('');
      setCreatePassword('');
      setCreateSelectedModules('');
      setEditingId(null);
      
      // Refresh list
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsCreating(true);
    setError(null);
    try {
      await apiClient.put(`/employees/${editingId}`, {
        employeeName,
        designation,
        mobile,
        username,
        password,
        accessibleModules: selectedModules
      });
      // Reset form
      setEmployeeName('');
      setDesignation('');
      setMobile('');
      setUsername('');
      setPassword('');
      setSelectedModules([]);
      setEditingId(null);
      
      // Refresh list
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    
    try {
      await apiClient.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleEditClick = (emp: any) => {
    setEditingId(emp._id);
    setEmployeeName(emp.employeeName);
    setDesignation(emp.designation);
    setMobile(emp.mobile);
    setUsername(emp.username);
    setPassword('');
    setSelectedModules(emp.accessibleModules || []);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEmployeeName('');
    setDesignation('');
    setMobile('');
    setUsername('');
    setPassword('');
    setSelectedModules([]);
    setError(null);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', color: 'var(--ip-red)', marginBottom: '8px', fontWeight: 800 }}>Employee Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create and manage employees under your administration.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '32px', background: 'var(--panel-bg)', borderRadius: '16px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 700 }}>
            Add New Employee
          </h2>
          {error && !editingId && <div style={{ color: 'red', marginBottom: '16px', background: 'rgba(255,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>{error}</div>}
          <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input required value={createEmployeeName} onChange={e => setCreateEmployeeName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Designation</label>
              <input required value={createDesignation} onChange={e => setCreateDesignation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mobile Number</label>
              <input required value={createMobile} onChange={e => setCreateMobile(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username (Email)</label>
              <input required type="email" value={createUsername} onChange={e => setCreateUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <input required type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ip-red)' }}>Select Accessible Modules</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {AVAILABLE_MODULES.map(mod => (
                  <label key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={createSelectedModules.includes(mod.id)} 
                      onChange={() => toggleModule(mod.id, false)}
                      style={{ accentColor: 'var(--ip-red)', width: '16px', height: '16px' }}
                    />
                    {mod.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button disabled={isCreating} type="submit" style={{ flex: 1, padding: '14px', background: 'var(--ip-red)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', opacity: isCreating ? 0.7 : 1 }}>
                {isCreating ? 'Processing...' : 'Register Employee'}
              </button>
            </div>
          </form>
        </div>

        {/* Employee List */}
        <div className="glass-panel" style={{ padding: '32px', background: 'var(--panel-bg)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 700 }}>Your Subordinate Employees</h2>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {employees.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No employees found.</p> : employees.map(emp => (
                <div key={emp._id} style={{ padding: '16px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>{emp.employeeName}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{emp.designation}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                      <div><strong>ID:</strong> {emp.username}</div>
                      <div><strong>Pass:</strong> {emp.initialPassword || '******'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--ip-red)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {emp.accessibleModules?.length || 0} Modules Assigned
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditClick(emp)} style={{ background: 'transparent', border: '1px solid var(--panel-border)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteEmployee(emp._id)} style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Popup */}
      {editingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '24px', overflowY: 'auto' }}>
          <div className="glass-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 800, color: 'var(--ip-red)' }}>Edit Employee</h2>
            {error && <div style={{ color: 'red', marginBottom: '16px', background: 'rgba(255,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>{error}</div>}
            
            <form onSubmit={handleUpdateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input required value={employeeName} onChange={e => setEmployeeName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Designation</label>
                  <input required value={designation} onChange={e => setDesignation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mobile Number</label>
                <input required value={mobile} onChange={e => setMobile(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username (Email)</label>
                  <input required type="email" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Reset Password (Optional)</label>
                  <input type="text" placeholder="Leave blank to keep current" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.02)' }} />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ip-red)' }}>Select Accessible Modules</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {AVAILABLE_MODULES.map(mod => (
                    <label key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedModules.includes(mod.id)} 
                        onChange={() => toggleModule(mod.id, true)}
                        style={{ accentColor: 'var(--ip-red)', width: '16px', height: '16px' }}
                      />
                      {mod.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--panel-border)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button disabled={isCreating} type="submit" style={{ flex: 2, padding: '14px', background: 'var(--ip-red)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', opacity: isCreating ? 0.7 : 1 }}>
                  {isCreating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
