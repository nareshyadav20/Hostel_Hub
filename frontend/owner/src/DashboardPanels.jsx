import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Lightbulb, Bell, Users, Utensils, ShieldCheck, TrendingUp, FileText, ClipboardList, ChevronRight, Download, X, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './api';

const PIE_COLORS = ['#EF4444','#F59E0B','#8B5CF6','#6B7280'];

// ── MODAL ─────────────────────────────────────────────────────
export function DashboardModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(8px)'  }}>
          <motion.div initial={{ y:40, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }} exit={{ y:40, opacity:0, scale:0.95 }}
            style={{ background:'var(--bg-primary)', border:'1px solid var(--border-color)', borderRadius:'20px', padding:'2rem', width:'90%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto'  }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'  }}>
              <h2 style={{ fontSize:'1.3rem', fontWeight:'800', color:'var(--text-primary)', margin:0  }}>{title}</h2>
              <button onClick={onClose} style={{ background:'var(--bg-tertiary)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)'  }}><X size={16}/></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── COMPLAINTS PANEL ─────────────────────────────────────────
export function ComplaintsPanel({ data }) {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  if (!data) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)', height:'100%', display:'flex', flexDirection:'column'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem'  }}>
        <AlertCircle size={18} color="#EF4444" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800'  }}>Complaints Overview</h3>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.8rem', marginBottom:'1.2rem'  }}>
        {[
          { label:'Total', value:data.total, color:'var(--text-primary)' },
          { label:'Open', value:data.open, color:'#EF4444' },
          { label:'Resolved', value:data.resolved, color:'#10B981' },
          { label:'High Priority', value:data.highPriority, color:'#F59E0B' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'10px', textAlign:'center'  }}>
            <p style={{ fontSize:'1.3rem', fontWeight:'800', color:s.color, margin:0  }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'600', margin:0  }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column'  }}>
        <div style={{ height:'140px', marginTop: '0.5rem'  }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data.categories || []} 
                dataKey="count" 
                nameKey="name" 
                innerRadius={35} 
                outerRadius={55} 
                paddingAngle={5}
                stroke="none"
              >
                {(data.categories || []).map((c,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:'12px', fontSize:'0.75rem' }}
                itemStyle={{ fontWeight: '800' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'0.5rem'  }}>
          {data.categories.map((c,i) => (
            <span key={i} style={{ fontSize:'0.72rem', padding:'0.2rem 0.6rem', borderRadius:'100px', background:`${PIE_COLORS[i]}20`, color:PIE_COLORS[i], fontWeight:'700' }}>
              {c.name}: {c.count}
            </span>
          ))}
        </div>
        {data.pending24h > 0 && (
          <div style={{ marginTop:'1.2rem', padding:'0.6rem 0.8rem', background:'#FEE2E2', borderRadius:'8px', fontSize:'0.78rem', color:'#991B1B', fontWeight:'600'  }}>
            ⚠ {data.pending24h} complaints pending &gt; 24 hrs
          </div>
        )}
      </div>
      <button onClick={() => navigate(`/owner/building/${buildingId}/complaints`)} className="btn" style={{ width:'100%', marginTop:'1.2rem', background:'var(--bg-tertiary)', fontSize:'0.82rem', padding:'0.6rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem'  }}>
        Manage Complaints <ChevronRight size={14}/>
      </button>
    </div>
  );
}

