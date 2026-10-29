import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    preferredPickupPoint?: string,
    marketingConsent?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  isSupabaseMode: boolean;
  onContinueAsGuestDemo?: () => void;
}

export const AuthModalOrPage: React.FC<AuthProps> = ({
  onLogin,
  onRegister,
  isSupabaseMode,
  onContinueAsGuestDemo,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Show/Hide password toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(false);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);

  // Login form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regPickupPoint, setRegPickupPoint] = useState<string>('Điểm nhận KTX Khu A – ĐHQG TP.HCM');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [regError, setRegError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Buyer',
      roleVi: 'Người mua',
      name: 'Nguyễn Minh Anh',
      email: 'buyer@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-[#F4FFE8] text-[#000181] border-[#D0FFA4]',
      dotColor: 'bg-[#D0FFA4]',
      description: 'Tham gia phòng gom Dâu Tây 19/20, mở khóa giá sỉ 89.000đ & mã QR tủ Locker.',
    },
    {
      role: 'Supplier',
      roleVi: 'Nhà cung cấp',
      name: 'Nông Trại Xanh Đà Lạt',
      email: 'supplier@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-[#EFFBFF] text-[#000181] border-[#83E7FF]',
      dotColor: 'bg-[#83E7FF]',
      description: 'Quản lý kho hàng, tạo phòng gom theo bậc giá, chuẩn bị đơn & quét mã QR nhận hàng.',
    },
    {
      role: 'Admin',
      roleVi: 'Quản trị viên',
      name: 'FlashGroup Admin',
      email: 'admin@flashgroup.demo',
      password: '123456',
      badgeColor: 'bg-[#000181] text-white border-[#000181]',
      dotColor: 'bg-[#E8A0FF]',
      description: 'Kiểm duyệt pháp lý, đối soát tài chính 7% hoa hồng & giám sát Smart Locker.',
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setLoginError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLoginError('Vui lòng nhập email.');
      return;
    }

    if (!password) {
      setLoginError('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await onLogin(trimmedEmail, password, rememberMe);
      if (!res.success) {
        // Friendly Vietnamese error mapping
        const rawErr = res.error || '';
        if (rawErr.toLowerCase().includes('invalid') || rawErr.toLowerCase().includes('credentials') || rawErr.toLowerCase().includes('khong dung')) {
          setLoginError('Email hoặc mật khẩu chưa chính xác.');
        } else if (rawErr.toLowerCase().includes('network') || rawErr.toLowerCase().includes('fetch')) {
          setLoginError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
        } else {
          setLoginError(rawErr || 'Email hoặc mật khẩu chưa chính xác.');
        }
      }
    } catch (err: any) {
      setLoginError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
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
      const res = await onLogin(demoEmail, demoPass, true);
      if (!res.success) {
        setLoginError(res.error || 'Email hoặc mật khẩu chưa chính xác.');
      }
    } catch (err: any) {
      setLoginError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Vui lòng nhập Họ và tên.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Định dạng email chưa hợp lệ.');
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

    if (!termsAccepted) {
      setRegError('Vui lòng đọc và đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await onRegister(
        regEmail.trim().toLowerCase(),
        regPassword,
        regName.trim(),
        regPhone.trim() || '0901000000',
        regPickupPoint,
        marketingConsent
      );

      if (!res.success) {
        setRegError(res.error || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setRegError('Không thể kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCF7] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D0FFA4] selection:text-[#000181]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* FlashGroup Brand Logo */}
        <div className="inline-flex items-center space-x-3 mb-2 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-[#000181] flex items-center justify-center text-[#D0FFA4] shadow-lg shadow-[#000181]/20 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-6 h-6 fill-[#D0FFA4]" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black tracking-tight leading-none text-[#000181]">
              FLASH<span className="text-[#006EE9]">GROUP</span>
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-[#53536A] mt-1">
              Càng Đông, Càng Rẻ
            </div>
          </div>
        </div>

        <p className="text-xs text-[#53536A] font-medium max-w-sm mx-auto mt-1">
          Nền tảng Mua chung Siêu Cục Bộ & Tủ Thông Minh Smart Locker
        </p>

        {/* Status Badge */}
        <div className="mt-3 inline-flex items-center space-x-1.5 bg-[#F4FFE8] border border-[#D0FFA4] text-[#000181] text-[11px] px-3.5 py-1 rounded-full font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006EE9] shrink-0" />
          <span>{isSupabaseMode ? 'Hệ thống Xác thực Supabase Cloud' : 'Chế độ Demo Prototype Trực tiếp'}</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#FFFFFF] py-7 px-5 shadow-xl shadow-[#000181]/5 sm:rounded-3xl sm:px-9 border border-[#E6E6EE]">
          {/* Segmented Switcher */}
          <div className="flex p-1 bg-[#F6F7FB] rounded-2xl mb-6 border border-[#E6E6EE]">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                !isRegisterMode
                  ? 'bg-[#000181] text-white shadow-sm'
                  : 'text-[#53536A] hover:text-[#000181]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setRegError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                isRegisterMode
                  ? 'bg-[#000181] text-white shadow-sm'
                  : 'text-[#53536A] hover:text-[#000181]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng ký Buyer</span>
            </button>
          </div>

          {!isRegisterMode ? (
            /* ================= LOGIN FORM ================= */
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-black text-[#000181]">
                  Chào mừng trở lại!
                </h3>
                <p className="text-xs text-[#53536A] mt-0.5">
                  Đăng nhập tài khoản cá nhân hoặc dùng tài khoản Demo trình chiếu bên dưới.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                    ✕
                  </span>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                    Email đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#53536A]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@flashgroup.demo"
                      required
                      className="block w-full pl-10 pr-3.5 py-3 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider">
                      Mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-xs font-bold text-[#006EE9] hover:text-[#000181] hover:underline transition cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#53536A]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="block w-full pl-10 pr-11 py-3 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#53536A] hover:text-[#000181] cursor-pointer"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#006EE9] focus:ring-[#006EE9] border-[#E6E6EE]"
                    />
                    <span className="text-xs font-bold text-[#53536A] select-none">
                      Ghi nhớ đăng nhập trên thiết bị này
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md shadow-[#006EE9]/25 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D0FFA4]" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>ĐĂNG NHẬP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Mode / Presentation Section */}
              <div className="mt-7 pt-5 border-t border-[#E6E6EE]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#000181] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#006EE9]" />
                    <span>3 Tài khoản Demo sẵn sàng</span>
                  </span>
                  <span className="text-[10px] text-[#53536A] font-bold">1-Click Đăng nhập</span>
                </div>

                <div className="space-y-2.5">
                  {demoAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      className="p-3 rounded-2xl border border-[#E6E6EE] bg-[#F6F7FB] hover:border-[#006EE9]/40 hover:bg-[#EFFBFF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                          <span className="text-xs font-black text-[#000181]">{acc.name}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#53536A] mt-0.5">{acc.email}</div>
                        <div className="text-[11px] text-[#53536A] line-clamp-1 mt-0.5">{acc.description}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAutofillAndLogin(acc.email, acc.password)}
                        disabled={isLoading}
                        className="self-end sm:self-center shrink-0 text-xs font-black bg-white hover:bg-[#000181] hover:text-white text-[#000181] border border-[#000181]/20 px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        Dùng tài khoản này
                      </button>
                    </div>
                  ))}
                </div>

                {onContinueAsGuestDemo && (
                  <button
                    type="button"
                    onClick={onContinueAsGuestDemo}
                    className="w-full mt-3 py-2 text-xs font-bold text-[#53536A] hover:text-[#000181] hover:bg-[#F6F7FB] rounded-xl transition text-center cursor-pointer"
                  >
                    ⚡ Vào thẳng Chế độ Trình chiếu mà không cần mật khẩu
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ================= REGISTER BUYER FORM ================= */
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-black text-[#000181] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#006EE9]" />
                  <span>Đăng ký tài khoản Buyer</span>
                </h3>
                <p className="text-xs text-[#53536A] mt-0.5">
                  Tạo tài khoản người mua chung để tham gia gom đơn siêu cục bộ
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                    ✕
                  </span>
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                    required
                    className="block w-full px-3.5 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#53536A]">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="buyer@gmail.com"
                        required
                        className="block w-full pl-8 pr-3 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#53536A]">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0901234567"
                        className="block w-full pl-8 pr-3 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Mật khẩu (≥ 6 ký tự) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="block w-full pl-3 pr-9 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#53536A] hover:text-[#000181] cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Xác nhận mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="block w-full pl-3 pr-9 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#53536A] hover:text-[#000181] cursor-pointer"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pickup point */}
                <div>
                  <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                    Điểm nhận hàng / Smart Locker mặc định
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#53536A]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={regPickupPoint}
                      onChange={(e) => setRegPickupPoint(e.target.value)}
                      className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none text-[#000181] font-bold"
                    >
                      <option value="Điểm nhận KTX Khu A – ĐHQG TP.HCM">Điểm nhận KTX Khu A – ĐHQG TP.HCM</option>
                      <option value="Smart Locker KTX Khu B – ĐHQG TP.HCM">Smart Locker KTX Khu B – ĐHQG TP.HCM</option>
                      <option value="Smart Locker Quận 1 – Sảnh Bưu điện Trung tâm">Smart Locker Quận 1 – Sảnh Bưu điện Trung tâm</option>
                      <option value="Smart Locker Quận 7 – Sảnh Crescent Mall">Smart Locker Quận 7 – Sảnh Crescent Mall</option>
                      <option value="Smart Locker Cầu Giấy – Tòa Discovery Complex Hà Nội">Smart Locker Cầu Giấy – Tòa Discovery Complex Hà Nội</option>
                      <option value="Chưa chọn điểm nhận cố định">Chưa chọn điểm nhận cố định</option>
                    </select>
                  </div>
                </div>

                {/* Supplier Onboarding note */}
                <div className="p-3 bg-[#EFFBFF] border border-[#83E7FF] rounded-2xl text-xs text-[#000181]">
                  <p className="font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#006EE9]" />
                    <span>Lưu ý phân quyền tài khoản:</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#53536A] leading-relaxed">
                    Hệ thống tự động đăng ký với vai trò <strong>Buyer</strong>. Nếu bạn là Nhà phân phối/Nhà nông muốn bán hàng, hãy đăng nhập và chọn mục <strong>&ldquo;Đăng ký trở thành Nhà cung cấp&rdquo;</strong> trong phần cài đặt để gửi hồ sơ xác minh.
                  </p>
                </div>

                {/* Mandatory Terms & Privacy Checkbox */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#006EE9] focus:ring-[#006EE9] border-[#E6E6EE]"
                    />
                    <span className="text-xs text-[#53536A] leading-tight select-none">
                      Tôi đã đọc và đồng ý với{' '}
                      <span className="font-bold text-[#006EE9] hover:underline">
                        Điều khoản sử dụng
                      </span>{' '}
                      và{' '}
                      <span className="font-bold text-[#006EE9] hover:underline">
                        Chính sách quyền riêng tư
                      </span>{' '}
                      của FlashGroup. <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>

                  {/* Optional Marketing Checkbox - Unchecked by default */}
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#006EE9] focus:ring-[#006EE9] border-[#E6E6EE]"
                    />
                    <span className="text-xs text-[#53536A] leading-tight select-none">
                      Nhận thông báo về các phòng gom giá sốc và ưu đãi siêu cục bộ qua email/SMS. (Không bắt buộc)
                    </span>
                  </label>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md shadow-[#006EE9]/25 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D0FFA4]" />
                      <span>Đang đăng ký tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>HOÀN TẤT ĐĂNG KÝ BUYER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-[#000181]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E6E6EE] max-w-md w-full p-6 shadow-2xl relative animate-fade-in">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F6F7FB] hover:bg-[#E6E6EE] text-[#53536A] flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#EFFBFF] text-[#006EE9] flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#000181] mb-2">
              Khôi phục Mật khẩu FlashGroup
            </h3>
            <p className="text-xs text-[#53536A] leading-relaxed mb-4">
              Để bảo vệ tính toàn vẹn của các giao dịch mua chung và an toàn mã mở tủ Smart Locker, hệ thống hỗ trợ khôi phục mật khẩu trực tiếp qua xác thực bảo mật:
            </p>

            <div className="p-3.5 rounded-2xl bg-[#F6F7FB] border border-[#E6E6EE] space-y-2 mb-5 text-xs text-[#000181]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#006EE9] shrink-0" />
                <span>Gửi yêu cầu tới: <strong className="font-bold">support@flashgroup.space</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#006EE9] shrink-0" />
                <span>Hotline hỗ trợ: <strong className="font-bold">1900-FLASH (1900-3527)</strong></span>
              </div>
            </div>

            <p className="text-[11px] text-[#53536A] mb-5">
              * Nếu bạn đang tham gia thuyết trình hoặc đánh giá hệ thống, bạn có thể chọn ngay một trong 3 tài khoản Demo bên ngoài để vào hệ thống ngay lập tức mà không cần đặt lại mật khẩu.
            </p>

            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(false)}
              className="w-full py-2.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Đã hiểu & Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
