// In-memory mock data store to allow additions and updates in the frontend

export let mockBuildings = [
  { id: 'b1', name: 'Alpha Tower', address: 'Silicon Valley', images: ['/assets/building.jpg'] }, 
  { id: 'b2', name: 'Beta Block', address: 'Tech Park', images: ['/assets/building.jpg'] }
];

export let mockFloors = [
  { id: 'f1', buildingId: 'b1', floorNumber: 'G', images: ['/assets/floor.png'] }, 
  { id: 'f2', buildingId: 'b1', floorNumber: '1', images: ['/assets/floor.png'] },
  { id: 'f3', buildingId: 'b2', floorNumber: '1', images: ['/assets/floor.png'] }
];

export let mockRooms = [
  { id: 'r1', floorId: 'f1', roomNumber: '101', roomType: 'Single', capacity: 1, status: 'Active', images: ['/assets/room.png'] }, 
  { id: 'r2', floorId: 'f1', roomNumber: '102', roomType: 'Shared', capacity: 2, status: 'Active', images: ['/assets/room.png'] },
  { id: 'r3', floorId: 'f2', roomNumber: '201', roomType: 'Dormitory', capacity: 4, status: 'Active', images: ['/assets/room.png'] },
  { id: 'r4', floorId: 'f3', roomNumber: '101', roomType: 'Single', capacity: 1, status: 'Maintenance', images: ['/assets/room.png'] }
];

export let mockBeds = [
  { id: 'bed1', roomId: 'r1', bedNumber: '101A', status: 'OCCUPIED', tenant: 'Rahul Sharma', images: ['/assets/bed.jpg'] },
  { id: 'bed2', roomId: 'r2', bedNumber: '102A', status: 'OCCUPIED', tenant: 'Priya Verma', images: ['/assets/bed.jpg'] },
  { id: 'bed3', roomId: 'r2', bedNumber: '102B', status: 'AVAILABLE', tenant: null, images: ['/assets/bed.jpg'] },
  { id: 'bed4', roomId: 'r3', bedNumber: '201A', status: 'OCCUPIED', tenant: 'Anita Singh', images: ['/assets/bed.jpg'] },
  { id: 'bed5', roomId: 'r3', bedNumber: '201B', status: 'AVAILABLE', tenant: null, images: ['/assets/bed.jpg'] },
  { id: 'bed6', roomId: 'r3', bedNumber: '201C', status: 'AVAILABLE', tenant: null, images: ['/assets/bed.jpg'] },
  { id: 'bed7', roomId: 'r3', bedNumber: '201D', status: 'MAINTENANCE', tenant: null, images: ['/assets/bed.jpg'] },
  { id: 'bed8', roomId: 'r4', bedNumber: '101A', status: 'AVAILABLE', tenant: null, images: ['/assets/bed.jpg'] }
];

export const api = {
  getBuildings: async () => [...mockBuildings],
  getFloors: async (bId) => mockFloors.filter(f => f.buildingId === bId),
  getAllFloors: async () => [...mockFloors],
  getRooms: async (fId) => mockRooms.filter(r => r.floorId === fId),
  getAllRooms: async () => [...mockRooms],
  getBeds: async (rId) => mockBeds.filter(b => b.roomId === rId),
  getAllBeds: async () => [...mockBeds],
  getHostels: async () => [{ id: 'h1', name: 'Men Hostel A' }, { id: 'h2', name: 'Women Hostel B' }],
  getAssignedFloors: async (hId) => ['f1'],
  
  addBuilding: async (data) => {
    const newB = { id: 'b' + Date.now(), ...data };
    mockBuildings.push(newB);
    return newB;
  },
  addFloor: async (data) => {
    const newF = { id: 'f' + Date.now(), ...data };
    mockFloors.push(newF);
    return newF;
  },
  addRoom: async (data) => {
    const newR = { id: 'r' + Date.now(), status: 'Active', ...data };
    mockRooms.push(newR);
    return newR;
  },
  addBed: async (data) => {
    const newB = { id: 'bed' + Date.now(), tenant: null, ...data };
    mockBeds.push(newB);
    return newB;
  },
  updateRoomStatus: async (roomId, newStatus) => {
    const roomIndex = mockRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      mockRooms[roomIndex].status = newStatus;
    }
  },
  updateBedStatus: async (bedId, newStatus, tenant = null) => {
    const bedIndex = mockBeds.findIndex(b => b.id === bedId);
    if (bedIndex !== -1) {
      mockBeds[bedIndex].status = newStatus;
      mockBeds[bedIndex].tenant = tenant;
    }
  }
};
