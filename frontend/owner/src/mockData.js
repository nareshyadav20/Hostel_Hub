import axios from 'axios';

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
    const res = await axios.get(`${API_URL}/owner/profile`);
    return res.data;
  },
  updateOwnerProfile: async (data) => {
    const res = await axios.patch(`${API_URL}/owner/profile`, data);
    return res.data;
  },
  getOwnerStats: async () => {
    const res = await axios.get(`${API_URL}/owner/stats`);
    return res.data;
  },
  getOwnerHistory: async () => {
    const res = await axios.get(`${API_URL}/owner/history`);
    return res.data;
  },
  updateOwnerDocuments: async (doc) => {
    const res = await axios.post(`${API_URL}/owner/documents`, doc);
    return res.data;
  },

  // Buildings & Infrastructure
  getBuildings: async () => {
    const res = await axios.get(`${API_URL}/buildings`, { params: { status: 'Active' } });
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  getDraftBuildings: async () => {
    const res = await axios.get(`${API_URL}/buildings`, { params: { status: 'Draft' } });
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
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
    const res = await axios.get(`${API_URL}/rooms`);
    return handleId(res.data);
  },
  getRoomsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/rooms`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getAllBeds: async () => {
    const res = await axios.get(`${API_URL}/beds`);
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  getBedsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/beds`, { params: { buildingId: bId } });
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  recommendBeds: async (buildingId, preferences) => {
    const res = await axios.post(`${API_URL}/beds/recommend`, { buildingId, preferences });
    return handleId(res.data);
  },
  getMaintenanceBeds: async () => {
    const res = await axios.get(`${API_URL}/beds/maintenance`);
    return handleId(res.data);
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
    const res = await axios.get(`${API_URL}/tenants`, { params });
    return handleId(res.data);
  },
  getComplaints: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    const res = await axios.get(`${API_URL}/complaints`, { params });
    return handleId(res.data);
  },
  updateComplaintStatus: async (id, status, assignedTo = null) => {
    const res = await axios.patch(`${API_URL}/complaints/${id}`, { status, assignedTo });
    return handleId(res.data);
  },
  getPayments: async (buildingId) => {
    const params = buildingId ? { buildingId } : {};
    const res = await axios.get(`${API_URL}/payments`, { params });
    return handleId(res.data);
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
    const res = await axios.get(`${API_URL}/settings`, { params: { buildingId } });
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
  }
};

window.api = api;
