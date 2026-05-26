const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantPortalController');
const auth = require('../utils/authMiddleware');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/profile');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `photo_${Date.now()}_${safeName}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Community Reports
router.post('/community-reports', auth, controller.createCommunityReport);
router.get('/community-reports', auth, controller.getCommunityReports);

// SOS Alerts
router.post('/sos-alerts', auth, controller.createSOSAlert);

// Rewards
router.get('/rewards/me', auth, controller.getMyRewards);

// Wishlist
router.post('/wishlist', auth, controller.addToWishlist);
router.get('/wishlist', auth, controller.getMyWishlist);
router.delete('/wishlist/:id', auth, controller.removeFromWishlist);

// Profile
router.get('/complete-profile', auth, controller.getCompleteProfile);
router.post('/upload-photo', auth, upload.single('photo'), controller.uploadPhoto);

module.exports = router;
