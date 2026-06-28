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

const soNames = [
  'Shevgaon SO',
  'Pathardi SO',
  'Kharwandi kasar SO',
  'Miri SO',
  'VSSK SO',
  'Tisgaon SO',
  'Bodhegaon SO',
  'Balamtakali SO'
];

const SubOffice = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/suboffices');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch', err); setData([]); }
    finally { setLoading(false); }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDeleteClick = (item: any) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/suboffices/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Sub Office Name' },
    { key: 'pinCode', header: 'PIN Code' },
    { key: 'noOfEmployees', header: 'No. of Employees' },
    { key: 'status', header: 'Status', render: (val: string) => (
      <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
        background: 'rgba(85,2,98,0.1)', color: 'var(--ip-red)' }}>{val || 'PA'}</span>
    )},
    {
      key: 'actions', header: 'Actions', render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={() => handleEdit(row)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
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

  const colors = ['#16a34a', '#2563eb', '#f59e0b', '#8b5cf6', '#14b8a6', '#f43f5e', '#0ea5e9', 'var(--ip-red)'];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Total Offices</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ip-red-light)' }}>{data.length}</p>
        </div>
        {soNames.map((soName, idx) => (
          <div key={soName} className="glass-panel" style={{ padding: '16px 20px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{soName}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: colors[idx % colors.length] }}>
              {data.filter(d => d.name === soName).length}
            </p>
          </div>
        ))}
      </div>

      <DataTable title="Sub Office Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Sub Office" : "Add New Sub Office"} width="500px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/suboffices/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/suboffices', payload);
            }
            setShowModal(false); fetchData();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Sub Office Name <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="name" style={inputStyle} required defaultValue={editingItem?.name || soNames[0]}>
                {soNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            
            <FormField label="PIN Code" name="pinCode" required defaultValue={editingItem?.pinCode} />
            
            <FormField label="No. of Employees" name="noOfEmployees" type="number" required defaultValue={editingItem?.noOfEmployees || 0} />
            
            <div>
              <label style={labelStyle}>Status <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="status" style={inputStyle} required defaultValue={editingItem?.status || 'PA'}>
                <option value="HSG II">HSG II</option>
                <option value="LSG I">LSG I</option>
                <option value="Offg LSG">Offg LSG</option>
                <option value="PA">PA</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Sub Office" : "Save Sub Office"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete <strong>{deletingItem?.name}</strong>?
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

export default SubOffice;
