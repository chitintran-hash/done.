"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ensureUserProfile } from '@/app/actions/auth';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      let friendlyMsg = authError.message;
      if (authError.message.includes('Invalid login credentials')) {
        friendlyMsg = 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.';
      } else if (authError.message.includes('Email not confirmed')) {
        friendlyMsg = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.';
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
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#DDD8D2] rounded-[24px] p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-bold text-[#3A211E] mb-2">Đăng nhập</h1>
        <p className="text-[#6F625E] text-sm mb-6">Chào mừng bạn trở lại với Cupfy ✨</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Email *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-[#3A211E]">Mật khẩu *</label>
              <Link href="/forgot-password" className="text-xs text-[#4A2A25] hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm"
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
            className="w-full py-3.5 mt-2 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-[0_4px_14px_rgba(58,33,30,0.12)]"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#6F625E]">
          Chưa có tài khoản?{' '}
          <Link href={registerLink} className="text-[#3A211E] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
