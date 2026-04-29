import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Lightbulb, Bell, Users, Utensils, ShieldCheck, TrendingUp, FileText, ClipboardList, ChevronRight, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PIE_COLORS = ['#EF4444','#F59E0B','#8B5CF6','#6B7280'];

// ── MODAL ─────────────────────────────────────────────────────
export function DashboardModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ y:40, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }} exit={{ y:40, opacity:0, scale:0.95 }}
            style={{ background:'var(--bg-primary)', border:'1px solid var(--border-color)', borderRadius:'20px', padding:'2rem', width:'90%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.3rem', fontWeight:'800', color:'var(--text-primary)', margin:0 }}>{title}</h2>
              <button onClick={onClose} style={{ background:'var(--bg-tertiary)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)' }}><X size={16}/></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── HEALTH SCORE ────────────────────────────────────────────
export function HealthScoreCard({ score, threshold = 75 }) {
  const status = score >= threshold ? { label:'Healthy', color:'#10B981', bg:'#DCFCE7' }
    : score >= (threshold - 20) ? { label:'Moderate', color:'#F59E0B', bg:'#FEF3C7' }
    : { label:'At Risk', color:'#EF4444', bg:'#FEE2E2' };
  const r = 40, circ = 2 * Math.PI * r;
  const dash = circ - (score / 100) * circ;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)', display:'flex', flexDirection:'column', gap:'1rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
        <ShieldCheck size={18} color={status.color} />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Property Health Score</h3>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="10"/>
          <circle cx="50" cy="50" r={r} fill="none" stroke={status.color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
            transform="rotate(-90 50 50)" style={{ transition:'stroke-dashoffset 1s ease' }}/>
          <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="800" fill={status.color}>{score}</text>
        </svg>
        <div>
          <span style={{ padding:'0.3rem 0.8rem', borderRadius:'100px', fontSize:'0.8rem', fontWeight:'700', background:status.bg, color:status.color }}>{status.label}</span>
          <div style={{ marginTop:'0.8rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            {score < threshold && <p style={{ fontSize:'0.78rem', color:'#EF4444' }}>⚠ Score below threshold ({threshold}%)</p>}
            {score < 60 && <p style={{ fontSize:'0.78rem', color:'#EF4444' }}>⚠ High pending payments detected</p>}
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Managed by system threshold</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPLAINTS PANEL ─────────────────────────────────────────
export function ComplaintsPanel({ data }) {
  if (!data) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <AlertCircle size={18} color="#EF4444" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Complaints Overview</h3>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.8rem', marginBottom:'1.2rem' }}>
        {[
          { label:'Total', value:data.total, color:'var(--text-primary)' },
          { label:'Open', value:data.open, color:'#EF4444' },
          { label:'Resolved', value:data.resolved, color:'#10B981' },
          { label:'High Priority', value:data.highPriority, color:'#F59E0B' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'10px', textAlign:'center' }}>
            <p style={{ fontSize:'1.3rem', fontWeight:'800', color:s.color, margin:0 }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'600', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ height:'130px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} debounce={1}>
          <PieChart>
            <Pie data={data.categories} dataKey="count" nameKey="name" innerRadius={30} outerRadius={50} paddingAngle={3}>
              {data.categories.map((c,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'none', borderRadius:'8px', fontSize:'0.8rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'0.5rem' }}>
        {data.categories.map((c,i) => (
          <span key={i} style={{ fontSize:'0.72rem', padding:'0.2rem 0.6rem', borderRadius:'100px', background:`${PIE_COLORS[i]}20`, color:PIE_COLORS[i], fontWeight:'700' }}>
            {c.name}: {c.count}
          </span>
        ))}
      </div>
      {data.pending24h > 0 && (
        <div style={{ marginTop:'0.8rem', padding:'0.6rem 0.8rem', background:'#FEE2E2', borderRadius:'8px', fontSize:'0.78rem', color:'#991B1B', fontWeight:'600' }}>
          ⚠ {data.pending24h} complaints pending &gt; 24 hrs · Avg resolution: {data.avgResolutionHours}h
        </div>
      )}
    </div>
  );
}

// ── MESS PANEL ───────────────────────────────────────────────
export function MessPanel({ data }) {
  if (!data) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <Utensils size={18} color="#8B5CF6" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Mess Management</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.8rem', color:'#10B981', fontWeight:'700', background:'#DCFCE7', padding:'0.2rem 0.6rem', borderRadius:'100px' }}>
          ⭐ {data.avgFoodRating}/5
        </span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.8rem', marginBottom:'1.2rem' }}>
        {[
          { label:'Meals Today', value:data.mealsServedToday, color:'#8B5CF6' },
          { label:'Daily Cost', value:`₹${(data.dailyMessCost/1000).toFixed(1)}k`, color:'#F59E0B' },
          { label:'Monthly Cost', value:`₹${(data.monthlyMessCost/1000).toFixed(0)}k`, color:'#EF4444' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'10px', textAlign:'center' }}>
            <p style={{ fontSize:'1.2rem', fontWeight:'800', color:s.color, margin:0 }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'600', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:'1rem', padding:'0.8rem', background:'var(--bg-tertiary)', borderRadius:'10px' }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.4rem' }}>TODAY'S MENU</p>
        {Object.entries(data.menuToday).map(([meal, menu]) => (
          <div key={meal} style={{ display:'flex', gap:'0.5rem', fontSize:'0.82rem', marginBottom:'0.2rem' }}>
            <span style={{ fontWeight:'700', color:'var(--text-secondary)', textTransform:'capitalize', minWidth:'70px' }}>{meal}:</span>
            <span style={{ color:'var(--text-primary)' }}>{menu}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:'0.78rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.5rem' }}>LOW STOCK ALERTS</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
        {data.inventory.filter(i => i.alert).map((item,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0.8rem', background:'#FEE2E2', borderRadius:'8px', fontSize:'0.8rem' }}>
            <span style={{ fontWeight:'700', color:'#991B1B' }}>⚠ {item.item}</span>
            <span style={{ color:'#EF4444', fontWeight:'600' }}>{item.stock} {item.unit} left</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STAFF PANEL ──────────────────────────────────────────────
export function StaffPanel({ data }) {
  if (!data) return null;
  const staffArray = Array.isArray(data.staffList) ? data.staffList : [];
  const sorted = [...staffArray].sort((a,b) => (b.score || 0) - (a.score || 0));
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <Users size={18} color="#2563EB" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Staff Performance</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.8rem', color:'#2563EB', fontWeight:'700', background:'#DBEAFE', padding:'0.2rem 0.6rem', borderRadius:'100px' }}>
          Efficiency {data.efficiencyScore}%
        </span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.8rem', marginBottom:'1.2rem' }}>
        {[
          { label:'Assigned', value:data.tasksAssigned, color:'var(--text-primary)' },
          { label:'Completed', value:data.tasksCompleted, color:'#10B981' },
          { label:'Pending', value:data.tasksPending, color:'#EF4444' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'10px', textAlign:'center' }}>
            <p style={{ fontSize:'1.2rem', fontWeight:'800', color:s.color, margin:0 }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'600', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
        {sorted.map((s,i) => (
          <motion.div whileHover={{ backgroundColor: 'var(--bg-tertiary)', x: 4 }} key={i} style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.6rem 0.8rem', borderRadius:'8px', cursor:'pointer' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: i===0?'rgba(16,185,129,0.1)':i===sorted.length-1?'rgba(239,68,68,0.1)':'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:'800', color: i===0?'#10B981':i===sorted.length-1?'#EF4444':'var(--text-muted)', flexShrink:0, boxShadow:'var(--shadow-sm)' }}>
              {i===0?'🏆':i+1}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'0.82rem', fontWeight:'700' }}>{s.name}</span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{s.score}%</span>
              </div>
              <div style={{ height:'4px', background:'var(--bg-secondary)', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{ width:`${s.score}%`, height:'100%', background: s.score>=80?'#10B981':s.score>=65?'#F59E0B':'#EF4444', borderRadius:'4px', transition:'width 1s ease' }}/>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── INSIGHTS PANEL ────────────────────────────────────────────
export function InsightsPanel({ insights, alerts, summary }) {
  // Generate smart insights from summary data so panel is never empty
  const generated = [];
  if (summary) {
    if (summary.vacantBeds > 0) generated.push({ type:'insight', message:`💡 ${summary.vacantBeds} beds are currently vacant. Run a promotional campaign or reduce pricing to boost occupancy.` });
    if (summary.occupancyRate < 70) generated.push({ type:'warning', message:`📉 Occupancy at ${summary.occupancyRate}% — below the healthy 70% threshold. Revenue impact: ₹${((100-summary.occupancyRate)/100 * summary.expectedMonthlyRevenue/1000).toFixed(0)}k/month.` });
    if (summary.pendingPaymentsCount > 0) generated.push({ type:'alert', message:`💸 ${summary.pendingPaymentsCount} tenants have pending rent totalling ₹${(summary.pendingPaymentsAmount/1000).toFixed(0)}k. Send payment reminders immediately.` });
    if (summary.renewalsPending > 0) generated.push({ type:'insight', message:`🔄 ${summary.renewalsPending} tenants have lease renewals pending this month. Follow up to prevent vacancies.` });
    if (summary.tenantsLeavingSoon > 0) generated.push({ type:'warning', message:`🚪 ${summary.tenantsLeavingSoon} tenants are scheduled to leave soon. Initiate retention outreach.` });
    if (summary.maintenanceRooms > 0) generated.push({ type:'alert', message:`🔧 ${summary.maintenanceRooms} rooms are under maintenance, affecting available bed count.` });
    if (summary.complaintsToday > 0) generated.push({ type:'insight', message:`⚠️ ${summary.complaintsToday} new complaint${summary.complaintsToday>1?'s':''} raised today. Review and assign resolution staff promptly.` });
    if (summary.healthScore >= 75) generated.push({ type:'positive', message:`✅ Property health score is ${summary.healthScore}/100 — Healthy! Keep up current occupancy and maintenance standards.` });
  }
  // Always add static operational insights
  generated.push({ type:'insight', message:'🍽️ Dinner complaints increased 30% this week. Review meal quality with kitchen staff.' });
  generated.push({ type:'alert', message:'🌡️ High electricity usage detected in Building A. Check AC units on Floor 3.' });

  const allInsights = [...(insights||[]).map(i => ({ ...i, _api:true })), ...(alerts||[]).map(a => ({ ...a, _api:true, _alert:true }))];
  const displayItems = allInsights.length > 0 ? allInsights : generated;

  const getStyle = (item) => {
    if (item._alert) return { bg: item.severity==='high'?'#FEE2E2':'#FFEDD5', border: item.severity==='high'?'#FCA5A5':'#FDBA74', text: item.severity==='high'?'#991B1B':'#C2410C' };
    if (item.type==='positive') return { bg:'#DCFCE7', border:'#6EE7B7', text:'#065F46' };
    if (item.type==='warning' || item.type==='alert') return { bg:'#FFEDD5', border:'#FDBA74', text:'#C2410C' };
    return { bg:'#FEF3C7', border:'#FCD34D', text:'#92400E' };
  };

  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <Lightbulb size={18} color="#F59E0B" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Smart Insights</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.72rem', background:'#FEF3C7', color:'#92400E', padding:'0.2rem 0.6rem', borderRadius:'100px', fontWeight:'700' }}>{displayItems.length} insights</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', maxHeight:'400px', overflowY:'auto' }}>
        {displayItems.map((item, i) => {
          const s = getStyle(item);
          const msg = item.message || item.msg || '';
          return (
            <div key={i} style={{ padding:'0.8rem', background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px' }}>
              <p style={{ fontSize:'0.82rem', color:s.text, fontWeight:'600', margin:0, lineHeight:'1.5' }}>{msg}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ACTIVITY FEED ─────────────────────────────────────────────
export function ActivityFeed() {
  const items = [
    { icon:'💰', text:'Rahul Sharma paid ₹6,500 rent', time:'8m ago', color:'#10B981' },
    { icon:'🔧', text:'Maintenance request in Room 204 resolved', time:'25m ago', color:'#2563EB' },
    { icon:'🚪', text:'Priya Verma checked in to Room 301-B', time:'1h ago', color:'#8B5CF6' },
    { icon:'⚠️', text:'AC complaint raised in Floor 2', time:'2h ago', color:'#EF4444' },
    { icon:'📄', text:'Agreement renewed for Amit Singh', time:'3h ago', color:'#F59E0B' },
    { icon:'🍽️', text:'Mess feedback: 4.2 stars for lunch', time:'4h ago', color:'#10B981' },
  ];
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <Bell size={18} color="#2563EB" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Live Activity Feed</h3>
        <span style={{ marginLeft:'auto', width:'8px', height:'8px', background:'#10B981', borderRadius:'50%', boxShadow:'0 0 6px #10B981' }}/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
        {items.map((item,i) => (
          <motion.div whileHover={{ x: 4, backgroundColor: 'var(--bg-tertiary)' }} key={i} style={{ display:'flex', gap:'0.8rem', padding:'0.6rem 0.8rem', borderRadius:'8px', cursor:'pointer' }}>
            <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{item.icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.82rem', fontWeight:'600', color:'var(--text-primary)', margin:0 }}>{item.text}</p>
              <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── DOCUMENT TRACKER ──────────────────────────────────────────
export function DocumentTracker() {
  const docs = [
    { label:'Expiring Agreements', count:3, color:'#EF4444', bg:'#FEE2E2' },
    { label:'Pending KYC', count:5, color:'#F59E0B', bg:'#FEF3C7' },
    { label:'Documents OK', count:38, color:'#10B981', bg:'#DCFCE7' },
  ];
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <FileText size={18} color="#6B7280" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Document Tracker</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {docs.map((d,i) => (
          <motion.div whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }} key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.9rem 1.1rem', background:d.bg, borderRadius:'12px', cursor:'pointer' }}>
            <span style={{ fontSize:'0.85rem', fontWeight:'700', color:d.color }}>{d.label}</span>
            <span style={{ fontSize:'1.2rem', fontWeight:'800', color:d.color }}>{d.count}</span>
          </motion.div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.2rem' }}>QUICK REPORTS</p>
        {['Revenue Report','Occupancy Report','Tenant List'].map((r,i) => (
          <button key={i} className="btn" style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'space-between', background:'var(--bg-tertiary)', fontSize:'0.8rem', padding:'0.5rem 0.8rem' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}><Download size={14}/> {r}</span>
            <ChevronRight size={14} color="var(--text-muted)"/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TENANT OVERVIEW ───────────────────────────────────────────
export function TenantOverviewPanel({ summary }) {
  if (!summary) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
        <Users size={18} color="#10B981" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800' }}>Tenant Overview</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
        {[
          { label:'Active Tenants', value:summary.occupiedBeds, color:'var(--text-primary)' },
          { label:'New This Month', value:`+${summary.newTenantsThisMonth}`, color:'#10B981' },
          { label:'Leaving Soon', value:summary.tenantsLeavingSoon, color:'#EF4444' },
          { label:'Renewals Pending', value:summary.renewalsPending, color:'#F59E0B' },
          { label:'Pending Payments', value:summary.pendingPaymentsCount, color:'#EF4444' },
        ].map((row,i) => (
          <motion.div whileHover={{ backgroundColor: 'var(--bg-tertiary)', x: 4 }} key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0.8rem', borderRadius:'8px', cursor:'pointer' }}>
            <span style={{ fontSize:'0.85rem', fontWeight:'600', color:'var(--text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize:'1rem', fontWeight:'800', color:row.color }}>{row.value}</span>
          </motion.div>
        ))}
      </div>
      <button className="btn" style={{ width:'100%', marginTop:'1rem', background:'var(--bg-tertiary)', fontSize:'0.82rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
        <ClipboardList size={14}/> View Defaulters List
      </button>
    </div>
  );
}
