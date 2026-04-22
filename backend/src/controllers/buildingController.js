const prisma = require('../config/prisma');

const createBuilding = async (req, res) => {
  try {
    const { name, address, images } = req.body;
    const building = await prisma.building.create({
      data: { name, address, images: images || [] },
    });
    res.status(201).json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBuildings = async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: { floors: true }
    });
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBuilding, getBuildings };
