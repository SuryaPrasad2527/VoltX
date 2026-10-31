import { NextRequest, NextResponse } from 'next/server';
import { getCouponByCode } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minSpend} required for this coupon` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(coupon.discountAmount, subtotal);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount,
        description: coupon.discountPercent
          ? `${coupon.discountPercent}% OFF`
          : `₹${coupon.discountAmount} OFF`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
