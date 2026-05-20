const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: { type: String, required: true },
  user: { type: String, required: true }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Finance', 'Maintenance', 'Residents', 'Admin', 'Other'],
    default: 'Admin'
  },
  assignedTo: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  desc: { type: String, required: true },
  history: [taskHistorySchema]
}, { timestamps: true, collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);
