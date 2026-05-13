import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Filter,
  Eye,
  MoreVertical,
  Flag,
  Trash2,
  Bell
} from 'lucide-react';
import { api } from '../mockData';
import './Community.css';

const Community = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  
  const [activeTab, setActiveTab] = useState('lost-found');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    lostFound: [],
    sos: [],
    confidentialReports: []
  });

  useEffect(() => {
    fetchCommunityData();
  }, [activeBuildingId]);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      // Mocking Lost & Found and SOS for now as they might not have backend yet
      // But fetching Confidential Reports from real backend
      const res = await fetch(`http://localhost:5000/api/confidential-reports`);
      const reports = await res.json();
      
      setData({
        lostFound: [
          { id: 1, item: 'iPhone 13', type: 'Lost', location: 'Mess Hall', date: '2026-05-12', status: 'Pending', reportedBy: 'Rahul S.' },
          { id: 2, item: 'Blue Wallet', type: 'Found', location: 'Entrance Gate', date: '2026-05-11', status: 'Claimed', reportedBy: 'Staff Member' },
          { id: 3, item: 'Keys with Keychain', type: 'Found', location: 'Room 302 Balcony', date: '2026-05-10', status: 'Available', reportedBy: 'Anjali P.' },
        ],
        sos: [
          { id: 1, type: 'Medical', message: 'Severe chest pain reported in Room 405', location: 'Floor 4', time: '5 mins ago', status: 'Active' },
          { id: 2, type: 'Security', message: 'Suspicious person seen near backdoor', location: 'Perimeter', time: '1 hour ago', status: 'Resolved' },
        ],
        confidentialReports: Array.isArray(reports) ? reports : []
      });
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const tabs = [
    { id: 'lost-found', name: 'Lost & Found', icon: <Search size={18} /> },
    { id: 'sos', name: 'SOS Alerts', icon: <AlertOctagon size={18} /> },
    { id: 'confidential', name: 'Confidential reporting', icon: <ShieldAlert size={18} /> }
  ];

  return (
    <div className="community-page">
      <header className="page-header">
        <div>
          <h1><Users size={32} /> Community Hub</h1>
          <p>Monitor security, reports, and community interactions.</p>
        </div>
        <button onClick={fetchCommunityData} className="refresh-btn">
          <Bell size={18} /> Sync Updates
        </button>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={activeTab === tab.id ? 'active' : ''} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>

      <div className="content-area">
        <AnimatePresence mode="wait">
          {activeTab === 'lost-found' && (
            <motion.div 
              key="lost-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid-container"
            >
              {data.lostFound.map(item => (
                <div key={item.id} className="glass-card item-card">
                  <div className="card-header">
                    <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
                    <span className="date">{item.date}</span>
                  </div>
                  <h3>{item.item}</h3>
                  <div className="details">
                    <p><MapPin size={14} /> {item.location}</p>
                    <p><Users size={14} /> {item.reportedBy}</p>
                  </div>
                  <div className="card-footer">
                    <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                    <button className="action-btn"><Eye size={16} /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'sos' && (
            <motion.div 
              key="sos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sos-list"
            >
              {data.sos.map(alert => (
                <div key={alert.id} className={`sos-card ${alert.status.toLowerCase()}`}>
                  <div className="sos-icon">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="sos-info">
                    <div className="sos-header">
                      <h4>{alert.type} Emergency</h4>
                      <span className="time">{alert.time}</span>
                    </div>
                    <p>{alert.message}</p>
                    <div className="sos-location">
                      <MapPin size={14} /> {alert.location}
                    </div>
                  </div>
                  <div className="sos-actions">
                    <button className="resolve-btn">Resolve</button>
                    <button className="dispatch-btn">Dispatch</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'confidential' && (
            <motion.div 
              key="confidential"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="reports-container"
            >
              <div className="table-header">
                <h2>Reports History</h2>
                <div className="filters">
                  <button><Filter size={16} /> Filter</button>
                </div>
              </div>
              <div className="reports-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.confidentialReports.length === 0 ? (
                      <tr><td colSpan="6" className="empty-state">No confidential reports found.</td></tr>
                    ) : data.confidentialReports.map(report => (
                      <tr key={report._id}>
                        <td>{report.title || 'Untitled Report'}</td>
                        <td>{report.category}</td>
                        <td>
                          <span className="priority-dot" style={{ background: getPriorityColor(report.priority) }}></span>
                          {report.priority}
                        </td>
                        <td><span className={`status-pill ${report.status.toLowerCase()}`}>{report.status}</span></td>
                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td className="actions">
                          <button className="icon-btn"><Eye size={16} /></button>
                          <button className="icon-btn"><Flag size={16} /></button>
                          <button className="icon-btn danger"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;
