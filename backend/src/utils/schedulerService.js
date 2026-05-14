const cron = require('node-cron');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const notificationService = require('./notificationService');
const mongoose = require('mongoose');

/**
 * Scheduler Service
 * Handles automated background tasks and notifications
 */
const initScheduler = () => {
  console.log('🗓️ Scheduler Service Initialized');

  // --- 1. RENT & FEE REMINDERS ---
  // Runs daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🕒 Running Daily Rent Reminders Job...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all Pending/Due/Overdue payments
      const payments = await Payment.find({ 
        status: { $in: ['Pending', 'Due', 'Overdue'] },
        dueDate: { $exists: true }
      }).populate('tenantId').populate('buildingId');

      for (const payment of payments) {
        // Skip if building has disabled auto-reminders
        if (payment.buildingId && payment.buildingId.notificationSettings?.autoRentReminders === false) {
          continue;
        }

        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const tenantName = payment.tenantId?.name || 'Resident';
        const tId = payment.tenantId?._id || payment.tenantId;

        let reminderType = '';
        let message = '';
        let priority = 'Medium';
        let alertType = 'info';

        if (diffDays === 7) {
          reminderType = '7_DAYS';
          message = `Hi ${tenantName}, your ${payment.type} payment of ₹${payment.amount.toLocaleString()} is due in 1 week (${dueDate.toLocaleDateString()}).`;
        } else if (diffDays === 3) {
          reminderType = '3_DAYS';
          message = `Reminder: Your ${payment.type} payment of ₹${payment.amount.toLocaleString()} is due in 3 days.`;
          alertType = 'warning';
        } else if (diffDays === 1) {
          reminderType = '1_DAY';
          message = `Urgent: Your ${payment.type} payment of ₹${payment.amount.toLocaleString()} is due tomorrow!`;
          priority = 'High';
          alertType = 'warning';
        } else if (diffDays === 0) {
          reminderType = 'DUE_TODAY';
          message = `Attention: Today is the due date for your ${payment.type} payment of ₹${payment.amount.toLocaleString()}. Please pay now to avoid late fees.`;
          priority = 'High';
          alertType = 'error';
        } else if (diffDays < 0) {
          // Send reminder for overdue payments once every 2 days
          const overdueDay = Math.abs(diffDays);
          if (overdueDay % 2 === 0) {
            reminderType = `OVERDUE_${overdueDay}`;
            message = `URGENT: Your ${payment.type} payment of ₹${payment.amount.toLocaleString()} is OVERDUE by ${overdueDay} days. Please settle this immediately.`;
            priority = 'High';
            alertType = 'error';
          }
        }

        if (reminderType) {
          const automatedId = `remind_rent_${payment._id}_${reminderType}`;
          
          // createNotification handles:
          // 1. MongoDB Save
          // 2. Duplicate Prevention (via automatedId unique index)
          // 3. Socket.io emission
          await notificationService.createNotification({
            portalType: 'Tenant',
            moduleName: 'Payments',
            category: diffDays < 0 ? 'Overdue' : 'Reminder',
            title: diffDays < 0 ? 'Payment Overdue!' : diffDays === 0 ? 'Due Today' : 'Upcoming Payment',
            message,
            priority,
            type: alertType,
            buildingId: payment.buildingId,
            tenantId: tId,
            actionLink: '/payments',
            automatedId // Duplicate prevention
          });
        }
      }
    } catch (error) {
      console.error('❌ Scheduler Error (Rent Reminders):', error);
    }
  });

  // --- 2. COMPLAINT FOLLOW-UPS ---
  // Runs every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('🕒 Running Complaint Escalation Job...');
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      
      const pendingComplaints = await Complaint.find({
        status: 'Pending',
        createdAt: { $lt: threeDaysAgo }
      }).populate('buildingId');

      for (const complaint of pendingComplaints) {
        // Skip if building has disabled auto-escalations
        if (complaint.buildingId && complaint.buildingId.notificationSettings?.autoComplaintEscalations === false) {
          continue;
        }

        // Notify Owner about stalled complaints
        await notificationService.createNotification({
          portalType: 'Owner',
          moduleName: 'Complaints',
          category: 'Escalation',
          title: 'Stalled Complaint Alert',
          message: `Complaint #${complaint._id.toString().slice(-6)} has been pending for over 3 days.`,
          priority: 'High',
          type: 'warning',
          buildingId: complaint.buildingId,
          actionLink: '/complaints',
          automatedId: `escalate_complaint_${complaint._id}`
        });
      }
    } catch (error) {
      console.error('❌ Scheduler Error (Complaints):', error);
    }
  });

  // --- 3. SYSTEM HEARTBEAT ---
  // Runs every hour
  cron.schedule('0 * * * *', () => {
    console.log(`💓 Scheduler Heartbeat: [${new Date().toLocaleTimeString()}] All background jobs are running.`);
  });
};

module.exports = { initScheduler };
