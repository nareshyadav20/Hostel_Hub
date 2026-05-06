import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building, Wallet, Users, ArrowUpRight, ArrowDownRight, Zap, X, UserPlus, CheckCircle, AlertCircle, TrendingUp, LogIn, Utensils, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { api } from './mockData';
import { ComplaintsPanel, MessPanel, StaffPanel, InsightsPanel, ActivityFeed, TenantOverviewPanel, DashboardModal } from './DashboardPanels';

const iStyle = { padding:'0.85rem', borderRadius:'12px', border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:'0.9rem', outline:'none', width:'100%', boxSizing:'border-box', transition:'all 0.3s' };
const lStyle = { fontSize:'0.8rem', fontWeight:'800', color:'var(--text-muted)', marginBottom:'0.5rem', display:'block', textTransform:'uppercase', letterSpacing:'0.04em' };

function Dashboard() {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null); 
  const [formMsg, setFormMsg] = useState('');
  const [d, setD] = useState({ summary:null, revenue:null, occupancy:null, alerts:null, complaints:null, mess:null, staff:null, activity: [], tenantsList: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (!activeBuildingId) return;
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
    <div className="dashboard-container" style={{ padding: '2rem' }}>
      <div style={{ animation:'pulse 2s infinite' }}>
        <div style={{ height: '35px', width: '180px', background:'var(--bg-tertiary)', borderRadius:'8px', marginBottom:'1.5rem' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem', marginBottom:'1.5rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ height:'100px', background:'var(--bg-secondary)', borderRadius:'16px' }}/>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem' }}>
          <div style={{ height:'400px', background:'var(--bg-secondary)', borderRadius:'16px' }}/>
          <div style={{ height:'400px', background:'var(--bg-secondary)', borderRadius:'16px' }}/>
        </div>
      </div>
    </div>
  );

  const { summary, revenue, alerts, complaints, mess, staff, activity, tenantsList } = d;

  const primaryKpis = [
    { label:'Revenue Collected', valueText:`₹${(summary.todayRevenue/1000).toFixed(1)}k`, sub:'Collected today', color:'#10B981', bg:'rgba(16, 185, 129, 0.1)', icon:<Wallet size={20}/>, up:true },
    { label:'Occupancy Rate', valueText:`${summary.occupancyRate}%`, sub:`${summary.occupiedBeds}/${summary.totalBeds} Beds`, color:'#6366F1', bg:'rgba(99, 102, 241, 0.1)', icon:<TrendingUp size={20}/>, up:true },
    { label:'Pending Dues', valueText:`₹${(summary.pendingPaymentsAmount/1000).toFixed(0)}k`, sub:`${summary.pendingPaymentsCount} Defaulters`, color:'#EF4444', bg:'rgba(239, 68, 68, 0.1)', icon:<AlertCircle size={20}/>, up:false },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '2rem', animation:'fadeIn 0.5s ease', maxWidth: '1600px', margin: '0 auto' }}>

      {/* REFINED HEADER */}
      <header style={{ marginBottom:'2.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <Link to="/owner/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize:'2.4rem', fontWeight:'1000', color:'var(--text-primary)', letterSpacing:'-0.04em', margin:0 }}>
              {summary.buildingName} Dashboard
            </h1>
            <div style={{ padding: '0.4rem 0.8rem', borderRadius: '100px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              Live System
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchData} 
            disabled={isRefreshing}
            className="btn" 
            style={{ padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
          >
            <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}>
              <RefreshCw size={18} />
            </motion.div>
          </button>
        </div>
      </header>

      {/* 1. CRITICAL KPI GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.2rem', marginBottom:'1.5rem' }}>
        {primaryKpis.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y:-3, boxShadow: 'var(--shadow-md)' }} className="card" style={{ padding:'1.2rem', borderRadius:'16px', background:'var(--bg-secondary)', border: '1px solid var(--border-color)', position:'relative' }}>
             <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.8rem' }}>
               <div style={{ padding:'0.6rem', borderRadius:'10px', background:kpi.bg, color:kpi.color, display: 'flex' }}>
                 {React.cloneElement(kpi.icon, { size: 18 })}
               </div>
               <span style={{ fontSize:'0.7rem', fontWeight:'800', color:kpi.up?'#10B981':'#EF4444', background: kpi.up?'rgba(16, 185, 129, 0.05)':'rgba(239, 68, 68, 0.05)', padding: '0.2rem 0.5rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                 {kpi.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {kpi.up ? '+2.4%' : '-1.2%'}
               </span>
             </div>
             <h2 style={{ fontSize:'1.6rem', fontWeight:'900', color:'var(--text-primary)', margin:0 }}>{kpi.valueText}</h2>
             <p style={{ fontSize:'0.8rem', fontWeight:'700', color:'var(--text-secondary)', marginTop:'0.4rem', marginBottom: 0 }}>{kpi.label}</p>
             <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.15rem', margin: 0 }}>{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Analytics & Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Revenue Analytics */}
          <div className="card" style={{ padding:'1.2rem', borderRadius:'16px', background:'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem' }}>
              <div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:'900', margin:0 }}>Revenue Stream</h3>
                <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin:0 }}>Daily collection performance</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Profit Est.</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '1000', color: '#10B981' }}>₹{(revenue.rentMetrics.netProfit/1000).toFixed(0)}k</div>
              </div>
            </div>
            <div style={{ height: '220px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue.dailyRevenue}>
                  <defs>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={3} fill="url(#colGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <TenantOverviewPanel summary={summary}/>
            <ComplaintsPanel data={complaints}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <MessPanel data={mess}/>
            <StaffPanel data={staff}/>
          </div>
        </div>

        {/* Right Column: Actions & Live Feeds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Action Center */}
          <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', background:'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:'900', marginBottom:'1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#F59E0B" /> Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
               <button onClick={() => setModal('addTenant')} className="btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '16px' }}>
                 <UserPlus size={24} color="#6366F1" />
                 <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Add Tenant</span>
               </button>
               <button onClick={() => setModal('markPaid')} className="btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '16px' }}>
                 <CheckCircle size={24} color="#10B981" />
                 <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Mark Paid</span>
               </button>
               <button onClick={() => setModal('assignBed')} className="btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '16px' }}>
                 <LogIn size={24} color="#7C3AED" />
                 <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Assign Bed</span>
               </button>
               <button onClick={() => setModal('complaint')} className="btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: '16px' }}>
                 <AlertCircle size={24} color="#EF4444" />
                 <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>New Issue</span>
               </button>
            </div>
          </div>

          <InsightsPanel insights={alerts.insights} alerts={alerts.alerts} summary={summary}/>
          <ActivityFeed items={activity} />
        </div>
      </div>


      {/* MODALS */}
      <DashboardModal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'addTenant' ? 'New Tenant Registration' : modal === 'markPaid' ? 'Receive Rent Payment' : modal === 'assignBed' ? 'Room Assignment' : 'Log Maintenance Issue'}>
         {formMsg && <div style={{ padding:'1rem', background:'rgba(16, 185, 129, 0.1)', borderRadius:'12px', color:'#10B981', fontWeight:'800', fontSize:'0.85rem', marginBottom:'1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{formMsg}</div>}
         
         {modal === 'addTenant' && (
           <form style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }} onSubmit={async e => {
             e.preventDefault();
             setFormMsg('Processing...');
             const fd = new FormData(e.target);
             try {
               await api.addTenant({ 
                 name: fd.get('name'), 
                 phone: fd.get('phone'), 
                 email: fd.get('email'), 
                 emergencyContact: fd.get('emergencyContact'),
                 room: fd.get('room'), 
                 rent: Number(fd.get('rent')), 
                 checkInDate: fd.get('joinDate') || new Date(),
                 buildingId: activeBuildingId
               });
               setFormMsg('✅ Tenant data securely committed to database.');
               setTimeout(() => { setModal(null); setFormMsg(''); fetchData(); }, 1500);
             } catch { setFormMsg('❌ Backend error. Please check database connectivity.'); }
           }}>
             <div><label style={lStyle}>Full Name</label><input name="name" required placeholder="Legal full name" style={iStyle}/></div>
             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
               <div><label style={lStyle}>Phone</label><input name="phone" required placeholder="+91 ..." style={iStyle}/></div>
               <div><label style={lStyle}>Emergency Contact</label><input name="emergencyContact" required placeholder="Name & Phone" style={iStyle}/></div>
             </div>
             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
               <div><label style={lStyle}>Email</label><input name="email" type="email" placeholder="official@email.com" style={iStyle}/></div>
               <div><label style={lStyle}>Join Date</label><input name="joinDate" type="date" style={iStyle}/></div>
             </div>
             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
               <div><label style={lStyle}>Room / Bed</label><input name="room" required placeholder="e.g. 101-A" style={iStyle}/></div>
               <div><label style={lStyle}>Monthly Rent (₹)</label><input name="rent" type="number" required placeholder="0.00" style={iStyle}/></div>
             </div>
             <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>Commit Registration</button>
           </form>
         )}

         {modal === 'markPaid' && (
           <form style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }} onSubmit={async e => {
             e.preventDefault();
             setFormMsg('Processing payment...');
             const fd = new FormData(e.target);
             try {
               await api.addPayment({ 
                 tenantId: fd.get('tenantId'), 
                 amount: Number(fd.get('amount')), 
                 method: fd.get('method'),
                 type: 'Rent',
                 status: 'Paid',
                 buildingId: activeBuildingId 
               });
               setFormMsg('✅ Payment record verified and stored.');
               setTimeout(() => { setModal(null); setFormMsg(''); fetchData(); }, 1500);
             } catch { setFormMsg('❌ Error recording payment.'); }
           }}>
             <div>
               <label style={lStyle}>Select Tenant</label>
               <select name="tenantId" required style={iStyle}>
                 <option value="">-- Choose Tenant --</option>
                 {tenantsList.map(t => <option key={t.id} value={t.id}>{t.name} (Room {t.room || 'N/A'})</option>)}
               </select>
             </div>
             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
               <div><label style={lStyle}>Amount (₹)</label><input name="amount" type="number" required placeholder="0.00" style={iStyle}/></div>
               <div><label style={lStyle}>Mode</label><select name="method" style={iStyle}><option>UPI</option><option>Cash</option><option>Bank Transfer</option></select></div>
             </div>
             <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>Record Transaction</button>
           </form>
         )}

         {modal === 'assignBed' && (
            <form style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }} onSubmit={async e => {
              e.preventDefault();
              setFormMsg('Updating assignment...');
              const fd = new FormData(e.target);
              try {
                await api.updateTenant(fd.get('tenantId'), { room: fd.get('room') });
                setFormMsg('✅ Room assignment updated successfully.');
                setTimeout(() => { setModal(null); setFormMsg(''); fetchData(); }, 1500);
              } catch { setFormMsg('❌ Error updating assignment.'); }
            }}>
              <div>
                <label style={lStyle}>Select Tenant</label>
                <select name="tenantId" required style={iStyle}>
                  <option value="">-- Choose Tenant --</option>
                  {tenantsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label style={lStyle}>New Room / Bed</label><input name="room" required placeholder="e.g. 101-A" style={iStyle}/></div>
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>Update Assignment</button>
            </form>
         )}

         {modal === 'complaint' && (
            <form style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }} onSubmit={async e => {
              e.preventDefault();
              setFormMsg('Logging issue...');
              const fd = new FormData(e.target);
              try {
                await api.addComplaint({ 
                  tenantId: fd.get('tenantId'), 
                  title: fd.get('title'),
                  category: fd.get('category'),
                  priority: fd.get('priority'),
                  description: fd.get('description'),
                  buildingId: activeBuildingId
                });
                setFormMsg('✅ Maintenance issue logged.');
                setTimeout(() => { setModal(null); setFormMsg(''); fetchData(); }, 1500);
              } catch { setFormMsg('❌ Error logging complaint.'); }
            }}>
              <div>
                <label style={lStyle}>Reported By</label>
                <select name="tenantId" required style={iStyle}>
                  <option value="">-- Select Tenant --</option>
                  {tenantsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label style={lStyle}>Issue Title</label><input name="title" required placeholder="e.g. AC not working" style={iStyle}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={lStyle}>Category</label><select name="category" style={iStyle}><option>Maintenance</option><option>Cleaning</option><option>Mess</option><option>Other</option></select></div>
                <div><label style={lStyle}>Priority</label><select name="priority" style={iStyle}><option>Low</option><option>Medium</option><option>High</option></select></div>
              </div>
              <div><label style={lStyle}>Description</label><textarea name="description" rows="3" style={{ ...iStyle, height: 'auto' }} placeholder="Provide details..."></textarea></div>
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>Log Complaint</button>
            </form>
         )}
      </DashboardModal>

    </div>
  );
}

export default Dashboard;
