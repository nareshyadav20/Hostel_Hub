const prisma = require('../config/prisma');

const createFloor = async (req, res) => {
  try {
    const { buildingId, floorNumber, images } = req.body;
    const floor = await prisma.floor.create({
      data: { buildingId, floorNumber, images: images || [] },
    });
    res.status(201).json(floor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFloors = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const filter = buildingId ? { buildingId } : {};
    const floors = await prisma.floor.findMany({
      where: filter,
      include: { rooms: true }
    });
    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFloor, getFloors };