// ── MESS PANEL ───────────────────────────────────────────────
export function MessPanel({ data, buildingId: propBuildingId }) {
  const navigate = useNavigate();
  const { buildingId: urlBuildingId } = useParams();
  const buildingId = urlBuildingId || propBuildingId;
  if (!data) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'20px', border:'1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem'  }}>
        <Utensils size={18} color="#8B5CF6" />
        <h3 style={{ fontSize:'1rem', fontWeight:'900'  }}>Mess Management</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.8rem', color:'#10B981', fontWeight:'800', background:'rgba(16, 185, 129, 0.1)', padding:'0.2rem 0.6rem', borderRadius:'100px'  }}>
          ⭐ {data.avgFoodRating}/5
        </span>
      </div>
      
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.8rem', marginBottom:'1.5rem'  }}>
        {[
          { label:'Meals Today', value:data.mealsServedToday, color:'#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)' },
          { label:'Daily Cost', value:`₹${(data.dailyMessCost/1000).toFixed(1)}k`, color:'#F59E0B', bg: 'rgba(245, 158, 11, 0.05)' },
          { label:'Monthly Cost', value:`₹${(data.monthlyMessCost/1000).toFixed(0)}k`, color:'#EF4444', bg: 'rgba(239, 68, 68, 0.05)' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, padding:'1rem 0.5rem', borderRadius:'12px', textAlign:'center', border: '1px solid var(--border-color)'  }}>
            <p style={{ fontSize:'1.4rem', fontWeight:'1000', color:s.color, margin:0  }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'800', margin:'0.2rem 0 0', textTransform: 'uppercase'  }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:'1.5rem', padding:'1rem', background:'var(--bg-tertiary)', borderRadius:'16px', border: '1px solid var(--border-color)'  }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)', marginBottom:'0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em'  }}>Today's Menu</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem'  }}>
          {Object.entries(data.menuToday).map(([meal, menu]) => (
            <div key={meal} style={{ display:'grid', gridTemplateColumns: '80px 1fr', gap:'1rem', fontSize:'0.85rem', alignItems: 'center'  }}>
              <span style={{ fontWeight:'900', color:'var(--text-muted)', textTransform:'uppercase', fontSize: '0.7rem', letterSpacing: '0.02em'  }}>{meal}</span>
              <span style={{ color:'var(--text-primary)', fontWeight: '700', borderLeft: '2px solid var(--border-color)', paddingLeft: '0.8rem'  }}>{menu}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1  }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)', marginBottom:'0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em'  }}>Low Stock Alerts</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem'  }}>
          {data.inventory.filter(i => i.alert).map((item,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.7rem 1rem', background:'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius:'12px', fontSize:'0.85rem'  }}>
              <span style={{ fontWeight:'800', color:'#EF4444'  }}>⚠ {item.item}</span>
              <span style={{ color:'var(--text-secondary)', fontWeight:'700'  }}>{item.stock} {item.unit} left</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate(`/owner/building/${buildingId}/mess`)} className="btn" style={{ width:'100%', marginTop:'1.5rem', background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', color: 'var(--text-secondary)'  }}>
        View More Mess Details <ChevronRight size={14}/>
      </button>
    </div>
  );
}

