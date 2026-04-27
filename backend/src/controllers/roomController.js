const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Bed = require('../models/Bed');

const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, capacity, rentAmount, amenities, floorId, images, autoCreateBeds } = req.body;
    const floor = await Floor.findById(floorId);
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const room = await Room.create({ roomNumber, roomType, capacity, rentAmount, amenities: amenities||[], images: images||[], floor: floorId });

    if (autoCreateBeds) {
      const bedsToCreate = [];
      for (let i = 1; i <= capacity; i++) {
        const bedLabel = capacity === 1 ? roomNumber : `${roomNumber}-${String.fromCharCode(64 + i)}`;
        bedsToCreate.push({ bedNumber: bedLabel, status: 'AVAILABLE', room: room._id });
      }
      const beds = await Bed.insertMany(bedsToCreate);
      room.beds = beds.map(b => b._id);
      await room.save();
    }

    floor.rooms.push(room._id);
    await floor.save();
    res.status(201).json({ ...room.toObject(), floorId });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateRooms = async (req, res) => {
  try {
    const { floorId, startNumber, endNumber, prefix, roomType, capacity, rentAmount, amenities, autoCreateBeds } = req.body;
    const floor = await Floor.findById(floorId);
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const roomsCreated = [];
    for (let num = parseInt(startNumber); num <= parseInt(endNumber); num++) {
      const roomNumber = `${prefix||''}${num}`;
      const room = await Room.create({ roomNumber, roomType, capacity, rentAmount, amenities: amenities||[], status: 'AVAILABLE', floor: floorId });

      if (autoCreateBeds) {
        const bedsToCreate = [];
        for (let i = 1; i <= capacity; i++) {
          const bedLabel = capacity === 1 ? roomNumber : `${roomNumber}-${String.fromCharCode(64 + i)}`;
          bedsToCreate.push({ bedNumber: bedLabel, status: 'AVAILABLE', room: room._id });
        }
        const beds = await Bed.insertMany(bedsToCreate);
        room.beds = beds.map(b => b._id);
        await room.save();
      }

      floor.rooms.push(room._id);
      roomsCreated.push({ ...room.toObject(), floorId });
    }
    await floor.save();
    res.status(201).json(roomsCreated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ floor: req.params.floorId }).populate('beds');
    res.status(200).json(rooms.map(r => ({ ...r.toObject(), floorId: r.floor })));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(200).json({ ...room.toObject(), floorId: room.floor });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('beds');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const occupied = room.beds.some(b => b.status === 'OCCUPIED');
    if (occupied) return res.status(400).json({ error: 'Cannot delete room with occupied beds.' });
    await Bed.deleteMany({ room: room._id });
    await Floor.findByIdAndUpdate(room.floor, { $pull: { rooms: room._id } });
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createRoom, getRooms, bulkCreateRooms, updateRoom, deleteRoom };
