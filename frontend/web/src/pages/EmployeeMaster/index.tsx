import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const inputStyle = {
  width: '100%', padding: '12px 16px', background: '#fff',
  border: '1.5px solid var(--panel-border)', borderRadius: '12px',
  color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', marginBottom: '6px', fontWeight: 600,
  fontSize: '0.88rem', color: 'var(--text-secondary)',
};

const EmployeeMaster = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/users');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch employees', err); setData([]); }
    finally { setLoading(false); }
  };

  const handleDeleteClick = (item: any) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/auth/users/${deletingItem._id}`); // Replace with actual delete endpoint
      setShowDeleteModal(false);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'employeeId', header: 'Emp ID' },
    { key: 'employeeName', header: 'Name' },
    { key: 'designation', header: 'Designation' },
    { key: 'role', header: 'Role' },
    { key: 'mobile', header: 'Mobile' },
    {
      key: 'status', header: 'Status', render: (val: string) => (
        <span style={{
          padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
          background: val === 'Active' ? 'rgba(74,222,128,0.15)' : 'rgba(85,2,98,0.1)',
          color: val === 'Active' ? '#16a34a' : 'var(--ip-red)'
        }}>{val || 'Active'}</span>
      )
    },
    {
      key: 'actions', header: 'Actions', render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Edit
          </button>
          <button onClick={() => handleDeleteClick(row)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Delete
          </button>
        </div>
      )
    }
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Employee Master Database" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      
      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Employee" width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/auth/register', payload); setShowModal(false); fetchEmployees(); }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Employee ID" name="employeeId" required />
            <FormField label="Name" name="employeeName" required />
            <FormField label="Mobile" name="mobile" required />
            <FormField label="Designation" name="designation" required />
            <div>
              <label style={labelStyle}>Role <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="role" style={inputStyle}>
                <option value="BPM">BPM</option>
                <option value="ABPM">ABPM</option>
                <option value="Postmaster">Postmaster</option>
                <option value="Inspector">Inspector</option>
              </select>
            </div>
            <FormField label="Blood Group" name="bloodGroup" />
            <FormField label="Password" name="password" type="password" required fullWidth />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Add Employee" loading={saving} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete <strong>{deletingItem?.employeeName}</strong>?
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ip-red)' }}>
            This action cannot be undone.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              style={{
                padding: '10px 24px', borderRadius: '50px', border: '1.5px solid var(--panel-border)',
                background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600,
                cursor: isDeleting ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              style={{
                padding: '10px 24px', borderRadius: '50px', border: 'none',
                background: 'var(--ip-red)', color: 'white', fontWeight: 600,
                cursor: isDeleting ? 'not-allowed' : 'pointer'
              }}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default EmployeeMaster;
