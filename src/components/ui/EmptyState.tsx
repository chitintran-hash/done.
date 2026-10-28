import React, { ReactNode } from 'react';
import { Package, ShoppingBag, Bookmark, ShieldCheck, ArrowRight, LucideIcon } from 'lucide-react';

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
      className={`bg-[#FFFCF8] rounded-3xl border border-dashed border-[#EADFE4] p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 animate-fade-in ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-[#F2E8F0] text-[#68415F] mx-auto flex items-center justify-center shadow-xs">
        <Icon className="w-8 h-8 text-[#A15C78]" />
      </div>

      <div className="space-y-1">
        {badge && (
          <span className="text-[10px] font-black uppercase text-[#A15C78] tracking-widest block">
            {badge}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-black text-[#211A22]">{title}</h3>
        <p className="text-xs text-[#756871] max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#68415F] to-[#A15C78] hover:from-[#3A2438] hover:to-[#68415F] text-white font-bold text-xs shadow-md shadow-[#68415F]/20 transition active:scale-95 cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
