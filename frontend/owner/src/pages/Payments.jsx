import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Bell, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 1, tenant: 'Rahul Sharma', room: '201-A', baseAmount: 6500, lateFee: 0, status: 'Success', date: 'Oct 02, 2023', invoice: 'INV-001' },
    { id: 2, tenant: 'Priya Verma', room: '202-B', baseAmount: 8500, lateFee: 500, status: 'Overdue', date: 'Sep 25, 2023', invoice: 'INV-002' },
    { id: 3, tenant: 'Amit Singh', room: '101-A', baseAmount: 5000, lateFee: 0, status: 'Pending', date: 'Oct 05, 2023', invoice: 'INV-003' },
    { id: 4, tenant: 'Sneha Kapur', room: '305-C', baseAmount: 7200, lateFee: 0, status: 'Pending', date: 'Oct 06, 2023', invoice: 'INV-004' },
    { id: 5, tenant: 'Vikram Patel', room: '401-D', baseAmount: 9000, lateFee: 1000, status: 'Overdue', date: 'Sep 10, 2023', invoice: 'INV-005' },
    { id: 6, tenant: 'Anjali Desai', room: '105-B', baseAmount: 6000, lateFee: 0, status: 'Success', date: 'Oct 01, 2023', invoice: 'INV-006' },
  ]);

  const totalCollected = payments.filter(p => p.status === 'Success').reduce((acc, curr) => acc + curr.baseAmount + curr.lateFee, 0);
  const pendingAmount = payments.filter(p => ['Pending', 'Overdue'].includes(p.status)).reduce((acc, curr) => acc + curr.baseAmount + curr.lateFee, 0);
  const overdueCount = payments.filter(p => p.status === 'Overdue').length;

  const handleSendReminder = (tenant) => {
    alert(`Payment reminder notification sent to ${tenant}.`);
  };

  const handleDownload = (invoice) => {
    alert(`Downloading receipt for ${invoice}...`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Success': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}><CheckCircle size={12}/> PAID</span>;
      case 'Pending': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}><Clock size={12}/> PENDING</span>;
      case 'Overdue': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)' }}><AlertTriangle size={12}/> OVERDUE</span>;
      default: return null;
    }
  };

  return (
    <div className="payments-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={32} color="var(--accent-primary)" /> Payments & Billing
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track revenue, manage tenant dues, and send reminders.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Filter size={16} /> Filters
           </button>
           <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Bell size={16} /> Bulk Reminders
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Total Collected (This Month)</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>₹{totalCollected.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Pending Expected</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>₹{pendingAmount.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-error)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Overdue Accounts</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-error)' }}>{overdueCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Transactions</h3>
           <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search tenant or room..." style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.85rem', minWidth: '250px' }} />
           </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.2rem' }}>Tenant Details</th>
              <th style={{ padding: '1.2rem' }}>Base Rent</th>
              <th style={{ padding: '1.2rem' }}>Late Fee</th>
              <th style={{ padding: '1.2rem' }}>Total Amount</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                <td style={{ padding: '1.2rem' }}>
                   <div>
                     <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{p.tenant}</p>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room {p.room} • Due: {p.date}</p>
                   </div>
                </td>
                <td style={{ padding: '1.2rem', color: 'var(--text-secondary)' }}>₹{p.baseAmount.toLocaleString()}</td>
                <td style={{ padding: '1.2rem' }}>
                   {p.lateFee > 0 ? (
                      <span style={{ color: 'var(--accent-error)', fontWeight: '600' }}>+₹{p.lateFee}</span>
                   ) : '-'}
                </td>
                <td style={{ padding: '1.2rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                   ₹{(p.baseAmount + p.lateFee).toLocaleString()}
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {getStatusBadge(p.status)}
                </td>
                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                     {p.status === 'Success' ? (
                       <button 
                         onClick={() => handleDownload(p.invoice)}
                         className="btn" 
                         title="Download Receipt"
                         style={{ padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                       >
                         <Download size={16} />
                       </button>
                     ) : (
                       <button 
                         onClick={() => handleSendReminder(p.tenant)}
                         className="btn" 
                         title="Send Reminder"
                         style={{ padding: '0.5rem', border: '1px solid var(--accent-warning)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}
                       >
                         <Bell size={16} />
                       </button>
                     )}
                     <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                        Details
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .table-row-hover:hover {
          background: rgba(0,0,0,0.01);
        }
      `}</style>
    </div>
  );
};
  
const Clock = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Payments;
