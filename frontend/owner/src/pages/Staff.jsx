import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar, CreditCard, ChevronDown, ChevronUp, UserPlus, Clock, ClipboardList } from 'lucide-react';

const Staff = () => {
  const [staffList, setStaffList] = useState([
    { 
      id: 1, name: 'Arjun Kumar', role: 'Warden', status: 'Active', 
      phone: '+91 98765 00001', salary: '₹25,000', attendance: '24/26 days',
      recentTasks: [
        { task: 'Inspect Room 101 damage', completed: true },
        { task: 'Collect pending rent from 202', completed: false }
      ]
    },
    { 
      id: 2, name: 'Sunita Devi', role: 'Cook', status: 'Active',
      phone: '+91 98765 00002', salary: '₹15,000', attendance: '26/26 days',
      recentTasks: [
        { task: 'Prepare weekly grocery list', completed: true },
        { task: 'Special dinner preparation on Friday', completed: false }
      ]
    },
    { 
      id: 3, name: 'Ramesh Pal', role: 'Security', status: 'Active',
      phone: '+91 98765 00003', salary: '₹18,000', attendance: '25/26 days',
      recentTasks: [
        { task: 'Night shift gate log update', completed: true }
      ]
    },
    { 
      id: 4, name: 'Laxmi Bai', role: 'Cleaning', status: 'On Leave',
      phone: '+91 98765 00004', salary: '₹12,000', attendance: '10/26 days',
      recentTasks: []
    },
  ]);

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>ACTIVE</span>;
    return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>ON LEAVE</span>;
  };

  return (
    <div className="staff-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={32} color="var(--accent-primary)" /> Staff Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage your hostel operations team, tasks, and payroll.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} /> Add Staff
        </button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Staff Member</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(s => (
              <React.Fragment key={s.id}>
                <tr 
                  onClick={() => toggleRow(s.id)}
                  style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: expandedRow === s.id ? 'var(--bg-tertiary)' : 'transparent', transition: 'var(--transition-fast)' }} 
                  className="table-row-hover"
                >
                  <td style={{ padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                        {s.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '1rem' }}>{s.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem', fontWeight: '600' }}>{s.role}</td>
                  <td style={{ padding: '1.2rem' }}>{getStatusBadge(s.status)}</td>
                  <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }}>
                      {expandedRow === s.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRow === s.id && (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                           
                           {/* Tasks & Tracking */}
                           <div>
                             <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <ClipboardList size={16} /> Recent Tasks
                             </h4>
                             {s.recentTasks && s.recentTasks.length > 0 ? (
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                 {s.recentTasks.map((t, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '0.8rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                      {t.completed ? <CheckCircle size={18} color="var(--accent-success)" /> : <Clock size={18} color="var(--accent-warning)" />}
                                      <p style={{ fontSize: '0.9rem', color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>{t.task}</p>
                                    </div>
                                 ))}
                                 <button className="btn" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', alignSelf: 'flex-start', padding: 0, marginTop: '0.5rem' }}>+ Assign New Task</button>
                               </div>
                             ) : (
                               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active tasks.</p>
                             )}
                           </div>

                           {/* HR & Payroll */}
                           <div>
                             <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <CreditCard size={16} /> Attendance & Payroll
                             </h4>
                             <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                               <div>
                                 <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14}/> This Month</p>
                                 <p style={{ fontSize: '1.2rem', fontWeight: '800' }}>{s.attendance}</p>
                               </div>
                               <div>
                                 <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Base Salary</p>
                                 <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>{s.salary}</p>
                               </div>
                             </div>
                             <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                               <button className="btn" style={{ flex: 1, fontSize: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>View Timesheet</button>
                               <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>Process Payment</button>
                             </div>
                           </div>

                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .table-row-hover:hover {
          background: rgba(0,0,0,0.02) !important;
        }
      `}</style>
    </div>
  );
};

export default Staff;
