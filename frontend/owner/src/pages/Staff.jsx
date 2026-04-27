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
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeStaffForTask, setActiveStaffForTask] = useState(null);
  
  const [newStaffData, setNewStaffData] = useState({ name: '', role: 'Warden', phone: '', salary: '' });
  const [newTaskText, setNewTaskText] = useState('');

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const newStaff = {
      ...newStaffData,
      id: staffList.length + 1,
      status: 'Active',
      attendance: '0/26 days',
      recentTasks: []
    };
    setStaffList([...staffList, newStaff]);
    setIsAddStaffModalOpen(false);
    setNewStaffData({ name: '', role: 'Warden', phone: '', salary: '' });
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    setStaffList(staffList.map(s => {
      if (s.id === activeStaffForTask.id) {
        return { ...s, recentTasks: [...(s.recentTasks || []), { task: newTaskText, completed: false }] };
      }
      return s;
    }));
    setIsTaskModalOpen(false);
    setNewTaskText('');
  };

  const handleProcessPayment = (name) => {
    alert(`Processing monthly salary for ${name}... Success!`);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>ACTIVE</span>;
    return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>ON LEAVE</span>;
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="staff-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={32} color="var(--accent-primary)" /> Staff Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage your hostel operations team, tasks, and payroll.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddStaffModalOpen(true)} style={{ padding: '0.8rem 1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                               {s.recentTasks && s.recentTasks.map((t, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '0.8rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    {t.completed ? <CheckCircle size={18} color="var(--accent-success)" /> : <Clock size={18} color="var(--accent-warning)" />}
                                    <p style={{ fontSize: '0.9rem', color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>{t.task}</p>
                                  </div>
                               ))}
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setActiveStaffForTask(s); setIsTaskModalOpen(true); }}
                                 className="btn" 
                                 style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', alignSelf: 'flex-start', padding: 0, marginTop: '0.5rem' }}>+ Assign New Task</button>
                             </div>
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
                               <button className="btn" onClick={(e) => e.stopPropagation()} style={{ flex: 1, fontSize: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>View Timesheet</button>
                               <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleProcessPayment(s.name); }} style={{ flex: 1, fontSize: '0.8rem' }}>Process Payment</button>
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

      <AnimatePresence>
        {isAddStaffModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsAddStaffModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Register New Staff</h2>
              <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <input placeholder="Full Name" value={newStaffData.name} onChange={e => setNewStaffData({...newStaffData, name: e.target.value})} style={inputStyle} required />
                <select value={newStaffData.role} onChange={e => setNewStaffData({...newStaffData, role: e.target.value})} style={inputStyle}>
                  <option value="Warden">Warden</option>
                  <option value="Cook">Cook</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <input placeholder="Phone Number" value={newStaffData.phone} onChange={e => setNewStaffData({...newStaffData, phone: e.target.value})} style={inputStyle} required />
                <input placeholder="Monthly Salary (₹)" value={newStaffData.salary} onChange={e => setNewStaffData({...newStaffData, salary: `₹${e.target.value}`})} style={inputStyle} required />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Confirm Registration</button>
                  <button className="btn" type="button" onClick={() => setIsAddStaffModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {isTaskModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsTaskModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'fixed', top: '30%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>Assign Task to {activeStaffForTask?.name}</h2>
              <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <textarea placeholder="Task Description..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} style={{ ...inputStyle, minHeight: '100px' }} required />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Assign Task</button>
                  <button className="btn" type="button" onClick={() => setIsTaskModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover {
          background: rgba(0,0,0,0.02) !important;
        }
      `}</style>
    </div>
  );
};

export default Staff;
