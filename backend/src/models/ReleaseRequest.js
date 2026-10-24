import mongoose from 'mongoose';

const workflowStageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'pending'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: null
  },
  note: {
    type: String,
    default: ''
  }
}, { _id: false });

const requestNoteSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: false });

const releaseRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  fdrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FDR',
    required: true
  },
  submissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  targetCompletionDate: {
    type: Date,
    required: true
  },
  fdrAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Submitted to Regional Office'
  },
  currentStage: {
    type: String,
    default: 'Stage 1: Submission'
  },
  waitingDays: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['Urgent', 'Overdue Bottleneck', 'High', 'Medium', 'Closed'],
    default: 'Medium'
  },
  priorityReason: {
    type: String,
    default: ''
  },
  nextResponsibleDesk: {
    type: String,
    default: 'Regional Verification Officer'
  },
  stages: [workflowStageSchema],
  notes: [requestNoteSchema]
}, {
  timestamps: true
});

// Calculate waiting days automatically
releaseRequestSchema.pre('save', function(next) {
  const today = new Date();
  const submission = new Date(this.submissionDate);
  this.waitingDays = Math.floor((today - submission) / (1000 * 60 * 60 * 24));
  next();
});

// Indexes
releaseRequestSchema.index({ requestId: 1 });
releaseRequestSchema.index({ institutionId: 1 });
releaseRequestSchema.index({ fdrId: 1 });
releaseRequestSchema.index({ status: 1 });
releaseRequestSchema.index({ priority: 1 });

const ReleaseRequest = mongoose.model('ReleaseRequest', releaseRequestSchema);

export default ReleaseRequest;
