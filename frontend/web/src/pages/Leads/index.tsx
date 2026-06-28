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

const LeadGeneration = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { 
    fetchLeads(); 
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/leadgenerations');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch leads', err); setData([]); }
    finally { setLoading(false); }
  };

  const statCards = [
    { label: 'Total Leads', value: data.length, color: 'var(--ip-red)' },
    { label: 'Follow-ups Needed', value: data.filter(d => d.status === 'Follow-up').length, color: 'var(--ip-yellow)' },
    { label: 'Converted', value: data.filter(d => d.status === 'Converted').length, color: '#16a34a' },
  ];

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
      await apiClient.delete(`/leadgenerations/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'leadByBoName', header: 'Office Name' },
    { key: 'nameOfCustomer', header: 'Customer Name' },
    { key: 'fullAddress', header: 'Full Address' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'alternateMobileNumber', header: 'Alt Mobile' },
    { key: 'emailId', header: 'Email ID' },
    { key: 'visitedBy', header: 'Visited By' },
    { key: 'typeOfLead', header: 'Lead Type' },
    {
      key: 'status', header: 'Status', render: (val: string) => {
        const map: Record<string, string> = { Converted: '#16a34a', Pending: 'var(--ip-red)', 'Follow-up': 'var(--ip-yellow)' };
        return <span style={{ color: map[val] || 'var(--text-secondary)', fontWeight: 600 }}>{val}</span>;
      }
    },
    { key: 'resolvedOn', header: 'Resolved On', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'followUpDate', header: 'Follow-up', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
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
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {statCards.map(c => (
          <div key={c.label} className="glass-panel" style={{ padding: '24px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '2.4rem', fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <DataTable title="Lead Generation & Monitoring" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Lead" : "Log New Lead"} width="580px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/leadgenerations/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/leadgenerations', payload);
            }
            setShowModal(false); fetchLeads();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px' }}>
            <div>
              <label style={labelStyle}>Office Name</label>
              <select name="leadByBoName" style={inputStyle} defaultValue={editingItem?.leadByBoName || soNames[0]}>
                <optgroup label="Sub Offices (SO)">
                  {soNames.map(so => <option key={so} value={so}>{so}</option>)}
                </optgroup>
                <optgroup label="Branch Offices (BO)">
                  {BRANCH_OFFICES.map(bo => <option key={bo} value={bo}>{bo}</option>)}
                </optgroup>
              </select>
            </div>
            <FormField label="Customer Name" name="nameOfCustomer" required defaultValue={editingItem?.nameOfCustomer} />
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Full Address</label>
              <textarea name="fullAddress" rows={2} style={{...inputStyle, resize: 'vertical'} as any} defaultValue={editingItem?.fullAddress}></textarea>
            </div>
            
            <FormField label="Mobile Number" name="mobileNumber" required defaultValue={editingItem?.mobileNumber} />
            <FormField label="Alternate Mobile Number" name="alternateMobileNumber" defaultValue={editingItem?.alternateMobileNumber} />
            
            <FormField label="Email ID" name="emailId" type="email" defaultValue={editingItem?.emailId} />
            <FormField label="Visited By" name="visitedBy" defaultValue={editingItem?.visitedBy} />
            
            <div>
              <label style={labelStyle}>Type of Lead <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="typeOfLead" style={inputStyle} defaultValue={editingItem?.typeOfLead || 'Account Opening'}>
                <option value="Account Opening">Account Opening</option>
                <option value="PLI and RPLI">PLI and RPLI</option>
                <option value="Article delivery">Article delivery</option>
                <option value="Marchant On boarding">Marchant On boarding</option>
                <option value="SSA">SSA</option>
                <option value="IPPB">IPPB</option>
                <option value="bnpl">bnpl</option>
                <option value="pm-jjby">pm-jjby</option>
                <option value="pm-sby">pm-sby</option>
                <option value="apy">apy</option>
                <option value="matruvandana account">matruvandana account</option>
                <option value="ppf account">ppf account</option>
                <option value="bc point">bc point</option>
                <option value="postal francisy">postal francisy</option>
                <option value="mutual funds">mutual funds</option>
                <option value="kevic">kevic</option>
                <option value="others">others</option>
              </select>
            </div>
            
            <FormField label="Resolved On" name="resolvedOn" type="date" defaultValue={editingItem?.resolvedOn} />
            
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" style={inputStyle} defaultValue={editingItem?.status || 'Pending'}>
                <option value="Pending">Pending</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            <FormField label="Follow-up Date" name="followUpDate" type="date" defaultValue={editingItem?.followUpDate} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Lead" : "Save Lead"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete Lead for <strong>{deletingItem?.nameOfCustomer}</strong>?
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

export default LeadGeneration;
