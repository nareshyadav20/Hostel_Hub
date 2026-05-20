const Task = require('../models/Task');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, category, assignedTo, dueDate, priority, desc } = req.body;
    
    const newTask = new Task({
      title,
      category,
      assignedTo,
      dueDate,
      priority,
      desc,
      status: 'Pending',
      history: [{
        status: 'Created',
        time: new Date().toLocaleString(),
        user: req.user ? req.user.name : 'Admin'
      }]
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    task.history.push({
      status: status,
      time: new Date().toLocaleString(),
      user: req.user ? req.user.name : 'Admin'
    });

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
