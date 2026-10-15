import React from 'react';
import { AlertCircle, FileSearch, RefreshCw, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon: Icon = FileSearch,
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center bg-white/70 rounded-xs border border-dashed border-[#DADBD3] flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F5F3ED] border border-[#DADBD3] flex items-center justify-center text-[#777B76]">
        <Icon className="w-5 h-5 text-[#254E43]" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="font-serif text-base text-[#171A19]">{title}</h4>
        <p className="text-xs text-[#777B76] leading-relaxed font-sans">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#254E43] text-white rounded-xs text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] transition-colors"
        >
          {action.icon && <action.icon className="w-3.5 h-3.5" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing Retinal Photograph...',
  submessage = 'Applying circular crop, LAB CLAHE normalization, and deep feature extraction.',
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center bg-white/80 rounded-xs border border-[#DADBD3] flex flex-col items-center justify-center space-y-3.5 ${className}`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-[#DADBD3] border-t-[#254E43] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-[#254E43] font-bold">
          ViT
        </div>
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="font-serif text-base text-[#171A19]">{message}</h4>
        <p className="text-xs text-[#777B76] leading-relaxed font-sans">{submessage}</p>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Analysis Notice',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-5 bg-[#B97854]/10 border border-[#B97854]/30 rounded-xs flex items-start gap-3 text-xs ${className}`}
    >
      <div className="p-1.5 bg-[#B97854]/20 rounded-xs text-[#B97854] shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#B97854] font-semibold">{title}</h4>
        <p className="text-xs text-[#171A19]/80 leading-relaxed font-sans">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B97854]/40 text-[#B97854] hover:bg-[#F5F3ED] rounded-xs text-[11px] font-mono transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Operation</span>
          </button>
        )}
      </div>
    </div>
  );
};
