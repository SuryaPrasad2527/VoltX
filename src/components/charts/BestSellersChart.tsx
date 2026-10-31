'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BestSellersChartProps {
  data: Array<{ name: string; units: number }>;
}

export function BestSellersChart({ data }: BestSellersChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-zinc-500 text-xs">
        No sales data recorded yet.
      </div>
    );
  }

  // Shorten product names for the axis
  const formattedData = data.map((d) => ({
    ...d,
    shortName: d.name.replace('VoltX ', ''),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a22" horizontal={false} />
          <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
          <YAxis
            type="category"
            dataKey="shortName"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111713',
              borderColor: '#1f2a22',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`${val} Cans`, 'Units Sold']}
          />
          <Bar dataKey="units" fill="#B7FF32" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
