"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ensureUserProfile, autoConfirmUserAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3A211E]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('next') || '';
  const isRegisteredSuccess = searchParams.get('registered') === '1';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    let { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    // Nếu tài khoản chưa confirm email từ trước, tự động kích hoạt luôn cho khách
    if (authError && authError.message.includes('Email not confirmed')) {
      const confirmRes = await autoConfirmUserAction(email.trim().toLowerCase());
      if (confirmRes.success) {
        const retryResult = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        data = retryResult.data;
        authError = retryResult.error;
      }
    }

    if (authError) {
      let friendlyMsg = authError.message;
      if (authError.message.includes('Invalid login credentials')) {
        friendlyMsg = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
      } else if (authError.message.includes('Email not confirmed')) {
        friendlyMsg = 'Tài khoản chưa được kích hoạt. Hệ thống đã tự động kích hoạt, vui lòng bấm Đăng nhập lại.';
      }
      setError(friendlyMsg);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Ensure profile row exists in public.profiles!
      await ensureUserProfile({
        userId: data.user.id,
        fullName: data.user.user_metadata?.full_name,
        email: data.user.email,
      });
    }

    // Redirect user back to where they were going (e.g. /checkout)
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/');
    }
    router.refresh();
  };

  const registerLink = `/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <h1 className="font-heading text-3xl font-bold text-[#3A211E] mb-2">Đăng nhập</h1>
        <p className="text-[#765B52] text-sm mb-6">Chào mừng bạn trở lại với Cupfy</p>

        {isRegisteredSuccess && (
          <div className="p-3.5 mb-4 bg-[#FFF9E8] border border-amber-300 text-[#3A211E] text-sm rounded-xl font-medium flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span>Đăng ký thành công! Bạn có thể đăng nhập ngay bằng mật khẩu vừa tạo.</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Email *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-[#3A211E]">Mật khẩu *</label>
              <Link href="/forgot-password" className="text-xs text-[#3A211E] hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
              placeholder="Nhập mật khẩu"
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
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#765B52]">
          Chưa có tài khoản?{' '}
          <Link href={registerLink} className="text-[#3A211E] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
