import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Building, CreditCard, Activity, Percent,
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  Bell, Search, Plus, Download, Filter, MoreHorizontal,
  CheckCircle2, AlertTriangle, FileText, Globe, Cpu, Calendar,
  ChevronRight, ExternalLink, ArrowRight, XCircle
} from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 450000, target: 400000 },
  { name: 'Feb', revenue: 520000, target: 450000 },
  { name: 'Mar', revenue: 480000, target: 500000 },
  { name: 'Apr', revenue: 610000, target: 550000 },
  { name: 'May', revenue: 590000, target: 600000 },
  { name: 'Jun', revenue: 820000, target: 700000 },
  { name: 'Jul', revenue: 950000, target: 850000 },
];

const LEADERBOARD = [
  { name: 'Bangalore Central', revenue: '₹42.5L', growth: '+15.2%', trend: 'up' },
  { name: 'Pune West Hub', revenue: '₹28.2L', growth: '+8.4%', trend: 'up' },
  { name: 'Hyderabad Tech', revenue: '₹24.1L', growth: '+12.1%', trend: 'up' },
];

const INITIAL_ACTIONS = [
  { id: 1, type: 'KYC Verification', owner: 'Rahul Mehta', priority: 'High', status: 'Pending', date: '2h ago' },
  { id: 2, type: 'Property Listing', owner: 'Sriya Reddy', priority: 'Medium', status: 'Pending', date: '5h ago' },
  { id: 3, type: 'Subscription Renewal', owner: 'Amit Shah', priority: 'Urgent', status: 'Pending', date: '15m ago' },
];

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [processingId, setProcessingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [filterRegion, setFilterRegion] = useState('All Regions');

  const handleAction = (type, task = null) => {
    if (task) setSelectedTask(task);
    setActiveModal(type);
  };

  const handleTaskAction = (actionType, task = null) => {
    const targetTask = task || selectedTask;
    if (!targetTask) return;

    // Set processing state
    setProcessingId(targetTask.id);
    setOpenDropdownId(null);

    // Update local state to show feedback
    setActions(prev => prev.map(a =>
      a.id === targetTask.id ? { ...a, status: actionType } : a
    ));

    // Reset processing state after delay
    setTimeout(() => {
      setProcessingId(null);
      setActiveModal(null);
      setSelectedTask(null);
    }, 1000);
  };

  const stats = [
    { label: 'Total Hostels', value: '124', icon: <Building size={20} />, trend: '+12.5%', progress: 85, trendUp: true },
    { label: 'Active Tenants', value: '4,500', icon: <Users size={20} />, trend: '+18.2%', progress: 92, trendUp: true },
    { label: 'Avg Occupancy', value: '87.4%', icon: <Percent size={20} />, trend: '+3.1%', progress: 78, trendUp: true },
    { label: 'Ecosystem GMV', value: '₹1.24Cr', icon: <CreditCard size={20} />, trend: '+22.4%', progress: 65, trendUp: true },
    { label: 'Active Complaints', value: '18', icon: <AlertTriangle size={20} />, trend: '-5.2%', progress: 12, trendUp: false },
  ];

  return (
    <div className="dashboard-view page-container animate-fade">
      {/* Global Dashboard Filter Bar */}
      <div className="global-filter-bar">
        <div className="filter-group">
          <Calendar size={18} color="var(--accent-primary)" />
          <span className="filter-label">Timeline:</span>
          <select className="filter-select">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Current Year</option>
          </select>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
        <div className="filter-group">
          <Globe size={18} color="var(--accent-primary)" />
          <span className="filter-label">Region:</span>
          <select className="filter-select" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
            <option>All Regions</option>
            <option>Bangalore</option>
            <option>Pune</option>
            <option>Hyderabad</option>
          </select>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleAction('report')}>
            <FileText size={16} /> Audit Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/hostels')}>
            <Plus size={16} /> New Property
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '1rem' }}>
              <div className="stat-icon-container" style={{ width: '42px', height: '42px' }}>
                {stat.icon}
              </div>
              <span className={`stat-trend trend-${stat.trendUp ? 'up' : 'down'}`}>{stat.trend}</span>
            </div>
            <div style={{ width: '100%' }}>
              <span className="stat-label">{stat.label}</span>
              <h2 className="stat-value" style={{ margin: '0.2rem 0' }}>{stat.value}</h2>
              <div className="kpi-gauge-container" style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-muted)' }}>PERFORMANCE</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill" style={{ width: `${stat.progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Health */}
      <div className="analytics-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="main-chart-card">
            <div className="card-header">
              <div className="card-title">
                <h3>Revenue vs Target</h3>
                <span>Global financial performance benchmarks</span>
              </div>
              <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div className="card-title">
                <h3>Regional Performance Hubs</h3>
                <span>Highest growth properties by city</span>
              </div>
            </div>
            <div className="leaderboard-list">
              {LEADERBOARD.map((item, i) => (
                <div key={i} className="leader-item">
                  <div className="leader-info">
                    <span className="leader-name">{item.name}</span>
                    <span className="leader-sub">Monthly Volume: {item.revenue}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`stat-trend trend-${item.trend}`} style={{ fontSize: '0.9rem' }}>{item.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pro-sidebar-panel">
          {/* Platform SaaS Health */}
          <div className="saas-health-card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div className="card-title">
                <h3 style={{ color: '#fff' }}>Platform Economy</h3>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>SaaS Subscription Revenue</span>
              </div>
              <ArrowUpRight color="var(--accent-primary)" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>MONTHLY REVENUE</span>
                <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: '0.2rem 0' }}>₹18.4L</h2>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>+12.4% from Mar</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>ACTIVE OWNERS</span>
                <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: '0.2rem 0' }}>842</h2>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>+42 new</span>
              </div>
            </div>
          </div>

          {/* Security Sentinel */}
          <div className="security-sentinel">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div className="card-title">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={18} color="var(--accent-primary)" /> Security Sentinel
                </h3>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>PROTECTED</span>
            </div>
            <div className="sentinel-list">
              <div className="sentinel-event">
                <div className="event-dot success"></div>
                <div className="leader-info">
                  <span className="leader-name" style={{ fontSize: '0.8rem' }}>Superadmin Login</span>
                  <span className="leader-sub">IP: 192.168.1.45 • 2m ago</span>
                </div>
              </div>
              <div className="sentinel-event">
                <div className="event-dot warning"></div>
                <div className="leader-info">
                  <span className="leader-name" style={{ fontSize: '0.8rem' }}>Failed Partner Login</span>
                  <span className="leader-sub">Mumbai Node • 15m ago</span>
                </div>
              </div>
              <div className="sentinel-event">
                <div className="event-dot error"></div>
                <div className="leader-info">
                  <span className="leader-name" style={{ fontSize: '0.8rem' }}>Critical System Patch</span>
                  <span className="leader-sub">Applied via CLI • 1h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Broadcast */}
          <div className="broadcast-card" onClick={() => handleAction('broadcast')}>
            <div className="broadcast-icon-box">
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Global Broadcast</h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>Send an immediate alert to all Properties.</p>
            </div>
            <ArrowRight size={18} style={{ alignSelf: 'flex-end' }} />
          </div>

          {/* System Health & Node Monitor */}
          <div className="health-monitor-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <div className="card-title">
                <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', fontWeight: 800 }}>
                  <Cpu size={18} color="var(--accent-primary)" /> Global System Nodes
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>LIVE CLUSTER STATUS</span>
              </div>
              <div className="pulse-dot"></div>
            </div>
            <div className="health-grid" style={{ marginTop: 0, gap: '0.75rem' }}>
              <div className="health-item" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <span className="health-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>API LATENCY</span>
                <span className="health-value" style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 900 }}>24ms</span>
              </div>
              <div className="health-item" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <span className="health-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>NODE UPTIME</span>
                <span className="health-value" style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: 900 }}>99.9%</span>
              </div>
              <div className="health-item" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', gridColumn: 'span 2' }}>
                <span className="health-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>DATABASE LOAD</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ width: '42%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>42%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Actions Table */}
      <div className="operational-queue-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-primary)" /> Operational Intelligence Queue
          </h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setActions(INITIAL_ACTIONS)}>Refresh Queue</button>
        </div>
        <table className="pro-table">
          <thead>
            <tr>
              <th>Task Type</th>
              <th>Partner Node</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Command</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.id} style={{ opacity: processingId === action.id ? 0.5 : 1, transition: 'all 0.3s' }}>
                <td style={{ fontWeight: 700 }}>{action.type}</td>
                <td>{action.owner}</td>
                <td><span className={`priority-badge priority-${action.priority.toLowerCase()}`}>{action.priority}</span></td>
                <td>
                  <span style={{
                    color: action.status === 'Approved' ? '#10b981' :
                      action.status === 'Rejected' ? '#ef4444' :
                        action.status === 'Flagged' ? '#f59e0b' : 'var(--text-muted)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase'
                  }}>
                    {processingId === action.id ? 'Processing...' : action.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="command-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      className={`btn btn-ghost btn-sm ${openDropdownId === action.id ? 'active' : ''}`}
                      style={{ padding: '0.4rem' }}
                      onClick={() => setOpenDropdownId(openDropdownId === action.id ? null : action.id)}
                      disabled={processingId !== null}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openDropdownId === action.id && (
                      <div className="command-dropdown-menu" ref={dropdownRef}>
                        <button className="dropdown-item approve" onClick={() => handleTaskAction('Approved', action)}>
                          <CheckCircle2 size={14} /> Approve Request
                        </button>
                        <button className="dropdown-item flag" onClick={() => handleTaskAction('Flagged', action)}>
                          <AlertTriangle size={14} /> Flag for Audit
                        </button>
                        <button className="dropdown-item reject" onClick={() => handleTaskAction('Rejected', action)}>
                          <XCircle size={14} /> Reject Partner
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Infrastructure Audit Report */}
      <Modal
        isOpen={activeModal === 'report'}
        onClose={() => setActiveModal(null)}
        title={<span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} /> Audit Intelligence</span>}
        footer={<button className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981', color: '#000' }} onClick={() => setActiveModal(null)}>Export PDF</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>COMPLIANCE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>94.2%</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>NODES SCANNED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>1,242</div>
            </div>
          </div>
          <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All global nodes are currently operating within established safety parameters. Financial reconciliations for Q2 are verified.
            </p>
          </div>
        </div>
      </Modal>

      {/* Global Platform Broadcast */}
      <Modal
        isOpen={activeModal === 'broadcast'}
        onClose={() => setActiveModal(null)}
        title={<span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={18} /> Global Broadcast</span>}
        footer={<button className="btn btn-primary" onClick={() => setActiveModal(null)}>Deploy Alert</button>}
      >
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MESSAGE CONTENT</label>
          <textarea
            className="form-input"
            placeholder="Type your emergency message..."
            style={{ width: '100%', height: '120px', marginTop: '0.5rem', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff', resize: 'none' }}
          ></textarea>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <input type="checkbox" defaultChecked /> Owners
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <input type="checkbox" defaultChecked /> Tenants
          </label>
        </div>
      </Modal>
    </div>
  );
};
export default Dashboard;
