import React from 'react';

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  variant?: 'white' | 'warm' | 'accent' | 'blue';
  className?: string;
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  badge,
  variant = 'white',
  className = '',
  onClick,
}) => {
  const variantStyles = {
    white: 'bg-white border-light-border text-neutral-text hover:border-blue-300 shadow-sm',
    warm: 'bg-amber-50/70 border-amber-200/80 text-neutral-text hover:border-amber-300 shadow-sm',
    accent: 'bg-blue-50/70 border-blue-200 text-neutral-text hover:border-blue-300 shadow-sm',
    blue: 'bg-[#EFFBFF]/60 border-indigo-200 text-neutral-text hover:border-indigo-300 shadow-sm',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border transition-all duration-200 ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 text-blue-600">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
              {title}
            </h4>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-text leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
