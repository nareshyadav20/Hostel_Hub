import React from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Tag, TrendingUp, ArrowUpRight, IndianRupee, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const partner = JSON.parse(localStorage.getItem('partner') || '{}');

  const stats = [
    { label: 'Customers Served', value: '1,248', trend: '+12% this month', icon: <Users size={24} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
    { label: 'Total Orders', value: '856', trend: '+8% this week', icon: <ShoppingBag size={24} />, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
    { label: 'Active Offers', value: '5', trend: '2 expiring soon', icon: <Tag size={24} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Earnings', value: '₹48,520', trend: '+18% this month', icon: <IndianRupee size={24} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  ];

  const recentOrders = [
    { id: 1, tenant: 'Rahul Sharma', service: 'Medicine Delivery', date: '2026-04-21', status: 'Pending' },
    { id: 2, tenant: 'Priya Patel', service: 'Hair Cut', date: '2026-04-20', status: 'Completed' },
    { id: 3, tenant: 'Amit Kumar', service: 'Laundry Service', date: '2026-04-20', status: 'Completed' },
    { id: 4, tenant: 'Sneha Reddy', service: 'Grocery Pack', date: '2026-04-19', status: 'Pending' },
    { id: 5, tenant: 'Vikram Singh', service: 'Gym Monthly', date: '2026-04-19', status: 'Completed' },
  ];

  const quickActions = [
    { name: 'Add Service', path: '/services', icon: <ShoppingBag size={20} /> },
    { name: 'Create Offer', path: '/offers', icon: <Tag size={20} /> },
    { name: 'View Orders', path: '/orders', icon: <Clock size={20} /> },
  ];

  return (
    <div className="page-container" id="partner-dashboard">
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(139, 92, 246, 0.08) 100%)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
            }}>
              <TrendingUp size={26} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.8rem', fontWeight: 700, marginBottom: '0',
                background: 'linear-gradient(to right, var(--text-primary), #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {partner.name || 'Partner'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Here's your business overview for today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i} style={{ '--delay': `${i * 0.1}s` }}>
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-trend">
              <ArrowUpRight size={14} /> {stat.trend}
=======
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
>>>>>>> staff
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Quick Actions + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="btn btn-secondary"
                onClick={() => navigate(action.path)}
                style={{ justifyContent: 'flex-start', width: '100%', padding: '0.9rem 1.2rem' }}
                id={`quick-${action.path.replace('/', '')}`}
              >
                {action.icon}
                {action.name}
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0' }}>Recent Orders</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/orders')} id="view-all-orders-btn">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.tenant}</td>
                    <td>{order.service}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{order.date}</td>
                    <td>
                      <span className={`badge ${order.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                        {order.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
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

      <style>{`
        @media (max-width: 900px) {
          .page-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
=======
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Orders</h2>
          <button className="btn" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', padding: '0.5rem 1rem' }}>View All Orders</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Order ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Service</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i} style={{ borderBottom: i !== recentOrders.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'var(--transition-fast)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{order.customer}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{order.service}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{order.amount}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 
                                       order.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      color: order.status === 'Completed' ? 'var(--accent-success)' : 
                             order.status === 'Pending' ? 'var(--accent-warning)' : 'var(--accent-secondary)'
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
>>>>>>> staff
    </div>
  );
};

export default Dashboard;
