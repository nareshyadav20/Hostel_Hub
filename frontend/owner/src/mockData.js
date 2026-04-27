import axios from 'axios';
import { withCache, cacheSet, cacheGet } from './cache';

// Fail fast (400ms) so that offline fallback is instantaneous and UI doesn't hang
axios.defaults.timeout = 400;

const API_URL = 'http://localhost:5001/api';

// ── id normaliser ──────────────────────────────────────────────
const handleId = (item) => {
  if (!item || typeof item !== 'object') return item;
  if (Array.isArray(item)) return item.map(handleId);
  const n = { ...item };
  if (item._id && !item.id) n.id = item._id.toString();
  Object.keys(n).forEach(k => {
    if (n[k] && typeof n[k] === 'object') n[k] = handleId(n[k]);
  });
  return n;
};

// ── safe JSON.parse helper ─────────────────────────────────────
const safeJson = (str, fallback = []) => {
  try { return JSON.parse(str) ?? fallback; } catch { return fallback; }
};

// ── last-known connectivity (read by Layout) ───────────────────
export let backendOnline = null; // null = unknown, true, false

const setOnline = (val) => { backendOnline = val; };

// ── generic read wrapper used by all GET calls ─────────────────
const cached = async (key, fetchFn, fallback = []) => {
  const result = await withCache(key, fetchFn, fallback);
  setOnline(!result.fromCache);
  return result.data;
};

