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

const InstituteMSME = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchInstitutes(); }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/institutemsmes');
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
      await apiClient.delete(`/institutemsmes/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchInstitutes();
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const columns = [
    { key: 'nameOfCompany', header: 'Name of Company' },
    { key: 'nameOfOwner', header: 'Name of Owner' },
    { key: 'address', header: 'Address' },
    { key: 'fullName', header: 'Full Name' },
    { key: 'productionType', header: 'Production Type' },
    { key: 'numOfEmployees', header: 'No. of Employees' }
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Institute / MSME" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Institute / MSME" : "Add New Institute / MSME"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { 
            if (editingItem) {
              await apiClient.put(`/institutemsmes/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/institutemsmes', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchInstitutes(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <FormField label="Name of Company" name="nameOfCompany" required defaultValue={editingItem?.nameOfCompany} />
            </div>
            
            <FormField label="Name of Owner" name="nameOfOwner" defaultValue={editingItem?.nameOfOwner} />
            <FormField label="Full Name" name="fullName" defaultValue={editingItem?.fullName} />
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Address</label>
              <textarea name="address" rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Enter address..." defaultValue={editingItem?.address} />
            </div>

            <FormField label="Production Type" name="productionType" defaultValue={editingItem?.productionType} />
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Number of Employees</label>
              <input type="number" name="numOfEmployees" min="0" style={inputStyle} defaultValue={editingItem?.numOfEmployees} />
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Record" : "Save Record"} loading={saving} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this Institute / MSME record? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default InstituteMSME;
