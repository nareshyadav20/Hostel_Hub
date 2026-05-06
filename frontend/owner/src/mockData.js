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
  getOwnerStats: async () => {
    try {
      const blds = await api.getBuildings();
      const stats = await Promise.all(blds.map(b => api.getDashboardSummary(b.id).catch(() => null)));
      const validStats = stats.filter(Boolean);
      return {
        buildingCount: blds.length,
        totalBeds: validStats.reduce((sum, s) => sum + (s.totalBeds || 0), 0),
        occupiedBeds: validStats.reduce((sum, s) => sum + (s.occupiedBeds || 0), 0),
        expectedMonthlyRevenue: validStats.reduce((sum, s) => sum + (s.revenue?.expected || 0), 0),
        occupancyRate: validStats.length > 0
          ? Math.round(validStats.reduce((sum, s) => sum + ((s.occupiedBeds || 0) / (s.totalBeds || 1) * 100), 0) / validStats.length)
          : 0
      };
    } catch (err) {
      return { buildingCount: 0, totalBeds: 0, occupiedBeds: 0, expectedMonthlyRevenue: 0, occupancyRate: 0 };
    }
  },
  updateOwnerProfile: async (data) => {
    const res = await axios.patch(`${API_URL}/owner/profile`, data);
    return res.data;
  },
  updateOwnerDocuments: async (doc) => {
    const res = await axios.post(`${API_URL}/owner/documents`, doc);
    return res.data;
  },

  // Buildings & Infrastructure
  getBuildings: async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    return handleId(res.data.filter(b => b.status !== 'Draft'));
  },
  getAllFloors: async () => {
    const blds = await api.getBuildings();
    const all = await Promise.all(blds.map(b => api.getFloorsByBuilding(b.id).catch(() => [])));
    return all.flat();
  },
  getFloors: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    return handleId(res.data);
  },
  getFloorsByBuilding: async (bId) => {
    return await api.getFloors(bId);
  },
  getAllRooms: async () => {
    const blds = await api.getBuildings();
    const all = await Promise.all(blds.map(b => api.getRoomsByBuilding(b.id).catch(() => [])));
    return all.flat();
  },
  getRooms: async (fId) => {
    const res = await axios.get(`${API_URL}/rooms/${fId}`);
    return handleId(res.data);
  },
  getRoomsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    const floors = res.data || [];
    const rooms = floors.flatMap(f => (f.rooms || []).map(r => ({ ...r, floorId: f._id || f.id })));
    return handleId(rooms);
  },
  getAllBeds: async () => {
    const blds = await api.getBuildings();
    const all = await Promise.all(blds.map(b => api.getBedsByBuilding(b.id).catch(() => [])));
    return all.flat();
  },
  getBeds: async (rId) => {
    const res = await axios.get(`${API_URL}/beds/${rId}`);
    return handleId(res.data);
  },
  getBedsByBuilding: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    const floors = res.data || [];
    const beds = floors.flatMap(f => (f.rooms || []).flatMap(r => (r.beds || []).map(b => ({ ...b, roomId: r._id || r.id }))));
    return handleId(beds);
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
  getTenants: async (bId) => {
    const res = await axios.get(`${API_URL}/tenants`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getComplaints: async (bId) => {
    const res = await axios.get(`${API_URL}/complaints`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  updateComplaintStatus: async (id, status, assignedTo = null) => {
    const res = await axios.patch(`${API_URL}/complaints/${id}`, { status, assignedTo });
    return handleId(res.data);
  },
  getPayments: async (bId) => {
    const res = await axios.get(`${API_URL}/payments`, { params: { buildingId: bId } });
    return handleId(res.data);
  },
  getRoomTransfers: async (bId) => {
    const res = await axios.get(`${API_URL}/room-transfers`, { params: { buildingId: bId } });
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
  getSettings: async (bId) => {
    const res = await axios.get(`${API_URL}/settings`, { params: { buildingId: bId } });
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await axios.post(`${API_URL}/settings`, data);
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
    return handleId(res.data);
  },
  updateRoomStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/rooms/${id}`, { status });
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
  deleteBed: async (id) => {
    await axios.delete(`${API_URL}/beds/${id}`);
  },
  addTenant: async (data) => {
    const res = await axios.post(`${API_URL}/tenants`, data);
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
  }
};

window.api = api;
