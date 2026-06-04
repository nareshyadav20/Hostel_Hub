import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Download, Bell, AlertTriangle, CheckCircle, Search, X,
  FileText, Smartphone, Banknote, Building2, TrendingUp, AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { api } from '../api';
import socket from '../utils/socket';

const METHOD_CONFIG = {
  'UPI': { icon: <Smartphone size={12} />, color: '#7C3AED', bg: '#EDE9FE', label: 'UPI / QR' },
  'Cash': { icon: <Banknote size={12} />, color: '#059669', bg: '#D1FAE5', label: 'Cash' },
  'Bank Transfer': { icon: <Building2 size={12} />, color: '#2563EB', bg: '#DBEAFE', label: 'Bank Transfer' },
};

const MethodBadge = ({ method }) => {
  const cfg = METHOD_CONFIG[method] || METHOD_CONFIG['Cash'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: cfg.bg, color: cfg.color  }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const getStatusBadge = (s) => {
  if (s === 'Paid' || s === 'Success') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16,185,129,0.1)', color: '#10B981'  }}><CheckCircle size={12} /> PAID</span>;
  if (s === 'Refunded') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6'  }}><CheckCircle size={12} /> REFUNDED</span>;
  if (s === 'Pending' || s === 'Due') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245,158,11,0.1)', color: '#F59E0B'  }}><AlertTriangle size={12} /> DUE</span>;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(239,68,68,0.1)', color: '#EF4444'  }}><AlertTriangle size={12} /> OVERDUE</span>;
};

const getTypeBadge = (type) => {
  if (type === 'Rent') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#DBEAFE', color: '#2563EB', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'  }}>RENT</span>;
  if (type === 'Mess') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#FEF3C7', color: '#D97706', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'  }}>MESS</span>;
  if (type === 'Deposit') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#E0E7FF', color: '#4338CA', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'  }}>DEPOSIT</span>;
  if (type === 'Refund') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#FCE7F3', color: '#DB2777', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'  }}>REFUND</span>;
  return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#F3F4F6', color: '#4B5563', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'  }}>{type}</span>;
}

