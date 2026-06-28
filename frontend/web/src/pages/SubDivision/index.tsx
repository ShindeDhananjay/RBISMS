import { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import apiClient from '../../services/apiClient';
import Modal from '../../components/ui/Modal';
import { FormField, FormButtons } from '../../components/ui/FormComponents';

const inputStyle = {
  width: '100%', padding: '12px 16px', background: '#fff',
  border: '1.5px solid var(--panel-border)', borderRadius: '12px',
  color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', marginBottom: '6px', fontWeight: 600,
  fontSize: '0.88rem', color: 'var(--text-secondary)',
};

const SubDivision = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/subdivisions');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch', err); setData([]); }
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
      await apiClient.delete(`/subdivisions/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'employeeName', header: 'Name of employee' },
    { key: 'designation', header: 'Designation' },
    { key: 'postingOffice', header: 'Posting office' },
    { key: 'pranNumber', header: 'PRAN Number' },
    { key: 'dnOfficeName', header: 'DN office Name' },
    { key: 'dateOfBirth', header: 'Date of Birth', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'hobby', header: 'Hobby' },
    { key: 'sportsActivities', header: 'Sports activities' },
    { key: 'education', header: 'Education' },
    { key: 'culturalActivities', header: 'Cultural activities' },
    { key: 'dateOfAppointment', header: 'Date of Appointment', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'dateOfPromotion', header: 'Date of Promotion', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'typeOfPromotion', header: 'Type of Promotion' },
    { key: 'macp1', header: 'MACP-I', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'macp2', header: 'MACP-II', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'macp3', header: 'MACP-III', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'punishmentDetails', header: 'Punishment' },
    { key: 'dateOfRetirement', header: 'Date of retirement', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'mobile', header: 'Mobile Number' },
    { key: 'alternateMobile', header: 'Alternate mobile' },
    { key: 'email', header: 'Email id' },
    { key: 'historicalOfficePosting', header: 'Office of posting' },
    { key: 'postingDate', header: 'Posting date', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'transferPostingOffice', header: 'Transfer posting' },
    { key: 'dateOfTransfer', header: 'Date of Transfer', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'adharTraining', header: 'Adhar Training' },
    { key: 'marketingTraining', header: 'Marketing Training' },
    { key: 'pliTraining', header: 'PLI and RPLI Training' },
    { key: 'pliIdNo', header: 'PLI ID NO' },
    { key: 'inductionTraining', header: 'Induction training' },
    { key: 'ippbTraining', header: 'IPPB Training' },
    { key: 'awards', header: 'Awards (last FY)' },
    { key: 'salaryTakenFrom', header: 'Salary Taken From' },
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

  const statCards = [
    { label: 'Total Employees', value: data.length, color: 'var(--ip-red)' },
    { label: 'Inspector of Posts', value: data.filter(d => d.designation === 'Inspector of Posts').length, color: 'var(--ip-yellow)' },
    { label: 'Postmaster', value: data.filter(d => d.designation === 'Postmaster').length, color: '#16a34a' },
    { label: 'Postal Assistant', value: data.filter(d => d.designation === 'Postal Assistant').length, color: '#2563eb' },
    { label: 'Postman', value: data.filter(d => d.designation === 'Postman').length, color: '#f59e0b' },
    { label: 'MTS', value: data.filter(d => d.designation === 'MTS').length, color: '#8b5cf6' },
    { label: 'BPM', value: data.filter(d => d.designation === 'BPM').length, color: '#14b8a6' },
    { label: 'ABPM', value: data.filter(d => d.designation === 'ABPM').length, color: '#f43f5e' },
    { label: 'Dak Sewak', value: data.filter(d => d.designation === 'Dak Sewak').length, color: '#0ea5e9' },
    { label: 'Outsider', value: data.filter(d => d.designation === 'Outsider').length, color: 'var(--text-secondary)' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {statCards.map(c => (
          <div key={c.label} className="glass-panel" style={{ padding: '16px 20px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{c.label}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
      <DataTable title="Sub Division Employee Management" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />
      
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Employee" : "Add Sub DN Office Employee"} width="800px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/subdivisions/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/subdivisions', payload);
            }
            setShowModal(false); fetchData();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px' }}>
            {/* Basic Info */}
            <FormField label="Name of employee" name="employeeName" required defaultValue={editingItem?.employeeName} />
            <div>
              <label style={labelStyle}>Designation <span style={{ color: 'var(--ip-red)' }}>*</span></label>
              <select name="designation" style={inputStyle} required defaultValue={editingItem?.designation || 'Inspector of Posts'}>
                <option value="Inspector of Posts">Inspector of Posts</option>
                <option value="Postmaster">Postmaster</option>
                <option value="Postal Assistant">Postal Assistant</option>
                <option value="Postman">Postman</option>
                <option value="MTS">MTS</option>
                <option value="BPM">BPM</option>
                <option value="ABPM">ABPM</option>
                <option value="Dak Sewak">Dak Sewak</option>
                <option value="Outsider">Outsider</option>
              </select>
            </div>
            <FormField label="Posting office" name="postingOffice" required defaultValue={editingItem?.postingOffice} />
            <FormField label="PRAN Number" name="pranNumber" defaultValue={editingItem?.pranNumber} />
            <FormField label="DN office Name" name="dnOfficeName" defaultValue={editingItem?.dnOfficeName} />
            
            {/* Personal Details */}
            <FormField label="Date of Birth" name="dateOfBirth" type="date" defaultValue={editingItem?.dateOfBirth} />
            <div>
              <label style={labelStyle}>Blood Group</label>
              <select name="bloodGroup" style={inputStyle} defaultValue={editingItem?.bloodGroup || ''}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <FormField label="Hobby" name="hobby" defaultValue={editingItem?.hobby} />
            <FormField label="Sports activities" name="sportsActivities" defaultValue={editingItem?.sportsActivities} />
            <FormField label="Education" name="education" defaultValue={editingItem?.education} />
            <FormField label="Cultural activities" name="culturalActivities" defaultValue={editingItem?.culturalActivities} />
            
            {/* Service Details */}
            <FormField label="Date of Appointment" name="dateOfAppointment" type="date" defaultValue={editingItem?.dateOfAppointment} />
            <FormField label="Date of Promotion" name="dateOfPromotion" type="date" defaultValue={editingItem?.dateOfPromotion} />
            <FormField label="Type of Promotion" name="typeOfPromotion" defaultValue={editingItem?.typeOfPromotion} />
            <FormField label="MACP-I" name="macp1" type="date" defaultValue={editingItem?.macp1} />
            <FormField label="MACP-II" name="macp2" type="date" defaultValue={editingItem?.macp2} />
            <FormField label="MACP-III" name="macp3" type="date" defaultValue={editingItem?.macp3} />
            <FormField label="Punishment if any and period" name="punishmentDetails" defaultValue={editingItem?.punishmentDetails} />
            <FormField label="Date of retirement" name="dateOfRetirement" type="date" defaultValue={editingItem?.dateOfRetirement} />
            
            {/* Contact Details */}
            <FormField label="Mobile Number" name="mobile" required defaultValue={editingItem?.mobile} />
            <FormField label="Alternate mobile number" name="alternateMobile" defaultValue={editingItem?.alternateMobile} />
            <FormField label="Email id" name="email" type="email" defaultValue={editingItem?.email} />
            
            {/* Posting & Transfer Details */}
            <FormField label="Office of posting" name="historicalOfficePosting" defaultValue={editingItem?.historicalOfficePosting} />
            <FormField label="Posting date" name="postingDate" type="date" defaultValue={editingItem?.postingDate} />
            <FormField label="Transfer posting to office" name="transferPostingOffice" defaultValue={editingItem?.transferPostingOffice} />
            <FormField label="Date of Transfer" name="dateOfTransfer" type="date" defaultValue={editingItem?.dateOfTransfer} />
            
            {/* Training & Achievements */}
            <FormField label="Adhar Training (Yes/No)" name="adharTraining" defaultValue={editingItem?.adharTraining} />
            <FormField label="Marketing Training (Yes/No)" name="marketingTraining" defaultValue={editingItem?.marketingTraining} />
            <FormField label="PLI and RPLI Training (Yes/No)" name="pliTraining" defaultValue={editingItem?.pliTraining} />
            <FormField label="PLI ID NO" name="pliIdNo" defaultValue={editingItem?.pliIdNo} />
            <FormField label="Induction training (Yes/No)" name="inductionTraining" defaultValue={editingItem?.inductionTraining} />
            <FormField label="IPPB Training (Yes/No)" name="ippbTraining" defaultValue={editingItem?.ippbTraining} />
            <div style={{ gridColumn: 'span 2' }}>
              <FormField label="Any awards during last fy year by CO/RO/DO/Sub DN Level" name="awards" fullWidth defaultValue={editingItem?.awards} />
            </div>
            
            <div>
              <label style={labelStyle}>Salary taken from</label>
              <select name="salaryTakenFrom" style={inputStyle} defaultValue={editingItem?.salaryTakenFrom || 'IPPB'}>
                <option value="IPPB">IPPB</option>
                <option value="DoP">DoP</option>
                <option value="Other bank">Other bank</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Employee" : "Save Employee"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete <strong>{deletingItem?.employeeName}</strong>?
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

export default SubDivision;
