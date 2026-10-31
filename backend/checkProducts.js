import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

async function checkProducts() {
  try {
    await connectDB();

    console.log('Database:', mongoose.connection.name);

    const total = await Product.countDocuments({});
    const active = await Product.countDocuments({
      isActive: true,
    });
    const inactive = await Product.countDocuments({
      isActive: false,
    });

    console.log('Total products:', total);
    console.log('Active products:', active);
    console.log('Inactive products:', inactive);
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkProducts();