import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const all = searchParams.get('all') === 'true'; // Admin view includes inactive products

    const products = await getProducts({
      category,
      search,
      sort,
      onlyActive: !all,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, price, originalPrice, image, images, category, flavour, size, SKU, stock, isFeatured, isActive, caffeineMg, calories } = body;

    if (!name || !slug || !description || price === undefined || !image || !category || !flavour || !SKU) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const created = await createProduct({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image,
      images: images && images.length ? images : [image],
      category,
      flavour,
      size: size || '500ml Can',
      SKU,
      stock: Number(stock) || 0,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      caffeineMg: caffeineMg ? Number(caffeineMg) : 160,
      calories: calories !== undefined ? Number(calories) : 10,
      rating: 5.0,
      numReviews: 0,
    });

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
