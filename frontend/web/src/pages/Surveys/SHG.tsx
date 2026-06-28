import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const SHGSurvey = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchSurveys(); }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/shgsurveys');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch surveys', err); setData([]); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'shgName', header: 'SHG Name' },
    { key: 'membersCount', header: 'Members' },
    { key: 'totalSavings', header: 'Total Savings' },
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="SHG Survey Management" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New SHG Survey">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/shgsurveys', payload); setShowModal(false); fetchSurveys(); }
          catch (err) { console.error('Failed to create survey', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="SHG Name" name="shgName" required fullWidth />
            <FormField label="Members Count" name="membersCount" type="number" />
            <FormField label="Total Savings" name="totalSavings" type="number" />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Save Survey" loading={saving} />
        </form>
      </Modal>
    </div>
  );
};

export default SHGSurvey;
