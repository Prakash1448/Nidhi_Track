import FDR from '../models/FDR.js';
import Institution from '../models/Institution.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all FDRs with filtering
// @route   GET /api/fdrs
// @access  Private
export const getFDRs = async (req, res, next) => {
  try {
    const { status, institutionId, maturingSoon } = req.query;
    
    let query = {};
    
    // Filter by institution if user is institution role
    if (req.user.role === 'institution') {
      query.institutionId = req.user.institutionId;
    } else if (institutionId) {
      query.institutionId = institutionId;
    }
    
    if (status) query.status = status;
    
    // Get FDRs maturing within 30 days
    if (maturingSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      query.maturityDate = { $lte: thirtyDaysFromNow };
      query.status = { $ne: 'Replaced & Archived' };
    }

    const fdrs = await FDR.find(query)
      .populate('institutionId')
      .sort({ maturityDate: 1 });

    res.status(200).json({
      success: true,
      count: fdrs.length,
      data: fdrs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single FDR
// @route   GET /api/fdrs/:id
// @access  Private
export const getFDR = async (req, res, next) => {
  try {
    const fdr = await FDR.findById(req.params.id).populate('institutionId');

    if (!fdr) {
      return res.status(404).json({
        success: false,
        message: 'FDR not found'
      });
    }

    // Check authorization
    if (req.user.role === 'institution' && 
        fdr.institutionId._id.toString() !== req.user.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this FDR'
      });
    }

    res.status(200).json({
      success: true,
      data: fdr
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new FDR
// @route   POST /api/fdrs
// @access  Private
export const createFDR = async (req, res, next) => {
  try {
    // If institution role, use their institution ID
    if (req.user.role === 'institution') {
      req.body.institutionId = req.user.institutionId;
    }

    const fdr = await FDR.create(req.body);
    await fdr.populate('institutionId');

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'CREATE',
      entity: 'FDR',
      entityId: fdr._id.toString(),
      changes: req.body,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'FDR created successfully',
      data: fdr
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FDR
// @route   PUT /api/fdrs/:id
// @access  Private
export const updateFDR = async (req, res, next) => {
  try {
    let fdr = await FDR.findById(req.params.id);

    if (!fdr) {
      return res.status(404).json({
        success: false,
        message: 'FDR not found'
      });
    }

    // Check authorization
    if (req.user.role === 'institution' && 
        fdr.institutionId.toString() !== req.user.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this FDR'
      });
    }

    const oldData = fdr.toObject();
    fdr = await FDR.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('institutionId');

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'FDR',
      entityId: fdr._id.toString(),
      changes: { old: oldData, new: fdr.toObject() },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'FDR updated successfully',
      data: fdr
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FDR
// @route   DELETE /api/fdrs/:id
// @access  Private (Council/Admin only)
export const deleteFDR = async (req, res, next) => {
  try {
    const fdr = await FDR.findById(req.params.id);

    if (!fdr) {
      return res.status(404).json({
        success: false,
        message: 'FDR not found'
      });
    }

    await fdr.deleteOne();

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'DELETE',
      entity: 'FDR',
      entityId: req.params.id,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'FDR deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload FDR document
// @route   POST /api/fdrs/:id/documents
// @access  Private
export const uploadFDRDocument = async (req, res, next) => {
  try {
    const fdr = await FDR.findById(req.params.id);

    if (!fdr) {
      return res.status(404).json({
        success: false,
        message: 'FDR not found'
      });
    }

    // Check authorization
    if (req.user.role === 'institution' && 
        fdr.institutionId.toString() !== req.user.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload documents for this FDR'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const document = {
      name: req.body.documentName || req.file.originalname,
      status: 'Pending Verification',
      date: new Date().toISOString().split('T')[0],
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    };

    fdr.documents.push(document);
    await fdr.save();

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPLOAD',
      entity: 'FDR',
      entityId: fdr._id.toString(),
      changes: { document },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: fdr
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get FDRs by institution
// @route   GET /api/fdrs/institution/:institutionId
// @access  Private
export const getFDRsByInstitution = async (req, res, next) => {
  try {
    const fdrs = await FDR.find({ institutionId: req.params.institutionId })
      .populate('institutionId')
      .sort({ maturityDate: 1 });

    res.status(200).json({
      success: true,
      count: fdrs.length,
      data: fdrs
    });
  } catch (error) {
    next(error);
  }
};
