import express from 'express';
import {
  getInstitutionDashboard,
  getCouncilDashboard,
  getFDRAnalytics,
  getRequestAnalytics,
  getChecklist,
  createChecklistItem,
  updateChecklistItem,
  getNotifications,
  markNotificationRead
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Dashboard routes
router.get('/institution/:id', protect, getInstitutionDashboard);
router.get('/council', protect, authorize('council', 'admin'), getCouncilDashboard);

// Analytics routes
router.get('/analytics/fdrs', protect, authorize('council', 'admin'), getFDRAnalytics);
router.get('/analytics/requests', protect, authorize('council', 'admin'), getRequestAnalytics);

// Checklist routes
router.route('/checklist/:institutionId')
  .get(protect, getChecklist);

router.route('/checklist')
  .post(protect, createChecklistItem);

router.route('/checklist/:id')
  .put(protect, updateChecklistItem);

// Notification routes
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);

export default router;
