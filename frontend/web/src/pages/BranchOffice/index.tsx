import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';
import { BRANCH_OFFICES } from '../../constants/branchOffices';

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

const BranchOffice = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/branchoffices');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch', err); setData([]); }
    finally { setLoading(false); }
  };

  const handleEdit = (row: any) => {
    setEditingItem(row);
    setShowModal(true);
  };

  const handleDelete = (row: any) => {
    setDeleteItem(row);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/branchoffices/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete branch office');
    }
  };

  const columns = [
    { key: 'subOfficeName', header: 'Sub Office Name' },
    { key: 'name', header: 'Branch Office Name' },
    { key: 'post', header: 'Post' },
    { key: 'pincode', header: 'Pincode' },
    { key: 'status', header: 'Status', render: (val: string) => {
      let bg = 'rgba(74,222,128,0.15)', color = '#16a34a';
      if (val === 'vacant') { bg = 'rgba(239, 68, 68, 0.15)'; color = '#ef4444'; }
      else if (val === 'double handed') { bg = 'rgba(59, 130, 246, 0.15)'; color = '#3b82f6'; }
      
      return (
        <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600, background: bg, color, textTransform: 'capitalize' }}>
          {val || 'single handed'}
        </span>
      );
    }},
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  const singleHanded = data.filter(d => d.status === 'single handed').length;
  const doubleHanded = data.filter(d => d.status === 'double handed').length;
  const vacant = data.filter(d => d.status === 'vacant').length;

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--panel-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Single Handed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{singleHanded}</div>
        </div>
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--panel-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Double Handed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{doubleHanded}</div>
        </div>
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--panel-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vacant</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ip-red)', lineHeight: 1 }}>{vacant}</div>
        </div>
      </div>

      <DataTable title="Branch Office Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Branch Office" : "Add New Branch Office"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          Object.keys(payload).forEach(key => { if (payload[key] === '') delete payload[key]; });

          try { 
            if (editingItem) {
              await apiClient.put(`/branchoffices/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/branchoffices', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchData(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Sub Office Name
              </label>
              <select name="subOfficeName" defaultValue={editingItem?.subOfficeName || soNames[0]} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <option value="">-- Select Sub Office --</option>
                {soNames.map(so => (
                  <option key={so} value={so}>{so}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Branch Office Name <span style={{ color: 'var(--ip-red)' }}>*</span>
              </label>
              <input
                name="name"
                list="bo-options"
                required
                placeholder="Search BO..."
                defaultValue={editingItem?.name}
                style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}
              />
              <datalist id="bo-options">
                {BRANCH_OFFICES.map(bo => <option key={bo} value={bo} />)}
              </datalist>
            </div>
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Post</label>
              <select name="post" defaultValue={editingItem?.post || 'BPM'} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <option value="BPM">BPM</option>
                <option value="ABPM">ABPM</option>
                <option value="Outsider">Outsider</option>
              </select>
            </div>

            <FormField label="Pincode" name="pincode" defaultValue={editingItem?.pincode} />

            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Status</label>
              <select name="status" defaultValue={editingItem?.status || 'single handed'} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <option value="single handed">Single Handed</option>
                <option value="double handed">Double Handed</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>
            
          </div>
          <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Branch Office" : "Save Branch Office"} loading={saving} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>{deleteItem?.name}</strong>? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default BranchOffice;
