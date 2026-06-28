import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const HospitalSurvey = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchSurveys(); }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/hospitalsurveys');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch surveys', err); setData([]); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: 'hospitalName', header: 'Hospital Name' },
    { key: 'doctorCount', header: 'Doctors' },
    { key: 'bedCount', header: 'Beds' },
  ,
    { key: 'entryBy', header: 'Entry By', render: (val: any) => val || 'N/A' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <DataTable title="Hospital Survey Management" columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} />
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Hospital Survey">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try { await apiClient.post('/hospitalsurveys', payload); setShowModal(false); fetchSurveys(); }
          catch (err) { console.error('Failed to create survey', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField label="Hospital Name" name="hospitalName" required fullWidth />
            <FormField label="Doctor Count" name="doctorCount" type="number" />
            <FormField label="Bed Count" name="bedCount" type="number" />
          </div>
          <FormButtons onCancel={() => setShowModal(false)} submitLabel="Save Survey" loading={saving} />
        </form>
      </Modal>
    </div>
  );
};

export default HospitalSurvey;
