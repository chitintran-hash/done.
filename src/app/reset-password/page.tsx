"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    const checkAndExchangeCode = async () => {
      // If PKCE code is in the URL, exchange it first
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        // Remove code from URL immediately to prevent strict-mode double firing
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && mounted) {
          // If error is about code already used, maybe the first strict-mode run succeeded.
          // We will ignore it here and let the session check below handle it.
          console.log("Code exchange warning:", error.message);
        }
      }

      // Wait a tiny bit for Supabase client to sync session (especially for implicit hash flow)
      setTimeout(async () => {
        if (!mounted) return;
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError('Phiên bản khôi phục không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại bằng link mới nhất.');
        } else {
          setError(''); // Clear any previous errors if session exists
        }
      }, 500);
    };
    
    checkAndExchangeCode();
    
    return () => { mounted = false; };
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    setLoading(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Optional: sign out if you want them to log in again manually
      // await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <h1 className="text-3xl font-bold mb-2 text-[#3A211E]">Đặt lại mật khẩu</h1>
        <p className="text-[#765B52] mb-8 text-sm">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        {success ? (
          <div className="bg-[#FFF9E8] border border-[#E8DFD8] p-6 rounded-2xl text-center space-y-3">
            <h3 className="font-bold text-[#3A211E] text-base">Đổi mật khẩu thành công!</h3>
            <p className="text-sm text-[#765B52] leading-relaxed">Mật khẩu của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập.</p>
            <Link 
              href="/login"
              className="mt-4 inline-block w-full py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold hover:bg-[#FFBF00]/90 transition-colors shadow-xs"
            >
              Về trang Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Mật khẩu mới *</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Xác nhận mật khẩu *</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !!error.includes('hết hạn')}
              className="w-full py-3.5 mt-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#3A211E] rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-xs"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
