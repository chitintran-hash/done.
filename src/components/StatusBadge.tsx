import React from 'react';
import { GroupRoomStatus } from '../types';
import { Clock, Users, CheckCircle2, Lock, XCircle, FileText, Sparkles, Flame, Zap } from 'lucide-react';

export type BadgeVariant =
  | GroupRoomStatus
  | 'near_target'
  | 'popular'
  | 'almost_full'
  | 'new'
  | 'demo';

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
    // ACTIVE: #D0FFA4 background, #000181 text
    active: {
      label: 'ĐANG MỞ',
      bg: 'bg-[#D0FFA4]',
      text: 'text-[#000181]',
      border: 'border-[#000181]/30',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3 text-[#000181]' : 'w-3.5 h-3.5 text-[#000181]'} />,
    },
    // NEW: #83E7FF background, #000181 text
    new: {
      label: 'MỚI',
      bg: 'bg-[#83E7FF]',
      text: 'text-[#000181]',
      border: 'border-[#006EE9]/30',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#000181]' : 'w-3.5 h-3.5 text-[#000181]'} />,
    },
    // POPULAR: #E8A0FF background, #000181 text
    popular: {
      label: 'PHỔ BIẾN',
      bg: 'bg-[#E8A0FF]',
      text: 'text-[#000181]',
      border: 'border-[#000181]/20',
      icon: <Flame className={size === 'sm' ? 'w-3 h-3 text-[#000181]' : 'w-3.5 h-3.5 text-[#000181]'} />,
    },
    near_target: {
      label: 'GẦN CHỐT GIÁ TỐT',
      bg: 'bg-[#EFFBFF]',
      text: 'text-[#000181]',
      border: 'border-[#83E7FF]',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#006EE9]' : 'w-3.5 h-3.5 text-[#006EE9]'} />,
    },
    almost_full: {
      label: 'SẮP ĐỦ NHÓM',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: <Zap className={size === 'sm' ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />,
    },
    full: {
      label: 'ĐÃ ĐỦ SỐ LƯỢNG',
      bg: 'bg-[#D0FFA4]',
      text: 'text-[#000181]',
      border: 'border-[#000181]',
      icon: <Users className={size === 'sm' ? 'w-3 h-3 text-[#000181]' : 'w-3.5 h-3.5 text-[#000181]'} />,
    },
    closed: {
      label: 'ĐÃ ĐÓNG',
      bg: 'bg-[#F6F7FB]',
      text: 'text-[#53536A]',
      border: 'border-[#E6E6EE]',
      icon: <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    // SUCCESSFUL: #D0FFA4 background, #000181 text
    successful: {
      label: 'GOM THÀNH CÔNG',
      bg: 'bg-[#D0FFA4]',
      text: 'text-[#000181]',
      border: 'border-[#000181]/30',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-[#000181]' : 'w-3.5 h-3.5 text-[#000181]'} />,
    },
    // CANCELLED: semantic coral/red
    cancelled: {
      label: 'ĐÃ HỦY',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    draft: {
      label: 'BẢN NHÁP',
      bg: 'bg-[#F6F7FB]',
      text: 'text-[#53536A]',
      border: 'border-[#E6E6EE]',
      icon: <FileText className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    // DEMO: #000181 background, #FFFFFF text
    demo: {
      label: 'DEMO',
      bg: 'bg-[#000181]',
      text: 'text-white',
      border: 'border-[#000181]',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#D0FFA4]' : 'w-3.5 h-3.5 text-[#D0FFA4]'} />,
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
