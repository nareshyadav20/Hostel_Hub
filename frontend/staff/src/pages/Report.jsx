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
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ title: '', description: '', category: 'Maintenance', priority: 'Medium' });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🚨 Report Issue</h1>
        <p>Flag operational or safety issues to the hostel management.</p>
      </header>

      {submitted && (
        <div className="card" style={{ background: 'var(--accent-success)', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>
          <h3>✅ Issue Reported Successfully!</h3>
          <p>Management will be notified immediately.</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ background: '#ff4d4f', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>
          <h3>❌ Submission Failed</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label>Issue Title</label>
            <input
              type="text"
              placeholder="e.g. Kitchen Chimney Not Working"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Provide more details about the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-primary)', resize: 'none' }}
              required
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Category</label>
              <select
                className="btn"
                style={{ border: '1px solid var(--border-color)', width: '100%' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Equipment</option>
                <option>Safety</option>
                <option>Maintenance</option>
                <option>Others</option>
              </select>
            </div>
            <div className="input-group">
              <label>Priority</label>
              <select
                className="btn"
                style={{ border: '1px solid var(--border-color)', width: '100%' }}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
            style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;
