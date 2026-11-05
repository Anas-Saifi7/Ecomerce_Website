import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';

const categories = [
  {
    name: 'Spices & Herbs',
    slug: 'spices-herbs',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Textiles & Fashion',
    slug: 'textiles-fashion',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wellness & Ayurveda',
    slug: 'wellness-ayurveda',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Food & Beverages',
    slug: 'food-beverages',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Eco-Friendly Products',
    slug: 'eco-friendly',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Art & Cultural Products',
    slug: 'art-cultural',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80',
  },
];

async function seedCategories() {
  try {
    await connectDB();

    for (let i = 0; i < categories.length; i++) {
      const item = categories[i];

      await Category.findOneAndUpdate(
        { slug: item.slug },
        {
          $set: {
            name: item.name,
            image: item.image,
            description: `${item.name} products from Halla Bol`,
            isActive: true,
            sortOrder: i + 1,
          },
          $setOnInsert: { slug: item.slug },
        },
        { upsert: true, runValidators: true }
      );

      console.log(`Updated category image: ${item.name}`);
    }

    console.log('Category images updated successfully.');
  } catch (error) {
    console.error('Category update failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();
