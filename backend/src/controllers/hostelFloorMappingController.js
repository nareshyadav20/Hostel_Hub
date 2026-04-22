const prisma = require('../config/prisma');

const createMapping = async (req, res) => {
  try {
    const { hostelId, floorId, buildingId } = req.body;
    
    // Create or update mapping
    const mapping = await prisma.hostelFloorMapping.upsert({
      where: {
        hostelId_floorId: {
          hostelId,
          floorId
        }
      },
      update: { buildingId },
      create: { hostelId, floorId, buildingId }
    });
    
    res.status(201).json(mapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMappings = async (req, res) => {
  try {
    const { hostelId } = req.query;
    if (!hostelId) {
      return res.status(400).json({ error: "hostelId is required" });
    }
    const mappings = await prisma.hostelFloorMapping.findMany({
      where: { hostelId },
      include: {
        floor: {
          include: { building: true }
        }
      }
    });
    res.status(200).json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMapping = async (req, res) => {
  try {
    const { hostelId, floorId } = req.query;
    await prisma.hostelFloorMapping.delete({
      where: {
        hostelId_floorId: {
          hostelId,
          floorId
        }
      }
    });
    res.status(200).json({ message: 'Mapping removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMapping, getMappings, removeMapping };
