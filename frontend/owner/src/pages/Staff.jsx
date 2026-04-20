import React, { useState } from 'react';

const Staff = () => {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Arjun Kumar', role: 'Warden', status: 'Active' },
    { id: 2, name: 'Sunita Devi', role: 'Cook', status: 'Active' },
    { id: 3, name: 'Ramesh Pal', role: 'Security', status: 'Active' },
    { id: 4, name: 'Laxmi Bai', role: 'Cleaning', status: 'On Leave' },
  ]);

  const handleAddStaff = () => {
    alert('Opening Add Staff form...');
  };

  return (
    <div className="staff-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>👷 Staff Directory</h1>
          <p>Manage your hostel operations team.</p>
        </div>
        <button onClick={handleAddStaff} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '700' }}>
          ➕ Add Staff
        </button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Name</th>
              <th style={{ padding: '1.2rem' }}>Role</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{s.name}</td>
                <td style={{ padding: '1.2rem' }}>{s.role}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: s.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: s.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-warning)'
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
