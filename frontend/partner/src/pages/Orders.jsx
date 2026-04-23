import React from 'react';

const Orders = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Order Requests</h1>
        <p>Manage and fulfill customer orders.</p>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Detailed orders view will appear here.</p>
import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Filter, Search } from 'lucide-react';

const initialOrders = [
  { id: 1, tenant: 'Rahul Sharma', service: 'Medicine Delivery', date: '2026-04-21', status: 'Pending', details: 'Paracetamol, Cough syrup' },
  { id: 2, tenant: 'Priya Patel', service: 'Hair Cut', date: '2026-04-20', status: 'Completed', details: 'Women\'s haircut with styling' },
  { id: 3, tenant: 'Amit Kumar', service: 'Laundry - Wash & Fold', date: '2026-04-20', status: 'Completed', details: '5kg mixed clothes' },
  { id: 4, tenant: 'Sneha Reddy', service: 'Grocery Pack', date: '2026-04-19', status: 'Pending', details: 'Weekly essentials pack' },
  { id: 5, tenant: 'Vikram Singh', service: 'Gym Monthly', date: '2026-04-19', status: 'Completed', details: 'Monthly gym membership renewal' },
  { id: 6, tenant: 'Ananya Gupta', service: 'Full Body Checkup', date: '2026-04-18', status: 'Rejected', details: 'Cancelled by tenant' },
  { id: 7, tenant: 'Karthik Nair', service: 'Medicine Delivery', date: '2026-04-17', status: 'Completed', details: 'Vitamins and supplements' },
  { id: 8, tenant: 'Divya Joshi', service: 'Salon - Facial', date: '2026-04-17', status: 'Pending', details: 'Deep cleansing facial' },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter;
    const matchSearch = o.tenant.toLowerCase().includes(search.toLowerCase()) || o.service.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Completed: orders.filter(o => o.status === 'Completed').length,
    Rejected: orders.filter(o => o.status === 'Rejected').length,
  };

  const statusIcon = (s) => {
    if (s === 'Completed') return <CheckCircle2 size={14} />;
    if (s === 'Rejected') return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  const statusClass = (s) => {
    if (s === 'Completed') return 'badge-completed';
    if (s === 'Rejected') return 'badge-rejected';
    return 'badge-pending';
  };

  return (
    <div className="page-container" id="orders-page">
      <div className="page-header">
        <h1>Orders & Requests</h1>
        <p>Manage service requests from hostel tenants</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Pending', 'Completed', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px' }}>
            {f} ({counts[f]})
          </button>
        ))}
        <div style={{
          marginLeft: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', width: '160px' }} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><Filter size={48} /><h3>No orders found</h3><p>Try adjusting your filters.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tenant</th>
                  <th>Service</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{order.tenant}</td>
                    <td>{order.service}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{order.details}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.date}</td>
                    <td><span className={`badge ${statusClass(order.status)}`}>{statusIcon(order.status)} {order.status}</span></td>
                    <td>
                      {order.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-sm btn-success" onClick={() => updateStatus(order.id, 'Completed')} title="Accept & Complete">
                            <CheckCircle2 size={14} /> Accept
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => updateStatus(order.id, 'Rejected')} title="Reject">
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
