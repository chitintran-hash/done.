"use client";

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import AuthRequiredModal from '@/components/AuthRequiredModal';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000; // Phí giao hàng toàn quốc 30.000 VNĐ
  const total = subtotal + shippingFee;

  useEffect(() => {
    const supabase = createClient();
    
    async function checkAuthAndPrefill() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUser(null);
        setShowAuthModal(true);
        setAuthChecking(false);
        return;
      }

      setUser(user);
      setShowAuthModal(false);

      // Pre-fill profile info if exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setFormData(prev => ({
        ...prev,
        name: profile?.full_name || user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
        phone: profile?.phone_number || prev.phone,
        address: profile?.address || prev.address,
      }));

      setAuthChecking(false);
    }

    checkAuthAndPrefill();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      const clean = value.trim().replace(/\s+/g, '');
      const phoneRegex = /^0[0-9]{9}$/;
      if (clean && !phoneRegex.test(clean)) {
        setPhoneError('Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0.');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Kiểm tra số điện thoại Việt Nam hợp lệ
    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('Số điện thoại nhận hàng không hợp lệ. Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        buyer_id: user.id,
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        address: formData.address.trim(),
        ward: formData.ward.trim(),
        district: formData.district.trim(),
        city: formData.city.trim(),
        note: formData.note.trim(),
      };

      const result = await processCheckout(orderPayload, cart.items);

      if (!result.success) {
        throw new Error(result.error || 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.');
      }

      // Xóa giỏ hàng chỉ khi tạo đơn thành công
      cart.clearCart();
      
      // Chuyển sang trang theo dõi đơn hàng chi tiết kèm cờ báo thành công
      router.push(`/orders/${result.orderId}?success=true`);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setErrorMessage(error.message || 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A211E]" />
          <p className="text-sm text-[#6F625E]">Đang kiểm tra thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F7F6F2] flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl border border-[#DDD8D2] flex items-center justify-center text-3xl mb-4 shadow-sm">
          🛒
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-sm text-[#6F625E] max-w-md mb-6">
          Bạn chưa chọn sản phẩm nào để thanh toán. Hãy ghé cửa hàng hoặc tạo mẫu ly mang dấu ấn riêng nhé!
        </p>
        <Link 
          href="/products" 
          className="px-8 py-3.5 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full font-bold transition-colors"
        >
          Khám phá cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-28 pb-20">
      {/* Modal yêu cầu đăng nhập nếu người dùng chưa xác thực */}
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => router.push('/cart')} 
        redirectUrl="/checkout" 
      />

      <div className="max-w-[1320px] mx-auto px-6">
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-[#6F625E] hover:text-[#3A211E] mb-8 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </Link>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Đặt hàng chưa thành công</p>
              <p className="text-sm mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cột trái: Thông tin nhận hàng & Phương thức thanh toán (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* THÔNG TIN NGƯỜI NHẬN */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-6 flex items-center gap-2">
                Thông tin nhận hàng
              </h2>

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      Họ và tên người nhận *
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      Số điện thoại nhận hàng *
                    </label>
                    <input 
                      required 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-xl border ${phoneError ? 'border-red-400 focus:border-red-500' : 'border-[#DDD8D2] focus:border-[#3A211E]'} focus:outline-none transition-colors text-sm`} 
                      placeholder="0901234567" 
                    />
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                    Email nhận thông báo đơn hàng *
                  </label>
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                    placeholder="email@example.com" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      Tỉnh / Thành phố *
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                      placeholder="TP. Hồ Chí Minh" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      Quận / Huyện *
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="district" 
                      value={formData.district} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                      placeholder="Quận 1" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      Phường / Xã *
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="ward" 
                      value={formData.ward} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                      placeholder="Phường Bến Nghé" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                    Số nhà và tên đường *
                  </label>
                  <input 
                    required 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm" 
                    placeholder="Ví dụ: 123 Lê Duẩn, Tòa nhà A" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                    Ghi chú giao hàng (Tùy chọn)
                  </label>
                  <textarea 
                    name="note" 
                    rows={2} 
                    value={formData.note} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD8D2] focus:border-[#3A211E] focus:outline-none transition-colors text-sm resize-none"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  />
                </div>
              </form>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-4">
                Phương thức thanh toán
              </h2>

              <div className="p-5 rounded-2xl border-2 border-[#3A211E] bg-[#F7F6F2] flex items-start gap-4">
                <input 
                  type="radio" 
                  checked 
                  readOnly 
                  className="w-5 h-5 mt-0.5 accent-[#3A211E]" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3A211E] text-base">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-xs bg-[#BFDCEF]/40 text-[#3A211E] px-2.5 py-0.5 rounded-full font-semibold">
                      Tiền mặt
                    </span>
                  </div>
                  <p className="text-sm text-[#6F625E] mt-1">
                    Bạn thanh toán tiền mặt cho nhân viên giao hàng khi nhận đơn.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#6F625E]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kiểm tra hàng trước khi thanh toán. Đổi trả miễn phí nếu sản phẩm có lỗi từ nhà sản xuất.</span>
              </div>
            </div>

          </div>

          {/* Cột phải: Tóm tắt đơn hàng & Nút Xác nhận (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DDD8D2] shadow-sm sticky top-28">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto mb-6 pr-1 divide-y divide-[#DDD8D2]/60">
                {cart.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl bg-[#F7F6F2] border border-[#DDD8D2] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-1" 
                        />
                      ) : (
                        <span className="text-xs text-[#6F625E]">No image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#3A211E] truncate">{item.name}</h4>
                      {item.isCustom && (
                        <p className="text-xs text-[#4A2A25] font-semibold mt-0.5">
                          ✦ Ly thiết kế riêng
                        </p>
                      )}
                      <p className="text-xs text-[#6F625E] mt-0.5">
                        {item.quantity} × {item.price.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#3A211E]">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chi tiết tiền */}
              <div className="border-t border-[#DDD8D2] pt-5 space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#6F625E]">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-[#3A211E]">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-[#6F625E]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#4A2A25]" /> Phí giao hàng (Toàn quốc)
                  </span>
                  <span className="font-semibold text-[#3A211E]">
                    {shippingFee.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Tổng thanh toán */}
              <div className="border-t border-[#DDD8D2] pt-5 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#3A211E] text-base">Tổng thanh toán</span>
                  <span className="font-heading text-3xl font-extrabold text-[#3A211E]">
                    {total.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className="text-xs text-right text-[#6F625E] mt-1">
                  (Đã bao gồm VAT và phí vận chuyển COD)
                </p>
              </div>

              {/* Nút xác nhận đặt hàng */}
              <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading}
                className="w-full py-4 bg-[#3A211E] hover:bg-[#4A2A25] text-white rounded-full font-bold text-base transition-colors shadow-[0_6px_20px_rgba(58,33,30,0.18)] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <span>XÁC NHẬN ĐẶT HÀNG (COD)</span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#6F625E]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Không cần chuyển khoản trước. Nhận hàng mới trả tiền.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
