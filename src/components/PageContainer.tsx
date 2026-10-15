import React from 'react';
import { ResearchDisclaimer } from './ResearchDisclaimer';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  showDisclaimer?: boolean;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  badge,
  action,
  showDisclaimer = true,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header section if title provided */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DADBD3]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#171A19] tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm text-[#777B76] font-sans leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}

      {/* Main content */}
      <div>{children}</div>

      {/* Persistent Research Disclaimer */}
      {showDisclaimer && (
        <div className="pt-6">
          <ResearchDisclaimer />
        </div>
      )}
    </div>
  );
};
