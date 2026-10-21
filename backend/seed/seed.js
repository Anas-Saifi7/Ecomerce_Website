import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Spices & Herbs',
    slug: 'spices-herbs',
    description: 'Authentic Indian spices and aromatic herbs.',
    image: '/images/category-1.jpg',
    sortOrder: 1,
  },
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    description: 'Beautiful handmade treasures from Indian artisans.',
    image: '/images/category-2.jpg',
    sortOrder: 2,
  },
  {
    name: 'Textiles & Fashion',
    slug: 'textiles-fashion',
    description: 'Traditional textiles, handloom and Indian fashion.',
    image: '/images/category-3.jpg',
    sortOrder: 3,
  },
  {
    name: 'Wellness & Ayurveda',
    slug: 'wellness-ayurveda',
    description: 'Traditional wellness and everyday self-care products.',
    image: '/images/category-4.jpg',
    sortOrder: 4,
  },
  {
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    description: 'Thoughtful products for beautiful living spaces.',
    image: '/images/category-5.jpg',
    sortOrder: 5,
  },
  {
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Indian food products, teas and natural ingredients.',
    image: '/images/category-6.jpg',
    sortOrder: 6,
  },
  {
    name: 'Eco-Friendly Products',
    slug: 'eco-friendly',
    description: 'Practical alternatives for a more sustainable lifestyle.',
    image: '/images/category-7.jpg',
    sortOrder: 7,
  },
  {
    name: 'Art & Cultural Products',
    slug: 'art-cultural',
    description: 'Discover the rich cultural heritage of India.',
    image: '/images/category-8.jpg',
    sortOrder: 8,
  },
];

/** Cycle product-1..6.jpg for products 7-12 (only those image files exist in frontend). */
const productImage = (index) => {
  const n = ((index - 1) % 6) + 1;
  return `/images/product-${n}.jpg`;
};

