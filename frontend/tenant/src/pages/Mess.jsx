import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Mess = () => {
  const navigate = useNavigate();
  const [attended, setAttended] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem', background: '#f8fafc', height: '100vh' }}><h2>Refreshing Menu...</h2></div>;

  return (
    <div className="mess-refined-container">
      <main className="mess-inner-content">
        {/* Simplified Header - Integrated with Layout */}
        <header className="mess-page-header">
           <div className="breadcrumb" onClick={() => navigate('/dashboard')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              <span>Back to Dashboard</span>
           </div>
           <h1 className="mess-main-title">Mess & Nutrition</h1>
           <p className="mess-main-subtitle">Your daily dining schedule and preference management.</p>
        </header>

        {/* Action Row */}
        <div className="mess-action-grid">
           {/* Current Meal Section */}
           <div className="pro-meal-card highlight-indigo">
              <div className="meal-badge">NEXT SCHEDULED</div>
              <div className="meal-content-row">
                 <div className="meal-icon-circle">🍛</div>
                 <div>
                    <h2 className="meal-heading">Lunch Special</h2>
                    <p className="meal-detail-text">Premium Rice, Dal Tadka, Seasonal Sabzi, Fresh Curd & Dessert.</p>
                 </div>
              </div>
              <div className="meal-footer">
                 <div className="footer-stat"><span>Time:</span> 12:30 PM - 2:00 PM</div>
                 <div className="footer-stat"><span>Venue:</span> Main Dining Hall</div>
              </div>
           </div>

           {/* Attendance Section */}
           <div className="pro-meal-card">
              <div className="meal-badge">ATTENDANCE</div>
              <h2 className="attendance-status">
                 {attended ? "Confirmed ✅" : skipped ? "Opted Out ✕" : "Action Required"}
              </h2>
              <p className="attendance-help">Please update your status to help us minimize food wastage.</p>
              <div className="attendance-buttons">
                 <button className={`btn-action-pro attend ${attended ? 'active' : ''}`} onClick={() => {setAttended(true); setSkipped(false);}}>I'll be there</button>
                 <button className={`btn-action-pro skip ${skipped ? 'active' : ''}`} onClick={() => {setSkipped(true); setAttended(false);}}>Skip Meal</button>
              </div>
           </div>
        </div>

        {/* Weekly Menu Table */}
        <section className="mess-table-section">
           <div className="section-header-row">
              <h3 className="section-title">Weekly Dining Menu</h3>
              <div className="update-tag">Updated: Today</div>
           </div>
           <div className="table-card">
              <div className="table-responsive-box">
                 <table className="pro-dining-table">
                    <thead>
                       <tr>
                          <th>Day</th>
                          <th>Breakfast</th>
                          <th>Lunch</th>
                          <th>Dinner</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[
                         { d: 'Monday', b: 'Dosa & Chutney', l: 'North Indian Thali', dn: 'Veg Pulao' },
                         { d: 'Tuesday', b: 'Poha & Jalebi', l: 'Rice & Dal Tadka', dn: 'Alu Paratha' },
                         { d: 'Wednesday', b: 'Vada Sambar', l: 'Curd Rice & Mix Veg', dn: 'Paneer Curry' },
                         { d: 'Thursday', b: 'Upma & Sabzi', l: 'Roti & Veg Korma', dn: 'Egg Masala' },
                         { d: 'Friday', b: 'Aloo Puri', l: 'Veg Biryani', dn: 'Chinese Special' },
                         { d: 'Saturday', b: 'Bread Omelette', l: 'Fried Rice & Gravy', dn: 'Pasta Night' },
                         { d: 'Sunday', b: 'Stuffed Paratha', l: 'Sunday Feast', dn: 'Chef\'s Special' },
                       ].map((day, i) => (
                         <tr key={i}>
                            <td className="day-cell">{day.d}</td>
                            <td>{day.b}</td>
                            <td>{day.l}</td>
                            <td>{day.dn}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>
      </main>

      <style>{`
        .mess-refined-container {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #0f172a;
        }

        .mess-inner-content {
          padding: 3rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mess-page-header { margin-bottom: 3.5rem; }
        
        .breadcrumb { 
          display: flex; align-items: center; gap: 0.5rem; 
          font-size: 0.85rem; font-weight: 700; color: #4f46e5; 
          margin-bottom: 1.5rem; cursor: pointer; opacity: 0.8; transition: 0.2s;
        }
        .breadcrumb:hover { opacity: 1; transform: translateX(-5px); }

        .mess-main-title { font-size: 2.8rem; font-weight: 950; letter-spacing: -1.5px; margin-bottom: 0.5rem; }
        .mess-main-subtitle { font-size: 1.1rem; color: #64748b; font-weight: 500; }

        .mess-action-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2.5rem; margin-bottom: 4rem; }

        .pro-meal-card {
           background: white; border-radius: 24px; padding: 2.5rem; 
           border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
           display: flex; flex-direction: column; justify-content: space-between;
           transition: all 0.3s ease;
        }
        .pro-meal-card.highlight-indigo { border-left: 6px solid #4f46e5; }
        .pro-meal-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); border-color: #4f46e5; }

        .meal-badge { font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; margin-bottom: 1.5rem; }
        
        .meal-content-row { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; }
        .meal-icon-circle { width: 60px; height: 60px; background: #f1f5f9; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
        .meal-heading { font-size: 1.8rem; font-weight: 900; color: #1e293b; margin-bottom: 0.5rem; }
        .meal-detail-text { font-size: 1rem; color: #64748b; line-height: 1.6; font-weight: 500; }

        .meal-footer { display: flex; gap: 2.5rem; padding-top: 1.8rem; border-top: 1px solid #f1f5f9; }
        .footer-stat { font-size: 0.85rem; color: #64748b; font-weight: 600; }
        .footer-stat span { color: #1e293b; font-weight: 800; margin-right: 0.4rem; }

        .attendance-status { font-size: 2rem; font-weight: 950; color: #1e293b; margin-bottom: 0.8rem; }
        .attendance-help { font-size: 0.95rem; color: #64748b; font-weight: 500; margin-bottom: 2rem; }
        
        .attendance-buttons { display: flex; gap: 1rem; }
        .btn-action-pro { 
           flex: 1; padding: 1rem; border-radius: 12px; font-weight: 700; cursor: pointer;
           transition: all 0.2s; border: 1.5px solid #e2e8f0; background: white; color: #475569;
        }
        .btn-action-pro:hover { border-color: #4f46e5; color: #4f46e5; }
        .btn-action-pro.active.attend { background: #4f46e5; border-color: #4f46e5; color: white; }
        .btn-action-pro.active.skip { background: #ef4444; border-color: #ef4444; color: white; }

        .mess-table-section { margin-top: 2rem; }
        .section-header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.4rem; font-weight: 900; color: #1e293b; }
        .update-tag { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }

        .table-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .table-responsive-box { overflow-x: auto; }
        
        .pro-dining-table { width: 100%; border-collapse: collapse; text-align: left; }
        .pro-dining-table th { padding: 1.4rem 1.8rem; background: #f8fafc; font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .pro-dining-table td { padding: 1.2rem 1.8rem; font-size: 0.95rem; color: #334155; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        .day-cell { font-weight: 800 !important; color: #4f46e5 !important; }
        .pro-dining-table tr:hover { background: #f9fafb; }
        .pro-dining-table tr:last-child td { border-bottom: none; }

        @media (max-width: 1024px) {
          .mess-inner-content { padding: 2rem; }
          .mess-action-grid { grid-template-columns: 1fr; }
          .mess-main-title { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

export default Mess;
