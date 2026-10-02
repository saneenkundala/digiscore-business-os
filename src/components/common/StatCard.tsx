import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: ReactNode;
  subtitle?: string;
  gradient?: 'purple' | 'pink' | 'blue' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  gradient = 'purple',
  onClick
}) => {
  const gradientClasses = {
    purple: 'from-purple-600/20 via-violet-600/10 to-transparent border-purple-500/20 text-purple-400',
    pink: 'from-fuchsia-600/20 via-pink-600/10 to-transparent border-pink-500/20 text-pink-400',
    blue: 'from-blue-600/20 via-cyan-600/10 to-transparent border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-600/20 via-teal-600/10 to-transparent border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-600/20 via-orange-600/10 to-transparent border-amber-500/20 text-amber-400'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl glass-panel p-5 border transition-all duration-300 hover:scale-[1.01] hover:border-fuchsia-500/40 hover:shadow-card-dark',
        onClick && 'cursor-pointer'
      )}
    >
      <div className={cn('absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br blur-2xl opacity-40 group-hover:opacity-70 transition-opacity', gradientClasses[gradient])} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div
          className={cn(
            'p-2.5 rounded-xl border bg-slate-900/60 transition-transform group-hover:scale-110',
            gradientClasses[gradient]
          )}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-rose-400 bg-rose-500/10'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
