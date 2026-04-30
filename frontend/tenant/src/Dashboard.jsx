import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [financials] = useState({
    totalDue: 5000,
    paidThisMonth: 3000,
    dueDate: '01 Jun 2024',
    isPaid: false
  });

  return (
    <div className="staynest-dashboard">
      
      {/* ── 1. Welcome Hero Banner ── */}
      <section className="staynest-hero">
        <div className="hero-content">
          <h1 className="hero-title">Good Afternoon, Uma! 👋</h1>
          <p className="hero-subtitle">Welcome back to your home away from home.</p>
          
          <div className="hero-stats">
            <div className="h-stat"><span className="h-icon">🏠</span> <div><strong>Block A</strong><br/><span>Building</span></div></div>
            <div className="h-stat"><span className="h-icon">🚪</span> <div><strong>203</strong><br/><span>Room No.</span></div></div>
            <div className="h-stat"><span className="h-icon">👥</span> <div><strong>2 Sharing</strong><br/><span>Room Type</span></div></div>
            <div className="h-stat"><span className="h-icon">📅</span> <div><strong>12 Mar 2024</strong><br/><span>Joined On</span></div></div>
          </div>
        </div>
        <div className="hero-decoration">
           {/* Placeholder for the green sofa image if asset is missing */}
           <div className="sofa-placeholder"></div>
        </div>
      </section>

      {/* ── 2. Top Action Cards ── */}
      <div className="top-action-row">
         <div className="action-card"><div className="a-icon green">💰</div><div className="a-text"><strong>Pay Rent</strong><span>Make a payment</span></div></div>
         <div className="action-card"><div className="a-icon orange">🔔</div><div className="a-text"><strong>Raise Complaint</strong><span>Report an issue</span></div></div>
         <div className="action-card"><div className="a-icon purple">🍽️</div><div className="a-text"><strong>Book Meal</strong><span>Pre-book your meal</span></div></div>
         <div className="action-card"><div className="a-icon blue">🧹</div><div className="a-text"><strong>Request Cleaning</strong><span>Room cleaning</span></div></div>
      </div>

      {/* ── 3. Today's Summary ── */}
      <section className="today-summary">
         <h3 className="section-label">Today's Summary</h3>
         <div className="summary-cards">
            <div className="s-card rent"><div className="s-header">Rent Due</div><div className="s-value">₹5,000</div><div className="s-sub">Due in 3 days</div><div className="s-icon-box">📗</div></div>
            <div className="s-card notices"><div className="s-header">Notices</div><div className="s-value">2</div><div className="s-sub">New updates</div><div className="s-icon-box">📙</div></div>
            <div className="s-card complaints"><div className="s-header">Complaints</div><div className="s-value">1</div><div className="s-sub">In Progress</div><div className="s-icon-box">📘</div></div>
            <div className="s-card mess"><div className="s-header">Mess</div><div className="s-value">Lunch</div><div className="s-sub">12:30 PM - 2:00 PM</div><div className="s-icon-box">🍽️</div></div>
         </div>
      </section>

      {/* ── 4. Main Grid ── */}
      <div className="staynest-main-grid">
         
         {/* Left Column */}
         <div className="sn-col">
            <div className="sn-card">
               <h4 className="sn-card-title">Payments Overview</h4>
               <div className="sn-price-row">
                  <div><span className="sn-label">Total Due</span><br/><strong>₹5,000</strong></div>
                  <span className="sn-badge-red">Due in 3 days</span>
               </div>
               <div className="sn-price-row">
                  <div><span className="sn-label">Paid This Month</span><br/><strong>₹3,000</strong></div>
               </div>
               <div className="sn-progress-box">
                  <div className="sn-progress-bg"><div className="sn-progress-fill" style={{ width: '60%' }}></div></div>
                  <span className="sn-label">60% Paid</span>
               </div>
               <button className="sn-btn-outline">View Payment History</button>
            </div>

            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">My Complaints</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-complaint-box">
                  <div className="sn-header-row"><strong>Plumbing issue in bathroom</strong> <span className="sn-badge-blue">In Progress</span></div>
                  <p>Raised on 18 May, 10:30 AM</p>
                  <p>Last updated 2 hours ago</p>
               </div>
               <button className="sn-btn-outline">Raise New Complaint</button>
            </div>
         </div>

         {/* Middle Column */}
         <div className="sn-col">
            <div className="sn-card">
               <h4 className="sn-card-title">Room & Facilities</h4>
               <div className="sn-facility-list">
                  <div className="sn-f-row"><span className="sn-f-left">📶 WiFi</span> <span className="sn-f-mid">50 Mbps</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">⚡ Power Backup</span> <span className="sn-f-mid">Available</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">💧 Water Supply</span> <span className="sn-f-mid">Available</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">🧹 Room Cleaning</span> <span className="sn-f-mid">Pending</span> <span className="sn-link-orange">Request</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">🧼 Washroom</span> <span className="sn-f-mid">Needs Clean</span> <span className="sn-link-red">Report</span></div>
               </div>
            </div>

            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Today's Menu</h4>
                  <span className="sn-link">View Weekly Menu</span>
               </div>
               <div className="sn-menu-item"><span className="sn-m-icon">🍱</span> <div><strong>Lunch</strong><br/><span>Rice, Dal, Mix Veg, Salad</span></div> <span className="sn-m-time">12:30 PM - 2:00 PM</span></div>
               <div className="sn-menu-item"><span className="sn-m-icon">🥘</span> <div><strong>Dinner</strong><br/><span>Roti, Paneer Butter Masala, Veg Pulao</span></div> <span className="sn-m-time">7:30 PM - 9:30 PM</span></div>
               <button className="sn-btn-outline">Give Feedback</button>
            </div>

            <div className="sn-card quick-actions-sn">
               <h4 className="sn-card-title">Quick Actions</h4>
               <div className="qa-grid-sn">
                  <div className="qa-sn-item"><div className="qa-sn-icon green">💰</div><span>Pay Rent</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon purple">🍱</div><span>Book Meal</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon orange">📄</div><span>Raise Comp.</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon blue">🧹</div><span>Request Clean</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon pink">👤</div><span>Visitor Entry</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon sky">🎧</div><span>Help Desk</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon violet">👥</div><span>My Visitors</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon yellow">📙</div><span>Notices</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon emerald">⭐</div><span>Feedback</span></div>
                  <div className="qa-sn-item"><div className="qa-sn-icon gray">•••</div><span>More</span></div>
               </div>
            </div>
         </div>

         {/* Right Column */}
         <div className="sn-col">
            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Notices & Updates</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-notice-item">
                  <div className="sn-n-icon red">🔧</div>
                  <div className="sn-n-text"><strong>Elevator Maintenance</strong> <span className="sn-badge-red-sm">Urgent</span><br/><span>Under repair tomorrow 10AM-12PM</span><br/><small>Today</small></div>
               </div>
               <div className="sn-notice-item">
                  <div className="sn-n-icon blue">🎬</div>
                  <div className="sn-n-text"><strong>Movie Night</strong><br/><span>This Saturday at the common lounge!</span><br/><small>Yesterday</small></div>
               </div>
               <div className="sn-notice-item">
                  <div className="sn-n-icon orange">🥘</div>
                  <div className="sn-n-text"><strong>Mess Holiday</strong><br/><span>Mess will be closed on 25 May (Sunday)</span><br/><small>18 May</small></div>
               </div>
            </div>

            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Recent Activity</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-activity-list">
                  <div className="sn-act-row"><span className="sn-act-dot green"></span> <div><strong>Rent Paid</strong><br/><span>May rent paid successfully</span><br/><small>2 days ago</small></div></div>
                  <div className="sn-act-row"><span className="sn-act-dot blue"></span> <div><strong>Complaint Updated</strong><br/><span>Your complaint has been updated</span><br/><small>2 hours ago</small></div></div>
                  <div className="sn-act-row"><span className="sn-act-dot purple"></span> <div><strong>New Notice</strong><br/><span>New notice posted</span><br/><small>Yesterday</small></div></div>
               </div>
               <button className="sn-btn-outline">View All Activity</button>
            </div>

            <div className="sn-card loyalty-card-sn">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Loyalty Rewards</h4>
                  <span className="trophy">🏆</span>
               </div>
               <div className="loyalty-val"><strong>450</strong> pts</div>
               <div className="sn-progress-bg-p"><div className="sn-progress-fill-p" style={{ width: '70%' }}></div></div>
               <p className="loyalty-sub">50 points to Gold Status</p>
               <button className="sn-btn-p-outline">View Rewards</button>
            </div>

            <div className="sn-card help-card-sn">
               <div className="help-flex">
                  <div>
                     <h4 className="sn-card-title">Need Help?</h4>
                     <p>Our support team is here to help you anytime.</p>
                     <button className="sn-btn-green-solid">Contact Support</button>
                  </div>
                  <div className="help-img">👩‍💻</div>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}

export default Dashboard;
