import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const sizeMap = {
    sm: { text: 'text-xl', icon: 'w-6 h-6', sub: 'text-[9px]' },
    md: { text: 'text-2xl', icon: 'w-8 h-8', sub: 'text-[10px]' },
    lg: { text: 'text-4xl', icon: 'w-11 h-11', sub: 'text-xs' },
    xl: { text: 'text-5xl', icon: 'w-14 h-14', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group tracking-wider ${className}`}>
      {/* Dynamic Lightning X Logo Icon */}
      <div className={`relative flex items-center justify-center ${current.icon} rounded-lg bg-black border border-volt-border group-hover:border-volt-accent transition-all duration-300 shadow-[0_0_15px_rgba(183,255,50,0.15)] group-hover:shadow-[0_0_20px_rgba(183,255,50,0.4)]`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 transform group-hover:scale-105 transition-transform"
        >
          {/* Bold stylized X limbs */}
          <path
            d="M20 20 L42 50 L20 80"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M80 20 L58 50 L80 80"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Electric Neon Lightning Bolt in Center */}
          <path
            d="M52 14 L36 50 H52 L46 86 L68 46 H50 Z"
            fill="#B7FF32"
            filter="drop-shadow(0 0 6px #B7FF32)"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`font-black uppercase tracking-tighter text-white ${current.text}`}>
            VOLT
          </span>
          <span className={`font-black uppercase tracking-tighter text-volt-accent ${current.text} drop-shadow-[0_0_12px_rgba(183,255,50,0.6)]`}>
            X
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-semibold tracking-[0.25em] text-volt-muted uppercase ${current.sub} -mt-1 group-hover:text-volt-accent transition-colors`}>
            Energy Drink
          </span>
        )}
      </div>
    </Link>
  );
}