// ══════════════════════════════════════════════════════════════
export const api = {

  // ── Buildings ───────────────────────────────────────────────
  getBuildings: () =>
    cached('buildings', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      return handleId(res.data);
    }, [
      { id: 'b1', name: 'Alpha Tower', address: 'North Campus', description: 'Premium Boys Hostel', amenities: ['WiFi', 'AC'], images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'] },
      { id: 'b2', name: 'Beta Block', address: 'South Campus', description: 'Standard Girls Hostel', amenities: ['WiFi'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'] }
    ]),

  addBuilding: async (data) => {
    const res = await axios.post(`${API_URL}/buildings`, data);
    return handleId(res.data);
  },
  updateBuilding: async (id, data) => {
    const res = await axios.patch(`${API_URL}/buildings/${id}`, data);
    return handleId(res.data);
  },
  deleteBuilding: async (id) => {
    const res = await axios.delete(`${API_URL}/buildings/${id}`);
    return res.data;
  },
  bulkCreateBuildings: async (buildings) => {
    const res = await axios.post(`${API_URL}/buildings/bulk`, { buildings });
    return handleId(res.data);
  },

  // ── Floors ──────────────────────────────────────────────────
  getFloors: (bId) =>
    cached(`floors_${bId}`, async () => {
      const res = await axios.get(`${API_URL}/floors/${bId}`);
      return handleId(res.data);
    }, [
      { id: 'f1', buildingId: bId, floorNumber: '1st Floor', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f2', buildingId: bId, floorNumber: '2nd Floor', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'] }
    ]),

  getAllFloors: () =>
    cached('floors_all', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      let all = [];
      res.data.forEach(b => {
        if (b.floors) all = [...all, ...b.floors.map(f => ({ ...f, buildingId: b._id.toString() }))];
      });
      return handleId(all);
    }, [
      { id: 'f1', buildingId: 'b1', floorNumber: '1st Floor', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f2', buildingId: 'b1', floorNumber: '2nd Floor', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f3', buildingId: 'b2', floorNumber: '1st Floor', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] }
    ]),

  addFloor: async (data) => {
    const res = await axios.post(`${API_URL}/floors`, data);
    return handleId(res.data);
  },
  updateFloor: async (id, data) => {
    const res = await axios.patch(`${API_URL}/floors/${id}`, data);
    return handleId(res.data);
  },
  deleteFloor: async (id) => {
    const res = await axios.delete(`${API_URL}/floors/${id}`);
    return res.data;
  },
  bulkCreateFloors: async (buildingId, floorNumbers) => {
    const res = await axios.post(`${API_URL}/floors/bulk`, { buildingId, floorNumbers });
    return handleId(res.data);
  },

  // ── Rooms ───────────────────────────────────────────────────
  getRooms: (fId) =>
    cached(`rooms_${fId}`, async () => {
      const res = await axios.get(`${API_URL}/rooms/${fId}`);
      return handleId(res.data);
    }, [
      { id: 'r1', floorId: fId, roomNumber: '101', roomType: 'Single', capacity: 1, status: 'Active' },
      { id: 'r2', floorId: fId, roomNumber: '102', roomType: 'Double', capacity: 2, status: 'Active' }
    ]),

  getAllRooms: () =>
    cached('rooms_all', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      let all = [];
      res.data.forEach(b => {
        if (b.floors) b.floors.forEach(f => {
          if (f.rooms) all = [...all, ...f.rooms.map(r => ({ ...r, floorId: f._id.toString() }))];
        });
      });
      return handleId(all);
    }, [
      { id: 'r1', floorId: 'f1', roomNumber: '101', roomType: 'Single', capacity: 1, status: 'Active' },
      { id: 'r2', floorId: 'f1', roomNumber: '102', roomType: 'Double', capacity: 2, status: 'Active' },
      { id: 'r3', floorId: 'f2', roomNumber: '201', roomType: 'Double', capacity: 2, status: 'Active' }
    ]),

  addRoom: async (data) => {
    const res = await axios.post(`${API_URL}/rooms`, data);
    return handleId(res.data);
  },
  bulkCreateRooms: async (data) => {
    const res = await axios.post(`${API_URL}/rooms/bulk-create`, data);
    return handleId(res.data);
  },
  updateRoom: async (id, data) => {
    const res = await axios.patch(`${API_URL}/rooms/${id}`, data);
    return handleId(res.data);
  },
  updateRoomStatus: async (id, status) => {
    if (!/^[0-9a-fA-F]{24}$/.test(String(id))) {
      const cachedRooms = cacheGet('rooms_all');
      if (cachedRooms) {
        const updated = cachedRooms.map(r => (r.id === id || r._id === id) ? { ...r, status } : r);
        cacheSet('rooms_all', updated);
      }
      return { id, status };
    }
    try {
      const res = await axios.patch(`${API_URL}/rooms/${id}`, { status });
      return handleId(res.data);
    } catch (err) {
      const cachedRooms = cacheGet('rooms_all');
      if (cachedRooms) {
        const updated = cachedRooms.map(r => (r.id === id || r._id === id) ? { ...r, status } : r);
        cacheSet('rooms_all', updated);
      }
      return { id, status };
    }
  },
  deleteRoom: async (id) => {
    const res = await axios.delete(`${API_URL}/rooms/${id}`);
    return res.data;
  },

  // ── Beds ────────────────────────────────────────────────────
  getBeds: (rId) =>
    cached(`beds_${rId}`, async () => {
      const res = await axios.get(`${API_URL}/beds/${rId}`);
      return handleId(res.data);
    }, [
      { id: 'bd1', roomId: rId, bedNumber: 'A', status: 'OCCUPIED', tenant: 'Rahul S.' },
      { id: 'bd2', roomId: rId, bedNumber: 'B', status: 'AVAILABLE', tenant: null }
    ]),

  getAllBeds: () =>
    cached('beds_all', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      let all = [];
      res.data.forEach(b => {
        if (b.floors) b.floors.forEach(f => {
          if (f.rooms) f.rooms.forEach(r => {
            if (r.beds) all = [...all, ...r.beds.map(bed => ({ ...bed, roomId: r._id.toString() }))];
          });
        });
      });
      return handleId(all);
    }, [
      { id: 'bd1', roomId: 'r1', bedNumber: 'A', status: 'OCCUPIED', tenant: 'Rahul S.' },
      { id: 'bd2', roomId: 'r2', bedNumber: 'A', status: 'AVAILABLE', tenant: null },
      { id: 'bd3', roomId: 'r2', bedNumber: 'B', status: 'OCCUPIED', tenant: 'Amit K.' }
    ]),

  addBed: async (data) => {
    const res = await axios.post(`${API_URL}/beds`, data);
    return handleId(res.data);
  },
  updateBed: async (id, data) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, data);
    return handleId(res.data);
  },
  updateBedStatus: async (id, status, tenant) => {
    if (!/^[0-9a-fA-F]{24}$/.test(String(id))) {
      const cachedBeds = cacheGet('beds_all');
      if (cachedBeds) {
        const updated = cachedBeds.map(b => (b.id === id || b._id === id) ? { ...b, status, tenant } : b);
        cacheSet('beds_all', updated);
      }
      return { id, status, tenant };
    }
    try {
      const res = await axios.patch(`${API_URL}/beds/${id}`, { status, tenant });
      return handleId(res.data);
    } catch (err) {
      const cachedBeds = cacheGet('beds_all');
      if (cachedBeds) {
        const updated = cachedBeds.map(b => (b.id === id || b._id === id) ? { ...b, status, tenant } : b);
        cacheSet('beds_all', updated);
      }
      return { id, status, tenant };
    }
  },
  deleteBed: async (id) => {
    const res = await axios.delete(`${API_URL}/beds/${id}`);
    return res.data;
  },
  bulkCreateBeds: async (roomId, beds) => {
    const res = await axios.post(`${API_URL}/beds/bulk-create`, { roomId, beds });
    return handleId(res.data);
  },

  // ── Hostels & Mappings ──────────────────────────────────────
  getHostels: async () => [
    { id: 'h1', name: 'Men Hostel A' },
    { id: 'h2', name: 'Women Hostel B' },
  ],
  getAssignedFloors: async (hId) => {
    const res = await axios.get(`${API_URL}/hostel-floor-mapping?hostelId=${hId}`);
    const data = handleId(res.data);
    return data.map(m => m.floor.id);
  },

  // ── Complaints (static) ─────────────────────────────────────
  getComplaints: async () => [
    { id: 1, room: '201-A', issue: 'Water Leakage in Bathroom',   category: 'Plumbing',   urgency: 'High',   status: 'Pending',     reportedBy: 'Rahul Sharma', timeElapsed: '2 hours ago' },
    { id: 2, room: '202-B', issue: 'AC Not Cooling properly',      category: 'Electrical', urgency: 'Medium', status: 'In-Progress', reportedBy: 'Priya Verma',  timeElapsed: '1 day ago'   },
    { id: 3, room: '101-A', issue: 'WiFi Connection dropping',     category: 'Internet',   urgency: 'Low',    status: 'Resolved',    reportedBy: 'Amit Singh',   timeElapsed: '3 days ago'  },
    { id: 4, room: '305-C', issue: 'Deep Cleaning Required',       category: 'Cleaning',   urgency: 'Medium', status: 'Pending',     reportedBy: 'Sneha Kapur',  timeElapsed: '4 hours ago' },
  ],

  // ── Mess Plans (static) ─────────────────────────────────────
  getMessPlans: async () => [
    { id: 'p1', name: 'Basic Plan',    price: 0,    features: ['Standard Meals', 'No Customization'],                                      color: '#94a3b8' },
    { id: 'p2', name: 'Standard Plan', price: 1000, features: ['Standard Meals', 'Partial Customization', '1 Special Meal/mo'],            color: '#3b82f6' },
    { id: 'p3', name: 'Premium Plan',  price: 1500, features: ['Full Customization', 'Unlimited Special Meals', 'Add-on Priority'],        color: '#8b5cf6', popular: true },
  ],
  getMessSubscriptions: async () => [
    { tenantId: 't1', planId: 'p3', startDate: '2024-01-01', addons: ['Evening Snacks'] },
    { tenantId: 't2', planId: 'p2', startDate: '2024-01-05', addons: [] },
    { tenantId: 't3', planId: 'p1', startDate: '2024-01-10', addons: [] },
  ],

  // ── Tenants ─────────────────────────────────────────────────
  getTenants: () =>
    cached('tenants', async () => {
      const res = await axios.get(`${API_URL}/tenants`);
      return handleId(res.data);
    }),

  addTenant: async (data) => {
    const res = await axios.post(`${API_URL}/tenants`, data);
    return handleId(res.data);
  },
  bulkCreateTenants: async (tenants) => {
    const res = await axios.post(`${API_URL}/tenants/bulk-create`, { tenants });
    return handleId(res.data);
  },

  // ── Dashboard ────────────────────────────────────────────────
  getDashboardSummary: () =>
    cached('dash_summary', async () => {
      const res = await axios.get(`${API_URL}/dashboard/summary`);
      return res.data;
    }, null),

  getDashboardRevenue: () =>
    cached('dash_revenue', async () => {
      const res = await axios.get(`${API_URL}/dashboard/revenue`);
      return res.data;
    }, null),

  getDashboardOccupancy: () =>
    cached('dash_occupancy', async () => {
      const res = await axios.get(`${API_URL}/dashboard/occupancy`);
      return res.data;
    }, null),

  getDashboardAlerts: () =>
    cached('dash_alerts', async () => {
      const res = await axios.get(`${API_URL}/dashboard/alerts`);
      return res.data;
    }, null),

  getDashboardComplaints: () =>
    cached('dash_complaints', async () => {
      const res = await axios.get(`${API_URL}/dashboard/complaints`);
      return res.data;
    }, null),

  getDashboardMess: () =>
    cached('dash_mess', async () => {
      const res = await axios.get(`${API_URL}/dashboard/mess`);
      return res.data;
    }, null),

  getDashboardStaff: () =>
    cached('dash_staff', async () => {
      const res = await axios.get(`${API_URL}/dashboard/staff`);
      return res.data;
    }, null),

  // ── Auth ─────────────────────────────────────────────────────
  login: async (email, password) => ({
    success: true,
    user: { email, role: 'owner' },
  }),
};
