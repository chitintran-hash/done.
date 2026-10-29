import React, { useState } from 'react';
import { User } from '../types';
import { Zap, ShieldCheck, ArrowRight, UserPlus, LogIn, Lock, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    preferredPickupPoint?: string
  ) => Promise<{ success: boolean; error?: string }>;
  isSupabaseMode: boolean;
}

export const AuthModalOrPage: React.FC<AuthProps> = ({
  onLogin,
  onRegister,
  isSupabaseMode,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Login form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regPickupPoint, setRegPickupPoint] = useState<string>('Locker KTX Khu A – ĐHQG');
  const [regError, setRegError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Buyer',
      name: 'Nguyễn Minh Anh',
      email: 'buyer@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-[#D0FFA4]/40 text-emerald-800 border-[#D0FFA4]',
      description: 'Khám phá phòng gom, mua chung hạ giá, thanh toán và nhận hàng tại Locker.',
    },
    {
      role: 'Supplier',
      name: 'Nhà phân phối Nông sản A – Demo',
      email: 'supplier@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Quản lý kho hàng, tạo phòng gom theo bậc giá, chuẩn bị đơn và quét mã QR giao hàng.',
    },
    {
      role: 'Admin',
      name: 'FlashGroup Admin',
      email: 'admin@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-[#FAF0FF] text-indigo-800 border-indigo-300',
      description: 'Kiểm duyệt nhà cung cấp, giám sát giao dịch, can thiệp chốt phòng và xử lý hoàn tiền.',
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setLoginError(null);

    if (!email.trim() || !password) {
      setLoginError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await onLogin(email.trim(), password);
      if (!res.success) {
        setLoginError(res.error || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Lỗi khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillAndLogin = async (demoEmail: string, demoPass: string) => {
    if (isLoading) return;
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError(null);
    setIsLoading(true);
    try {
      const res = await onLogin(demoEmail, demoPass);
      if (!res.success) {
        setLoginError(res.error || 'Không thể đăng nhập với tài khoản này.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Lỗi đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Họ và tên là bắt buộc.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Email không hợp lệ.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Xác nhận mật khẩu không khớp.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await onRegister(
        regEmail.trim().toLowerCase(),
        regPassword,
        regName.trim(),
        regPhone.trim() || '0901000000',
        regPickupPoint
      );

      if (!res.success) {
        setRegError(res.error || 'Đăng ký không thành công.');
      }
    } catch (err: any) {
      setRegError(err.message || 'Lỗi hệ thống khi đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#006EE9] flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mx-auto mb-3">
          <Zap className="w-8 h-8 fill-white" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Flash<span className="text-[#000181]">Group</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Mô hình Mua gom Siêu cục bộ (Hyperlocal Group Buying) – Phase V4 Supabase
        </p>

        {/* Security / Prototype Notice */}
        <div className="mt-3 inline-flex items-center space-x-1.5 bg-[#F4FFE8] border border-[#D0FFA4] text-emerald-800 text-[11px] px-3 py-1 rounded-full font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#000181] shrink-0" />
          <span>{isSupabaseMode ? 'Supabase Authentication & Database Online' : 'Chế độ Demo Local Mode (Dự phòng)'}</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          {!isRegisterMode ? (
            /* ================= LOGIN FORM ================= */
            <div>
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <LogIn className="w-5 h-5 text-[#000181]" />
                    Đăng nhập hệ thống
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Chọn tài khoản demo bên dưới hoặc nhập email cá nhân</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setLoginError(null);
                  }}
                  className="text-xs font-semibold text-[#000181] hover:text-[#000181] bg-[#F4FFE8] hover:bg-[#D0FFA4]/40 px-3 py-1.5 rounded-lg transition"
                >
                  Đăng ký Buyer
                </button>
              </div>

              {loginError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="font-bold">✕</span>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@flashgroup.demo"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* QUICK DEMO ACCOUNTS SECTION */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span> 3 Tài khoản Demo sẵn sàng
                  </span>
                  <span className="text-[11px] text-slate-400">Click &ldquo;Dùng tài khoản này&rdquo;</span>
                </div>

                <div className="space-y-2.5">
                  {demoAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{acc.name}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-600 mt-1">{acc.email}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{acc.description}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAutofillAndLogin(acc.email, acc.password)}
                        disabled={isLoading}
                        className="self-end sm:self-center shrink-0 text-xs font-bold bg-white hover:bg-[#006EE9] hover:text-white text-[#000181] border border-[#D0FFA4] hover:border-emerald-600 px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
                      >
                        Dùng tài khoản này
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ================= REGISTER BUYER FORM ================= */
            <div>
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#000181]" />
                    Đăng ký tài khoản Buyer
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tạo tài khoản người mua chung để tham gia gom đơn</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setRegError(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                >
                  Quay lại Đăng nhập
                </button>
              </div>

              {regError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="font-bold">✕</span>
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Trần Văn Nam"
                    required
                    className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nam.tran@gmail.com"
                        required
                        className="block w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0912345678"
                        className="block w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mật khẩu (≥ 6 ký tự) *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Điểm nhận hàng mặc định (Preferred Pickup Point)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={regPickupPoint}
                      onChange={(e) => setRegPickupPoint(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-[#D0FFA4] outline-none bg-white font-medium"
                    >
                      <option value="Smart Locker Quận 1 – Sảnh Bưu điện Trung tâm">Smart Locker Quận 1 – Sảnh Bưu điện Trung tâm</option>
                      <option value="Smart Locker Quận 7 – Sảnh Crescent Mall">Smart Locker Quận 7 – Sảnh Crescent Mall</option>
                      <option value="Smart Locker TP. Thủ Đức – Khu Công Nghệ Cao">Smart Locker TP. Thủ Đức – Khu Công Nghệ Cao</option>
                      <option value="Smart Locker Cầu Giấy – Tòa Discovery Complex Hà Nội">Smart Locker Cầu Giấy – Tòa Discovery Complex Hà Nội</option>
                      <option value="Điểm nhận KTX Khu A – ĐHQG TP.HCM">Điểm nhận KTX Khu A – ĐHQG TP.HCM</option>
                      <option value="Chưa chọn điểm nhận cố định">Chưa chọn điểm nhận cố định</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Lưu ý phân quyền:</p>
                  <p className="mt-0.5">
                    Hệ thống chỉ cho phép tự đăng ký tài khoản <strong>Buyer</strong>. Tài khoản Supplier và Admin được kiểm duyệt và phân quyền bởi Ban quản trị.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang khởi tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>Hoàn tất Đăng ký Buyer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
