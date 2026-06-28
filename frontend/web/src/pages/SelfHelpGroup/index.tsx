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

const inputStyle = {
  width: '100%', padding: '12px 16px', background: '#fff',
  border: '1.5px solid var(--panel-border)', borderRadius: '12px',
  color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', marginBottom: '6px', fontWeight: 600,
  fontSize: '0.88rem', color: 'var(--text-secondary)',
};

const SelfHelpGroup = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchSHGs(); }, []);

  const fetchSHGs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/selfhelpgroups');
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
      await apiClient.delete(`/selfhelpgroups/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchSHGs();
    } catch (err) {
      alert('Failed to delete SHG');
    }
  };

  const columns = [
    { key: 'soName', header: 'SO Name' },
    { key: 'boName', header: 'BO Name' },
    { key: 'villageName', header: 'Village Name' },
    { key: 'shgName', header: 'SHG Name' },
    { key: 'contactNumber', header: 'Contact Number' }
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Self Help Group Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit SHG" : "Add New SHG"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { 
            if (editingItem) {
              await apiClient.put(`/selfhelpgroups/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/selfhelpgroups', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchSHGs(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Sub Office Name <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="soName" required defaultValue={editingItem?.soName || soNames[0]} style={inputStyle}>
                <option value="">-- Select Sub Office --</option>
                {soNames.map(so => <option key={so} value={so}>{so}</option>)}
              </select>
            </div>
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Branch Office Name <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <input
                name="boName"
                list="bo-options-shg"
                required
                placeholder="Search BO..."
                defaultValue={editingItem?.boName}
                style={inputStyle}
              />
              <datalist id="bo-options-shg">
                {BRANCH_OFFICES.map(bo => <option key={bo} value={bo} />)}
              </datalist>
            </div>

            <FormField label="Village Name" name="villageName" required defaultValue={editingItem?.villageName} />
            <FormField label="SHG Name" name="shgName" required defaultValue={editingItem?.shgName} />
            
            <div style={{ gridColumn: 'span 2' }}>
              <FormField label="Contact Number" name="contactNumber" defaultValue={editingItem?.contactNumber} />
            </div>
          </div>
          <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update SHG" : "Save SHG"} loading={saving} />
        </form>
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this Self Help Group? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default SelfHelpGroup;
