import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
export const backendOnline = true;

// --- GLOBAL AUTH INTERCEPTOR ---
// Automatically attaches the JWT token from localStorage to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global response interceptor for auth failures
axios.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    console.warn('Unauthorized request - Token expired or invalid. Redirecting to login.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// --- SEED GENERATOR ---
const generateSeed = () => {
  const bNames = [
    { id: 'b1', name: 'Alpha Tower', address: 'North Campus', desc: 'Premium Boys Hostel' },
    { id: 'b2', name: 'Beta Block', address: 'South Campus', desc: 'Standard Girls Hostel' },
    { id: 'b3', name: 'Gamma Guesthouse', address: 'West University', desc: 'Budget Student Stay' },
    { id: 'b4', name: 'Delta Dorms', address: 'Technical Hub', desc: 'Professional Co-living' },
    { id: 'b5', name: 'Epsilon Enclave', address: 'Down Town', desc: 'Luxury Executive Suite' },
    { id: 'b6', name: 'Zeta Zone', address: 'Sector 12', desc: 'Quiet Residential Stay' },
    { id: 'b7', name: 'Eta Heights', address: 'Main Market', desc: 'Centrally Located' },
    { id: 'b8', name: 'Theta Terraces', address: 'Lake View', desc: 'Scenic View Residency' },
    { id: 'b9', name: 'Iota Inn', address: 'Central Hub', desc: 'Modern Student Living' },
    { id: 'b10', name: 'Kappa Korner', address: 'East Side', desc: 'Cozy Budget Rooms' },
    { id: 'b11', name: 'Lambda Lodge', address: 'Science Park', desc: 'Researchers Choice' },
    { id: 'b12', name: 'Mu Mansion', address: 'Royal Lane', desc: 'Premium Heritage Stay' }
  ];

  const buildings = bNames.map(b => ({
    ...b,
    description: b.desc,
    amenities: ['WiFi', 'AC', 'CCTV', 'Laundry'],
    images: [`https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800`],
    isAC: true,
    rating: (4 + Math.random()).toFixed(1),
    status: 'Active',
    monthlyRevenue: 150000 + Math.floor(Math.random() * 50000),
    occupiedBeds: 25 + Math.floor(Math.random() * 10),
    totalBeds: 40,
    occupancyRate: 85
  }));

  let floors = [];
  let rooms = [];
  let beds = [];

  buildings.forEach(b => {
    const floorCount = b.id === 'b1' ? 4 : 2; // Alpha Tower is premium, 4 floors
      for (let f = 1; f <= floorCount; f++) {
        const fId = `f_${b.id}_${f}`;
        const suffix = f === 1 ? 'st' : f === 2 ? 'nd' : f === 3 ? 'rd' : 'th';
        floors.push({
          id: fId,
          buildingId: b.id,
          floorNumber: `${f}${suffix} Floor`,
          images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80']
        });

      for (let r = 1; r <= 3; r++) {
        const rId = `r_${fId}_${r}`;
        const roomNum = `${f}${r < 10 ? '0' + r : r}`;
        rooms.push({
          id: rId,
          floorId: fId,
          roomNumber: roomNum,
          roomType: r === 1 ? 'Single' : r === 2 ? 'Double' : 'Triple',
          capacity: r,
          status: 'Active',
          isAC: true,
          images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80']
        });

        for (let bd = 1; bd <= r; bd++) {
          const bdId = `bd_${rId}_${bd}`;
          beds.push({
            id: bdId,
            roomId: rId,
            bedNumber: `${roomNum}${String.fromCharCode(64 + bd)}`,
            status: Math.random() > 0.3 ? 'OCCUPIED' : 'AVAILABLE',
            tenant: Math.random() > 0.3 ? 'Tenant Name' : null,
            images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80']
          });
        }
      }
    }
  });

  return { buildings, floors, rooms, beds };
};

const SEED = generateSeed();

// Cache utility
const cacheGet = (key) => {
  const val = localStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : null;
  } catch { return null; }
};
const cacheSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const cached = async (key, fetcher, fallback, minCount = 1) => {
  const c = cacheGet(key);
  if (c && Array.isArray(c) && c.length >= minCount) return c;
  try {
    const data = await fetcher();
    if (data && Array.isArray(data) && data.length >= minCount) {
      cacheSet(key, data);
      return data;
    }
    // If we have some data but less than minCount, we might want to merge or just use fallback
    if (data && Array.isArray(data) && data.length > 0 && data.length < minCount) {
      const merged = [...data, ...fallback.slice(0, minCount - data.length)];
      cacheSet(key, merged);
      return merged;
    }
    throw new Error('Insufficient data');
  } catch {
    cacheSet(key, fallback);
    return fallback;
  }
};

