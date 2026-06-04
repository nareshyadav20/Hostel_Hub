import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle, XCircle, Clock, 
  MapPin, Users, Activity, FileText, ArrowLeft, 
  Search, Filter, Eye, AlertCircle, ChevronDown
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

  const [detailedBuilding, setDetailedBuilding] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalTab, setModalTab] = useState('Overview');
  const [expandedFloors, setExpandedFloors] = useState({});

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

  useEffect(() => {
    if (selectedBuilding?._id) {
      const fetchDetails = async () => {
        try {
          setLoadingDetails(true);
          const response = await API.get(`/buildings/${selectedBuilding._id}`);
          setDetailedBuilding(response.data);
        } catch (err) {
          console.error('Failed to fetch building details:', err);
          showToast('error', 'Failed to load property details');
        } finally {
          setLoadingDetails(false);
        }
      };
      fetchDetails();
      setModalTab('Overview');
      setExpandedFloors({});
    } else {
      setDetailedBuilding(null);
    }
  }, [selectedBuilding?._id]);

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

  const toggleFloor = (floorId) => {
    setExpandedFloors(prev => ({ ...prev, [floorId]: !prev[floorId] }));
  };

  const filteredBuildings = buildings.filter(b => {
    let statusMatch = false;
    if (activeTab === 'Pending') {
      statusMatch = b.approvalStatus === 'pending' || b.status === 'Pending Approval' || b.status === 'Pending';
    }
    if (activeTab === 'Approved') {
      statusMatch = b.approvalStatus === 'approved' || b.isApproved === true || b.status === 'Active';
    }
    if (activeTab === 'Rejected') {
      statusMatch = b.approvalStatus === 'rejected' || b.status === 'Rejected';
    }
    
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

            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Modal Sub-Tabs */}
                <div className="flex border-b border-divider mb-4">
                  {['Overview', 'Amenities & Policies', 'Infrastructure'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={`flex-1 py-2 text-center text-sm font-semibold border-b-2 transition-all ${
                        modalTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {modalTab === 'Overview' && (
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
                        {detailedBuilding?.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block mb-0.5">Gender Specificity</span>
                        <span className="text-sm font-semibold text-slate-800">{detailedBuilding?.genderType || 'Mixed'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block mb-0.5">Category</span>
                        <span className="text-sm font-semibold text-slate-800">{detailedBuilding?.category || 'Student'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block mb-0.5">Starting Rent</span>
                        <span className="text-sm font-semibold text-slate-800">₹{detailedBuilding?.startingPrice || 'N/A'}/mo</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block mb-0.5">Security Deposit</span>
                        <span className="text-sm font-semibold text-slate-800">₹{detailedBuilding?.securityDeposit || 0}</span>
                      </div>
                    </div>

                    {/* Owner Info Card */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-divider space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-sm text-slate-700">
                        <div>
                          <span className="text-xs text-slate-400 block">Name</span>
                          <span className="font-semibold">{detailedBuilding?.owner?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block">Email</span>
                          <span className="font-semibold text-slate-900 break-all">{detailedBuilding?.owner?.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block">Phone</span>
                          <span className="font-semibold">{detailedBuilding?.owner?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'Amenities & Policies' && (
                  <div className="space-y-4">
                    {/* Amenities */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailedBuilding?.amenities && detailedBuilding.amenities.length > 0 ? (
                          detailedBuilding.amenities.map((amenity, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                              {amenity}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500 italic">No amenities specified.</span>
                        )}
                      </div>
                    </div>

                    {/* Policies */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hostel Policies</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                          <span className="text-xs text-slate-400 font-bold block mb-0.5">Smoking</span>
                          <span className="text-sm font-semibold text-slate-700">{detailedBuilding?.policies?.smoking || 'Not Allowed'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                          <span className="text-xs text-slate-400 font-bold block mb-0.5">Alcohol</span>
                          <span className="text-sm font-semibold text-slate-700">{detailedBuilding?.policies?.alcohol || 'Not Allowed'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                          <span className="text-xs text-slate-400 font-bold block mb-0.5">Visitors</span>
                          <span className="text-sm font-semibold text-slate-700">{detailedBuilding?.policies?.visitors || 'Allowed till 8 PM'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                          <span className="text-xs text-slate-400 font-bold block mb-0.5">Pets</span>
                          <span className="text-sm font-semibold text-slate-700">{detailedBuilding?.policies?.pets || 'No'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Staff info */}
                    {detailedBuilding?.staffInfo && (detailedBuilding.staffInfo.name || detailedBuilding.staffInfo.contact) && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-divider">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Info</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                          <div>
                            <span className="text-xs text-slate-400 block">Name</span>
                            <span className="font-semibold">{detailedBuilding.staffInfo.name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Role & Contact</span>
                            <span className="font-semibold">{detailedBuilding.staffInfo.role || 'Warden'} ({detailedBuilding.staffInfo.contact || 'N/A'})</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalTab === 'Infrastructure' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block">Floors</span>
                        <span className="text-lg font-bold text-slate-800">{detailedBuilding?.floors?.length || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block">Total Rooms</span>
                        <span className="text-lg font-bold text-slate-800">{detailedBuilding?.totalRooms || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-divider">
                        <span className="text-xs text-slate-400 font-bold block">Total Beds</span>
                        <span className="text-lg font-bold text-slate-800">{detailedBuilding?.totalBeds || 0}</span>
                      </div>
                    </div>

                    {/* Floors tree */}
                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Infrastructure Details</h4>
                      {detailedBuilding?.floors && detailedBuilding.floors.length > 0 ? (
                        detailedBuilding.floors.map((floor) => {
                          const isExpanded = expandedFloors[floor._id];
                          return (
                            <div key={floor._id} className="border border-divider rounded-xl overflow-hidden bg-white mb-2">
                              <button
                                type="button"
                                onClick={() => toggleFloor(floor._id)}
                                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 text-sm">
                                    Floor {floor.floorNumber}
                                  </span>
                                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                                    {floor.rooms?.length || 0} Rooms
                                  </span>
                                </div>
                                <ChevronDown
                                  size={18}
                                  className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {isExpanded && (
                                <div className="p-3 divide-y divide-divider space-y-3 bg-white">
                                  {floor.rooms && floor.rooms.length > 0 ? (
                                    floor.rooms.map((room) => (
                                      <div key={room._id} className="pt-2 first:pt-0">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h5 className="font-bold text-slate-800 text-sm">
                                              Room {room.roomNumber}
                                            </h5>
                                            <span className="text-xs text-slate-500">
                                              {room.roomType || 'Standard'} • {room.isAC ? 'AC' : 'Non-AC'}
                                            </span>
                                          </div>
                                          <span className="text-xs font-bold text-primary">
                                            ₹{room.rentAmount || 'N/A'}/mo
                                          </span>
                                        </div>
                                        
                                        {/* Beds list */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          {room.beds && room.beds.length > 0 ? (
                                            room.beds.map((bed) => {
                                              const isOccupied = (bed.status || '').toUpperCase() === 'OCCUPIED';
                                              return (
                                                <div key={bed._id} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-divider">
                                                  <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                  <span className="text-xs font-semibold text-slate-700">
                                                    Bed {bed.bedNumber}
                                                  </span>
                                                  <span className="text-[10px] text-slate-400 ml-auto">
                                                    {isOccupied ? 'Occupied' : 'Available'}
                                                  </span>
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <span className="text-xs text-slate-400 italic col-span-full">No beds defined.</span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-400 italic p-2">No rooms on this floor.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-500 italic py-2">No floor infrastructure details available.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedBuilding.rejectionReason && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm">Rejection Reason</h4>
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
