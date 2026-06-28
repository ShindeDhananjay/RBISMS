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

const SDHDiary = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchDiaries(); }, []);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/sdhdiary');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch SDH diaries', err); setData([]); }
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
      await apiClient.delete(`/sdhdiary/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchDiaries();
    } catch (err) {
      alert('Failed to delete SDH diary entry');
    }
  };

  const columns = [
    { key: 'date', header: 'Date', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'from', header: 'From' },
    { key: 'fromTime', header: 'From Time' },
    { key: 'to', header: 'To' },
    { key: 'toTime', header: 'To Time' },
    { key: 'distance', header: 'Distance (KM)' },
    { key: 'purposeOfVisit', header: 'Purpose of Visit' },
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="SDH Diary" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit SDH Diary Entry" : "Add New SDH Diary Entry"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { 
            if (editingItem) {
              await apiClient.put(`/sdhdiary/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/sdhdiary', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchDiaries(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Date" name="date" type="date" required defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : ''} />
            <FormField label="Distance (in KM)" name="distance" type="number" defaultValue={editingItem?.distance} />
            
            <FormField label="From" name="from" required defaultValue={editingItem?.from} />
            <FormField label="From Time" name="fromTime" type="time" defaultValue={editingItem?.fromTime} />
            
            <FormField label="To" name="to" required defaultValue={editingItem?.to} />
            <FormField label="To Time" name="toTime" type="time" defaultValue={editingItem?.toTime} />
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Purpose of Visit</label>
              <textarea name="purposeOfVisit" rows={4} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Enter purpose of visit..." defaultValue={editingItem?.purposeOfVisit} />
            </div>
          </div>
          <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Entry" : "Save Entry"} loading={saving} />
        </form>
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this SDH Diary entry? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default SDHDiary;
