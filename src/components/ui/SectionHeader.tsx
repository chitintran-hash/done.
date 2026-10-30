import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  align = 'left',
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 ${
        align === 'center' ? 'text-center sm:text-center justify-center' : ''
      } ${className}`}
    >
      <div className={align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF1FF] border border-[#3155FF]/30 text-[11px] font-black uppercase tracking-wider text-[#0C0D10] mb-2.5 shadow-xs">
            <span>{badge}</span>
          </div>
        )}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0C0D10] uppercase tracking-tight leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#596273] font-normal mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
