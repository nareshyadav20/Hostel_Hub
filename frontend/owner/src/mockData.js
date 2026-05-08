import axios from 'axios';
import { cacheGet, cacheSet } from './cache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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

export const api = {
  // Owner Profile
  getOwnerProfile: async () => {
    const cached = cacheGet('owner_profile');
    if (cached) {
      // Background revalidate
      axios.get(`${API_URL}/owner/profile`).then(res => cacheSet('owner_profile', res.data));
      return cached;
    }
    const res = await axios.get(`${API_URL}/owner/profile`);
    cacheSet('owner_profile', res.data);
    return res.data;
  },
  updateOwnerProfile: async (data) => {
    const res = await axios.patch(`${API_URL}/owner/profile`, data);
    return res.data;
  },
  getOwnerStats: async () => {
    const cached = cacheGet('owner_stats');
    if (cached) {
      axios.get(`${API_URL}/dashboard/summary`).then(res => cacheSet('owner_stats', res.data));
      return cached;
    }
    const res = await axios.get(`${API_URL}/dashboard/summary`);
    cacheSet('owner_stats', res.data);
    return res.data;
  },
  getOwnerHistory: async () => {
    const res = await axios.get(`${API_URL}/dashboard/activity`);
    return res.data;
  },
  updateOwnerDocuments: async (doc) => {
    const res = await axios.post(`${API_URL}/owner/documents`, doc);
    return res.data;
  },

  // Buildings & Infrastructure
  getBuildings: async () => {
    const cached = cacheGet('buildings');
    if (cached) {
      axios.get(`${API_URL}/buildings`).then(res => cacheSet('buildings', res.data));
      return handleId(cached.filter(b => b.status !== 'Draft'));
    }
    const res = await axios.get(`${API_URL}/buildings`);
    const data = Array.isArray(res.data) ? res.data : [];
    cacheSet('buildings', data);
    return handleId(data.filter(b => b.status !== 'Draft'));
  },
  getHostels: async () => {
    const res = await axios.get(`${API_URL}/hostels`);
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  getAssignedFloors: async (hId) => {
    const res = await axios.get(`${API_URL}/hostel-floor-mapping`, { params: { hostelId: hId } });
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(m => m.floor?._id || m.floor?.id);
  },
  getAllFloors: async () => {
    const res = await axios.get(`${API_URL}/floors`);
    return handleId(res.data);
  },
  getFloorsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/floors`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getAllRooms: async () => {
    const cached = cacheGet('all_rooms');
    if (cached) {
      axios.get(`${API_URL}/rooms`).then(res => cacheSet('all_rooms', res.data));
      return handleId(cached);
    }
    const res = await axios.get(`${API_URL}/rooms`);
    cacheSet('all_rooms', res.data);
    return handleId(res.data);
  },
  getRoomsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/rooms`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getAllBeds: async () => {
    const cached = cacheGet('all_beds');
    if (cached) {
      axios.get(`${API_URL}/beds`).then(res => cacheSet('all_beds', res.data));
      return handleId(cached);
    }
    const res = await axios.get(`${API_URL}/beds`);
    const data = Array.isArray(res.data) ? res.data : [];
    cacheSet('all_beds', data);
    return handleId(data);
  },
  getBedsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/beds`, { params: { buildingId: bId } });
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
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
  getTenants: async () => {
    const cached = cacheGet('tenants');
    if (cached) {
      axios.get(`${API_URL}/tenants`).then(res => cacheSet('tenants', res.data));
      return handleId(cached);
    }
    const res = await axios.get(`${API_URL}/tenants`);
    cacheSet('tenants', res.data);
    return handleId(res.data);
  },
  getComplaints: async () => {
    const cached = cacheGet('complaints');
    if (cached) {
      axios.get(`${API_URL}/complaints`).then(res => cacheSet('complaints', res.data));
      return handleId(cached);
    }
    const res = await axios.get(`${API_URL}/complaints`);
    cacheSet('complaints', res.data);
    return handleId(res.data);
  },
  updateComplaintStatus: async (id, status, assignedTo = null) => {
    const res = await axios.patch(`${API_URL}/complaints/${id}`, { status, assignedTo });
    return handleId(res.data);
  },
  getPayments: async () => {
    const cached = cacheGet('payments');
    if (cached) {
      axios.get(`${API_URL}/payments`).then(res => cacheSet('payments', res.data));
      return handleId(cached);
    }
    const res = await axios.get(`${API_URL}/payments`);
    cacheSet('payments', res.data);
    return handleId(res.data);
  },
  getRoomTransfers: async () => {
    const res = await axios.get(`${API_URL}/room-transfers`);
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
    // data should include buildingId
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
  // Staff Management
  getStaff: async (bId) => {
    const res = await axios.get(`${API_URL}/staff`, { params: { buildingId: bId } });
    if (res.data && res.data.staffList) {
      res.data.staffList = res.data.staffList.map(s => ({ ...s, id: s._id }));
    }
    return res.data;
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
  updateSettings: async (data) => {
    const buildingId = data.buildingId || localStorage.getItem('selectedBuildingId');
    const res = await axios.post(`${API_URL}/settings`, { ...data, buildingId });
    cacheSet(`settings_${buildingId}`, res.data);
    return res.data;
  },

  // Notifications API
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

  // CRUD Operations
  addBuilding: async (data) => {
    const res = await axios.post(`${API_URL}/buildings`, data);
    return handleId(res.data);
  },
  updateBuilding: async (id, data) => {
    const res = await axios.patch(`${API_URL}/buildings/${id}`, data);
    return handleId(res.data);
  },
  deleteBuilding: async (id) => {
    await axios.delete(`${API_URL}/buildings/${id}`);
  },
  addFloor: async (data) => {
    const res = await axios.post(`${API_URL}/floors`, data);
    return handleId(res.data);
  },
  updateFloor: async (id, data) => {
    const res = await axios.put(`${API_URL}/floors/${id}`, data);
    return handleId(res.data);
  },
  deleteFloor: async (id) => {
    await axios.delete(`${API_URL}/floors/${id}`);
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
  }
};

window.api = api;
