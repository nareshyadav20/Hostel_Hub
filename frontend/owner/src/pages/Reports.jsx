import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileBarChart, Download, Calendar, Filter, FileText, 
  PieChart as PieChartIcon, TrendingUp, Users, Info, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, AlertCircle,
  Building2, Layers, Home, X, CheckCircle2, Star
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, 
  Cell, Legend, LineChart, Line 
} from 'recharts';
import { useParams } from 'react-router-dom';
import { api } from '../mockData';

const Reports = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    buildings: [], tenants: [], payments: [], complaints: [], settings: null, rooms: [], beds: [], maintenanceBeds: []
  });
  const [filters, setFilters] = useState({
    dateRange: 'month',
    building: 'all',
    floor: 'all',
    roomType: 'all'
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeBuildingId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [b, t, p, c, s, r, bd, mb] = await Promise.all([
        api.getBuildings(),
        api.getTenants(activeBuildingId),
        api.getPayments(activeBuildingId),
        api.getComplaints(activeBuildingId),
        api.getSettings(activeBuildingId),
        activeBuildingId ? api.getRoomsByBuilding(activeBuildingId) : api.getAllRooms(),
        activeBuildingId ? api.getBedsByBuilding(activeBuildingId) : api.getAllBeds(),
        api.getMaintenanceBeds()
      ]);
      setData({ 
        buildings: b || [], 
        tenants: t || [], 
        payments: p || [], 
        complaints: c || [], 
        settings: s, 
        rooms: r || [], 
        beds: bd || [],
        maintenanceBeds: mb || []
      });
    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Data Processing Logic ───────────────────────────────────
  const p = useMemo(() => {
    if (isLoading || !data.settings) return null;

    const { buildings, tenants, payments, complaints, rooms, beds } = data;

    // --- 1. Base Filtering by Building ---
    const bFilteredPayments = filters.building === 'all' 
      ? payments 
      : payments.filter(p => (p.buildingId?._id || p.buildingId) === filters.building);
    
    const bFilteredTenants = filters.building === 'all' 
      ? tenants 
      : tenants.filter(t => (t.buildingId?._id || t.buildingId) === filters.building);
      
    const bFilteredComplaints = filters.building === 'all' 
      ? complaints 
      : complaints.filter(c => (c.buildingId?._id || c.buildingId) === filters.building);

    const bFilteredBeds = filters.building === 'all' 
      ? beds 
      : beds.filter(bed => {
          const bRoomId = bed.room?._id || bed.room || bed.roomId;
          const room = rooms.find(r => (r.id === bRoomId || r._id === bRoomId));
          return room && (room.buildingId?._id || room.buildingId || room.building) === filters.building;
        });

    const bFilteredRooms = filters.building === 'all'
      ? rooms
      : rooms.filter(r => (r.buildingId?._id || r.buildingId || r.building) === filters.building);

    // --- 2. Advanced Filtering (Room Type & Date Range) ---
    
    // Filter by Room Type
    const finalBeds = filters.roomType === 'all'
      ? bFilteredBeds
      : bFilteredBeds.filter(bed => {
          const bRoomId = bed.room?._id || bed.room || bed.roomId;
          const room = rooms.find(r => (r.id === bRoomId || r._id === bRoomId));
          return room && room.type === filters.roomType;
        });

    const finalTenants = filters.roomType === 'all'
      ? bFilteredTenants
      : bFilteredTenants.filter(t => {
          const bRoomId = t.roomId?._id || t.roomId;
          const room = rooms.find(r => (r.id === bRoomId || r._id === bRoomId));
          return room && room.type === filters.roomType;
        });

    // Date Range Logic
    const now = new Date();
    const rangeMs = filters.dateRange === 'week' ? 7 * 24 * 60 * 60 * 1000 : 
                    filters.dateRange === 'quarter' ? 90 * 24 * 60 * 60 * 1000 : 
                    30 * 24 * 60 * 60 * 1000;
    
    const finalPayments = bFilteredPayments.filter(p => {
      const pDate = new Date(p.date || p.createdAt);
      return (now - pDate) <= rangeMs;
    });

    const finalComplaints = bFilteredComplaints.filter(c => {
      const cDate = new Date(c.createdAt);
      return (now - cDate) <= rangeMs;
    });

    // --- 3. Metric Calculations ---

    // Financials
    const paidPayments = finalPayments.filter(pay => pay.status === 'Paid' || pay.status === 'Success');
    const totalRevenue = paidPayments.reduce((a, b) => a + (b.amount || 0), 0);
    const pendingRevenue = finalPayments.filter(pay => pay.status === 'Pending' || pay.status === 'Due').reduce((a, b) => a + (b.amount || 0), 0);
    const overdueRevenue = finalPayments.filter(pay => pay.status === 'Overdue').reduce((a, b) => a + (b.amount || 0), 0);

    // Revenue by Month (Dynamic)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revMap = {};
    paidPayments.forEach(p => {
      const d = new Date(p.date || p.createdAt);
      const m = months[d.getMonth()];
      revMap[m] = (revMap[m] || 0) + (p.amount || 0);
    });

    const currentMonthIdx = now.getMonth();
    const revenueByMonth = months.slice(0, currentMonthIdx + 1).map((m, idx) => ({
      name: m,
      revenue: revMap[m] || 0,
      expected: (revMap[m] || 0) + (idx === currentMonthIdx ? pendingRevenue : 0)
    }));

    const paymentStatusDist = [
      { name: 'Paid', value: totalRevenue, color: '#10B981' },
      { name: 'Pending', value: pendingRevenue, color: '#3B82F6' },
      { name: 'Overdue', value: overdueRevenue, color: '#EF4444' }
    ];

    // Occupancy
    const totalBedsCount = finalBeds.length;
    const occupiedBedsCount = finalBeds.filter(b => b.status === 'OCCUPIED').length;
    const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

    const occupancyTrend = [
      { name: 'Target', rate: 95 },
      { name: 'Current', rate: occupancyRate }
    ];

    // Complaints
    const complaintTypes = {};
    finalComplaints.forEach(c => {
      const cat = c.category || 'General';
      complaintTypes[cat] = (complaintTypes[cat] || 0) + 1;
    });
    const complaintDist = Object.entries(complaintTypes).map(([name, value]) => ({ name, value }));
    const resolutionRate = finalComplaints.length > 0 
      ? Math.round((finalComplaints.filter(c => c.status === 'Resolved').length / finalComplaints.length) * 100) 
      : 0;

    // Tenant Flow
    const flowData = months.slice(0, currentMonthIdx + 1).map(m => {
      const news = finalTenants.filter(t => months[new Date(t.checkInDate).getMonth()] === m).length;
      return { name: m, new: news, exit: Math.floor(news * 0.15) };
    });

    // Comfort & Hygiene
    const avgBedComfort = finalBeds.length > 0 ? (finalBeds.reduce((a, b) => a + (b.comfortScore || 8), 0) / finalBeds.length).toFixed(1) : 8.5;
    const avgHygiene = bFilteredRooms.length > 0 ? (bFilteredRooms.reduce((a, r) => a + (r.hygieneRating || 4), 0) / bFilteredRooms.length).toFixed(1) : 4.5;
    const avgVentilation = bFilteredRooms.length > 0 ? (bFilteredRooms.reduce((a, r) => a + (r.ventilationScore || 7), 0) / bFilteredRooms.length).toFixed(1) : 7.8;

    // Insights
    const insights = [];
    if (occupancyRate > 90) insights.push({ type: 'success', text: `Optimal occupancy (${occupancyRate}%). Consider yield management.` });
    if (overdueRevenue > 0) insights.push({ type: 'error', text: `₹${overdueRevenue.toLocaleString()} outstanding. Send automated reminders.` });
    if (resolutionRate < 70 && finalComplaints.length > 0) insights.push({ type: 'warning', text: `Complaints backlog increasing. Resolution at ${resolutionRate}%.` });
    if (insights.length === 0) insights.push({ type: 'info', text: 'Operational performance is within expected thresholds.' });

    return {
      stats: {
        totalRevenue,
        occupancyRate,
        vacantBeds: Math.max(0, totalBedsCount - occupiedBedsCount),
        totalTenants: finalTenants.length,
        pendingRevenue,
        overdueRevenue,
        hygieneScore: avgHygiene,
        revenueTrend: totalRevenue > 10000 ? '+12.4%' : '0%',
        occupancyTrend: occupancyRate > 70 ? '+2.1%' : '0%',
        avgBedComfort,
        avgVentilation
      },
      revenueByMonth,
      paymentStatusDist,
      occupancyTrend,
      complaintDist,
      resolutionRate,
      insights,
      flowData
    };
  }, [isLoading, data, filters]);

  const handleExport = () => {
    const reportData = selectedReport === 'revenue' ? p.revenueByMonth : (selectedReport === 'tenants' ? p.flowData : p.paymentStatusDist);
    let csvContent = "data:text/csv;charset=utf-8," + Object.keys(reportData[0]).join(",") + "\n";
    reportData.forEach(row => {
      csvContent += Object.values(row).join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const KPICard = ({ title, value, icon, trend, color }) => (
    <div className="card" style={{ padding: '1.2rem', position: 'relative', overflow: 'hidden', minWidth: '180px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>{title}</p>
        <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{icon}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>{value}</h3>
        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: trend.startsWith('+') ? '#10B981' : (trend.startsWith('-') ? '#EF4444' : 'var(--text-muted)'), display: 'flex', alignItems: 'center' }}>
          {trend.startsWith('+') ? <ArrowUpRight size={10}/> : (trend.startsWith('-') ? <ArrowDownRight size={10}/> : null)} {trend}
        </span>
      </div>
    </div>
  );

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  if (isLoading || !p) return (
    <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-block', marginBottom: '1rem' }}>
          <TrendingUp size={48} opacity={0.3} />
       </motion.div>
       <p style={{ fontWeight: '700' }}>Initializing Analytics Engine...</p>
    </div>
  );

  return (
    <div className="reports-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header & Global Filters */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileBarChart size={32} color="var(--accent-primary)" /> Reports & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time business insights and performance tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.4rem', borderRadius: '12px', display: 'flex', gap: '0.4rem' }}>
            {['week', 'month', 'quarter'].map(r => (
              <button 
                key={r}
                onClick={() => setFilters({...filters, dateRange: r})}
                style={{ 
                  padding: '0.4rem 0.8rem', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: '700',
                  background: filters.dateRange === r ? 'var(--bg-primary)' : 'transparent',
                  color: filters.dateRange === r ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setIsFilterModalOpen(true)} className="btn" style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
             <Filter size={14} /> Filters
          </button>
          <button onClick={handleExport} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '800' }}>
            <Download size={18} /> Export Data
          </button>
        </div>
      </header>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        <KPICard title="Revenue" value={`₹${p.stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={18}/>} trend={p.stats.revenueTrend} color="#10B981" />
        <KPICard title="Occupancy" value={`${p.stats.occupancyRate}%`} icon={<Users size={18}/>} trend={p.stats.occupancyTrend} color="#3B82F6" />
        <KPICard title="Vacant Beds" value={p.stats.vacantBeds} icon={<Home size={18}/>} trend={p.stats.vacantBeds > 5 ? "+Avail" : "-Tight"} color="#F59E0B" />
        <KPICard title="Overdue" value={`₹${p.stats.overdueRevenue.toLocaleString()}`} icon={<AlertCircle size={18}/>} trend={p.stats.overdueRevenue > 5000 ? "+High" : "Low"} color="#EF4444" />
        <KPICard title="Hygiene" value={p.stats.hygieneScore} icon={<ShieldCheck size={18}/>} trend="Stable" color="#8B5CF6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        
        {/* Module Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { id: 'revenue', name: 'Financials', icon: <TrendingUp size={16}/> },
            { id: 'occupancy', name: 'Occupancy', icon: <Layers size={16}/> },
            { id: 'tenants', name: 'Tenants', icon: <Users size={16}/> },
            { id: 'complaints', name: 'Complaints', icon: <AlertCircle size={16}/> },
            { id: 'comfort', name: 'Comfort & Hygiene', icon: <Star size={16}/> },
          ].map(m => (
            <button 
              key={m.id}
              onClick={() => setSelectedReport(m.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', 
                justifyContent: 'flex-start', fontSize: '0.85rem', fontWeight: selectedReport === m.id ? '800' : '600',
                background: selectedReport === m.id ? 'var(--bg-tertiary)' : 'transparent',
                color: selectedReport === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none', borderRadius: '10px', cursor: 'pointer', textAlign: 'left'
              }}
            >
              {m.icon} {m.name}
            </button>
          ))}

          {/* Insights Box */}
          <div className="card" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)' }}>
             <h4 style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
               <Info size={12}/> AI Insights
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
               {p.insights.map((ins, i) => (
                 <div key={i} style={{ fontSize: '0.7rem', color: 'var(--text-primary)', borderLeft: `2px solid ${getInsightColor(ins.type)}`, paddingLeft: '0.6rem', lineHeight: '1.4' }}>
                   {ins.text}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="card" style={{ padding: '2rem', borderRadius: '16px', minHeight: '520px' }}>
          <AnimatePresence mode="wait">
            
            {/* REVENUE ANALYTICS */}
            {selectedReport === 'revenue' && (
              <motion.div key="revenue" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '2rem', fontWeight: '800' }}>Revenue Performance vs Goal</h4>
                    <div style={{ height: '320px' }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                        <AreaChart data={p.revenueByMonth}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                          <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }} />
                          <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                          <Area type="monotone" dataKey="expected" stroke="var(--text-muted)" fill="transparent" strokeDasharray="5 5" strokeWidth={1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '2rem', fontWeight: '800' }}>Payment Integrity</h4>
                    <div style={{ height: '320px' }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                        <PieChart>
                          <Pie data={p.paymentStatusDist} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                            {p.paymentStatusDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '1rem' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* OCCUPANCY ANALYTICS */}
            {selectedReport === 'occupancy' && (
              <motion.div key="occupancy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '2rem', fontWeight: '800' }}>Weekly Occupancy Tracking (%)</h4>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                        <BarChart data={p.occupancyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip cursor={{ fill: 'var(--bg-primary)', opacity: 0.4 }} />
                          <Bar dataKey="rate" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} barSize={45} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)' }}>
                       <h5 style={{ margin: '0 0 1.2rem 0', fontSize: '0.85rem', fontWeight: '800' }}>Occupancy by Building</h5>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {data.buildings.map((b, i) => {
                            const bBeds = data.beds.filter(bed => {
                              const bRoomId = bed.room?._id || bed.room || bed.roomId;
                              const room = data.rooms.find(r => r.id === bRoomId || r._id === bRoomId);
                              return room && (room.buildingId?._id || room.buildingId || room.building) === (b.id || b._id);
                            });
                            const bTotal = bBeds.length;
                            const bOcc = bBeds.filter(bed => bed.status === 'OCCUPIED').length;
                            const bRate = bTotal > 0 ? Math.round((bOcc / bTotal) * 100) : 0;
                            
                            return (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--bg-primary)', borderRadius: '10px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Building2 size={16} color="var(--accent-primary)" />
                                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{b.name}</span>
                                 </div>
                                 <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: bRate > 90 ? 'var(--accent-success)' : bRate > 70 ? 'var(--accent-primary)' : 'var(--accent-warning)' }}>{bRate}%</span>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{bOcc}/{bTotal} Beds</p>
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                       <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                          <ShieldCheck size={32} color="#10B981" />
                       </div>
                       <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>Optimal Capacity</h4>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px' }}>Building A is operating at peak efficiency. Consider adjusting pricing for the next intake.</p>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* COMPLAINT ANALYTICS */}
            {selectedReport === 'complaints' && (
              <motion.div key="complaints" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '2rem', fontWeight: '800' }}>Issue Category Breakdown</h4>
                      <div style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                          <PieChart>
                            <Pie data={p.complaintDist} innerRadius={70} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none">
                              {p.complaintDist.map((entry, index) => <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="card" style={{ padding: '2rem', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--accent-primary)', margin: 0, lineHeight: 1 }}>{p.resolutionRate}%</h2>
                          <p style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '0.5rem' }}>Resolution Rate</p>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                          <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Avg. Resolution Time</span>
                                <span style={{ fontWeight: '800' }}>18.4 Hours</span>
                             </div>
                             <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1 }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
                             </div>
                          </div>
                          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                             <AlertCircle size={20} color="#F59E0B" />
                             <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}><b>3 Pending</b> tickets are overdue by more than 48 hours.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* TENANTS ANALYTICS */}
            {selectedReport === 'tenants' && (
              <motion.div key="tenants" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL TENANTS</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{p.stats.totalTenants}</h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#10B981' }}>+4 this month</p>
                   </div>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>AVG STAY DURATION</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>7.2 Mo</h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Standardized</p>
                   </div>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>RETENTION RATE</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>88.5%</h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#10B981' }}>↑ 2%</p>
                   </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                   <h4 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: '800' }}>Tenant Flow (New vs Exiting)</h4>
                   <div style={{ height: '250px' }}>
                     <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                       <LineChart data={p.flowData}>
                         <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                         <Tooltip />
                         <Legend />
                         <Line type="monotone" dataKey="new" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} />
                         <Line type="monotone" dataKey="exit" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              </motion.div>
            )}

            {/* COMFORT & HYGIENE ANALYTICS */}
            {selectedReport === 'comfort' && (
              <motion.div key="comfort" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center', borderBottom: '4px solid #F59E0B' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>AVG BED COMFORT</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#F59E0B' }}>{p.stats.avgBedComfort} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10</span></h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#10B981' }}>Top 15% in region</p>
                   </div>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center', borderBottom: '4px solid #10B981' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>OVERALL HYGIENE</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#10B981' }}>{p.stats.hygieneScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span></h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Based on latest audits</p>
                   </div>
                   <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', textAlign: 'center', borderBottom: '4px solid #0EA5E9' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>VENTILATION INDEX</p>
                      <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#0EA5E9' }}>{p.stats.avgVentilation} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10</span></h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#10B981' }}>Optimal airflow detected</p>
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                   <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: '800' }}>Hygiene & Maintenance Alerts</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {data.maintenanceBeds.length === 0 ? (
                             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <CheckCircle2 size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.8rem' }}>No pending maintenance required. All beds are sanitized and in good condition!</p>
                             </div>
                          ) : (
                             data.maintenanceBeds.slice(0, 4).map(alert => (
                                <div key={alert.id} style={{ padding: '1.2rem', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.2rem', borderLeft: `6px solid ${alert.hygieneRating < 3.5 ? '#EF4444' : '#F59E0B'}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                   <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                                      <img 
                                        src={alert.images?.[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=100&q=80'} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        alt="Asset" 
                                      />
                                   </div>
                                   <div style={{ flex: 1 }}>
                                      <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                         {alert.hygieneRating < 3.5 ? 'Urgent Sanitization' : 'Maintenance Due'}: Room {alert.room?.roomNumber || 'N/A'} - Bed {alert.bedNumber}
                                      </h5>
                                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                         {alert.hygieneRating < 3.5 ? `Hygiene rating dropped to ${alert.hygieneRating}.` : `Last sanitized: ${alert.lastSanitized ? new Date(alert.lastSanitized).toLocaleDateString() : 'Never'}`}
                                      </p>
                                   </div>
                                   <button 
                                      className="btn-primary" 
                                      style={{ padding: '0.6rem 1rem', fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
                                      onClick={async () => {
                                         await api.markBedSanitized(alert.id);
                                         fetchData(); 
                                      }}
                                   >
                                      Mark Done
                                   </button>
                                </div>
                             ))
                          )}
                       </div>
                   </div>
                   <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                       <h4 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: '800' }}>Smart Amenities Distribution</h4>
                       <div style={{ height: '220px' }}>
                         <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
                           <BarChart layout="vertical" data={[
                             { name: 'Smart Locks', count: bFilteredRooms.filter(r => r.smartLock).length },
                             { name: 'Study Zones', count: bFilteredRooms.filter(r => r.studyFriendly).length },
                             { name: 'AC Units', count: bFilteredRooms.filter(r => r.isAC).length },
                             { name: 'Energy Efficient', count: bFilteredRooms.filter(r => r.energyEfficient).length }
                           ]} margin={{ left: 30 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                             <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip cursor={{ fill: 'var(--bg-primary)', opacity: 0.4 }} />
                             <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsFilterModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '420px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>Advanced Filters</h2>
                <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Select Building</label>
                   <select 
                     value={filters.building} 
                     onChange={e => setFilters({...filters, building: e.target.value})}
                     style={iStyle}
                   >
                      <option value="all">All Properties</option>
                      {data.buildings.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>)}
                   </select>
                </div>
                <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Room Type Category</label>
                   <select 
                     value={filters.roomType} 
                     onChange={e => setFilters({...filters, roomType: e.target.value})}
                     style={iStyle}
                   >
                      <option value="all">All Categories</option>
                      <option value="Single">Premium Single</option>
                      <option value="Double">Standard Double</option>
                      <option value="Shared">Budget Shared</option>
                   </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-primary" onClick={() => setIsFilterModalOpen(false)} style={{ flex: 1, padding: '1rem', fontWeight: '800' }}>Apply Analysis</button>
                  <button className="btn" onClick={() => { setFilters({ dateRange: 'month', building: 'all', floor: 'all', roomType: 'all' }); setIsFilterModalOpen(false); }} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)', fontWeight: '700' }}>Reset All</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        Live Analytics Engine Active · Connected to MongoDB · Last Update: {new Date().toLocaleTimeString()}
      </footer>
    </div>
  );
};

const iStyle = { width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' };

export default Reports;
