import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateOrderPaymentStatus, updateOrderStatus } from '@/lib/db';
import crypto from 'crypto';

const key_secret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isDemoMode,
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (isDemoMode) {
      // Demo mode payment confirmation
      await updateOrderPaymentStatus(orderId, 'paid', 'demo');
      await updateOrderStatus(orderId, 'Confirmed');
      return NextResponse.json({
        success: true,
        mode: 'demo',
        message: 'Demo payment simulated successfully',
      });
    }

    // Real Razorpay signature verification
    if (key_secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        await updateOrderPaymentStatus(orderId, 'failed');
        return NextResponse.json({ error: 'Invalid payment signature verification' }, { status: 400 });
      }

      await updateOrderPaymentStatus(orderId, 'paid', 'razorpay');
      await updateOrderStatus(orderId, 'Confirmed');

      return NextResponse.json({
        success: true,
        mode: 'razorpay_verified',
        message: 'Payment verified and captured successfully',
      });
    }

    return NextResponse.json({ error: 'Incomplete payment verification payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
