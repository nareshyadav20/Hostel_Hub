import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Users, Building, CreditCard, Activity, 
  ShieldCheck, AlertCircle, ArrowUpRight, Zap
} from 'lucide-react';
import './Dashboard.css';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 450000, visitors: 2400 },
  { name: 'Feb', revenue: 520000, visitors: 1398 },
  { name: 'Mar', revenue: 480000, visitors: 9800 },
  { name: 'Apr', revenue: 610000, visitors: 3908 },
  { name: 'May', revenue: 590000, visitors: 4800 },
  { name: 'Jun', revenue: 820000, visitors: 3800 },
  { name: 'Jul', revenue: 950000, visitors: 4300 },
];

const OCCUPANCY_DATA = [
  { name: 'North', value: 85, color: '#0ea5e9' },
  { name: 'South', value: 92, color: '#6366f1' },
  { name: 'East', value: 78, color: '#10b981' },
  { name: 'West', value: 88, color: '#f59e0b' },
];

const Dashboard = () => {
  const stats = [
    { label: 'Total Hostels', value: '124', icon: <Building size={20} />, color: 'var(--accent-primary)', trend: '+12%', growth: true },
    { label: 'Total Owners', value: '86', icon: <Users size={20} />, color: 'var(--accent-success)', trend: '+5%', growth: true },
    { label: 'Active Tenants', value: '4,500', icon: <Users size={20} />, color: 'var(--accent-warning)', trend: '+18%', growth: true },
    { label: 'Total Revenue', value: 'Γé╣1.2Cr', icon: <CreditCard size={20} />, color: 'var(--accent-error)', trend: '+22%', growth: true },
  ];

  return (
    <div className="dashboard-container dashboard-view">
      <header className="dashboard-header">
        <div>
          <h1>Platform Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time analytics and system-wide performance metrics.</p>
        </div>
        <div className="health-widget-mini">
          <span className="pulse-red"></span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>System Live</span>
        </div>
      </header>

      {/* Primary Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium">
            <div className="stat-header">
              <div className="stat-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className="stat-trend" style={{ color: stat.growth ? 'var(--accent-success)' : 'var(--accent-error)' }}>
                {stat.trend} <ArrowUpRight size={14} />
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</p>
            <h2 className="stat-value">{stat.value}</h2>
            <div style={{ height: '4px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '1rem' }}>
              <div style={{ height: '100%', width: '70%', background: stat.color, borderRadius: '2px' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-section">
        {/* Main Chart */}
        <div className="chart-card card">
          <div className="chart-header">
            <h3 className="chart-title"><TrendingUp size={20} color="var(--accent-primary)" /> Revenue Analytics</h3>
            <select style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <option>Last 7 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Widgets Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Occupancy Widget */}
          <div className="activity-card card">
            <h3 className="chart-title" style={{ marginBottom: '1.5rem' }}>≡ƒÄ» Regional Occupancy</h3>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={OCCUPANCY_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {OCCUPANCY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Health Widget */}
          <div className="health-widget">
            <h3 className="chart-title" style={{ color: 'white' }}><Zap size={20} fill="#fbbf24" color="#fbbf24" /> System Nodes</h3>
            <div className="health-status-grid">
              <div className="status-item">
                <label>Main Server</label>
                <span>Online (99.9%)</span>
              </div>
              <div className="status-item">
                <label>Database</label>
                <span>Synced</span>
              </div>
              <div className="status-item">
                <label>Auth Service</label>
                <span>Healthy</span>
              </div>
              <div className="status-item">
                <label>Storage</label>
                <span>82% Scale</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="activity-card card">
          <h3 className="chart-title"><Activity size={20} color="var(--accent-secondary)" /> Platform Live Feed</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { text: 'New Owner Registered: Green Valley Hostels', time: '2m ago', icon: <Building size={16} /> },
              { text: 'Enterprise Plan Renewed by Elite Living', time: '1h ago', icon: <ShieldCheck size={16} /> },
              { text: 'New Integration: City Pharmacy Services', time: '3h ago', icon: <Zap size={16} /> },
              { text: 'Staff Alert: Maintenance needed at City View', time: '5h ago', icon: <AlertCircle size={16} color="var(--accent-error)" /> }
            ].map((item, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon">{item.icon}</div>
                <div className="activity-content">
                  <p>{item.text}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-card card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}>
          <div style={{ padding: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', boxShadow: '0 0 20px var(--accent-primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Security Audit</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Last vulnerability scan was completed 4 hours ago. All systems are secure.</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>View Full Log</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
