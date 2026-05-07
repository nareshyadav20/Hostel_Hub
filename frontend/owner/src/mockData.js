import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const backendOnline = true;

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
    for (let f = 1; f <= 2; f++) {
      const fId = `f_${b.id}_${f}`;
      floors.push({
        id: fId,
        buildingId: b.id,
        floorNumber: `${f === 1 ? '1st' : '2nd'} Floor`,
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

const cached = async (key, fetcher, fallback) => {
  const c = cacheGet(key);
  if (c && Array.isArray(c) && c.length > 0) return c;
  try {
    const data = await fetcher();
    if (data && data.length > 0) {
      cacheSet(key, data);
      return data;
    }
    throw new Error('Empty');
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
  // Owner Profile
  getOwnerProfile: async () => {
    const res = await axios.get(`${API_URL}/owner/profile`);
    return res.data;
  },
  getOwnerStats: async () => {
    try {
      const blds = await api.getBuildings();
      const stats = await Promise.all(blds.map(b => api.getDashboardSummary(b.id).catch(()=>null)));
      const validStats = stats.filter(Boolean);
      return {
        buildingCount: blds.length,
        totalBeds: validStats.reduce((sum, s) => sum + (s.totalBeds || 0), 0),
        occupiedBeds: validStats.reduce((sum, s) => sum + (s.occupiedBeds || 0), 0),
        expectedMonthlyRevenue: validStats.reduce((sum, s) => sum + (s.revenue?.expected || 0), 0),
        occupancyRate: validStats.length > 0 
          ? Math.round(validStats.reduce((sum, s) => sum + ((s.occupiedBeds || 0)/(s.totalBeds || 1)*100), 0) / validStats.length)
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
  getBuildings: (id = null) => {
    if (id) {
      return axios.get(`${API_URL}/buildings/${id}`).then(res => handleId(res.data ? [res.data] : [])[0]).catch(() => SEED.buildings.find(b => b.id === id));
    }
    return cached('buildings_all_v4', async () => {
      const res = await axios.get(`${API_URL}/buildings`);
      const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      return handleId(data.filter(b => b.status !== 'Draft'));
    }, SEED.buildings);
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
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  getFloors: async (bId) => {
    const res = await axios.get(`${API_URL}/floors/${bId}`);
    return handleId(res.data);
  },

  // Floors
  getAllFloors: () => cached('floors_all_v4', async () => {
    const res = await axios.get(`${API_URL}/buildings`);
    let all = [];
    res.data.forEach(b => {
      if (b.floors) all = [...all, ...b.floors.map(f => ({ ...f, buildingId: b._id.toString() }))];
    });
    return handleId(all);
  }, SEED.floors),

  getFloorsByBuilding: async (bId) => {
    return await api.getFloors(bId);
  },
  getAllRooms: async () => {
    const res = await axios.get(`${API_URL}/rooms`);
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
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
    const res = await axios.get(`${API_URL}/beds`);
    const data = Array.isArray(res.data) ? res.data : [];
    return handleId(data);
  },
  getBeds: async (rId) => {
    const res = await axios.get(`${API_URL}/beds/${rId}`);
    return handleId(res.data);
  },
  getBedsByBuilding: async (bId) => {
    return axios.get(`${API_URL}/beds`, { params: { buildingId: bId } })
      .then(res => handleId(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        // Find rooms for this building
        const bRooms = SEED.rooms.filter(r => {
          const f = SEED.floors.find(fl => fl.id === r.floorId);
          return f && f.buildingId === bId;
        });
        const roomIds = bRooms.map(r => r.id);
        return handleId(SEED.beds.filter(b => roomIds.includes(b.roomId)));
      });
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
  getDashboardActivity: async (bId) => {
    return axios.get(`${API_URL}/dashboard/activity`, { params: { buildingId: bId } })
      .then(res => res.data)
      .catch(() => [
        { id: 1, type: 'payment', msg: 'Rent received from Room 101', time: '10 mins ago' },
        { id: 2, type: 'complaint', msg: 'New plumbing issue in 304', time: '1 hour ago' },
        { id: 3, type: 'tenant', msg: 'Rahul moved into 205-A', time: '2 hours ago' }
      ]);
  },

  // Operational Data
  getTenants: async (bId) => {
    return axios.get(`${API_URL}/tenants`, { params: { buildingId: bId } })
      .then(res => handleId(res.data))
      .catch(() => SEED.tenants.filter(t => !bId || t.buildingId === bId));
  },
  getComplaints: async (bId) => {
    const res = await axios.get(`${API_URL}/complaints`, { params: { buildingId: bId } });
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
    const res = await axios.patch(`${API_URL}/transfers/${id}`, { status });
    // Invalidate cache
    sessionStorage.removeItem('room_transfers_v1');
    return handleId(res.data);
  },
  getMessMenu: async (bId) => {
    const res = await axios.get(`${API_URL}/mess/menu`, { params: { buildingId: bId } });
    return handleId(res.data);
  },

  updateMessMenu: async (data) => {
    const res = await axios.put(`${API_URL}/mess/menu`, data);
    // Invalidate cache
    localStorage.removeItem('mess_menu_v1');
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
    const res = await axios.put(`${API_URL}/buildings/${id}`, data);
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
  }
};

window.api = api;
