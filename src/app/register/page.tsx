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
          role: 'customer'
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
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-8 shadow-sm mt-16">
        <h1 className="text-3xl font-bold mb-2">Tạo tài khoản</h1>
        <p className="text-muted-foreground mb-8">Gia nhập Cupfy để tạo nên chiếc ly của riêng bạn</p>

        {success ? (
          <div className="bg-[#181818] text-[#FFEDA8] p-6 rounded-xl text-center">
            <h3 className="font-bold text-lg mb-2">Đăng ký thành công!</h3>
            <p className="text-sm opacity-90">Vui lòng kiểm tra hộp thư Email của bạn ({email}) để xác thực tài khoản trước khi đăng nhập.</p>
            <button 
              onClick={() => router.push('/login')}
              className="mt-6 w-full py-3 bg-[#FFEDA8] text-[#181818] rounded-full font-bold hover:bg-[#FFF0C7] transition-colors"
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
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-[#181818] focus:outline-none transition-colors"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-[#181818] focus:outline-none transition-colors bg-muted/30"
                placeholder="email@example.com"
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
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-[#181818] focus:outline-none transition-colors bg-muted/30"
                placeholder="Tối thiểu 6 ký tự"
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
              className="w-full py-4 mt-4 bg-[#181818] hover:bg-[#333333] text-white rounded-full font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
            
            <p className="text-center text-sm text-muted-foreground pt-4">
              Đã có tài khoản? <Link href="/login" className="text-[#181818] font-bold hover:underline">Đăng nhập ngay</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
