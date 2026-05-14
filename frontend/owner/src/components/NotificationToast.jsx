import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationToast.css';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!notification) return null;

  return (
    <div className={`notif-toast-premium ${isVisible ? 'show' : 'hide'} ${notification.priority?.toLowerCase()}`}>
      <div className="toast-icon">
        {getIcon(notification.category)}
      </div>
      <div className="toast-content">
        <div className="toast-header">
          <span className="toast-module">{notification.moduleName}</span>
          <span className="toast-priority">{notification.priority}</span>
        </div>
        <h4 className="toast-title">{notification.title}</h4>
        <p className="toast-msg">{notification.message}</p>
        <button className="toast-btn-quick" onClick={() => {
           if (notification.actionLink) navigate(notification.actionLink);
           onClose();
        }}>View Details</button>
      </div>
      <button className="toast-close" onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }}>✕</button>
      <div className="toast-progress"></div>
    </div>
  );
};

const getIcon = (cat) => {
  switch (cat?.toLowerCase()) {
    case 'rent': return '💰';
    case 'maintenance': return '🛠️';
    case 'security': return '🛡️';
    case 'services': return '🧺';
    default: return '🔔';
  }
};

export default NotificationToast;
