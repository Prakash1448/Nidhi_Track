import ReleaseRequest from '../models/ReleaseRequest.js';
import FDR from '../models/FDR.js';
import Institution from '../models/Institution.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all release requests
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res, next) => {
  try {
    const { status, priority, institutionId } = req.query;
    
    let query = {};
    
    // Filter by institution if user is institution role
    if (req.user.role === 'institution') {
      query.institutionId = req.user.institutionId;
    } else if (institutionId) {
      query.institutionId = institutionId;
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const requests = await ReleaseRequest.find(query)
      .populate('institutionId')
      .populate('fdrId')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequest = async (req, res, next) => {
  try {
    const request = await ReleaseRequest.findById(req.params.id)
      .populate('institutionId')
      .populate('fdrId');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'institution' && 
        request.institutionId._id.toString() !== req.user.institutionId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new release request
// @route   POST /api/requests
// @access  Private (Institution)
export const createRequest = async (req, res, next) => {
  try {
    // If institution role, use their institution ID
    if (req.user.role === 'institution') {
      req.body.institutionId = req.user.institutionId;
    }

    const request = await ReleaseRequest.create(req.body);
    await request.populate(['institutionId', 'fdrId']);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'CREATE',
      entity: 'ReleaseRequest',
      entityId: request._id.toString(),
      changes: req.body,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Release request created successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private (Council)
export const updateRequestStatus = async (req, res, next) => {
  try {
    let request = await ReleaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const oldData = request.toObject();
    
    // Update fields
    if (req.body.status) request.status = req.body.status;
    if (req.body.currentStage) request.currentStage = req.body.currentStage;
    if (req.body.nextResponsibleDesk) request.nextResponsibleDesk = req.body.nextResponsibleDesk;
    if (req.body.stages) request.stages = req.body.stages;

    await request.save();
    await request.populate(['institutionId', 'fdrId']);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'ReleaseRequest',
      entityId: request._id.toString(),
      changes: { old: oldData, new: request.toObject() },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add clarification note
// @route   POST /api/requests/:id/clarification
// @access  Private (Council)
export const addClarification = async (req, res, next) => {
  try {
    const request = await ReleaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const note = {
      role: req.body.role || 'Council Scrutiny Officer',
      date: new Date(),
      text: req.body.text,
      userId: req.user._id
    };

    request.notes.unshift(note);
    request.status = 'Clarification Requested';
    
    await request.save();
    await request.populate(['institutionId', 'fdrId']);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'ReleaseRequest',
      entityId: request._id.toString(),
      changes: { action: 'clarification_added', note },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Clarification added successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grant clearance
// @route   POST /api/requests/:id/clearance
// @access  Private (Council)
export const grantClearance = async (req, res, next) => {
  try {
    const request = await ReleaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const note = {
      role: req.body.role || 'Regional Verification Officer',
      date: new Date(),
      text: req.body.text,
      userId: req.user._id
    };

    request.notes.unshift(note);
    
    // Update stages if provided
    if (req.body.stages) {
      request.stages = req.body.stages;
    }
    
    if (req.body.status) request.status = req.body.status;
    if (req.body.currentStage) request.currentStage = req.body.currentStage;
    
    await request.save();
    await request.populate(['institutionId', 'fdrId']);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'ReleaseRequest',
      entityId: request._id.toString(),
      changes: { action: 'clearance_granted', note },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Clearance granted successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Execute decision
// @route   POST /api/requests/:id/decision
// @access  Private (Council - Admin)
export const executeDecision = async (req, res, next) => {
  try {
    const request = await ReleaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const { outcomeType, memo } = req.body;
    
    const note = {
      role: 'Member Secretary AICTE',
      date: new Date(),
      text: memo,
      userId: req.user._id
    };

    request.notes.unshift(note);
    
    // Update stages
    if (req.body.stages) {
      request.stages = req.body.stages;
    }
    
    // Update status based on outcome
    if (outcomeType === 'noc') {
      request.status = 'Release NOC Issued (Closed)';
      request.priority = 'Closed';
    } else if (outcomeType === 'rtgs') {
      request.status = 'RTGS Refund Sanctioned (Closed)';
      request.priority = 'Closed';
    } else if (outcomeType === 'withhold') {
      request.status = 'Withheld / Review Pending';
    }
    
    request.currentStage = 'Stage 6: Outcome Recorded';
    
    await request.save();
    await request.populate(['institutionId', 'fdrId']);

    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE',
      entity: 'ReleaseRequest',
      entityId: request._id.toString(),
      changes: { action: 'decision_executed', outcomeType, memo },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Decision executed successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prioritized requests
// @route   GET /api/requests/priority/list
// @access  Private (Council)
export const getPrioritizedRequests = async (req, res, next) => {
  try {
    const requests = await ReleaseRequest.find({
      priority: { $ne: 'Closed' }
    })
      .populate('institutionId')
      .populate('fdrId')
      .sort({ priority: 1, waitingDays: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};
