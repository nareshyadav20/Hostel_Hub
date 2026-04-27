import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, Bell, AlertTriangle, CheckCircle, Search, X, FileText, Smartphone, Banknote, Building2 } from 'lucide-react';

const METHOD_CONFIG = {
  'UPI':           { icon: <Smartphone size={12}/>, color: '#7C3AED', bg: '#EDE9FE', label: 'UPI / QR' },
  'Cash':          { icon: <Banknote size={12}/>,   color: '#059669', bg: '#D1FAE5', label: 'Cash'     },
  'Bank Transfer': { icon: <Building2 size={12}/>,  color: '#2563EB', bg: '#DBEAFE', label: 'Bank Transfer' },
};

const MethodBadge = ({ method }) => {
  const cfg = METHOD_CONFIG[method] || METHOD_CONFIG['Cash'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.3rem 0.65rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'700', background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const generateReceipt = (p) => {
  const total = p.baseAmount + p.lateFee;
  const html = `<!DOCTYPE html><html><head><title>Receipt ${p.invoice}</title>
  <style>body{font-family:Arial,sans-serif;max-width:500px;margin:40px auto;padding:2rem;border:2px solid #e5e7eb;border-radius:12px}
  h1{color:#2563eb;margin:0}h2{margin:0;font-size:1rem;color:#6b7280}.divider{border:none;border-top:1px solid #e5e7eb;margin:1rem 0}
  .row{display:flex;justify-content:space-between;margin:0.5rem 0;font-size:0.95rem}
  .total{font-size:1.2rem;font-weight:800;color:#059669}.footer{text-align:center;color:#9ca3af;font-size:0.8rem;margin-top:1.5rem}</style>
  </head><body>
  <h1>HostelHub</h1><p style="color:#6b7280;margin-top:0.25rem">Payment Receipt</p>
  <hr class="divider"/>
  <div class="row"><span><b>${p.invoice}</b></span><span>${p.date}</span></div>
  <hr class="divider"/>
  <div class="row"><span>Tenant</span><span><b>${p.tenant}</b></span></div>
  <div class="row"><span>Room</span><span>${p.room}</span></div>
  <div class="row"><span>Payment Mode</span><span>${p.method}</span></div>
  <hr class="divider"/>
  <div class="row"><span>Base Rent</span><span>₹${p.baseAmount.toLocaleString()}</span></div>
  ${p.lateFee > 0 ? `<div class="row"><span>Late Fee</span><span style="color:#ef4444">+₹${p.lateFee}</span></div>` : ''}
  <div class="row total"><span>Total Paid</span><span>₹${total.toLocaleString()}</span></div>
  <hr class="divider"/>
  <p class="footer">Thank you for your payment · HostelHub Management System</p>
  </body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};

const Clock = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const Payments = () => {
  const [payments, setPayments] = useState([
    { id:1, tenant:'Rahul Sharma',  room:'201-A', baseAmount:6500, lateFee:0,    status:'Success', date:'Oct 02, 2023', invoice:'INV-001', method:'UPI'           },
    { id:2, tenant:'Priya Verma',   room:'202-B', baseAmount:8500, lateFee:500,  status:'Overdue', date:'Sep 25, 2023', invoice:'INV-002', method:'Cash'          },
    { id:3, tenant:'Amit Singh',    room:'101-A', baseAmount:5000, lateFee:0,    status:'Pending', date:'Oct 05, 2023', invoice:'INV-003', method:'Bank Transfer'  },
    { id:4, tenant:'Sneha Kapur',   room:'305-C', baseAmount:7200, lateFee:0,    status:'Pending', date:'Oct 06, 2023', invoice:'INV-004', method:'UPI'           },
    { id:5, tenant:'Vikram Patel',  room:'401-D', baseAmount:9000, lateFee:1000, status:'Overdue', date:'Sep 10, 2023', invoice:'INV-005', method:'Cash'          },
    { id:6, tenant:'Anjali Desai',  room:'105-B', baseAmount:6000, lateFee:0,    status:'Success', date:'Oct 01, 2023', invoice:'INV-006', method:'Bank Transfer'  },
  ]);

  const [search, setSearch]             = useState('');
  const [recordOpen, setRecordOpen]     = useState(false);
  const [bulkOpen, setBulkOpen]         = useState(false);
  const [detailsItem, setDetailsItem]   = useState(null);
  const [remindItem, setRemindItem]     = useState(null);
  const [remindSent, setRemindSent]     = useState(false);
  const [form, setForm]                 = useState({ tenant:'', room:'', amount:'', method:'UPI' });

  const filtered = payments.filter(p =>
    p.tenant.toLowerCase().includes(search.toLowerCase()) ||
    p.room.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments.filter(p => p.status==='Success').reduce((a,c) => a+c.baseAmount+c.lateFee, 0);
  const pendingAmount  = payments.filter(p => ['Pending','Overdue'].includes(p.status)).reduce((a,c) => a+c.baseAmount+c.lateFee, 0);
  const overdueCount   = payments.filter(p => p.status==='Overdue').length;

  const handleRecord = (e) => {
    e.preventDefault();
    const np = { id: payments.length+1, tenant: form.tenant, room: form.room, baseAmount: parseInt(form.amount), lateFee: 0, status:'Success', date: new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}), invoice:`INV-00${payments.length+1}`, method: form.method };
    setPayments([np, ...payments]);
    setRecordOpen(false);
    setForm({ tenant:'', room:'', amount:'', method:'UPI' });
  };

  const getStatusBadge = (s) => {
    if (s==='Success') return <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.3rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'700', background:'rgba(16,185,129,0.1)', color:'#10B981' }}><CheckCircle size={12}/> PAID</span>;
    if (s==='Pending') return <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.3rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'700', background:'rgba(56,189,248,0.1)', color:'#0EA5E9' }}><Clock size={12}/> PENDING</span>;
    return <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.3rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'700', background:'rgba(239,68,68,0.1)', color:'#EF4444' }}><AlertTriangle size={12}/> OVERDUE</span>;
  };

  const iStyle = { padding:'0.8rem', borderRadius:'8px', border:'1px solid var(--border-color)', background:'var(--bg-tertiary)', color:'var(--text-primary)', width:'100%', outline:'none', fontSize:'0.9rem' };
  const modalBase = { position:'fixed', top:'10%', left:'50%', x:'-50%', width:'90%', maxWidth:'520px', background:'var(--bg-primary)', zIndex:1001, padding:'2rem', borderRadius:'24px', border:'1px solid var(--border-color)', maxHeight:'85vh', overflowY:'auto' };

  return (
    <div style={{ animation:'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <header style={{ marginBottom:'2.5rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2.2rem', fontWeight:'800', marginBottom:'0.4rem', letterSpacing:'-0.02em', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <CreditCard size={32} color="var(--accent-primary)"/> Payments & Billing
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1rem' }}>Track revenue, manage tenant dues, and send reminders.</p>
        </div>
        <div style={{ display:'flex', gap:'1rem' }}>
          <button className="btn btn-primary" onClick={() => setRecordOpen(true)} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><CreditCard size={16}/> Record Payment</button>
          <button className="btn" onClick={() => setBulkOpen(true)} style={{ border:'1px solid #F59E0B', color:'#F59E0B', display:'flex', alignItems:'center', gap:'0.5rem' }}><Bell size={16}/> Bulk Reminders</button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2.5rem' }}>
        <div className="card" style={{ padding:'1.5rem', borderLeft:'4px solid #10B981' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', fontWeight:'700', marginBottom:'0.5rem' }}>Total Collected</p>
          <h2 style={{ fontSize:'2.4rem', fontWeight:'800' }}>₹{totalCollected.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding:'1.5rem', borderLeft:'4px solid #8B5CF6' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', fontWeight:'700', marginBottom:'0.5rem' }}>Mess Revenue</p>
          <h2 style={{ fontSize:'2.4rem', fontWeight:'800', color: '#8B5CF6' }}>₹{(totalCollected * 0.15).toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding:'1.5rem', borderLeft:'4px solid #0EA5E9' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', fontWeight:'700', marginBottom:'0.5rem' }}>Pending Expected</p>
          <h2 style={{ fontSize:'2.4rem', fontWeight:'800' }}>₹{pendingAmount.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding:'1.5rem', borderLeft:'4px solid #EF4444' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', fontWeight:'700', marginBottom:'0.5rem' }}>Overdue Accounts</p>
          <h2 style={{ fontSize:'2.4rem', fontWeight:'800', color:'#EF4444' }}>{overdueCount}</h2>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-tertiary)' }}>
          <h3 style={{ fontSize:'1.1rem', fontWeight:'700' }}>Recent Transactions</h3>
          <div style={{ position:'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)' }}/>
            <input type="text" placeholder="Search tenant or room..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding:'0.6rem 1rem 0.6rem 2.5rem', borderRadius:'8px', border:'1px solid var(--border-color)', background:'var(--bg-primary)', fontSize:'0.85rem', minWidth:'250px', color:'var(--text-primary)', outline:'none' }}/>
          </div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
          <thead>
            <tr style={{ background:'var(--bg-primary)', borderBottom:'1px solid var(--border-color)', fontSize:'0.85rem', color:'var(--text-secondary)' }}>
              <th style={{ padding:'1.2rem' }}>Tenant Details</th>
              <th style={{ padding:'1.2rem' }}>Base Rent</th>
              <th style={{ padding:'1.2rem' }}>Late Fee</th>
              <th style={{ padding:'1.2rem' }}>Total</th>
              <th style={{ padding:'1.2rem' }}>Mode</th>
              <th style={{ padding:'1.2rem' }}>Status</th>
              <th style={{ padding:'1.2rem', textAlign:'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid var(--border-color)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'1.2rem' }}>
                  <p style={{ fontWeight:'700', margin:0 }}>{p.tenant}</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin:0 }}>Room {p.room} · {p.date} · <span style={{ color:'var(--text-secondary)' }}>{p.invoice}</span></p>
                </td>
                <td style={{ padding:'1.2rem', color:'var(--text-secondary)' }}>₹{p.baseAmount.toLocaleString()}</td>
                <td style={{ padding:'1.2rem' }}>{p.lateFee > 0 ? <span style={{ color:'#EF4444', fontWeight:'600' }}>+₹{p.lateFee}</span> : <span style={{ color:'var(--text-muted)' }}>—</span>}</td>
                <td style={{ padding:'1.2rem', fontWeight:'800', fontSize:'1.05rem' }}>₹{(p.baseAmount+p.lateFee).toLocaleString()}</td>
                <td style={{ padding:'1.2rem' }}><MethodBadge method={p.method}/></td>
                <td style={{ padding:'1.2rem' }}>{getStatusBadge(p.status)}</td>
                <td style={{ padding:'1.2rem', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
                    {p.status === 'Success' ? (
                      <button onClick={() => generateReceipt(p)} className="btn" title="Download Receipt"
                        style={{ padding:'0.45rem 0.8rem', border:'1px solid #10B981', background:'#DCFCE7', color:'#059669', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', fontWeight:'700', borderRadius:'8px', cursor:'pointer' }}>
                        <Download size={14}/> Receipt
                      </button>
                    ) : (
                      <button onClick={() => { setRemindSent(false); setRemindItem(p); }} className="btn" title="Send Reminder"
                        style={{ padding:'0.45rem 0.8rem', border:'1px solid #F59E0B', background:'#FEF3C7', color:'#B45309', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', fontWeight:'700', borderRadius:'8px', cursor:'pointer' }}>
                        <Bell size={14}/> Remind
                      </button>
                    )}
                    <button onClick={() => setDetailsItem(p)} className="btn"
                      style={{ padding:'0.45rem 0.8rem', border:'1px solid var(--border-color)', background:'var(--bg-tertiary)', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', fontWeight:'700', borderRadius:'8px', cursor:'pointer' }}>
                      <FileText size={14}/> Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" style={{ padding:'4rem', textAlign:'center', color:'var(--text-muted)' }}>No matching payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {/* ── DETAILS MODAL ── */}
        {detailsItem && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }}
              onClick={() => setDetailsItem(null)}/>
            <motion.div initial={{ y:40, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:40, opacity:0 }} style={modalBase}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h2 style={{ fontSize:'1.3rem', fontWeight:'800', margin:0 }}>Transaction Details</h2>
                <button onClick={() => setDetailsItem(null)} style={{ background:'var(--bg-tertiary)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)' }}><X size={16}/></button>
              </div>

              {/* Status Banner */}
              <div style={{ padding:'1rem', borderRadius:'12px', marginBottom:'1.5rem',
                background: detailsItem.status==='Success'?'#DCFCE7': detailsItem.status==='Overdue'?'#FEE2E2':'#DBEAFE',
                border: `1px solid ${detailsItem.status==='Success'?'#6EE7B7':detailsItem.status==='Overdue'?'#FCA5A5':'#BFDBFE'}`,
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontWeight:'800', fontSize:'1.5rem', margin:0,
                    color: detailsItem.status==='Success'?'#059669':detailsItem.status==='Overdue'?'#DC2626':'#2563EB' }}>
                    ₹{(detailsItem.baseAmount + detailsItem.lateFee).toLocaleString()}
                  </p>
                  <p style={{ fontSize:'0.82rem', margin:0, color:'var(--text-secondary)' }}>Total Amount</p>
                </div>
                {getStatusBadge(detailsItem.status)}
              </div>

              {/* Details Grid */}
              {[
                ['Invoice',       detailsItem.invoice],
                ['Date',          detailsItem.date],
                ['Tenant',        detailsItem.tenant],
                ['Room',          detailsItem.room],
                ['Base Rent',     `₹${detailsItem.baseAmount.toLocaleString()}`],
                ['Late Fee',      detailsItem.lateFee > 0 ? `+₹${detailsItem.lateFee}` : '—'],
              ].map(([label, val]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.8rem 0', borderBottom:'1px solid var(--border-color)' }}>
                  <span style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>{label}</span>
                  <span style={{ fontWeight:'700', fontSize:'0.9rem' }}>{val}</span>
                </div>
              ))}

              {/* Mode of Payment */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.8rem 0', borderBottom:'1px solid var(--border-color)' }}>
                <span style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>Payment Mode</span>
                <MethodBadge method={detailsItem.method}/>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:'0.8rem', marginTop:'1.5rem' }}>
                {detailsItem.status === 'Success' && (
                  <button onClick={() => generateReceipt(detailsItem)} className="btn btn-primary" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
                    <Download size={15}/> Download Receipt
                  </button>
                )}
                <button onClick={() => setDetailsItem(null)} className="btn" style={{ flex:1, border:'1px solid var(--border-color)' }}>Close</button>
              </div>
            </motion.div>
          </>
        )}

        {/* ── RECORD PAYMENT MODAL ── */}
        {recordOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }}
              onClick={() => setRecordOpen(false)}/>
            <motion.div initial={{ y:50, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:50, opacity:0 }} style={modalBase}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h2 style={{ fontSize:'1.3rem', fontWeight:'800', margin:0 }}>Record Offline Payment</h2>
                <button onClick={() => setRecordOpen(false)} style={{ background:'var(--bg-tertiary)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={16}/></button>
              </div>
              <form onSubmit={handleRecord} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <input placeholder="Tenant Name" value={form.tenant} onChange={e => setForm({...form, tenant:e.target.value})} style={iStyle} required/>
                <input placeholder="Room Number (e.g. 201-A)" value={form.room} onChange={e => setForm({...form, room:e.target.value})} style={iStyle} required/>
                <input type="number" placeholder="Amount Paid (₹)" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} style={iStyle} required/>
                <div>
                  <label style={{ fontSize:'0.82rem', fontWeight:'700', color:'var(--text-secondary)', marginBottom:'0.4rem', display:'block' }}>Payment Mode</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem' }}>
                    {['UPI','Cash','Bank Transfer'].map(m => (
                      <button key={m} type="button" onClick={() => setForm({...form, method:m})}
                        style={{ padding:'0.7rem', borderRadius:'8px', border:`2px solid ${form.method===m?(METHOD_CONFIG[m].color):'var(--border-color)'}`, background: form.method===m ? METHOD_CONFIG[m].bg : 'var(--bg-tertiary)', color: form.method===m ? METHOD_CONFIG[m].color : 'var(--text-secondary)', fontWeight:'700', fontSize:'0.82rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'all 0.15s' }}>
                        {METHOD_CONFIG[m].icon} {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:'1rem', marginTop:'0.5rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex:1, padding:'0.9rem' }}>Confirm Receipt</button>
                  <button className="btn" type="button" onClick={() => setRecordOpen(false)} style={{ flex:1, padding:'0.9rem', border:'1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* ── BULK REMINDERS MODAL ── */}
        {bulkOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }}
              onClick={() => setBulkOpen(false)}/>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              style={{ position:'fixed', top:'30%', left:'50%', x:'-50%', width:'90%', maxWidth:'400px', background:'var(--bg-primary)', zIndex:1001, padding:'2.5rem', borderRadius:'24px', border:'1px solid var(--border-color)', textAlign:'center' }}>
              <Bell size={48} color="#F59E0B" style={{ marginBottom:'1.5rem', opacity:0.7 }}/>
              <h2 style={{ fontSize:'1.4rem', fontWeight:'800', marginBottom:'1rem' }}>Bulk Reminders</h2>
              <p style={{ color:'var(--text-secondary)', marginBottom:'2rem' }}>Send SMS & Email reminders to all <b>{overdueCount}</b> overdue accounts?</p>
              <div style={{ display:'flex', gap:'1rem' }}>
                <button className="btn btn-primary" onClick={() => { setBulkOpen(false); }} style={{ flex:1, padding:'1rem', background:'#F59E0B' }}>Send All</button>
                <button className="btn" onClick={() => setBulkOpen(false)} style={{ flex:1, padding:'1rem', border:'1px solid var(--border-color)' }}>Cancel</button>
              </div>
            </motion.div>
          </>
        )}

        {/* ── REMIND MODAL ── */}
        {remindItem && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }}
              onClick={() => setRemindItem(null)}/>
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
              style={{ position:'fixed', top:'28%', left:'50%', x:'-50%', width:'90%', maxWidth:'420px', background:'var(--bg-primary)', zIndex:1001, padding:'2rem', borderRadius:'24px', border:'1px solid var(--border-color)', textAlign:'center' }}>
              <Bell size={40} color="#F59E0B" style={{ marginBottom:'1rem', opacity:0.85 }}/>
              {remindSent ? (
                <>
                  <h2 style={{ fontSize:'1.2rem', fontWeight:'800', marginBottom:'0.5rem', color:'#10B981' }}>✅ Reminder Sent!</h2>
                  <p style={{ color:'var(--text-secondary)', marginBottom:'1.5rem' }}>SMS & email reminder dispatched to <b>{remindItem.tenant}</b>.</p>
                  <button className="btn btn-primary" onClick={() => setRemindItem(null)} style={{ width:'100%', padding:'0.9rem' }}>Done</button>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize:'1.2rem', fontWeight:'800', marginBottom:'0.5rem' }}>Payment Reminder</h2>
                  <p style={{ color:'var(--text-secondary)', marginBottom:'0.3rem' }}>Tenant: <b>{remindItem.tenant}</b> · Room {remindItem.room}</p>
                  <p style={{ color:'#EF4444', fontWeight:'700', fontSize:'1.1rem', marginBottom:'1.5rem' }}>₹{(remindItem.baseAmount+remindItem.lateFee).toLocaleString()} due</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
                    <button className="btn" onClick={() => setRemindSent(true)}
                      style={{ padding:'0.9rem', border:'2px solid #F59E0B', background:'#FEF3C7', color:'#B45309', fontWeight:'800', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      <Bell size={16}/> Send Reminder (SMS & Email)
                    </button>
                    <button className="btn" onClick={() => {
                        setPayments(prev => prev.map(p => p.id === remindItem.id ? { ...p, status:'Success' } : p));
                        setRemindItem(null);
                      }}
                      style={{ padding:'0.9rem', border:'2px solid #10B981', background:'#DCFCE7', color:'#059669', fontWeight:'800', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      <CheckCircle size={16}/> Mark as Received
                    </button>
                    <button className="btn" onClick={() => setRemindItem(null)}
                      style={{ padding:'0.7rem', border:'1px solid var(--border-color)', borderRadius:'12px', cursor:'pointer', color:'var(--text-secondary)', fontWeight:'600' }}>Cancel</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
