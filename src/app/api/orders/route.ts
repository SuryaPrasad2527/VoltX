import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createOrder, getOrders, getProductById, saveCartByUserId } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;

    // If customer, restrict to their own orders only
    const userId = session.role === 'ADMIN' ? undefined : session.id;

    const orders = await getOrders({
      userId,
      status,
      paymentStatus,
    });

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'You must be logged in to place an order' }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, couponCode, discountAmount } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    // Verify stock and calculate canonical prices on the server
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Only ${product.stock} cans remaining.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        size: product.size,
        flavour: product.flavour,
      });
    }

    const discount = Number(discountAmount) || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(discountedSubtotal * 0.05); // 5% GST/tax
    const shippingCost = discountedSubtotal >= 500 ? 0 : 50; // Free delivery over ₹500
    const totalAmount = discountedSubtotal + tax + shippingCost;

    const order = await createOrder({
      userId: session.id,
      customerName: session.name,
      customerEmail: session.email,
      customerPhone: body.customerPhone || '',
      items: verifiedItems,
      shippingAddress,
      subtotal,
      discount,
      couponCode,
      tax,
      shippingCost,
      totalAmount,
      paymentMethod: paymentMethod || 'demo',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'Confirmed',
    });

    // Clear user cart on successful order
    await saveCartByUserId(session.id, []);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
