import { useState } from 'react';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportUtils';
import apiClient from '../../services/apiClient';

const ReportsDashboard = () => {
  const [selectedModule, setSelectedModule] = useState('anganwadisurveys');
  const [loading, setLoading] = useState(false);

  const modules = [
    { value: 'anganwadisurveys', label: 'Anganwadi Surveys' },
    { value: 'schoolsurveys', label: 'School Surveys' },
    { value: 'hospitalsurveys', label: 'Hospital Surveys' },
    { value: 'factorysurveys', label: 'Factory Surveys' },
    { value: 'banksurveys', label: 'Bank Surveys' },
    { value: 'shgsurveys', label: 'SHG Surveys' },
    { value: 'grampanchayats', label: 'Gram Panchayat Surveys' },
    { value: 'businessvisits', label: 'Business Visits' },
    { value: 'bnplcustomers', label: 'BNPL Customers' },
    { value: 'bulkcustomers', label: 'Bulk Customers' },
    { value: 'leadgenerations', label: 'Lead Generation' },
  ];

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/${selectedModule}`);
      const rawData = res.data.data || [];
      
      if (rawData.length === 0) {
        alert('No data available for this module.');
        return;
      }

      // Generate columns dynamically based on keys from the first item
      const sampleItem = rawData[0];
      const excludedKeys = ['_id', '__v', 'createdAt', 'updatedAt', 'id'];
      
      const columns = Object.keys(sampleItem)
        .filter(key => !excludedKeys.includes(key))
        .map(key => ({
          key,
          header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) // CamelCase to Title Case
        }));

      const title = modules.find(m => m.value === selectedModule)?.label || 'Report';

      if (type === 'pdf') {
        exportToPDF(rawData, columns, `${selectedModule}_report`, title);
      } else if (type === 'excel') {
        exportToExcel(rawData, columns, `${selectedModule}_report`);
      } else if (type === 'csv') {
        exportToCSV(rawData, columns, `${selectedModule}_report`);
      }

    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Reports & Export Center</h1>
      
      <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--ip-red)' }}>Generate Custom Report</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Select a module to fetch all raw data and export it into your preferred format for offline analysis.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Data Module</label>
          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '4px' }}
          >
            {modules.map(mod => (
              <option key={mod.value} value={mod.value}>{mod.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '40px' }}>
          <button 
            disabled={loading}
            onClick={() => handleExport('pdf')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#FF3B53', border: '1px solid #FF3B53', padding: '12px 24px', borderRadius: 'var(--radius-sm)', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Exporting...' : 'Export as PDF'}
          </button>
          
          <button 
            disabled={loading}
            onClick={() => handleExport('excel')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#4ADE80', border: '1px solid #4ADE80', padding: '12px 24px', borderRadius: 'var(--radius-sm)', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Exporting...' : 'Export as Excel (XLSX)'}
          </button>

          <button 
            disabled={loading}
            onClick={() => handleExport('csv')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Exporting...' : 'Export as CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
