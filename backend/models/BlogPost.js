import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      trim: true,
      default: 'Halla Bol',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function setSlug() {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
