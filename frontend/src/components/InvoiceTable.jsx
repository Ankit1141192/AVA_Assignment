import React from 'react';
import { FileText, ExternalLink, Trash2 } from 'lucide-react';

const InvoiceTable = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No invoices processed yet. Upload your first one!</p>
      </div>
    );
  }

  return (
    <div className="glass-card fade-in" style={{ marginTop: '2rem', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={20} color="var(--primary)" />
        Recent Invoices
      </h3>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id || index}>
              <td style={{ fontWeight: 600 }}>{invoice.vendor_name}</td>
              <td style={{ color: 'var(--text-muted)' }}>{invoice.invoice_date || 'N/A'}</td>
              <td style={{ fontWeight: 600 }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(invoice.total_amount)}
              </td>
              <td style={{ fontSize: '0.875rem' }}>
                <span style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem',
                  color: 'var(--primary)'
                }}>
                  {invoice.json_data?.category || 'General'}
                </span>
              </td>
              <td>
                <span style={{ 
                  color: '#10b981', 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ● Processed
                </span>
              </td>
              <td>
                <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }}>
                  <ExternalLink size={18} color="var(--text-muted)" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
