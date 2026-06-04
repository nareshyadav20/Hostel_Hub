import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Bell, ShieldAlert, AlertTriangle, CheckCircle, Info, X, ChevronRight, Clock } from 'lucide-react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import BottomNav from './BottomNav';
import './Layout.css';
import API from '../api/axios';
import socket from '../utils/socket';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

// ── Toast Component ───────────────────────────────────────────
const Toast = ({ notification, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'error': return <ShieldAlert size={20} color="#EF4444" />;
      case 'warning': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'success': return <CheckCircle size={20} color="#10B981" />;
      default: return <Info size={20} color="#3B82F6" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        gap: '1rem',
        width: '320px',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        background: 'var(--accent-primary)',
        width: '100%',
        animation: 'toast-progress 5s linear forwards'
      }} />
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon(notification.type)}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
          {notification.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          {notification.message}
        </p>
      </div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', alignSelf: 'flex-start' }}>
        <X size={16} />
      </button>
    </motion.div>
  );
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isListingPage = location.pathname.startsWith('/listing');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeToasts, setActiveToasts] = useState([]);

  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: 'Hi! I am your Livora Hostel AI. I can help you with room bookings, mess menus, or any other facility details. How can I assist you today?' }
  ]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token && !!user.name;

  // Use global notification context
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  } = useNotifications();

  // Toast Listener
  useEffect(() => {
    const handleNewNotif = (notif) => {
      // ONLY show if it's meant for Tenants
      if (notif.portalType === 'Tenant' || notif.portalType === 'All') {
        setActiveToasts(prev => {
          const exists = prev.some(t => (t._id || t.id) === (notif._id || notif.id));
          if (exists) return prev;
          return [...prev, { ...notif, toastId: Date.now() }];
        });
      }
    };

    socket.on('newNotification', handleNewNotif);
    return () => socket.off('newNotification', handleNewNotif);
  }, []);

  // Click outside listener for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = React.useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes toast-progress {
        from { width: 100%; }
        to { width: 0%; }
      }
      @keyframes pulse-badge {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      .badge-pulse {
        animation: pulse-badge 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleSendAiMessage = async (msg = null) => {
    const text = msg || aiMessage;
    if (!text.trim()) return;

    const newChat = [...aiChat, { role: 'user', content: text }];
    setAiChat(newChat);
    setAiMessage('');
    setIsTyping(true);

    // Smart keyword matcher helper
    const lowerText = text.toLowerCase().trim();
    const match = (keywords) => keywords.some(kw => lowerText.includes(kw));

    setTimeout(() => {
      let response = "";

      // ── Greetings & Conversation ──
      if (match(['hello', 'hi ', 'hey', 'hii', 'hola', 'namaste', 'good morning', 'good afternoon', 'good evening', 'good night', 'sup', 'howdy', 'yo']) || lowerText === 'hi') {
        const greetings = [
          `Hey ${user.name ? user.name.split(' ')[0] : 'there'}! 👋 Welcome to Livora AI. How can I help you today? You can ask about rooms, mess, payments, WiFi, or anything about hostel life!`,
          `Hi there! 😊 I'm your Livora assistant. Feel free to ask me about room availability, mess menus, laundry, WiFi, or any hostel facilities!`,
          `Hello! 🏠 Great to see you. I can help with bookings, pricing, amenities, complaints, and more. What would you like to know?`
        ];
        response = greetings[Math.floor(Math.random() * greetings.length)];
      }
      // ── Thank you / Bye ──
      else if (match(['thank', 'thanks', 'thx', 'appreciate', 'helpful', 'awesome', 'great', 'nice', 'cool', 'perfect'])) {
        const thanks = [
          "You're welcome! 😊 Feel free to ask anytime. I'm here 24/7 to help!",
          "Happy to help! If you need anything else, just ask. 🙌",
          "Glad I could assist! Don't hesitate to reach out again. 💪"
        ];
        response = thanks[Math.floor(Math.random() * thanks.length)];
      }
      else if (match(['bye', 'goodbye', 'see you', 'later', 'gotta go', 'ttyl'])) {
        response = `Bye ${user.name ? user.name.split(' ')[0] : ''}! 👋 Have a great day. I'm always here whenever you need help!`;
      }
      // ── Help / What can you do ──
      else if (match(['help', 'assist', 'what can you', 'what do you', 'support', 'guide', 'how to', 'how do i', 'can you'])) {
        response = "I can help you with:\n\n🏠 **Rooms & Booking** — availability, types, pricing\n🍽️ **Mess & Food** — menus, timings, diet options\n💰 **Payments & Rent** — bills, dues, payment methods\n📶 **WiFi & Internet** — speed, connectivity\n👕 **Laundry** — schedules, services\n🔒 **Safety & Security** — CCTV, SOS, guards\n🏋️ **Amenities** — gym, parking, common areas\n📝 **Complaints** — raise and track issues\n📞 **Contact Warden** — phone, office location\n\nJust type your question and I'll do my best!";
      }
      // ── Room & Booking ──
      else if (match(['room', 'booking', 'sharing', 'bed', 'occupancy', 'vacancy', 'available', 'accommodation', 'stay', 'allot', 'assign', 'single', 'double', 'triple', 'dormitory', 'dorm', 'furnished'])) {
        response = "🏠 We offer Premium Single, 2-Sharing, and 3-Sharing rooms. All rooms are fully furnished with study tables, wardrobes, and attached washrooms. You can book directly through the Listing page! Use the 'Room Availability' quick action to see what's open.";
      }
      // ── Food & Mess ──
      else if (match(['mess', 'food', 'meal', 'dinner', 'breakfast', 'lunch', 'eat', 'menu', 'snack', 'tiffin', 'canteen', 'kitchen', 'diet', 'veg', 'non-veg', 'nonveg', 'jain', 'nutrition', 'hungry', 'thali'])) {
        response = "🍽️ Our mess serves 3 nutritious meals a day with both veg and non-veg options. We prioritize hygiene and variety in our weekly rotating menu. Check the 'Mess' section in the app for the full schedule, today's specials, and upcoming menus!";
      }
      // ── Pricing & Payments ──
      else if (match(['price', 'rent', 'cost', 'fee', 'payment', 'bill', 'money', 'charge', 'deposit', 'amount', 'dues', 'pay', 'upi', 'transaction', 'invoice', 'receipt', 'affordable', 'budget', 'expensive', 'cheap'])) {
        response = "💰 Rent starts from ₹9,000/month for 3-sharing and ₹12,000/month for 2-sharing. This includes food, WiFi, cleaning, and utilities. You can view and pay your rent via the 'Payments' tab in the app. We accept UPI, net banking, and card payments!";
      }
      // ── WiFi & Internet ──
      else if (match(['wifi', 'wi-fi', 'internet', 'speed', 'network', 'broadband', 'data', 'bandwidth', 'connection', 'online', 'stream', 'download'])) {
        response = "📶 We provide high-speed 100 Mbps dedicated WiFi for all residents — no data caps! Perfect for streaming, studying, and video calls. If you face connectivity issues, report it via the Complaints section.";
      }
      // ── Power & Electricity ──
      else if (match(['power', 'electricity', 'backup', 'ups', 'generator', 'inverter', 'voltage', 'outage', 'blackout', 'current'])) {
        response = "⚡ We have 24/7 power backup through heavy-duty generators. Your fans, lights, and WiFi will work seamlessly during power cuts — zero downtime guaranteed!";
      }
      // ── Water ──
      else if (match(['water', 'drinking', 'purifier', 'hot water', 'geyser', 'shower', 'bath'])) {
        response = "💧 We have 24/7 hot & cold water supply and UV+RO purifiers on every floor. Hot water geysers are available in all washrooms for comfortable bathing!";
      }
      // ── AC & Cooling ──
      else if (match(['ac', 'air conditioning', 'cooler', 'fan', 'cooling', 'heater', 'temperature'])) {
        response = "❄️ Premium rooms come with high-efficiency split ACs. Standard rooms have heavy-duty ceiling fans and great ventilation. You can request AC room upgrades through the app!";
      }
      // ── Gym & Fitness ──
      else if (match(['gym', 'fitness', 'workout', 'exercise', 'yoga', 'sports', 'play'])) {
        response = "🏋️ Yes! We have a dedicated fitness zone with modern equipment available from 6 AM to 10 PM. Some properties also have outdoor sports areas and yoga spaces!";
      }
      // ── Laundry ──
      else if (match(['laundry', 'wash', 'cloth', 'iron', 'pressing', 'dry clean', 'dryer'])) {
        response = "👕 Professional laundry services are available 3 times a week (Mon/Wed/Fri). Drop your clothes at the collection desk by 9 AM, and they'll be returned clean and folded the same evening!";
      }
      // ── Parking & Transport ──
      else if (match(['parking', 'bike', 'cycle', 'car', 'vehicle', 'scooter', 'two wheeler', 'garage'])) {
        response = "🅿️ We provide secure basement parking for 2-wheelers with CCTV monitoring. 4-wheeler parking is available nearby with prior notice. Bicycle stands are available at the entrance!";
      }
      // ── Common Areas & Recreation ──
      else if (match(['tv', 'movie', 'common', 'game', 'recreation', 'lounge', 'hangout', 'chill', 'entertainment'])) {
        response = "🎮 Our common lounge has a 65-inch Smart TV, board games, TT table, and comfy seating for community hangouts. Movie nights are organized every weekend!";
      }
      // ── Safety & Security ──
      else if (match(['safety', 'secure', 'security', 'emergency', 'guard', 'cctv', 'camera', 'sos', 'fire', 'theft', 'biometric', 'lock'])) {
        response = "🔒 Your safety is our top priority! We have 24/7 CCTV surveillance, biometric entry, fire extinguishers, and trained security guards. Use the SOS feature in the app for emergencies!";
      }
      // ── Visitors & Guests ──
      else if (match(['visitor', 'friend', 'parent', 'guest', 'relative', 'visit'])) {
        response = "👥 Visitors are allowed in the lobby area from 9 AM to 8 PM. Parents can stay overnight in designated guest rooms with warden's permission. All visitors must register at the reception.";
      }
      // ── Curfew & Timings ──
      else if (match(['curfew', 'timing', 'late', 'in-time', 'gate', 'entry time', 'closing', 'open', 'hours', 'schedule'])) {
        response = "🕐 Standard in-time is 10:30 PM for safety. Late entries are allowed for work or study with a simple digital gate pass — apply through the app before 9 PM!";
      }
      // ── Complaints & Issues ──
      else if (match(['complaint', 'problem', 'issue', 'broken', 'fix', 'repair', 'maintenance', 'not working', 'damage', 'bug', 'report', 'ticket'])) {
        response = "📝 If you face any issue, raise a ticket in the 'Complaints' section of the app. Our maintenance team usually resolves issues within 24 hours. You can track your complaint status in real-time!";
      }
      // ── Notice & Vacating ──
      else if (match(['notice', 'vacate', 'refund', 'checkout', 'check-out', 'moving out', 'cancel', 'cancellation', 'terminate'])) {
        response = "📋 We require a 30-day notice period before vacating. Security deposits are processed within 15 business days of checkout. Submit your notice through the app or contact the warden directly.";
      }
      // ── Check-in & Move-in ──
      else if (match(['check-in', 'checkin', 'check in', 'move-in', 'move in', 'moving in', 'join', 'admission', 'register', 'enroll', 'onboard'])) {
        response = "🏡 Welcome aboard! For check-in, bring your ID proof (Aadhaar/DL), college/work ID, and 2 passport-size photos. Complete your profile setup in the app to speed up the process!";
      }
      // ── Documents & ID ──
      else if (match(['document', 'aadhaar', 'proof', 'verification', 'verify', 'kyc', 'passport', 'id proof', 'identity', 'pan card'])) {
        response = "📄 For move-in, we need your ID proof (Aadhaar/DL), college/work ID, and 2 passport-size photos. You can upload these digitally through the profile setup section in the app!";
      }
      // ── Events & Community ──
      else if (match(['event', 'party', 'celebration', 'birthday', 'festival', 'diwali', 'holi', 'christmas', 'new year', 'social'])) {
        response = "🎉 We love community! We celebrate birthdays, festivals (Diwali, Holi, and more), and organize monthly social events, movie nights, and game tournaments for all residents!";
      }
      // ── Warden & Contact ──
      else if (match(['warden', 'manager', 'contact', 'phone', 'call', 'reach', 'office', 'reception', 'front desk', 'admin', 'staff'])) {
        response = "📞 You can contact the Warden (Mr. Rajesh) at +91 98765 43210. His office is on the Ground Floor near the main entrance, open 9 AM – 6 PM. For urgent matters, use the SOS feature!";
      }
      // ── About Livora ──
      else if (match(['livora', 'who', 'about', 'what is', 'tell me'])) {
        response = "🏠 Livora is a premium student living brand providing a high-end 'Home away from Home' experience. We focus on comfort, safety, community, and smart technology to make hostel life amazing!";
      }
      // ── Cleaning & Housekeeping ──
      else if (match(['clean', 'housekeep', 'sweep', 'mop', 'dust', 'hygiene', 'sanitize', 'pest', 'cockroach', 'mosquito'])) {
        response = "🧹 Daily housekeeping is included! Common areas are cleaned twice a day, and room cleaning happens 3 times a week. Pest control is done monthly. Report any hygiene concerns via the Complaints section.";
      }
      // ── Study & Work ──
      else if (match(['study', 'library', 'reading', 'exam', 'work from home', 'wfh', 'workspace', 'desk', 'quiet'])) {
        response = "📚 We have a dedicated study room/library that's open 24/7 with high-speed WiFi, charging points, and quiet zones. Perfect for exam prep and work-from-home sessions!";
      }
      // ── Medical & Health ──
      else if (match(['medical', 'doctor', 'health', 'sick', 'hospital', 'clinic', 'fever', 'medicine', 'first aid', 'ambulance', 'ill', 'unwell'])) {
        response = "🏥 We have a first-aid kit at the reception and tie-ups with nearby hospitals. For medical emergencies, use the SOS feature or contact the warden immediately. A doctor-on-call service is available!";
      }
      // ── Roommate ──
      else if (match(['roommate', 'room mate', 'partner', 'sharing with', 'co-living', 'coliving', 'neighbor', 'neighbour'])) {
        response = "🤝 Roommates are assigned based on your preferences (occupation, lifestyle). You can request specific roommates or a roommate change through the warden. We aim for the best compatibility!";
      }
      // ── Location & Address ──
      else if (match(['location', 'address', 'where', 'direction', 'map', 'nearby', 'area', 'landmark', 'distance'])) {
        response = "📍 Check the hostel location and nearby landmarks on the Listing page. Each property page shows the full address, Google Maps link, and distance from key locations like metro stations and colleges!";
      }
      // ── Rules & Policies ──
      else if (match(['rule', 'policy', 'regulation', 'guideline', 'allowed', 'prohibited', 'banned', 'smoking', 'alcohol', 'drugs', 'noise', 'pet'])) {
        response = "📜 Key rules: No smoking/alcohol on premises, quiet hours from 10 PM – 7 AM, and guests must be registered. Pets are not allowed. Full hostel guidelines are available in the app under 'Rules & Policies'.";
      }
      // ── Default Fallback (Improved) ──
      else {
        response = `🤔 I'm not sure about that specific query, but I'd love to help! Here are some topics I know well:\n\n• 🏠 Rooms & Booking\n• 🍽️ Mess & Food\n• 💰 Pricing & Payments\n• 📶 WiFi & Internet\n• 👕 Laundry\n• 🔒 Safety & Security\n• 🏋️ Gym & Amenities\n• 📝 Complaints\n• 🧹 Cleaning\n• 📞 Warden Contact\n• 📋 Check-in/Check-out\n\nTry asking about any of these, or contact the warden at +91 98765 43210 for specific queries!`;
      }

      setAiChat([...newChat, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...modalData, profileCompletion: 50 };
    
    try {
      // Send profile update to backend
      const token = localStorage.getItem('token');
      if (token) {
        await API.put('/tenant/profile', updatedUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Failed to update profile on backend', err);
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowProfileModal(false);
    window.location.reload();
  };

  return (
    <div className="layout-root">
      {/* Toast Container */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {activeToasts.map(toast => (
            <Toast
              key={toast.toastId}
              notification={toast}
              onClose={() => setActiveToasts(prev => prev.filter(t => t.toastId !== toast.toastId))}
            />
          ))}
        </AnimatePresence>
      </div>

      {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className={isLoggedIn ? "main-content" : "main-content guest"}>
        {!(isLoggedIn && isListingPage) && (
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
                  <div className="notifications-container" ref={notifRef} style={{ position: 'relative' }}>
                    <div className="notifications" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="notification-badge badge-pulse" style={{
                          position: 'absolute', top: '-5px', right: '-5px',
                          background: '#EF4444', color: 'white', borderRadius: '50%',
                          width: '18px', height: '18px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '900'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <AnimatePresence>
                      {showNotifDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="profile-dropdown glass-card"
                          style={{ right: '-10px', width: '320px', padding: '0', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                        >
                          <div className="dropdown-header" style={{ background: 'var(--bg-tertiary)', padding: '1.2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Notifications</h4>
                            {unreadCount > 0 && (
                              <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '800' }}>Mark all read</button>
                            )}
                          </div>
                          <div style={{ maxHeight: '350px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                            {notifications.length === 0 ? (
                              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Bell size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>All caught up!</p>
                              </div>
                            ) : (
                              notifications.map((n, i) => (
                                <div key={i} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.03)', display: 'flex', gap: '1rem', cursor: 'pointer', transition: '0.2s' }}
                                  onClick={async () => {
                                    if (!n.isRead) markAsRead(n._id || n.id);
                                    setShowNotifDropdown(false);
                                    if (n.moduleName === 'Complaints') navigate('/complaints');
                                    if (n.moduleName === 'Payments') navigate('/payments');
                                    if (n.moduleName === 'Mess') navigate('/mess');
                                  }}>
                                  <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '750', color: 'var(--text-primary)' }}>{n.title}</h5>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
                                      <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  {!n.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', alignSelf: 'center', flexShrink: 0 }}></div>}
                                </div>
                              ))
                            )}
                          </div>
                          <div className="dropdown-footer" style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                            <button
                              onClick={() => { setShowNotifDropdown(false); navigate('/notifications'); }}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                            >
                              View All Notifications
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
        )}

        <div className="content-body">
          <div className="content-wrapper">
            {children}
          </div>

          {!(isLoggedIn && isListingPage) && (
            <footer className="layout-footer">
              <p>© 2026 Livora All rights reserved.</p>
            </footer>
          )}
        </div>


        {isLoggedIn && (
          <button className="global-ai-help-fab" onClick={() => setIsAiOpen(true)}>
            <div className="ai-fab-content">
              <div className="ai-fab-icon-box">
                <Bot size={22} />
              </div>
              <div className="ai-fab-text">
                <strong>AI</strong>
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
