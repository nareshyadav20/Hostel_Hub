import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, Zap, Wifi, Trash2, Utensils, Volume2, 
  CreditCard, Gift, Ticket, MessageSquare, 
  ChevronRight, Bell, GraduationCap, Briefcase,
  Clock, MapPin, UserCheck, ShieldCheck,
  TrendingUp, Award
} from 'lucide-react';
import './App.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Tenant"}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const activities = [
    { id: 1, type: 'payment', title: 'Rent Paid Successfully', desc: 'April 2026 rent payment confirmed', time: '2 hours ago', color: 'var(--accent-success)' },
    { id: 2, type: 'complaint', title: 'WiFi Maintenance', desc: 'Your ticket #442 has been resolved', time: 'Yesterday', color: 'var(--accent-primary)' },
    { id: 3, type: 'mess', title: 'Special Menu Update', desc: 'Biryani Special tonight at 8:00 PM', time: '12 Apr', color: 'var(--accent-warning)' },
  ];

  const stats = [
    { label: 'Water', status: 'Available', icon: <Droplets size={20} />, color: 'var(--accent-success)' },
    { label: 'Power', status: 'Backup', icon: <Zap size={20} />, color: 'var(--accent-warning)' },
    { label: 'WiFi', status: '50Mbps', icon: <Wifi size={20} />, color: 'var(--accent-success)' },
    { label: 'Cleaning', status: 'Pending', icon: <Trash2 size={20} />, color: 'var(--accent-error)' },
    { label: 'Food', status: '4.2/5', icon: <Utensils size={20} />, color: 'var(--accent-primary)' },
    { label: 'Noise', status: 'Low', icon: <Volume2 size={20} />, color: 'var(--accent-success)' },
  ];

  return (
    <div className="dashboard-container fade-in">
      <section className="welcome-section" style={{ 
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        padding: '3rem',
        borderRadius: '24px',
        color: 'white',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', margin: 0 }}>{greeting}, {user.name}! 👋</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Welcome back to your digital hostel home. Everything looks good for today.
          </p>
        </div>
        <div style={{ 
          position: 'absolute', 
          right: '-20px', 
          bottom: '-20px', 
          opacity: 0.1,
          transform: 'rotate(-15deg)'
        }}>
          <GraduationCap size={200} />
        </div>
      </section>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="main-stats">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Rent Card */}
            <div className="card stat-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--accent-primary)" />
                  <h3 style={{ margin: 0 }}>Rent Cycle</h3>
                </div>
                <span style={{ color: 'var(--accent-error)', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>5 DAYS LEFT</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>₹6,500</h2>
              <div style={{ background: 'var(--bg-tertiary)', height: '8px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: '85%', background: 'var(--accent-error)', height: '100%' }}></div>
              </div>
              <p style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> Next payment: 26th April
              </p>
            </div>

            {/* Loyalty Card */}
            <div className="card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="var(--accent-warning)" />
                  <h3 style={{ margin: 0 }}>Loyalty Points</h3>
                </div>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>SILVER</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>450 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>pts</span></h2>
              <div style={{ background: 'var(--bg-tertiary)', height: '8px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: '60%', background: 'var(--accent-primary)', height: '100%' }}></div>
              </div>
              <p style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={14} /> 50 pts to Gold status
              </p>
            </div>
          </div>

          <h3 style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Zap size={20} color="var(--accent-warning)" /> Live Hostel Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginTop: '1rem' }}>
            {stats.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', color: s.color }}>
                  {s.icon}
                </div>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{s.label}</h4>
                <span style={{ fontSize: '0.8rem', color: s.color, fontWeight: 'bold' }}>{s.status}</span>
              </div>
            ))}
          </div>

          {/* Role Specific Features */}
          <h3 style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {user.occupation === 'Student' ? <><GraduationCap size={20} color="var(--accent-primary)" /> Student Perks</> : <><Briefcase size={20} color="var(--accent-primary)" /> Employee Perks</>}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            {user.occupation === 'Student' ? (
              <>
                {[
                  { icon: <Volume2 />, title: 'Exam Mode', desc: 'Activate quiet hours.', action: 'Activate' },
                  { icon: <CreditCard />, title: 'Parent Pay', desc: 'Send link to parents.', action: 'Send' },
                  { icon: <MapPin />, title: 'Attendance', desc: 'Mark your presence.', action: 'Check-in' },
                  { icon: <Clock />, title: 'Curfew', desc: 'Request late entry.', action: 'Request' }
                ].map((item, i) => (
                  <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-primary)' }}>{item.icon}</div>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>{item.desc}</p>
                    </div>
                    <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>{item.action}</button>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { icon: <Zap />, title: 'Night Shift', desc: 'Auto-entry management.', action: 'Setup' },
                  { icon: <Ticket />, title: 'GST Invoices', desc: 'Download tax invoices.', action: 'View' },
                  { icon: <Briefcase />, title: 'Corporate', desc: 'Manage bulk bookings.', action: 'Manage' },
                  { icon: <UserCheck />, title: 'Flexible Entry', desc: '24/7 access request.', action: 'Activate' }
                ].map((item, i) => (
                  <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-primary)' }}>{item.icon}</div>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>{item.desc}</p>
                    </div>
                    <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>{item.action}</button>
                  </div>
                ))}
              </>
            )}
          </div>

          <h3 style={{ marginTop: '2.5rem' }}>Quick Actions</h3>
          <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <Link to="/payments" className="btn btn-secondary" style={{ flexDirection: 'column', height: '100px', padding: '1rem' }}>
              <CreditCard /> <span>Pay Rent</span>
            </Link>
            <Link to="/mess" className="btn btn-secondary" style={{ flexDirection: 'column', height: '100px', padding: '1rem' }}>
              <Utensils /> <span>Book Meal</span>
            </Link>
            <Link to="/complaints" className="btn btn-secondary" style={{ flexDirection: 'column', height: '100px', padding: '1rem' }}>
              <MessageSquare /> <span>Help Desk</span>
            </Link>
            <Link to="/rewards" className="btn btn-secondary" style={{ flexDirection: 'column', height: '100px', padding: '1rem' }}>
              <Gift /> <span>Redeem</span>
            </Link>
          </div>
        </div>

        <aside className="activity-panel">
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Recent Activity</h3>
              <Bell size={18} color="var(--text-muted)" />
            </div>
            <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {activities.map(act => (
                <div key={act.id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: act.color, marginTop: '5px', flexShrink: 0 }}></div>
                  <div className="activity-content">
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{act.title}</h4>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>{act.desc}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem', fontSize: '0.85rem' }}>View All Activity</button>
          </div>

          <div className="card" style={{ marginTop: '1.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
              <h3 style={{ color: 'white', margin: 0 }}>Refer & Earn</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Referring a friend gives you 200 loyalty points and a 5% discount on next month's rent!
            </p>
            <button className="btn" style={{ background: 'white', color: 'var(--accent-primary)', width: '100%', border: 'none' }}>Invite Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;

