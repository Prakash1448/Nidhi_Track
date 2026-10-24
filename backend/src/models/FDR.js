import mongoose from 'mongoose';

const fdrDocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending Verification', 'Inconsistent', 'Archived'],
    default: 'Pending Verification'
  },
  date: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const fdrSchema = new mongoose.Schema({
  fdrId: {
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
  fdrNumber: {
    type: String,
    required: [true, 'FDR number is required'],
    trim: true
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  maturityDate: {
    type: Date,
    required: [true, 'Maturity date is required']
  },
  tenureYears: {
    type: Number,
    required: true
  },
  depositType: {
    type: String,
    required: true
  },
  jointHolding: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Maturing Soon', 'Matured', 'Replaced & Archived'],
    default: 'Active'
  },
  replacementOf: {
    type: String,
    default: null
  },
  replacedBy: {
    type: String,
    default: null
  },
  verificationStatus: {
    type: String,
    enum: ['Verified in Demo', 'Inconsistent — Review Required', 'Bank Confirmation Pending'],
    default: 'Bank Confirmation Pending'
  },
  extractedBankRef: {
    type: String
  },
  discrepancyFlag: {
    type: Boolean,
    default: false
  },
  discrepancyNotes: {
    type: String
  },
  documents: [fdrDocumentSchema]
}, {
  timestamps: true
});

// Virtual for days until maturity
fdrSchema.virtual('daysUntilMaturity').get(function() {
  const today = new Date();
  const maturity = new Date(this.maturityDate);
  const diff = Math.ceil((maturity - today) / (1000 * 60 * 60 * 24));
  return diff;
});

// Update status based on maturity date
fdrSchema.pre('save', function(next) {
  const today = new Date();
  const maturity = new Date(this.maturityDate);
  const daysUntilMaturity = Math.ceil((maturity - today) / (1000 * 60 * 60 * 24));
  
  if (this.status !== 'Replaced & Archived') {
    if (daysUntilMaturity < 0) {
      this.status = 'Matured';
    } else if (daysUntilMaturity <= 30) {
      this.status = 'Maturing Soon';
    } else {
      this.status = 'Active';
    }
  }
  
  next();
});

// Indexes for performance
fdrSchema.index({ fdrId: 1 });
fdrSchema.index({ institutionId: 1 });
fdrSchema.index({ status: 1 });
fdrSchema.index({ maturityDate: 1 });

const FDR = mongoose.model('FDR', fdrSchema);

export default FDR;
