import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscriptions = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
      badge: 'Starter'
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
      popular: true,
      badge: 'Best Value'
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

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveModal('edit-plan');
  };

  return (
    <div className="subscriptions-page page-container animate-fade">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group mb-6"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      <header className="subs-header">
        <div className="header-badge">HostelHub Premium</div>
        <h1>Subscription <span style={{ color: 'var(--accent-primary)' }}>Command Center</span></h1>
        <p>Manage global tiers, pricing structures, and feature entitlements.</p>
      </header>

      {/* Billing Toggle */}
      <div className="billing-wrapper">
        <div className="billing-toggle-container">
          <button className={`toggle-btn ${!isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(false)}>Monthly</button>
          <button className={`toggle-btn ${isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(true)}>
            Annual <span>Save 20%</span>
          </button>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card-premium ${plan.popular ? 'popular' : ''}`}>
            <div className="plan-header">
              <div className="plan-icon-box" style={{ background: `${plan.color}15`, color: plan.color }}>
                {plan.icon}
              </div>
              <div className="plan-title-area">
                <span className="plan-badge" style={{ color: plan.color }}>{plan.badge}</span>
                <h3 className="plan-name">{plan.name}</h3>
              </div>
            </div>

            <div className="plan-price-area">
              <div className="price-main">
                <span className="currency">₹</span>
                <h2 className="amount">{plan.price.toLocaleString()}</h2>
                <span className="period">{isAnnual ? '/yr' : '/mo'}</span>
              </div>
              <p className="limit-info">{plan.limit}</p>
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

      {/* Edit Plan Modal */}
      <Modal
        isOpen={activeModal === 'edit-plan'}
        onClose={() => setActiveModal(null)}
        title={`Configure ${selectedPlan?.name} Tier`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Save Changes</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Tier Name</label>
            <input type="text" className="form-input" defaultValue={selectedPlan?.name} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Monthly Price (₹)</label>
              <input type="number" className="form-input" defaultValue={selectedPlan?.price} />
            </div>
            <div className="form-group">
              <label className="form-label">Bed Limit</label>
              <input type="text" className="form-input" defaultValue={selectedPlan?.limit} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Active Entitlements</label>
            <div className="entitlement-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedPlan?.features.map((f, i) => (
                <span key={i} className="badge badge-info" style={{ textTransform: 'none' }}>{f}</span>
              ))}
              <button className="badge badge-success" style={{ cursor: 'pointer' }}>+ Add Feature</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subscriptions;

