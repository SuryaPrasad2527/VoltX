import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Check if real Razorpay keys are configured
    if (key_id && key_secret) {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: Math.round(amount * 100), // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        success: true,
        mode: 'razorpay_live_test',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
      });
    }

    // Safe labeled Demo Checkout Mode
    return NextResponse.json({
      success: true,
      mode: 'demo_checkout',
      orderId: `demo_order_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: 'demo_key_voltx',
      notice: 'Demo Checkout Mode active: No real payment gateway keys configured in environment.',
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
