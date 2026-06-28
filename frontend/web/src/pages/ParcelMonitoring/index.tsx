import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const textareaStyle = {
  width: '100%', padding: '12px 16px', background: '#fff',
  border: '1.5px solid var(--panel-border)', borderRadius: '12px',
  color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit',
  resize: 'vertical' as const,
};
const labelStyle = {
  display: 'block', marginBottom: '6px', fontWeight: 600,
  fontSize: '0.88rem', color: 'var(--text-secondary)',
};

const ParcelMonitoring = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchParcels(); }, []);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/parcelmonitorings');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch parcels', err); setData([]); }
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
      await apiClient.delete(`/parcelmonitorings/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchParcels();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'parcelNo', header: 'Parcel Number' },
    { key: 'nameOfSubOffice', header: 'Sub Office' },
    { key: 'nameOfBo', header: 'Branch Office' },
    { key: 'fromAddress', header: 'From' },
    { key: 'toAddress', header: 'To' },
    { key: 'mobileNumberOfCustomer', header: 'Customer Mobile' },
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

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Parcel Mails Monitoring" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Parcel Record" : "Add New Parcel Record"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/parcelmonitorings/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/parcelmonitorings', payload);
            }
            setShowModal(false); fetchParcels();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Parcel Number" name="parcelNo" required defaultValue={editingItem?.parcelNo} />
            <FormField label="Customer Mobile" name="mobileNumberOfCustomer" defaultValue={editingItem?.mobileNumberOfCustomer} />
            <FormField label="Name of Sub Office" name="nameOfSubOffice" defaultValue={editingItem?.nameOfSubOffice} />
            <FormField label="Name of BO" name="nameOfBo" defaultValue={editingItem?.nameOfBo} />
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>From Address</label>
              <textarea name="fromAddress" rows={2} style={textareaStyle} placeholder="Sender address..." defaultValue={editingItem?.fromAddress} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>To Address</label>
              <textarea name="toAddress" rows={2} style={textareaStyle} placeholder="Recipient address..." defaultValue={editingItem?.toAddress} />
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Parcel" : "Save Parcel"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete Parcel <strong>{deletingItem?.parcelNo}</strong>?
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

export default ParcelMonitoring;
