import React from 'react';

const Transfers = () => {
  const currentRoom = {
    hostel: 'Green View Hostel',
    room: '201',
    type: '2 Sharing'
  };

  const requestStatus = 'No Active Requests';

  const handleRequestTransfer = () => alert('Opening Transfer Request Form...');

  return (
    <div className="transfers-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🔄 Room Transfer</h1>
        <p>Request to move to a different room or building.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Current Room Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>HOSTEL</p>
              <p style={{ fontWeight: '700' }}>{currentRoom.hostel}</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ROOM / TYPE</p>
              <p style={{ fontWeight: '700' }}>{currentRoom.room} ({currentRoom.type})</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Request Transfer</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Current Status: <strong style={{ color: 'var(--accent-primary)' }}>{requestStatus}</strong>
          </p>
          <button 
            onClick={handleRequestTransfer} 
            className="btn btn-primary" 
            style={{ padding: '1rem', fontWeight: '800' }}
          >
            ➕ Request New Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
