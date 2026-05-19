import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import socket from '../utils/socket';
import './Rewards.css';

const Rewards = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState({ total: 0, earned: 0, used: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const [profileRes, walletRes, historyRes] = await Promise.all([
          API.get('/tenants/me'),
          API.get('/rewards/wallet'),
          API.get('/rewards/history')
        ]);
        setTenantId(profileRes.data._id);
        setPoints({ 
          total: walletRes.data.availablePoints, 
          earned: walletRes.data.lifetimeEarned, 
          used: walletRes.data.totalRedeemed,
          history: historyRes.data || []
        });
      } catch (err) { 
        console.error('Error fetching rewards:', err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchRewards();

    const handleRewardUpdate = (data) => {
      setPoints(prev => ({
        ...prev,
        total: data.availablePoints,
        earned: data.lifetimeEarned,
        used: data.totalRedeemed
      }));
      // Fetch latest history to update list
      API.get('/rewards/history').then(res => {
        setPoints(prev => ({ ...prev, history: res.data || [] }));
      }).catch(err => console.error(err));
    };

    socket.on('rewardUpdated', handleRewardUpdate);

    return () => {
      socket.off('rewardUpdated', handleRewardUpdate);
    };
  }, []);

  const handleGetReferralLink = async () => {
    try {
      const res = await API.get('/rewards/referral-link');
      const { referralLink, referralMessage } = res.data;
      
      // Copy to clipboard
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      // Open WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(referralMessage)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Error generating referral link:', err);
      const fallbackLink = `${window.location.origin}/signup?ref=${tenantId || 'livora'}`;
      navigator.clipboard.writeText(fallbackLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Hey! Check out Livora: " + fallbackLink)}`, '_blank');
    }
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
            <button className="btn-primary" onClick={() => navigate('/discounts')}>Browse Rewards</button>
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

      {/* Points History Log */}
      <section className="points-history-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
          Points Earning History
        </h2>

        {points.history.length === 0 ? (
          <div className="no-history-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <path d="M16 2v4"></path>
              <path d="M8 2v4"></path>
              <path d="M3 10h18"></path>
            </svg>
            <p>No rewards activity recorded yet. Start participating in mess attendance and community programs to earn points!</p>
          </div>
        ) : (
          <div className="history-list">
            {[...points.history].reverse().map((item, idx) => {
              const reason = item.description || item.reason || 'Activity Reward';
              const dateVal = item.createdAt || item.date || new Date();
              return (
                <div className="history-item" key={item._id || idx}>
                  <div className="history-info">
                    <span className="history-reason">{reason}</span>
                    <span className="history-date">{new Date(dateVal).toLocaleDateString()} at {new Date(dateVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`history-points ${item.points >= 0 ? 'earned' : 'redeemed'}`}>
                    {item.points >= 0 ? '+' : ''}{item.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Rewards;
