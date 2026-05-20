const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/', authMiddleware, taskController.getAllTasks);
router.post('/', authMiddleware, taskController.createTask);
router.patch('/:id/status', authMiddleware, taskController.updateTaskStatus);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
