import React from 'react';
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
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default Dashboard;
