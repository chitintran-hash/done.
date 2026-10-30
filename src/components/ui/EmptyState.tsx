import React from 'react';
import { Package, ArrowRight, LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package,
  badge,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-dashed border-[#E4E8F0] p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 animate-fade-in relative overflow-hidden ${className}`}
    >
      {/* Subtle artistic abstract background shapes (Requirement 38) */}
      <div className="absolute top-4 left-8 w-20 h-20 rounded-full bg-[#7B3FF2]/15 blur-xl pointer-events-none" />
      <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-[#EEF1FF]/15 blur-xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-3xl bg-[#C7F000]/15 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-[#EEF1FF] text-[#3155FF] mx-auto flex items-center justify-center shadow-xs border border-[#3155FF]/30/40 relative z-10">
          <Icon className="w-8 h-8 text-[#3155FF]" />
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        {badge && (
          <span className="text-[10px] font-black uppercase text-[#3155FF] tracking-widest block">
            {badge}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-black text-[#0C0D10]">{title}</h3>
        <p className="text-xs text-[#596273] max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2 relative z-10">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3155FF] hover:bg-[#3155FF] text-white font-black text-xs shadow-md shadow-[#3155FF]/20 transition active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
