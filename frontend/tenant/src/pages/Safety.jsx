import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

const Safety = () => {
  const [sosProgress, setSosProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);
  const sirenRef = useRef(new Audio('https://www.soundjay.com/emergency/sounds/siren-1.mp3'));

  const startHolding = () => {
    setIsHolding(true);
    let start = Date.now();
    timerRef.current = setInterval(() => {
      let elapsed = Date.now() - start;
      let progress = Math.min((elapsed / 2000) * 100, 100);
      setSosProgress(progress);
      if (progress >= 100) {
        clearInterval(timerRef.current);
        sirenRef.current.loop = true;
        sirenRef.current.play().catch(e => console.log('Audio play failed:', e));
        alert('🚨 SOS ALERT SENT! Emergency services and Livora management have been notified with your live location.');
        setSosProgress(0);
        setIsHolding(false);
      }
    }, 20);
  };

  const stopHolding = () => {
    clearInterval(timerRef.current);
    setIsHolding(false);
    setSosProgress(0);
    if (sirenRef.current) {
      sirenRef.current.pause();
      sirenRef.current.currentTime = 0;
    }
  };

  const [formData, setFormData] = useState({
    type: 'Theft / Missing Item',
    location: '',
    description: '',
  });

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    setIncidentSubmitted(true);
    try {
      await API.post('/confidential-reports', {
        classification: formData.type,
        location: formData.location,
        description: formData.description,
        submittedBy: 'Tenant'
      });
      alert('Your confidential report has been submitted to the Livora Safety Team.');
      setFormData({ type: 'Theft / Missing Item', location: '', description: '' });
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report. Please try again later.');
    } finally {
      setIncidentSubmitted(false);
    }
  };

  return (
    <div className="safety-page fade-in" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <style>
        {`
          @keyframes pulse-red {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 25px rgba(244, 63, 94, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
          }
          .sos-pulse {
            animation: pulse-red 2s infinite;
          }
          .glass-card-premium {
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-card-premium:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          }
          .input-premium {
            width: 100%;
            padding: 1.2rem;
            background: #f8fafc;
            border: 2px solid transparent;
            border-radius: 18px;
            color: #1e293b;
            font-weight: 600;
            transition: all 0.3s ease;
            outline: none;
          }
          .input-premium:focus {
            background: white;
            border-color: #00b0f0;
            box-shadow: 0 0 0 4px rgba(0, 176, 240, 0.1);
          }
          .btn-gradient-primary {
            background: linear-gradient(135deg, #00b0f0 0%, #3b82f6 100%);
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .btn-gradient-primary:hover {
            opacity: 0.9;
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 176, 240, 0.3);
          }
          .btn-gradient-sos {
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
        `}
      </style>

      <header style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '24px', color: '#f43f5e' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.8rem', background: 'linear-gradient(to right, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Safety & SOS Center</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500', maxWidth: '600px', margin: '0 auto' }}>Your security is our highest priority. Instant response and 24/7 protection for all Livora residents.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3.5rem', marginBottom: '4.5rem' }}>
        {/* ── SOS Action Card ── */}
        <div className="glass-card-premium" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: 'rgba(244, 63, 94, 0.1)' }}>
            <div style={{ width: `${sosProgress}%`, height: '100%', background: '#f43f5e', transition: 'width 0.05s linear', boxShadow: '0 0 10px #f43f5e' }}></div>
          </div>

          <div 
            className={isHolding ? "" : "sos-pulse"}
            style={{ 
              width: '160px', 
              height: '160px', 
              background: isHolding ? '#be123c' : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              marginBottom: '2rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: 'none',
              transform: isHolding ? 'scale(0.92)' : 'scale(1)',
              border: '8px solid rgba(255,255,255,0.2)',
              boxShadow: isHolding ? 'inset 0 4px 10px rgba(0,0,0,0.2)' : '0 15px 35px rgba(244, 63, 94, 0.3)'
            }}
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
          >
            <span style={{ fontSize: '3.2rem', fontWeight: '950', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>SOS</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.9, marginTop: '0.2rem', letterSpacing: '1px' }}>HOLD 2S</span>
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#e11d48', marginBottom: '1rem' }}>Emergency SOS</h2>
          <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '320px', lineHeight: '1.6', fontWeight: '500' }}>
            Hold the button to instantly alert the Warden, On-site Security, and local Emergency services.
          </p>
        </div>

        {/* ── Emergency Directory & Support Group ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card-premium" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '14px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.11-2.11a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>Emergency Directory</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { label: 'Warden', phone: '+91 98765 43210', icon: '👤' },
                { label: 'Security', phone: '+91 98765 43211', icon: '🛡️' },
                { label: 'Police', phone: '112', icon: '🚔' },
                { label: 'Ambulance', phone: '102', icon: '🚑' }
              ].map((contact, idx) => (
                <div key={idx} style={{ padding: '1rem 1.2rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{contact.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{contact.label}</span>
                      <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' }}>{contact.phone}</span>
                    </div>
                  </div>
                  <button className="btn-gradient-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.5px' }}>CALL</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-premium" style={{ padding: '2rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '14px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '900' }}>Live Support</h3>
            </div>
            <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' }}>Need assistance with a non-emergency safety concern? Our team is online 24/7.</p>
            <button className="btn" style={{ background: 'white', color: '#2563eb', padding: '1.2rem', width: '100%', fontWeight: '900', borderRadius: '18px', border: 'none', fontSize: '1rem', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Start Live Chat</button>
          </div>
        </div>
      </div>

      {/* ── Incident Reporting Portal ── */}
      <div className="glass-card-premium" style={{ padding: '3rem', border: '1px solid rgba(0, 176, 240, 0.1)' }}>
        <div style={{ marginBottom: '3.5rem', display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(0, 176, 240, 0.1)', color: '#00b0f0', borderRadius: '20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.6rem', color: '#1e293b' }}>Confidential Reporting</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>All reports are end-to-end encrypted and handled with absolute discretion.</p>
          </div>
        </div>

        <form onSubmit={handleIncidentSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Classification</label>
              <select 
                className="input-premium"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Theft / Missing Item</option>
                <option>Harassment</option>
                <option>Maintenance Emergency</option>
                <option>Unsafe Behavior</option>
                <option>Other Concern</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Location</label>
              <input 
                className="input-premium"
                type="text" 
                placeholder="e.g. Block B, 4th Floor" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '1px' }}>Detailed Report</label>
              <textarea 
                className="input-premium"
                rows="5" 
                placeholder="Please provide as much detail as possible..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                style={{ resize: 'none' }}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-gradient-primary" 
              disabled={incidentSubmitted}
              style={{ padding: '1.4rem', fontWeight: '950', borderRadius: '20px', fontSize: '1.1rem', letterSpacing: '1px', marginTop: 'auto' }}
            >
              {incidentSubmitted ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                  SECURING...
                </span>
              ) : 'SUBMIT REPORT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Safety;
