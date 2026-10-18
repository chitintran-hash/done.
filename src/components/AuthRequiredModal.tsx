"use client";

import Link from "next/link";
import { LogIn, UserPlus, X, Lock } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  redirectUrl?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  redirectUrl = "/checkout",
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const encodedRedirect = encodeURIComponent(redirectUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#F7F6F2] rounded-[28px] border border-[#DDD8D2] p-8 shadow-2xl text-center transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#6F625E] hover:text-[#201817] hover:bg-black/5 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#BFDCEF]/40 border border-[#BFDCEF] flex items-center justify-center text-[#3A211E] shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="font-heading text-2xl font-bold text-[#3A211E] mb-3">
          Đăng nhập để hoàn tất đơn hàng
        </h3>

        <p className="text-sm md:text-base text-[#6F625E] leading-relaxed mb-8">
          Đăng nhập hoặc tạo tài khoản Cupfy để lưu thông tin nhận hàng, theo dõi đơn hàng và quản lý những chiếc ly yêu thích của bạn.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/login?redirect=${encodedRedirect}`}
            className="w-full py-3.5 px-6 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(58,33,30,0.12)]"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </Link>

          <Link
            href={`/register?redirect=${encodedRedirect}`}
            className="w-full py-3.5 px-6 bg-white hover:bg-[#EDECEA] text-[#3A211E] border border-[#DDD8D2] rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Tạo tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
