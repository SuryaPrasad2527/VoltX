import {
  findUserByEmail,
  getProducts,
  getDashboardMetrics,
  getAnalyticsChartData,
  createOrder,
  getCouponByCode,
  getOrderById,
  updateOrderStatus,
} from '../src/lib/db';
import { comparePassword, signSessionToken, verifySessionToken } from '../src/lib/auth';

async function runTestSuite() {
  console.log('🧪 ========================================================');
  console.log('🧪 VOLTX INTEGRATION TEST SUITE');
  console.log('🧪 ========================================================');

  // 1. Auth Test
  console.log('\n🔐 Test 1: Administrator & Customer Authentication...');
  const admin = await findUserByEmail('admin@voltx.com');
  if (!admin || admin.role !== 'ADMIN') {
    throw new Error('❌ Admin lookup failed');
  }
  const isMatch = await comparePassword('AdminVoltX2025!', admin.passwordHash);
  if (!isMatch) {
    throw new Error('❌ Admin password hash verification failed');
  }
  const token = await signSessionToken({
    id: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  const decoded = await verifySessionToken(token);
  if (!decoded || decoded.role !== 'ADMIN') {
    throw new Error('❌ JWT verification failed');
  }
  console.log('   ✅ Admin authentication, bcrypt hashing, and JWT tokens verified.');

  // 2. Product Catalog Test
  console.log('\n📦 Test 2: Product Catalog & Flavor Variants...');
  const products = await getProducts();
  if (products.length < 6) {
    throw new Error(`❌ Expected at least 6 products, got ${products.length}`);
  }
  const original = products.find((p) => p.slug === 'voltx-original-neon');
  if (!original || !original.image.includes('voltx-original.png')) {
    throw new Error('❌ VoltX Original Neon product image missing');
  }
  console.log(`   ✅ Loaded ${products.length} product variants with high-res authentic images.`);

  // 3. Coupon Test
  console.log('\n🏷️  Test 3: Promo Coupon Verification...');
  const coupon = await getCouponByCode('VOLT20');
  if (!coupon || coupon.discountPercent !== 20) {
    throw new Error('❌ Coupon VOLT20 verification failed');
  }
  console.log(`   ✅ Coupon ${coupon.code} (20% OFF) verified.`);

  // 4. Order Creation & Atomic Stock Check
  console.log('\n🛒 Test 4: Atomic Stock Check & Order Placement...');
  const stockBefore = original.stock;
  const testOrder = await createOrder({
    userId: 'user-demo-customer',
    customerName: 'Alex Vance',
    customerEmail: 'alex@voltx.com',
    customerPhone: '+91 98111 22334',
    items: [
      {
        productId: original._id,
        name: original.name,
        price: original.price,
        image: original.image,
        quantity: 2,
        size: original.size,
        flavour: original.flavour,
      },
    ],
    shippingAddress: {
      street: '42 Cyber Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    subtotal: original.price * 2,
    discount: 0,
    tax: 15,
    shippingCost: 50,
    totalAmount: original.price * 2 + 15 + 50,
    paymentMethod: 'demo',
    paymentStatus: 'paid',
    orderStatus: 'Confirmed',
  });

  if (!testOrder.orderNumber || !testOrder.trackingNumber) {
    throw new Error('❌ Order creation missing tracking number or order ID');
  }

  const updatedOriginal = (await getProducts()).find((p) => p._id === original._id);
  if (!updatedOriginal || updatedOriginal.stock !== stockBefore - 2) {
    throw new Error('❌ Atomic stock reduction failed');
  }
  console.log(`   ✅ Order ${testOrder.orderNumber} placed. Stock decremented from ${stockBefore} to ${updatedOriginal.stock}.`);

  // 5. Order Tracking & Status Transition
  console.log('\n🚚 Test 5: Order Tracking & Status Transition...');
  const updatedOrder = await updateOrderStatus(testOrder._id, 'Shipped');
  if (!updatedOrder || updatedOrder.orderStatus !== 'Shipped') {
    throw new Error('❌ Order status transition to Shipped failed');
  }
  console.log(`   ✅ Order status transitioned to: ${updatedOrder.orderStatus}`);

  // 6. Admin Metrics & Charts
  console.log('\n📊 Test 6: Admin KPI Metrics & Dynamic Chart Datasets...');
  const metrics = await getDashboardMetrics();
  if (metrics.totalRevenue <= 0 || metrics.totalOrders <= 0) {
    throw new Error('❌ Dashboard metrics calculation returned zero');
  }
  console.log(`   ✅ Total Recognized Revenue: ₹${metrics.totalRevenue.toLocaleString()}`);
  console.log(`   ✅ Total Recognized Orders: ${metrics.totalOrders}`);
  console.log(`   ✅ Average Order Value: ₹${metrics.averageOrderValue}`);
  console.log(`   ✅ Vault Stock: ${metrics.productsInStock} units across inventory`);

  const analytics = await getAnalyticsChartData('30d');
  if (!analytics.timelineData.length || !analytics.bestSellers.length) {
    throw new Error('❌ Analytics timeline or best seller dataset empty');
  }
  console.log(`   ✅ Chart Timelines Generated: ${analytics.timelineData.length} data points.`);
  console.log(`   ✅ Category Breakdown: ${analytics.categoryData.map((c) => `${c.name} (₹${c.value})`).join(', ')}`);
  console.log(`   ✅ Best Sellers: ${analytics.bestSellers.map((b) => `${b.name} (${b.units} units)`).join(', ')}`);

  console.log('\n🎉 ========================================================');
  console.log('🎉 ALL VOLTX FULL-STACK INTEGRATION TESTS PASSED 100%!');
  console.log('🎉 ========================================================\n');
}

runTestSuite().catch((e) => {
  console.error('\n❌ Test Suite Failed:', e);
  process.exit(1);
});
