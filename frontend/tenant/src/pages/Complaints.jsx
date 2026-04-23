import React, { useState } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, issue: 'WiFi not working', status: 'Pending', date: '20 Apr 2026' },
    { id: 2, issue: 'Bathroom cleaning', status: 'Resolved', date: '15 Apr 2026' },
  ]);

  const handleRaiseComplaint = () => alert('Opening Complaint Form...');

  return (
    <div className="complaints-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🛠️ My Complaints</h1>
          <p>Track your issues and raise new requests.</p>
        </div>
        <button onClick={handleRaiseComplaint} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '800' }}>
          ➕ Raise Complaint
        </button>
      </header>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Reported Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: '600' }}>{item.issue}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`table-badge ${item.status === 'Resolved' ? 'success' : 'warning'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaints;
