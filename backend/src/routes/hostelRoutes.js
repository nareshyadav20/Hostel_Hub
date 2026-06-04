const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const authMiddleware = require('../utils/authMiddleware');

// ─── Public / Flutter Routes (no auth required) ───────────────────────────────
// IMPORTANT: specific named paths must come before /:id wildcard routes

// GET /api/hostels/list?page=1&limit=20          → Paginated hostel listing
router.get('/list', hostelController.getHostelsPaginated);

// GET /api/hostels/search?location=...&sortBy=... → Search + sort + paginate
router.get('/search', hostelController.searchHostels);

// GET /api/hostels/:hostelId/detail              → Full detail for one hostel
router.get('/:hostelId/detail', hostelController.getHostelDetail);

// ─── Owner-protected Routes ───────────────────────────────────────────────────
router.use(authMiddleware);

router.get('/', hostelController.getHostels);
router.post('/', hostelController.createHostel);
router.get('/bed-stats', hostelController.getBedStats);
router.patch('/:id/sync-beds', hostelController.syncFilledBeds);
router.patch('/:id', hostelController.updateHostel);
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
