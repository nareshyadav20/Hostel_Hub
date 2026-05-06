import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Rewards.css';

const Rewards = () => {
  const [points, setPoints] = useState({ total: 450, earned: 1200, used: 750 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const [profileRes, rewardsRes] = await Promise.all([
          API.get('/tenants/me'),
          API.get('/tenant-portal/rewards/me')
        ]);
        setTenantId(profileRes.data._id);
        setPoints({ 
          total: rewardsRes.data.points, 
          earned: rewardsRes.data.lifetimeEarned, 
          used: rewardsRes.data.used 
        });
      } catch (err) { 
        console.error('Error fetching rewards:', err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchRewards();
  }, []);

  const handleGetReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${tenantId || 'livora'}`;
    const shareMessage = `Hey! I'm staying at Livora, and it's amazing. Join me using my referral link and we both get bonus points: ${referralLink}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Calculating your loyalty points...</p>
    </div>
  );

  return (
    <div className="rewards-page">
      <header className="rewards-header">
        <div className="header-title-row">
          <div className="header-icon-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h1>Loyalty Rewards</h1>
        </div>
        <p className="header-subtitle">Earn premium points for timely rent payments and active community participation.</p>
      </header>

      <div className="points-summary-grid">
        <div className="point-card balance">
          <div className="point-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className="point-content">
            <span className="point-label">Available Balance</span>
            <h2 className="point-value">{points.total}</h2>
          </div>
        </div>

        <div className="point-card earned">
          <div className="point-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <div className="point-content">
            <span className="point-label">Lifetime Earned</span>
            <h2 className="point-value">{points.earned}</h2>
          </div>
        </div>

        <div className="point-card used">
          <div className="point-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div className="point-content">
            <span className="point-label">Total Redeemed</span>
            <h2 className="point-value">{points.used}</h2>
          </div>
        </div>
      </div>

      <div className="rewards-cta-grid">
        <div className="cta-card redeem">
          <div className="cta-info">
            <h2>Redeem Your Points</h2>
            <p>Get instant discounts on rent, food coupons, and exclusive partner offers from our catalog.</p>
            <button className="btn-primary">Browse Rewards</button>
          </div>
          <div className="cta-visual">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
            </svg>
          </div>
        </div>

        <div className="cta-card referral">
          <div className="cta-info">
            <h2>Refer & Earn</h2>
            <p>Invite your friends to Livora and earn 200 bonus points for every successful resident joining.</p>
            <div className="referral-action-wrapper">
              <button 
                className={`btn-secondary ${copied ? 'copied' : ''}`} 
                onClick={handleGetReferralLink}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    LINK COPIED & SHARED!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-2.297 0-4.154 1.858-4.154 4.154 0 .727.191 1.41.523 2.003l-.554 2.023 2.07-.543c.563.307 1.208.484 1.896.484 2.297 0 4.154-1.858 4.154-4.154 0-2.296-1.857-4.154-4.154-4.154zm2.4 5.865c-.092.257-.54.502-.746.533-.206.03-.408.055-1.16-.245-.91-.365-1.498-1.29-1.543-1.352-.045-.06-.37-.493-.37-.95 0-.458.238-.682.324-.775.084-.093.185-.116.246-.116h.176c.054 0 .127-.02.197.147.073.176.248.605.27.65.022.045.037.097.007.157-.03.06-.045.097-.09.15-.045.052-.094.116-.135.157-.045.045-.09.094-.038.185.052.09.232.383.5.622.345.308.638.405.727.45.09.045.142.037.195-.022.052-.06.225-.262.285-.352.06-.09.12-.075.202-.045.082.03.525.248.615.293.09.045.15.067.172.105.023.037.023.217-.07.473z"/>
                    </svg>
                    Get Referral Link & Share
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <polyline points="16 11 18 13 22 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
