import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'bg-white border-[#D0FFA4] text-slate-800';
        let iconColor = 'text-[#000181]';

        if (toast.type === 'ERROR') {
          Icon = AlertCircle;
          colorClasses = 'bg-white border-rose-500 text-slate-800';
          iconColor = 'text-rose-600';
        } else if (toast.type === 'WARNING') {
          Icon = AlertTriangle;
          colorClasses = 'bg-white border-amber-500 text-slate-800';
          iconColor = 'text-amber-600';
        } else if (toast.type === 'INFO') {
          Icon = Info;
          colorClasses = 'bg-white border-blue-500 text-slate-800';
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border-l-4 shadow-xl flex items-start gap-3 animate-slide-up transition-all ${colorClasses}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md cursor-pointer shrink-0"
              title="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
