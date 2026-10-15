import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeColor?: 'teal' | 'blue' | 'emerald' | 'amber' | 'slate';
  icon?: LucideIcon;
  tooltip?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  badgeColor = 'slate',
  icon: Icon,
  tooltip,
  className = '',
}) => {
  const badgeClasses = {
    teal: 'bg-primary/10 text-primary border-primary/20',
    blue: 'bg-secondary/10 text-secondary border-secondary/20',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[badgeColor];

  return (
    <div
      className={`bg-card rounded-xl p-5 border border-slate-200/90 shadow-card hover:shadow-hover transition-all duration-150 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {label}
            </span>
            {tooltip && (
              <span className="cursor-help text-slate-400 hover:text-slate-600" title={tooltip}>
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          {Icon && (
            <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
              <Icon className="w-4 h-4 text-slate-700" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
            {value}
          </div>
          {badge && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeClasses}`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <p className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 leading-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
