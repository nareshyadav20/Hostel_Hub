import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Payments.css';
import { jsPDF } from 'jspdf';

const Payments = () => {
  const navigate = useNavigate();
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentNumber, setParentNumber] = useState('');
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const downloadInvoicePDF = (invoice) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [99, 102, 241]; 
    const secondaryColor = [30, 41, 59]; 
    const lightGrey = [241, 245, 249]; 
    const darkGrey = [100, 116, 139]; 

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('LIVORA HOSTEL HUB', 20, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Premium Resident Living Services', 20, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INVOICE', 190, 25, { align: 'right' });

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Provider Details:', 20, 52);
    doc.setFont('helvetica', 'normal');
    doc.text('Livora Living Solutions Pvt. Ltd.', 20, 57);
    doc.text('Koramangala 4th Block, Bengaluru', 20, 62);
    doc.text('GSTIN: 29AAFCL7429L1Z5', 20, 67);
    doc.text('Contact: warden@livora.com', 20, 72);

    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 120, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(tenantData?.name || 'Resident Name', 120, 57);
    doc.text(tenantData?.email || 'Resident Email', 120, 62);
    doc.text(`Phone: ${tenantData?.phone || 'N/A'}`, 120, 67);
    doc.text(`Status: ${invoice.status}`, 120, 72);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date:', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.date, 50, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Transaction ID:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.id, 50, 95);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status:', 120, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.status, 155, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', 120, 95);
    doc.setFont('helvetica', 'normal');
    doc.text('Online Transaction', 155, 95);

    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(20, 105, 170, 10, 'F');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, 111);
    doc.text('Qty', 135, 111, { align: 'right' });
    doc.text('Rate', 160, 111, { align: 'right' });
    doc.text('Amount', 185, 111, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text(invoice.id.startsWith('BKG-') ? 'Hostel Room Booking Deposit' : 'Monthly Rent Payment', 25, 125);
    doc.text('1', 135, 125, { align: 'right' });
    doc.text(`INR ${invoice.amount.toLocaleString()}`, 160, 125, { align: 'right' });
    doc.text(`INR ${invoice.amount.toLocaleString()}`, 185, 125, { align: 'right' });

    doc.line(20, 132, 190, 132);

    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 140, 142, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`INR ${invoice.amount.toLocaleString()}`, 185, 142, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('Tax (CGST+SGST 0%):', 140, 148, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text('INR 0', 185, 148, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total Paid:', 140, 156, { align: 'right' });
    doc.text(`INR ${invoice.amount.toLocaleString()}`, 185, 156, { align: 'right' });

    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(20, 170, 170, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkGrey[0], darkGrey[1], darkGrey[2]);
    doc.text('Terms & Notes:', 25, 176);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated document. No physical signature is required.', 25, 182);
    doc.text('For any billing queries, please contact the hostel warden or finance desk.', 25, 186);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Thank you for staying with Livora!', 105, 210, { align: 'center' });

    doc.save(`Invoice_${invoice.id}.pdf`);
  };
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const [profileRes] = await Promise.all([API.get('/tenants/me')]);
        setTenantData(profileRes.data);
        const tId = profileRes.data._id;
        
        const paymentsRes = await API.get(`/payments/me?tenantId=${tId}`).catch(() => ({ data: [] }));
        
        setInvoices(paymentsRes.data.map(p => ({
          id: p.invoice || `#INV-${p._id.slice(-6)}`,
          amount: p.amount,
          status: p.status,
          date: new Date(p.date || p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          rawDate: p.date || p.createdAt
        })));
      } catch (err) {
        console.error('Error fetching financial records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, []);

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Synchronizing financial records...</p>
    </div>
  );

  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid' || inv.status === 'Success')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const handleSendParentLink = () => {
    if (!parentNumber || parentNumber.length < 10) {
      alert('Please enter a valid WhatsApp number');
      return;
    }
    const msg = `Hi, this is a secure payment link for ${tenantData?.name}'s rent at Livora: ${window.location.origin}/pay/${tenantData?._id}`;
    window.open(`https://wa.me/91${parentNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowParentModal(false);
    setParentNumber('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  return (
    <div className="payments-page">
      <header className="payments-header">
        <div className="header-title-group">
          <div className="header-icon-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div>
            <h1>Financial Hub</h1>
            <p className="header-subtitle">Manage your rent, share payment links, and track transaction history.</p>
          </div>
        </div>
        <div className="header-actions-pro">
          <button className="btn-secondary" onClick={() => setShowParentModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share with Parent
          </button>
        </div>
      </header>

      <div className="financial-stats-grid">
        <div className="sn-card stat-card-premium emergency">
          <div className="stat-content">
            <span className="stat-label">Emergency Contact</span>
            <h2 className="stat-value">+91 98765 43210</h2>
            <button className="btn-call-emergency" onClick={() => window.location.href = 'tel:+919876543210'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Now
            </button>
          </div>
          <div className="stat-icon-bg red">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        <div className="sn-card stat-card-premium balance">
          <div className="stat-content">
            <span className="stat-label">Total Invested</span>
            <h2 className="stat-value">₹{invoices.filter(i => i.status === 'Paid' || i.status === 'Success').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</h2>
          </div>
          <div className="stat-icon-bg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
              <line x1="12" y1="18" x2="12" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="6"></line>
            </svg>
          </div>
        </div>

        <div className="sn-card stat-card-premium pending">
          <div className="stat-content">
            <span className="stat-label">Pending Rent</span>
            <h2 className="stat-value">₹{invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</h2>
            {invoices.some(i => i.status === 'Pending') && (
              <button className="btn-pay-now">Pay Now</button>
            )}
          </div>
          <div className="stat-icon-bg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="sn-card history-card-main">
        <div className="card-header-iconic">
          <div className="icon-badge-history">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="sn-card-title">Transaction History</h3>
        </div>

        <div className="table-view-desktop">
          <table className="financial-table-premium">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="td-date">{invoice.date}</td>
                  <td className="td-id">
                    <span className="invoice-id">{invoice.id}</span>
                  </td>
                  <td className="td-amount">₹{invoice.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${invoice.status.toLowerCase()}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        {invoice.status === 'Paid' || invoice.status === 'Success' ? <polyline points="20 6 9 17 4 12"></polyline> : <circle cx="12" cy="12" r="10"></circle>}
                      </svg>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-table-details" onClick={() => setSelectedInvoice(invoice)}>Details</button>
                    <button className="btn-table-download" onClick={() => downloadInvoicePDF(invoice)}>Download Invoice (PDF)</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-cards-view">
          {currentInvoices.map(invoice => (
            <div key={invoice.id} className="mobile-transaction-card">
              <div className="mobile-card-top">
                <span className="m-date">{invoice.date}</span>
                <span className={`status-pill ${invoice.status.toLowerCase()}`}>{invoice.status}</span>
              </div>
              <div className="mobile-card-middle">
                <div className="m-info">
                  <span className="m-label">ID</span>
                  <span className="m-value">{invoice.id}</span>
                </div>
                <div className="m-amount">₹{invoice.amount.toLocaleString()}</div>
              </div>
              <div className="mobile-card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-mobile-details" style={{ flex: 1 }} onClick={() => setSelectedInvoice(invoice)}>
                  View Details
                </button>
                <button className="btn-mobile-download" style={{ flex: 1, padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => downloadInvoicePDF(invoice)}>
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn prev" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Prev
            </button>
            
            <div className="pagination-pages">
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index + 1}
                  className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              className="pagination-btn next" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      {showParentModal && (
        <div className="modal-overlay">
          <div className="modal-content-premium">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h3>Parental Support</h3>
                  <p>Send a secure payment link directly to your parent's WhatsApp.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowParentModal(false)}>✕</button>
            </div>
            
            <div className="premium-form">
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  WhatsApp Number
                </label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input 
                    type="text" 
                    placeholder="9876543210" 
                    value={parentNumber} 
                    onChange={e => setParentNumber(e.target.value)} 
                    maxLength="10"
                  />
                </div>
              </div>
              <button className="btn-primary btn-large whatsapp-color" onClick={handleSendParentLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-2.297 0-4.154 1.858-4.154 4.154 0 .727.191 1.41.523 2.003l-.554 2.023 2.07-.543c.563.307 1.208.484 1.896.484 2.297 0 4.154-1.858 4.154-4.154 0-2.296-1.857-4.154-4.154-4.154zm2.4 5.865c-.092.257-.54.502-.746.533-.206.03-.408.055-1.16-.245-.91-.365-1.498-1.29-1.543-1.352-.045-.06-.37-.493-.37-.95 0-.458.238-.682.324-.775.084-.093.185-.116.246-.116h.176c.054 0 .127-.02.197.147.073.176.248.605.27.65.022.045.037.097.007.157-.03.06-.045.097-.09.15-.045.052-.094.116-.135.157-.045.045-.09.094-.038.185.052.09.232.383.5.622.345.308.638.405.727.45.09.045.142.037.195-.022.052-.06.225-.262.285-.352.06-.09.12-.075.202-.045.082.03.525.248.615.293.09.045.15.067.172.105.023.037.023.217-.07.473z"/>
                </svg>
                Send Payment Link
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content-premium">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div>
                  <h3>Transaction Details</h3>
                  <p>Ref: {selectedInvoice.id}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>✕</button>
            </div>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-pill ${selectedInvoice.status.toLowerCase()}`}>{selectedInvoice.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount</span>
                <span className="detail-value">₹{selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{selectedInvoice.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">Online Transaction</span>
              </div>
            </div>
            
            <div className="modal-action-footer">
              <button className="btn-primary" onClick={() => setSelectedInvoice(null)}>Close Receipt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
