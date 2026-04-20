import React, { useState } from 'react';

const Subscriptions = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Basic', price: '₹999/mo', limit: '50 Beds', features: ['Attendance', 'Cleaning', 'Complaints'] },
    { id: 2, name: 'Standard', price: '₹2499/mo', limit: '200 Beds', features: ['Everything in Basic', 'Inventory', 'Staff Management'] },
    { id: 3, name: 'Enterprise', price: '₹4999/mo', limit: 'Unlimited', features: ['Everything in Standard', 'Multi-property', 'API Access'] },
  ]);

  return (
    <div className="subscriptions-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>💎 Subscription Plans</h1>
          <p>Define and manage service tiers for hostel owners.</p>
        </div>
        <button className="btn btn-primary">+ Create Plan</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {plans.map(plan => (
          <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{plan.name}</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800' }}>{plan.price}</p>
            <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{plan.limit}</p>
            <div style={{ flex: 1, marginTop: '1rem' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, i) => <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>✅ {f}</li>)}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }}>Edit Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
