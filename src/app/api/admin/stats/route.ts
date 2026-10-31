import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDashboardMetrics, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const metrics = await getDashboardMetrics();
    const recentOrders = await getOrders({ limit: 6 });

    return NextResponse.json({
      success: true,
      metrics,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
