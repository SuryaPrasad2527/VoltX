import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  subtext?: string;
  icon: any;
  accentColor?: string;
}

export function KpiCard({
  title,
  value,
  changePercent,
  subtext = 'vs. previous period',
  icon: Icon,
  accentColor = '#B7FF32',
}: KpiCardProps) {
  const isPositive = (changePercent || 0) >= 0;

  return (
    <div className="p-6 rounded-2xl bg-volt-card border border-volt-border hover:border-volt-accent/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] group flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
            color: accentColor,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <span className="text-3xl font-black uppercase tracking-tight text-white block">
          {value}
        </span>

        {changePercent !== undefined && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {isPositive ? '+' : ''}
              {changePercent}%
            </span>
            <span className="text-zinc-500 text-[11px]">{subtext}</span>
          </div>
        )}
      </div>
    </div>
  );
}