const generateReceipt = (p) => {
  const html = `<!DOCTYPE html><html><head><title>Receipt ${p.invoice}</title>
  <style>body{font-family:Arial,sans-serif;max-width:500px;margin:40px auto;padding:2rem;border:2px solid #e5e7eb;border-radius:12px}
  h1{color:#2563eb;margin:0}h2{margin:0;font-size:1rem;color:#6b7280}.divider{border:none;border-top:1px solid #e5e7eb;margin:1rem 0}
  .row{display:flex;justify-content:space-between;margin:0.5rem 0;font-size:0.95rem}
  .total{font-size:1.2rem;font-weight:800;color:#059669}.footer{text-align:center;color:#9ca3af;font-size:0.8rem;margin-top:1.5rem}</style>
  </head><body>
  <h1>HostelHub</h1><p style="color:#6b7280;margin-top:0.25rem">Transaction Receipt</p>
  <hr class="divider"/>
  <div class="row"><span><b>${p.invoice}</b></span><span>${p.date}</span></div>
  <hr class="divider"/>
  <div class="row"><span>Tenant</span><span><b>${p.tenantName}</b></span></div>
  <div class="row"><span>Room</span><span>${p.room}</span></div>
  <div class="row"><span>Plan / Type</span><span>${p.category} ${p.type}</span></div>
  <div class="row"><span>Payment Mode</span><span>${p.method || 'N/A'}</span></div>
  <hr class="divider"/>
  <div class="row total"><span>Total Amount</span><span>₹${Math.abs(p.amount).toLocaleString()}</span></div>
  <hr class="divider"/>
  <p class="footer">Thank you for your payment · HostelHub Management System</p>
  </body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};

const Payments = () => {
  const { buildingId: urlBuildingId } = useParams();

  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [recordOpen, setRecordOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const [form, setForm] = useState({ tenantId: '', amount: '', type: 'Rent', method: 'UPI' });

  useEffect(() => {
    fetchData();
  }, [activeBuildingId]);

  // Real-time payment synchronization
  useEffect(() => {
    const handleNewPayment = (p) => {
      console.log("Real-time payment received:", p);
      // Check if payment belongs to this building
      if (p.buildingId && p.buildingId.toString() !== activeBuildingId?.toString()) {
        console.log("Payment belongs to different building:", p.buildingId);
        return;
      }

      setPayments(prev => {
        // Prevent duplicates
        const paymentId = p.id || p._id;
        if (prev.some(item => (item.id || item._id) === paymentId)) {
          console.log("Duplicate payment ignored:", paymentId);
          return prev;
        }

        // Enrich payment data using current tenants list
        const pTenant = p.tenantId;
        const tenantId = (pTenant && typeof pTenant === 'object') ? (pTenant.id || pTenant._id) : pTenant;
        const tObj = (pTenant && typeof pTenant === 'object') ? pTenant : (tenants.find(t => (t.id || t._id) === tenantId) || {});
        
        const enriched = {
          ...p,
          id: paymentId,
          tenantName: tObj.name || 'Unknown Tenant',
          room: tObj.room || 'N/A',
          // Use a consistent display date but keep the original date for sorting
          displayDate: p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          date: p.date || new Date().toISOString()
        };

        console.log("Adding enriched payment to list:", enriched);
        return [enriched, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    };

    socket.on('paymentAdded', handleNewPayment);
    socket.on('paymentCompleted', handleNewPayment);

    return () => {
      socket.off('paymentAdded', handleNewPayment);
      socket.off('paymentCompleted', handleNewPayment);
    };
  }, [activeBuildingId, tenants]);

  async function fetchData() {
    console.log("Payments module fetching for ID:", activeBuildingId);
    try {
      const [tData, pData] = await Promise.all([
        api.getTenants(activeBuildingId),
        api.getPayments(activeBuildingId)
      ]);

      // Server already filters by building, so no extra client filter needed.
      // Still normalize for safety:
      const filteredTenants = tData || [];

      setTenants(filteredTenants);

      // Enrich and filter payments
      const paymentsList = Array.isArray(pData) ? pData : (pData?.payments || []);
      const enriched = paymentsList
        .map(p => {
          // p.tenantId might be populated or an ID
          const pTenant = p.tenantId;
          const tId = (pTenant && typeof pTenant === 'object') ? (pTenant.id || pTenant._id) : pTenant;
          const tObj = (pTenant && typeof pTenant === 'object') ? pTenant : ((tData || []).find(t => (t.id || t._id) === tId) || {});
          return {
            ...p,
            id: p.id || p._id,
            tenantName: tObj.name || 'Unknown Tenant',
            room: tObj.room || 'N/A',
            displayDate: p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
          };
        });

      // Server already filtered payments by building, so use all enriched payments
      const buildingPayments = enriched;

      setPayments(buildingPayments.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Fetch error in Payments:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = payments.filter(p =>
    (p.tenantName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.room || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.invoice || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === 'Paid' && p.amount > 0).reduce((a, c) => a + c.amount, 0);
  const pendingDues = payments.filter(p => p.status === 'Pending' || p.status === 'Due').reduce((a, c) => a + c.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((a, c) => a + c.amount, 0);
  const overdueTenants = payments.filter(p => p.status === 'Overdue').length;

  const handleRecord = async (e) => {
    e.preventDefault();
    try {
      const tenant = tenants.find(t => (t.id || t._id) === form.tenantId) || {};
      const payload = {
        tenantId: form.tenantId,
        amount: form.type === 'Refund' ? -Math.abs(Number(form.amount)) : Number(form.amount),
        type: form.type,
        method: form.method,
        buildingId: activeBuildingId,
        status: 'Paid',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };

      const newPayment = await api.addPayment(payload);

      setPayments(prev => [{
        ...newPayment,
        tenantName: tenant.name || 'Unknown',
        room: tenant.room || 'N/A'
      }, ...prev]);

      setRecordOpen(false);
      setForm({ tenantId: '', amount: '', type: 'Rent', method: 'UPI' });
    } catch (err) {
      alert("Failed to record payment: " + (err.response?.data?.error || err.message));
    }
  };

  const iStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.9rem' };
  const modalBase = { position: 'fixed', top: '10%', left: '50%', x: '-50%', width: '90%', maxWidth: '520px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', maxHeight: '85vh', overflowY: 'auto' };

  // Chart Data preparation
  const monthlyData = [
    { name: 'Jan', revenue: 150000 },
    { name: 'Feb', revenue: 180000 },
    { name: 'Mar', revenue: totalRevenue > 0 ? totalRevenue : 220000 }
  ];
  const planData = [
    { name: 'Single', value: payments.filter(p => p.category === 'Single' && p.amount > 0).reduce((a, c) => a + c.amount, 0) || 50000 },
    { name: 'Shared', value: payments.filter(p => p.category === 'Shared' && p.amount > 0).reduce((a, c) => a + c.amount, 0) || 80000 },
    { name: 'Double', value: payments.filter(p => p.category === 'Double' && p.amount > 0).reduce((a, c) => a + c.amount, 0) || 60000 },
  ];
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

  if (loading) return <div style={{ padding: '2rem'  }}>Loading financial data...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out'  }}>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem'  }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem'  }}>
            <CreditCard size={32} color="var(--accent-primary)" /> Financial Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem'  }}>Advanced revenue tracking, analytics, and automated billing.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem'  }}>
          <button className="btn btn-primary" onClick={() => setRecordOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'  }}><CreditCard size={16} /> Record Transaction</button>
          <button className="btn" onClick={() => setBulkOpen(true)} style={{ border: '1px solid #F59E0B', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF3C7'  }}><Bell size={16} /> Bulk Reminders</button>
        </div>
      </header>

      {/* Dynamic Alerts */}
      {overdueTenants > 0 && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700'  }}>
          <AlertCircle size={20} />
          <span>Alert: You have {overdueTenants} overdue tenants amounting to ₹{overdueAmount.toLocaleString()}. Consider sending bulk reminders.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem'  }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981'  }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem'  }}>Total Revenue</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800'  }}>₹{totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6'  }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem'  }}>Deposits Holding</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#3B82F6'  }}>₹{payments.filter(p => p.type === 'Deposit').reduce((a, c) => a + c.amount, 0).toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B'  }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem'  }}>Pending Dues</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#D97706'  }}>₹{pendingDues.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444'  }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem'  }}>Overdue Amount</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#EF4444'  }}>₹{overdueAmount.toLocaleString()}</h2>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem'  }}>
        <div className="card" style={{ padding: '1.5rem'  }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'  }}><TrendingUp size={18} color="var(--accent-primary)" /> Monthly Revenue Trend</h3>
          <div style={{ height: '250px'  }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem'  }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem'  }}>Revenue by Plan</h3>
          <div style={{ height: '250px'  }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {planData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.8rem', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden'  }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)'  }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700'  }}>Tenant Transactions</h3>
          <div style={{ position: 'relative'  }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)'  }} />
            <input type="text" placeholder="Search tenant, room, or invoice..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.85rem', minWidth: '280px', color: 'var(--text-primary)', outline: 'none'  }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto'  }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap'  }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)'  }}>
                <th style={{ padding: '1.2rem'  }}>Tenant Name</th>
                <th style={{ padding: '1.2rem'  }}>Room / Bed</th>
                <th style={{ padding: '1.2rem'  }}>Plan / Type</th>
                <th style={{ padding: '1.2rem'  }}>Amount</th>
                <th style={{ padding: '1.2rem'  }}>Status</th>
                <th style={{ padding: '1.2rem'  }}>Date</th>
                <th style={{ padding: '1.2rem', textAlign: 'right'  }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s'  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.2rem'  }}>
                    <p style={{ fontWeight: '800', margin: 0  }}>{p.tenantName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px'  }}>{p.invoice}</p>
                  </td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-secondary)', fontWeight: '600'  }}>{p.room}</td>
                  <td style={{ padding: '1.2rem'  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start'  }}>
                      {getTypeBadge(p.type)}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600'  }}>{p.category}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem', fontWeight: '900', fontSize: '1.05rem', color: p.amount < 0 ? '#DB2777' : 'var(--text-primary)'  }}>
                    {p.amount < 0 ? `-₹${Math.abs(p.amount).toLocaleString()}` : `₹${p.amount.toLocaleString()}`}
                  </td>
                  <td style={{ padding: '1.2rem'  }}>{getStatusBadge(p.status)}</td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem'  }}>{p.displayDate || p.date}</td>
                  <td style={{ padding: '1.2rem', textAlign: 'right'  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'  }}>
                      {p.status === 'Paid' || p.status === 'Success' || p.status === 'Refunded' ? (
                        <button onClick={() => generateReceipt(p)} className="btn" title="Download Invoice"
                          style={{ padding: '0.45rem 0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '8px', cursor: 'pointer'  }}>
                          <Download size={14} /> Invoice
                        </button>
                      ) : (
                        <button onClick={async () => {
                          try {
                            await api.updatePaymentStatus(p.id, 'Paid');
                            setPayments(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Paid' } : item));
                          } catch (err) {
                            alert("Failed to update payment: " + err.message);
                          }
                        }} className="btn" title="Collect Rent"
                          style={{ padding: '0.45rem 0.8rem', border: 'none', background: '#10B981', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '8px', cursor: 'pointer'  }}>
                          <CheckCircle size={14} /> Collect
                        </button>
                      )}
                      <button onClick={() => setDetailsItem(p)} className="btn" title="View Details"
                        style={{ padding: '0.45rem', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', borderRadius: '8px', cursor: 'pointer'  }}>
                        <FileText size={16} color="var(--text-secondary)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)'  }}>No matching transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* ── DETAILS MODAL ── */}
        {detailsItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)'  }}
              onClick={() => setDetailsItem(null)} />
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} style={modalBase}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'  }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0  }}>Transaction Details</h2>
                <button onClick={() => setDetailsItem(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'  }}><X size={16} /></button>
              </div>

              {/* Status Banner */}
              <div style={{
                padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem',
                background: ['Paid', 'Success'].includes(detailsItem.status) ? '#DCFCE7' : detailsItem.status === 'Overdue' ? '#FEE2E2' : '#DBEAFE',
                border: `1px solid ${['Paid', 'Success'].includes(detailsItem.status) ? '#6EE7B7' : detailsItem.status === 'Overdue' ? '#FCA5A5' : '#BFDBFE'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '900', fontSize: '2rem', margin: 0,
                    color: ['Paid', 'Success'].includes(detailsItem.status) ? '#059669' : detailsItem.status === 'Overdue' ? '#DC2626' : '#2563EB'
                   }}>
                    ₹{Math.abs(detailsItem.amount).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase'  }}>{detailsItem.type} Amount</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'  }}>
                  {getStatusBadge(detailsItem.status)}
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)'  }}>{detailsItem.invoice}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="card" style={{ padding: '0', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden'  }}>
                {[
                  ['Date', detailsItem.displayDate || detailsItem.date],
                  ['Tenant', detailsItem.tenantName],
                  ['Room', detailsItem.room],
                  ['Type', detailsItem.type],
                  ['Plan/Category', detailsItem.category]
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)'  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600'  }}>{label}</span>
                    <span style={{ fontWeight: '800', fontSize: '0.9rem'  }}>{val}</span>
                  </div>
                ))}
                {/* Mode of Payment */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-tertiary)'  }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600'  }}>Payment Mode</span>
                  {detailsItem.method ? <MethodBadge method={detailsItem.method} /> : <span style={{ fontWeight: '700', color: 'var(--text-muted)'  }}>N/A</span>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2rem'  }}>
                {['Paid', 'Success', 'Refunded'].includes(detailsItem.status) ? (
                  <button onClick={() => generateReceipt(detailsItem)} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '700'  }}>
                    <Download size={18} /> Download Invoice
                  </button>
                ) : (
                  <button className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '700', background: '#FEF3C7', color: '#D97706', border: '1px solid #F59E0B'  }}>
                    <Bell size={18} /> Send Reminder
                  </button>
                )}
                <button onClick={() => setDetailsItem(null)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)'  }}>Close</button>
              </div>
            </motion.div>
          </>
        )}

        {/* ── RECORD PAYMENT MODAL ── */}
        {recordOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)'  }}
              onClick={() => setRecordOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={modalBase}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'  }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0  }}>Record Transaction</h2>
                <button onClick={() => setRecordOpen(false)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)'  }}><X size={16} /></button>
              </div>
              <form onSubmit={handleRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem'  }}>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block'  }}>Tenant</label>
                  <select value={form.tenantId} onChange={e => setForm({ ...form, tenantId: e.target.value })} style={iStyle} required>
                    <option value="">-- Select Tenant --</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Room {t.room})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'  }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block'  }}>Transaction Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={iStyle} required>
                      <option value="Rent">Rent Payment</option>
                      <option value="Mess">Mess Fee</option>
                      <option value="Deposit">Security Deposit</option>
                      <option value="Refund">Refund/Deduction</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block'  }}>Amount (₹)</label>
                    <input type="number" placeholder="e.g. 5000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={iStyle} required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block'  }}>Payment Mode</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem'  }}>
                    {['UPI', 'Cash', 'Bank Transfer'].map(m => (
                      <button key={m} type="button" onClick={() => setForm({ ...form, method: m })}
                        style={{ padding: '0.7rem', borderRadius: '8px', border: `2px solid ${form.method === m ? (METHOD_CONFIG[m].color) : 'var(--border-color)'}`, background: form.method === m ? METHOD_CONFIG[m].bg : 'var(--bg-tertiary)', color: form.method === m ? METHOD_CONFIG[m].color : 'var(--text-secondary)', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.15s' }}>
                        {METHOD_CONFIG[m].icon} {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem'  }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', fontWeight: '800'  }}>Confirm Transaction</button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* ── BULK REMINDERS MODAL ── */}
        {bulkOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)'  }}
              onClick={() => setBulkOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'fixed', top: '30%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'center'  }}>
              <Bell size={48} color="#F59E0B" style={{ marginBottom: '1.5rem', opacity: 0.7, margin: '0 auto'  }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem'  }}>Bulk Reminders</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem'  }}>Send SMS & Email reminders to all <b>{overdueTenants}</b> overdue accounts?</p>
              <div style={{ display: 'flex', gap: '1rem'  }}>
                <button className="btn btn-primary" onClick={() => setBulkOpen(false)} style={{ flex: 1, padding: '1rem', background: '#F59E0B', fontWeight: '800'  }}>Send All</button>
                <button className="btn" onClick={() => setBulkOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)'  }}>Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
