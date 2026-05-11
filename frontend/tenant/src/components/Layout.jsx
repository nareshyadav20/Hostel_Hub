import React, { useState, useEffect } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: 'Hi! I am your Livora Hostel AI. I can help you with room bookings, mess menus, or any other facility details. How can I assist you today?' }
  ]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token && !!user.name;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleSendAiMessage = (msg = null) => {
    const text = msg || aiMessage;
    if (!text.trim()) return;

    const newChat = [...aiChat, { role: 'user', content: text }];
    setAiChat(newChat);
    setAiMessage('');
    setIsTyping(true);

    // Expanded Deep Knowledge Base for "Full Training"
    setTimeout(() => {
      let response = "I'm sorry, I'm still learning about that. You can contact the warden for specific details, or try asking about rooms, mess, WiFi, or laundry!";
      const lowerText = text.toLowerCase();
      
      // Basic Info & Booking
      if (lowerText.includes('room') || lowerText.includes('booking') || lowerText.includes('sharing') || lowerText.includes('bed')) {
        response = "We offer Premium Single, 2-Sharing, and 3-Sharing rooms. All rooms are fully furnished with study tables, wardrobes, and attached washrooms. You can book directly through the Listing page!";
      } 
      // Food & Mess
      else if (lowerText.includes('mess') || lowerText.includes('food') || lowerText.includes('meal') || lowerText.includes('dinner') || lowerText.includes('breakfast') || lowerText.includes('lunch') || lowerText.includes('eat')) {
        response = "Our mess serves 3 nutritious meals a day. We prioritize hygiene and variety in our weekly menu. Check the 'Mess' section for the full schedule and today's specials!";
      } 
      // Pricing & Payments
      else if (lowerText.includes('price') || lowerText.includes('rent') || lowerText.includes('cost') || lowerText.includes('fee') || lowerText.includes('payment') || lowerText.includes('bill')) {
        response = "Rent starts from ₹9,000/month for 3-sharing and ₹12,000/month for 2-sharing. This includes food, WiFi, cleaning, and utilities. You can pay your rent via the 'Payments' tab.";
      } 
      // Utilities & Tech
      else if (lowerText.includes('wifi') || lowerText.includes('internet') || lowerText.includes('speed') || lowerText.includes('network')) {
        response = "We provide high-speed 100 Mbps dedicated WiFi for all residents. There are no data caps, perfect for students and professionals!";
      } else if (lowerText.includes('power') || lowerText.includes('electricity') || lowerText.includes('backup') || lowerText.includes('ups') || lowerText.includes('generator')) {
        response = "We have 24/7 power backup through heavy-duty generators. Your fans, lights, and WiFi will work seamlessly during power cuts!";
      } else if (lowerText.includes('water') || lowerText.includes('drinking') || lowerText.includes('ro') || lowerText.includes('purifier') || lowerText.includes('hot water')) {
        response = "We have 24/7 hot/cold water supply and UV+RO purifiers on every floor. Safety and hydration are guaranteed!";
      } else if (lowerText.includes('ac') || lowerText.includes('air conditioning') || lowerText.includes('cooler')) {
        response = "Premium rooms come with high-efficiency ACs. Standard rooms have heavy-duty ceiling fans and great ventilation.";
      }
      // Amenities & Facilities
      else if (lowerText.includes('gym') || lowerText.includes('fitness') || lowerText.includes('workout') || lowerText.includes('exercise')) {
        response = "Yes! We have a dedicated fitness zone with modern equipment available for all residents from 6 AM to 10 PM.";
      } else if (lowerText.includes('laundry') || lowerText.includes('wash') || lowerText.includes('cloth') || lowerText.includes('iron')) {
        response = "Professional laundry services are available 3 times a week. Drop your clothes at the desk, and they'll be returned clean and folded!";
      } else if (lowerText.includes('parking') || lowerText.includes('bike') || lowerText.includes('cycle') || lowerText.includes('car')) {
        response = "We provide secure basement parking for 2-wheelers. 4-wheeler parking is available in the vicinity with prior notice.";
      } else if (lowerText.includes('tv') || lowerText.includes('movie') || lowerText.includes('common') || lowerText.includes('game') || lowerText.includes('recreation')) {
        response = "Our common lounge has a 65-inch Smart TV, board games, and comfy seating for community chill-out sessions.";
      }
      // Safety & Rules
      else if (lowerText.includes('safety') || lowerText.includes('secure') || lowerText.includes('security') || lowerText.includes('emergency') || lowerText.includes('guard')) {
        response = "Your safety is our priority. 24/7 CCTV, biometric entry, and on-site security. Use the SOS button in the 'Safety' section for emergencies.";
      } else if (lowerText.includes('visitor') || lowerText.includes('friend') || lowerText.includes('parent') || lowerText.includes('guest')) {
        response = "Visitors are allowed in the lobby from 9 AM to 8 PM. Parents can stay overnight in designated guest rooms with warden's permission.";
      } else if (lowerText.includes('curfew') || lowerText.includes('time') || lowerText.includes('late') || lowerText.includes('entry')) {
        response = "Our standard in-time is 10:30 PM for safety. Late entries are allowed for work or study with a simple digital gate pass.";
      }
      // Management & Admin
      else if (lowerText.includes('complaint') || lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('broken') || lowerText.includes('fix')) {
        response = "If you face any issue, raise a ticket in the 'Complaints' section. Our maintenance team usually fixes it within 24 hours!";
      } else if (lowerText.includes('notice') || lowerText.includes('leave') || lowerText.includes('vacate') || lowerText.includes('refund')) {
        response = "We require a 30-day notice period before vacating. Security deposits are processed within 15 days of checkout.";
      } else if (lowerText.includes('document') || lowerText.includes('id') || lowerText.includes('aadhaar') || lowerText.includes('proof')) {
        response = "For move-in, we need your ID proof (Aadhaar/DL), college/work ID, and 2 passport-size photos for the hostel registry.";
      } else if (lowerText.includes('event') || lowerText.includes('party') || lowerText.includes('celebration') || lowerText.includes('birthday')) {
        response = "We love community! We celebrate birthdays, festivals, and organize monthly social events for all residents.";
      } else if (lowerText.includes('warden') || lowerText.includes('manager') || lowerText.includes('contact desk')) {
        response = "You can contact the Warden (Mr. Rajesh) at +91 98765 43210. His office is located on the Ground Floor near the main entrance.";
      } else if (lowerText.includes('livora') || lowerText.includes('who') || lowerText.includes('about')) {
        response = "Livora is a premium student living brand providing a high-end 'Home away from Home' with focus on comfort, safety, and community.";
      }

      setAiChat([...newChat, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);
  const [modalData, setModalData] = useState({ gender: 'Male', age: '', occupation: '', locationPref: '', roomPref: 'Double' });

  useEffect(() => {
    if (isLoggedIn && user.profileCompletion === 25) {
      setShowProfileModal(true);
    }
  }, [isLoggedIn, user.profileCompletion]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...modalData, profileCompletion: 50 };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
    setShowProfileModal(false);
    window.location.reload();
  };

  return (
    <div className="layout-root">
      {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className={isLoggedIn ? "main-content" : "main-content guest"}>
        <header className="content-header">
          {isLoggedIn && (
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

          <div className="user-profile">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <div className="notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>

                <div className="avatar-container" ref={dropdownRef}>
                  <div className="profile-mini-box" onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="profile-text">
                      <span className="p-name">{user.name || 'Guest User'}</span>
                      <span className="p-role">Premium Resident</span>
                    </div>
                    <div className="profile-avatar">
                      <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=10b981&color=fff`}
                        alt="Profile"
                      />
                    </div>
                  </div>

                  {showDropdown && (
                    <div className="profile-dropdown glass-card">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar-large">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="dropdown-user-info">
                          <h4>{user.name || 'uma'}</h4>
                          <p>{user.email || 'uma@gmail.com'}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>

                      {user.profileCompletion && user.profileCompletion < 100 && (
                        <div className="setup-progress-card">
                          <div className="setup-progress-header">
                            <span>Setup Progress</span>
                            <span className="setup-percent">{user.profileCompletion}%</span>
                          </div>
                          <div className="setup-progress-bar">
                            <div className="setup-progress-fill" style={{ width: `${user.profileCompletion}%` }}></div>
                          </div>

                          {user.profileCompletion < 50 && (
                            <button className="btn-primary-small" onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}>
                              Complete Profile
                            </button>
                          )}
                          {user.profileCompletion === 50 && (
                            <div className="setup-next-step">
                              Next: Book a Room to Verify ID
                            </div>
                          )}
                        </div>
                      )}

                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                      </button>
                      <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/payments'); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Payments
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="guest-nav">
                <Link to="/login" className="nav-btn">Sign In</Link>
                <Link to="/signup" className="nav-btn primary">Sign Up</Link>
              </div>
            )}
          </div>
        </header>

        <div className="content-body">
          <div className="content-wrapper">
            {children}
          </div>

          <footer className="layout-footer">
            <p>© 2024 StayNest All rights reserved.</p>
          </footer>
        </div>


        {isLoggedIn && (
          <button className="global-ai-help-fab" onClick={() => setIsAiOpen(true)}>
            <div className="ai-fab-content">
              <div className="ai-fab-icon-box">
                <Bot size={22} />
              </div>
              <div className="ai-fab-text">
                <strong>Hostel AI</strong>
                <span>Instant Help</span>
              </div>
            </div>
          </button>
        )}

        {isAiOpen && (
          <div className="ai-modal-overlay fade-in">
            <div className="ai-modal-content glass-card slide-up">
              <div className="ai-modal-header">
                <div className="ai-header-left">
                  <div className="ai-bot-avatar">
                    <Bot size={24} color="white" />
                    <div className="online-indicator"></div>
                  </div>
                  <div>
                    <h3>Livora AI Assistant</h3>
                    <p>Powered by Smart Sync</p>
                  </div>
                </div>
                <button className="ai-close-btn" onClick={() => setIsAiOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="ai-chat-history">
                {aiChat.map((msg, idx) => (
                  <div key={idx} className={`ai-message-row ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="ai-bubble-avatar">
                        <Bot size={14} />
                      </div>
                    )}
                    <div className="ai-message-bubble">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="ai-message-row assistant">
                    <div className="ai-bubble-avatar">
                      <Bot size={14} />
                    </div>
                    <div className="ai-message-bubble typing">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="ai-quick-actions">
                <button className="ai-chip" onClick={() => handleSendAiMessage('Show me room availability')}>
                  <Sparkles size={12} /> Room Availability
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage("Today's mess menu")}>
                  <Sparkles size={12} /> Mess Menu
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage('Hostel Pricing')}>
                  <Sparkles size={12} /> Pricing Info
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage('WiFi Details')}>
                  <Sparkles size={12} /> WiFi Details
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage('Laundry Status')}>
                  <Sparkles size={12} /> Laundry Status
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage('Safety SOS')}>
                  <Sparkles size={12} /> Safety SOS
                </button>
                <button className="ai-chip" onClick={() => handleSendAiMessage('Contact Warden')}>
                  <Sparkles size={12} /> Contact Warden
                </button>
              </div>

              <div className="ai-chat-input-area">
                <div className="ai-input-container">
                  <input 
                    type="text" 
                    placeholder="Ask Livora AI..." 
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  />
                  <button className="ai-send-btn" onClick={() => handleSendAiMessage()} disabled={!aiMessage.trim()}>
                    <Send size={18} />
                  </button>
                </div>
              </div>

              <div className="ai-footer-branding">
                Powered by Smart Sync & Livora Engine
              </div>
            </div>
          </div>
        )}

        {isLoggedIn && <BottomNav />}

        {showProfileModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-card fade-in">
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="modal-header">
                <div className="modal-icon-bg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2>Step 2: Preferences</h2>
                <p>Complete your profile to see better matches.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="modal-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Age</label>
                    <input type="number" placeholder="e.g. 22" value={modalData.age} onChange={e => setModalData({ ...modalData, age: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select value={modalData.gender} onChange={e => setModalData({ ...modalData, gender: e.target.value })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Occupation</label>
                  <select value={modalData.occupation} onChange={e => setModalData({ ...modalData, occupation: e.target.value })} required>
                    <option value="">Select Occupation</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Working Professional</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Preferred Location</label>
                  <input type="text" placeholder="e.g. Koramangala, Bengaluru" value={modalData.locationPref} onChange={e => setModalData({ ...modalData, locationPref: e.target.value })} required />
                </div>

                <div className="input-group">
                  <label>Room Preference</label>
                  <select value={modalData.roomPref} onChange={e => setModalData({ ...modalData, roomPref: e.target.value })}>
                    <option value="Single">Single Room</option>
                    <option value="Double">2 Sharing</option>
                    <option value="Triple">3 Sharing</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>Save & Resume Later</button>
                  <button type="submit" className="btn-primary">Complete Step 2</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
