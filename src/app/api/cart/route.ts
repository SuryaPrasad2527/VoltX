import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getCartByUserId, saveCartByUserId, getProductById } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ items: [] });
    }

    const cart = await getCartByUserId(session.id);

    // Populate products to attach latest price and stock
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await getProductById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product: product || undefined,
        };
      })
    );

    return NextResponse.json({ success: true, items: populatedItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    // Validate quantities against stock
    for (const item of items) {
      const product = await getProductById(item.productId);
      if (product && item.quantity > product.stock) {
        return NextResponse.json(
          {
            error: `Cannot add ${item.quantity} units of ${product.name}. Only ${product.stock} in stock.`,
          },
          { status: 400 }
        );
      }
    }

    const updated = await saveCartByUserId(session.id, items);
    return NextResponse.json({ success: true, cart: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
