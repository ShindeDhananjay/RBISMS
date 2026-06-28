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

const SDHAnnualInspection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchInspections(); }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/sdhannualinspections');
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
      await apiClient.delete(`/sdhannualinspections/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchInspections();
    } catch (err) {
      alert('Failed to delete inspection');
    }
  };

  const calculateDaysSince = (dateStr: string) => {
    if (!dateStr) return 0;
    const dliDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - dliDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const columns = [
    { key: 'officeName', header: 'Office Name' },
    { key: 'dli', header: 'DLI (Date of Last Inspection)', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'classOfOffice', header: 'Class of Office' },
    { key: 'numberOfDays', header: 'Number of Days', render: (_: any, row: any) => {
      const days = calculateDaysSince(row.dli);
      return (
        <span style={{ fontWeight: days > 365 ? 'bold' : 'normal', color: days > 365 ? '#ef4444' : 'inherit' }}>
          {days} days
        </span>
      );
    }},
    { key: 'actionStatus', header: 'Action Status', render: (_: any, row: any) => {
      const days = calculateDaysSince(row.dli);
      const isOverdue = days > 365;
      return (
        <span style={{ 
          padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
          background: isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(74,222,128,0.15)',
          color: isOverdue ? '#ef4444' : '#16a34a' 
        }}>
          {isOverdue ? 'Overdue' : 'Due Time'}
        </span>
      );
    }},
    { key: 'dateOfInspection', header: 'Date of Inspection', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'status', header: 'Status', render: (val: string) => (
      <span style={{ 
        padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
        background: val === 'Completed' ? 'rgba(74,222,128,0.15)' : 'rgba(245,158,11,0.15)',
        color: val === 'Completed' ? '#16a34a' : '#f59e0b'
      }}>
        {val || 'Pending'}
      </span>
    )},
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable 
        title="SDH Annual Inspection TTP" 
        columns={columns} 
        data={data} 
        loading={loading} 
        onAdd={() => { setEditingItem(null); setShowModal(true); }} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        rowStyle={(row: any) => {
          const days = calculateDaysSince(row.dli);
          if (days > 365) {
            return { backgroundColor: '#fee2e2' }; // baby red
          }
          return {};
        }}
      />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Inspection" : "Add New Inspection"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { 
            if (editingItem) {
              await apiClient.put(`/sdhannualinspections/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/sdhannualinspections', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchInspections(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Office Name <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="officeName" required defaultValue={editingItem?.officeName || soNames[0]} style={inputStyle}>
                <optgroup label="Sub Offices (SO)">
                  {soNames.map(so => <option key={so} value={so}>{so}</option>)}
                </optgroup>
                <optgroup label="Branch Offices (BO)">
                  {BRANCH_OFFICES.map(bo => <option key={bo} value={bo}>{bo}</option>)}
                </optgroup>
              </select>
            </div>
            
            <FormField label="Date of Last Inspection (DLI)" name="dli" type="date" required defaultValue={editingItem?.dli ? new Date(editingItem.dli).toISOString().split('T')[0] : ''} />
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Class of Office <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="classOfOffice" required defaultValue={editingItem?.classOfOffice || 'BO'} style={inputStyle}>
                <option value="A Class">A Class</option>
                <option value="B Class">B Class</option>
                <option value="C Class">C Class</option>
                <option value="BO">BO</option>
              </select>
            </div>
            
            <FormField label="Date of Inspection" name="dateOfInspection" type="date" defaultValue={editingItem?.dateOfInspection ? new Date(editingItem.dateOfInspection).toISOString().split('T')[0] : ''} />
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Status</label>
              <select name="status" defaultValue={editingItem?.status || 'Pending'} style={inputStyle}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Inspection" : "Save Inspection"} loading={saving} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this inspection record? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default SDHAnnualInspection;
