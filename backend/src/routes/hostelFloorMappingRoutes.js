const express = require('express');
const { createMapping, getMappings, removeMapping } = require('../controllers/hostelFloorMappingController');

const router = express.Router();

router.post('/', createMapping);
router.get('/', getMappings);
router.delete('/', removeMapping);

module.exports = router;
