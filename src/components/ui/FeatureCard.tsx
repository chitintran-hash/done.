import React from 'react';

interface FeatureCardProps {
  stepNumber?: string | number;
  icon?: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  stepNumber,
  icon,
  title,
  description,
  tag,
  className = '',
}) => {
  return (
    <div
      className={`relative bg-white rounded-3xl p-6 sm:p-7 border border-light-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {icon ? (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform duration-300">
              {icon}
            </div>
          ) : stepNumber ? (
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
              {stepNumber}
            </div>
          ) : null}

          {tag && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
              {tag}
            </span>
          )}
        </div>

        <h3 className="text-base font-black text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-neutral-text leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Tìm hiểu thêm &rarr;</span>
      </div>
    </div>
  );
};
