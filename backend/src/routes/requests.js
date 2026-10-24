import express from 'express';
import {
  getRequests,
  getRequest,
  createRequest,
  updateRequestStatus,
  addClarification,
  grantClearance,
  executeDecision,
  getPrioritizedRequests
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRequests)
  .post(protect, authorize('institution'), createRequest);

router.get('/priority/list', protect, authorize('council', 'admin'), getPrioritizedRequests);

router.route('/:id')
  .get(protect, getRequest);

router.patch('/:id/status', protect, authorize('council', 'admin'), updateRequestStatus);
router.post('/:id/clarification', protect, authorize('council', 'admin'), addClarification);
router.post('/:id/clearance', protect, authorize('council', 'admin'), grantClearance);
router.post('/:id/decision', protect, authorize('council', 'admin'), executeDecision);

export default router;
