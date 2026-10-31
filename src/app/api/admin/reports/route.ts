import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getOrders, getProducts } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format'); // 'csv' or 'json'

    const orders = await getOrders();
    const products = await getProducts({ onlyActive: false });

    // Filter valid sales
    const validOrders = orders.filter(
      (o) => (o.paymentStatus === 'paid' || o.paymentMethod === 'cod') && o.orderStatus !== 'Cancelled'
    );

    if (format === 'csv') {
      // Generate CSV file content
      const headers = ['Order Number', 'Date', 'Customer Name', 'Customer Email', 'Items Count', 'Subtotal', 'Tax', 'Shipping', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status'];
      const rows = validOrders.map((o) => [
        o.orderNumber,
        new Date(o.createdAt).toISOString().split('T')[0],
        `"${o.customerName}"`,
        o.customerEmail,
        o.items.reduce((s, it) => s + it.quantity, 0),
        o.subtotal,
        o.tax,
        o.shippingCost,
        o.totalAmount,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="voltx_sales_report_${Date.now()}.csv"`,
        },
      });
    }

    // JSON summary breakdown
    const now = Date.now();
    const dayAgo = now - 86400000;
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;
    const yearAgo = now - 365 * 86400000;

    const dailySales = validOrders
      .filter((o) => new Date(o.createdAt).getTime() >= dayAgo)
      .reduce((s, o) => s + o.totalAmount, 0);

    const weeklySales = validOrders
      .filter((o) => new Date(o.createdAt).getTime() >= weekAgo)
      .reduce((s, o) => s + o.totalAmount, 0);

    const monthlySales = validOrders
      .filter((o) => new Date(o.createdAt).getTime() >= monthAgo)
      .reduce((s, o) => s + o.totalAmount, 0);

    const annualRevenue = validOrders
      .filter((o) => new Date(o.createdAt).getTime() >= yearAgo)
      .reduce((s, o) => s + o.totalAmount, 0);

    return NextResponse.json({
      success: true,
      report: {
        dailySales,
        weeklySales,
        monthlySales,
        annualRevenue,
        totalOrdersCount: validOrders.length,
        averageOrderValue: validOrders.length > 0 ? Math.round(annualRevenue / validOrders.length) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
