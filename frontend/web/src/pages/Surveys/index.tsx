import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const Surveys = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchSurveys(); }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/anganwadisurveys');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch surveys', err); setData([]); }
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
      await apiClient.delete(`/anganwadisurveys/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchSurveys();
    } catch (err) {
      alert('Failed to delete survey');
    }
  };

  const columns = [
    { key: 'boName', header: 'BO Name' },
    { key: 'villageName', header: 'Village Name' },
    { key: 'nameOfAnganwadi', header: 'Anganwadi Name' },
    { key: 'nameOfTeacher', header: 'Teacher Name' },
    { key: 'mobileNumberOfTeacher', header: 'Mobile' },
    { key: 'childrenName', header: 'Children Name' },
    { key: 'pregnantWomenName', header: 'Pregnant Women Name' },
    { key: 'createdAt', header: 'Date of Entry', render: (val: string) => val ? new Date(val).toLocaleDateString() : 'N/A' },
    { key: 'entryBy', header: 'Entry By', render: (val: string) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Anganwadi Survey Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Anganwadi Survey" : "New Anganwadi Survey"} width="720px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          
          try { 
            if (editingItem) {
              await apiClient.put(`/anganwadisurveys/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/anganwadisurveys', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchSurveys(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <FormField label="BO Name" name="boName" defaultValue={editingItem?.boName} placeholder="Enter BO Name" />

            <FormField label="Village Name" name="villageName" defaultValue={editingItem?.villageName} />
            <FormField label="Anganwadi Name" name="nameOfAnganwadi" required defaultValue={editingItem?.nameOfAnganwadi} />
            <FormField label="Teacher Name" name="nameOfTeacher" required defaultValue={editingItem?.nameOfTeacher} />
            <FormField label="Teacher Mobile" name="mobileNumberOfTeacher" defaultValue={editingItem?.mobileNumberOfTeacher} />
            <FormField label="Children Name" name="childrenName" defaultValue={editingItem?.childrenName} />
            <FormField label="Children Age" name="childrenAge" defaultValue={editingItem?.childrenAge} />
            <FormField label="Parents Mobile Num" name="parentsMobNum" defaultValue={editingItem?.parentsMobNum} />
            
            <FormField label="Having SSA/PPF Account" name="havingSsaPpfAccount" defaultValue={editingItem?.havingSsaPpfAccount || 'No'} placeholder="e.g. Yes / No" />

            <FormField label="Pregnant Women Name" name="pregnantWomenName" defaultValue={editingItem?.pregnantWomenName} />
            <FormField label="Pregnant Women Age" name="pregnantWomenAge" defaultValue={editingItem?.pregnantWomenAge} />
            
            <FormField label="Matruvandana Account" name="matruvandanaAccount" defaultValue={editingItem?.matruvandanaAccount || 'No'} placeholder="e.g. Yes / No" />

          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Survey" : "Save Survey"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this survey record? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Surveys;
