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
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#DDD8D2] rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-[#201817]">Quên mật khẩu</h1>
        <p className="text-muted-foreground mb-8 text-sm">Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>

        {message ? (
          <div className="bg-[#4A2A25] text-[#FFF3A6] p-6 rounded-xl text-center">
            <h3 className="font-bold mb-2">Đã gửi liên kết!</h3>
            <p className="text-sm opacity-90">{message}</p>
            <Link 
              href="/login"
              className="mt-6 inline-block w-full py-3 bg-[#FFF3A6] text-[#201817] rounded-full font-bold hover:bg-[#FFF0C7] transition-colors"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#201817]">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#DDD8D2] focus:border-[#201817] focus:outline-none transition-colors"
                placeholder="Nhập email của bạn"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 bg-[#4A2A25] hover:bg-[#6F625E] text-white rounded-full font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
            </button>
            
            <p className="text-center text-sm text-muted-foreground pt-4">
              Nhớ mật khẩu? <Link href="/login" className="text-[#201817] font-bold hover:underline">Đăng nhập</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
