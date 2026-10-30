import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#E4E8F0]/60 rounded-xl ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-[#E4E8F0] p-5 space-y-4 shadow-xs ${className}`}>
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
  <div className={`bg-white rounded-3xl border border-[#E4E8F0] p-5 sm:p-6 space-y-4 shadow-xs ${className}`}>
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
    <div className="bg-[#F6F7FC] p-3.5 rounded-2xl space-y-2.5 border border-[#E4E8F0]">
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
  <div className={`bg-white rounded-2xl border border-[#E4E8F0] p-4 sm:p-5 space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-4 w-16 rounded-md" />
      </div>
      <SkeletonBox className="h-5 w-20 rounded-full" />
    </div>
    <div className="flex items-center gap-3 py-1">
      <SkeletonBox className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBox className="h-4 w-4/5" />
        <SkeletonBox className="h-3 w-2/5" />
      </div>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-[#E4E8F0]">
      <SkeletonBox className="h-4 w-28" />
      <SkeletonBox className="h-6 w-20 rounded-lg" />
    </div>
  </div>
);

export const SkeletonMapCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-4 border border-[#E4E8F0] space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-3 w-20" />
      <SkeletonBox className="h-4 w-12 rounded-full" />
    </div>
    <SkeletonBox className="h-5 w-3/4" />
    <div className="flex items-center gap-2">
      <SkeletonBox className="h-5 w-24" />
      <SkeletonBox className="h-4 w-16" />
    </div>
    <div className="flex gap-2 pt-2">
      <SkeletonBox className="h-8 flex-1 rounded-xl" />
      <SkeletonBox className="h-8 flex-1 rounded-xl" />
    </div>
  </div>
);
