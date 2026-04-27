import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const handleId = (item) => {
  if (!item || typeof item !== 'object') return item;
  if (Array.isArray(item)) return item.map(handleId);
  
  const newItem = { ...item };
  if (item._id && !item.id) newItem.id = item._id.toString();
  
  // Recursively handle all properties
  Object.keys(newItem).forEach(key => {
    if (newItem[key] && typeof newItem[key] === 'object') {
      newItem[key] = handleId(newItem[key]);
    }
  });
  
  return newItem;
};

export const api = {
  // Buildings
  getBuildings: async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    return handleId(res.data);
  },
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

  // Floors
  getFloors: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    return handleId(res.data);
  },
  getAllFloors: async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const buildings = res.data;
    let allFloors = [];
    buildings.forEach(b => {
      if (b.floors) allFloors = [...allFloors, ...b.floors.map(f => ({ ...f, buildingId: b._id.toString() }))];
    });
    return handleId(allFloors);
  },
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

  // Rooms
  getRooms: async (fId) => {
    const res = await axios.get(`${API_URL}/rooms/${fId}`);
    return handleId(res.data);
  },
  getAllRooms: async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const buildings = res.data;
    let allRooms = [];
    buildings.forEach(b => {
      if (b.floors) {
        b.floors.forEach(f => {
          if (f.rooms) allRooms = [...allRooms, ...f.rooms.map(r => ({ ...r, floorId: f._id.toString() }))];
        });
      }
    });
    return handleId(allRooms);
  },
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
    const res = await axios.patch(`${API_URL}/rooms/${id}`, { status });
    return handleId(res.data);
  },
  deleteRoom: async (id) => {
    const res = await axios.delete(`${API_URL}/rooms/${id}`);
    return res.data;
  },

  // Beds
  getBeds: async (rId) => {
    const res = await axios.get(`${API_URL}/beds/${rId}`);
    return handleId(res.data);
  },
  getAllBeds: async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const buildings = res.data;
    let allBeds = [];
    buildings.forEach(b => {
      if (b.floors) {
        b.floors.forEach(f => {
          if (f.rooms) {
            f.rooms.forEach(r => {
              if (r.beds) allBeds = [...allBeds, ...r.beds.map(bed => ({ ...bed, roomId: r._id.toString() }))];
            });
          }
        });
      }
    });
    return handleId(allBeds);
  },
  addBed: async (data) => {
    const res = await axios.post(`${API_URL}/beds`, data);
    return handleId(res.data);
  },
  updateBed: async (id, data) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, data);
    return handleId(res.data);
  },
  updateBedStatus: async (id, status, tenant) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, { status, tenant });
    return handleId(res.data);
  },
  deleteBed: async (id) => {
    const res = await axios.delete(`${API_URL}/beds/${id}`);
    return res.data;
  },
  bulkCreateBeds: async (roomId, beds) => {
    const res = await axios.post(`${API_URL}/beds/bulk-create`, { roomId, beds });
    return handleId(res.data);
  },

  // Hostels & Mappings
  getHostels: async () => [{ id: 'h1', name: 'Men Hostel A' }, { id: 'h2', name: 'Women Hostel B' }],
  getAssignedFloors: async (hId) => {
     const res = await axios.get(`${API_URL}/hostel-floor-mapping?hostelId=${hId}`);
     // Use handleId to ensure we have .id, then map
     const data = handleId(res.data);
     return data.map(m => m.floor.id);
  },
  
  // Complaints
  getComplaints: async () => [
    { id: 1, room: '201-A', issue: 'Water Leakage in Bathroom', category: 'Plumbing', urgency: 'High', status: 'Pending', reportedBy: 'Rahul Sharma', timeElapsed: '2 hours ago' },
    { id: 2, room: '202-B', issue: 'AC Not Cooling properly', category: 'Electrical', urgency: 'Medium', status: 'In-Progress', reportedBy: 'Priya Verma', timeElapsed: '1 day ago' },
    { id: 3, room: '101-A', issue: 'WiFi Connection dropping', category: 'Internet', urgency: 'Low', status: 'Resolved', reportedBy: 'Amit Singh', timeElapsed: '3 days ago' },
    { id: 4, room: '305-C', issue: 'Deep Cleaning Required', category: 'Cleaning', urgency: 'Medium', status: 'Pending', reportedBy: 'Sneha Kapur', timeElapsed: '4 hours ago' },
  ],

  // Mess Subscriptions
  getMessPlans: async () => [
    { id: 'p1', name: 'Basic Plan', price: 0, features: ['Standard Meals', 'No Customization'], color: '#94a3b8' },
    { id: 'p2', name: 'Standard Plan', price: 1000, features: ['Standard Meals', 'Partial Customization', '1 Special Meal/mo'], color: '#3b82f6' },
    { id: 'p3', name: 'Premium Plan', price: 1500, features: ['Full Customization', 'Unlimited Special Meals', 'Add-on Priority'], color: '#8b5cf6', popular: true },
  ],
  getMessSubscriptions: async () => [
    { tenantId: 't1', planId: 'p3', startDate: '2024-01-01', addons: ['Evening Snacks'] },
    { tenantId: 't2', planId: 'p2', startDate: '2024-01-05', addons: [] },
    { tenantId: 't3', planId: 'p1', startDate: '2024-01-10', addons: [] },
  ],

  // Tenants
  getTenants: async () => {
    const res = await axios.get(`${API_URL}/tenants`);
    return handleId(res.data);
  },
  addTenant: async (data) => {
    const res = await axios.post(`${API_URL}/tenants`, data);
    return handleId(res.data);
  },
  bulkCreateTenants: async (tenants) => {
    const res = await axios.post(`${API_URL}/tenants/bulk-create`, { tenants });
    return handleId(res.data);
  },

  // Dashboard
  getDashboardSummary: async () => {
    const res = await axios.get(`${API_URL}/dashboard/summary`);
    return res.data;
  },
  getDashboardRevenue: async () => {
    const res = await axios.get(`${API_URL}/dashboard/revenue`);
    return res.data;
  },
  getDashboardOccupancy: async () => {
    const res = await axios.get(`${API_URL}/dashboard/occupancy`);
    return res.data;
  },
  getDashboardAlerts: async () => {
    const res = await axios.get(`${API_URL}/dashboard/alerts`);
    return res.data;
  },
  getDashboardComplaints: async () => {
    const res = await axios.get(`${API_URL}/dashboard/complaints`);
    return res.data;
  },
  getDashboardMess: async () => {
    const res = await axios.get(`${API_URL}/dashboard/mess`);
    return res.data;
  },
  getDashboardStaff: async () => {
    const res = await axios.get(`${API_URL}/dashboard/staff`);
    return res.data;
  },

  // Auth
  login: async (email, password) => {
    return { success: true, user: { email, role: 'owner' } };
  },
};
