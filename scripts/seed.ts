import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env.local without external dotenv dependency
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@voltx.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminVoltX2025!';

async function seedDatabase() {
  console.log('⚡ Starting VOLTX Database Seed Script...');

  if (!MONGODB_URI) {
    console.log('⚠️  No MONGODB_URI set in environment. Running in stand-alone verification mode.');
    console.log('   The application will automatically use its internal persistent memory store.');
    console.log('   To seed live MongoDB Atlas, add your MONGODB_URI to .env.local and rerun npm run seed.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas Cloud Database.');

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database handle unavailable');

    // 1. Seed Admin User
    const usersCollection = db.collection('users');
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!existingAdmin) {
      await usersCollection.insertOne({
        name: 'VoltX Administrator',
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: 'ADMIN',
        phone: '+91 98765 43210',
        addresses: [
          {
            street: '100 Volt Boulevard, Tech District',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India',
            isDefault: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`👤 Created Admin Account: ${ADMIN_EMAIL}`);
    } else {
      console.log(`👤 Admin Account (${ADMIN_EMAIL}) already exists.`);
    }

    // 2. Seed Customer User
    const existingCustomer = await usersCollection.findOne({ email: 'alex@voltx.com' });
    if (!existingCustomer) {
      const customerHash = await bcrypt.hash('Customer123!', 10);
      await usersCollection.insertOne({
        name: 'Alex Vance',
        email: 'alex@voltx.com',
        passwordHash: customerHash,
        role: 'CUSTOMER',
        phone: '+91 98111 22334',
        addresses: [
          {
            street: '42 Cyber Street, Silicon Park',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            isDefault: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('👤 Created Demo Customer: alex@voltx.com');
    }

    // 3. Seed Products
    const productsCollection = db.collection('products');
    const existingProductsCount = await productsCollection.countDocuments();

    if (existingProductsCount === 0) {
      const sampleProducts = [
        {
          name: 'VoltX Original Neon',
          slug: 'voltx-original-neon',
          description: 'The definitive electric energy catalyst with bio-available caffeine and electrolyte surge matrix.',
          price: 149,
          originalPrice: 199,
          image: '/images/voltx-original.png',
          images: ['/images/voltx-original.png'],
          category: 'Classic',
          flavour: 'Electric Neon Lime',
          size: '500ml Can',
          SKU: 'VX-NRG-001',
          stock: 245,
          isFeatured: true,
          isActive: true,
          caffeineMg: 160,
          calories: 15,
          rating: 4.9,
          numReviews: 128,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VoltX Cyber Berry',
          slug: 'voltx-cyber-berry',
          description: 'Dark raspberries, acai, and wild blueberries. Zero sugar, natural green tea extract for neural focus.',
          price: 159,
          originalPrice: 199,
          image: '/images/voltx-cyber-berry.png',
          images: ['/images/voltx-cyber-berry.png'],
          category: 'Zero Sugar',
          flavour: 'Wild Cyber Berry',
          size: '500ml Can',
          SKU: 'VX-BER-002',
          stock: 180,
          isFeatured: true,
          isActive: true,
          caffeineMg: 180,
          calories: 0,
          rating: 4.8,
          numReviews: 94,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VoltX Electric Citrus',
          slug: 'voltx-electric-citrus',
          description: 'High-voltage Japanese yuzu and crisp lime overdrive. Formulated with maximum electrolyte osmolarity.',
          price: 159,
          originalPrice: 199,
          image: '/images/voltx-electric-citrus.png',
          images: ['/images/voltx-electric-citrus.png'],
          category: 'High-Volt',
          flavour: 'Yuzu & Lime Overdrive',
          size: '500ml Can',
          SKU: 'VX-CIT-003',
          stock: 120,
          isFeatured: true,
          isActive: true,
          caffeineMg: 200,
          calories: 25,
          rating: 4.9,
          numReviews: 67,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VoltX Arctic Frost',
          slug: 'voltx-arctic-frost',
          description: 'Sub-zero glacier peppermint chill with zero sugar and ultra-pure Himalayan mineral salts.',
          price: 159,
          originalPrice: 199,
          image: '/images/voltx-arctic-frost.png',
          images: ['/images/voltx-arctic-frost.png'],
          category: 'Zero Sugar',
          flavour: 'Glacier Peppermint Freeze',
          size: '500ml Can',
          SKU: 'VX-ARC-004',
          stock: 88,
          isFeatured: false,
          isActive: true,
          caffeineMg: 160,
          calories: 0,
          rating: 4.7,
          numReviews: 42,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VoltX Midnight Voltage',
          slug: 'voltx-midnight-voltage',
          description: 'Stealth edition formulated for late-night creators and gamers with Alpha-GPC and 220mg caffeine.',
          price: 169,
          originalPrice: 219,
          image: '/images/voltx-midnight.png',
          images: ['/images/voltx-midnight.png'],
          category: 'High-Volt',
          flavour: 'Dark Blackberry Stealth',
          size: '500ml Can',
          SKU: 'VX-MID-005',
          stock: 9,
          isFeatured: true,
          isActive: true,
          caffeineMg: 220,
          calories: 10,
          rating: 5.0,
          numReviews: 89,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VoltX Hyper Pack 12x',
          slug: 'voltx-hyper-pack-12x',
          description: 'The collector variety pack containing 12 premium cans across all signature flavors.',
          price: 1599,
          originalPrice: 1999,
          image: '/images/voltx-original.png',
          images: ['/images/voltx-original.png'],
          category: 'Variety Pack',
          flavour: 'Variety Box (All Flavours)',
          size: '12x 500ml Pack',
          SKU: 'VX-BOX-012',
          stock: 45,
          isFeatured: true,
          isActive: true,
          caffeineMg: 180,
          calories: 12,
          rating: 4.9,
          numReviews: 156,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await productsCollection.insertMany(sampleProducts);
      console.log(`📦 Seeded ${sampleProducts.length} VOLTX product variants.`);
    }

    // 4. Seed Coupons
    const couponsCollection = db.collection('coupons');
    const existingCouponsCount = await couponsCollection.countDocuments();
    if (existingCouponsCount === 0) {
      await couponsCollection.insertMany([
        {
          code: 'VOLT20',
          discountPercent: 20,
          minSpend: 299,
          isActive: true,
          createdAt: new Date(),
        },
        {
          code: 'ENERGY100',
          discountAmount: 100,
          minSpend: 499,
          isActive: true,
          createdAt: new Date(),
        },
      ]);
      console.log('🏷️  Seeded promotional coupons.');
    }

    console.log('✨ Seed completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
