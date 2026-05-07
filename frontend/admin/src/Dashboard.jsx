import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import {
  Users, Building, CreditCard, Activity, Percent,
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  Bell, Search, Plus, Download, Filter, MoreHorizontal,
  CheckCircle2, AlertTriangle, FileText, Globe, Cpu, Calendar,
  ChevronRight, ExternalLink, ArrowRight, XCircle
} from 'lucide-react';
import axios from 'axios';
import Modal from './components/Modal';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5000/api';

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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [processingId, setProcessingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, revenueRes, alertsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/dashboard/summary`),
          axios.get(`${API_BASE_URL}/dashboard/revenue`),
          axios.get(`${API_BASE_URL}/dashboard/alerts`)
        ]);

        setDashboardData(summaryRes.data);
        setRevenueStats(revenueRes.data);
        setSystemAlerts(alertsRes.data.alerts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock behavior if backend is not reachable
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchDashboardData();
  }, []);

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

  const primaryStats = [
    { 
      label: 'Monthly Revenue', 
      value: dashboardData?.expectedMonthlyRevenue ? `${(dashboardData.expectedMonthlyRevenue / 100000).toFixed(2)}L` : '1.24Cr', 
      prefix: '₹',
      icon: <CreditCard size={20} />, 
      trend: '+22.4%', 
      progress: 65, 
      trendState: 'up' 
    },
    { 
      label: 'Avg Occupancy', 
      value: `${dashboardData?.occupancyRate || 87.4}%`, 
      icon: <Percent size={20} />, 
      trend: '+3.1%', 
      progress: dashboardData?.occupancyRate || 78, 
      trendState: 'up' 
    },
  ];

  const secondaryStats = [
    { 
      label: 'Total Hostels', 
      value: dashboardData?.buildingCount || '124', 
      icon: <Building size={18} />, 
      trend: '+12.5%', 
      trendState: 'up' 
    },
    { 
      label: 'Occupied Beds', 
      value: dashboardData?.occupiedBeds?.toLocaleString() || '4,500', 
      icon: <Users size={18} />, 
      trend: `${dashboardData?.occupancyRate || 0}%`, 
      trendState: 'neutral'
    },
    { 
      label: 'Active Complaints', 
      value: dashboardData?.complaintsToday?.toString() || '18', 
      icon: <AlertTriangle size={18} />, 
      trend: '-5.2%', 
      trendState: 'down' 
    },
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

      {/* Stats Section */}
      <div className="stats-container">
        <div className="primary-stats">
          {primaryStats.map((stat, i) => (
            <div key={i} className={`stat-card-premium primary ${loading ? 'loading' : ''}`}>
              <div className="card-inner">
                <div className="stat-main-row">
                  <div className={`stat-icon-container ${loading ? 'skeleton' : ''}`}>
                    {!loading && stat.icon}
                  </div>
                  {!loading && (
                    <span className={`stat-trend trend-${stat.trendState}`}>
                      {stat.trendState === 'up' && <ArrowUpRight size={12} />}
                      {stat.trendState === 'down' && <ArrowDownRight size={12} />}
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div className="stat-content">
                  <span className={`stat-label ${loading ? 'skeleton' : ''}`}>
                    {!loading && stat.label}
                  </span>
                  <h2 className={`stat-value ${loading ? 'skeleton' : ''}`}>
                    {!loading && (
                      <>
                        {stat.prefix && <span className="currency-symbol">{stat.prefix}</span>}
                        {stat.value}
                      </>
                    )}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="secondary-stats">
          {secondaryStats.map((stat, i) => (
            <div key={i} className={`stat-card-premium secondary ${loading ? 'loading' : ''}`}>
              <div className="stat-content">
                <span className={`stat-label ${loading ? 'skeleton' : ''}`}>
                  {!loading && stat.label}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={`stat-value-sm ${loading ? 'skeleton' : ''}`}>
                    {!loading && stat.value}
                  </h3>
                  {!loading && (
                    <span className={`stat-trend-sub trend-${stat.trendState}`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <div style={{ width: '100%', height: 350 }} className={loading ? 'skeleton' : ''}>
              {!loading && (
                <ResponsiveContainer>
                  <AreaChart data={revenueStats?.monthlyRevenue || REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} 
                      tickFormatter={(val) => `₹${val}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      }} 
                    />
                    <ReferenceLine 
                      y={18} 
                      stroke="#94a3b8" 
                      strokeDasharray="5 5" 
                      label={{ value: 'TARGET', position: 'insideRight', fill: '#64748b', fontSize: 9, fontWeight: 900 }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--accent-primary)" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-primary)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
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
                  <span className="leader-name">{item.name}</span>
                  <span className="leader-revenue">{item.revenue}</span>
                  <span className={`leader-growth ${item.trend === 'up' ? 'up' : 'down'}`}>
                    {item.trend === 'up' ? '↑' : '↓'} {item.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pro-sidebar-panel">
          {/* Platform SaaS Health */}
          <div className="card saas-summary-card">
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <div className="card-title">
                <h3>Platform Economy</h3>
                <p>Monthly SaaS Volume</p>
              </div>
              <ArrowUpRight size={18} color="var(--accent-primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={loading ? 'skeleton' : ''}>
                {!loading && (
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL REVENUE</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.1rem 0', display: 'flex', alignItems: 'baseline', gap: '0.25rem', color: 'var(--text-primary)' }}>
                      <span style={{ fontSize: '1.1rem', opacity: 0.5 }}>₹</span>
                      {revenueStats?.rentMetrics?.totalIncome ? (revenueStats.rentMetrics.totalIncome / 100000).toFixed(1) : '18.4'}L
                    </h2>
                    <span style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: 800 }}>↑ 12.4% vs prev</span>
                  </div>
                )}
              </div>
              <div className={loading ? 'skeleton' : ''}>
                {!loading && (
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE OWNERS</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>842</h2>
                    <span style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: 800 }}>+42 new partners</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Sentinel */}
          <div className="card security-sentinel-card">
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <div className="card-title">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={18} color="var(--accent-primary)" /> Security Sentinel
                </h3>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>SECURE</span>
            </div>
            <div className="sentinel-list">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="sentinel-event skeleton" style={{ height: '50px', marginBottom: '0.5rem' }}></div>
                ))
              ) : (
                (systemAlerts.length > 0 ? systemAlerts : [
                  { type: 'rent', message: '5 tenants have pending rent past 7 days.', severity: 'medium' },
                  { type: 'maintenance', message: 'AC unit in Room 204 flagged for service.', severity: 'high' }
                ]).map((alert, i) => (
                  <div key={i} className="sentinel-event">
                    <div className={`event-dot ${alert.severity === 'high' ? 'error' : 'warning'}`}></div>
                    <div className="event-content">
                      <span className="event-title">{alert.type.toUpperCase()} ALERT</span>
                      <p className="event-desc">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Global Broadcast */}
          <div className="card broadcast-action-card" onClick={() => handleAction('broadcast')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="action-icon-box">
                <Bell size={18} />
              </div>
              <div className="card-title">
                <h3>Global Broadcast</h3>
                <p>System-wide communications</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Instantly reach all owners and tenants with verified announcements and critical system alerts.
            </p>
            <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <Plus size={16} /> New Broadcast
            </button>
          </div>

          {/* System Health & Node Monitor */}
          <div className="card health-monitor-card">
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <div className="card-title">
                <h3>Global System Nodes</h3>
                <p>Real-time cluster status</p>
              </div>
              <div className="pulse-dot"></div>
            </div>
            <div className="health-grid">
              <div className={`health-item ${loading ? 'skeleton' : ''}`}>
                {!loading && (
                  <>
                    <span className="health-label">API LATENCY</span>
                    <span className="health-value success">24ms</span>
                  </>
                )}
              </div>
              <div className={`health-item ${loading ? 'skeleton' : ''}`}>
                {!loading && (
                  <>
                    <span className="health-label">NODE UPTIME</span>
                    <span className="health-value primary">99.9%</span>
                  </>
                )}
              </div>
              <div className={`health-item wide ${loading ? 'skeleton' : ''}`}>
                {!loading && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="health-label">DATABASE LOAD</span>
                      <span className="health-value-pct">42%</span>
                    </div>
                    <div className="health-progress">
                      <div className="progress-fill" style={{ width: '42%' }}></div>
                    </div>
                  </>
                )}
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
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td colSpan="5"><div className="skeleton" style={{ height: '40px', margin: '10px 0' }}></div></td>
                  </tr>
                ))
              ) : (
                actions.map((action) => (
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
                ))
              )}
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
