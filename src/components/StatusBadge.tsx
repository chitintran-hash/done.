import React from 'react';
import { GroupRoomStatus } from '../types';
import { Clock, Users, CheckCircle2, Lock, XCircle, FileText, Sparkles, Flame, Zap } from 'lucide-react';

export type BadgeVariant =
  | GroupRoomStatus
  | 'near_target'
  | 'popular'
  | 'almost_full'
  | 'new';

interface StatusBadgeProps {
  status: GroupRoomStatus | BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    active: {
      label: 'ĐANG MỞ',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    near_target: {
      label: 'GẦN CHỐT GIÁ TỐT',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />,
    },
    popular: {
      label: 'PHỔ BIẾN',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-300',
      icon: <Flame className={size === 'sm' ? 'w-3 h-3 text-orange-600' : 'w-3.5 h-3.5 text-orange-600'} />,
    },
    almost_full: {
      label: 'SẮP ĐỦ NHÓM',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
      icon: <Zap className={size === 'sm' ? 'w-3 h-3 text-sky-600' : 'w-3.5 h-3.5 text-sky-600'} />,
    },
    new: {
      label: 'MỚI',
      bg: 'bg-emerald-500',
      text: 'text-white',
      border: 'border-emerald-600',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-white' : 'w-3.5 h-3.5 text-white'} />,
    },
    full: {
      label: 'ĐÃ ĐỦ SỐ LƯỢNG',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Users className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    closed: {
      label: 'ĐÃ ĐÓNG',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    successful: {
      label: 'GOM THÀNH CÔNG',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-300',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    cancelled: {
      label: 'ĐÃ HỦY',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    draft: {
      label: 'BẢN NHÁP',
      bg: 'bg-slate-50',
      text: 'text-slate-500',
      border: 'border-slate-200',
      icon: <FileText className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
  };

  const config = configs[status] || configs.active;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-black uppercase tracking-wider rounded-lg border shadow-2xs ${config.bg} ${config.text} ${config.border} ${padding} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
