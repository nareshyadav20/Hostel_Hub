import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Filter, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';

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
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1>Analytics Engine</h1>
          <p>Advanced metrics and predictive growth algorithms.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-secondary"><Calendar size={18} /> Select Range</button>
          <button className="btn btn-primary"><Download size={18} /> Export Intel</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Profit Margin</span>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 700 }}>
              <TrendingUp size={14} /> +4.2%
            </span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>₹42.5L</h2>
          <div style={{ marginTop: '1rem', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px' }}>
            <div style={{ width: '65%', height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Churn Rate</span>
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 700 }}>
              <TrendingDown size={14} /> +1.2%
            </span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>2.4%</h2>
          <div style={{ marginTop: '1rem', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px' }}>
            <div style={{ width: '15%', height: '100%', background: '#ef4444', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3>Growth Trajectory</h3>
          <div style={{ width: '100%', height: 350, marginTop: '2rem' }}>
            <ResponsiveContainer>
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="rev" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exp" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Hostel Mix</h3>
          <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
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
          <div style={{ marginTop: '1rem' }}>
            {PIE_DATA.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i] }}></div>
                  <span color="var(--text-secondary)">{item.name}</span>
                </div>
                <strong>{item.value} Units</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
