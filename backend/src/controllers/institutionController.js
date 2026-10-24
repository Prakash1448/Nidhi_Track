import Institution from '../models/Institution.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all institutions
// @route   GET /api/institutions
// @access  Private (Council/Admin)
export const getInstitutions = async (req, res, next) => {
  try {
    const { region, category, search } = req.query;
    
    let query = {};
    
    if (region) query.region = region;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const institutions = await Institution.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: institutions.length,
      data: institutions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single institution
// @route   GET /api/institutions/:id
// @access  Private
export const getInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new institution
// @route   POST /api/institutions
// @access  Private (Admin only)
export const createInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.create(req.body);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'CREATE',
      entity: 'Institution',
      entityId: institution._id.toString(),
      changes: req.body,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Institution created successfully',
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update institution
// @route   PUT /api/institutions/:id
// @access  Private (Admin only)
export const updateInstitution = async (req, res, next) => {
  try {
    let institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    const oldData = institution.toObject();
    institution = await Institution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'Institution',
      entityId: institution._id.toString(),
      changes: { old: oldData, new: institution.toObject() },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Institution updated successfully',
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete institution
// @route   DELETE /api/institutions/:id
// @access  Private (Admin only)
export const deleteInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    await institution.deleteOne();

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'DELETE',
      entity: 'Institution',
      entityId: req.params.id,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Institution deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
