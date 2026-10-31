import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getProducts, updateProduct, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const products = await getProducts({ onlyActive: false });
    const orders = await getOrders();

    // Calculate total units sold per product
    const unitsSoldMap: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.orderStatus !== 'Cancelled') {
        o.items.forEach((it) => {
          unitsSoldMap[it.name] = (unitsSoldMap[it.name] || 0) + it.quantity;
        });
      }
    });

    const inventoryList = products.map((p) => {
      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (p.stock === 0) status = 'out_of_stock';
      else if (p.stock < 15) status = 'low_stock';

      return {
        _id: p._id,
        name: p.name,
        SKU: p.SKU,
        category: p.category,
        flavour: p.flavour,
        size: p.size,
        stock: p.stock,
        unitsSold: unitsSoldMap[p.name] || 0,
        status,
        price: p.price,
        image: p.image,
      };
    });

    return NextResponse.json({ success: true, inventory: inventoryList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { productId, stock } = await req.json();

    if (!productId || stock === undefined || isNaN(stock)) {
      return NextResponse.json({ error: 'Invalid productId or stock value' }, { status: 400 });
    }

    const updated = await updateProduct(productId, { stock: Math.max(0, parseInt(stock, 10)) });
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
