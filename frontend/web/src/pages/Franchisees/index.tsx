import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const Franchisees = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchFranchisees(); }, []);

  const fetchFranchisees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/franchisees');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch franchisees', err); setData([]); }
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
      await apiClient.delete(`/franchisees/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchFranchisees();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'nameOfFranchiseeOwner', header: 'Owner Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'franchiseeLicenseNumber', header: 'License No.' },
    {
      key: 'dateOfExpiry', header: 'Status', render: (val: string) => {
        if (!val) return 'N/A';
        const isExpired = new Date(val) < new Date();
        return <span style={{
          padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
          background: isExpired ? 'rgba(85,2,98,0.1)' : 'rgba(74,222,128,0.15)',
          color: isExpired ? 'var(--ip-red)' : '#16a34a'
        }}>{isExpired ? 'Expired' : 'Active'}</span>;
      }
    },
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
      <DataTable title="Franchisee Master Database" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Franchisee" : "Register Franchisee"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/franchisees/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/franchisees', payload);
            }
            setShowModal(false); fetchFranchisees();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Owner Name" name="nameOfFranchiseeOwner" required fullWidth defaultValue={editingItem?.nameOfFranchiseeOwner} />
            <FormField label="Mobile Number" name="mobileNumber" required defaultValue={editingItem?.mobileNumber} />
            <FormField label="Email ID" name="emailId" type="email" defaultValue={editingItem?.emailId} />
            <FormField label="Address" name="address" fullWidth defaultValue={editingItem?.address} />
            <FormField label="License Number" name="franchiseeLicenseNumber" fullWidth defaultValue={editingItem?.franchiseeLicenseNumber} />
            <FormField label="Date of Issue" name="dateOfIssue" type="date" defaultValue={editingItem?.dateOfIssue} />
            <FormField label="Date of Expiry" name="dateOfExpiry" type="date" defaultValue={editingItem?.dateOfExpiry} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Franchisee" : "Save Franchisee"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete Franchisee <strong>{deletingItem?.nameOfFranchiseeOwner}</strong>?
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

export default Franchisees;
