import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Interface for Column Definitions expected by exporters.
 */
export interface ColumnDef {
  header: string;
  key: string;
  exportValue?: (value: any, row: any) => string | number;
}

/**
 * Export to CSV format.
 */
export const exportToCSV = (data: any[], columns: ColumnDef[], filename: string) => {
  const csvRows = [];
  
  // Get Headers
  const headers = columns.map(col => col.header);
  csvRows.push(headers.join(','));

  // Get Data Rows
  data.forEach(row => {
    const values = columns.map(col => {
      let val = row[col.key];
      if (col.exportValue) {
        val = col.exportValue(val, row);
      }
      const strVal = val !== null && val !== undefined ? String(val) : '';
      // Escape commas by enclosing in quotes
      return `"${strVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Export to Excel (XLSX) format.
 */
export const exportToExcel = (data: any[], columns: ColumnDef[], filename: string) => {
  const formattedData = data.map(row => {
    const newObj: any = {};
    columns.forEach(col => {
      let val = row[col.key];
      if (col.exportValue) {
        val = col.exportValue(val, row);
      }
      newObj[col.header] = val;
    });
    return newObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export to PDF format.
 */
export const exportToPDF = (data: any[], columns: ColumnDef[], filename: string, title: string) => {
  const doc = new jsPDF();

  const tableHeaders = columns.map(col => col.header);
  const tableData = data.map(row => columns.map(col => {
    let val = row[col.key];
    if (col.exportValue) {
      val = col.exportValue(val, row);
    }
    return val !== null && val !== undefined ? String(val) : '';
  }));

  // Add a nice title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // AutoTable plugin for rendering tables
  autoTable(doc, {
    startY: 30,
    head: [tableHeaders],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
    },
    headStyles: {
      halign: 'left',
      fillColor: [206, 17, 38], // Brand Red
      textColor: [255, 255, 255],
    }
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Print the table data directly.
 */
export const exportToPrint = (data: any[], columns: ColumnDef[], title: string) => {
  const tableHeaders = columns.map(col => `<th>${col.header}</th>`).join('');
  const tableData = data.map(row => {
    return '<tr>' + columns.map(col => {
      let val = row[col.key];
      if (col.exportValue) {
        val = col.exportValue(val, row);
      }
      const strVal = val !== null && val !== undefined ? String(val) : '';
      return `<td>${strVal}</td>`;
    }).join('') + '</tr>';
  }).join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
          h1 { text-align: center; color: #ce1126; margin-bottom: 20px; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px; }
          th { background-color: #f8f9fa; font-weight: 600; color: #555; }
          tr:nth-child(even) { background-color: #fafafa; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableData}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for resources to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
