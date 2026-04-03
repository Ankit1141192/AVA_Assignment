import React, { useState, useEffect } from 'react';
import UploadArea from './components/UploadArea';
import InvoiceTable from './components/InvoiceTable';
import Dashboard from './components/Dashboard';
import { getInvoices, getAnalytics } from './api';
import './index.css';
import { LayoutDashboard, FileUp, ListChecks } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('dashboard');
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const inv = await getInvoices();
      const st = await getAnalytics();
      setInvoices(inv || []);
      setStats(st || null);
    } catch (err) {
      console.error('Data fetech failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSuccess = () => {
    fetchData(); // Refresh data after upload
    setView('dashboard'); // Switch to dashboard to see results
  };

  return (
    <div className="app-container">
      <header className="header fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '0.5rem', 
            borderRadius: '0.75rem',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <FileUp color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Invoice<span style={{ color: 'var(--primary)' }}>AI</span>
          </h1>
        </div>
        
        <nav className="glass-card" style={{ padding: '0.5rem', borderRadius: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setView('dashboard')}
            className={`btn ${view === 'dashboard' ? 'btn-primary' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: view === 'dashboard' ? '' : 'transparent' }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => setView('upload')}
            className={`btn ${view === 'upload' ? 'btn-primary' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: view === 'upload' ? '' : 'transparent' }}
          >
            <FileUp size={18} />
            Process New
          </button>
          <button 
            onClick={() => setView('list')}
            className={`btn ${view === 'list' ? 'btn-primary' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: view === 'list' ? '' : 'transparent' }}
          >
            <ListChecks size={18} />
            History
          </button>
        </nav>
      </header>

      <main>
        {view === 'dashboard' && stats && (
          <Dashboard stats={stats} />
        )}
        
        {view === 'upload' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Extract Data from Invoice</h2>
            <UploadArea onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {(view === 'list' || view === 'dashboard') && (
          <InvoiceTable invoices={invoices} />
        )}
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p>Gathering your financial insights...</p>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 Invoice Extraction AI • Powered by Gemini 1.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;