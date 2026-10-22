"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ensureUserProfile, registerUserAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3A211E]" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('next') || '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // 1. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Định dạng email không hợp lệ. Vui lòng nhập đúng địa chỉ email.');
      setLoading(false);
      return;
    }

    // 2. Validate Password Length
    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.');
      setLoading(false);
      return;
    }

    // 3. Validate Confirm Password
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      setLoading(false);
      return;
    }

    // 4. Tạo tài khoản thông qua Server Action (Tự động kích hoạt tài khoản ngay lập tức)
    const res = await registerUserAction({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
    });

    if (!res.success) {
      setError(res.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    // 5. Tự động đăng nhập luôn trên Client
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      // Nếu có gián đoạn phiên client, điều hướng sang trang login đã kích hoạt
      router.push(`/login?registered=1${redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
      return;
    }

    // Đăng nhập thành công, điều hướng ngay
    setSuccess(true);
    setTimeout(() => {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
      router.refresh();
    }, 800);
  };

  const loginLink = `/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <h1 className="font-heading text-3xl font-bold text-[#3A211E] mb-2">Tạo tài khoản</h1>
        <p className="text-[#765B52] text-sm mb-6">Gia nhập Cupfy để bắt đầu thiết kế và đặt mua những chiếc ly của riêng bạn</p>

        {success ? (
          <div className="bg-[#FFF9E8] border border-[#E8DFD8] p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-[#FFF3C4] text-[#3A211E] rounded-full mx-auto flex items-center justify-center font-bold text-xl border border-[#FFBF00]">
              ✓
            </div>
            <h3 className="font-bold text-lg text-[#3A211E]">Đăng ký thành công!</h3>
            <p className="text-sm text-[#765B52] leading-relaxed">
              Tài khoản của bạn đã được kích hoạt thành công. Đang tự động đăng nhập vào Cupfy...
            </p>
            <div className="flex justify-center pt-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFBF00]" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Họ và tên *</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Email *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Mật khẩu *</label>
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
              <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">Xác nhận mật khẩu *</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            
            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                <p className="font-medium">{error}</p>
                {error.includes('đã được đăng ký') && (
                  <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-center justify-between text-xs font-bold">
                    <Link href={loginLink} className="text-[#3A211E] underline hover:text-[#FFBF00]">
                      Đến trang Đăng nhập →
                    </Link>
                    <Link href="/forgot-password" className="text-rose-800 underline hover:text-rose-950">
                      Quên mật khẩu? Đặt lại ngay →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#3A211E] rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-xs"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
            </button>
            
            <p className="text-center text-sm text-[#765B52] pt-3">
              Đã có tài khoản?{' '}
              <Link href={loginLink} className="text-[#3A211E] font-bold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
