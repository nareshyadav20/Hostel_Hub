const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/me', authMiddleware, tenantController.getTenantProfile);
router.post('/', authMiddleware, tenantController.createTenant);
router.get('/', authMiddleware, tenantController.getTenants);
router.post('/bulk', authMiddleware, tenantController.bulkCreateTenants);
router.put('/:id', authMiddleware, tenantController.updateTenant);
router.delete('/:id', authMiddleware, tenantController.deleteTenant);

module.exports = router;
