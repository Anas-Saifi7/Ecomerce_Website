import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    benefits: [{ type: String, trim: true }],
    usage: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    categoryType: {
      type: String,
      trim: true,
      default: '',
    },
    region: {
      type: String,
      trim: true,
      default: '',
    },
    productType: {
      type: String,
      trim: true,
      default: 'Retail',
    },
    certifications: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    images: [{ type: String }],
    image: {
      type: String,
      default: '',
    },
    priceINR: {
      type: Number,
      required: [true, 'INR price is required'],
      min: 0,
    },
    priceUSD: {
      type: Number,
      required: [true, 'USD price is required'],
      min: 0,
    },
    oldPriceINR: {
      type: Number,
      min: 0,
      default: null,
    },
    oldPriceUSD: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('inStock').get(function inStock() {
  return this.stock > 0 && this.isActive;
});

productSchema.pre('validate', function setSlug() {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ region: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
