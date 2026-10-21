import mongoose from 'mongoose';
import slugify from 'slugify';

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

pageSchema.pre('validate', function setSlug() {
  if (this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true });
  } else if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Page = mongoose.model('Page', pageSchema);

export default Page;
