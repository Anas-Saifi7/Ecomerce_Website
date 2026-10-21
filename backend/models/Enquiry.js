import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'support', 'export', 'wholesale', 'return'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'replied', 'closed'],
      default: 'new',
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
