import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const BNPLCustomers = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/bnplcustomers');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch BNPL Customers', err); setData([]); }
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
      await apiClient.delete(`/bnplcustomers/${deleteItem._id || deleteItem.id}`);
      setDeleteItem(null);
      fetchCustomers();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  const columns = [
    { key: 'name', header: 'Customer Name' },
    { key: 'customerType', header: 'Type' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'email', header: 'Email' },
    { key: 'customerId', header: 'Customer ID' },
    { key: 'validity', header: 'Validity' },
    { key: 'productType', header: 'Product Type' },
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="COD / BNPL Customers" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit COD / BNPL Customer" : "New COD / BNPL Customer"} width="640px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          
          try { 
            if (editingItem) {
              await apiClient.put(`/bnplcustomers/${editingItem._id || editingItem.id}`, payload);
            } else {
              await apiClient.post('/bnplcustomers', payload); 
            }
            setShowModal(false); 
            setEditingItem(null);
            fetchCustomers(); 
          }
          catch (err: any) { 
            console.error('Failed to save', err); 
            alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save.');
          }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <FormField label="Customer Name" name="name" required defaultValue={editingItem?.name} />
            </div>
            
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Customer Type</label>
              <select name="customerType" defaultValue={editingItem?.customerType || 'COD'} style={{ width: '100%', padding: '12px 16px', background: '#fff', border: '1.5px solid var(--panel-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <option value="COD">COD</option>
                <option value="BNPL">BNPL</option>
              </select>
            </div>

            <FormField label="Mobile" name="mobile" defaultValue={editingItem?.mobile} />
            <FormField label="Email" name="email" type="email" defaultValue={editingItem?.email} />
            <FormField label="Customer ID" name="customerId" defaultValue={editingItem?.customerId} />
            <FormField label="Customer Validity" name="validity" type="date" defaultValue={editingItem?.validity} />
            <FormField label="Type of Product" name="productType" defaultValue={editingItem?.productType} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => { setShowModal(false); setEditingItem(null); }} submitLabel={editingItem ? "Update Customer" : "Save Customer"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete this customer record? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={() => setDeleteItem(null)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: '50px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default BNPLCustomers;
