import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const Villages = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchVillages(); }, []);

  const fetchVillages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/villages');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch villages', err); setData([]); }
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
      await apiClient.delete(`/villages/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchVillages();
    } catch (err) {
      alert('Failed to delete village');
    }
  };

  const columns = [
    { key: 'boName', header: 'BO Name' },
    { key: 'name', header: 'Village Name' },
    { key: 'pincode', header: 'Pincode' },
    { key: 'population', header: 'Population' },
    { key: 'sarpanchName', header: 'Sarpanch Name' },
    { key: 'sarpanchMobile', header: 'Sarpanch Mobile' },
    { key: 'anganwadiSevikaName', header: 'Anganwadi Sevika' },
    { key: 'anganwadiMobile', header: 'Anganwadi Mobile' },
    { key: 'ashaWorkerName', header: 'Asha Worker' },
    { key: 'policePatilName', header: 'Police Patil' },
    { key: 'talathiName', header: 'Talathi' },
    { key: 'gramsewakName', header: 'Gramsewak' }
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Village Master Database" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Add/Edit Village Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Village" : "Add New Village"}>
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          
          // Remove empty fields to prevent Mongoose cast errors for numbers
          Object.keys(payload).forEach(key => {
            if (payload[key] === '') delete payload[key];
          });

          try { 
            if (editingItem) {
              await apiClient.put(`/villages/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/villages', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchVillages(); 
          }
          catch (err: any) { 
            console.error('Failed to save village', err);
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save village. Please check your inputs.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="BO Name" name="boName" required fullWidth defaultValue={editingItem?.boName} placeholder="Enter BO Name" />

            <FormField label="Village Name" name="name" required defaultValue={editingItem?.name} />
            <FormField label="Pincode" name="pincode" required defaultValue={editingItem?.pincode} />
            <FormField label="Population" name="population" type="number" defaultValue={editingItem?.population} />
            <FormField label="Households" name="households" type="number" defaultValue={editingItem?.households} />
            
            <FormField label="Sarpanch Name" name="sarpanchName" defaultValue={editingItem?.sarpanchName} />
            <FormField label="Sarpanch Mobile" name="sarpanchMobile" type="tel" defaultValue={editingItem?.sarpanchMobile} />
            
            <FormField label="Anganwadi Sevika Name" name="anganwadiSevikaName" defaultValue={editingItem?.anganwadiSevikaName} />
            <FormField label="Anganwadi Mobile" name="anganwadiMobile" type="tel" defaultValue={editingItem?.anganwadiMobile} />
            
            <FormField label="Asha Worker Name" name="ashaWorkerName" defaultValue={editingItem?.ashaWorkerName} />
            <FormField label="Police Patil Name" name="policePatilName" defaultValue={editingItem?.policePatilName} />
            
            <FormField label="Talathi Name" name="talathiName" defaultValue={editingItem?.talathiName} />
            <FormField label="Gramsewak Name" name="gramsewakName" defaultValue={editingItem?.gramsewakName} />
          </div>
          <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Village" : "Save Village"} loading={saving} />
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

export default Villages;
