import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle, XCircle, Clock, 
  MapPin, Users, Activity, FileText, ArrowLeft, 
  Search, Filter, Eye, AlertCircle, ChevronDown,
  ShieldCheck, ShieldX, Hourglass, Home, Phone, Mail
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

  const countByStatus = (tab) => buildings.filter(b => {
    if (tab === 'Pending') return b.approvalStatus === 'pending' || b.status === 'Pending Approval' || b.status === 'Pending';
    if (tab === 'Approved') return b.approvalStatus === 'approved' || b.isApproved === true || b.status === 'Active';
    if (tab === 'Rejected') return b.approvalStatus === 'rejected' || b.status === 'Rejected';
    return false;
  }).length;

  const filteredBuildings = buildings.filter(b => {
    let statusMatch = false;
    if (activeTab === 'Pending') statusMatch = b.approvalStatus === 'pending' || b.status === 'Pending Approval' || b.status === 'Pending';
    if (activeTab === 'Approved') statusMatch = b.approvalStatus === 'approved' || b.isApproved === true || b.status === 'Active';
    if (activeTab === 'Rejected') statusMatch = b.approvalStatus === 'rejected' || b.status === 'Rejected';
    const searchMatch = (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (b.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const tabConfig = {
    Pending:  { icon: Hourglass,    color: 'text-amber-500',  bg: 'bg-amber-500/10',  badge: 'bg-amber-100 text-amber-700' },
    Approved: { icon: ShieldCheck,  color: 'text-green-500',  bg: 'bg-green-500/10',  badge: 'bg-green-100 text-green-700' },
    Rejected: { icon: ShieldX,      color: 'text-red-500',    bg: 'bg-red-500/10',    badge: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight flex items-center gap-3">
            <Building2 className="text-primary" size={32} />
            Approval Center
          </h1>
          <p className="text-text-muted mt-2 text-base">Review and manage new property submissions from owners.</p>
        </div>
        <div className="flex gap-3">
          {['Pending', 'Approved', 'Rejected'].map(tab => {
            const { icon: Icon, bg, color, badge } = tabConfig[tab];
            const count = countByStatus(tab);
            return (
              <div key={tab} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${bg} border border-divider`}>
                <Icon size={16} className={color} />
                <span className="text-xs font-bold text-text-muted">{tab}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${badge}`}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface p-2 rounded-2xl shadow-soft border border-divider">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
          {['Pending', 'Approved', 'Rejected'].map((tab) => {
            const { icon: Icon } = tabConfig[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'text-text-muted hover:bg-background hover:text-text-main'
                }`}
              >
                <Icon size={14} />
                {tab}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-background text-text-muted'}`}>
                  {countByStatus(tab)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-text-main"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBuildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-divider">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-text-muted" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-text-main">No {activeTab} Properties</h3>
          <p className="text-text-muted text-sm mt-1">Everything is caught up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBuildings.map((b) => {
              const { color, bg } = tabConfig[activeTab];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={b._id}
                  className="bg-surface rounded-2xl border border-divider overflow-hidden hover:shadow-premium transition-all duration-300 flex flex-col group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-background overflow-hidden">
                    <img 
                      src={b.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'} 
                      alt={b.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${
                        activeTab === 'Pending' ? 'bg-amber-100/90 text-amber-700 border border-amber-200' :
                        activeTab === 'Approved' ? 'bg-green-100/90 text-green-700 border border-green-200' :
                        'bg-red-100/90 text-red-700 border border-red-200'
                      }`}>
                        {activeTab}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg line-clamp-1 drop-shadow">{b.name || 'Unnamed Property'}</h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <MapPin size={14} />
                      <span className="text-sm line-clamp-1">{b.address || b.locationCity || 'Address not set'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-xl border border-divider">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mb-1">Owner</p>
                        <p className="text-sm font-semibold text-text-main truncate">{b.owner?.name || 'Unknown'}</p>
                      </div>
                      <div className="p-3 bg-background rounded-xl border border-divider">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mb-1">Capacity</p>
                        <p className="text-sm font-semibold text-text-main">{b.totalRooms || 0} Rooms</p>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-3 pt-3 border-t border-divider">
                      <button 
                        onClick={() => setSelectedBuilding(b)}
                        className="flex-1 px-4 py-2 bg-background text-text-muted border border-divider rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye size={15} /> Details
                      </button>
                      {activeTab === 'Pending' && (
                        <button 
                          onClick={() => { setSelectedBuilding(b); setActionModal({ isOpen: true, type: 'approve', reason: '' }); }}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow-md hover:brightness-110 transition-all text-sm"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={!!selectedBuilding && !actionModal.isOpen} onClose={() => setSelectedBuilding(null)} title="Property Details">
        {selectedBuilding && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-background overflow-hidden shrink-0 border border-divider">
                <img src={selectedBuilding.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d50c63'} className="w-full h-full object-cover" alt="Property" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main">{selectedBuilding.name}</h3>
                <p className="text-text-muted text-sm mt-1">{selectedBuilding.address}</p>
                <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  activeTab === 'Approved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{activeTab}</span>
              </div>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Modal Sub-Tabs */}
                <div className="flex border-b border-divider">
                  {['Overview', 'Amenities & Policies', 'Infrastructure'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={`flex-1 py-2.5 text-center text-sm font-semibold border-b-2 transition-all ${
                        modalTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-muted hover:text-text-main'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {modalTab === 'Overview' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Description</h4>
                      <p className="text-sm text-text-main bg-background p-3 rounded-xl leading-relaxed border border-divider">
                        {detailedBuilding?.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Gender', detailedBuilding?.genderType || 'Mixed'],
                        ['Category', detailedBuilding?.category || 'Student'],
                        ['Starting Rent', `₹${detailedBuilding?.startingPrice || 'N/A'}/mo`],
                        ['Security Deposit', `₹${detailedBuilding?.securityDeposit || 0}`],
                      ].map(([label, value]) => (
                        <div key={label} className="p-3 bg-background rounded-xl border border-divider">
                          <span className="text-[10px] text-text-muted font-bold block mb-0.5 uppercase tracking-wide">{label}</span>
                          <span className="text-sm font-semibold text-text-main">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-background rounded-xl border border-divider space-y-3">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Owner Profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-text-muted shrink-0" />
                          <div>
                            <span className="text-[10px] text-text-muted block">Name</span>
                            <span className="font-semibold text-text-main">{detailedBuilding?.owner?.name || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-text-muted shrink-0" />
                          <div>
                            <span className="text-[10px] text-text-muted block">Email</span>
                            <span className="font-semibold text-text-main break-all">{detailedBuilding?.owner?.email || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-text-muted shrink-0" />
                          <div>
                            <span className="text-[10px] text-text-muted block">Phone</span>
                            <span className="font-semibold text-text-main">{detailedBuilding?.owner?.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'Amenities & Policies' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailedBuilding?.amenities && detailedBuilding.amenities.length > 0 ? (
                          detailedBuilding.amenities.map((amenity, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                              {amenity}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-text-muted italic">No amenities specified.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Hostel Policies</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ['Smoking', detailedBuilding?.policies?.smoking || 'Not Allowed'],
                          ['Alcohol', detailedBuilding?.policies?.alcohol || 'Not Allowed'],
                          ['Visitors', detailedBuilding?.policies?.visitors || 'Allowed till 8 PM'],
                          ['Pets', detailedBuilding?.policies?.pets || 'No'],
                        ].map(([label, value]) => (
                          <div key={label} className="p-3 bg-background rounded-xl border border-divider">
                            <span className="text-[10px] text-text-muted font-bold block mb-0.5 uppercase tracking-wide">{label}</span>
                            <span className="text-sm font-semibold text-text-main">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {detailedBuilding?.staffInfo && (detailedBuilding.staffInfo.name || detailedBuilding.staffInfo.contact) && (
                      <div className="p-4 bg-background rounded-xl border border-divider">
                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Staff Info</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[10px] text-text-muted block">Name</span>
                            <span className="font-semibold text-text-main">{detailedBuilding.staffInfo.name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block">Role & Contact</span>
                            <span className="font-semibold text-text-main">{detailedBuilding.staffInfo.role || 'Warden'} ({detailedBuilding.staffInfo.contact || 'N/A'})</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalTab === 'Infrastructure' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        ['Floors', detailedBuilding?.floors?.length || 0],
                        ['Total Rooms', detailedBuilding?.totalRooms || 0],
                        ['Total Beds', detailedBuilding?.totalBeds || 0],
                      ].map(([label, value]) => (
                        <div key={label} className="p-3 bg-background rounded-xl border border-divider">
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">{label}</span>
                          <span className="text-2xl font-bold text-text-main">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Infrastructure Details</h4>
                      {detailedBuilding?.floors && detailedBuilding.floors.length > 0 ? (
                        detailedBuilding.floors.map((floor) => {
                          const isExpanded = expandedFloors[floor._id];
                          return (
                            <div key={floor._id} className="border border-divider rounded-xl overflow-hidden bg-surface mb-2">
                              <button
                                type="button"
                                onClick={() => toggleFloor(floor._id)}
                                className="w-full flex items-center justify-between p-3 bg-background hover:bg-background/70 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-text-main text-sm">Floor {floor.floorNumber}</span>
                                  <span className="text-xs bg-surface border border-divider px-2 py-0.5 rounded-full text-text-muted">
                                    {floor.rooms?.length || 0} Rooms
                                  </span>
                                </div>
                                <ChevronDown size={18} className={`text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>

                              {isExpanded && (
                                <div className="p-3 divide-y divide-divider space-y-3 bg-surface">
                                  {floor.rooms && floor.rooms.length > 0 ? (
                                    floor.rooms.map((room) => (
                                      <div key={room._id} className="pt-2 first:pt-0">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h5 className="font-bold text-text-main text-sm">Room {room.roomNumber}</h5>
                                            <span className="text-xs text-text-muted">
                                              {room.roomType || 'Standard'} • {room.isAC ? 'AC' : 'Non-AC'}
                                            </span>
                                          </div>
                                          <span className="text-xs font-bold text-primary">₹{room.rentAmount || 'N/A'}/mo</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          {room.beds && room.beds.length > 0 ? (
                                            room.beds.map((bed) => {
                                              const isOccupied = (bed.status || '').toUpperCase() === 'OCCUPIED';
                                              return (
                                                <div key={bed._id} className="flex items-center gap-2 p-1.5 bg-background rounded-lg border border-divider">
                                                  <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                  <span className="text-xs font-semibold text-text-main">Bed {bed.bedNumber}</span>
                                                  <span className="text-[10px] text-text-muted ml-auto">{isOccupied ? 'Occupied' : 'Available'}</span>
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <span className="text-xs text-text-muted italic col-span-full">No beds defined.</span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-text-muted italic p-2">No rooms on this floor.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-text-muted italic py-2">No floor infrastructure details available.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedBuilding.rejectionReason && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-xl flex gap-3 border border-red-500/20">
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
                  className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => setActionModal({ isOpen: true, type: 'approve', reason: '' })}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:brightness-110 shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal (Approve/Reject) */}
      <Modal 
        isOpen={actionModal.isOpen} 
        onClose={() => setActionModal({ isOpen: false, type: null, reason: '' })} 
        title={actionModal.type === 'approve' ? '✅ Approve Property' : '❌ Reject Property'}
      >
        <div className="space-y-6">
          <div className={`p-4 rounded-xl border ${actionModal.type === 'approve' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className="text-text-main text-sm">
              Are you sure you want to <strong>{actionModal.type}</strong>{' '}
              <strong className="text-primary">{selectedBuilding?.name}</strong>?
            </p>
            {actionModal.type === 'approve' && (
              <p className="text-text-muted text-xs mt-1">The owner will be notified and can start adding floors, rooms, and beds.</p>
            )}
          </div>
          
          {actionModal.type === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">Reason for Rejection *</label>
              <textarea 
                className="w-full p-3 border border-divider rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-background text-text-main text-sm resize-none"
                rows="4"
                placeholder="Explain why this property is being rejected..."
                value={actionModal.reason}
                onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setActionModal({ isOpen: false, type: null, reason: '' })}
              className="px-6 py-2.5 text-text-muted font-semibold hover:bg-background rounded-xl transition-colors border border-divider"
            >
              Cancel
            </button>
            <button 
              onClick={actionModal.type === 'approve' ? handleApprove : handleReject}
              className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md transition-all ${actionModal.type === 'approve' ? 'bg-primary hover:brightness-110' : 'bg-red-500 hover:bg-red-600'}`}
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
