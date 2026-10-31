'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OrdersBarChartProps {
  data: Array<{ date: string; orders: number }>;
}

export function OrdersBarChart({ data }: OrdersBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-zinc-500 text-xs">
        No orders recorded for this period.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#79D900" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#79D900" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a22" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#1f2a22' }}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111713',
              borderColor: '#1f2a22',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [val, 'Orders Placed']}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#79D900"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#orderGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
