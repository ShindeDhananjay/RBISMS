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

const BuildingMaintenance = () => {
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
    fetchBuildings(); 
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/buildingmaintenances');
      setData(response.data?.data || []);
    } catch (err) { console.error('Failed to fetch buildings', err); setData([]); }
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
      await apiClient.delete(`/buildingmaintenances/${deletingItem._id}`);
      setShowDeleteModal(false);
      fetchBuildings();
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'nameOfPostOffice', header: 'Post Office' },
    { key: 'buildingType', header: 'Type' },
    { key: 'nameOfOwner', header: 'Owner' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'emailNumber', header: 'Email ID' },
    { key: 'gatNumber0712', header: '07/12 & Gat No' },
    { key: 'citySurveyNumber', header: 'City Survey No' },
    { key: 'bathroom', header: 'Bathroom' },
    { key: 'storeRoom', header: 'Store Room' },
    { key: 'customerAreaSqMt', header: 'Cust Area (sq.mt)' },
    { key: 'noOfCounters', header: 'Counters' },
    { key: 'totalAreaInSqFt', header: 'Total Area (sq.ft)' },
    { key: 'monthlyRent', header: 'Monthly Rent (₹)' },
    { key: 'lastLeaseDeedCompletedOn', header: 'Last Lease Deed', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'dateOfRenewal', header: 'Date of Renewal', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'dateOfExpiryOfLeaseDeed', header: 'Lease Expiry', render: (val: string) => {
      if (!val) return 'N/A';
      const isExpired = new Date(val) < new Date();
      return <span style={{ color: isExpired ? 'var(--ip-red)' : '#16a34a', fontWeight: 600 }}>{new Date(val).toLocaleDateString('en-GB')}</span>;
    }},
    { key: 'correspondingAddressOfOwner', header: 'Owner Address' },
    { key: 'treasuryEmbodied', header: 'Treasury Embodied' },
    { key: 'lastDateOfColorOfBuilding', header: 'Last Color Date', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
    { key: 'requirementOfFurnitureFromOwner', header: 'Furniture Req' },
    { key: 'lastDateOfSanitizationOfBuilding', header: 'Last Sanitization', render: (val: string) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A' },
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
      <DataTable title="Departmental and Private Accommodation of building" columns={columns} data={data} loading={loading} onAdd={() => { setEditingItem(null); setShowModal(true); }} />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={editingItem ? "Edit Building Record" : "Add Building Record"} width="800px">
        <form onSubmit={async (e) => {
          e.preventDefault(); setSaving(true);
          const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
          try {
            if (editingItem) {
              await apiClient.put(`/buildingmaintenances/${editingItem._id}`, payload);
            } else {
              await apiClient.post('/buildingmaintenances', payload);
            }
            setShowModal(false); fetchBuildings();
          }
          catch (err) { console.error('Failed to save', err); }
          finally { setSaving(false); }
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px' }}>
            <div>
              <label style={labelStyle}>Name of Post office</label>
              <select name="nameOfPostOffice" style={inputStyle} required defaultValue={editingItem?.nameOfPostOffice || soNames[0]}>
                <optgroup label="Sub Offices (SO)">
                  {soNames.map(so => <option key={so} value={so}>{so}</option>)}
                </optgroup>
                <optgroup label="Branch Offices (BO)">
                  {BRANCH_OFFICES.map(bo => <option key={bo} value={bo}>{bo}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Building Type</label>
              <select name="buildingType" style={inputStyle} defaultValue={editingItem?.buildingType || 'Departmental'}>
                <option value="Departmental">Departmental</option>
                <option value="Private">Private</option>
                <option value="Grampanchayat">Grampanchayat</option>
              </select>
            </div>
            <FormField label="Name of Owner" name="nameOfOwner" defaultValue={editingItem?.nameOfOwner} />
            <FormField label="Mobile Number" name="mobileNumber" defaultValue={editingItem?.mobileNumber} />
            <FormField label="Email ID" name="emailNumber" type="email" defaultValue={editingItem?.emailNumber} />
            <FormField label="07/12 and Gat Number" name="gatNumber0712" defaultValue={editingItem?.gatNumber0712} />
            <FormField label="City Survey Number" name="citySurveyNumber" defaultValue={editingItem?.citySurveyNumber} />
            
            <div>
              <label style={labelStyle}>Bathroom</label>
              <select name="bathroom" style={inputStyle} defaultValue={editingItem?.bathroom || 'Yes'}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Store room</label>
              <select name="storeRoom" style={inputStyle} defaultValue={editingItem?.storeRoom || 'Yes'}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <FormField label="Customer Area sq.mt" name="customerAreaSqMt" type="number" defaultValue={editingItem?.customerAreaSqMt} />
            <FormField label="No of Counters" name="noOfCounters" type="number" defaultValue={editingItem?.noOfCounters} />
            <FormField label="Total Area in SQ Ft" name="totalAreaInSqFt" type="number" defaultValue={editingItem?.totalAreaInSqFt} />
            <FormField label="Monthly Rent" name="monthlyRent" type="number" defaultValue={editingItem?.monthlyRent} />
            
            <FormField label="Last Lease Deed Completed on" name="lastLeaseDeedCompletedOn" type="date" defaultValue={editingItem?.lastLeaseDeedCompletedOn} />
            <FormField label="Date of Renewal" name="dateOfRenewal" type="date" defaultValue={editingItem?.dateOfRenewal} />
            <FormField label="Date of Expiry of lease deed" name="dateOfExpiryOfLeaseDeed" type="date" defaultValue={editingItem?.dateOfExpiryOfLeaseDeed} />
            
            <FormField label="Corresponding address of owner" name="correspondingAddressOfOwner" defaultValue={editingItem?.correspondingAddressOfOwner} />
            
            <div>
              <label style={labelStyle}>Treasury embodied or not?</label>
              <select name="treasuryEmbodied" style={inputStyle} defaultValue={editingItem?.treasuryEmbodied || 'Yes'}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            
            <FormField label="Last date of Color of building" name="lastDateOfColorOfBuilding" type="date" defaultValue={editingItem?.lastDateOfColorOfBuilding} />
            <FormField label="Requirement of furniture from owner" name="requirementOfFurnitureFromOwner" defaultValue={editingItem?.requirementOfFurnitureFromOwner} />
            <FormField label="Last date of sanitization of building" name="lastDateOfSanitizationOfBuilding" type="date" defaultValue={editingItem?.lastDateOfSanitizationOfBuilding} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <FormButtons onCancel={() => setShowModal(false)} submitLabel={editingItem ? "Update Record" : "Save Record"} loading={saving} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} title="Confirm Deletion" width="400px">
        <div style={{ padding: '10px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Are you sure you want to delete the record for <strong>{deletingItem?.nameOfPostOffice}</strong>?
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

export default BuildingMaintenance;
