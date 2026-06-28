import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const Customers = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/customers');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch', err); setData([]); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'customerName', header: 'Customer Name' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (val: string) => (
      <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600,
        background: val === 'Active' ? 'rgba(74,222,128,0.15)' : 'rgba(85,2,98,0.1)',
        color: val === 'Active' ? '#16a34a' : 'var(--ip-red)' }}>{val || 'Active'}</span>
    )},
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Customers Management" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Customer">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/customers', payload); setShowModal(false); fetchData(); }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Customer Name" name="customerName" required fullWidth />
            <FormField label="Mobile" name="mobile" type="text" required />
            <FormField label="Email" name="email" type="email" />
            <FormField label="Address" name="address" fullWidth />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Save Customer" loading={saving} />
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
