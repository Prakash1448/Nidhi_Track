import express from 'express';
import {
  getFDRs,
  getFDR,
  createFDR,
  updateFDR,
  deleteFDR,
  uploadFDRDocument,
  getFDRsByInstitution
} from '../controllers/fdrController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getFDRs)
  .post(protect, createFDR);

router.route('/:id')
  .get(protect, getFDR)
  .put(protect, updateFDR)
  .delete(protect, authorize('council', 'admin'), deleteFDR);

router.post('/:id/documents', protect, upload.single('document'), uploadFDRDocument);

router.get('/institution/:institutionId', protect, getFDRsByInstitution);

export default router;
