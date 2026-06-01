import axios from 'axios';
import { cacheGet, cacheSet } from './cache';

const API_URL = import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api';
export const backendOnline = true;

// --- GLOBAL AUTH INTERCEPTOR ---
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    console.warn('Unauthorized request - Token expired or invalid. Redirecting to login.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

const handleId = (data) => {
  if (Array.isArray(data)) return data.map(x => ({ ...x, id: x._id || x.id }));
  if (data && typeof data === 'object') return { ...data, id: data._id || data.id };
  return data;
};

// SWR (Stale-While-Revalidate) helper to prevent React request storms
const swrFetch = async (cacheKey, url, config = {}) => {
  const cached = cacheGet(cacheKey);
  if (cached) {
    // Silently revalidate in background
    axios.get(url, config)
      .then(res => cacheSet(cacheKey, handleId(Array.isArray(res.data) ? res.data : (res.data || []))))
      .catch(err => console.warn(`SWR Background fetch failed for ${cacheKey}`, err));
    return handleId(cached);
  }
  const res = await axios.get(url, config);
  const data = Array.isArray(res.data) ? res.data : (res.data || []);
  cacheSet(cacheKey, data);
  return handleId(data);
};

export const api = {
  // Owner Profile
  getOwnerProfile: async () => {
    return await swrFetch('owner_profile', `${API_URL}/owner/profile`);
  },
  updateOwnerProfile: async (data) => {
    const res = await axios.patch(`${API_URL}/owner/profile`, data);
    cacheSet('owner_profile', res.data);
    return res.data;
  },
  getOwnerStats: async () => {
    return await swrFetch('owner_stats', `${API_URL}/owner/stats`);
  },
  getOwnerHistory: async () => {
    const res = await axios.get(`${API_URL}/owner/history`);
    return res.data;
  },
  updateOwnerDocuments: async (doc) => {
    const res = await axios.post(`${API_URL}/owner/documents`, doc);
    cacheSet('owner_profile', res.data);
    return res.data;
  },
  uploadOwnerPhoto: async (photoUrl) => {
    const res = await axios.post(`${API_URL}/owner/profile/photo`, { photoUrl });
    const cached = cacheGet('owner_profile') || {};
    cacheSet('owner_profile', { ...cached, photo: photoUrl });
    return res.data;
  },
  getOwnerPhoto: async () => {
    const res = await axios.get(`${API_URL}/owner/profile/photo`);
    return res.data;
  },

  // Buildings & Infrastructure
  getBuildings: async (bypassCache = false) => {
    if (bypassCache) {
      const res = await axios.get(`${API_URL}/buildings`, { params: { status: 'Active' } });
      const data = Array.isArray(res.data) ? res.data : (res.data || []);
      cacheSet('buildings_active', data);
      return handleId(data);
    }
    return await swrFetch('buildings_active', `${API_URL}/buildings`, { params: { status: 'Active' } });
  },
  getDraftBuildings: async () => {
    return await swrFetch('buildings_draft', `${API_URL}/buildings`, { params: { status: 'Draft' } });
  },
  getHostels: async () => {
    const res = await axios.get(`${API_URL}/hostels`);
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  // Bed availability stats for the hostel linked to a building
  getHostelBedStats: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    const res = await axios.get(`${API_URL}/hostels/bed-stats`, { params });
    return res.data;
  },
  // Re-calculate filledBeds from live bed data
  syncHostelBeds: async (hostelId) => {
    const res = await axios.patch(`${API_URL}/hostels/${hostelId}/sync-beds`);
    return res.data;
  },
  // Update hostel (e.g. totalBeds) by id
  updateHostel: async (id, data) => {
    const res = await axios.patch(`${API_URL}/hostels/${id}`, data);
    return handleId(res.data);
  },
  getAssignedFloors: async (hId) => {
    const res = await axios.get(`${API_URL}/hostel-floor-mapping`, { params: { hostelId: hId } });
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(m => m.floor?._id || m.floor?.id);
  },
  getAllFloors: async () => {
    return await swrFetch('all_floors', `${API_URL}/floors`);
  },
  getFloorsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/floors`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getAllRooms: async () => {
    return await swrFetch('all_rooms', `${API_URL}/rooms`);
  },
  getRoomsByBuilding: async (bId) => {
    return await swrFetch(`rooms_b_${bId || 'all'}`, `${API_URL}/rooms`, { params: { buildingId: bId } });
  },
  getAllBeds: async () => {
    return await swrFetch('all_beds', `${API_URL}/beds`);
  },
  getBedsByBuilding: async (bId) => {
    return await swrFetch(`beds_b_${bId || 'all'}`, `${API_URL}/beds`, { params: { buildingId: bId } });
  },
  recommendBeds: async (buildingId, preferences) => {
    const res = await axios.post(`${API_URL}/beds/recommend`, { buildingId, preferences });
    return handleId(res.data);
  },
  getMaintenanceBeds: async () => {
    return await swrFetch('beds_maintenance', `${API_URL}/beds/maintenance`);
  },
  markBedSanitized: async (id) => {
    const res = await axios.post(`${API_URL}/beds/${id}/sanitize`);
    return handleId(res.data);
  },
  getFloors: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    return handleId(res.data);
  },
  getRooms: async (fId) => {
    const res = await axios.get(`${API_URL}/rooms/${fId}`);
    return handleId(res.data);
  },
  getBeds: async (rId) => {
    const res = await axios.get(`${API_URL}/beds/${rId}`);
    return handleId(res.data);
  },

  // Dashboard & Analytics (Live Backend)
  getDashboardSummary: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/summary`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardRevenue: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/revenue`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardOccupancy: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/occupancy`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardAlerts: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/alerts`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardComplaints: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/complaints`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardMess: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/mess`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardStaff: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/staff`, { params: { buildingId: bId } });
    return res.data;
  },
  getDashboardActivity: async (bId) => {
    const res = await axios.get(`${API_URL}/dashboard/activity`, { params: { buildingId: bId } });
    return res.data;
  },

  // Operational Data
  getTenants: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    return await swrFetch(`tenants_${buildingId || 'all'}`, `${API_URL}/tenants`, { params });
  },
  getComplaints: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    return await swrFetch(`complaints_${buildingId || 'all'}`, `${API_URL}/complaints`, { params });
  },
  updateComplaintStatus: async (id, status, assignedTo = null) => {
    const res = await axios.patch(`${API_URL}/complaints/${id}`, { status, assignedTo });
    return handleId(res.data);
  },
  getPayments: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    return await swrFetch(`payments_${buildingId || 'all'}`, `${API_URL}/payments`, { params });
  },
  updatePaymentStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/payments/${id}`, { status });
    return handleId(res.data);
  },
  getRoomTransfers: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    const res = await axios.get(`${API_URL}/room-transfers`, { params });
    return handleId(res.data);
  },
  updateRoomTransferStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/room-transfers/${id}`, { status });
    return handleId(res.data);
  },
  getMessMenu: async (bId) => {
    const res = await axios.get(`${API_URL}/mess/menu`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  updateMessMenu: async (data) => {
    const res = await axios.put(`${API_URL}/mess/menu`, data);
    return handleId(res.data);
  },
  getMessAttendance: async (bId, date) => {
    const res = await axios.get(`${API_URL}/mess/attendance`, { params: { buildingId: bId, date } });
    return res.data;
  },
  updateMessAttendance: async (data) => {
    const res = await axios.put(`${API_URL}/mess/attendance`, data);
    return res.data;
  },
  markAllMessAttendance: async (data) => {
    const res = await axios.post(`${API_URL}/mess/attendance/mark-all`, data);
    return res.data;
  },
  getMessPlans: async () => {
    const res = await axios.get(`${API_URL}/mess/plans`);
    return res.data;
  },
  updateMessPlan: async (id, data) => {
    const res = await axios.put(`${API_URL}/mess/plans/${id}`, data);
    return res.data;
  },
  // Staff Management
  getStaff: async (bId) => {
    const cacheKey = `staff_${bId || 'all'}`;
    const cached = cacheGet(cacheKey);
    const processData = (data) => {
      if (data && data.staffList) data.staffList = data.staffList.map(s => ({ ...s, id: s._id }));
      return data;
    };
    if (cached) {
      axios.get(`${API_URL}/staff`, { params: { buildingId: bId } }).then(res => cacheSet(cacheKey, processData(res.data))).catch(()=>{});
      return processData(cached);
    }
    const res = await axios.get(`${API_URL}/staff`, { params: { buildingId: bId } });
    const data = processData(res.data);
    cacheSet(cacheKey, data);
    return data;
  },
  addStaff: async (data) => {
    const res = await axios.post(`${API_URL}/staff`, data);
    return handleId(res.data);
  },
  updateStaff: async (id, data) => {
    const res = await axios.put(`${API_URL}/staff/${id}`, data);
    return handleId(res.data);
  },
  deleteStaff: async (id) => {
    const res = await axios.delete(`${API_URL}/staff/${id}`);
    return res.data;
  },
  addStaffActivity: async (id, action) => {
    const res = await axios.post(`${API_URL}/staff/${id}/activity`, { action });
    return handleId(res.data);
  },
  getSettings: async (bId) => {
    const buildingId = bId || localStorage.getItem('selectedBuildingId');
    const cacheKey = `settings_${buildingId}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      axios.get(`${API_URL}/settings`, { params: { buildingId } }).then(res => cacheSet(cacheKey, res.data));
      return cached;
    }
    const res = await axios.get(`${API_URL}/settings`, { params: { buildingId } });
    cacheSet(cacheKey, res.data);
    return res.data;
  },
  updateSettings: async (data, buildingId) => {
    const payload = buildingId ? { ...data, buildingId } : data;
    const res = await axios.post(`${API_URL}/settings`, payload);
    return res.data;
  },

  // Notifications API (Centralized)
  getNotifications: async (bId) => {
    const res = await axios.get(`${API_URL}/notifications`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getNotificationUnreadCount: async (bId) => {
    const res = await axios.get(`${API_URL}/notifications/unread-count`, { params: { buildingId: bId } });
    return res.data;
  },
  markNotificationRead: async (id) => {
    const res = await axios.patch(`${API_URL}/notifications/${id}/read`);
    return handleId(res.data);
  },
  markAllNotificationsRead: async (bId) => {
    const res = await axios.post(`${API_URL}/notifications/mark-all-read`, { buildingId: bId });
    return res.data;
  },
  archiveNotification: async (id) => {
    const res = await axios.patch(`${API_URL}/notifications/${id}/archive`);
    return handleId(res.data);
  },
  deleteNotification: async (id) => {
    await axios.delete(`${API_URL}/notifications/${id}`);
  },
  seedNotifications: async (bId) => {
    const res = await axios.post(`${API_URL}/notifications/seed`, { buildingId: bId });
    return res.data;
  },
  sendNotification: async (data) => {
    const res = await axios.post(`${API_URL}/notifications`, data);
    return handleId(res.data);
  },

  // CRUD Operations
  addBuilding: async (data) => {
    const res = await axios.post(`${API_URL}/buildings`, data);
    cacheSet('buildings_active', null);
    return handleId(res.data);
  },
  updateBuilding: async (id, data) => {
    const res = await axios.patch(`${API_URL}/buildings/${id}`, data);
    cacheSet('buildings_active', null);
    return handleId(res.data);
  },
  deleteBuilding: async (id) => {
    await axios.delete(`${API_URL}/buildings/${id}`);
    cacheSet('buildings_active', null);
  },
  uploadPhotos: async (formData) => {
    const res = await axios.post(`${API_URL}/buildings/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  addFloor: async (data) => {
    const res = await axios.post(`${API_URL}/floors`, data);
    cacheSet('all_floors', null);
    return handleId(res.data);
  },
  updateFloor: async (id, data) => {
    const res = await axios.put(`${API_URL}/floors/${id}`, data);
    cacheSet('all_floors', null);
    return handleId(res.data);
  },
  deleteFloor: async (id) => {
    await axios.delete(`${API_URL}/floors/${id}`);
    cacheSet('all_floors', null);
  },
  addRoom: async (data) => {
    const res = await axios.post(`${API_URL}/rooms`, data);
    cacheSet('all_rooms', null); // Clear cache to force refresh
    return handleId(res.data);
  },
  updateRoomStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/rooms/${id}`, { status });
    return handleId(res.data);
  },
  updateRoom: async (id, data) => {
    const res = await axios.patch(`${API_URL}/rooms/${id}`, data);
    return handleId(res.data);
  },
  deleteRoom: async (id) => {
    await axios.delete(`${API_URL}/rooms/${id}`);
  },
  addBed: async (data) => {
    const res = await axios.post(`${API_URL}/beds`, data);
    cacheSet('all_beds', null); // Clear cache to force refresh
    return handleId(res.data);
  },
  updateBedStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, { status });
    return handleId(res.data);
  },
  updateBed: async (id, data) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, data);
    return handleId(res.data);
  },
  deleteBed: async (id) => {
    await axios.delete(`${API_URL}/beds/${id}`);
  },
  addTenant: async (data) => {
    const res = await axios.post(`${API_URL}/tenants`, data);
    return handleId(res.data);
  },
  bulkAddTenants: async (tenants) => {
    const res = await axios.post(`${API_URL}/tenants/bulk`, { tenants });
    return handleId(res.data);
  },
  updateTenant: async (id, data) => {
    const res = await axios.put(`${API_URL}/tenants/${id}`, data);
    return handleId(res.data);
  },
  addPayment: async (data) => {
    const res = await axios.post(`${API_URL}/payments`, data);
    return handleId(res.data);
  },
  addComplaint: async (data) => {
    const res = await axios.post(`${API_URL}/complaints`, data);
    return handleId(res.data);
  },
  // Inventory
  getInventory: async (bId) => {
    const res = await axios.get(`${API_URL}/inventory`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  addInventoryItem: async (data) => {
    const res = await axios.post(`${API_URL}/inventory`, data);
    return handleId(res.data);
  },
  updateInventoryItem: async (id, data) => {
    const res = await axios.patch(`${API_URL}/inventory/${id}`, data);
    return handleId(res.data);
  },
  deleteInventoryItem: async (id) => {
    await axios.delete(`${API_URL}/inventory/${id}`);
  },
  // Procurement
  getProcurementData: async (bId) => {
    const res = await axios.get(`${API_URL}/procurement`, { params: { buildingId: bId } });
    return res.data;
  },
  addPurchaseRequest: async (data) => {
    const res = await axios.post(`${API_URL}/procurement/requests`, data);
    return handleId(res.data);
  },
  addPurchaseOrder: async (data) => {
    const res = await axios.post(`${API_URL}/procurement/orders`, data);
    return handleId(res.data);
  },
  getReportsData: async (bId) => {
    const res = await axios.get(`${API_URL}/reports`, { params: { buildingId: bId } });
    return res.data;
  },
  // Notifications - extra methods
  seedNotifications: async (bId) => {
    const res = await axios.post(`${API_URL}/notifications/seed`, { buildingId: bId });
    return res.data;
  },
  archiveNotification: async (id) => {
    const res = await axios.patch(`${API_URL}/notifications/${id}/archive`);
    return res.data;
  },
  // Tenants - delete
  deleteTenant: async (id) => {
    await axios.delete(`${API_URL}/tenants/${id}`);
  },
  // Community Hub
  getLostFound: async () => {
    const res = await axios.get(`${API_URL}/community/lost-found`);
    return handleId(res.data);
  },
  getSOSAlerts: async () => {
    const res = await axios.get(`${API_URL}/community/sos`);
    return handleId(res.data);
  },
  resolveSOSAlert: async (id) => {
    const res = await axios.patch(`${API_URL}/community/sos/${id}/resolve`);
    return res.data;
  },
  dispatchSOSAlert: async (id) => {
    const res = await axios.patch(`${API_URL}/community/sos/${id}/dispatch`);
    return res.data;
  },
  updateLostFoundStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/community/lost-found/${id}/status`, { status });
    return res.data;
  },
  getConfidentialReports: async (params = {}) => {
    const res = await axios.get(`${API_URL}/confidential-reports`, { params });
    return {
      reports: handleId(res.data.reports || []),
      pagination: res.data.pagination
    };
  },
  updateConfidentialReportStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/confidential-reports/${id}/status`, { status });
    return handleId(res.data.report);
  },
  flagConfidentialReport: async (id, isFlagged, flagStatus) => {
    const res = await axios.patch(`${API_URL}/confidential-reports/${id}/flag`, { isFlagged, flagStatus });
    return handleId(res.data.report);
  },
  deleteConfidentialReport: async (id) => {
    const res = await axios.delete(`${API_URL}/confidential-reports/${id}`);
    return res.data;
  },
  debugConfidentialReports: async () => {
    const res = await axios.get(`${API_URL}/confidential-reports/debug`);
    return res.data;
  },
  hideConfidentialReport: async (id, isHidden) => {
    const res = await axios.patch(`${API_URL}/confidential-reports/${id}/hide`, { isHidden });
    return handleId(res.data.report);
  }
};

window.api = api;
// end of file test
