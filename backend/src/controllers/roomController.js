const prisma = require('../config/prisma');

const createRoom = async (req, res) => {
  try {
    const { floorId, roomNumber, roomType, capacity, images } = req.body;
    const room = await prisma.room.create({
      data: { floorId, roomNumber, roomType, capacity: parseInt(capacity), images: images || [] },
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const { floorId } = req.query;
    const filter = floorId ? { floorId } : {};
    const rooms = await prisma.room.findMany({
      where: filter,
      include: { beds: true }
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, getRooms };
