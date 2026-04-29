import React, { useState } from 'react';

const Subscriptions = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: isAnnual ? 9500 : 999,
      limit: 'Up to 50 Beds',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      features: [
        '3 Full Meals / Day (Breakfast, Lunch & Dinner)',
        'Attendance Tracking',
        'Cleaning Schedules',
        'Member Directory',
        'Complaint Portal'
      ],
      addon: { label: '🍛 2 Customization Curries', price: 500 },
      color: 'var(--accent-primary)',
      popular: false
    },
    {
      id: 2,
      name: 'Standard',
      price: isAnnual ? 23000 : 2499,
      limit: 'Up to 200 Beds',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      features: ['Everything in Basic', 'Full Meal Customization', 'Inventory Management', 'Staff Management Portal', 'Revenue Analytics', 'SMS / WhatsApp Alerts'],
      color: 'var(--accent-secondary)',
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: isAnnual ? 45000 : 4999,
      limit: 'Unlimited Beds',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      features: ['Everything in Standard', 'Multi-property Support', 'Dedicated Account Manager', 'API Access & Webhooks', 'Custom Meal Menus', 'Priority 24x7 Support'],
      color: '#0f172a',
      popular: false,
      isEnterprise: true
    }
  ];

  const CheckIcon = () => (
    <svg className="feature-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <div className="subscriptions-page">
      <header className="subs-header">
        <h1>💎 Subscription Plans</h1>
        <p>Choose the right tier to scale your hostel business with ease.</p>
      </header>

      {/* Billing Toggle */}
      <div className="billing-toggle-container">
        <span className={`toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
        <div className={`toggle-switch ${isAnnual ? 'annual' : ''}`} onClick={() => setIsAnnual(!isAnnual)}>
          <div className="toggle-knob"></div>
        </div>
        <span className={`toggle-label ${isAnnual ? 'active' : ''}`}>Annual</span>
        <span className="save-badge">Save 20%</span>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.isEnterprise ? 'enterprise' : ''}`}>
            {plan.popular && <div className="popular-badge">Best Value</div>}
            
            <div className="plan-icon" style={{ backgroundColor: plan.isEnterprise ? 'rgba(255,255,255,0.1)' : `${plan.color}15`, color: plan.isEnterprise ? 'white' : plan.color }}>
              {plan.icon}
            </div>

            <h3 className="plan-tier">{plan.name}</h3>
            
            <div className="plan-price-container">
              <span className="plan-currency">₹</span>
              <span className="plan-amount">{plan.price.toLocaleString()}</span>
              <span className="plan-period">{isAnnual ? '/year' : '/month'}</span>
            </div>

            <p className="plan-limit">{plan.limit}</p>

            {plan.addon && (
              <div style={{
                background: `${plan.color}18`,
                border: `1px dashed ${plan.color}`,
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                marginBottom: '1rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: plan.color,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{plan.addon.label}</span>
                <span style={{ opacity: 0.8 }}>+₹{plan.addon.price}/mo</span>
              </div>
            )}

            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>

            <button className="plan-button">
              {plan.isEnterprise ? 'Contact Sales' : 'Edit Plan Details'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
