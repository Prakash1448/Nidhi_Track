import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  itemId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  clause: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Complete', 'Needs Review', 'Missing'],
    default: 'Missing'
  },
  fileName: {
    type: String,
    default: null
  },
  fileUrl: {
    type: String,
    default: null
  },
  date: {
    type: String,
    default: 'Not yet uploaded'
  }
}, {
  timestamps: true
});

// Indexes
checklistItemSchema.index({ institutionId: 1 });
checklistItemSchema.index({ itemId: 1 });
checklistItemSchema.index({ status: 1 });

const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);

export default ChecklistItem;
