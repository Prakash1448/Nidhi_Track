import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
  institutionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Institution code is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  establishmentYear: {
    type: Number,
    required: true
  },
  currentApprovalStatus: {
    type: String,
    required: true
  },
  approvedIntake: {
    type: Number,
    required: true
  },
  courses: [{
    type: String
  }],
  nodalOfficer: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
institutionSchema.index({ institutionId: 1 });
institutionSchema.index({ code: 1 });
institutionSchema.index({ region: 1 });

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;
