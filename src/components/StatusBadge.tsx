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
    // ACTIVE: #C7F000 background, #0C0D10 text
    active: {
      label: 'ĐANG MỞ',
      bg: 'bg-[#C7F000]',
      text: 'text-[#0C0D10]',
      border: 'border-[#C7F000]',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3 text-[#0C0D10]' : 'w-3.5 h-3.5 text-[#0C0D10]'} />,
    },
    // NEW: #EEF1FF background, #3155FF text
    new: {
      label: 'MỚI',
      bg: 'bg-[#EEF1FF]',
      text: 'text-[#3155FF]',
      border: 'border-[#3155FF]/30',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#3155FF]' : 'w-3.5 h-3.5 text-[#3155FF]'} />,
    },
    // POPULAR: #FFF0F7 background, #FF4FA3 text
    popular: {
      label: 'PHỔ BIẾN',
      bg: 'bg-[#FFF0F7]',
      text: 'text-[#FF4FA3]',
      border: 'border-[#FF4FA3]/30',
      icon: <Flame className={size === 'sm' ? 'w-3 h-3 text-[#FF4FA3]' : 'w-3.5 h-3.5 text-[#FF4FA3]'} />,
    },
    near_target: {
      label: 'GẦN CHỐT GIÁ TỐT',
      bg: 'bg-[#EEF1FF]',
      text: 'text-[#3155FF]',
      border: 'border-[#3155FF]/20',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#3155FF]' : 'w-3.5 h-3.5 text-[#3155FF]'} />,
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
      bg: 'bg-[#C7F000]',
      text: 'text-[#0C0D10]',
      border: 'border-[#0C0D10]/20',
      icon: <Users className={size === 'sm' ? 'w-3 h-3 text-[#0C0D10]' : 'w-3.5 h-3.5 text-[#0C0D10]'} />,
    },
    closed: {
      label: 'ĐÃ ĐÓNG',
      bg: 'bg-[#F6F7FC]',
      text: 'text-[#596273]',
      border: 'border-[#E4E8F0]',
      icon: <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    // SUCCESSFUL: #C7F000 background, #0C0D10 text
    successful: {
      label: 'GOM THÀNH CÔNG',
      bg: 'bg-[#C7F000]',
      text: 'text-[#0C0D10]',
      border: 'border-[#0C0D10]/20',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-[#0C0D10]' : 'w-3.5 h-3.5 text-[#0C0D10]'} />,
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
      bg: 'bg-[#F6F7FC]',
      text: 'text-[#596273]',
      border: 'border-[#E4E8F0]',
      icon: <FileText className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
    },
    // DEMO: #0C0D10 background, #FFFFFF text
    demo: {
      label: 'DEMO',
      bg: 'bg-[#0C0D10]',
      text: 'text-white',
      border: 'border-white/20',
      icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-[#C7F000]' : 'w-3.5 h-3.5 text-[#C7F000]'} />,
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
