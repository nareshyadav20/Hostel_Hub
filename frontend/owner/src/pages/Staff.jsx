import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, User, Mail, Phone, Calendar, MapPin, Clock, 
  CheckCircle, AlertCircle, TrendingUp, DollarSign, 
  FileText, Activity, Star, ChevronRight, X, 
  Download, Upload, ClipboardList, PieChart as PieChartIcon,
  Shield, CreditCard, ListTodo
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import { api } from '../mockData';

const ROLE_COLORS = {
  'Warden':  { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  'Cook':    { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
  'Security':{ bg: '#FDF4FF', color: '#9333EA', border: '#E9D5FF' },
  'Cleaner': { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
};

const Staff = () => {
  const [staffData, setStaffData] = useState({ staffList: [], totalStaff: 0 });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function fetchStaff() {
    try {
      const data = await api.getDashboardStaff();
      setStaffData(data || { staffList: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newDoc = {
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
        url: '#'
      };

      // Update selected staff locally
      const updatedStaff = {
        ...selectedStaff,
        documents: [...(selectedStaff.documents || []), newDoc]
      };
      setSelectedStaff(updatedStaff);

      // Update the main staff list as well
      setStaffData(prev => ({
        ...prev,
        staffList: (prev.staffList || []).map(s => s.id === selectedStaff.id ? updatedStaff : s)
      }));

      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const getStatusStyle = (status) => {
    if (!status) return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', label: 'UNKNOWN' };
    switch (status) {
      case 'Active': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', label: 'ACTIVE' };
      case 'On Leave': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'ON LEAVE' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', label: status.toUpperCase() };
    }
  };

  const renderTabContent = () => {
    if (!selectedStaff) return null;

    switch (activeTab) {
      case 'Overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', animation: 'fadeIn 0.3s ease-out' }}>
            {/* Top Insight Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)', color: 'white', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', opacity: 0.9 }}>Performance Score</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: '900' }}>{selectedStaff.metrics?.efficiencyScore || 85}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', opacity: 0.8 }}>/100</span>
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', fontWeight: '600', background: 'rgba(255,255,255,0.2)', padding: '0.6rem 1.2rem', borderRadius: '100px', display: 'inline-block' }}>
                  Top 10% of Workforce
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <MetricCard label="Active Tasks" value={selectedStaff.tasks?.filter(t=>t.status!=='COMPLETED').length || 0} sub="Requires attention" color="#F59E0B" />
                <MetricCard label="Monthly Pay" value={`₹${selectedStaff.salary || 0}`} sub="Next: May 5th" color="#10B981" />
                <MetricCard label="Attendance" value={`${selectedStaff.attendance?.percentage || 0}%`} sub="Last 30 days" color="var(--accent-primary)" />
                <MetricCard label="Joining" value="12 Jan 24" sub="4 months ago" color="#8B5CF6" />
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Employment Details</h4>
              <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2.5rem', background: 'var(--bg-tertiary)', borderRadius: '24px' }}>
                <InfoRow icon={<Mail size={20} />} label="Email Address" value={selectedStaff.email || 'N/A'} />
                <InfoRow icon={<Phone size={20} />} label="Phone Number" value={selectedStaff.phone || 'N/A'} />
                <InfoRow icon={<Shield size={20} />} label="Access Level" value="Administrative" />
                <InfoRow icon={<Calendar size={20} />} label="Work Schedule" value="Full Time" />
              </div>
            </div>
          </div>
        );
      case 'Attendance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em', margin: 0 }}>Attendance Analytics</h4>
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: '12px' }}>+ Mark Attendance</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <MetricCard label="Monthly Attendance" value={`${selectedStaff.attendance?.percentage || 0}%`} sub="Overall consistency" color="var(--accent-primary)" />
                <MetricCard label="Present Days" value="24" sub="Current billing cycle" color="#10B981" />
                <MetricCard label="Late Marks" value="1" sub="Arrival exceptions" color="#F59E0B" />
              </div>
              
              <div className="card" style={{ padding: '2rem', height: '400px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Weekly Engagement Trend</h4>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={Array.isArray(selectedStaff.attendance?.monthly) ? selectedStaff.attendance.monthly : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }} 
                    />
                    <Bar dataKey="present" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'Tasks':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: '700' }}>Assigned Tasks ({selectedStaff.tasks?.length || 0})</h4>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>+ New Task</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(Array.isArray(selectedStaff.tasks) ? selectedStaff.tasks : []).map((task, idx) => (
                <div key={task.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {task.status === 'COMPLETED' ? <CheckCircle size={16} color="#10B981" /> : <Clock size={16} color="#F59E0B" />}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{task.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned on {task.date}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--bg-primary)', color: task.status === 'COMPLETED' ? '#10B981' : '#F59E0B', border: '1px solid var(--border-color)' }}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Performance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em', margin: 0 }}>Performance Analysis</h4>
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', borderRadius: '12px' }}>Generate Review</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <MetricCard label="Task Completion" value={`${selectedStaff.metrics?.completionRate || 0}%`} sub="Overall success rate" color="var(--accent-primary)" />
                <MetricCard label="Avg Resolution" value={selectedStaff.metrics?.avgResolutionTime || '-'} sub="Time per assignment" color="#10B981" />
                <MetricCard label="User Rating" value={selectedStaff.metrics?.satisfaction || 0} sub="Out of 5.0 stars" color="#8b5cf6" />
                <MetricCard label="Reliability" value="High" sub="System calculated" color="#F59E0B" />
              </div>

              <div className="card" style={{ padding: '2rem', height: '400px', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Performance History</h4>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={Array.isArray(selectedStaff.metrics?.history) ? selectedStaff.metrics.history : []}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }} />
                    <Area type="monotone" dataKey="rate" stroke="var(--accent-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'Salary':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Current Month Salary</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>₹{selectedStaff.salary}</h2>
                  <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700', paddingBottom: '0.4rem' }}>• DUE ON 1ST APR</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ height: '100%', fontSize: '1.1rem' }}>Process Payroll</button>
              </div>
            </div>
            <h4 style={{ fontWeight: '700', marginTop: '1rem' }}>Payment History</h4>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MONTH</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>AMOUNT</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(selectedStaff.salaryHistory) ? selectedStaff.salaryHistory : []).map((h, idx) => (
                    <tr key={h.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '700' }}>{h.month}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>₹{h.amount}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{h.status}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Documents':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            {(Array.isArray(selectedStaff.documents) ? selectedStaff.documents : []).map((doc, i) => (
              <div key={i} className="card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{doc.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.type} • Uploaded {doc.date}</p>
                  </div>
                </div>
                <button className="btn" style={{ padding: '0.5rem', background: 'var(--bg-primary)' }}>
                  <Download size={16} />
                </button>
              </div>
            ))}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
            <div 
              className="card" 
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{ 
                padding: '1.2rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: uploading ? 'var(--bg-tertiary)' : 'transparent', 
                border: '2px dashed var(--border-color)', 
                cursor: uploading ? 'wait' : 'pointer',
                opacity: uploading ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: uploading ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {uploading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Activity size={18} />
                  </motion.div>
                ) : <Upload size={18} />}
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                  {uploading ? 'Processing File...' : 'Upload New Document'}
                </span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading staff records...</div>;

  const allStaff = staffData.staffList || [];
  const activeStaff = allStaff.filter(s => s.status === 'Active');
  const onLeave = allStaff.filter(s => s.status === 'On Leave');
  const lowPerf = allStaff.filter(s => parseFloat(s.performance) < 4.0);
  const roles = ['All', ...Array.from(new Set(allStaff.map(s => s.role)))];
  const filteredStaff = allStaff.filter(s => filterRole === 'All' || s.role === filterRole);
  const absentToday = allStaff.filter(s => s.status === 'On Leave');

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh', background: '#F8FAFC', padding: '0.5rem', position: 'relative' }}>
      {/* HEADER */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.2rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={32} color="#3B82F6" /> Staff Operations
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: '500', margin: 0 }}>Workforce tracking, performance analytics, and payroll management.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#475569', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={18}/> Export</button>
          <button className="btn btn-primary" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3B82F6', border: 'none' }}><UserPlus size={18}/> Add Staff</button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Staff', value: allStaff.length || staffData.totalStaff || 8, icon: <User size={18}/>, color: '#3B82F6', border: '#BFDBFE', bg: '#EFF6FF' },
          { label: 'Active Today', value: activeStaff.length || (allStaff.length - onLeave.length), icon: <CheckCircle size={18}/>, color: '#10B981', border: '#A7F3D0', bg: '#ECFDF5' },
          { label: 'On Leave', value: onLeave.length, icon: <Calendar size={18}/>, color: '#F59E0B', border: '#FDE68A', bg: '#FFFBEB' },
          { label: 'Low Performance', value: lowPerf.length, icon: <AlertCircle size={18}/>, color: '#EF4444', border: '#FECACA', bg: '#FEF2F2' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: `1px solid ${kpi.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderBottom: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
              <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>{kpi.label}</p>
              <div style={{ background: kpi.bg, color: kpi.color, padding: '0.5rem', borderRadius: '8px' }}>{kpi.icon}</div>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', margin: 0, lineHeight: 1 }}>{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* ALERT BANNER */}
      {absentToday.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={20} color="#D97706"/>
          <p style={{ color: '#92400E', fontWeight: '700', margin: 0, fontSize: '0.95rem' }}>
            {absentToday.map(s => s.name).join(', ')} {absentToday.length === 1 ? 'is' : 'are'} on leave today — consider reassigning their tasks.
          </p>
        </div>
      )}
      {lowPerf.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={20} color="#DC2626"/>
          <p style={{ color: '#991B1B', fontWeight: '700', margin: 0, fontSize: '0.95rem' }}>
            {lowPerf.map(s => s.name).join(', ')} {lowPerf.length === 1 ? 'has' : 'have'} a performance rating below 4.0 — review needed.
          </p>
        </div>
      )}

      {/* ROLE FILTER TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {roles.map(role => (
          <button key={role} onClick={() => setFilterRole(role)} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', border: filterRole === role ? 'none' : '1px solid #E2E8F0', background: filterRole === role ? '#3B82F6' : '#FFFFFF', color: filterRole === role ? '#FFF' : '#475569', transition: 'all 0.15s' }}>
            {role === 'All' ? `All (${allStaff.length})` : `${role}s`}
          </button>
        ))}
      </div>

      {/* STAFF GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredStaff.map((s, idx) => {
          const status = getStatusStyle(s.status);
          const roleStyle = ROLE_COLORS[s.role] || ROLE_COLORS['Cleaner'];
          const initials = s.name ? s.name.split(' ').map(n => n[0]).join('') : '??';
          const tasksDue = (s.tasks || []).filter(t => t.status !== 'COMPLETED').length;
          return (
            <motion.div
              key={s.id || idx}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              onClick={() => { setSelectedStaff(s); setActiveTab('Overview'); }}
              style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* Card Top */}
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: roleStyle.bg, border: `2px solid ${roleStyle.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleStyle.color, fontWeight: '900', fontSize: '1.2rem' }}>
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.2rem 0' }}>{s.name}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.6rem', borderRadius: '6px', background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>{s.role}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: '900', padding: '0.3rem 0.8rem', borderRadius: '100px', background: status.bg, color: status.color }}>{status.label}</span>
              </div>

              {/* Stats Row */}
              <div style={{ padding: '0 1.5rem 1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 0.2rem' }}>Attendance</p>
                  <p style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>{s.attendance?.percentage || 0}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 0.2rem' }}>Rating</p>
                  <p style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Star size={12} fill="#F59E0B" color="#F59E0B"/> {s.performance || '0.0'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 0.2rem' }}>Tasks Due</p>
                  <p style={{ fontSize: '1rem', fontWeight: '800', color: tasksDue > 0 ? '#EF4444' : '#10B981', margin: 0 }}>{tasksDue}</p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '0.9rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13}/> {s.building || 'Unassigned'}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={13}/> {s.shift || 'Full Time'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Staff Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
              onClick={() => setSelectedStaff(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-40%' }} 
              animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }} 
              exit={{ scale: 0.9, opacity: 0, x: '-50%', y: '-60%' }}
              style={{ 
                position: 'fixed', top: '50%', left: '50%', 
                width: '95%', maxWidth: '1100px', height: '85vh', 
                background: 'var(--bg-secondary)', borderRadius: '32px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', zIndex: 1001,
                overflow: 'hidden', border: '1px solid var(--border-color)',
                display: 'flex'
              }}
            >
              <div style={{ 
                width: '300px', 
                borderRight: '1px solid var(--border-color)', 
                background: 'var(--bg-tertiary)', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '2.5rem 1.5rem'
              }}>
                <button 
                  onClick={() => setSelectedStaff(null)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    zIndex: 10,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#ef444420'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef444450'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <X size={20} />
                </button>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '32px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '2.5rem', margin: '0 auto 1.2rem' }}>
                    {selectedStaff.name ? selectedStaff.name.split(' ').map(n=>n[0]).join('') : '??'}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 0.4rem 0' }}>{selectedStaff.name}</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', padding: '0.2rem 0.8rem', borderRadius: '100px', background: getStatusStyle(selectedStaff.status).bg, color: getStatusStyle(selectedStaff.status).color, textTransform: 'uppercase' }}>
                      {selectedStaff.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{selectedStaff.role}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {selectedStaff.id}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  {[
                    { id: 'Overview', icon: <User size={18} /> },
                    { id: 'Attendance', icon: <Calendar size={18} /> },
                    { id: 'Tasks', icon: <ListTodo size={18} /> },
                    { id: 'Performance', icon: <TrendingUp size={18} /> },
                    { id: 'Salary', icon: <CreditCard size={18} /> },
                    { id: 'Documents', icon: <FileText size={18} /> }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        padding: '1rem 1.2rem',
                        borderRadius: '16px',
                        border: 'none',
                        background: activeTab === item.id ? 'var(--accent-primary)' : 'transparent',
                        color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: activeTab === item.id ? '0 10px 20px -5px rgba(99, 102, 241, 0.4)' : 'none'
                      }}
                    >
                      {item.icon}
                      {item.id}
                    </button>
                  ))}
                </nav>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedStaff(null)}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  Close Profile
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', padding: '2.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>

                <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Activity size={18} /> Recent Activity History
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(Array.isArray(selectedStaff.activityLog) ? selectedStaff.activityLog : []).length > 0 ? (
                      (Array.isArray(selectedStaff.activityLog) ? selectedStaff.activityLog : []).map((log, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.85rem' }}>{log.action}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{log.time}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>No recent activity records found.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>{icon}</div>
    <div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{value}</p>
    </div>
  </div>
);

const MetricCard = ({ label, value, sub, color }) => (
  <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', borderLeft: `4px solid ${color}` }}>
    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sub}</p>
  </div>
);

export default Staff;