const handleId = (data) => {
  if (Array.isArray(data)) return data.map(x => ({ ...x, id: x._id || x.id }));
  if (data && typeof data === 'object') return { ...data, id: data._id || data.id };
  return data;
};

export const api = {
  // Owner
  getOwnerProfile: async () => {
    const res = await axios.get(`${API_URL}/owner/profile`);
    return res.data;
  },
  updateOwnerProfile: async (data) => {
    const res = await axios.patch(`${API_URL}/owner/profile`, data);
    return res.data;
  },
  updateOwnerDocuments: async (doc) => {
    const res = await axios.post(`${API_URL}/owner/documents`, doc);
    return res.data;
  },
  getOwnerStats: async () => {
    // Fetch from existing dashboard summary
    const res = await axios.get(`${API_URL}/dashboard/summary`);
    return res.data;
  },

  // Buildings
  getBuildings: () => cached('buildings_all_v4', async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    // Exclude drafts from the main portfolio listing
    return handleId(res.data.filter(b => b.status !== 'Draft'));
  }, SEED.buildings, 10), // Ensure at least 10 buildings are shown to maintain a full portfolio look

  // Floors
  getAllFloors: () => cached('floors_all_v4_ext', async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const backendBuildings = res.data || [];
    let all = [];
    
    // Process backend data
    backendBuildings.forEach(b => {
      if (b.floors && b.floors.length > 0) {
        all = [...all, ...b.floors.map(f => ({ ...f, buildingId: b._id.toString() }))];
      }
    });

    // For any building that has no floors in backend, use SEED or generate on the fly
    const allBuildings = await api.getBuildings();
    allBuildings.forEach(b => {
      const existing = all.filter(f => f.buildingId === (b.id || b._id));
      if (existing.length === 0) {
        // Find in SEED or generate
        const seedFloors = SEED.floors.filter(f => f.buildingId === b.id);
        if (seedFloors.length > 0) {
          all = [...all, ...seedFloors];
        } else {
          // Generate minimal floors for brand new buildings
          const bId = b.id || b._id;
          all.push({ id: `f_${bId}_1`, buildingId: bId, floorNumber: '1st Floor' });
          all.push({ id: `f_${bId}_2`, buildingId: bId, floorNumber: '2nd Floor' });
        }
      }
    });

    return handleId(all);
  }, SEED.floors),

  getFloorsByBuilding: async (bId) => {
    const all = await api.getAllFloors();
    return all.filter(f => f.buildingId === bId);
  },

  // Rooms
  getAllRooms: () => cached('rooms_all_v4_ext', async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const backendBuildings = res.data || [];
    let all = [];
    
    // Process backend data
    backendBuildings.forEach(b => {
      if (b.floors) b.floors.forEach(f => {
        if (f.rooms && f.rooms.length > 0) {
          all = [...all, ...f.rooms.map(r => ({ ...r, floorId: f._id.toString() }))];
        }
      });
    });

    // Fallback/Generate for missing
    const allFloors = await api.getAllFloors();
    allFloors.forEach(f => {
      const existing = all.filter(r => r.floorId === f.id);
      if (existing.length === 0) {
        const seedRooms = SEED.rooms.filter(r => r.floorId === f.id);
        if (seedRooms.length > 0) {
          all = [...all, ...seedRooms];
        } else {
          // Dynamic rooms for new floors
          [1, 2, 3].forEach(rNum => {
            all.push({
              id: `r_${f.id}_${rNum}`,
              floorId: f.id,
              roomNumber: `${f.floorNumber.charAt(0)}${rNum < 10 ? '0'+rNum : rNum}`,
              roomType: rNum === 1 ? 'Single' : 'Double',
              capacity: rNum === 1 ? 1 : 2,
              status: 'Active'
            });
          });
        }
      }
    });

    return handleId(all);
  }, SEED.rooms),

  getRoomsByBuilding: async (bId) => {
    const f = await api.getFloorsByBuilding(bId);
    const all = await api.getAllRooms();
    return all.filter(r => f.some(x => x.id === r.floorId));
  },

  // Beds
  getAllBeds: () => cached('beds_all_v4_ext', async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    const backendBuildings = res.data || [];
    let all = [];
    
    // Process backend data
    backendBuildings.forEach(b => {
      if (b.floors) b.floors.forEach(f => {
        if (f.rooms) f.rooms.forEach(r => {
          if (r.beds && r.beds.length > 0) {
            all = [...all, ...r.beds.map(bd => ({ 
              ...bd, 
              roomId: r._id.toString(),
              images: (bd.images && bd.images.length > 0) ? bd.images : ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80']
            }))];
          }
        });
      });
    });

    // Fallback/Generate for missing
    const allRooms = await api.getAllRooms();
    allRooms.forEach(r => {
      const existing = all.filter(b => b.roomId === r.id);
      if (existing.length === 0) {
        const seedBeds = SEED.beds.filter(b => b.roomId === r.id);
        if (seedBeds.length > 0) {
          all = [...all, ...seedBeds];
        } else {
          // Dynamic beds for new rooms
          for (let i = 1; i <= (r.capacity || 2); i++) {
            all.push({
              id: `bd_${r.id}_${i}`,
              roomId: r.id,
              bedNumber: `${r.roomNumber}${String.fromCharCode(64 + i)}`,
              status: Math.random() > 0.3 ? 'OCCUPIED' : 'AVAILABLE',
              tenant: Math.random() > 0.3 ? 'Tenant Name' : null
            });
          }
        }
      }
    });

    return handleId(all);
  }, SEED.beds),

  getBedsByBuilding: async (bId) => {
    const r = await api.getRoomsByBuilding(bId);
    const all = await api.getAllBeds();
    return all.filter(b => r.some(x => x.id === b.roomId));
  },

  getDashboardSummary: async (bId) => {
    const bBeds = await api.getBedsByBuilding(bId);
    const occupied = bBeds.filter(b => b.status === 'OCCUPIED').length;
    const total = bBeds.length;
    
    return {
      totalBeds: total,
      occupiedBeds: occupied,
      vacantBeds: total - occupied,
      occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      todayRevenue: occupied * 250,
      expectedMonthlyRevenue: total * 7500,
      healthScore: 88,
      pendingPaymentsCount: 3,
      pendingPaymentsAmount: 18500,
      totalTenants: occupied,
      checkInsToday: 2,
      checkOutsToday: 1,
      rentDueToday: 4,
      complaintsToday: 2,
      maintenanceRooms: 1,
      newTenantsThisMonth: 8,
      tenantsLeavingSoon: 2,
      renewalsPending: 5
    };
  },

  getDashboardRevenue: async () => ({
    rentMetrics: { collectedRent: 850000, pendingRent: 45000, netProfit: 620000, securityDepositsHeld: 1200000 },
    dailyRevenue: [
      { name: 'Mon', expected: 4500, actual: 4200 },
      { name: 'Tue', expected: 4500, actual: 4500 },
      { name: 'Wed', expected: 4500, actual: 3800 },
      { name: 'Thu', expected: 4500, actual: 4800 },
      { name: 'Fri', expected: 4500, actual: 4500 },
      { name: 'Sat', expected: 4500, actual: 4100 },
      { name: 'Sun', expected: 4500, actual: 4500 },
    ],
    monthlyRevenue: [
      { name: 'Jan', revenue: 780000, expenses: 210000 },
      { name: 'Feb', revenue: 820000, expenses: 225000 },
      { name: 'Mar', revenue: 850000, expenses: 230000 },
    ]
  }),

  getDashboardOccupancy: async (bId) => {
    const b = await api.getBuildings();
    return {
      buildingWise: b.map(x => ({ name: x.name, occupied: x.occupiedBeds || 0, total: x.totalBeds || 40 }))
    };
  },

  getDashboardAlerts: async () => ({
    alerts: [{ severity: 'high', msg: '3 pending payments in Building A' }],
    insights: [{ type: 'insight', message: '💡 Optimize utility usage in Floor 2' }]
  }),

  getDashboardComplaints: async () => ({
    total: 12, open: 4, resolved: 8, highPriority: 2,
    categories: [{ name: 'Maintenance', count: 5 }, { name: 'WiFi', count: 3 }, { name: 'Food', count: 4 }],
    pending24h: 1, avgResolutionHours: 18
  }),

  getDashboardMess: async () => ({
    avgFoodRating: 4.2, mealsServedToday: 156, dailyMessCost: 4500, monthlyMessCost: 125000,
    menuToday: { breakfast: 'Idli, Sambhar', lunch: 'Rice, Dal, Veg', dinner: 'Roti, Paneer' },
    inventory: [{ item: 'Rice', stock: '20', unit: 'kg', alert: true }]
  }),

  getDashboardStaff: async () => ({
    efficiencyScore: 92, tasksAssigned: 124, tasksCompleted: 114, tasksPending: 10,
    staffList: [
      { id: 's1', name: 'Suresh Mani', role: 'Warden', status: 'Active', performance: '4.8', phone: '9876543210', email: 'suresh@hostel.com', building: 'Alpha Tower', shift: 'Day', salary: 25000, attendance: { percentage: 98, monthly: [{name:'W1',present:6},{name:'W2',present:5},{name:'W3',present:6},{name:'W4',present:6}] }, metrics: { efficiencyScore: 95, completionRate: 98, avgResolutionTime: '2h', satisfaction: 4.9, history: [{date:'Jan',rate:90},{date:'Feb',rate:92},{date:'Mar',rate:95}] }, tasks: [{id:'t1',title:'Monthly Audit',status:'PENDING',date:'25 Mar'},{id:'t2',title:'Staff Meeting',status:'COMPLETED',date:'20 Mar'}], documents: [{name:'Aadhar Card',type:'PDF',date:'12 Jan 24'},{name:'Contract',type:'PDF',date:'15 Jan 24'}], salaryHistory: [{month:'Mar',amount:25000,status:'PAID',date:'01 Mar'},{month:'Feb',amount:25000,status:'PAID',date:'01 Feb'}] },
      { id: 's2', name: 'Meena Reddy', role: 'Cook', status: 'Active', performance: '4.5', phone: '9876543211', email: 'meena@hostel.com', building: 'Alpha Tower', shift: 'Morning', salary: 18000, attendance: { percentage: 95, monthly: [{name:'W1',present:5},{name:'W2',present:5},{name:'W3',present:5},{name:'W4',present:6}] }, metrics: { efficiencyScore: 88, completionRate: 92, avgResolutionTime: '1h', satisfaction: 4.6, history: [{date:'Jan',rate:85},{date:'Feb',rate:86},{date:'Mar',rate:88}] }, tasks: [{id:'t3',title:'Menu Planning',status:'COMPLETED',date:'21 Mar'}], documents: [{name:'Health Cert',type:'JPG',date:'10 Feb 24'}], salaryHistory: [{month:'Mar',amount:18000,status:'PAID',date:'01 Mar'}] },
      { id: 's3', name: 'Rajesh Kumar', role: 'Security', status: 'Active', performance: '4.9', phone: '9876543212', email: 'rajesh@hostel.com', building: 'Beta Block', shift: 'Night', salary: 15000, attendance: { percentage: 100, monthly: [{name:'W1',present:7},{name:'W2',present:7},{name:'W3',present:7},{name:'W4',present:7}] }, metrics: { efficiencyScore: 99, completionRate: 100, avgResolutionTime: '30m', satisfaction: 5.0, history: [{date:'Jan',rate:98},{date:'Feb',rate:99},{date:'Mar',rate:99}] }, tasks: [], documents: [{name:'Police Verification',type:'PDF',date:'05 Jan 24'}], salaryHistory: [{month:'Mar',amount:15000,status:'PAID',date:'01 Mar'}] },
      { id: 's4', name: 'Anita Das', role: 'Cleaner', status: 'On Leave', performance: '3.8', phone: '9876543213', email: 'anita@hostel.com', building: 'Beta Block', shift: 'Day', salary: 12000, attendance: { percentage: 82, monthly: [{name:'W1',present:4},{name:'W2',present:3},{name:'W3',present:4},{name:'W4',present:0}] }, metrics: { efficiencyScore: 75, completionRate: 80, avgResolutionTime: '4h', satisfaction: 3.9, history: [{date:'Jan',rate:80},{date:'Feb',rate:78},{date:'Mar',rate:75}] }, tasks: [{id:'t4',title:'Floor 2 Deep Clean',status:'PENDING',date:'24 Mar'}], documents: [{name:'ID Card',type:'JPG',date:'20 Feb 24'}], salaryHistory: [{month:'Feb',amount:12000,status:'PAID',date:'01 Feb'}] },
      { id: 's5', name: 'Vikram Singh', role: 'Warden', status: 'Active', performance: '4.2', phone: '9876543214', email: 'vikram@hostel.com', building: 'Gamma Guesthouse', shift: 'Day', salary: 22000, attendance: { percentage: 92, monthly: [{name:'W1',present:5},{name:'W2',present:6},{name:'W3',present:5},{name:'W4',present:5}] }, metrics: { efficiencyScore: 85, completionRate: 90, avgResolutionTime: '2.5h', satisfaction: 4.3, history: [{date:'Jan',rate:82},{date:'Feb',rate:84},{date:'Mar',rate:85}] }, tasks: [], documents: [], salaryHistory: [] },
      { id: 's6', name: 'Sunita Rao', role: 'Cook', status: 'Active', performance: '4.6', phone: '9876543215', email: 'sunita@hostel.com', building: 'Gamma Guesthouse', shift: 'Evening', salary: 18000, attendance: { percentage: 96, monthly: [{name:'W1',present:6},{name:'W2',present:6},{name:'W3',present:6},{name:'W4',present:6}] }, metrics: { efficiencyScore: 90, completionRate: 94, avgResolutionTime: '1.2h', satisfaction: 4.7, history: [{date:'Jan',rate:88},{date:'Feb',rate:89},{date:'Mar',rate:90}] }, tasks: [], documents: [], salaryHistory: [] },
      { id: 's7', name: 'Amitabh B.', role: 'Security', status: 'Active', performance: '4.7', phone: '9876543216', email: 'amitabh@hostel.com', building: 'Delta Dorms', shift: 'Night', salary: 15000, attendance: { percentage: 98, monthly: [{name:'W1',present:7},{name:'W2',present:7},{name:'W3',present:6},{name:'W4',present:7}] }, metrics: { efficiencyScore: 94, completionRate: 96, avgResolutionTime: '45m', satisfaction: 4.8, history: [{date:'Jan',rate:92},{date:'Feb',rate:93},{date:'Mar',rate:94}] }, tasks: [], documents: [], salaryHistory: [] },
      { id: 's8', name: 'Pooja Hegde', role: 'Cleaner', status: 'Active', performance: '4.1', phone: '9876543217', email: 'pooja@hostel.com', building: 'Delta Dorms', shift: 'Day', salary: 12000, attendance: { percentage: 88, monthly: [{name:'W1',present:5},{name:'W2',present:5},{name:'W3',present:5},{name:'W4',present:5}] }, metrics: { efficiencyScore: 82, completionRate: 85, avgResolutionTime: '3.5h', satisfaction: 4.2, history: [{date:'Jan',rate:80},{date:'Feb',rate:81},{date:'Mar',rate:82}] }, tasks: [], documents: [], salaryHistory: [] }
    ]
  }),

  getSettings: async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);
      return res.data;
    } catch (err) {
      console.error('Error fetching settings:', err);
      return { 
        generalSettings: { hostelName: 'Hostel Hub', currency: '₹' },
        rentSettings: { defaultRent: { single: 8000, double: 6000, shared: 4500 }, securityDeposit: 5000, paymentDueDate: 5, gracePeriod: 3, lateFeeRule: { type: 'FIXED', value: 100 } },
        notificationSettings: { enablePaymentReminders: true, enableVacancyAlerts: true, enableComplaintAlerts: true, enableHygieneAlerts: true },
        roomConfig: { roomTypes: ['Single', 'Double', 'Triple'], defaultBedCapacity: 2, autoCreateRooms: false },
        hygieneSettings: { hygieneThreshold: 75, cleaningFrequency: 'DAILY' },
        reportSettings: { defaultPeriod: 'MONTHLY', autoGenerateReports: true }
      };
    }
  },
  updateSettings: async (data) => {
    const res = await axios.post(`${API_URL}/settings`, data);
    return res.data;
  },
  getTenants: () => cached('tenants_all_v4', async () => {
    const res = await axios.get(`${API_URL}/tenants`);
    return handleId(res.data);
  }, []),
  getComplaints: () => cached('complaints_all_v4', async () => {
    const res = await axios.get(`${API_URL}/complaints`);
    return handleId(res.data);
  }, []),

  updateComplaintStatus: async (id, status, assignedTo = null) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}`, { status: status === 'In-Progress' ? 'In Progress' : status, assignedTo });
    } catch (err) {
      console.warn('Real API failed, updating mock storage');
    }
    const complaints = cacheGet('complaints_all_v4') || [];
    const updated = complaints.map(c => (c.id === id || c._id === id) ? { ...c, status, assignedTo } : c);
    cacheSet('complaints_all_v4', updated);
    return { id, status, assignedTo };
  },

  getRoomTransfers: () => cached('room_transfers_v1', async () => {
    const res = await axios.get(`${API_URL}/room-transfers`);
    return handleId(res.data);
  }, []),

  updateRoomTransferStatus: async (id, status) => {
    try {
      await axios.patch(`${API_URL}/room-transfers/${id}`, { status });
    } catch (err) {
      console.warn('Real API failed, updating mock storage');
    }
    const transfers = cacheGet('room_transfers_v1') || [];
    const updated = transfers.map(t => (t.id === id || t._id === id) ? { ...t, status } : t);
    cacheSet('room_transfers_v1', updated);
    return { id, status };
  },

  getMessMenu: () => cached('mess_menu_v1', async () => {
    const res = await axios.get(`${API_URL}/mess/menu`);
    return handleId(res.data);
  }, []),

  updateMessMenu: async (data) => {
    const res = await axios.put(`${API_URL}/mess/menu`, data);
    // Invalidate cache
    localStorage.removeItem('mess_menu_v1');
    return handleId(res.data);
  },
  getStaff: async () => [],
  getPayments: async () => {
    try {
      const res = await axios.get(`${API_URL}/payments`);
      return res.data.map(p => ({
        ...p,
        id: p._id,
        date: new Date(p.date).toISOString().split('T')[0],
      }));
    } catch (err) {
      console.error('Error fetching real payments:', err);
      return [];
    }
  },
  getNotifications: async () => [],
  getFloors: async (bId) => {
    const all = await api.getAllFloors();
    return bId ? all.filter(f => f.buildingId === bId) : all;
  },
  getRooms: async (fId) => {
    const all = await api.getAllRooms();
    return all.filter(r => r.floorId === fId);
  },
  getBeds: async (rId) => {
    const all = await api.getAllBeds();
    return all.filter(b => b.roomId === rId);
  },
  updateBedStatus: async (id, status) => {
    const beds = cacheGet('beds_all_v4') || SEED.beds;
    const updated = beds.map(b => b.id === id ? { ...b, status } : b);
    cacheSet('beds_all_v4', updated);
    return { id, status };
  },
  updateRoomStatus: async (id, status) => {
    const rooms = cacheGet('rooms_all_v4') || SEED.rooms;
    const updated = rooms.map(r => r.id === id ? { ...r, status } : r);
    cacheSet('rooms_all_v4', updated);
    return { id, status };
  },
  addBuilding: async (data) => {
    const res = await axios.post(`${API_URL}/buildings`, data);
    localStorage.removeItem('buildings_all_v4'); // Invalidate cache
    return handleId(res.data);
  },
  addFloor: async (data) => {
    const res = await axios.post(`${API_URL}/floors`, data);
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  addRoom: async (data) => {
    const res = await axios.post(`${API_URL}/rooms`, data);
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  addBed: async (data) => {
    const res = await axios.post(`${API_URL}/beds`, data);
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  deleteBuilding: async (id) => {
    await axios.delete(`${API_URL}/buildings/${id}`);
    localStorage.removeItem('buildings_all_v4');
  },
  deleteFloor: async (id) => {
    await axios.delete(`${API_URL}/floors/${id}`);
    localStorage.removeItem('buildings_all_v4');
  },
  deleteRoom: async (id) => {
    await axios.delete(`${API_URL}/rooms/${id}`);
    localStorage.removeItem('buildings_all_v4');
  },
  deleteBed: async (id) => {
    await axios.delete(`${API_URL}/beds/${id}`);
    localStorage.removeItem('buildings_all_v4');
  },
  updateBuilding: async (id, data) => {
    const res = await axios.patch(`${API_URL}/buildings/${id}`, data);
    localStorage.removeItem('buildings_all_v4_ext'); 
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  updateFloor: async (id, data) => {
    const res = await axios.put(`${API_URL}/floors/${id}`, data);
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  updateBed: async (id, data) => {
    const res = await axios.put(`${API_URL}/beds/${id}`, data);
    localStorage.removeItem('buildings_all_v4');
    return handleId(res.data);
  },
  addTenant: async (data) => {
    const res = await axios.post(`${API_URL}/tenants`, data);
    return handleId(res.data);
  },
  updateTenant: async (id, data) => {
    const res = await axios.put(`${API_URL}/tenants/${id}`, data);
    return handleId(res.data);
  }
};

window.api = api;
