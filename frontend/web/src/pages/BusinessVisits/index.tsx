import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';



const BusinessVisits = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchVisits(); }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/businessvisits');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch visits', err); setData([]); }
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
      await apiClient.delete(`/businessvisits/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchVisits();
    } catch (err) {
      alert('Failed to delete visit');
    }
  };

  const columns = [
    { key: 'visitDate', header: 'Visit Date', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'station', header: 'Station' },
    { key: 'visitType', header: 'Visit Type' },
    { key: 'visitedBy', header: 'Visited By' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'followUpDate', header: 'Follow-up Date', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'status', header: 'Status', render: (val: string) => (
      <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
        background: val === 'Complete' ? 'rgba(74,222,128,0.15)' : 'rgba(234,179,8,0.15)',
        color: val === 'Complete' ? '#16a34a' : '#ca8a04' }}>{val || 'Pending'}</span>
    )},
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Business Visits Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Business Visit" : "Add New Business Visit"} width="720px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { 
            if (editingItem) {
              await apiClient.put(`/businessvisits/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/businessvisits', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchVisits(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Visit Date" name="visitDate" type="date" required defaultValue={editingItem?.visitDate ? new Date(editingItem.visitDate).toISOString().split('T')[0] : ''} />
            <FormField label="Station" name="station" defaultValue={editingItem?.station} />
            <FormField label="Type of Business Visit" name="visitType" defaultValue={editingItem?.visitType} />
            <FormField label="Visited By" name="visitedBy" defaultValue={editingItem?.visitedBy} />
            <FormField label="Contact Person Name" name="contactPerson" defaultValue={editingItem?.contactPerson} />
            <FormField label="Mobile Number" name="mobileNumber" defaultValue={editingItem?.mobileNumber} />
            <FormField label="Email ID" name="emailId" type="email" defaultValue={editingItem?.emailId} />
            <FormField label="Follow Up By" name="followUpBy" defaultValue={editingItem?.followUpBy} />
            <FormField label="Follow Up Date" name="followUpDate" type="date" defaultValue={editingItem?.followUpDate ? new Date(editingItem.followUpDate).toISOString().split('T')[0] : ''} />
            
            <FormField label="Status" name="status" defaultValue={editingItem?.status || 'Pending'} placeholder="e.g. Complete / Pending" />
          </div>
          <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Visit" : "Save Visit"} loading={saving} />
        </form>
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this business visit? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessVisits;
