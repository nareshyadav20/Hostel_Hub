import React from 'react';

const Booking = () => {
  const currentBooking = {
    hostel: 'Green View Hostel',
    room: '201',
    bed: 'A',
    startDate: '01 Apr 2026',
    duration: '6 Months',
    status: 'Active'
  };

  return (
    <div className="booking-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛏️ My Current Booking</h1>
        <p>Details of your ongoing stay and room information.</p>
      </header>

      <div className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{currentBooking.hostel}</h2>
            <span style={{ 
              padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800',
              background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)'
            }}>
              {currentBooking.status} STAY
            </span>
          </div>
          <div style={{ fontSize: '3rem' }}>🏢</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Room / Bed No</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{currentBooking.room} - {currentBooking.bed}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start Date</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{currentBooking.startDate}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Duration</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{currentBooking.duration}</p>
          </div>
          <button className="btn btn-primary" style={{ height: 'fit-content', alignSelf: 'end' }}>View Digital ID</button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
