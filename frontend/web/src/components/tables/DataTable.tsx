import React, { useState } from 'react';
import { exportToExcel, exportToPDF, exportToPrint } from '../../utils/exportUtils';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  exportValue?: (value: any, row: any) => string | number;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title: string;
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  rowStyle?: (row: any) => React.CSSProperties;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, title, loading, onAdd, onEdit, onDelete, rowStyle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExportPDF = () => {
    exportToPDF(filteredData, columns, title.replace(/\s+/g, '_'), title);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredData, columns, title.replace(/\s+/g, '_'));
  };

  const handlePrint = () => {
    exportToPrint(filteredData, columns, title);
  };

  return (
    <div className="data-table-container glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', width: '100%', flex: 1, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{title}</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={handlePrint} style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', transition: 'var(--transition)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'}>
            Print
          </button>
          <button onClick={handleExportPDF} style={{ background: 'rgba(124, 16, 140, 0.08)', color: 'var(--ip-red-light)', border: '1px solid rgba(124, 16, 140, 0.3)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', transition: 'var(--transition)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(124, 16, 140, 0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(124, 16, 140, 0.08)'}>
            Export PDF
          </button>
          <button onClick={handleExportExcel} style={{ background: 'rgba(136, 51, 153, 0.08)', color: 'var(--ip-yellow)', border: '1px solid rgba(136, 51, 153, 0.3)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', transition: 'var(--transition)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(136, 51, 153, 0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(136, 51, 153, 0.08)'}>
            Export Excel
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'var(--bg-color)', border: '1px solid var(--panel-border)',
              color: 'var(--text-primary)', padding: '8px 16px', borderRadius: 'var(--radius-sm)'
            }}
          />
          {onAdd && (
            <button
              onClick={onAdd}
              style={{
                background: 'var(--ip-red)', color: 'white', border: 'none',
                padding: '8px 24px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontWeight: 'bold', transition: 'var(--transition)'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              + Add New
            </button>
          )}
        </div>
      </div>

      <div style={{ overflow: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--panel-bg)', zIndex: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ padding: col.header === 'Actions' ? '16px 72px 16px 24px' : '16px 24px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--panel-border)', whiteSpace: 'nowrap', textAlign: col.header === 'Actions' ? 'right' : 'left' }}>{col.header}</th>
              ))}
              {(onEdit || onDelete) && <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: '1px solid var(--panel-border)', whiteSpace: 'nowrap' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '32px', textAlign: 'center', color: 'var(--ip-red)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid var(--ip-yellow)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Loading data...
                  </div>
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </td>
              </tr>
            ) : filteredData.length > 0 ? filteredData.map((row, idx) => (
              <tr key={row.id || idx} style={{ borderBottom: '1px solid var(--panel-border)', transition: 'background 0.2s', background: 'transparent', ...(rowStyle ? rowStyle(row) : {}) }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(85, 2, 98, 0.04)'}
                onMouseOut={e => e.currentTarget.style.background = (rowStyle ? (rowStyle(row).backgroundColor || rowStyle(row).background || 'transparent') : 'transparent') as string}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '16px 24px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '16px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} 
                        style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.2)', color: '#eab308', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', marginRight: '12px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.12)'}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} 
                        style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
