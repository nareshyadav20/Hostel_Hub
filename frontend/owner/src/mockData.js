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
  // If we got empty data (from backend OR cache), but have a non-empty fallback, use fallback
  if (Array.isArray(result.data) && result.data.length === 0 && fallback.length > 0) {
    return handleId(fallback);
  }
  return result.data;
};

const DASHBOARD_FALLBACKS = {
  summary: { totalBeds:150, occupiedBeds:120, vacantBeds:30, occupancyRate:80, todayRevenue:15000, expectedMonthlyRevenue:450000, pendingPaymentsCount:5, pendingPaymentsAmount:32500, maintenanceRooms:2, healthScore:72, buildingCount:3, checkInsToday:3, checkOutsToday:1, rentDueToday:5, complaintsToday:2, newTenantsThisMonth:9, renewalsPending:4, tenantsLeavingSoon:2, totalTenants:120 },
  revenue: { dailyRevenue:[{name:'Mon',expected:13000,actual:11500},{name:'Tue',expected:13000,actual:13000},{name:'Wed',expected:13000,actual:10000},{name:'Thu',expected:13000,actual:14000},{name:'Fri',expected:13000,actual:12500},{name:'Sat',expected:13000,actual:9000},{name:'Sun',expected:13000,actual:14500}], monthlyRevenue:[{name:'Jan',revenue:850000,expenses:300000},{name:'Feb',revenue:920000,expenses:320000},{name:'Mar',revenue:1050000,expenses:340000},{name:'Apr',revenue:1200000,expenses:360000},{name:'May',revenue:1350000,expenses:380000},{name:'Jun',revenue:1500000,expenses:400000}], rentMetrics:{ pendingRent:87500, collectedRent:1462500, securityDepositsHeld:3250000, totalIncome:1550000, totalExpenses:480000, netProfit:1070000 } },
  occupancy: { buildingWise:[], floorWise:[] },
  alerts: { alerts:[], insights:[] },
  complaints: { total:24, open:9, resolved:15, highPriority:4, avgResolutionHours:4.2, categories:[{name:'Maintenance',count:10},{name:'Cleaning',count:6},{name:'Food',count:5},{name:'Others',count:3}], pending24h:3 },
  mess: { mealsServedToday:187, avgFoodRating:3.8, dailyMessCost:14500, monthlyMessCost:435000, menuToday:{breakfast:'Idli Sambar, Tea',lunch:'Rice, Dal, Sabzi, Roti',dinner:'Chapati, Paneer Curry, Salad'}, mealTrend:[{name:'Mon',served:180},{name:'Tue',served:192},{name:'Wed',served:175},{name:'Thu',served:188},{name:'Fri',served:195},{name:'Sat',served:160},{name:'Sun',served:145}], inventory:[{item:'Rice',stock:15,unit:'kg',alert:true},{item:'Dal',stock:40,unit:'kg',alert:false},{item:'Cooking Oil',stock:8,unit:'L',alert:true}], foodComplaints:{total:12,quality:5,hygiene:3,quantity:2,delay:2} },
  staff: { 
    totalStaff: 8, 
    tasksAssigned: 34, 
    tasksCompleted: 28, 
    tasksPending: 6, 
    efficiencyScore: 82, 
    staffList: [
      { 
        id: 's1', 
        name: 'Arjun Kumar', 
        role: 'Warden', 
        status: 'Active', 
        phone: '+91 98765 00001', 
        email: 'arjun.k@hostelhub.com',
        salary: 25000, 
        joiningDate: '2023-01-15',
        building: 'Alpha Tower',
        shift: 'Day (9 AM - 6 PM)',
        performance: 4.8,
        attendance: {
          percentage: 96,
          monthly: [
            { name: 'Week 1', present: 6, total: 6 },
            { name: 'Week 2', present: 5, total: 6 },
            { name: 'Week 3', present: 6, total: 6 },
            { name: 'Week 4', present: 6, total: 6 }
          ]
        },
        tasks: [
          { id: 't1', title: 'Inspect Room 101 damage', status: 'COMPLETED', date: '2024-03-24' },
          { id: 't2', title: 'Collect pending rent from 202', status: 'PENDING', date: '2024-03-25' },
          { id: 't3', title: 'Verify fire safety equipment', status: 'COMPLETED', date: '2024-03-20' }
        ],
        metrics: {
          completionRate: 92,
          avgResolutionTime: '2.5h',
          satisfaction: 4.9,
          history: [
            { date: 'Jan', rate: 85 },
            { date: 'Feb', rate: 88 },
            { date: 'Mar', rate: 92 }
          ]
        },
        salaryHistory: [
          { id: 'p1', month: 'February 2024', amount: 25000, status: 'Paid', date: '2024-03-01' },
          { id: 'p2', month: 'January 2024', amount: 25000, status: 'Paid', date: '2024-02-01' }
        ],
        documents: [
          { name: 'Aadhar Card', type: 'ID PROOF', date: '2023-01-15' },
          { name: 'Employment Contract', type: 'CONTRACT', date: '2023-01-15' }
        ],
        activityLog: [
          { action: 'Updated Room 101 status', time: '2 hours ago' },
          { action: 'Marked attendance', time: '5 hours ago' }
        ]
      },
      { 
        id: 's2', 
        name: 'Sunita Devi', 
        role: 'Cook', 
        status: 'Active',
        phone: '+91 98765 00002', 
        email: 'sunita.d@hostelhub.com',
        salary: 15000, 
        joiningDate: '2023-03-10',
        building: 'Alpha Tower',
        shift: 'Morning (6 AM - 2 PM)',
        performance: 4.5,
        attendance: { percentage: 100, monthly: [] },
        tasks: [],
        metrics: { completionRate: 100, avgResolutionTime: '1h', satisfaction: 4.5, history: [] },
        salaryHistory: [],
        documents: [],
        activityLog: []
      },
      { 
        id: 's3', 
        name: 'Ramesh Pal', 
        role: 'Security', 
        status: 'Active',
        phone: '+91 98765 00003', 
        email: 'ramesh.p@hostelhub.com',
        salary: 18000, 
        joiningDate: '2023-06-01',
        building: 'Beta Block',
        shift: 'Night (10 PM - 6 AM)',
        performance: 4.2,
        attendance: { percentage: 92, monthly: [] },
        tasks: [],
        metrics: { completionRate: 85, avgResolutionTime: '4h', satisfaction: 4.2, history: [] },
        salaryHistory: [],
        documents: [],
        activityLog: []
      }
    ] 
  },
};