const productsData = [
  {
    name: 'Organic Turmeric Powder',
    subtitle: 'Pure & Natural | 500g',
    categorySlug: 'spices-herbs',
    categoryType: 'Spices & Herbs',
    region: 'Uttar Pradesh',
    productType: 'Retail',
    certifications: ['Organic', 'FSSAI Certified'],
    tags: ['Organic', 'Export Ready'],
    priceINR: 360,
    priceUSD: 4.99,
    oldPriceINR: null,
    oldPriceUSD: null,
    stock: 200,
    soldCount: 1000,
    ratingAvg: 4.8,
    reviewCount: 120,
    isFeatured: true,
    description:
      'Our organic turmeric powder is sourced directly from Indian farms. It is known for its rich color, natural purity and premium quality.',
    benefits: [
      '100% natural',
      'Rich in natural curcumin',
      'Sourced from Indian farmers',
      'Perfect for cooking and daily use',
    ],
    usage: 'Use turmeric in curries, vegetables, milk, soups and other daily recipes.',
  },
  {
    name: 'Mixed Indian Spices',
    subtitle: 'Premium Spice Mix',
    categorySlug: 'spices-herbs',
    categoryType: 'Spices & Herbs',
    region: 'Rajasthan',
    productType: 'Retail',
    certifications: ['Handmade'],
    tags: ['Handmade', 'Natural'],
    priceINR: 1499,
    priceUSD: 18,
    oldPriceINR: 1799,
    oldPriceUSD: 22,
    stock: 150,
    soldCount: 800,
    ratingAvg: 4.6,
    reviewCount: 98,
    isFeatured: true,
    description:
      'A carefully selected blend of premium Indian spices made for authentic taste and aroma.',
    benefits: [
      'Premium quality spices',
      'Natural ingredients',
      'Rich aroma',
      'Authentic Indian flavour',
    ],
    usage: 'Add to curries, vegetables, rice, marinades and traditional Indian recipes.',
  },
  {
    name: 'Pure Organic Honey',
    subtitle: '100% Natural Honey',
    categorySlug: 'food-beverages',
    categoryType: 'Food & Beverages',
    region: 'Kashmir',
    productType: 'Retail',
    certifications: ['Organic', 'FSSAI Certified'],
    tags: ['Organic', 'FSSAI Certified'],
    priceINR: 1699,
    priceUSD: 20,
    stock: 120,
    soldCount: 1200,
    ratingAvg: 4.9,
    reviewCount: 150,
    isFeatured: true,
    description:
      'Pure organic honey collected from natural floral sources and carefully packed to preserve its natural taste.',
    benefits: ['100% natural', 'Organic honey', 'Rich natural flavour', 'Carefully packed'],
    usage: 'Enjoy directly, add to warm beverages, breakfast foods, desserts or smoothies.',
  },
  {
    name: 'Handloom Silk Saree',
    subtitle: 'Traditional Indian Weave',
    categorySlug: 'textiles-fashion',
    categoryType: 'Textiles & Fashion',
    region: 'Tamil Nadu',
    productType: 'Retail',
    certifications: ['Handmade', 'GI Tagged'],
    tags: ['Handmade', 'GI Tagged'],
    priceINR: 6999,
    priceUSD: 85,
    stock: 40,
    soldCount: 300,
    ratingAvg: 4.7,
    reviewCount: 80,
    isFeatured: true,
    description:
      'A beautiful handloom silk saree representing the traditional craftsmanship of Indian artisans.',
    benefits: [
      'Handwoven craftsmanship',
      'Traditional design',
      'Premium silk fabric',
      'Made by skilled artisans',
    ],
    usage: 'Suitable for festivals, weddings, celebrations and traditional occasions.',
  },
  {
    name: 'Handcrafted Wooden Decor',
    subtitle: 'Artisan Made',
    categorySlug: 'handicrafts',
    categoryType: 'Handicrafts',
    region: 'Rajasthan',
    productType: 'Retail',
    certifications: ['Handmade'],
    tags: ['Handmade', 'Eco-Friendly'],
    priceINR: 3699,
    priceUSD: 45,
    stock: 80,
    soldCount: 250,
    ratingAvg: 4.5,
    reviewCount: 60,
    isFeatured: false,
    description:
      'Beautiful handcrafted wooden decor made by skilled Indian artisans using traditional techniques.',
    benefits: [
      'Handcrafted',
      'Artisan made',
      'Traditional Indian design',
      'Eco-friendly material',
    ],
    usage: 'Perfect for living rooms, bedrooms, offices and decorative spaces.',
  },
  {
    name: 'Aromatherapy Essential Oils',
    subtitle: 'Natural Wellness',
    categorySlug: 'wellness-ayurveda',
    categoryType: 'Wellness & Ayurveda',
    region: 'Kerala',
    productType: 'Retail',
    certifications: ['Organic'],
    tags: ['Organic', 'Natural'],
    priceINR: 1799,
    priceUSD: 22,
    stock: 100,
    soldCount: 600,
    ratingAvg: 4.8,
    reviewCount: 110,
    isFeatured: true,
    description:
      'Natural essential oils carefully selected for a relaxing and refreshing aromatherapy experience.',
    benefits: [
      'Natural ingredients',
      'Relaxing aroma',
      'Suitable for aromatherapy',
      'Premium quality',
    ],
    usage: 'Use in a diffuser or as recommended for aromatherapy applications.',
  },
  {
    name: 'Traditional Pottery Set',
    subtitle: 'Handcrafted by Artisans',
    categorySlug: 'art-cultural',
    categoryType: 'Art & Cultural Products',
    region: 'Gujarat',
    productType: 'Retail',
    certifications: ['Handmade'],
    tags: ['Handmade', 'Eco-Friendly'],
    priceINR: 2899,
    priceUSD: 35,
    stock: 60,
    soldCount: 280,
    ratingAvg: 4.7,
    reviewCount: 75,
    isFeatured: false,
    description:
      'Traditional Indian pottery crafted by local artisans using time-honoured techniques.',
    benefits: ['Handcrafted', 'Traditional design', 'Artisan made', 'Eco-friendly'],
    usage: 'Ideal for home decoration, serving and cultural displays.',
  },
  {
    name: 'Organic Green Tea',
    subtitle: 'Refreshing & Healthy',
    categorySlug: 'food-beverages',
    categoryType: 'Food & Beverages',
    region: 'Assam',
    productType: 'Retail',
    certifications: ['Organic'],
    tags: ['Organic', 'Natural'],
    priceINR: 1249,
    priceUSD: 15,
    stock: 180,
    soldCount: 500,
    ratingAvg: 4.6,
    reviewCount: 95,
    isFeatured: false,
    description:
      'Fresh and aromatic organic green tea sourced from Indian tea-growing regions.',
    benefits: ['Organic tea leaves', 'Fresh aroma', 'Refreshing taste', 'Premium quality'],
    usage: 'Brew with hot water and enjoy as a refreshing daily beverage.',
  },
  {
    name: 'Natural Herbal Wellness Pack',
    subtitle: 'Ayurvedic Wellness',
    categorySlug: 'wellness-ayurveda',
    categoryType: 'Wellness & Ayurveda',
    region: 'Kerala',
    productType: 'Retail',
    certifications: ['Natural'],
    tags: ['Natural', 'Wellness'],
    priceINR: 2299,
    priceUSD: 28,
    stock: 90,
    soldCount: 350,
    ratingAvg: 4.7,
    reviewCount: 88,
    isFeatured: false,
    description:
      'A carefully selected wellness collection inspired by traditional Indian natural practices.',
    benefits: [
      'Natural ingredients',
      'Traditional wellness',
      'Premium quality',
      'Carefully selected',
    ],
    usage: 'Use according to the instructions provided with individual products.',
  },
  {
    name: 'Handmade Cotton Textile',
    subtitle: 'Natural Handwoven Fabric',
    categorySlug: 'textiles-fashion',
    categoryType: 'Textiles & Fashion',
    region: 'Maharashtra',
    productType: 'Retail',
    certifications: ['Handmade'],
    tags: ['Handmade', 'Natural'],
    priceINR: 4499,
    priceUSD: 55,
    stock: 70,
    soldCount: 220,
    ratingAvg: 4.6,
    reviewCount: 70,
    isFeatured: false,
    description: 'Traditional handwoven cotton textile made by skilled Indian artisans.',
    benefits: ['Handwoven', 'Natural fabric', 'Comfortable', 'Artisan made'],
    usage: 'Suitable for clothing, home textiles and traditional craft applications.',
  },
  {
    name: 'Eco-Friendly Bamboo Product',
    subtitle: 'Sustainable Lifestyle',
    categorySlug: 'eco-friendly',
    categoryType: 'Eco-Friendly Products',
    region: 'Assam',
    productType: 'Retail',
    certifications: ['Eco-Friendly'],
    tags: ['Eco-Friendly', 'Sustainable'],
    priceINR: 2499,
    priceUSD: 30,
    stock: 110,
    soldCount: 180,
    ratingAvg: 4.7,
    reviewCount: 65,
    isFeatured: false,
    description:
      'A sustainable bamboo product made with care to support eco-friendly living and local craftsmanship.',
    benefits: ['Sustainable material', 'Eco-friendly', 'Reusable', 'Artisan crafted'],
    usage: 'Perfect for everyday household and lifestyle use.',
  },
  {
    name: 'Traditional Spice Box',
    subtitle: 'Indian Kitchen Essential',
    categorySlug: 'home-lifestyle',
    categoryType: 'Home & Lifestyle',
    region: 'Rajasthan',
    productType: 'Retail',
    certifications: ['Handmade'],
    tags: ['Handmade', 'Traditional'],
    priceINR: 3299,
    priceUSD: 40,
    stock: 95,
    soldCount: 450,
    ratingAvg: 4.8,
    reviewCount: 105,
    isFeatured: true,
    description:
      'A traditional Indian spice box designed to keep your everyday spices organised and accessible.',
    benefits: [
      'Traditional Indian design',
      'Handcrafted',
      'Useful kitchen accessory',
      'Durable construction',
    ],
    usage: 'Use to store and organise your everyday cooking spices.',
  },
];

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI to the intended isolated seed database.');
  const targetDatabase = new URL(process.env.MONGO_URI).pathname.replace(/^\//, '');
  if (!targetDatabase || process.env.SEED_CONFIRM_DATABASE !== targetDatabase) {
    throw new Error(`Seed refused. Set SEED_CONFIRM_DATABASE to the exact target database name (${targetDatabase || 'missing'}).`);
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding.');
  }
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  let admin = await User.findOne({ email: adminEmail }).select('+password');
  if (!admin) {
    admin = await User.create({
      name: 'Halla Bol Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '',
    });
    console.log(`Created admin: ${adminEmail}`);
  } else {
    if (admin.role !== 'admin') {
      throw new Error('The configured seed email already exists but is not an administrator. No role or password was changed.');
    }
    console.log(`Administrator already exists; password and account status were left unchanged: ${adminEmail}`);
  }

  const categoryMap = {};
  for (const cat of categoriesData) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { ...cat, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryMap[cat.slug] = doc._id;
  }
  console.log(`Upserted ${categoriesData.length} categories`);

  await Settings.findOneAndUpdate(
    { key: 'site' },
    {
      key: 'site',
      shipping: {
        INR: { domestic: 49, freeAbove: 999, international: 499 },
        USD: { domestic: 5, freeAbove: 50, international: 15 },
      },
      codEnabled: true,
      codCountries: ['India', 'IN'],
      tax: { INR: 0, USD: 0 },
      currencies: ['INR', 'USD'],
      storeName: 'Halla Bol',
      contact: {
        email: 'hello@hallabol.com',
        phone: '+91 98765 43210',
        address: 'India',
      },
      lowStockThreshold: 10,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Upserted site settings');

  await Coupon.findOneAndUpdate(
    { code: 'HALLABOL10' },
    {
      code: 'HALLABOL10',
      type: 'percent',
      value: 10,
      currency: 'ANY',
      minOrder: 0,
      maxDiscount: null,
      usageLimit: null,
      isActive: true,
      expiresAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Coupon.findOneAndUpdate(
    { code: 'WELCOME50' },
    {
      code: 'WELCOME50',
      type: 'fixed',
      value: 50,
      currency: 'INR',
      minOrder: 499,
      maxDiscount: null,
      usageLimit: 1000,
      isActive: true,
      expiresAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Upserted coupons HALLABOL10, WELCOME50');

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const docs = productsData.map((p, idx) => {
      const image = productImage(idx + 1);
      return {
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        benefits: p.benefits,
        usage: p.usage,
        category: categoryMap[p.categorySlug],
        categoryType: p.categoryType,
        region: p.region,
        productType: p.productType,
        certifications: p.certifications,
        tags: p.tags,
        image,
        images: [image],
        priceINR: p.priceINR,
        priceUSD: p.priceUSD,
        oldPriceINR: p.oldPriceINR ?? null,
        oldPriceUSD: p.oldPriceUSD ?? null,
        stock: p.stock,
        soldCount: p.soldCount,
        ratingAvg: p.ratingAvg,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isActive: true,
      };
    });

    await Product.insertMany(docs);
    console.log(`Seeded ${docs.length} products (independent INR/USD list prices)`);
  } else {
    console.log(`Skipped products seed (${productCount} products already exist)`);
  }

  console.log('Seed completed successfully');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
