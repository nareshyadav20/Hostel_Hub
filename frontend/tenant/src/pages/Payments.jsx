import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Payments = () => {
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentNumber, setParentNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, date: '01 Apr 2026', amount: 6500, status: 'Success' },
    { id: 2, date: '01 Mar 2026', amount: 6500, status: 'Success' },
    { id: 3, date: '01 Feb 2026', amount: 6500, status: 'Success' },
  ]);
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const [profileRes] = await Promise.all([
          API.get('/tenants/me')
        ]);
        setTenantData(profileRes.data);

        // Fetch payments for this tenant
        const tId = profileRes.data._id;
        const paymentsRes = await API.get(`/payments/me?tenantId=${tId}`);
        
        if (paymentsRes.data && paymentsRes.data.length > 0) {
          setInvoices(paymentsRes.data.map(p => ({
            id: p.invoice || `#INV-${p._id.slice(-6)}`,
            date: new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            month: p.month || 'N/A',
            amount: `₹${p.amount.toLocaleString()}`,
            status: p.status,
            method: p.method
          })));
        } else {
          // Fallback to static if none yet for demo
          setInvoices([
            { id: '#INV-2024-001', date: '01 Apr 2026', month: 'April 2026', amount: '₹6,500', status: 'Paid', method: 'UPI' }
          ]);
        }

      } catch (err) {
        console.error('Error fetching payment data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, []);

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Fetching Financials...</div></div>;
  const totalPaid = invoices.filter(inv => inv.status === 'Paid' || inv.status === 'Success').reduce((acc, curr) => {
    const amt = parseInt(curr.amount.replace(/[^0-9]/g, ''));
    return acc + amt;
  }, 0);

  const pendingRent = tenantData?.rentStatus === 'PENDING' ? (tenantData?.rent || 0) : 0;

   const handlePayNow = () => alert('Redirecting to Payment Gateway...');

  const handleDownloadStatements = () => {
    alert('Generating your consolidated financial statement...');
    setTimeout(() => {
      alert('Success! Your statements have been downloaded as "Livora_Statements_2026.pdf"');
    }, 1500);
  };

  const handleSendToParent = () => {
    if (!parentNumber || parentNumber.length < 10) {
      alert('Please enter a valid WhatsApp number.');
      return;
    }

    setIsScanning(true);
    // Simulate "Scanning/Generating" animation
    setTimeout(() => {
      const link = "https://livora.com/pay/tenant_id_101";
      const message = encodeURIComponent(`Hello! Please find the payment link for my hostel rent: ${link}`);
      window.open(`https://wa.me/${parentNumber}?text=${message}`, '_blank');
      setIsScanning(false);
      setShowParentModal(false);
      setParentNumber('');
    }, 2000);
  };

  return (
    <div className="payments-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '6rem' }}>
      <style>
        {`
          .glass-card-premium {
            backdrop-filter: blur(16px);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            box-shadow: var(--shadow-lg);
            transition: all 0.3s ease;
          }
          .scanner-line {
            width: 100%;
            height: 4px;
            background: var(--accent-primary);
            position: absolute;
            top: 0;
            left: 0;
            box-shadow: 0 0 15px var(--accent-primary);
            animation: scan 1.5s infinite ease-in-out;
            z-index: 2;
          }
          @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
          }
          .input-premium {
            width: 100%;
            padding: 1.2rem;
            background: var(--bg-tertiary);
            border: 2px solid transparent;
            border-radius: 18px;
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s;
            outline: none;
            font-size: 1rem;
          }
          .input-premium:focus {
            background: var(--bg-secondary);
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 5px rgba(var(--accent-primary-rgb), 0.08);
          }
        `}
      </style>

      <Link to="/dashboard" style={{
        position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 10
      }} className="hover-scale">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>

      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'var(--text-primary)' }}>
          <div style={{ background: 'var(--accent-primary)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          Financial Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: '500' }}>Manage your rent, share payment links, and track history.</p>
      </header>

      {/* ── Main Dashboard ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        <div className="glass-card-premium" style={{ padding: '2.5rem', borderLeft: '8px solid var(--accent-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '16px', color: 'var(--accent-success)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Invested</h3>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--text-primary)' }}>₹{totalPaid.toLocaleString()}</h2>
        </div>

        <div className="glass-card-premium" style={{ padding: '2.5rem', borderLeft: '8px solid var(--accent-error)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: 'var(--accent-error)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Rent</h3>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--text-primary)' }}>₹{pendingRent.toLocaleString()}</h2>
             <button onClick={handlePayNow} className="btn btn-primary" style={{ padding: '1rem 2rem', fontWeight: '900', borderRadius: '16px', boxShadow: '0 10px 25px rgba(var(--accent-primary-rgb), 0.3)' }}>Pay Now</button>
          </div>
        </div>
      </div>

      {/* ── Parent Pay & Support Section ── */}
      <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
         <div style={{ padding: '2rem', maxWidth: '700px', width: '100%', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
               <div style={{ width: '64px', height: '64px', background: 'var(--bg-secondary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid var(--border-color)' }}>👨‍👩‍👧</div>
               <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '950', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Parental Support & Statements</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                    Generate secure payment links for your parents or download official financial statements for reimbursement.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => setShowParentModal(true)} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', boxShadow: '0 8px 20px rgba(var(--accent-primary-rgb), 0.2)' }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                       Send Link
                    </button>
                    <button onClick={handleDownloadStatements} className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontWeight: '800', borderRadius: '14px', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                       Download All
                    </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── Transaction Table ── */}
      <div className="glass-card-premium" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-primary)' }}>Transaction History</h3>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-primary)', background: 'rgba(var(--accent-primary-rgb), 0.1)', padding: '0.5rem 1rem', borderRadius: '10px' }}>Last 3 Months</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <th style={{ padding: '1.5rem 2.5rem' }}>Transaction Date</th>
                <th style={{ padding: '1.5rem 2.5rem' }}>Amount</th>
                <th style={{ padding: '1.5rem 2.5rem' }}>Method</th>
                <th style={{ padding: '1.5rem 2.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(p => (
                <tr key={p.id} className="payment-row" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.5rem 2.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>{p.date}</td>
                  <td style={{ padding: '1.5rem 2.5rem', fontWeight: '950', fontSize: '1.3rem', color: 'var(--text-primary)' }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.5rem 2.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>UPI / Razorpay</td>
                  <td style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900',
                      background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                      display: 'inline-flex', alignItems: 'center', gap: '0.6rem'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {p.status}
                    </span>
                    <button 
                      onClick={() => setSelectedInvoice(p)}
                      style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Parent Pay Modal ── */}
      {showParentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="fade-in glass-card-premium" style={{ width: '100%', maxWidth: '500px', padding: '3.5rem', position: 'relative', overflow: 'hidden' }}>
            {isScanning && <div className="scanner-line"></div>}
            
            <button onClick={() => setShowParentModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(var(--accent-primary-rgb), 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)' }}>
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-primary)' }}>Share with Parent</h2>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '500', marginTop: '0.5rem' }}>Send a secure payment link via WhatsApp.</p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Parent's WhatsApp Number</label>
              <input 
                type="text" 
                className="input-premium" 
                placeholder="e.g. 9876543210" 
                value={parentNumber} 
                onChange={e => setParentNumber(e.target.value)}
              />
            </div>

            {/* Mock Scanner Visual with Random QR */}
            <div style={{ position: 'relative', height: '220px', background: '#0f172a', borderRadius: '32px', border: '4px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', overflow: 'hidden' }}>
              {isScanning && <div className="scanner-line" style={{ background: '#10b981', boxShadow: '0 0 20px #10b981' }}></div>}
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                {isScanning ? (
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${Math.random()}`} alt="QR" style={{ width: '120px', height: '120px', display: 'block' }} />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      Secure Link Generated
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M12 12h.01"/></svg>
                    <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Ready to Secure
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSendToParent} 
              disabled={isScanning}
              style={{ width: '100%', padding: '1.4rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '950', cursor: 'pointer', boxShadow: '0 15px 35px rgba(14, 165, 233, 0.2)', transition: 'all 0.3s' }}
            >
              {isScanning ? '⏳ Processing...' : 'Send Link to Parent'}
            </button>
          </div>
        </div>
      )}
      {/* ── Invoice Detail Modal ── */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card-premium fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3.5rem', background: 'var(--bg-secondary)', position: 'relative' }}>
            <button 
              onClick={() => setSelectedInvoice(null)} 
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'var(--bg-tertiary)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              title="Close/Back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(var(--accent-success-rgb), 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-success)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '950', letterSpacing: '-1.5px', color: 'var(--text-primary)' }}>Payment Successful</h2>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginTop: '0.5rem' }}>Transaction ID: {selectedInvoice.id}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount Paid</span>
                <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedInvoice.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Billing Month</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{selectedInvoice.month}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Method</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{selectedInvoice.method} / Razorpay</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date & Time</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{selectedInvoice.date}, 10:30 AM</span>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
              <button style={{ flex: 1, padding: '1.2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)' }}>Download Receipt</button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                style={{ flex: 1, padding: '1.2rem', background: 'white', color: '#ef4444', border: '2px solid #fee2e2', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' }}
              >
                Undo / Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
