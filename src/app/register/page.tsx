"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const supabase = createClient();
    
    // We pass the email redirect to point back to the app
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Tạo tài khoản</h1>
        <p className="text-muted-foreground mb-8">Gia nhập DONE. để xây dựng góc học tập</p>

        {success ? (
          <div className="bg-accent/10 text-accent p-6 rounded-xl text-center">
            <h3 className="font-bold text-lg mb-2">Đăng ký thành công!</h3>
            <p className="text-sm">Vui lòng kiểm tra hộp thư Email của bạn ({email}) để xác thực tài khoản trước khi đăng nhập.</p>
            <button 
              onClick={() => router.push('/login')}
              className="mt-6 w-full py-3 bg-accent text-white rounded-full font-medium"
            >
              Chuyển đến Đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:outline-none transition-colors"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:outline-none transition-colors"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-accent focus:outline-none transition-colors"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản? <Link href="/login" className="text-accent font-medium hover:underline">Đăng nhập ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
}
