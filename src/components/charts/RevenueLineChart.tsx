'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueLineChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-zinc-500 text-xs">
        No revenue data recorded for this date period.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111713',
              borderColor: '#1f2a22',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`₹${val}`, 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#B7FF32"
            strokeWidth={3}
            dot={{ fill: '#080B09', stroke: '#B7FF32', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#B7FF32' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
