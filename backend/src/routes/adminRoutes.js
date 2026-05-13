/**
 * Admin Routes — Unrestricted API endpoints for the Admin Portal
 * No auth middleware applied — the admin portal handles its own session management.
 */

const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

// ─── Platform Stats ───
router.get('/stats', admin.getPlatformStats);

// ─── Owners ───
router.get('/owners', admin.getAllOwners);
router.get('/owners/:id', admin.getOwnerById);
router.patch('/owners/:id', admin.updateOwnerStatus);
router.delete('/owners/:id', admin.deleteOwner);

// ─── Tenants ───
router.get('/tenants', admin.getAllTenants);
router.post('/tenants', admin.createTenant);
router.patch('/tenants/:id', admin.updateTenant);
router.delete('/tenants/:id', admin.deleteTenant);

// ─── Buildings ───
router.get('/buildings', admin.getAllBuildings);

// ─── Rooms & Beds ───
router.get('/rooms', admin.getAllRooms);
router.get('/beds', admin.getAllBeds);

// ─── Complaints ───
router.get('/complaints', admin.getAllComplaints);
router.patch('/complaints/:id', admin.updateComplaintStatus);

// ─── Payments ───
router.get('/payments', admin.getAllPayments);

// ─── Inventory ───
router.get('/inventory', admin.getAllInventory);

// ─── Staff ───
router.get('/staff', admin.getAllStaff);

// ─── Notifications ───
router.get('/notifications', admin.getAllNotifications);

module.exports = router;
