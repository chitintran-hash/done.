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
  Building2,
  ShoppingCart,
  Store,
  FileCheck2,
} from 'lucide-react';
import { SignUpPayload } from '../services/authService';

interface AuthProps {
  onLogin: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  onRegister: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>;
  isSupabaseMode: boolean;
}

export const AuthModalOrPage: React.FC<AuthProps> = ({
  onLogin,
  onRegister,
  isSupabaseMode,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [registerRole, setRegisterRole] = useState<'buyer' | 'supplier'>('buyer'); // Strictly NO admin
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Show/Hide password toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(false);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);

  // Login form state (NO role picker)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Common Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Buyer specific state
  const [regPickupPoint, setRegPickupPoint] = useState<string>('Điểm nhận KTX Khu A – ĐHQG TP.HCM');

  // Supplier specific state
  const [supplierBusinessName, setSupplierBusinessName] = useState<string>('');
  const [supplierBusinessType, setSupplierBusinessType] = useState<string>('local_retailer');
  const [supplierOperatingRegion, setSupplierOperatingRegion] = useState<string>('TP.HCM & Đông Nam Bộ');
  const [supplierAddress, setSupplierAddress] = useState<string>('');

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
        const rawErr = res.error || '';
        if (
          rawErr.toLowerCase().includes('invalid') ||
          rawErr.toLowerCase().includes('credentials') ||
          rawErr.toLowerCase().includes('khong dung')
        ) {
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setRegError(null);

    if (!regName.trim()) {
      setRegError(registerRole === 'supplier' ? 'Vui lòng nhập họ và tên người đại diện.' : 'Vui lòng nhập Họ và tên.');
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

    if (registerRole === 'supplier') {
      if (!supplierBusinessName.trim()) {
        setRegError('Vui lòng nhập tên doanh nghiệp / cửa hàng.');
        return;
      }
      if (!regPhone.trim()) {
        setRegError('Vui lòng nhập số điện thoại liên hệ của nhà cung cấp.');
        return;
      }
      if (!supplierAddress.trim()) {
        setRegError('Vui lòng nhập địa chỉ kinh doanh / kho hàng.');
        return;
      }
    }

    if (!termsAccepted) {
      setRegError('Vui lòng đọc và đồng ý với Điều khoản sử dụng và Chính sách của FlashGroup.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: SignUpPayload = {
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        name: regName.trim(),
        role: registerRole, // strictly 'buyer' or 'supplier'
        phone: regPhone.trim(),
        preferredPickupPoint: registerRole === 'buyer' ? regPickupPoint : undefined,
        businessName: registerRole === 'supplier' ? supplierBusinessName.trim() : undefined,
        businessType: registerRole === 'supplier' ? supplierBusinessType : undefined,
        operatingRegion: registerRole === 'supplier' ? supplierOperatingRegion : undefined,
        businessAddress: registerRole === 'supplier' ? supplierAddress.trim() : undefined,
      };

      const res = await onRegister(payload);
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

        {/* Security / Engine Status Badge */}
        <div className="mt-3 inline-flex items-center space-x-1.5 bg-[#F4FFE8] border border-[#D0FFA4] text-[#000181] text-[11px] px-3.5 py-1 rounded-full font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006EE9] shrink-0" />
          <span>{isSupabaseMode ? 'Xác thực Supabase Cloud Bảo mật' : 'Hệ thống Xác thực Tiêu chuẩn FlashGroup'}</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#FFFFFF] py-7 px-5 shadow-xl shadow-[#000181]/5 sm:rounded-3xl sm:px-9 border border-[#E6E6EE]">
          {/* Main Mode Switcher: Login vs Register */}
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
              <span>Đăng ký tài khoản</span>
            </button>
          </div>

          {!isRegisterMode ? (
            /* ================= LOGIN FORM (NO ROLE PICKER) ================= */
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-black text-[#000181]">
                  Đăng nhập tài khoản
                </h3>
                <p className="text-xs text-[#53536A] mt-0.5">
                  Nhập email và mật khẩu. Hệ thống sẽ tự động chuyển đến đúng phân hệ theo vai trò tài khoản của bạn.
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
                      placeholder="tenban@gmail.com"
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

              {/* Footer Switch to Register */}
              <div className="mt-6 text-center text-xs text-[#53536A]">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setRegError(null);
                  }}
                  className="font-black text-[#006EE9] hover:text-[#000181] hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTER FORM: BUYER OR SUPPLIER (NO ADMIN) ================= */
            <div>
              {/* Role Selector Header */}
              <div className="mb-5">
                <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-2">
                  Bạn muốn sử dụng FlashGroup với vai trò nào?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Buyer */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterRole('buyer');
                      setRegError(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      registerRole === 'buyer'
                        ? 'border-[#006EE9] bg-[#EFFBFF] ring-2 ring-[#006EE9]/30'
                        : 'border-[#E6E6EE] bg-[#FCFCF7] hover:bg-[#F6F7FB]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      registerRole === 'buyer' ? 'bg-[#006EE9] text-white' : 'bg-[#E6E6EE] text-[#53536A]'
                    }`}>
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#000181]">🛒 Người mua</div>
                      <div className="text-[11px] text-[#53536A] mt-0.5 leading-tight">
                        Mua chung và tiết kiệm cùng cộng đồng.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Supplier */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterRole('supplier');
                      setRegError(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      registerRole === 'supplier'
                        ? 'border-[#006EE9] bg-[#EFFBFF] ring-2 ring-[#006EE9]/30'
                        : 'border-[#E6E6EE] bg-[#FCFCF7] hover:bg-[#F6F7FB]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      registerRole === 'supplier' ? 'bg-[#000181] text-[#D0FFA4]' : 'bg-[#E6E6EE] text-[#53536A]'
                    }`}>
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#000181]">🏪 Nhà cung cấp</div>
                      <div className="text-[11px] text-[#53536A] mt-0.5 leading-tight">
                        Bán sản phẩm theo mô hình mua chung.
                      </div>
                    </div>
                  </button>
                </div>
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
                {/* 1. Account info */}
                <div>
                  <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                    {registerRole === 'supplier' ? 'Họ và tên người đại diện *' : 'Họ và tên *'}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={registerRole === 'supplier' ? 'Ví dụ: Nguyễn Văn Doanh' : 'Ví dụ: Nguyễn Minh Anh'}
                    required
                    className="block w-full px-3.5 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Email đăng ký <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#53536A]">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@cuaban.com"
                        required
                        className="block w-full pl-8 pr-3 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Số điện thoại {registerRole === 'supplier' && <span className="text-rose-500">*</span>}
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
                        required={registerRole === 'supplier'}
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

                {/* 2. Specific fields for Buyer */}
                {registerRole === 'buyer' ? (
                  <div>
                    <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                      Điểm nhận hàng / Smart Locker ưa thích
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
                ) : (
                  /* 3. Specific fields for Supplier */
                  <div className="space-y-3 pt-1 border-t border-[#E6E6EE]">
                    <div className="text-xs font-black text-[#000181] uppercase tracking-wider flex items-center gap-1.5 pt-1">
                      <Building2 className="w-4 h-4 text-[#006EE9]" />
                      <span>Thông tin Doanh nghiệp / Cửa hàng</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                        Tên cửa hàng / doanh nghiệp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={supplierBusinessName}
                        onChange={(e) => setSupplierBusinessName(e.target.value)}
                        placeholder="Ví dụ: Nông Trại Xanh Đà Lạt Co., Ltd"
                        required
                        className="block w-full px-3.5 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                          Loại hình kinh doanh <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={supplierBusinessType}
                          onChange={(e) => setSupplierBusinessType(e.target.value)}
                          className="block w-full px-3 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none text-[#000181] font-bold"
                        >
                          <option value="manufacturer">Nhà sản xuất / Nhà vườn</option>
                          <option value="official_distributor">Nhà phân phối chính hãng</option>
                          <option value="wholesaler">Bán buôn / Đại lý cấp 1</option>
                          <option value="local_retailer">Hộ kinh doanh / Bán lẻ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                          Khu vực hoạt động chính <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={supplierOperatingRegion}
                          onChange={(e) => setSupplierOperatingRegion(e.target.value)}
                          className="block w-full px-3 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none text-[#000181] font-bold"
                        >
                          <option value="TP.HCM & Đông Nam Bộ">TP.HCM & Đông Nam Bộ</option>
                          <option value="Lâm Đồng & Tây Nguyên">Lâm Đồng & Tây Nguyên</option>
                          <option value="Đồng bằng Sông Cửu Long">Đồng bằng Sông Cửu Long</option>
                          <option value="Hà Nội & Miền Bắc">Hà Nội & Miền Bắc</option>
                          <option value="Toàn quốc">Toàn quốc</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#000181] uppercase tracking-wider mb-1">
                        Địa chỉ kinh doanh / Kho hàng xuất phát <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={supplierAddress}
                        onChange={(e) => setSupplierAddress(e.target.value)}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        required
                        className="block w-full px-3.5 py-2.5 text-sm bg-[#FCFCF7] border border-[#E6E6EE] rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#006EE9] focus:border-[#006EE9] outline-none transition text-[#000181] font-medium"
                      />
                    </div>

                    {/* Supplier Onboarding note */}
                    <div className="p-3 bg-[#EFFBFF] border border-[#83E7FF] rounded-2xl text-xs text-[#000181]">
                      <div className="font-black flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-[#006EE9]" />
                        <span>Quy trình Thẩm định & Xác minh Nhà cung cấp:</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#53536A] leading-relaxed">
                        Tài khoản Nhà cung cấp sẽ được tạo lập trực tiếp. Sau khi hoàn tất đăng ký, bạn sẽ được hướng dẫn bổ sung hồ sơ chứng từ để Ban Quản Trị thẩm định trước khi mở bán phòng gom đầu tiên.
                      </p>
                    </div>
                  </div>
                )}

                {/* Mandatory Checkbox */}
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
                        {registerRole === 'supplier' ? 'Quy chế đối tác Nhà cung cấp' : 'Chính sách quyền riêng tư'}
                      </span>{' '}
                      của FlashGroup. <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>

                  {/* Optional Marketing Checkbox - Default OFF */}
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#006EE9] focus:ring-[#006EE9] border-[#E6E6EE]"
                    />
                    <span className="text-xs text-[#53536A] leading-tight select-none">
                      Nhận thông báo cập nhật về các phòng gom giá sốc và ưu đãi qua email/SMS. (Không bắt buộc)
                    </span>
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#006EE9] hover:bg-[#000181] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md shadow-[#006EE9]/25 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D0FFA4]" />
                      <span>Đang khởi tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {registerRole === 'supplier' ? 'ĐĂNG KÝ NHÀ CUNG CẤP' : 'TẠO TÀI KHOẢN NGƯỜI MUA'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer switch to login */}
              <div className="mt-5 text-center text-xs text-[#53536A]">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setRegError(null);
                  }}
                  className="font-black text-[#006EE9] hover:text-[#000181] hover:underline cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              </div>
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
              Để bảo vệ tính toàn vẹn của các giao dịch mua chung và mã mở tủ Smart Locker, hệ thống hỗ trợ khôi phục mật khẩu trực tiếp qua kênh xác thực an toàn:
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
