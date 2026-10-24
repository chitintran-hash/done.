"use client";

import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Building2,
  ChevronDown,
  Home,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import AIGreetingModal from '@/components/ai/AIGreetingModal';
import {
  VIETNAM_PROVINCES,
  POPULAR_PROVINCES,
  POPULAR_DISTRICTS,
  getDistricts,
  fetchWards,
  District,
  Ward,
} from '@/lib/vietnam-address';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isAIGreetingOpen, setIsAIGreetingOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  // 4-Tier Address States
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | ''>('');
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [districtsList, setDistrictsList] = useState<District[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | ''>('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [wardsList, setWardsList] = useState<Ward[]>([]);
  const [selectedWardCode, setSelectedWardCode] = useState<number | ''>('');
  const [selectedWardName, setSelectedWardName] = useState('');
  const [isManualWard, setIsManualWard] = useState(false);
  const [manualWard, setManualWard] = useState('');
  const [loadingWards, setLoadingWards] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');

  const effectiveWard = isManualWard ? manualWard.trim() : selectedWardName;
  const addressParts = [
    streetAddress.trim(),
    effectiveWard,
    selectedDistrictName,
    selectedProvinceName
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');
  const isAddressComplete = Boolean(
    streetAddress.trim() && effectiveWard && selectedDistrictName && selectedProvinceName
  );

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000; // Phí giao hàng toàn quốc 30.000 VNĐ
  const total = subtotal + shippingFee;

  const [giftBoxes, setGiftBoxes] = useState<any[]>([]);

  const handleSelectProvince = (codeStr: string | number) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedProvinceCode('');
      setSelectedProvinceName('');
      setDistrictsList([]);
      setSelectedDistrictCode('');
      setSelectedDistrictName('');
      setWardsList([]);
      setSelectedWardCode('');
      setSelectedWardName('');
      setManualWard('');
      return;
    }
    const prov = VIETNAM_PROVINCES.find((p) => p.code === code);
    if (prov) {
      setSelectedProvinceCode(code);
      setSelectedProvinceName(prov.name);
      const districts = getDistricts(code);
      setDistrictsList(districts);
      setSelectedDistrictCode('');
      setSelectedDistrictName('');
      setWardsList([]);
      setSelectedWardCode('');
      setSelectedWardName('');
      setManualWard('');
    }
  };

  const handleSelectDistrict = (codeStr: string | number) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedDistrictCode('');
      setSelectedDistrictName('');
      setWardsList([]);
      setSelectedWardCode('');
      setSelectedWardName('');
      setManualWard('');
      return;
    }
    const dist = districtsList.find((d) => d.code === code);
    if (dist) {
      setSelectedDistrictCode(code);
      setSelectedDistrictName(dist.name);
      setSelectedWardCode('');
      setSelectedWardName('');
      setManualWard('');
      setLoadingWards(true);
      fetchWards(code).then((wards) => {
        setWardsList(wards);
        setLoadingWards(false);
      });
    }
  };

  const handleSelectWard = (codeStr: string | number) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedWardCode('');
      setSelectedWardName('');
      return;
    }
    const w = wardsList.find((item) => item.code === code);
    if (w) {
      setSelectedWardCode(code);
      setSelectedWardName(w.name);
      setIsManualWard(false);
    }
  };

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
      }));

      // Parse and pre-fill address if available
      if (profile?.address) {
        const rawAddr = profile.address.trim();
        const parts = rawAddr.split(',').map((s: string) => s.trim());
        if (parts.length >= 4) {
          const cityCandidate = parts[parts.length - 1];
          const distCandidate = parts[parts.length - 2];
          const wardCandidate = parts[parts.length - 3];
          const streetCandidate = parts.slice(0, parts.length - 3).join(', ');

          const matchedProv = VIETNAM_PROVINCES.find(p => 
            p.name.toLowerCase() === cityCandidate.toLowerCase() ||
            p.name.toLowerCase().includes(cityCandidate.toLowerCase()) ||
            cityCandidate.toLowerCase().includes(p.name.toLowerCase())
          );

          if (matchedProv) {
            setSelectedProvinceCode(matchedProv.code);
            setSelectedProvinceName(matchedProv.name);
            const dists = getDistricts(matchedProv.code);
            setDistrictsList(dists);

            const matchedDist = dists.find(d => 
              d.name.toLowerCase() === distCandidate.toLowerCase() ||
              d.name.toLowerCase().includes(distCandidate.toLowerCase()) ||
              distCandidate.toLowerCase().includes(d.name.toLowerCase())
            );

            if (matchedDist) {
              setSelectedDistrictCode(matchedDist.code);
              setSelectedDistrictName(matchedDist.name);
              setLoadingWards(true);
              fetchWards(matchedDist.code).then((wards) => {
                setWardsList(wards);
                setLoadingWards(false);
                const matchedWard = wards.find(w => 
                  w.name.toLowerCase() === wardCandidate.toLowerCase() ||
                  w.name.toLowerCase().includes(wardCandidate.toLowerCase()) ||
                  wardCandidate.toLowerCase().includes(w.name.toLowerCase())
                );
                if (matchedWard) {
                  setSelectedWardCode(matchedWard.code);
                  setSelectedWardName(matchedWard.name);
                } else {
                  setIsManualWard(true);
                  setManualWard(wardCandidate);
                }
              });
            }
            setStreetAddress(streetCandidate || rawAddr);
          } else {
            setStreetAddress(rawAddr);
          }
        } else {
          setStreetAddress(rawAddr);
        }
      }

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
        setPhoneError(
          isEn 
            ? 'Phone number must be exactly 10 digits starting with 0.' 
            : 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0.'
        );
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
  if (dataUrl.length < 60000) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(dataUrl), 2000);
    try {
      const img = new window.Image();
      img.onload = () => {
        clearTimeout(timer);
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
            resolve(c.toDataURL('image/jpeg', quality));
          } else {
            resolve(dataUrl);
          }
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(dataUrl);
      };
      img.src = dataUrl;
    } catch {
      clearTimeout(timer);
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
        // Delete redundant heavy fields
        delete specs.originalImage;

        if (specs.uploadedImage && typeof specs.uploadedImage === 'string' && specs.uploadedImage.startsWith('data:image/')) {
          specs.uploadedImage = await compressImageString(specs.uploadedImage, 400, 0.75);
        }
        if (specs.previewImage && typeof specs.previewImage === 'string' && specs.previewImage.startsWith('data:image/')) {
          specs.previewImage = await compressImageString(specs.previewImage, 400, 0.75);
        }
        if (specs.printableTexture && typeof specs.printableTexture === 'string' && specs.printableTexture.startsWith('data:image/')) {
          specs.printableTexture = await compressImageString(specs.printableTexture, 800, 0.75);
        }
        if (Array.isArray(specs.layers)) {
          specs.layers = await Promise.all(
            specs.layers.map(async (layer: any) => {
              const l = { ...layer };
              delete l.originalFile;
              if (l.url && typeof l.url === 'string' && l.url.startsWith('data:image/')) {
                l.url = await compressImageString(l.url, 400, 0.75);
              }
              return l;
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

    if (!formData.name.trim()) {
      setErrorMessage(isEn ? 'Please enter receiver full name.' : 'Vui lòng nhập họ và tên người nhận hàng.');
      return;
    }

    // Kiểm tra số điện thoại Việt Nam hợp lệ
    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError(
        isEn
          ? 'Phone number must be exactly 10 digits starting with 0.'
          : 'Số điện thoại nhận hàng không hợp lệ. Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.'
      );
      return;
    }

    if (!selectedProvinceName) {
      setErrorMessage(isEn ? 'Please select a City / Province.' : 'Vui lòng chọn Tỉnh hoặc Thành phố nhận hàng.');
      return;
    }

    if (!selectedDistrictName) {
      setErrorMessage(isEn ? 'Please select a District.' : 'Vui lòng chọn Quận hoặc Huyện nhận hàng.');
      return;
    }

    if (!effectiveWard) {
      setErrorMessage(isEn ? 'Please select or enter a Ward / Commune.' : 'Vui lòng chọn hoặc nhập Phường hoặc Xã nhận hàng.');
      return;
    }

    if (!streetAddress.trim()) {
      setErrorMessage(isEn ? 'Please enter your specific house number and street name.' : 'Vui lòng nhập số nhà và tên đường cụ thể.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        buyer_id: user.id,
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        address: streetAddress.trim(),
        ward: effectiveWard,
        district: selectedDistrictName,
        city: selectedProvinceName,
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
      let userMsg = error?.message || 'Không thể hoàn tất đơn hàng. Vui lòng thử lại sau.';
      if (
        userMsg.includes('Minified React error') || 
        userMsg.includes('Server Components') || 
        userMsg.includes('#441') ||
        userMsg.includes('441')
      ) {
        userMsg = 'Hệ thống vừa cập nhật phiên bản mới. Quý khách vui lòng bấm phím F5 (hoặc tải lại trang) rồi bấm "XÁC NHẬN ĐẶT HÀNG" để hoàn tất nhé!';
      }
      setErrorMessage(userMsg);
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A211E]" />
          <p className="text-sm text-[#765B52]">
            {isEn ? 'Checking account information...' : 'Đang kiểm tra thông tin tài khoản...'}
          </p>
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
        <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-2">
          {isEn ? 'Your cart is empty' : 'Giỏ hàng của bạn đang trống'}
        </h2>
        <p className="text-sm text-[#765B52] max-w-md mb-6">
          {isEn
            ? 'You have not selected any items yet. Visit our shop or create your custom cup!'
            : 'Bạn chưa chọn sản phẩm nào để thanh toán. Hãy ghé cửa hàng hoặc tạo mẫu ly mang dấu ấn riêng nhé!'}
        </p>
        <Link 
          href="/products" 
          className="px-8 py-3.5 bg-[#3A211E] hover:bg-[#3A211E] text-white rounded-full font-bold transition-colors"
        >
          {isEn ? 'Explore Shop' : 'Khám phá cửa hàng'}
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

      {/* Modal sáng tạo lời chúc thiệp quà tặng AI */}
      <AIGreetingModal 
        isOpen={isAIGreetingOpen}
        onClose={() => setIsAIGreetingOpen(false)}
        initialType="greeting"
        onSelect={(greetingText) => {
          setFormData(prev => ({
            ...prev,
            note: prev.note ? `${prev.note}\n[Lời chúc thiệp]: ${greetingText}` : `[Lời chúc thiệp]: ${greetingText}`
          }));
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6">
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-[#765B52] hover:text-[#3A211E] mb-8 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isEn ? 'Back to cart' : 'Quay lại giỏ hàng'}
        </Link>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{isEn ? 'Order submission failed' : 'Đặt hàng chưa thành công'}</p>
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
                {isEn ? 'Shipping Information' : 'Thông tin nhận hàng'}
              </h2>

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      {isEn ? 'Receiver Full Name *' : 'Họ và tên người nhận *'}
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm" 
                      placeholder={isEn ? 'John Doe' : 'Nguyễn Văn A'} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                      {isEn ? 'Phone Number *' : 'Số điện thoại nhận hàng *'}
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
                    {isEn ? 'Email for Order Notifications *' : 'Email nhận thông báo đơn hàng *'}
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

                {/* 4-TIER ADDRESS SELECTION */}
                <div className="pt-4 border-t border-[#E8DFD8] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-[#3A211E]">
                      {isEn ? 'Detailed Delivery Address *' : 'Địa chỉ nhận hàng chi tiết *'}
                    </label>
                    <span className="text-[11px] font-bold text-[#3A211E] bg-[#FFBF00]/25 px-2.5 py-0.5 rounded-full border border-[#FFBF00]/40">
                      {isEn ? '4-Tier Standard' : 'Chuẩn xác 4 cấp'}
                    </span>
                  </div>

                  {/* 1. GỢI Ý CHỌN NHANH TỈNH / THÀNH PHỐ (1-CLICK SUGGESTIONS) */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8DFD8]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#765B52] mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#3A211E]" />
                      <span>{isEn ? '1-Click City Suggestions:' : 'Gợi ý chọn nhanh Tỉnh / Thành phố:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_PROVINCES.map((p) => {
                        const isSelected = selectedProvinceCode === p.code;
                        return (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleSelectProvince(p.code)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isSelected
                                ? 'bg-[#3A211E] text-white border-[#3A211E] shadow-sm scale-105'
                                : 'bg-white text-[#3A211E] border-[#E8DFD8] hover:border-[#FFBF00] hover:bg-[#FFF9E8]'
                            }`}
                          >
                            <span>{p.icon}</span>
                            <span>{p.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5 text-[#FFBF00]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. CHỌN TỈNH/THÀNH VÀ QUẬN/HUYỆN (GRID 2 CỘT) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cấp 1: Tỉnh / Thành phố */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-1.5">
                        {isEn ? 'Province / City *' : 'Tỉnh / Thành phố *'}
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={selectedProvinceCode}
                          onChange={(e) => handleSelectProvince(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-white focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm appearance-none pr-10 cursor-pointer text-[#3A211E]"
                        >
                          <option value="">
                            {isEn ? '-- Select Province / City --' : '-- Chọn Tỉnh / Thành phố --'}
                          </option>
                          <optgroup label={isEn ? 'Centrally-governed Municipalities' : 'Tỉnh / Thành phố trực thuộc Trung ương'}>
                            {POPULAR_PROVINCES.map((p) => (
                              <option key={`pop-${p.code}`} value={p.code}>
                                {p.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label={isEn ? 'All 63 Provinces & Cities' : 'Tất cả 63 Tỉnh / Thành'}>
                            {VIETNAM_PROVINCES.map((p) => (
                              <option key={p.code} value={p.code}>
                                {p.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#765B52] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Cấp 2: Quận / Huyện */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-1.5">
                        {isEn ? 'District *' : 'Quận / Huyện *'}
                      </label>
                      <div className="relative">
                        <select
                          required
                          disabled={!selectedProvinceCode}
                          value={selectedDistrictCode}
                          onChange={(e) => handleSelectDistrict(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-white focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm appearance-none pr-10 disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-not-allowed cursor-pointer text-[#3A211E]"
                        >
                          <option value="">
                            {selectedProvinceCode
                              ? (isEn ? '-- Select District --' : '-- Chọn Quận / Huyện --')
                              : (isEn ? '-- Select Province first --' : '-- Chọn Tỉnh/Thành trước --')}
                          </option>
                          {districtsList.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#765B52] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* GỢI Ý QUẬN/HUYỆN TRUNG TÂM (HCM, HN, ĐN) */}
                  {selectedProvinceCode && POPULAR_DISTRICTS[Number(selectedProvinceCode)] && (
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD8]">
                      <div className="text-[11px] font-bold text-[#765B52] mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#3A211E]" />
                        <span>{isEn ? 'Popular Central Districts:' : 'Gợi ý Quận / Huyện trung tâm:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_DISTRICTS[Number(selectedProvinceCode)].map((distName) => {
                          const matchedDistrict = districtsList.find((d) => d.name === distName);
                          if (!matchedDistrict) return null;
                          const isSelected = selectedDistrictCode === matchedDistrict.code;
                          return (
                            <button
                              key={matchedDistrict.code}
                              type="button"
                              onClick={() => handleSelectDistrict(matchedDistrict.code)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-[#3A211E] text-white border-[#3A211E] shadow-xs'
                                  : 'bg-white text-[#765B52] border-[#E8DFD8] hover:border-[#3A211E] hover:text-[#3A211E]'
                              }`}
                            >
                              {matchedDistrict.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. CHỌN PHƯỜNG/XÃ VÀ SỐ NHÀ, TÊN ĐƯỜNG (GRID 2 CỘT) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cấp 3: Phường / Xã */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52]">
                          {isEn ? 'Ward / Commune *' : 'Phường / Xã *'}
                        </label>
                        {selectedDistrictCode && (
                          <button
                            type="button"
                            onClick={() => setIsManualWard(!isManualWard)}
                            className="text-[11px] text-[#B45309] font-bold hover:underline cursor-pointer"
                          >
                            {isManualWard
                              ? (isEn ? 'Select from list' : 'Chọn từ danh sách')
                              : (isEn ? 'Enter manually' : 'Không tìm thấy? Nhập tay')}
                          </button>
                        )}
                      </div>

                      {isManualWard ? (
                        <input
                          type="text"
                          required
                          value={manualWard}
                          onChange={(e) => setManualWard(e.target.value)}
                          placeholder={isEn ? 'Enter ward or commune name...' : 'Nhập tên Phường hoặc Xã...'}
                          className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm text-[#3A211E]"
                        />
                      ) : (
                        <div className="relative">
                          <select
                            required
                            disabled={!selectedDistrictCode || loadingWards}
                            value={selectedWardCode}
                            onChange={(e) => handleSelectWard(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] bg-white focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm appearance-none pr-10 disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-not-allowed cursor-pointer text-[#3A211E]"
                          >
                            <option value="">
                              {loadingWards
                                ? (isEn ? 'Loading wards...' : 'Đang tải danh sách Phường/Xã...')
                                : selectedDistrictCode
                                ? (isEn ? '-- Select Ward --' : '-- Chọn Phường / Xã --')
                                : (isEn ? '-- Select District first --' : '-- Chọn Quận/Huyện trước --')}
                            </option>
                            {wardsList.map((w) => (
                              <option key={w.code} value={w.code}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                          {loadingWards ? (
                            <Loader2 className="w-4 h-4 text-[#3A211E] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#765B52] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cấp 4: Số nhà, tên đường cụ thể */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#765B52] mb-1.5">
                        {isEn ? 'Street Address, House No. *' : 'Số nhà, tên đường, tòa nhà... *'}
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-[#765B52]/60 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder={isEn ? '123 Le Loi St, Apt 4B...' : 'Số 123 Đường Lê Lợi, Căn hộ A2...'}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm text-[#3A211E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HỘP XEM TRƯỚC ĐỊA CHỈ GIAO HÀNG ĐẦY ĐỦ (LIVE ADDRESS PREVIEW) */}
                  {fullAddress && (
                    <div className="bg-[#FFF9E8] border border-[#FFBF00]/40 p-4 rounded-2xl flex items-start gap-3 shadow-xs transition-all">
                      <MapPin className="w-5 h-5 text-[#3A211E] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#765B52]">
                            {isEn ? 'Full Delivery Address Preview:' : 'Địa chỉ nhận hàng đầy đủ:'}
                          </span>
                          {isAddressComplete && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {isEn ? '✓ 4-Tier Complete' : '✓ Đầy đủ 4 cấp'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#3A211E] leading-relaxed break-words">
                          {fullAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3A211E] mb-1.5">
                    {isEn ? 'Delivery Note (Optional)' : 'Ghi chú giao hàng (Tùy chọn)'}
                  </label>
                  <textarea 
                    name="note" 
                    rows={2} 
                    value={formData.note} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DFD8] focus:border-[#FFBF00] focus:ring-1 focus:ring-[#FFBF00] focus:outline-none transition-colors text-sm resize-none"
                    placeholder={isEn ? 'E.g., Deliver during office hours, call beforehand...' : 'Ví dụ: Giao giờ hành chính, gọi trước khi đến...'}
                  />
                </div>
              </form>
            </div>

            {/* MUA KÈM HỘP QUÀ TẶNG & ĐÓNG GÓI */}
            {giftBoxes.length > 0 && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#3A211E] flex items-center gap-2">
                        <span>🎁</span> {isEn ? 'Add Gift Box & Packaging' : 'Mua Kèm Hộp Quà Tặng'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsAIGreetingOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFBF00]/30 hover:bg-[#FFBF00]/50 text-[#3A211E] border border-[#FFBF00]/60 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#3A211E]" />
                        <span>{isEn ? 'AI Greeting Writer ✨' : 'AI Viết Thiệp Lời Chúc ✨'}</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#765B52] mt-1">
                      {isEn 
                        ? 'Luxury packaging with handwritten message card upon request, perfect for gifts.' 
                        : 'Đóng gói sang trọng kèm thiệp viết tay theo yêu cầu, thích hợp làm quà tặng người thân, bạn bè.'}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold bg-[#FFBF00] text-[#3A211E] px-3 py-1 rounded-full shrink-0 border border-[#E8DFD8]">
                    {isEn ? 'Upsell Pick' : 'Gợi ý kèm đơn'}
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
                              {box.description || (isEn ? 'Premium gift box with protective straw and greeting card.' : 'Hộp quà cao cấp lót rơm bảo vệ ly kèm thiệp nhắn gửi lời chúc.')}
                            </p>
                            <div className="font-bold text-xs sm:text-sm text-[#3A211E] mt-1.5">
                              +{Number(box.price).toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#E8DFD8]/60 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#765B52]">
                            {isSelected 
                              ? (isEn ? '✓ Added to order' : '✓ Đã thêm vào đơn') 
                              : (isEn ? 'Not selected' : 'Chưa chọn')}
                          </span>
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => cart.removeItem(box.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              {isEn ? 'Remove' : 'Bỏ chọn'}
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
                              {isEn ? '+ Add to order' : '+ Thêm vào đơn'}
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
                {isEn ? 'Payment Method' : 'Phương thức thanh toán'}
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
                      {isEn ? 'Cash on Delivery (COD)' : 'Thanh toán khi nhận hàng (COD)'}
                    </span>
                    <span className="text-xs bg-[#FFF3C4]/40 text-[#3A211E] px-2.5 py-0.5 rounded-full font-semibold">
                      {isEn ? 'Cash' : 'Tiền mặt'}
                    </span>
                  </div>
                  <p className="text-sm text-[#765B52] mt-1">
                    {isEn 
                      ? 'You pay cash directly to courier upon package delivery.' 
                      : 'Bạn thanh toán tiền mặt cho nhân viên giao hàng khi nhận đơn.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#765B52]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isEn 
                    ? 'Inspect items before payment. Free return and replacement for manufacturing defects.' 
                    : 'Kiểm tra hàng trước khi thanh toán. Đổi trả miễn phí nếu sản phẩm có lỗi từ nhà sản xuất.'}
                </span>
              </div>
            </div>

          </div>

          {/* Cột phải: Tóm tắt đơn hàng & Nút Xác nhận (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8DFD8] shadow-sm sticky top-28">
              <h2 className="font-heading text-2xl font-bold text-[#3A211E] mb-6">
                {isEn ? 'Order Summary' : 'Tóm tắt đơn hàng'}
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
                          {isEn ? '✦ Custom Design Cup' : '✦ Ly thiết kế riêng'}
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
                  <span>{isEn ? 'Subtotal' : 'Tạm tính'}</span>
                  <span className="font-semibold text-[#3A211E]">
                    {subtotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-[#765B52]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#3A211E]" /> {isEn ? 'Shipping Fee (Nationwide)' : 'Phí giao hàng (Toàn quốc)'}
                  </span>
                  <span className="font-semibold text-[#3A211E]">
                    {shippingFee.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Tổng thanh toán */}
              <div className="border-t border-[#E8DFD8] pt-5 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#3A211E] text-base">{isEn ? 'Total Payment' : 'Tổng thanh toán'}</span>
                  <span className="font-heading text-3xl font-extrabold text-[#3A211E]">
                    {total.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className="text-xs text-right text-[#765B52] mt-1">
                  {isEn ? '(Includes VAT and nationwide COD delivery)' : '(Đã bao gồm VAT và phí vận chuyển COD)'}
                </p>
              </div>

              {/* Nút xác nhận đặt hàng */}
              <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading}
                className="w-full py-4 bg-[#3A211E] hover:bg-[#3A211E] text-white rounded-full font-bold text-base transition-colors shadow-[0_6px_20px_rgba(58,33,30,0.18)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isEn ? 'Processing order...' : 'Đang xử lý đơn hàng...'}</span>
                  </>
                ) : (
                  <span>{isEn ? 'CONFIRM ORDER (COD)' : 'XÁC NHẬN ĐẶT HÀNG (COD)'}</span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#765B52]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'No prepayment required. Pay upon delivery.' : 'Không cần chuyển khoản trước. Nhận hàng mới trả tiền.'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
