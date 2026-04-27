const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/', tenantController.getTenants);
router.post('/', tenantController.createTenant);
router.post('/bulk-create', tenantController.bulkCreateTenants);
router.patch('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);

module.exports = router;
