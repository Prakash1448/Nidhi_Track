import FDR from '../models/FDR.js';
import ReleaseRequest from '../models/ReleaseRequest.js';
import Institution from '../models/Institution.js';
import ChecklistItem from '../models/ChecklistItem.js';
import Notification from '../models/Notification.js';

// @desc    Get institution dashboard data
// @route   GET /api/dashboard/institution/:id
// @access  Private
export const getInstitutionDashboard = async (req, res, next) => {
  try {
    const institutionId = req.params.id || req.user.institutionId;

    // Get FDRs
    const fdrs = await FDR.find({ institutionId });
    
    // Get Release Requests
    const requests = await ReleaseRequest.find({ institutionId });
    
    // Calculate statistics
    const stats = {
      totalFDRs: fdrs.length,
      activeFDRs: fdrs.filter(f => f.status === 'Active').length,
      maturingSoonFDRs: fdrs.filter(f => f.status === 'Maturing Soon').length,
      maturedFDRs: fdrs.filter(f => f.status === 'Matured').length,
      totalFDRValue: fdrs.reduce((sum, f) => sum + f.amount, 0),
      pendingRequests: requests.filter(r => r.priority !== 'Closed').length,
      closedRequests: requests.filter(r => r.priority === 'Closed').length
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        fdrs: fdrs.slice(0, 5), // Recent 5 FDRs
        requests: requests.slice(0, 5) // Recent 5 requests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get council dashboard data
// @route   GET /api/dashboard/council
// @access  Private (Council)
export const getCouncilDashboard = async (req, res, next) => {
  try {
    // Get all institutions count
    const institutionsCount = await Institution.countDocuments();
    
    // Get all FDRs
    const allFDRs = await FDR.find();
    
    // Get all requests
    const allRequests = await ReleaseRequest.find();
    
    // Calculate statistics
    const stats = {
      totalInstitutions: institutionsCount,
      totalFDRs: allFDRs.length,
      activeFDRs: allFDRs.filter(f => f.status === 'Active').length,
      maturingSoonFDRs: allFDRs.filter(f => f.status === 'Maturing Soon').length,
      maturedFDRs: allFDRs.filter(f => f.status === 'Matured').length,
      totalFDRValue: allFDRs.reduce((sum, f) => sum + f.amount, 0),
      pendingRequests: allRequests.filter(r => r.priority !== 'Closed').length,
      urgentRequests: allRequests.filter(r => r.priority === 'Urgent').length,
      closedRequests: allRequests.filter(r => r.priority === 'Closed').length,
      averageWaitingDays: allRequests.length > 0 
        ? Math.round(allRequests.reduce((sum, r) => sum + r.waitingDays, 0) / allRequests.length)
        : 0
    };

    // Get requests by region
    const requestsByRegion = await ReleaseRequest.aggregate([
      {
        $lookup: {
          from: 'institutions',
          localField: 'institutionId',
          foreignField: '_id',
          as: 'institution'
        }
      },
      { $unwind: '$institution' },
      {
        $group: {
          _id: '$institution.region',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        requestsByRegion,
        recentRequests: allRequests.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get FDR analytics
// @route   GET /api/analytics/fdrs
// @access  Private (Council)
export const getFDRAnalytics = async (req, res, next) => {
  try {
    const fdrs = await FDR.find().populate('institutionId');
    
    // Analytics by status
    const byStatus = {
      Active: fdrs.filter(f => f.status === 'Active').length,
      'Maturing Soon': fdrs.filter(f => f.status === 'Maturing Soon').length,
      Matured: fdrs.filter(f => f.status === 'Matured').length,
      'Replaced & Archived': fdrs.filter(f => f.status === 'Replaced & Archived').length
    };
    
    // Analytics by region
    const byRegion = {};
    fdrs.forEach(fdr => {
      if (fdr.institutionId) {
        const region = fdr.institutionId.region;
        byRegion[region] = (byRegion[region] || 0) + 1;
      }
    });
    
    // Analytics by bank
    const byBank = {};
    fdrs.forEach(fdr => {
      byBank[fdr.bankName] = (byBank[fdr.bankName] || 0) + 1;
    });
    
    // Total value by status
    const valueByStatus = {
      Active: fdrs.filter(f => f.status === 'Active').reduce((sum, f) => sum + f.amount, 0),
      'Maturing Soon': fdrs.filter(f => f.status === 'Maturing Soon').reduce((sum, f) => sum + f.amount, 0),
      Matured: fdrs.filter(f => f.status === 'Matured').reduce((sum, f) => sum + f.amount, 0)
    };

    res.status(200).json({
      success: true,
      data: {
        byStatus,
        byRegion,
        byBank,
        valueByStatus,
        totalValue: fdrs.reduce((sum, f) => sum + f.amount, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get request analytics
// @route   GET /api/analytics/requests
// @access  Private (Council)
export const getRequestAnalytics = async (req, res, next) => {
  try {
    const requests = await ReleaseRequest.find().populate('institutionId');
    
    // Analytics by status
    const statusCounts = {};
    requests.forEach(req => {
      statusCounts[req.status] = (statusCounts[req.status] || 0) + 1;
    });
    
    // Analytics by priority
    const priorityCounts = {
      Urgent: requests.filter(r => r.priority === 'Urgent').length,
      'Overdue Bottleneck': requests.filter(r => r.priority === 'Overdue Bottleneck').length,
      High: requests.filter(r => r.priority === 'High').length,
      Medium: requests.filter(r => r.priority === 'Medium').length,
      Closed: requests.filter(r => r.priority === 'Closed').length
    };
    
    // Average processing time
    const closedRequests = requests.filter(r => r.priority === 'Closed');
    const avgProcessingDays = closedRequests.length > 0
      ? Math.round(closedRequests.reduce((sum, r) => sum + r.waitingDays, 0) / closedRequests.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        priorityCounts,
        avgProcessingDays,
        totalRequests: requests.length,
        activeRequests: requests.filter(r => r.priority !== 'Closed').length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get checklist for institution
// @route   GET /api/checklist/:institutionId
// @access  Private
export const getChecklist = async (req, res, next) => {
  try {
    const institutionId = req.params.institutionId || req.user.institutionId;
    
    const checklist = await ChecklistItem.find({ institutionId });

    res.status(200).json({
      success: true,
      count: checklist.length,
      data: checklist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create checklist item
// @route   POST /api/checklist
// @access  Private
export const createChecklistItem = async (req, res, next) => {
  try {
    if (req.user.role === 'institution') {
      req.body.institutionId = req.user.institutionId;
    }

    const item = await ChecklistItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Checklist item created successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update checklist item
// @route   PUT /api/checklist/:id
// @access  Private
export const updateChecklistItem = async (req, res, next) => {
  try {
    let item = await ChecklistItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }

    item = await ChecklistItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Checklist item updated successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };
    
    if (req.query.unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};
