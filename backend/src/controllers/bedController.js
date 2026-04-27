const Bed = require('../models/Bed');
const Room = require('../models/Room');

const createBed = async (req, res) => {
  try {
    const { bedNumber, roomId, images } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const bed = await Bed.create({ bedNumber, status: 'AVAILABLE', images: images||[], room: roomId });
    room.beds.push(bed._id);
    await room.save();
    res.status(201).json({ ...bed.toObject(), roomId });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ room: req.params.roomId });
    res.status(200).json(beds.map(b => ({ ...b.toObject(), roomId: b.room })));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateBed = async (req, res) => {
  try {
    const validStatuses = ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'];
    if (req.body.status && !validStatuses.includes(req.body.status))
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bed) return res.status(404).json({ error: 'Bed not found' });
    res.status(200).json({ ...bed.toObject(), roomId: bed.room });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ error: 'Bed not found' });
    if (bed.status === 'OCCUPIED') return res.status(400).json({ error: 'Cannot delete occupied bed.' });
    await Room.findByIdAndUpdate(bed.room, { $pull: { beds: bed._id } });
    await Bed.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bed deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateBeds = async (req, res) => {
  try {
    const { roomId, beds } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const bedsWithRoom = beds.map(b => ({ ...b, room: roomId, status: b.status||'AVAILABLE' }));
    const created = await Bed.insertMany(bedsWithRoom);
    room.beds.push(...created.map(b => b._id));
    await room.save();
    res.status(201).json(created.map(b => ({ ...b.toObject(), roomId })));
  } catch (err) { res.status(400).json({ error: err.message }); }
};

module.exports = { createBed, getBeds, updateBed, deleteBed, bulkCreateBeds };
