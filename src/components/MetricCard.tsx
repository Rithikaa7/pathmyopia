import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeColor?: 'teal' | 'blue' | 'emerald' | 'amber' | 'slate' | 'forest' | 'copper';
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
    teal: 'bg-[#86A89B]/10 text-[#587B6E] border-[#86A89B]/30',
    blue: 'bg-[#254E43]/10 text-[#254E43] border-[#254E43]/30',
    forest: 'bg-[#254E43]/10 text-[#254E43] border-[#254E43]/30',
    copper: 'bg-[#B97854]/10 text-[#B97854] border-[#B97854]/30',
    emerald: 'bg-[#254E43]/10 text-[#254E43] border-[#254E43]/30',
    amber: 'bg-[#B97854]/10 text-[#B97854] border-[#B97854]/30',
    slate: 'bg-white/80 text-[#777B76] border-[#DADBD3]',
  }[badgeColor];

  return (
    <div
      className={`bg-white/80 rounded-xs p-5 border border-[#DADBD3] hover:border-[#777B76] transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#777B76]">
              {label}
            </span>
            {tooltip && (
              <span className="cursor-help text-[#777B76] hover:text-[#171A19]" title={tooltip}>
                <Info className="w-3 h-3" />
              </span>
            )}
          </div>
          {Icon && (
            <div className="p-1.5 rounded-xs bg-[#F5F3ED] text-[#254E43] border border-[#DADBD3]">
              <Icon className="w-3.5 h-3.5 text-[#254E43]" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-mono font-medium text-[#171A19] tracking-tight">
            {value}
          </div>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs border ${badgeClasses}`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <p className="mt-4 pt-2.5 border-t border-[#DADBD3]/60 text-xs text-[#777B76] leading-normal font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
};
