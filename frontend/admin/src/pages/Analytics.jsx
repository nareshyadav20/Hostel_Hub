import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Filter, Calendar, Download, TrendingUp, TrendingDown, BarChart3, Activity, PieChart as PieIcon } from 'lucide-react';
import '../NexusElite.css';

const REVENUE_DATA = [
  { name: 'Mon', rev: 4000, exp: 2400 },
  { name: 'Tue', rev: 3000, exp: 1398 },
  { name: 'Wed', rev: 2000, exp: 9800 },
  { name: 'Thu', rev: 2780, exp: 3908 },
  { name: 'Fri', rev: 1890, exp: 4800 },
  { name: 'Sat', rev: 2390, exp: 3800 },
  { name: 'Sun', rev: 3490, exp: 4300 },
];

const PIE_DATA = [
  { name: 'Standard', value: 400 },
  { name: 'Premium', value: 300 },
  { name: 'Budget', value: 300 },
];

const COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', '#10b981'];

const Analytics = () => {
  return (
    <div className="analytics-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">📈 Analytics Engine</h1>
          <p className="page-subtitle">Advanced market intelligence and predictive growth algorithms.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nexus-btn-icon" style={{ width: 'auto', padding: '0 1.5rem', borderRadius: '12px' }}>
            <Calendar size={18} style={{ marginRight: '0.75rem' }} /> Select Range
          </button>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
            <Download size={20} /> Export Intel
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="nexus-stats-grid">
        <div className="stat-card-elite">
          <div className="stat-icon-elite" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>
            <TrendingUp />
          </div>
          <div className="stat-data">
            <h3>₹42.5L</h3>
            <p>Net Profit Margin</p>
          </div>
          <div style={{ position: 'absolute', right: '2rem', top: '2rem', color: 'var(--accent-success)', fontWeight: '800', fontSize: '0.8rem' }}>
             +12.4%
          </div>
        </div>
        <div className="stat-card-elite">
          <div className="stat-icon-elite" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)' }}>
            <Activity />
          </div>
          <div className="stat-data">
            <h3>2.4%</h3>
            <p>Churn Velocity</p>
          </div>
          <div style={{ position: 'absolute', right: '2rem', top: '2rem', color: 'var(--accent-error)', fontWeight: '800', fontSize: '0.8rem' }}>
             -0.8%
          </div>
        </div>
        <div className="stat-card-elite">
          <div className="stat-icon-elite" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)' }}>
            <BarChart3 />
          </div>
          <div className="stat-data">
            <h3>8.2k</h3>
            <p>Monthly Queries</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="nexus-table-container" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Growth Trajectory</h3>
            <button className="nexus-btn-icon"><Filter size={16} /></button>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }} 
                  itemStyle={{ fontWeight: 800 }}
                />
                <Bar dataKey="rev" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="exp" fill="var(--bg-tertiary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="nexus-table-container" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Portfolio Mix</h3>
            <PieIcon size={20} color="var(--text-muted)" />
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PIE_DATA.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS[i] }}></div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.name}</span>
                </div>
                <strong style={{ fontSize: '1rem' }}>{item.value} Units</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
