import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  PlusCircle, Building, Wallet, Users, ArrowUpRight, ArrowDownRight, 
  Settings, FileText, Bell, ClipboardList, Zap, Clock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 1000, backdropFilter: 'blur(4px)' 
        }}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="card"
          style={{ 
            width: '90%', maxWidth: '500px', padding: '2rem', 
            maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

function Dashboard() {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isAssetOpen, setIsAssetOpen] = useState(false);


  const stats = [
    { 
      label: 'Total Buildings', value: '4', sub: '2 Main, 2 Annex', color: 'var(--accent-primary)',
      trend: '+1 this year', trendUp: true,
      icon: <Building size={20} />
    },
    { 
      label: 'Bed Occupancy', value: '142/150', sub: '95% Filled', color: 'var(--accent-success)',
      trend: '+4% vs last week', trendUp: true,
      icon: <Users size={20} />
    },
    { 
      label: 'Monthly Revenue', value: '₹14.2L', sub: '↑ 12% vs last month', color: 'var(--accent-warning)',
      trend: 'On track', trendUp: true,
      icon: <Wallet size={20} />
    },
    { 
      label: 'Open Complaints', value: '3', sub: 'Requires Attention', color: 'var(--accent-error)',
      trend: '-2 since yesterday', trendUp: false,
      icon: <Zap size={20} />
    },
  ];

  const revenueData = [
    { name: 'Jan', value: 8.5 },
    { name: 'Feb', value: 9.2 },
    { name: 'Mar', value: 11.0 },
    { name: 'Apr', value: 12.8 },
    { name: 'May', value: 13.5 },
    { name: 'Jun', value: 14.2 },
  ];

  const occupancyData = [
    { name: 'Occupied', value: 142, color: 'var(--accent-success)' },
    { name: 'Vacant', value: 8, color: 'var(--bg-tertiary)' },
  ];



  const activities = [
    { id: 1, type: 'Payment', user: 'Rahul Sharma', action: 'paid ₹6,500', time: '10m ago', icon: <Wallet size={14} />, color: 'var(--accent-success)' },
    { id: 2, type: 'Complaint', user: 'Priya Verma', action: 'reported AC issue', time: '1h ago', icon: <Zap size={14} />, color: 'var(--accent-error)' },
    { id: 3, type: 'Check-in', user: 'Amit Singh', action: 'moved into 101-A', time: '3h ago', icon: <ArrowUpRight size={14} />, color: 'var(--accent-primary)' },
    { id: 4, type: 'System', user: 'Notice', action: 'Sent bulk utility reminder', time: '5h ago', icon: <Bell size={14} />, color: 'var(--accent-warning)' },
  ];

  const inputStyle = {
    padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', 
    background: 'var(--bg-tertiary)', color: 'var(--text-primary)'
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Portfolio Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Real-time performance across your real estate portfolio.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn" onClick={() => setIsLogsOpen(true)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
             <Clock size={16} /> Latest Logs
          </button>
          <button className="btn btn-primary" onClick={() => setIsAssetOpen(true)}>
            <PlusCircle size={16} /> New Asset
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.6rem', borderRadius: '12px', background: `${stat.color}10`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{stat.label}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>{stat.value}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '100px',
                  background: stat.trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: stat.trendUp ? 'var(--accent-success)' : 'var(--accent-error)',
                  display: 'flex', alignItems: 'center', gap: '0.2rem'
                }}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.trend.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Analytics & Activity Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Revenue Trends (6 Months)</h3>
            <select style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Occupancy Mix</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Highly efficiently utilized</p>
             <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-success)' }}>94.6%</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Recent Payments</h3>
            <button className="btn" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <tbody>
              <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Tenant</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
              {[
                { name: 'Rahul Sharma', amount: '₹6,500', status: 'Success' },
                { name: 'Priya Verma', amount: '₹8,500', status: 'Success' },
                { name: 'Amit Singh', amount: '₹5,000', status: 'Pending' }
              ].map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{p.name}</td>
                  <td style={{ padding: '1rem', fontWeight: '700' }}>{p.amount}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700',
                      background: p.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: p.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-warning)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Global Activity Feed</h3>
            <button className="btn" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', padding: '0.2rem' }}>Clear All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {activities.map((activity) => (
              <div key={activity.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  marginTop: '0.2rem', padding: '0.5rem', borderRadius: '8px', 
                  background: `${activity.color}15`, color: activity.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{activity.user}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
             Load More Activity
          </button>
        </div>
      </div>

      {/* --- Modals Section --- */}
      
      {/* Latest Logs Modal */}
      <Modal isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} title="System Logs & Activity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map(act => (
             <div key={act.id} style={{ padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: `4px solid ${act.color}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ color: act.color }}>{act.icon}</div>
                   <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{act.user}</span>
                 </div>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{act.time}</span>
               </div>
               <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{act.action}</p>
               <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                 <button className="btn" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', color: 'var(--accent-primary)' }}>View Details</button>
               </div>
             </div>
          ))}
        </div>
      </Modal>

      {/* New Asset Modal */}
      <Modal isOpen={isAssetOpen} onClose={() => setIsAssetOpen(false)} title="Add New Asset">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={(e) => { e.preventDefault(); setIsAssetOpen(false); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Asset Name</label>
            <input placeholder="e.g. Industrial Washing Machine" style={inputStyle} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Asset Category</label>
            <select style={inputStyle} required>
              <option value="">Select Category...</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="appliance">Appliance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Asset Value (₹)</label>
            <input type="number" placeholder="e.g. 45000" style={inputStyle} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Assigned Building</label>
            <select style={inputStyle} required>
              <option value="">Select Building...</option>
              <option value="b1">Sunshine Residency</option>
              <option value="b2">Moonlight Annex</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>Save Asset</button>
            <button className="btn" type="button" onClick={() => setIsAssetOpen(false)} style={{ flex: 1, border: '1px solid var(--border-color)' }}>Cancel</button>
          </div>
        </form>
      </Modal>



    </div>
  );
}

export default Dashboard;
