import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'ANY'],
      default: 'ANY',
    },
    minOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.methods.isValidForOrder = function isValidForOrder(subtotal, currency) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (this.expiresAt && this.expiresAt < new Date()) {
    return { valid: false, message: 'Coupon has expired' };
  }
  if (this.usageLimit != null && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  if (this.currency !== 'ANY' && this.currency !== currency) {
    return { valid: false, message: `Coupon only valid for ${this.currency}` };
  }
  if (subtotal < this.minOrder) {
    return {
      valid: false,
      message: `Minimum order of ${this.minOrder} ${currency} required`,
    };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function calculateDiscount(subtotal) {
  let discount = 0;
  if (this.type === 'percent') {
    discount = (subtotal * this.value) / 100;
    if (this.maxDiscount != null) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.value;
  }
  return Math.min(Math.round(discount * 100) / 100, subtotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
