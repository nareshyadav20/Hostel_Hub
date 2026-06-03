import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle, XCircle, Clock, 
  MapPin, Users, Activity, FileText, ArrowLeft, 
  Search, Filter, Eye, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const HostelApprovalCenter = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Pending');
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: null, reason: '' });

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await API.get('/buildings');
      setBuildings(response.data);
    } catch (err) {
      console.error('Failed to fetch buildings:', err);
      showToast('error', 'Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleApprove = async () => {
    try {
      await API.patch(`/admin/buildings/${selectedBuilding._id}/approve`);
      showToast('success', 'Hostel approved successfully!');
      setActionModal({ isOpen: false, type: null, reason: '' });
      setSelectedBuilding(null);
      fetchBuildings();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Approval failed');
    }
  };

  const handleReject = async () => {
    if (!actionModal.reason.trim()) {
      showToast('error', 'Please provide a reason for rejection');
      return;
    }
    try {
      await API.patch(`/admin/buildings/${selectedBuilding._id}/reject`, { reason: actionModal.reason });
      showToast('success', 'Hostel rejected');
      setActionModal({ isOpen: false, type: null, reason: '' });
      setSelectedBuilding(null);
      fetchBuildings();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Rejection failed');
    }
  };

  const filteredBuildings = buildings.filter(b => {
    let statusMatch = false;
    if (activeTab === 'Pending') statusMatch = b.status === 'Pending Approval';
    if (activeTab === 'Approved') statusMatch = b.status === 'Active';
    if (activeTab === 'Rejected') statusMatch = b.status === 'Rejected';
    
    const searchMatch = (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (b.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-primary" size={32} />
            Approval Center
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Review and manage new property submissions.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl shadow-subtle border border-divider">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
          {['Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBuildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-divider">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No {activeTab} Properties</h3>
          <p className="text-slate-500">Everything is caught up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBuildings.map((b) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={b._id}
                className="bg-white rounded-2xl border border-divider overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group card-glow"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={b.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'} 
                    alt={b.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${
                      activeTab === 'Pending' ? 'bg-amber-100/90 text-amber-700 border border-amber-200' :
                      activeTab === 'Approved' ? 'bg-green-100/90 text-green-700 border border-green-200' :
                      'bg-red-100/90 text-red-700 border border-red-200'
                    }`}>
                      {activeTab}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{b.name || 'Unnamed Property'}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1 mb-4">
                    <MapPin size={16} />
                    <span className="text-sm line-clamp-1">{b.address || b.locationCity}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Owner</p>
                      <p className="text-sm font-semibold text-slate-900">{b.owner?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Capacity</p>
                      <p className="text-sm font-semibold text-slate-900">{b.totalRooms} Rooms</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3 pt-4 border-t border-divider">
                    <button 
                      onClick={() => setSelectedBuilding(b)}
                      className="flex-1 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 btn-enhanced"
                    >
                      <Eye size={18} /> Details
                    </button>
                    {activeTab === 'Pending' && (
                      <button 
                        onClick={() => { setSelectedBuilding(b); setActionModal({ isOpen: true, type: 'approve', reason: '' }); }}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all btn-enhanced"
                      >
                        Action
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={!!selectedBuilding && !actionModal.isOpen} onClose={() => setSelectedBuilding(null)} title="Property Details">
        {selectedBuilding && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                <img src={selectedBuilding.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d50c63'} className="w-full h-full object-cover" alt="Property" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedBuilding.name}</h3>
                <p className="text-slate-500">{selectedBuilding.address}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Submitted On</p>
                <p className="font-semibold text-slate-900">
                  {selectedBuilding.submittedAt ? new Date(selectedBuilding.submittedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Owner Contact</p>
                <p className="font-semibold text-slate-900">{selectedBuilding.owner?.phone || 'N/A'}</p>
              </div>
            </div>

            {selectedBuilding.rejectionReason && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold">Rejection Reason</h4>
                  <p className="text-sm mt-1">{selectedBuilding.rejectionReason}</p>
                </div>
              </div>
            )}

            {activeTab === 'Pending' && (
              <div className="flex gap-4 pt-4 border-t border-divider">
                <button 
                  onClick={() => setActionModal({ isOpen: true, type: 'reject', reason: '' })}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors btn-enhanced"
                >
                  Reject
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, type: 'approve', reason: '' })}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md btn-enhanced"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal (Approve/Reject) */}
      <Modal isOpen={actionModal.isOpen} onClose={() => setActionModal({ isOpen: false, type: null, reason: '' })} title={actionModal.type === 'approve' ? 'Approve Property' : 'Reject Property'}>
        <div className="space-y-6">
          <p className="text-slate-600 text-lg">
            Are you sure you want to {actionModal.type} <strong>{selectedBuilding?.name}</strong>?
          </p>
          
          {actionModal.type === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Reason for Rejection *</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                rows="4"
                placeholder="Explain why this property is being rejected..."
                value={actionModal.reason}
                onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
              ></textarea>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setActionModal({ isOpen: false, type: null, reason: '' })}
              className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button 
              onClick={actionModal.type === 'approve' ? handleApprove : handleReject}
              className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md ${actionModal.type === 'approve' ? 'bg-primary hover:bg-primary-hover' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Confirm {actionModal.type === 'approve' ? 'Approval' : 'Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostelApprovalCenter;
