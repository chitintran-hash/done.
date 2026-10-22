"use client";

import { useState } from 'react';
import Link from 'next/link';
import { resetPasswordDirectAction } from '@/app/actions/auth';
import { KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      setLoading(false);
      return;
    }

    const res = await resetPasswordDirectAction({
      email: email.trim().toLowerCase(),
      newPassword,
    });

    if (!res.success) {
      setError(res.error || 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại email.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-28 pb-16">
      <div className="w-full max-w-md bg-white border border-[#E8DFD8] rounded-[24px] p-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF3C4] border border-[#FFBF00] flex items-center justify-center text-[#3A211E] mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#3A211E]">Đặt lại mật khẩu</h1>
        <p className="text-[#765B52] mb-6 text-sm">Nhập email và mật khẩu mới để cập nhật ngay tài khoản của bạn.</p>

        {success ? (
          <div className="bg-[#FFF9E8] border border-[#E8DFD8] p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-[#FFF3C4] text-[#3A211E] rounded-full mx-auto flex items-center justify-center font-bold text-xl border border-[#FFBF00]">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-[#3A211E] text-lg">Đổi mật khẩu thành công!</h3>
            <p className="text-sm text-[#765B52] leading-relaxed">
              Mật khẩu mới của tài khoản <strong className="text-[#3A211E]">{email}</strong> đã được cập nhật thành công. Bạn có thể sử dụng mật khẩu mới này để đăng nhập ngay.
            </p>
            <Link 
              href="/login"
              className="mt-4 inline-block w-full py-3.5 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold hover:bg-[#FFBF00]/90 transition-colors shadow-xs"
            >
              Chuyển đến Đăng nhập
            </Link>
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

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Mật khẩu mới *</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-2 focus:ring-[#FFF3C4] focus:outline-none transition-colors text-sm"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#3A211E]">Xác nhận mật khẩu mới *</label>
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
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-[#3A211E] rounded-full font-bold transition-all disabled:opacity-50 text-base shadow-xs cursor-pointer"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu ngay'}
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