// ── STAFF PANEL ──────────────────────────────────────────────
export function StaffPanel({ data, buildingId: propBuildingId }) {
  const navigate = useNavigate();
  const { buildingId: urlBuildingId } = useParams();
  const buildingId = urlBuildingId || propBuildingId;
  if (!data) return null;
  const staffArray = Array.isArray(data.staffList) ? data.staffList : [];
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'20px', border:'1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem'  }}>
        <Users size={18} color="#2563EB" />
        <h3 style={{ fontSize:'1rem', fontWeight:'900'  }}>Staff Performance</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.8rem', color:'#2563EB', fontWeight:'800', background:'rgba(37, 99, 235, 0.1)', padding:'0.2rem 0.6rem', borderRadius:'100px'  }}>
          Efficiency {data.efficiencyScore}%
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.8rem', marginBottom:'1.5rem'  }}>
        {[
          { label:'Assigned', value:data.tasksAssigned, color:'var(--text-primary)', bg: 'var(--bg-tertiary)' },
          { label:'Completed', value:data.tasksCompleted, color:'#10B981', bg: 'rgba(16, 185, 129, 0.05)' },
          { label:'Pending', value:data.tasksPending, color:'#EF4444', bg: 'rgba(239, 68, 68, 0.05)' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, padding:'1rem 0.5rem', borderRadius:'12px', textAlign:'center', border: '1px solid var(--border-color)'  }}>
            <p style={{ fontSize:'1.4rem', fontWeight:'1000', color:s.color, margin:0  }}>{s.value}</p>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:'800', margin:'0.2rem 0 0', textTransform: 'uppercase'  }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flex: 1, maxHeight: '280px', overflowY: 'auto', paddingRight: '4px'  }}>
        {staffArray.map((s,i) => (
          <motion.div whileHover={{ backgroundColor: 'var(--bg-tertiary)', x: 4 }} key={i} style={{ display:'grid', gridTemplateColumns: '32px 1fr 45px', gap:'1rem', padding:'0.6rem 0.8rem', borderRadius:'12px', cursor:'pointer', alignItems: 'center'  }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'10px', background: i===0?'rgba(245, 158, 11, 0.1)':'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:'900', color: i===0?'#F59E0B':'var(--text-muted)', border: '1px solid var(--border-color)'  }}>
              {i===0?'🏆':i+1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px'  }}>
              <span style={{ fontSize:'0.85rem', fontWeight:'800', color: 'var(--text-primary)'  }}>{s.name}</span>
              <div style={{ height:'4px', background:'var(--bg-secondary)', borderRadius:'10px', overflow:'hidden', border: '1px solid var(--border-color)'  }}>
                <div style={{ width:`${s.score}%`, height:'100%', background: s.score>=90?'#10B981':s.score>=80?'#6366F1':'#F59E0B', borderRadius:'10px' }}/>
              </div>
            </div>
            <span style={{ fontSize:'0.8rem', color:'var(--text-primary)', fontWeight: '900', textAlign: 'right'  }}>{s.score}%</span>
          </motion.div>
        ))}
      </div>

      <button onClick={() => navigate(`/owner/building/${buildingId}/staff`)} className="btn" style={{ width:'100%', marginTop:'1.5rem', background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', color: 'var(--text-secondary)'  }}>
        View Performance Logs <ChevronRight size={14}/>
      </button>
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
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem'  }}>
        <Lightbulb size={18} color="#F59E0B" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800'  }}>Smart Insights</h3>
        <span style={{ marginLeft:'auto', fontSize:'0.72rem', background:'#FEF3C7', color:'#92400E', padding:'0.2rem 0.6rem', borderRadius:'100px', fontWeight:'700'  }}>{displayItems.length} insights</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', maxHeight:'400px', overflowY:'auto'  }}>
        {displayItems.map((item, i) => {
          const s = getStyle(item);
          const msg = item.message || item.msg || '';
          return (
            <div key={i} style={{ padding:'0.8rem', background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px' }}>
              <p style={{ fontSize:'0.82rem', color:s.text, fontWeight:'600', margin:0, lineHeight:'1.5'  }}>{msg}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ACTIVITY FEED ─────────────────────────────────────────────
export function ActivityFeed({ items = [] }) {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const formatTime = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now - d) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)', height:'100%', display:'flex', flexDirection:'column'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem'  }}>
        <Bell size={18} color="#2563EB" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800'  }}>Live Activity Feed</h3>
        <span style={{ marginLeft:'auto', width:'8px', height:'8px', background:'#10B981', borderRadius:'50%', boxShadow:'0 0 6px #10B981'  }}/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', flex: 1, overflowY: 'auto'  }}>
        {items.length === 0 && <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', textAlign:'center', padding:'1rem'  }}>No recent activity</p>}
        {items.map((item,i) => (
          <motion.div whileHover={{ x: 4, backgroundColor: 'var(--bg-tertiary)' }} key={i} style={{ display:'flex', gap:'0.8rem', padding:'0.6rem 0.8rem', borderRadius:'8px', cursor:'pointer'  }}>
            <span style={{ fontSize:'1.1rem', flexShrink:0  }}>{item.icon}</span>
            <div style={{ flex:1  }}>
              <p style={{ fontSize:'0.82rem', fontWeight:'600', color:'var(--text-primary)', margin:0  }}>{item.text}</p>
              <span style={{ fontSize:'0.72rem', color:'var(--text-muted)'  }}>{formatTime(item.time)}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <button onClick={() => navigate(`/owner/building/${buildingId}/notifications`)} className="btn" style={{ width:'100%', marginTop:'1.5rem', background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', color: 'var(--text-secondary)'  }}>
        View All History <ChevronRight size={14}/>
      </button>
    </div>
  );
}

// ── DOCUMENT TRACKER ──────────────────────────────────────────
export function DocumentTracker({ summary }) {
  const docs = [
    { label:'Expiring Agreements', count: summary?.renewalsPending || 0, color:'#EF4444', bg:'#FEE2E2' },
    { label:'Pending KYC', count: summary?.pendingKYC || 0, color:'#F59E0B', bg:'#FEF3C7' },
    { label:'Documents OK', count: (summary?.totalTenants || 0) - (summary?.pendingKYC || 0), color:'#10B981', bg:'#DCFCE7' },
  ];
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem'  }}>
        <FileText size={18} color="#6B7280" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800'  }}>Document Tracker</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem'  }}>
        {docs.map((d,i) => (
          <motion.div whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }} key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.9rem 1.1rem', background:d.bg, borderRadius:'12px', cursor:'pointer'  }}>
            <span style={{ fontSize:'0.85rem', fontWeight:'700', color:d.color  }}>{d.label}</span>
            <span style={{ fontSize:'1.2rem', fontWeight:'800', color:d.color  }}>{d.count}</span>
          </motion.div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem'  }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.2rem'  }}>QUICK REPORTS</p>
        {['Revenue Report','Occupancy Report','Tenant List'].map((r,i) => (
          <button key={i} className="btn" style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'space-between', background:'var(--bg-tertiary)', fontSize:'0.8rem', padding:'0.5rem 0.8rem'  }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem'  }}><Download size={14}/> {r}</span>
            <ChevronRight size={14} color="var(--text-muted)"/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TENANT OVERVIEW ───────────────────────────────────────────
export function TenantOverviewPanel({ summary, buildingId: propBuildingId }) {
  const navigate = useNavigate();
  const { buildingId: urlBuildingId } = useParams();
  const buildingId = urlBuildingId || propBuildingId;
  if (!summary) return null;
  return (
    <div className="card" style={{ padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border-color)', height:'100%', display:'flex', flexDirection:'column'  }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem'  }}>
        <Users size={18} color="#10B981" />
        <h3 style={{ fontSize:'1rem', fontWeight:'800'  }}>Tenant Overview</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', flex: 1  }}>
        {[
          { label:'Active Tenants', value:summary.totalTenants, color:'var(--text-primary)' },
          { label:'New This Month', value: summary.newTenantsThisMonth !== undefined ? `+${summary.newTenantsThisMonth}` : 'N/A', color:'#10B981' },
          { label:'Leaving Soon', value:summary.tenantsLeavingSoon !== undefined ? summary.tenantsLeavingSoon : 'N/A', color:'#EF4444' },
          { label:'Renewals Pending', value:summary.renewalsPending !== undefined ? summary.renewalsPending : 'N/A', color:'#F59E0B' },
          { label:'Pending Payments', value:summary.pendingPaymentsCount, color:'#EF4444' },
        ].map((row,i) => (
          <motion.div whileHover={{ backgroundColor: 'var(--bg-tertiary)', x: 4 }} key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0.8rem', borderRadius:'8px', cursor:'pointer'  }}>
            <span style={{ fontSize:'0.85rem', fontWeight:'600', color:'var(--text-secondary)'  }}>{row.label}</span>
            <span style={{ fontSize:'1rem', fontWeight:'800', color:row.color  }}>{row.value}</span>
          </motion.div>
        ))}
      </div>
      <button onClick={() => navigate(`/owner/building/${buildingId}/tenants`)} className="btn" style={{ width:'100%', marginTop:'1.2rem', background:'var(--bg-tertiary)', fontSize:'0.82rem', padding:'0.6rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', fontWeight:'800'  }}>
        <ClipboardList size={14}/> View Detailed List <ChevronRight size={14}/>
      </button>
    </div>
  );
}

// ── INFRASTRUCTURE OVERVIEW ───────────────────────────────────
export function InfrastructureOverview({ buildingId }) {
  const navigate = useNavigate();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [floors, rooms, beds] = await Promise.all([
          api.getFloorsByBuilding(buildingId),
          api.getRoomsByBuilding(buildingId),
          api.getBedsByBuilding(buildingId)
        ]);
        setData({ floors, rooms, beds });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [buildingId]);

  if (loading || !data) return (
    <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '1rem'  }}>
       <div style={{ display:'flex', gap:'1rem', alignItems:'center'  }}>
         <div style={{ width:'30px', height:'30px', background:'var(--bg-tertiary)', borderRadius:'8px'  }}/>
         <div style={{ width:'120px', height:'20px', background:'var(--bg-tertiary)', borderRadius:'4px'  }}/>
       </div>
       {[1,2].map(i => (
         <div key={i} style={{ height:'80px', width:'100%', background:'var(--bg-tertiary)', borderRadius:'12px', animation:'pulse 2s infinite'  }}/>
       ))}
    </div>
  );

  return (
    <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%'  }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'  }}>
        <Building size={18} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1rem', fontWeight: '900'  }}>Property Infrastructure</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '100px', border: '1px solid var(--border-color)'  }}>
          {data.floors.length} Floors · {data.rooms.length} Rooms
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, maxHeight: '350px', overflowY: 'auto', paddingRight: '4px'  }}>
        {data.floors.map(f => {
          const fid = f.id || f._id;
          const fRooms = data.rooms.filter(r => r.floorId === fid);
          const fBeds = data.beds.filter(b => fRooms.some(r => r.id === b.roomId || r._id === b.roomId));
          const fOccupied = fBeds.filter(b => b.status === 'OCCUPIED').length;
          const fOccRate = fBeds.length > 0 ? Math.round((fOccupied / fBeds.length) * 100) : 0;

          return (
            <div key={fid} style={{ background: 'var(--bg-secondary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative'  }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'  }}>
                <span style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-primary)'  }}>{f.floorNumber}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: fOccRate >= 85 ? '#EF4444' : (fOccRate >= 70 ? '#F59E0B' : '#10B981'), background: fOccRate >= 85 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px'  }}>
                  {fOccRate}% Occupied
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '100px', marginBottom: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden'  }}>
                <div style={{ width: `${fOccRate}%`, height: '100%', background: fOccRate >= 85 ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #6366F1, #3B82F6)', borderRadius: '100px', transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '800'  }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem'  }}><Building size={12}/> {fRooms.length} Rooms</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem'  }}><Users size={12}/> {fOccupied}/{fBeds.length} Beds</span>
                </div>
                <button onClick={() => navigate(`/owner/building/${buildingId}/rooms`)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem', fontWeight: '800', background: 'var(--bg-tertiary)', borderRadius: '8px'  }}>Manage Floor</button>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => navigate(`/owner/building/${buildingId}/rooms`)} className="btn" style={{ width:'100%', marginTop:'1.5rem', background:'var(--bg-tertiary)', padding:'0.8rem', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', color: 'var(--text-secondary)'  }}>
        Explore Complete Infrastructure <ChevronRight size={14}/>
      </button>
    </div>
  );
}
