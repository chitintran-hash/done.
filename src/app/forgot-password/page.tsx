"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Liên kết khôi phục mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (và cả thư mục Spam).');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <h1 className="text-3xl font-bold mb-2 text-[#3A211E]">Quên mật khẩu</h1>
        <p className="text-[#765B52] mb-8 text-sm">Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>

        {message ? (
          <div className="bg-[#FFF9E8] border border-[#E8DFD8] p-6 rounded-2xl text-center space-y-3">
            <h3 className="font-bold text-[#3A211E] text-base">Đã gửi liên kết!</h3>
            <p className="text-sm text-[#765B52] leading-relaxed">{message}</p>
            <Link 
              href="/login"
              className="mt-4 inline-block w-full py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold hover:bg-[#FFBF00]/90 transition-colors shadow-xs"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Email *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Nhập email của bạn"
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
              className="w-full py-3.5 mt-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#3A211E] rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-xs"
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
