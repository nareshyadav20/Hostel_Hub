import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileBarChart, Download, Calendar, Filter, FileText, 
  PieChart as PieChartIcon, TrendingUp, Users, Info, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, AlertCircle,
  Building2, Layers, Home, X, CheckCircle2, Star, Sparkles, Activity
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
      flowData,
      bFilteredRooms
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
    document.body.removeChild(link);
  };

  const KPICard = ({ title, value, icon, trend, color }) => (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="card" 
      style={{ 
        padding: '1.5rem', 
        position: 'relative', 
        overflow: 'hidden', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: `${color}15`, borderRadius: '50%', filter: 'blur(30px)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div style={{ padding: '0.8rem', borderRadius: '14px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '100px', background: trend.startsWith('+') ? '#DCFCE7' : (trend.startsWith('-') ? '#FEE2E2' : '#F1F5F9'), color: trend.startsWith('+') ? '#10B981' : (trend.startsWith('-') ? '#EF4444' : '#64748B'), fontSize: '0.75rem', fontWeight: '800' }}>
          {trend.startsWith('+') ? <ArrowUpRight size={14}/> : (trend.startsWith('-') ? <ArrowDownRight size={14}/> : null)}
          {trend}
        </div>
      </div>
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', letterSpacing: '0.01em' }}>{title}</p>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</h3>
      </div>
    </motion.div>
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
    <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
       <motion.div 
         animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
         style={{ display: 'inline-block', marginBottom: '2rem' }}
       >
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 15px 35px rgba(99, 102, 241, 0.3)' }}>
            <TrendingUp size={40} />
          </div>
       </motion.div>
       <h2 style={{ fontWeight: '900', color: 'var(--text-primary)' }}>Generating Intelligence...</h2>
       <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto' }}>Aggregating real-time data streams and building predictive models for your hostel portfolio.</p>
    </div>
  );

  return (
    <div className="reports-page" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Premium Glassmorphic Header */}
      <header style={{ 
        marginBottom: '3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '2rem',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: 0.03, borderRadius: '50%', filter: 'blur(80px)' }} />
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
              <FileBarChart size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '950', margin: 0, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Intelligence Hub
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600', margin: 0, opacity: 0.7 }}>Precision analytics for your hostel ecosystem.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 1 }}>
          <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '18px', display: 'flex', gap: '0.3rem' }}>
            {['week', 'month', 'quarter'].map(r => (
              <button 
                key={r}
                onClick={() => setFilters({...filters, dateRange: r})}
                style={{ 
                  padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', fontSize: '0.85rem', fontWeight: '800',
                  background: filters.dateRange === r ? '#ffffff' : 'transparent',
                  color: filters.dateRange === r ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: filters.dateRange === r ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)} 
            className="btn" 
            style={{ 
              background: 'white', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px',
              padding: '0.8rem 1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem', 
              fontSize: '0.9rem', fontWeight: '800',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
             <Filter size={18} /> Advanced Filters
          </button>
          <button 
            onClick={handleExport} 
            className="btn btn-primary" 
            style={{ 
              borderRadius: '16px',
              padding: '0.8rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.8rem', 
              fontWeight: '900', fontSize: '0.9rem'
            }}
          >
            <Download size={20} /> Export Report
          </button>
        </div>
      </header>

      {/* Modern KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <KPICard title="Projected Revenue" value={`₹${p.stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={24}/>} trend={p.stats.revenueTrend} color="#6366f1" />
        <KPICard title="Net Occupancy" value={`${p.stats.occupancyRate}%`} icon={<Users size={24}/>} trend={p.stats.occupancyTrend} color="#10b981" />
        <KPICard title="Available Inventory" value={p.stats.vacantBeds} icon={<Home size={24}/>} trend={p.stats.vacantBeds > 5 ? "+Avail" : "-Tight"} color="#f59e0b" />
        <KPICard title="Outstanding Arrears" value={`₹${p.stats.overdueRevenue.toLocaleString()}`} icon={<AlertCircle size={24}/>} trend={p.stats.overdueRevenue > 5000 ? "+High" : "Optimal"} color="#ef4444" />
        <KPICard title="Hygiene Compliance" value={p.stats.hygieneScore} icon={<ShieldCheck size={24}/>} trend="98%" color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Floating Sidebar Switcher */}
        <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { id: 'revenue', name: 'Financial Matrix', icon: <TrendingUp size={20}/>, color: '#6366f1' },
            { id: 'occupancy', name: 'Inventory Flow', icon: <Layers size={20}/>, color: '#10b981' },
            { id: 'tenants', name: 'Tenant Lifecycle', icon: <Users size={20}/>, color: '#f59e0b' },
            { id: 'complaints', name: 'Resolution Engine', icon: <AlertCircle size={20}/>, color: '#ef4444' },
            { id: 'comfort', name: 'Living Standards', icon: <Star size={20}/>, color: '#8b5cf6' },
          ].map(m => (
            <motion.button 
              key={m.id}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedReport(m.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem', 
                fontSize: '0.95rem', fontWeight: selectedReport === m.id ? '900' : '700',
                background: selectedReport === m.id ? '#ffffff' : 'transparent',
                color: selectedReport === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: 'none', 
                borderRadius: '20px', 
                cursor: 'pointer',
                boxShadow: selectedReport === m.id ? '0 10px 25px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: selectedReport === m.id ? `${m.color}15` : 'rgba(0,0,0,0.03)', color: selectedReport === m.id ? m.color : 'inherit' }}>
                {m.icon}
              </div>
              {m.name}
              {selectedReport === m.id && (
                <motion.div layoutId="activeInd" style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              )}
            </motion.button>
          ))}

          {/* AI Insights - Modernized */}
          <div className="card" style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f9faff 100%)', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.03)'
          }}>
             <h4 style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.05em' }}>
               <Sparkles size={16} color="#f59e0b" /> Strategy Insights
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {p.insights.map((ins, i) => (
                 <div key={i} style={{ 
                   fontSize: '0.8rem', 
                   color: 'var(--text-secondary)', 
                   background: `${getInsightColor(ins.type)}08`,
                   padding: '1rem',
                   borderRadius: '12px',
                   borderLeft: `4px solid ${getInsightColor(ins.type)}`,
                   lineHeight: '1.5',
                   fontWeight: '600'
                 }}>
                   {ins.text}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Dynamic Analytics Viewport */}
        <div className="card" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px', 
          minHeight: '600px',
          background: '#ffffff',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0,0,0,0.03)'
        }}>
          <AnimatePresence mode="wait">
            
            {/* FINANCIALS SECTION */}
            {selectedReport === 'revenue' && (
              <motion.div key="revenue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                  <div className="card" style={{ padding: '2rem', background: '#f8faff', border: 'none', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>Revenue Projection</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actual vs Target performance metrics</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: '800' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Actual</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} /> Goal</div>
                      </div>
                    </div>
                    <div style={{ height: '350px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={p.revenueByMonth}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/><stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={v => `₹${v/1000}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1rem' }} 
                            itemStyle={{ fontWeight: '800' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                          <Area type="monotone" dataKey="expected" stroke="var(--text-muted)" fill="transparent" strokeDasharray="8 8" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="card" style={{ padding: '2rem', background: '#fcfcfe', border: 'none', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem' }}>Financial Health</h4>
                    <p style={{ margin: '0 0 2rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Payment status distribution</p>
                    <div style={{ height: '300px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={p.paymentStatusDist} innerRadius={80} outerRadius={105} paddingAngle={10} dataKey="value" stroke="none">
                            {p.paymentStatusDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>TOTAL</p>
                        <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '950' }}>100%</h4>
                      </div>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {p.paymentStatusDist.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1.2rem', background: 'white', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{item.name}</span>
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: '900' }}>₹{(item.value/1000).toFixed(1)}k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INVENTORY & OCCUPANCY */}
            {selectedReport === 'occupancy' && (
              <motion.div key="occupancy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                 <div className="card" style={{ padding: '2.5rem', background: '#f8faff', border: 'none', borderRadius: '24px', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>Utilization Matrix</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Historical vs current bed availability</p>
                      </div>
                    </div>
                    <div style={{ height: '320px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={p.occupancyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-10} tickFormatter={v => `${v}%`} />
                          <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.04)', radius: 12 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="rate" fill="var(--accent-primary)" radius={[10, 10, 0, 0]} barSize={60}>
                             {p.occupancyTrend.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.rate > 90 ? '#10b981' : 'var(--accent-primary)'} />
                             ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '24px' }}>
                       <h5 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                         <Building2 size={20} color="var(--accent-primary)" /> Property-Specific Yield
                       </h5>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                              <div key={i} style={{ padding: '1.2rem', background: '#f8f9fc', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.02)' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{b.name}</span>
                                    <span style={{ fontWeight: '900', color: bRate > 90 ? '#10b981' : '#6366f1' }}>{bRate}%</span>
                                 </div>
                                 <div style={{ height: '8px', width: '100%', background: 'white', borderRadius: '100px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${bRate}%` }} style={{ height: '100%', background: bRate > 90 ? '#10b981' : 'var(--accent-primary)', borderRadius: '100px' }} />
                                 </div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                                    <span>{bOcc} Active Leases</span>
                                    <span>{bTotal - bOcc} Available Units</span>
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                    
                    <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                       <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                       <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                          <CheckCircle2 size={40} />
                       </div>
                       <h3 style={{ margin: '0 0 1rem 0', fontWeight: '950', fontSize: '1.6rem', letterSpacing: '-0.02em' }}>Efficiency Reached</h3>
                       <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.6', fontWeight: '500', maxWidth: '280px' }}>
                         Your portfolio is currently operating in the <b>Gold Zone</b>. Supply is meeting 94% of market demand.
                       </p>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* TENANT LIFECYCLE */}
            {selectedReport === 'tenants' && (
              <motion.div key="tenants" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                   <div className="card" style={{ padding: '2.5rem', background: '#f8faff', border: 'none', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                         <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>Onboarding vs Churn</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Tenant lifecycle metrics over time</p>
                         </div>
                         <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: '800' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Onboarded</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Exited</div>
                         </div>
                      </div>
                      <div style={{ height: '350px', width: '100%' }}>
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={p.flowData}>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                             <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                             <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                             <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                             <Line type="monotone" dataKey="new" stroke="var(--accent-primary)" strokeWidth={4} dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 0 }} activeDot={{ r: 6, fill: 'var(--accent-primary)' }} />
                             <Line type="monotone" dataKey="exit" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
                           </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                         <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }} />
                         <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Users size={24} />
                         </div>
                         <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '950', fontSize: '1.2rem' }}>Total Active Network</h4>
                         <h2 style={{ margin: 0, fontSize: '3.5rem', fontWeight: '950', lineHeight: 1 }}>{p.stats.totalTenants}</h2>
                      </div>
                      
                      <div className="card" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <h4 style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Info size={16} color="var(--accent-primary)" /> Lifecycle Insights
                         </h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                               Retention rates are outperforming regional benchmarks by <span style={{ color: '#10b981', fontWeight: '900' }}>14%</span>.
                            </div>
                            <div style={{ padding: '1rem', background: '#fff1f2', borderRadius: '16px', fontSize: '0.85rem', color: '#9f1239', fontWeight: '600' }}>
                               Notice periods increased by 5% this quarter. Implement pre-churn surveys.
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* COMPLAINTS & TICKETING */}
            {selectedReport === 'complaints' && (
              <motion.div key="complaints" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', background: '#fcfcfe', border: 'none', borderRadius: '24px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '2.5rem' }}>Categorical Breakdown</h4>
                      <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={p.complaintDist} innerRadius={85} outerRadius={115} paddingAngle={8} dataKey="value" stroke="none">
                              {p.complaintDist.map((entry, index) => <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '0.85rem', fontWeight: '700', paddingTop: '2rem' }}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="card" style={{ padding: '2.5rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                          <p style={{ color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '1rem' }}>Success Metric</p>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                             <h2 style={{ fontSize: '5rem', fontWeight: '950', color: 'var(--accent-primary)', margin: 0, lineHeight: 1 }}>{p.resolutionRate}<span style={{ fontSize: '2rem' }}>%</span></h2>
                             <div style={{ position: 'absolute', bottom: '-5px', left: '10%', right: '10%', height: '8px', background: 'var(--accent-primary)', opacity: 0.1, borderRadius: '100px' }} />
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.95rem', marginTop: '1.5rem' }}>Resolution Performance</p>
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                          <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.8rem', fontWeight: '800' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Avg. Response Speed</span>
                                <span style={{ color: 'var(--accent-primary)' }}>18.4 Hours</span>
                             </div>
                             <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.5 }} style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '100px' }} />
                             </div>
                          </div>
                          <div style={{ padding: '1.2rem', background: '#fff9f0', borderRadius: '18px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <div style={{ padding: '0.6rem', borderRadius: '12px', background: '#ffedd5', color: '#f59e0b' }}>
                               <AlertCircle size={24} />
                             </div>
                             <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: '600', lineHeight: '1.5' }}>
                               <b>High Backlog:</b> 3 tickets are exceeding the 48-hour SLA. Immediate attention required.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* COMFORT & HYGIENE */}
            {selectedReport === 'comfort' && (
              <motion.div key="comfort" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                   {[
                     { label: 'Asset Comfort', val: p.stats.avgBedComfort, max: 10, color: '#f59e0b', bg: '#fffbeb', icon: <Star /> },
                     { label: 'Sanitation Index', val: p.stats.hygieneScore, max: 5, color: '#10b981', bg: '#f0fdf4', icon: <ShieldCheck /> },
                     { label: 'Air Quality/Vent', val: p.stats.avgVentilation, max: 10, color: '#0ea5e9', bg: '#f0f9ff', icon: <Activity /> }
                   ].map((kpi, i) => (
                     <div key={i} className="card" style={{ padding: '2rem', background: kpi.bg, border: 'none', borderRadius: '24px', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
                           {kpi.icon}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</p>
                        <h3 style={{ fontSize: '2.8rem', fontWeight: '950', margin: '0.5rem 0', color: kpi.color }}>{kpi.val}<span style={{ fontSize: '1.2rem', color: 'rgba(0,0,0,0.2)', marginLeft: '4px' }}>/{kpi.max}</span></h3>
                        <div style={{ height: '6px', width: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: '100px', margin: '0.8rem auto 0' }}>
                           <motion.div initial={{ width: 0 }} animate={{ width: `${(kpi.val/kpi.max)*100}%` }} style={{ height: '100%', background: kpi.color, borderRadius: '100px' }} />
                        </div>
                     </div>
                   ))}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
                   <div className="card" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>Operational Alerts</h4>
                        <div style={{ padding: '0.4rem 0.8rem', borderRadius: '100px', background: '#FEE2E2', color: '#EF4444', fontSize: '0.75rem', fontWeight: '900' }}>{data.maintenanceBeds.length} ACTION ITEMS</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {data.maintenanceBeds.length === 0 ? (
                             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: '#f8f9fa', borderRadius: '24px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                                   <CheckCircle2 size={32} color="#10b981" />
                                </div>
                                <h4 style={{ fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Compliance Achieved</h4>
                                <p style={{ fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto' }}>All property assets meet the required hygiene and safety standards.</p>
                             </div>
                          ) : (
                             data.maintenanceBeds.slice(0, 4).map(alert => (
                                <motion.div 
                                  key={alert.id} 
                                  whileHover={{ x: 5 }}
                                  style={{ padding: '1.2rem', background: '#fbfbff', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.02)' }}
                                >
                                   <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                      <img 
                                        src={alert.images?.[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=200&q=80'} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        alt="Asset" 
                                      />
                                   </div>
                                   <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                         <span style={{ fontSize: '0.7rem', fontWeight: '900', padding: '0.2rem 0.5rem', borderRadius: '6px', background: alert.hygieneRating < 3.5 ? '#FEE2E2' : '#FEF3C7', color: alert.hygieneRating < 3.5 ? '#EF4444' : '#D97706' }}>
                                            {alert.hygieneRating < 3.5 ? 'CRITICAL' : 'SCHEDULED'}
                                         </span>
                                         <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>Room {alert.room?.roomNumber} - Bed {alert.bedNumber}</span>
                                      </div>
                                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                         {alert.hygieneRating < 3.5 ? `Hygiene audit failed (${alert.hygieneRating}).` : `Service due since ${new Date(alert.lastSanitized).toLocaleDateString()}`}
                                      </p>
                                   </div>
                                   <button 
                                      className="btn" 
                                      style={{ padding: '0.8rem 1.2rem', fontSize: '0.8rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
                                      onClick={async () => {
                                         await api.markBedSanitized(alert.id);
                                         fetchData(); 
                                      }}
                                   >
                                      Resolve
                                   </button>
                                </motion.div>
                              ))
                           )}
                        </div>
                   </div>
                   
                   <div className="card" style={{ padding: '2.5rem', background: '#f8faff', border: 'none', borderRadius: '28px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '2rem' }}>Smart Amenities Logic</h4>
                        <div style={{ height: '280px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                              { name: 'Smart Locks', count: p.bFilteredRooms.filter(r => r.smartLock).length, color: '#6366f1' },
                              { name: 'Study Zones', count: p.bFilteredRooms.filter(r => r.studyFriendly).length, color: '#8b5cf6' },
                              { name: 'AC Units', count: p.bFilteredRooms.filter(r => r.isAC).length, color: '#0ea5e9' },
                              { name: 'Solar Energy', count: p.bFilteredRooms.filter(r => r.energyEfficient).length, color: '#10b981' }
                            ]} margin={{ left: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis type="category" dataKey="name" stroke="var(--text-primary)" fontSize={12} fontWeight={800} tickLine={false} axisLine={false} />
                              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 8 }} />
                              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                                 {[0,1,2,3].map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981'][index]} />
                                 ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'white', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)' }}>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', lineHeight: '1.6' }}>
                             <Sparkles size={14} color="#f59e0b" style={{ marginRight: '6px' }} />
                             <b>Property Strategy:</b> Upgrading shared rooms to "Smart Locks" could increase premium yield by 12%.
                           </p>
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
          <div key="filter-modal">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, backdropFilter: 'blur(8px)' }} 
              onClick={() => setIsFilterModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '420px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '950', margin: 0, letterSpacing: '-0.02em' }}>Analytics Filters</h2>
                <button onClick={() => setIsFilterModalOpen(false)} style={{ background: '#f8faff', border: 'none', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Asset</label>
                   <select value={filters.building} onChange={e => setFilters({...filters, building: e.target.value})} style={iStyle}>
                      <option value="all">Global Portfolio</option>
                      {data.buildings.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>)}
                   </select>
                </div>
                <div>
                   <label style={{ fontSize: '0.8rem', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory Category</label>
                   <select value={filters.roomType} onChange={e => setFilters({...filters, roomType: e.target.value})} style={iStyle}>
                      <option value="all">All Room Tiers</option>
                      <option value="Single">Elite Single</option>
                      <option value="Double">Prime Double</option>
                      <option value="Shared">Community Shared</option>
                   </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button className="btn btn-primary" onClick={() => setIsFilterModalOpen(false)} style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', fontWeight: '900', fontSize: '1rem' }}>Apply Intelligence</button>
                  <button className="btn" onClick={() => { setFilters({ dateRange: 'month', building: 'all', floor: 'all', roomType: 'all' }); setIsFilterModalOpen(false); }} style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '800', color: '#64748b' }}>Reset</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '5rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem', fontWeight: '600' }}>
        Neural Analytics Engine Active · System Status: Optimal · Last Data Sync: {new Date().toLocaleTimeString()}
      </footer>
    </div>
  );
};

const iStyle = { width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' };

export default Reports;
