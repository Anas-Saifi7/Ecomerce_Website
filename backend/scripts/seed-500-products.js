
import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';

import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';


const categoryNames = [
  'Spices & Herbs',
  'Handicrafts',
  'Textiles & Fashion',
  'Wellness & Ayurveda',
  'Home & Lifestyle',
  'Food & Beverages',
  'Eco-Friendly Products',
  'Art & Cultural Products',
];

const categorySlugs = [
  'spices-herbs',
  'handicrafts',
  'textiles-fashion',
  'wellness-ayurveda',
  'home-lifestyle',
  'food-beverages',
  'eco-friendly',
  'art-cultural',
];

// 2. Demo product names for each category
const productsByCategory = {
  'spices-herbs': [
    'Kashmiri Saffron',
    'Organic Turmeric Powder',
    'Premium Green Cardamom',
    'Black Pepper',
    'Cumin Seeds',
    'Indian Red Chilli Powder',
    'Coriander Powder',
    'Garam Masala',
  ],

  handicrafts: [
    'Handcrafted Wooden Elephant',
    'Traditional Brass Diya',
    'Decorative Blue Pottery',
    'Handmade Clay Vase',
    'Carved Wooden Box',
    'Traditional Brass Bell',
    'Handcrafted Marble Bowl',
    'Decorative Metal Peacock',
  ],

  'textiles-fashion': [
    'Handwoven Cotton Scarf',
    'Traditional Block Print Dupatta',
    'Embroidered Cushion Cover',
    'Handloom Cotton Saree',
    'Printed Cotton Kurta',
    'Handwoven Table Runner',
    'Traditional Silk Stole',
    'Cotton Tote Bag',
  ],

  'wellness-ayurveda': [
    'Ayurvedic Herbal Soap',
    'Neem Herbal Powder',
    'Aloe Vera Gel',
    'Rose Water',
    'Herbal Hair Oil',
    'Ayurvedic Massage Oil',
    'Sandalwood Soap',
    'Herbal Bath Powder',
  ],

  'home-lifestyle': [
    'Decorative Ceramic Planter',
    'Handmade Candle Holder',
    'Cotton Cushion Cover',
    'Wooden Serving Tray',
    'Decorative Table Lamp',
    'Handcrafted Wall Hanging',
    'Ceramic Tea Set',
    'Decorative Storage Basket',
  ],

  'food-beverages': [
    'Organic Green Tea',
    'Darjeeling Black Tea',
    'Raw Forest Honey',
    'Roasted Cashews',
    'Premium Basmati Rice',
    'Traditional Jaggery',
    'Dried Mango Slices',
    'Organic Millet Mix',
  ],

  'eco-friendly': [
    'Reusable Cotton Shopping Bag',
    'Bamboo Toothbrush',
    'Coconut Shell Bowl',
    'Bamboo Water Bottle',
    'Reusable Produce Bags',
    'Natural Jute Basket',
    'Bamboo Cutlery Set',
    'Plant Fibre Scrub Pad',
  ],

  'art-cultural': [
    'Traditional Madhubani Painting',
    'Warli Art Wall Frame',
    'Handpainted Folk Art',
    'Traditional Miniature Painting',
    'Decorative Mandala Art',
    'Indian Heritage Poster',
    'Handpainted Wooden Art',
    'Traditional Festival Decor',
  ],
};


const variations = [
  'Classic Edition',
  'Premium Edition',
  'Heritage Edition',
  'Natural Edition',
  'Artisan Edition',
  'Signature Edition',
  'Traditional Edition',
  'Gift Edition',
];

// 4. Generate exactly 500 product records.
function generateProducts(categoryMap) {
  const products = [];

  for (let c = 0; c < categorySlugs.length; c++) {
    const categorySlug = categorySlugs[c];
    const categoryName = categoryNames[c];
    const names = productsByCategory[categorySlug];

    for (const baseName of names) {
      for (const variation of variations) {
        const name = `${baseName} - ${variation}`;
        const slug = slugify(name, {
          lower: true,
          strict: true,
        });

        const priceINR =
          199 + ((products.length * 137) % 1800);

        const priceUSD = Number(
          (priceINR / 83).toFixed(2)
        );

        const imageUrl =
          'https://placehold.co/800x800/F7F3EA/333333?text=' +
          encodeURIComponent(name);

        products.push({
          name,
          slug,
          subtitle: `${variation} from MOLOG`,
          description:
            `${name} is a demo product for the MOLOG ` +
            `e-commerce website. Replace this description ` +
            `with verified product information before launch.`,
          benefits: [
            'Demo product listing',
            'Suitable for testing the product page',
          ],
          usage: 'Refer to the final product packaging.',
          category: categoryMap[categorySlug]._id,
          categoryType: categoryName,
          region: 'India',
          productType: 'Retail',
          certifications: [],
          tags: [
            categorySlug,
            'molog',
            'demo-product',
          ],
          image: imageUrl,
          images: [imageUrl],
          priceINR,
          priceUSD,
          oldPriceINR: null,
          oldPriceUSD: null,
          stock: 10 + (products.length % 91),
          soldCount: 0,
          ratingAvg: 0,
          reviewCount: 0,
          isActive: true,
          isFeatured: products.length % 20 === 0,
        });
      }
    }
  }

  return products.slice(0, 500);
}

// 5. Insert only products that don't already exist.
async function seedProducts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from your .env file.');
    }

    const expectedDatabase =
      process.env.SEED_CONFIRM_DATABASE;

    const configuredDatabase = new URL(
      process.env.MONGO_URI
    ).pathname.replace(/^\//, '');

    if (
      !expectedDatabase ||
      expectedDatabase !== configuredDatabase
    ) {
      throw new Error(
        'Safety check failed. Set SEED_CONFIRM_DATABASE ' +
        'to the exact database name in your MONGO_URI.'
      );
    }

    await connectDB();

    // Find the categories already saved in MongoDB.
    const categories = await Category.find({
      slug: { $in: categorySlugs },
    });

    const categoryMap = {};

    for (const category of categories) {
      categoryMap[category.slug] = category;
    }

    const missingCategories = categorySlugs.filter(
      (slug) => !categoryMap[slug]
    );

    if (missingCategories.length > 0) {
      throw new Error(
        'Create these categories first: ' +
        missingCategories.join(', ')
      );
    }

    const generatedProducts =
      generateProducts(categoryMap);

    // Check for existing slugs before inserting.
    const generatedSlugs = generatedProducts.map(
      (product) => product.slug
    );

    const existingProducts = await Product.find({
      slug: { $in: generatedSlugs },
    }).select('slug');

    const existingSlugs = new Set(
      existingProducts.map((product) => product.slug)
    );

    const newProducts = generatedProducts.filter(
      (product) => !existingSlugs.has(product.slug)
    );

    if (newProducts.length === 0) {
      console.log(
        'All generated demo products already exist.'
      );
      return;
    }

    await Product.insertMany(newProducts, {
      ordered: false,
    });

    console.log(
      `Success! Inserted ${newProducts.length} products.`
    );

    console.log(
      `Existing matching products skipped: ${existingSlugs.size}`
    );

    console.log(
      `Total products now in database: ${
        await Product.countDocuments()
      }`
    );

    console.log(
      'Note: image links are placeholders, not real product photos.'
    );
  } catch (error) {
    console.error('Product seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
