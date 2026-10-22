"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      let friendlyMsg = resetError.message;
      if (resetError.message.includes('rate limit')) {
        friendlyMsg = 'Hệ thống gửi thư đang bận. Vui lòng đợi vài phút rồi thử lại.';
      }
      setError(friendlyMsg);
    } else {
      setMessage(`Liên kết khôi phục mật khẩu đã được gửi đến email ${cleanEmail}. Vui lòng mở hộp thư của bạn (kiểm tra cả mục Hộp thư đến và Thư mục Rác/Spam) và bấm vào liên kết để đặt lại mật khẩu an toàn.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF3C4] border border-[#FFBF00] flex items-center justify-center text-[#3A211E] mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#3A211E]">Quên mật khẩu</h1>
        <p className="text-[#765B52] mb-6 text-sm">
          Nhập email của bạn. Hệ thống sẽ gửi một liên kết xác thực bảo mật đến hộp thư để bạn đặt lại mật khẩu mới.
        </p>

        {message ? (
          <div className="bg-[#FFF9E8] border border-[#E8DFD8] p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-[#FFF3C4] text-[#3A211E] rounded-full mx-auto flex items-center justify-center font-bold text-xl border border-[#FFBF00]">
              <Mail className="w-6 h-6 text-[#3A211E]" />
            </div>
            <h3 className="font-bold text-[#3A211E] text-base">Đã gửi email khôi phục!</h3>
            <p className="text-xs sm:text-sm text-[#765B52] leading-relaxed">
              {message}
            </p>
            <div className="pt-2">
              <Link 
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold hover:bg-[#FFBF00]/90 transition-colors shadow-xs text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Email tài khoản *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Nhập email đã đăng ký của bạn"
              />
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#3A211E] rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-xs cursor-pointer"
            >
              {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
            </button>
            
            <p className="text-center text-sm text-[#765B52] pt-4">
              Nhớ mật khẩu? <Link href="/login" className="text-[#3A211E] font-bold hover:underline">Đăng nhập</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
