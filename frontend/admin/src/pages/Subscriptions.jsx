import React, { useState } from 'react';
import { 
  Check, Info, Zap, Shield, Crown, Edit, 
  ArrowRight, Users, Settings, Database 
} from 'lucide-react';
import Modal from '../components/Modal';
import './Subscriptions.css';

const Subscriptions = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: isAnnual ? 9500 : 999,
      limit: 'Up to 50 Beds',
      icon: <Settings />,
      features: ['Attendance Tracking', 'Cleaning Schedules', 'Member Directory', 'Complaint Portal'],
      color: 'var(--accent-primary)',
      badge: 'Starter'
    },
    {
      id: 2,
      name: 'Standard',
      price: isAnnual ? 23000 : 2499,
      limit: 'Up to 200 Beds',
      icon: <Zap />,
      features: ['Everything in Basic', 'Inventory Management', 'Staff Management Portal', 'Revenue Analytics'],
      color: 'var(--accent-secondary)',
      popular: true,
      badge: 'Best Value'
    },
    {
      id: 3,
      name: 'Enterprise',
      price: isAnnual ? 45000 : 4999,
      limit: 'Unlimited Beds',
      icon: <Crown />,
      features: ['Everything in Standard', 'Multi-property Support', 'Dedicated Support', 'API Access'],
      color: '#8b5cf6',
      badge: 'Custom'
    }
  ];

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveModal('edit-plan');
  };

  return (
    <div className="subscriptions-page page-container animate-fade">
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

            <div className="features-section">
              <p className="features-title">Core Entitlements</p>
              <ul className="premium-features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} color="var(--accent-primary)" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-actions">
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleEditPlan(plan)}>
                <Edit size={16} /> Edit Plan Details
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }}>
                View Entitlement Logs
              </button>
            </div>
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

