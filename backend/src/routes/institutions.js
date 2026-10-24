import express from 'express';
import {
  getInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from '../controllers/institutionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getInstitutions)
  .post(protect, authorize('admin'), createInstitution);

router.route('/:id')
  .get(protect, getInstitution)
  .put(protect, authorize('admin', 'council'), updateInstitution)
  .delete(protect, authorize('admin'), deleteInstitution);

export default router;
