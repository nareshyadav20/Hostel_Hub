import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Building, Wallet, Users, ArrowUpRight, ArrowDownRight, Zap, X, UserPlus, CheckCircle, AlertCircle, TrendingUp, Download, LogIn, LogOut, Settings, Bell, Utensils, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { api } from './mockData';
import { HealthScoreCard, ComplaintsPanel, MessPanel, StaffPanel, InsightsPanel, ActivityFeed, DocumentTracker, TenantOverviewPanel, DashboardModal, InfrastructureOverview } from './DashboardPanels';

const iStyle = { padding:'0.75rem', borderRadius:'10px', border:'1px solid var(--border-color)', background:'var(--bg-tertiary)', color:'var(--text-primary)', fontSize:'0.9rem', outline:'none', width:'100%', boxSizing:'border-box' };
const lStyle = { fontSize:'0.82rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.4rem', display:'block' };

function Dashboard() {
  const { buildingId } = useParams();
  const activeBuildingId = buildingId || localStorage.getItem('selectedBuildingId');
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'addTenant' | 'assignBed' | 'markPaid' | 'complaint'
  const [formMsg, setFormMsg] = useState('');
  const [d, setD] = useState({ summary:null, revenue:null, occupancy:null, alerts:null, complaints:null, mess:null, staff:null, activity: [], tenantsList: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (!activeBuildingId) {
      setIsLoading(false);
      return;
    }
    setIsRefreshing(true);
    try {
      const [summary, revenue, occupancy, alerts, complaints, mess, staff, activity, tenants] = await Promise.all([
        api.getDashboardSummary(activeBuildingId),
        api.getDashboardRevenue(activeBuildingId),
        api.getDashboardOccupancy(activeBuildingId),
        api.getDashboardAlerts(activeBuildingId),
        api.getDashboardComplaints(activeBuildingId),
        api.getDashboardMess(activeBuildingId),
        api.getDashboardStaff(activeBuildingId),
        api.getDashboardActivity(activeBuildingId),
        api.getTenants(activeBuildingId)
      ]);
      setD({ summary, revenue, occupancy, alerts, complaints, mess, staff, activity, tenantsList: tenants });
    } catch(e) {
      console.error('Dashboard Fetch Error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeBuildingId]);


  if (isLoading || !d.summary) return (
    <div className="dashboard-container">
      <div style={{ animation:'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        <div style={{ height: '60px', width: '30%', background:'var(--bg-tertiary)', borderRadius:'8px', marginBottom:'2rem' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem', marginBottom:'2.5rem' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height:'140px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'16px' }}/>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem' }}>
          <div style={{ height:'300px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'16px' }}/>
          <div style={{ height:'300px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'16px' }}/>
        </div>
      </div>
    </div>
  );

  const { summary, revenue, occupancy, alerts, complaints, mess, staff } = d;

  const lowStockCount = (mess?.inventory || []).filter(i => i.alert).length;

  const kpis = [
    { label:'Total Beds', value:summary.totalBeds, sub:'All capacity', color:'#2563EB', bg:'#DBEAFE', icon:<Building size={18}/>, up:true },
    { label:'Occupied', value:summary.occupiedBeds, sub:'Active tenants', color:'#10B981', bg:'#DCFCE7', icon:<Users size={18}/>, up:true },
    { label:'Vacant', value:summary.vacantBeds, sub:'Available now', color:'#EF4444', bg:'#FEE2E2', icon:<AlertCircle size={18}/>, up:false },
    { label:'Occupancy %', value:`${summary.occupancyRate}%`, sub:'Capacity used', color:'#8B5CF6', bg:'#EDE9FE', icon:<TrendingUp size={18}/>, up:summary.occupancyRate>=70 },
    { label:'Today Revenue', value:`₹${(summary.todayRevenue/1000).toFixed(1)}k`, sub:'Collected', color:'#10B981', bg:'#DCFCE7', icon:<Wallet size={18}/>, up:true },
    { label:'Monthly Est.', value:`₹${(summary.expectedMonthlyRevenue/100000).toFixed(1)}L`, sub:'Expected', color:'#F59E0B', bg:'#FEF3C7', icon:<Wallet size={18}/>, up:true },
    { label:'Pending Dues', value:summary.pendingPaymentsCount, sub:`₹${(summary.pendingPaymentsAmount/1000).toFixed(0)}k`, color:'#EF4444', bg:'#FEE2E2', icon:<AlertCircle size={18}/>, up:false },
    { label:'Total Tenants', value:summary.totalTenants ?? 0, sub:'Active in portal', color:'#10B981', bg:'#DCFCE7', icon:<Users size={18}/>, up:true },
    { label:'Staff Efficiency', value:`${staff?.efficiencyScore ?? 0}%`, sub:`${staff?.tasksCompleted ?? 0} tasks done`, color:'#0EA5E9', bg:'#E0F2FE', icon:<TrendingUp size={18}/>, up:(staff?.efficiencyScore ?? 0)>=80 },
    { label:'Performance', value:`${summary.healthScore}/100`, sub: summary.healthScore>=75?'Healthy':summary.healthScore>=50?'Moderate':'At Risk', color: summary.healthScore>=75?'#10B981':summary.healthScore>=50?'#F59E0B':'#EF4444', bg: summary.healthScore>=75?'#DCFCE7':summary.healthScore>=50?'#FEF3C7':'#FEE2E2', icon:<TrendingUp size={18}/>, up:summary.healthScore>=60 },
    { label:'Mess Alerts', value:lowStockCount, sub: lowStockCount>0?`${lowStockCount} items low`:'Stock OK', color: lowStockCount>0?'#EF4444':'#10B981', bg: lowStockCount>0?'#FEE2E2':'#DCFCE7', icon:<AlertCircle size={18}/>, up:lowStockCount===0 },
    { label:'Mess Subscriptions', value:142, sub:'₹1.8L monthly revenue', color:'#8B5CF6', bg:'#EDE9FE', icon:<Utensils size={18}/>, up:true, popular:'Premium' },
  ];

  const actionItems = [
    { label:'Check-ins', value:summary.checkInsToday, icon:'🚪', color:'#10B981' },
    { label:'Check-outs', value:summary.checkOutsToday, icon:'🏃', color:'#EF4444' },
    { label:'Rent Due', value:summary.rentDueToday, icon:'💰', color:'#F59E0B' },
    { label:'Complaints', value:summary.complaintsToday, icon:'⚠️', color:'#8B5CF6' },
    { label:'Maintenance', value:summary.maintenanceRooms, icon:'🔧', color:'#2563EB' },
  ];

  const col = { gap:'1.5rem', marginBottom:'2.5rem' };
  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', ...col };
  const grid3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', ...col };

  return (
    <>
      <div className="dashboard-container" style={{ animation:'fadeIn 0.5s ease' }}>

      {/* HEADER */}
      <header style={{ marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
            {buildingId && (
              <Link to="/owner/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700' }}>
                <ArrowLeft size={16} /> Back to Overview
              </Link>
            )}
          </div>
          <h1 style={{ fontSize:'2rem', fontWeight:'900', color:'var(--text-primary)', letterSpacing:'-0.03em', margin:0 }}>
            {buildingId === 'b1' ? 'Alpha Tower' : buildingId === 'b2' ? 'Beta Block' : 'Command Center'}
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem', marginTop:'0.3rem' }}>
            {buildingId ? 'Real-time property performance & operational control' : 'Real-time business insights & operational control'}
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap' }}>
          {/* Settings and Export removed per request */}
        </div>
      </header>

      {/* 1. PRIMARY KPI CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem', marginBottom:'2.5rem' }}>
        {kpis.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y:-2, boxShadow: 'var(--shadow-xl)' }} className="card" style={{ padding:'1.5rem', borderRadius:'16px', background:'var(--bg-secondary)', cursor:'pointer', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background: `linear-gradient(90deg, ${kpi.color}40, ${kpi.color})` }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem' }}>
              <div style={{ padding:'0.6rem', borderRadius:'10px', background:kpi.bg, color:kpi.color }}>{kpi.icon}</div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {kpi.popular && <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '100px', textTransform: 'uppercase' }}>{kpi.popular}</span>}
                <span style={{ fontSize:'0.75rem', fontWeight:'700', color:kpi.up?'#10B981':'#EF4444', display:'flex', alignItems:'center', gap:'0.2rem', padding:'0.2rem 0.5rem', borderRadius:'100px', background: kpi.up?'rgba(16, 185, 129, 0.1)':'rgba(239, 68, 68, 0.1)' }}>
                  {kpi.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                </span>
              </div>
            </div>
            <h2 style={{ fontSize:'2.2rem', fontWeight:'800', color:'var(--text-primary)', margin:0, letterSpacing:'-0.03em', lineHeight:1 }}>{kpi.value}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', marginTop:'0.8rem' }}>
              <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:'600', margin:0 }}>{kpi.label}</p>
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:0 }}>{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. ACTION CENTER + HEALTH SCORE */}
      <div style={{ ...grid2, gridTemplateColumns:'2fr 1fr', marginBottom:'2rem' }}>
        {/* Action Center */}
        <div className="card" style={{ padding:'1.5rem', borderRadius:'14px', border:'1px solid var(--border-color)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
            <Zap size={18} color="#F59E0B"/>
            <h3 style={{ fontSize:'1rem', fontWeight:'800', margin:0 }}>Today's Action Center</h3>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.7rem', marginBottom:'1.3rem' }}>
            {actionItems.map((a,i) => (
              <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.8rem 0.5rem', borderRadius:'10px', textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:'0.3rem' }}>{a.icon}</div>
                <div style={{ fontSize:'1.4rem', fontWeight:'800', color:a.color, lineHeight:1 }}>{a.value}</div>
                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:'600', marginTop:'0.2rem' }}>{a.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.6rem' }}>
            <button onClick={() => { setFormMsg(''); setModal('addTenant'); }} className="btn" style={{ background:'#DBEAFE', color:'#2563EB', fontSize:'0.75rem', padding:'0.55rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', borderRadius:'8px', cursor:'pointer' }}><UserPlus size={13}/> Add Tenant</button>
            <button onClick={() => { setFormMsg(''); setModal('assignBed'); }} className="btn" style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:'0.75rem', padding:'0.55rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', borderRadius:'8px', cursor:'pointer' }}><LogIn size={13}/> Assign Bed</button>
            <button onClick={() => { setFormMsg(''); setModal('markPaid'); }} className="btn" style={{ background:'#DCFCE7', color:'#10B981', fontSize:'0.75rem', padding:'0.55rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', borderRadius:'8px', cursor:'pointer' }}><CheckCircle size={13}/> Mark Paid</button>
            <button onClick={() => { setFormMsg(''); setModal('complaint'); }} className="btn" style={{ background:'#FEE2E2', color:'#EF4444', fontSize:'0.75rem', padding:'0.55rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', borderRadius:'8px', cursor:'pointer' }}><AlertCircle size={13}/> Complaint</button>
          </div>
        </div>
        {/* Health Score */}
        <HealthScoreCard score={summary.healthScore} threshold={75} />
      </div>

      {/* 3. REVENUE ANALYTICS */}
      <div style={{ ...grid2, gridTemplateColumns:'2fr 1fr', marginBottom:'2rem' }}>
        {/* Daily Bar Chart */}
        <div className="card" style={{ padding:'1.5rem', borderRadius:'14px', border:'1px solid var(--border-color)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
            <div>
              <h3 style={{ fontSize:'1rem', fontWeight:'800', margin:0 }}>Revenue Analytics</h3>
              <p style={{ fontSize:'0.78rem', color:'var(--text-secondary)', margin:'0.2rem 0 0' }}>Expected vs Actual (last 7 days)</p>
            </div>
            <div style={{ textAlign:'right', fontSize:'0.78rem' }}>
              <div style={{ color:'var(--text-muted)' }}>Net Profit</div>
              <div style={{ fontWeight:'800', color:'#10B981', fontSize:'1rem' }}>₹{(revenue.rentMetrics.netProfit/100000).toFixed(1)}L</div>
            </div>
          </div>
          <div style={{ height:'200px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
              <BarChart data={revenue.dailyRevenue} margin={{ top:5, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5}/>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'8px', fontSize:'0.8rem' }} cursor={{ fill:'var(--bg-tertiary)' }}/>
                <Bar dataKey="expected" fill="#DBEAFE" radius={[3,3,0,0]} barSize={14}/>
                <Bar dataKey="actual" fill="#2563EB" radius={[3,3,0,0]} barSize={14}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem', marginTop:'0.8rem' }}>
            {[
              { label:'Collected', value:`₹${(revenue.rentMetrics.collectedRent/100000).toFixed(1)}L`, color:'#10B981' },
              { label:'Pending', value:`₹${(revenue.rentMetrics.pendingRent/1000).toFixed(0)}k`, color:'#EF4444' },
              { label:'Security Dep.', value:`₹${(revenue.rentMetrics.securityDepositsHeld/100000).toFixed(1)}L`, color:'#F59E0B' },
            ].map((m,i) => (
              <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.6rem 0.8rem', borderRadius:'8px', textAlign:'center' }}>
                <div style={{ fontSize:'0.95rem', fontWeight:'800', color:m.color }}>{m.value}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'600' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card" style={{ padding:'1.5rem', borderRadius:'14px', border:'1px solid var(--border-color)' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:'800', margin:'0 0 1rem' }}>Monthly Trend</h3>
          <div style={{ height:'220px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
              <AreaChart data={revenue.monthlyRevenue} margin={{ top:5, right:0, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5}/>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'8px', fontSize:'0.8rem' }}/>
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#revGrad)"/>
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="none" strokeDasharray="4 2"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', fontSize:'0.75rem', marginTop:'0.5rem' }}>
            <span style={{ color:'#2563EB', fontWeight:'700' }}>— Revenue</span>
            <span style={{ color:'#EF4444', fontWeight:'700' }}>- - Expenses</span>
          </div>
        </div>
      </div>

      {/* 4. OCCUPANCY + TENANT + COMPLAINTS */}
      <div style={{ ...grid3, marginBottom:'2rem' }}>
        {/* Occupancy */}
        <div className="card" style={{ padding:'1.5rem', borderRadius:'14px', border:'1px solid var(--border-color)' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:'800', margin:'0 0 1rem' }}>Occupancy Breakdown</h3>
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem', fontSize:'0.8rem' }}>
              <span style={{ fontWeight:'600' }}>Overall</span><span style={{ fontWeight:'800', color:'#10B981' }}>{summary.occupancyRate}%</span>
            </div>
            <div style={{ height:'8px', background:'var(--bg-tertiary)', borderRadius:'4px', overflow:'hidden' }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${summary.occupancyRate}%` }} transition={{ duration:1 }} style={{ height:'100%', background:'#10B981', borderRadius:'4px' }}/>
            </div>
          </div>
          <div style={{ height:'160px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
              <PieChart>
                <Pie data={occupancy.buildingWise.length ? occupancy.buildingWise : [{name:'Occupied',occupied:summary.occupiedBeds},{name:'Vacant',occupied:summary.vacantBeds}]} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="occupied" nameKey="name">
                  {(occupancy.buildingWise.length ? occupancy.buildingWise : [{},{},{}]).map((_,i) => (
                    <Cell key={i} fill={['#2563EB','#10B981','#F59E0B','#8B5CF6','#EF4444'][i%5]}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'none', borderRadius:'8px', fontSize:'0.78rem' }}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize:'0.75rem' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {(occupancy.buildingWise||[]).map((b,i) => (
            <div key={i} style={{ marginBottom:'0.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:'2px' }}>
                <span style={{ fontWeight:'600', color:'var(--text-secondary)' }}>{b.name}</span>
                <span style={{ fontWeight:'700' }}>{b.total ? Math.round((b.occupied/b.total)*100) : 0}%</span>
              </div>
              <div style={{ height:'5px', background:'var(--bg-tertiary)', borderRadius:'4px' }}>
                <div style={{ width:`${b.total?Math.round((b.occupied/b.total)*100):0}%`, height:'100%', background:['#2563EB','#10B981','#F59E0B'][i%3], borderRadius:'4px' }}/>
              </div>
            </div>
          ))}
        </div>

        <TenantOverviewPanel summary={summary}/>
        <ComplaintsPanel data={complaints}/>
      </div>

      {/* 5. MESS + STAFF + INFRASTRUCTURE */}
      <div style={{ ...grid3, marginBottom:'2rem' }}>
        <MessPanel data={mess}/>
        <StaffPanel data={staff}/>
        <InfrastructureOverview buildingId={buildingId} />
      </div>

      {/* 6. INSIGHTS + ACTIVITY + DOCUMENTS */}
      <div style={{ ...grid3, marginBottom:'2rem' }}>
        <InsightsPanel insights={alerts.insights} alerts={alerts.alerts} summary={summary}/>
        <ActivityFeed/>
        <DocumentTracker/>
      </div>

    </div>

    {/* ── MODALS ─────────────────────────────────── */}

    {/* Add Tenant */}
    <DashboardModal isOpen={modal==='addTenant'} onClose={() => setModal(null)} title="➕ Add New Tenant">
      {formMsg && <div style={{ padding:'0.8rem', background:'#DCFCE7', borderRadius:'8px', color:'#065F46', fontWeight:'700', fontSize:'0.85rem', marginBottom:'1rem' }}>{formMsg}</div>}
      <form style={{ display:'flex', flexDirection:'column', gap:'1rem' }} onSubmit={async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
          await api.addTenant({ name:fd.get('name'), phone:fd.get('phone'), email:fd.get('email'), roomNumber:fd.get('room'), rentAmount:Number(fd.get('rent')), joinDate:fd.get('joinDate') });
          setFormMsg('✅ Tenant added successfully!');
          e.target.reset();
        } catch { setFormMsg('✅ Tenant saved (offline mode).'); }
      }}>
        <div><label style={lStyle}>Full Name *</label><input name="name" required placeholder="e.g. Rahul Sharma" style={iStyle}/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div><label style={lStyle}>Phone *</label><input name="phone" required placeholder="9876543210" style={iStyle}/></div>
          <div><label style={lStyle}>Email</label><input name="email" type="email" placeholder="rahul@email.com" style={iStyle}/></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div><label style={lStyle}>Room Number</label><input name="room" placeholder="e.g. 201-A" style={iStyle}/></div>
          <div><label style={lStyle}>Monthly Rent (₹)</label><input name="rent" type="number" placeholder="6500" style={iStyle}/></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div>
            <label style={lStyle}>Mess Plan</label>
            <select name="messPlan" style={iStyle}>
              <option value="basic">Basic (₹500 - 3 Meals + Customization)</option>
              <option value="p1000">Standard (₹1000 - Extra Variety)</option>
              <option value="p1500">Premium (₹1500 - Executive Buffet)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
             <input type="checkbox" id="customization" name="allowCustom" />
             <label htmlFor="customization" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Allow Customization</label>
          </div>
        </div>
        <div><label style={lStyle}>Join Date</label><input name="joinDate" type="date" style={iStyle} defaultValue={new Date().toISOString().split('T')[0]}/></div>
        <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Save Tenant</button>
          <button type="button" onClick={() => setModal(null)} className="btn" style={{ flex:1, background:'var(--bg-tertiary)' }}>Cancel</button>
        </div>
      </form>
    </DashboardModal>

    {/* Assign Bed */}
    <DashboardModal isOpen={modal==='assignBed'} onClose={() => setModal(null)} title="🛏️ Assign Bed">
      {formMsg && <div style={{ padding:'0.8rem', background:'#DCFCE7', borderRadius:'8px', color:'#065F46', fontWeight:'700', fontSize:'0.85rem', marginBottom:'1rem' }}>{formMsg}</div>}
      <form style={{ display:'flex', flexDirection:'column', gap:'1rem' }} onSubmit={e => { e.preventDefault(); setFormMsg('✅ Bed assigned successfully!'); e.target.reset(); }}>
        <div><label style={lStyle}>Tenant Name *</label><input name="tenant" required placeholder="Search tenant name" style={iStyle}/></div>
        <div><label style={lStyle}>Building</label>
          <select name="building" style={iStyle}><option value="">Select Building</option><option>Building A</option><option>Building B</option><option>Building C</option></select>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div><label style={lStyle}>Floor</label><select name="floor" style={iStyle}><option>Floor 1</option><option>Floor 2</option><option>Floor 3</option></select></div>
          <div><label style={lStyle}>Room</label><input name="room" placeholder="Room No." style={iStyle}/></div>
        </div>
        <div><label style={lStyle}>Bed Number</label><input name="bed" placeholder="e.g. A, B, C" style={iStyle}/></div>
        <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Assign Bed</button>
          <button type="button" onClick={() => setModal(null)} className="btn" style={{ flex:1, background:'var(--bg-tertiary)' }}>Cancel</button>
        </div>
      </form>
    </DashboardModal>

    {/* Mark Paid */}
    <DashboardModal isOpen={modal==='markPaid'} onClose={() => setModal(null)} title="💰 Mark Payment Received">
      {formMsg && <div style={{ padding:'0.8rem', background:'#DCFCE7', borderRadius:'8px', color:'#065F46', fontWeight:'700', fontSize:'0.85rem', marginBottom:'1rem' }}>{formMsg}</div>}
      <form style={{ display:'flex', flexDirection:'column', gap:'1rem' }} onSubmit={e => { e.preventDefault(); setFormMsg('✅ Payment recorded successfully!'); e.target.reset(); }}>
        <div><label style={lStyle}>Tenant Name *</label><input name="tenant" required placeholder="e.g. Priya Verma" style={iStyle}/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div><label style={lStyle}>Amount (₹) *</label><input name="amount" type="number" required placeholder="6500" style={iStyle}/></div>
          <div><label style={lStyle}>Payment Date</label><input name="date" type="date" style={iStyle} defaultValue={new Date().toISOString().split('T')[0]}/></div>
        </div>
        <div><label style={lStyle}>Payment Mode</label>
          <select name="mode" style={iStyle}><option>UPI</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option></select>
        </div>
        <div><label style={lStyle}>Transaction ID / Notes</label><input name="txn" placeholder="Optional" style={iStyle}/></div>
        <div style={{ padding:'0.8rem', background:'#DBEAFE', borderRadius:'8px', fontSize:'0.82rem', color:'#1E40AF' }}>ℹ️ This will mark the tenant's current month rent as paid.</div>
        <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
          <button type="submit" className="btn" style={{ flex:1, background:'#10B981', color:'#fff' }}>Confirm Payment</button>
          <button type="button" onClick={() => setModal(null)} className="btn" style={{ flex:1, background:'var(--bg-tertiary)' }}>Cancel</button>
        </div>
      </form>
    </DashboardModal>

    {/* Raise Complaint */}
    <DashboardModal isOpen={modal==='complaint'} onClose={() => setModal(null)} title="⚠️ Raise Complaint">
      {formMsg && <div style={{ padding:'0.8rem', background:'#DCFCE7', borderRadius:'8px', color:'#065F46', fontWeight:'700', fontSize:'0.85rem', marginBottom:'1rem' }}>{formMsg}</div>}
      <form style={{ display:'flex', flexDirection:'column', gap:'1rem' }} onSubmit={e => { e.preventDefault(); setFormMsg('✅ Complaint logged successfully!'); e.target.reset(); }}>
        <div><label style={lStyle}>Room Number *</label><input name="room" required placeholder="e.g. 201-A" style={iStyle}/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div><label style={lStyle}>Category *</label>
            <select name="category" required style={iStyle}><option value="">Select</option><option>Maintenance</option><option>Cleaning</option><option>Food</option><option>Security</option><option>Others</option></select>
          </div>
          <div><label style={lStyle}>Priority *</label>
            <select name="priority" style={iStyle}><option>Low</option><option>Medium</option><option>High</option></select>
          </div>
        </div>
        <div><label style={lStyle}>Reported By</label><input name="reporter" placeholder="Tenant name or staff" style={iStyle}/></div>
        <div><label style={lStyle}>Description *</label>
          <textarea name="desc" required rows={3} placeholder="Describe the issue in detail..." style={{ ...iStyle, resize:'vertical', fontFamily:'inherit' }}/>
        </div>
        <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
          <button type="submit" className="btn" style={{ flex:1, background:'#EF4444', color:'#fff' }}>Log Complaint</button>
          <button type="button" onClick={() => setModal(null)} className="btn" style={{ flex:1, background:'var(--bg-tertiary)' }}>Cancel</button>
        </div>
      </form>
    </DashboardModal>
    </>
  );
}

export default Dashboard;
