import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const BulkCustomers = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/bulkcustomers');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch Bulk Customers', err); setData([]); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'name', header: 'Customer Name' },
    { key: 'bookingVolume', header: 'Booking Volume' },
    { key: 'revenue', header: 'Revenue (₹)' },
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Bulk Customers" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Bulk Customer" width="560px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/bulkcustomers', payload); setShowModal(false); fetchCustomers(); }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Customer Name" name="name" required fullWidth />
            <FormField label="Booking Volume" name="bookingVolume" type="number" />
            <FormField label="Revenue (₹)" name="revenue" type="number" />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Save Customer" loading={saving} />
        </form>
      </Modal>
    </div>
  );
};

export default BulkCustomers;