// ══════════════════════════════════════════════════════════════
export const api = {

  // ── Buildings ───────────────────────────────────────────────
  getBuildings: () =>
    cached('buildings_v2', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      return handleId(res.data);
    }, [
      { id: 'b1', name: 'Alpha Tower', address: 'North Campus', description: 'Premium Boys Hostel', amenities: ['WiFi', 'AC', 'Gym'], images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'], isAC: true },
      { id: 'b2', name: 'Beta Block', address: 'South Campus', description: 'Standard Girls Hostel', amenities: ['WiFi', 'Common Area'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'], isAC: false }
    ]),

  addBuilding: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/buildings`, data);
      return handleId(res.data);
    } catch (err) {
      const newB = { id: `b_${Date.now()}`, ...data };
      const cached = cacheGet('buildings_v2') || [];
      cacheSet('buildings_v2', [...cached, newB]);
      return newB;
    }
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
  getFloors: async (bId) => {
    const all = await api.getAllFloors();
    return all.filter(f => f.buildingId === bId);
  },

  getAllFloors: () =>
    cached('floors_all_v2', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      let all = [];
      res.data.forEach(b => {
        if (b.floors) all = [...all, ...b.floors.map(f => ({ ...f, buildingId: b._id.toString() }))];
      });
      return handleId(all);
    }, [
      { id: 'f1', buildingId: 'b1', floorNumber: '1st Floor', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f2', buildingId: 'b1', floorNumber: '2nd Floor', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f3', buildingId: 'b2', floorNumber: '1st Floor', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] },
      { id: 'f4', buildingId: 'b2', floorNumber: '2nd Floor', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'] }
    ]),

  addFloor: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/floors`, data);
      return handleId(res.data);
    } catch (err) {
      const newF = { id: `f_${Date.now()}`, ...data };
      const cached = cacheGet('floors_all_v2') || [];
      cacheSet('floors_all_v2', [...cached, newF]);
      return newF;
    }
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
  getRooms: async (fId) => {
    const all = await api.getAllRooms();
    return all.filter(r => r.floorId === fId);
  },

  getAllRooms: () =>
    cached('rooms_all_v2', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      let all = [];
      res.data.forEach(b => {
        if (b.floors) b.floors.forEach(f => {
          if (f.rooms) all = [...all, ...f.rooms.map(r => ({ ...r, floorId: f._id.toString() }))];
        });
      });
      return handleId(all);
    }, [
      { id: 'r1', floorId: 'f1', roomNumber: '101', roomType: 'Single', capacity: 2, status: 'Active', isAC: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'] },
      { id: 'r2', floorId: 'f1', roomNumber: '102', roomType: 'Double', capacity: 2, status: 'Active', isAC: false, images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'] },
      { id: 'r3', floorId: 'f2', roomNumber: '201', roomType: 'Double', capacity: 2, status: 'Active', isAC: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'] },
      { id: 'rB1', floorId: 'f3', roomNumber: 'B101', roomType: 'Double', capacity: 2, status: 'Active', isAC: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'] },
      { id: 'rB2', floorId: 'f4', roomNumber: 'B201', roomType: 'Single', capacity: 1, status: 'Active', isAC: false, images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'] }
    ]),

  addRoom: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/rooms`, data);
      return handleId(res.data);
    } catch (err) {
      const newR = { id: `r_${Date.now()}`, status: 'AVAILABLE', ...data };
      const cached = cacheGet('rooms_all_v2') || [];
      cacheSet('rooms_all_v2', [...cached, newR]);
      return newR;
    }
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
    const updateCache = () => {
      const cachedRooms = cacheGet('rooms_all_v2');
      if (cachedRooms) {
        const updated = cachedRooms.map(r => (r.id === id || r._id === id) ? { ...r, status } : r);
        cacheSet('rooms_all_v2', updated);
      }
    };
    if (!/^[0-9a-fA-F]{24}$/.test(String(id))) {
      updateCache();
      return { id, status };
    }
    try {
      const res = await axios.patch(`${API_URL}/rooms/${id}`, { status });
      return handleId(res.data);
    } catch (err) {
      updateCache();
      return { id, status };
    }
  },
  deleteRoom: async (id) => {
    const res = await axios.delete(`${API_URL}/rooms/${id}`);
    return res.data;
  },

  // ── Beds ────────────────────────────────────────────────────
  getBeds: async (rId) => {
    const all = await api.getAllBeds();
    return all.filter(b => b.roomId === rId);
  },

  getAllBeds: () =>
    cached('beds_all_v2', async () => {
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
      { id: 'bd1', roomId: 'r1', bedNumber: '101A', status: 'OCCUPIED', tenant: 'Rahul S.', images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80'] },
      { id: 'bd2', roomId: 'r1', bedNumber: '101B', status: 'AVAILABLE', tenant: null, images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'] },
      { id: 'bd3', roomId: 'r2', bedNumber: 'A', status: 'OCCUPIED', tenant: 'Amit K.', images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80'] },
      { id: 'bd4', roomId: 'r3', bedNumber: 'A', status: 'OCCUPIED', tenant: 'Priya V.', images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'] },
      { id: 'bdB1', roomId: 'rB1', bedNumber: '1', status: 'AVAILABLE', tenant: null, images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80'] },
      { id: 'bdB2', roomId: 'rB1', bedNumber: '2', status: 'OCCUPIED', tenant: 'Sanya M.', images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'] }
    ]),

  addBed: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/beds`, data);
      return handleId(res.data);
    } catch (err) {
      const newB = { id: `bd_${Date.now()}`, tenant: null, status: 'AVAILABLE', ...data };
      const cached = cacheGet('beds_all_v2') || [];
      cacheSet('beds_all_v2', [...cached, newB]);
      return newB;
    }
  },
  updateBed: async (id, data) => {
    const res = await axios.patch(`${API_URL}/beds/${id}`, data);
    return handleId(res.data);
  },
  updateBedStatus: async (id, status, tenant) => {
    const updateCache = () => {
      const cachedBeds = cacheGet('beds_all_v2');
      if (cachedBeds) {
        const updated = cachedBeds.map(b => (b.id === id || b._id === id) ? { ...b, status, tenant } : b);
        cacheSet('beds_all_v2', updated);
      }
    };
    if (!/^[0-9a-fA-F]{24}$/.test(String(id))) {
      updateCache();
      return { id, status, tenant };
    }
    try {
      const res = await axios.patch(`${API_URL}/beds/${id}`, { status, tenant });
      return handleId(res.data);
    } catch (err) {
      updateCache();
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
    { id: 1, room: '201-A', issue: 'Water Leakage in Bathroom',   category: 'Plumbing',   urgency: 'High',   status: 'Pending',     reportedBy: 'Rahul Sharma', timeElapsed: '2 hours ago', resolutionTime: null, createdAt: '2024-03-25T10:00:00Z' },
    { id: 2, room: '202-B', issue: 'AC Not Cooling properly',      category: 'Electrical', urgency: 'Medium', status: 'In-Progress', reportedBy: 'Priya Verma',  timeElapsed: '1 day ago',   resolutionTime: null, createdAt: '2024-03-24T09:00:00Z' },
    { id: 3, room: '101-A', issue: 'WiFi Connection dropping',     category: 'Internet',   urgency: 'Low',    status: 'Resolved',    reportedBy: 'Amit Singh',   timeElapsed: '3 days ago',  resolutionTime: 48,   createdAt: '2024-03-22T08:00:00Z' },
    { id: 4, room: '305-C', issue: 'Deep Cleaning Required',       category: 'Cleaning',   urgency: 'Medium', status: 'Pending',     reportedBy: 'Sneha Kapur',  timeElapsed: '4 hours ago', resolutionTime: null, createdAt: '2024-03-25T08:00:00Z' },
  ],

  // ── Payments (static) ───────────────────────────────────────
  getPayments: async () => [
    { id: 1, tenantId: 't1', amount: 8000, status: 'Paid',    date: '2024-03-05', month: 'March', type: 'Rent', category: 'Single', invoice: 'INV-001', method: 'UPI' },
    { id: 2, tenantId: 't2', amount: 6000, status: 'Paid',    date: '2024-03-07', month: 'March', type: 'Rent', category: 'Double', invoice: 'INV-002', method: 'Bank Transfer' },
    { id: 3, tenantId: 't3', amount: 4500, status: 'Pending', date: '2024-03-05', month: 'March', type: 'Rent', category: 'Shared', invoice: 'INV-003', method: 'Cash' },
    { id: 4, tenantId: 't4', amount: 8000, status: 'Overdue', date: '2024-02-05', month: 'February', type: 'Rent', category: 'Single', invoice: 'INV-004', method: 'UPI' },
    { id: 5, tenantId: 't5', amount: 6000, status: 'Paid',    date: '2024-03-02', month: 'March', type: 'Rent', category: 'Double', invoice: 'INV-005', method: 'Cash' },
    { id: 6, tenantId: 't1', amount: 1500, status: 'Paid',    date: '2024-03-10', month: 'March', type: 'Mess', category: 'Premium', invoice: 'INV-006', method: 'UPI' },
    { id: 7, tenantId: 't6', amount: 8000, status: 'Paid',    date: '2024-03-15', month: 'March', type: 'Deposit', category: 'Single', invoice: 'DEP-001', method: 'Bank Transfer' },
    { id: 8, tenantId: 't7', amount: 6000, status: 'Paid',    date: '2024-03-12', month: 'March', type: 'Rent', category: 'Double', invoice: 'INV-007', method: 'UPI' },
    { id: 9, tenantId: 't8', amount: -2000, status: 'Refunded', date: '2024-03-20', month: 'March', type: 'Refund', category: 'Deposit', invoice: 'REF-001', method: 'Bank Transfer' }
  ],

  // ── Mess Plans (static) ─────────────────────────────────────
  getMessPlans: async () => [
    { id: 'p1', name: 'Basic Plan',    price: 500,  features: ['3 Full Meals/Day', 'Standard Menu Items', '2 Custom Curries Included'], color: '#94a3b8' },
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
  getDashboardSummary: (bId) =>
    cached(bId ? `dash_summary_${bId}` : 'dash_summary', async () => {
      const res = await axios.get(`${API_URL}/dashboard/summary${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, bId ? { ...DASHBOARD_FALLBACKS.summary, totalBeds: 75, occupiedBeds: 60, vacantBeds: 15, occupancyRate: 80, buildingCount: 1 } : DASHBOARD_FALLBACKS.summary),

  getDashboardRevenue: (bId) =>
    cached(bId ? `dash_revenue_${bId}` : 'dash_revenue', async () => {
      const res = await axios.get(`${API_URL}/dashboard/revenue${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, bId ? { ...DASHBOARD_FALLBACKS.revenue, rentMetrics: { ...DASHBOARD_FALLBACKS.revenue.rentMetrics, collectedRent: 700000, pendingRent: 40000 } } : DASHBOARD_FALLBACKS.revenue),

  getDashboardOccupancy: (bId) =>
    cached(bId ? `dash_occupancy_${bId}` : 'dash_occupancy', async () => {
      const res = await axios.get(`${API_URL}/dashboard/occupancy${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, DASHBOARD_FALLBACKS.occupancy),

  getDashboardAlerts: (bId) =>
    cached(bId ? `dash_alerts_${bId}` : 'dash_alerts', async () => {
      const res = await axios.get(`${API_URL}/dashboard/alerts${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, DASHBOARD_FALLBACKS.alerts),

  getDashboardComplaints: (bId) =>
    cached(bId ? `dash_complaints_${bId}` : 'dash_complaints', async () => {
      const res = await axios.get(`${API_URL}/dashboard/complaints${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, DASHBOARD_FALLBACKS.complaints),

  getDashboardMess: (bId) =>
    cached(bId ? `dash_mess_${bId}` : 'dash_mess', async () => {
      const res = await axios.get(`${API_URL}/dashboard/mess${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, DASHBOARD_FALLBACKS.mess),

  getDashboardStaff: (bId) =>
    cached(bId ? `dash_staff_${bId}` : 'dash_staff', async () => {
      const res = await axios.get(`${API_URL}/dashboard/staff${bId ? `?buildingId=${bId}` : ''}`);
      return res.data;
    }, bId ? { ...DASHBOARD_FALLBACKS.staff, staffList: DASHBOARD_FALLBACKS.staff.staffList.filter(s => s.building?.toLowerCase().includes(bId === 'b1' ? 'alpha' : 'beta')) } : DASHBOARD_FALLBACKS.staff),

  // ── Auth ─────────────────────────────────────────────────────
  login: async (email, password) => ({
    success: true,
    user: { email, role: 'owner' },
  }),

  // ── Settings ──────────────────────────────────────────────────
  getSettings: () =>
    cached('settings', async () => {
      const res = await axios.get(`${API_URL}/settings`);
      return res.data;
    }, {
      generalSettings: { hostelName: 'Hostel Hub Premium', currency: '₹', contactEmail: 'admin@hostelhub.com', contactPhone: '+91 9876543210' },
      rentSettings: { defaultRent: { single: 8500, double: 6500, shared: 5000 }, securityDeposit: 10000, paymentDueDate: 5, gracePeriod: 3, lateFeeRule: { type: 'FIXED', value: 500 } },
      roomConfig: { defaultBedCapacity: 2, autoCreateRooms: true, roomTypes: ['Single', 'Double', 'Shared', 'Dormitory'] },
      hygieneSettings: { hygieneThreshold: 75, cleaningFrequency: 'DAILY' },
      notificationSettings: { enablePaymentReminders: true, enableVacancyAlerts: true, enableComplaintAlerts: true, enableHygieneAlerts: true },
      reportSettings: { defaultPeriod: 'MONTHLY', autoGenerateReports: true }
    }),

  updateSettings: async (data) => {
    const res = await axios.post(`${API_URL}/settings`, data);
    return res.data;
  },

  getPayments: async () => {
    const data = [
      { id: 1, tenantId: 't1', amount: 8000, status: 'Paid',    date: '2024-03-05', month: 'March', type: 'Rent', category: 'Single' },
      { id: 2, tenantId: 't2', amount: 6000, status: 'Paid',    date: '2024-03-07', month: 'March', type: 'Rent', category: 'Double' },
      { id: 3, tenantId: 't3', amount: 4500, status: 'Pending', date: '2024-03-05', month: 'March', type: 'Rent', category: 'Shared' },
      { id: 4, tenantId: 't4', amount: 8000, status: 'Overdue', date: '2024-02-05', month: 'February', type: 'Rent', category: 'Single' },
      { id: 5, tenantId: 't5', amount: 6000, status: 'Paid',    date: '2024-03-02', month: 'March', type: 'Rent', category: 'Double' },
      { id: 6, tenantId: 't1', amount: 1500, status: 'Paid',    date: '2024-03-10', month: 'March', type: 'Mess', category: 'Single' },
      { id: 7, tenantId: 't6', amount: 8000, status: 'Paid',    date: '2024-03-15', month: 'March', type: 'Rent', category: 'Single' },
      { id: 8, tenantId: 't7', amount: 6000, status: 'Paid',    date: '2024-03-12', month: 'March', type: 'Rent', category: 'Double' },
    ];
    return data;
  },
};
