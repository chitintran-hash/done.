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

  const [giftBoxes, setGiftBoxes] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    
    async function checkAuthAndPrefill() {
      // Fetch available gift boxes for upsell
      const { data: dbBoxes } = await supabase
        .from('products')
        .select('*')
        .in('category', ['gift_box', 'gift'])
        .eq('is_available', true)
        .order('price', { ascending: true });
      if (dbBoxes) {
        setGiftBoxes(dbBoxes);
      }

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

// Helper to compress large base64 image strings before sending to server action
async function compressImageString(dataUrl: string, maxDim = 500, quality = 0.75): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  if (dataUrl.length < 120000) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          let w = img.width || maxDim;
          let h = img.height || maxDim;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const isPng = dataUrl.startsWith('data:image/png');
            if (isPng) {
              const pngRes = c.toDataURL('image/png');
              if (pngRes.length < 250000) {
                resolve(pngRes);
                return;
              }
            }
            resolve(c.toDataURL('image/jpeg', quality));
          } else {
            resolve(dataUrl);
          }
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

async function sanitizeCartItemsForCheckout(items: any[]) {
  if (!Array.isArray(items)) return [];
  return Promise.all(
    items.map(async (item) => {
      const clean = { ...item };
      if (clean.image && typeof clean.image === 'string' && clean.image.startsWith('data:image/')) {
        clean.image = await compressImageString(clean.image, 400, 0.75);
      }
      if (clean.customSpecs) {
        const specs = { ...clean.customSpecs };
        if (specs.previewImage && typeof specs.previewImage === 'string' && specs.previewImage.startsWith('data:image/')) {
          specs.previewImage = await compressImageString(specs.previewImage, 400, 0.75);
        }
        if (specs.printableTexture && typeof specs.printableTexture === 'string' && specs.printableTexture.startsWith('data:image/')) {
          specs.printableTexture = await compressImageString(specs.printableTexture, 1024, 0.8);
        }
        if (Array.isArray(specs.layers)) {
          specs.layers = await Promise.all(
            specs.layers.map(async (layer: any) => {
              if (layer && layer.url && typeof layer.url === 'string' && layer.url.startsWith('data:image/')) {
                return {
                  ...layer,
                  url: await compressImageString(layer.url, 400, 0.75),
                  originalFile: undefined,
                };
              }
              return layer;
            })
          );
        }
        clean.customSpecs = specs;
      }
      return clean;
    })
  );
}

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

      // Tối ưu và nén dữ liệu hình ảnh giỏ hàng trước khi gửi Server Action
      const sanitizedCartItems = await sanitizeCartItemsForCheckout(cart.items);

      // Thiết lập timeout 25 giây phòng ngừa nghẽn mạng
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Hệ thống đang quá tải hoặc kết nối mạng gián đoạn. Vui lòng bấm đặt hàng lại.')),
          25000
        )
      );

      const result: any = await Promise.race([
        processCheckout(orderPayload, sanitizedCartItems),
        timeoutPromise,
      ]);

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
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A211E]" />
          <p className="text-sm text-[#765B52]">Đang kiểm tra thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9E8] flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl border border-[#E8DFD8] flex items-center justify-center text-3xl mb-4 shadow-sm">
          🛒
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-sm text-[#765B52] max-w-md mb-6">
          Bạn chưa chọn sản phẩm nào để thanh toán. Hãy ghé cửa hàng hoặc tạo mẫu ly mang dấu ấn riêng nhé!
        </p>
        <Link 
          href="/products" 
          className="px-8 py-3.5 bg-[#3A211E] hover:bg-[#3A211E] text-white rounded-full font-bold transition-colors"
        >
          Khám phá cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E8] pt-28 pb-20">
      {/* Modal yêu cầu đăng nhập nếu người dùng chưa xác thực */}
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => router.push('/cart')} 
        redirectUrl="/checkout" 
      />

      <div className="max-w-[1320px] mx-auto px-6">
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-[#765B52] hover:text-[#3A211E] mb-8 font-medium text-sm transition-colors"
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
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm">
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                      className={`w-full px-4 py-3 rounded-xl border ${phoneError ? 'border-red-400 focus:border-red-500' : 'border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00]'} focus:outline-none transition-colors text-sm`} 
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
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
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
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm resize-none"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  />
                </div>
              </form>
            </div>

            {/* MUA KÈM HỘP QUÀ TẶNG & ĐÓNG GÓI */}
            {giftBoxes.length > 0 && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#3A211E] flex items-center gap-2">
                      <span>🎁</span> Mua Kèm Hộp Quà Tặng
                    </h2>
                    <p className="text-xs sm:text-sm text-[#765B52] mt-1">
                      Đóng gói sang trọng kèm thiệp viết tay theo yêu cầu, thích hợp làm quà tặng người thân, bạn bè.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold bg-[#FFBF00] text-[#3A211E] px-3 py-1 rounded-full shrink-0 border border-[#E8DFD8]">
                    Gợi ý kèm đơn
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {giftBoxes.map((box) => {
                    const isSelected = cart.items.some((i) => i.id === box.id);
                    return (
                      <div
                        key={box.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#3A211E] bg-[#FFF9E8] shadow-xs ring-1 ring-[#3A211E]'
                            : 'border-[#E8DFD8] bg-[#FFF9E8] hover:border-[#FFF3C4]'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl bg-white border border-[#E8DFD8] overflow-hidden shrink-0 relative p-1">
                            <img
                              src={box.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80'}
                              alt={box.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#3A211E] line-clamp-1">
                              {box.name}
                            </h4>
                            <p className="text-[11px] text-[#765B52] line-clamp-2 mt-0.5">
                              {box.description || 'Hộp quà cao cấp lót rơm bảo vệ ly kèm thiệp nhắn gửi lời chúc.'}
                            </p>
                            <div className="font-bold text-xs sm:text-sm text-[#3A211E] mt-1.5">
                              +{Number(box.price).toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#E8DFD8]/60 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#765B52]">
                            {isSelected ? '✓ Đã thêm vào đơn' : 'Chưa chọn'}
                          </span>
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => cart.removeItem(box.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              Bỏ chọn
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                cart.addItem({
                                  id: box.id,
                                  name: box.name,
                                  price: Number(box.price) || 0,
                                  image: box.image_url || '',
                                  quantity: 1,
                                  isCustom: false,
                                })
                              }
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#3A211E] text-white hover:bg-[#3A211E] transition-colors shadow-2xs"
                            >
                              + Thêm vào đơn
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-4">
                Phương thức thanh toán
              </h2>

              <div className="p-5 rounded-2xl border-2 border-[#3A211E] bg-[#FFF9E8] flex items-start gap-4">
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
                    <span className="text-xs bg-[#FFF3C4]/40 text-[#3A211E] px-2.5 py-0.5 rounded-full font-semibold">
                      Tiền mặt
                    </span>
                  </div>
                  <p className="text-sm text-[#765B52] mt-1">
                    Bạn thanh toán tiền mặt cho nhân viên giao hàng khi nhận đơn.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#765B52]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kiểm tra hàng trước khi thanh toán. Đổi trả miễn phí nếu sản phẩm có lỗi từ nhà sản xuất.</span>
              </div>
            </div>

          </div>

          {/* Cột phải: Tóm tắt đơn hàng & Nút Xác nhận (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm sticky top-28">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto mb-6 pr-1 divide-y divide-[#E8DFD8]/60">
                {cart.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl bg-[#FFF9E8] border border-[#E8DFD8] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-1" 
                        />
                      ) : (
                        <span className="text-xs text-[#765B52]">No image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#3A211E] truncate">{item.name}</h4>
                      {item.isCustom && (
                        <p className="text-xs text-[#3A211E] font-semibold mt-0.5">
                          ✦ Ly thiết kế riêng
                        </p>
                      )}
                      <p className="text-xs text-[#765B52] mt-0.5">
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
              <div className="border-t border-[#E8DFD8] pt-5 space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#765B52]">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-[#3A211E]">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-[#765B52]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#3A211E]" /> Phí giao hàng (Toàn quốc)
                  </span>
                  <span className="font-semibold text-[#3A211E]">
                    {shippingFee.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Tổng thanh toán */}
              <div className="border-t border-[#E8DFD8] pt-5 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#3A211E] text-base">Tổng thanh toán</span>
                  <span className="font-heading text-3xl font-extrabold text-[#3A211E]">
                    {total.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className="text-xs text-right text-[#765B52] mt-1">
                  (Đã bao gồm VAT và phí vận chuyển COD)
                </p>
              </div>

              {/* Nút xác nhận đặt hàng */}
              <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading}
                className="w-full py-4 bg-[#3A211E] hover:bg-[#3A211E] text-white rounded-full font-bold text-base transition-colors shadow-[0_6px_20px_rgba(58,33,30,0.18)] disabled:opacity-60 flex items-center justify-center gap-2"
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

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#765B52]">
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
