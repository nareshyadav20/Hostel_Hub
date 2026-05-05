import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Report = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Medium',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/confidential-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, submittedBy: 'Staff' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit report.');
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ title: '', description: '', category: 'Maintenance', priority: 'Medium' });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page animate-fade-in">
      <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
        <div className="icon-box" style={{ background: 'var(--grad-error)', color: '#fff', marginBottom: '0.5rem', width: '64px', height: '64px', borderRadius: '20px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Report Issue</h1>
          <p style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>Flag operational or safety issues to the hostel management.</p>
        </div>
      </header>

      {submitted && (
        <div className="card" style={{ background: 'var(--grad-success)', color: '#fff', marginBottom: '2rem', textAlign: 'center', border: 'none', maxWidth: '700px', margin: '0 auto 2rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>✅ Issue Reported Successfully!</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Management will be notified immediately. Thank you for your report.</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ background: 'var(--grad-error)', color: '#fff', marginBottom: '2rem', textAlign: 'center', border: 'none', maxWidth: '700px', margin: '0 auto 2rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>❌ Submission Failed</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{error}</p>
        </div>
      )}

      <div className="card" style={{ maxWidth: '700px', padding: '2.5rem', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Issue Title</label>
            <input
              type="text"
              placeholder="e.g. Kitchen Chimney Not Working"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '12px', 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Description</label>
            <textarea
              rows="5"
              placeholder="Provide more details about the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ 
                width: '100%', 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '1.2rem', 
                color: 'var(--text-primary)', 
                resize: 'none',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}
              required
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option>Equipment</option>
                <option>Safety</option>
                <option>Maintenance</option>
                <option>Others</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
               <>
               <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}>
                 <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
               </svg>
               Submitting Report...
             </>
            ) : 'Submit Official Report'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Report;

