import React from 'react';
import { Users, TrendingUp, ShoppingCart, Star } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Services', value: '12', sub: 'Active Offerings', icon: <Star size={24} />, color: 'var(--accent-primary)' },
    { label: 'Orders this Month', value: '148', sub: '↑ 24% from last month', icon: <ShoppingCart size={24} />, color: 'var(--accent-success)' },
    { label: 'Total Revenue', value: '₹45,200', sub: '↑ 12% from last month', icon: <TrendingUp size={24} />, color: 'var(--accent-warning)' },
    { label: 'Active Customers', value: '86', sub: 'From 5 hostels', icon: <Users size={24} />, color: 'var(--accent-secondary)' }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Rahul Sharma', service: 'Laundry - Premium', date: '2026-04-23', status: 'Pending', amount: '₹350' },
    { id: 'ORD-002', customer: 'Priya Verma', service: 'Room Cleaning', date: '2026-04-22', status: 'Completed', amount: '₹500' },
    { id: 'ORD-003', customer: 'Amit Singh', service: 'Dry Cleaning', date: '2026-04-21', status: 'In Progress', amount: '₹450' },
    { id: 'ORD-004', customer: 'Neha Gupta', service: 'Laundry - Standard', date: '2026-04-20', status: 'Completed', amount: '₹200' },
  ];

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Partner Dashboard</h1>
        <p>Welcome back! Here's what's happening with your services today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>{stat.value}</h2>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: '0' }}>{stat.label}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Orders</h2>
          <button className="btn" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', padding: '0.5rem 1rem' }}>View All Orders</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '500' }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.service}</td>
                  <td>{order.date}</td>
                  <td style={{ fontWeight: '600' }}>{order.amount}</td>
                  <td>
                    <span className={`table-badge ${order.status === 'Completed' ? 'success' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
