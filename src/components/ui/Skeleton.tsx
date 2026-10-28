import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#EADFE4]/50 rounded-xl ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-5 space-y-4 shadow-xs ${className}`}>
    <div className="flex items-center gap-3">
      <SkeletonBox className="w-12 h-12 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonBox className="h-24 w-full rounded-2xl" />
    <div className="flex items-center justify-between pt-2">
      <SkeletonBox className="h-5 w-24" />
      <SkeletonBox className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

export const SkeletonRoom: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-5 sm:p-6 space-y-4 shadow-xs ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SkeletonBox className="w-8 h-8 rounded-xl" />
        <SkeletonBox className="h-4 w-28" />
      </div>
      <SkeletonBox className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <SkeletonBox className="h-5 w-4/5" />
      <SkeletonBox className="h-3 w-3/5" />
    </div>
    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl space-y-2.5">
      <div className="flex justify-between">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-4 w-24" />
      </div>
      <SkeletonBox className="h-2.5 w-full rounded-full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <SkeletonBox className="h-6 w-32" />
      <SkeletonBox className="h-10 w-28 rounded-xl" />
    </div>
  </div>
);

export const SkeletonOrder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#FFFCF8] rounded-2xl border border-[#EADFE4] p-4 sm:p-5 space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-4 w-16 rounded-md" />
      </div>
      <SkeletonBox className="h-5 w-20 rounded-full" />
    </div>
    <div className="flex items-center gap-3 py-1">
      <SkeletonBox className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBox className="h-4 w-3/5" />
        <SkeletonBox className="h-3 w-2/5" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-[#EADFE4]/60">
      <SkeletonBox className="h-4 w-28" />
      <SkeletonBox className="h-5 w-24" />
    </div>
  </div>
);

export const SkeletonMap: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-full rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EADFE4] flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#F2E8F0]/30 to-[#FAF8F5] animate-pulse" />
    <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#68415F]/10 flex items-center justify-center animate-bounce">
        <div className="w-6 h-6 rounded-full border-2 border-[#68415F] border-t-transparent animate-spin" />
      </div>
      <div className="text-xs font-bold text-[#68415F] uppercase tracking-wider">
        ĐANG TẢI BẢN ĐỒ FLASHMAP...
      </div>
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#FFFCF8] rounded-2xl border border-[#EADFE4] p-5 space-y-2">
          <SkeletonBox className="h-3 w-1/2" />
          <SkeletonBox className="h-7 w-3/4" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-6 space-y-4">
        <SkeletonBox className="h-5 w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3].map((j) => (
            <SkeletonBox key={j} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-6 space-y-4">
        <SkeletonBox className="h-5 w-1/3" />
        <SkeletonBox className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);
