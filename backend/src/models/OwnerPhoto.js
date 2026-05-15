const mongoose = require('mongoose');

const ownerPhotoSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  }
}, { timestamps: true, collection: 'owner_photo' });

module.exports = mongoose.model('OwnerPhoto', ownerPhotoSchema);
