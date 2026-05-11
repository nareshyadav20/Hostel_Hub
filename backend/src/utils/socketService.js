let io;

/**
 * Initialize Socket.IO instance
 * @param {object} socketIo - The Socket.IO server instance
 */
const setIo = (socketIo) => {
  io = socketIo;
};

/**
 * Emit a real-time event to a specific room (buildingId) or globally
 * @param {string} buildingId - The building ID to target (optional)
 * @param {string} event - The event name
 * @param {object} data - The data to send
 */
const emitUpdate = (buildingId, event, data) => {
  if (io) {
    if (buildingId) {
      // Ensure buildingId is a string if it's an ObjectId
      const roomId = buildingId.toString();
      io.to(roomId).emit(event, data);
      console.log(`Socket emitted [Room: ${roomId}]: ${event}`);
    } else {
      io.emit(event, data);
      console.log(`Socket emitted [Global]: ${event}`);
    }
  } else {
    console.warn(`Socket.IO not initialized. Could not emit: ${event}`);
  }
};

/**
 * Emit an event specifically to the owner dashboard
 * @param {string} event - The event name
 * @param {object} data - The data to send
 */
const emitToOwner = (event, data) => {
  if (io) {
    // Owners can join a specific 'owners' room or we emit globally if filtered by ownerId on client
    io.emit(event, data);
    console.log(`Socket emitted to Owners: ${event}`);
  }
};

module.exports = {
  setIo,
  emitUpdate,
  emitToOwner
};
