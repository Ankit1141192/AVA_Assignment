import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';

const Dashboard = ({ stats }) => {
  if (!stats || !stats.invoices) return null;

  // Simple aggregation for chart (last 7 invoices)
  const chartData = stats.invoices.slice(0, 7).reverse().map(inv => ({
    name: inv.vendor_name.substring(0, 10),
    amount: inv.total_amount
  }));

  return (
    <div className="fade-in">
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-label">
            <DollarSign size={16} color="var(--primary)" />
            Total Spend
          </div>
          <div className="stat-value">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.total_spend || 0)}
          </div>
        </div>
        
        <div className="glass-card stat-card">
          <div className="stat-label">
            <Calendar size={16} color="var(--primary)" />
            Invoices Processed
          </div>
          <div className="stat-value">{stats.invoice_count || 0}</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-label">
            <Users size={16} color="var(--primary)" />
            Unique Vendors
          </div>
          <div className="stat-value">{stats.vendor_count || 0}</div>
        </div>
      </div>

      <div className="glass-card" style={{ height: '300px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Spend Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '1rem', color: '#fff' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area type="monotone" dataKey="amount" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAmt)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
