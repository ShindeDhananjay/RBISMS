import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const GramPanchayat = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchSurveys(); }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/grampanchayats');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch records', err); setData([]); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'sarpanchName', header: 'Sarpanch Name' },
    { key: 'gramSevakName', header: 'Gram Sevak Name' },
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Gram Panchayat Records" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Gram Panchayat Record">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/grampanchayats', payload); setShowModal(false); fetchSurveys(); }
          catch (err) { console.error('Failed to create record', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Sarpanch Name" name="sarpanchName" required fullWidth />
            <FormField label="Gram Sevak Name" name="gramSevakName" fullWidth />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Save Record" loading={saving} />
        </form>
      </Modal>
    </div>
  );
};

export default GramPanchayat;
