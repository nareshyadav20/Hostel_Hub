let io;

/**
 * Initialize Socket.IO instance
 * @param {object} socketIo - The Socket.IO server instance
 */
const setIo = (socketIo) => {
  io = socketIo;
};

/**
 * Emit an event to a specific user based on their ID and role
 * @param {string} userId - The user ID (mongo _id)
 * @param {string} role - 'tenant' or 'owner'
 * @param {string} event - The event name
 * @param {object} data - The data to send
 */
const emitToUser = (userId, role, event, data) => {
  if (io && userId) {
    const roomId = `${role.toLowerCase()}_${userId.toString()}`;
    io.to(roomId).to(userId.toString()).emit(event, data); // Multi-room single emission
    console.log(`Socket emitted [User Room: ${roomId} & ${userId.toString()}]: ${event}`);
  }
};

/**
 * Emit an event to a specific building room
 * @param {string} buildingId - The building ID
 * @param {string} event - The event name
 * @param {object} data - The data to send
 */
const emitToRoom = (buildingId, event, data) => {
  if (io && buildingId) {
    const roomId = `building_${buildingId.toString()}`;
    io.to(roomId).emit(event, data);
    console.log(`Socket emitted [Building Room: ${roomId}]: ${event}`);
  }
};

/**
 * Emit a real-time event to a specific room or globally (Legacy support)
 */
const emitUpdate = (buildingId, event, data) => {
  if (io) {
    if (buildingId) {
      emitToRoom(buildingId, event, data);
    } else {
      io.emit(event, data);
      console.log(`Socket emitted [Global]: ${event}`);
    }
  }
};

/**
 * Emit an event specifically to the owner dashboard
 */
const emitToOwner = (event, data) => {
  if (io) {
    io.to('owners').emit(event, data);
    console.log(`Socket emitted to Owners group: ${event}`);
  }
};

module.exports = {
  setIo,
  emitUpdate,
  emitToOwner,
  emitToUser,
  emitToRoom
};
