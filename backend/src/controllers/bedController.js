const prisma = require('../config/prisma');

const createBed = async (req, res) => {
  try {
    const { roomId, bedNumber, status, images } = req.body;
    const bed = await prisma.bed.create({
      data: { roomId, bedNumber, status: status || 'AVAILABLE', images: images || [] },
    });
    res.status(201).json(bed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBeds = async (req, res) => {
  try {
    const { roomId } = req.query;
    const filter = roomId ? { roomId } : {};
    const beds = await prisma.bed.findMany({
      where: filter
    });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBed, getBeds };
