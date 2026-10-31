import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getOrderById, updateOrderStatus, updateOrderPaymentStatus } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Role check: Admin can view any order, customer can only view their own
    if (session.role !== 'ADMIN' && order.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { orderStatus, paymentStatus } = await req.json();

    // Only admin can change order status or mark as shipped/delivered
    // Customer can only cancel their order if it's still 'Pending' or 'Confirmed'
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN') {
      if (order.userId !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (orderStatus === 'Cancelled') {
        if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
          return NextResponse.json(
            { error: 'Cannot cancel an order that has already shipped or been delivered' },
            { status: 400 }
          );
        }
        const updated = await updateOrderStatus(id, 'Cancelled');
        return NextResponse.json({ success: true, order: updated });
      }

      return NextResponse.json({ error: 'Only admins can update order processing status' }, { status: 403 });
    }

    let updated = order;
    if (orderStatus) {
      updated = (await updateOrderStatus(id, orderStatus)) || updated;
    }
    if (paymentStatus) {
      updated = (await updateOrderPaymentStatus(id, paymentStatus)) || updated;
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
