"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShoppingBag, 
  Ticket as TicketIcon, 
  User as UserIcon, 
  X, 
  Check, 
  Plus, 
  Copy, 
  Download, 
  RotateCcw,
  Coffee,
  Palette,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';

// Dữ liệu trải nghiệm cốt lõi
interface Experience {
  id: string;
  name: string;
  type: 'Gốm' | 'Vẽ' | 'Nến';
  price: number;
  duration: string;
  area: string;
  studio: string;
  image: string;
  tag: string;
  desc: string;
  moods: string[];
  capacity: number;
  includes: string[];
  note: string;
}

const defaultExperiences: Experience[] = [
  {
    id: 'gom',
    name: 'Chạm đất, chạm bình yên',
    type: 'Gốm',
    price: 249000,
    duration: '2 giờ',
    area: 'Thảo Điền',
    studio: 'Nhà Gốm Nhỏ',
    image: '/assets/pottery.jpg',
    tag: 'Một chút chậm lại',
    desc: 'Nặn một chiếc cốc nhỏ, để những bộn bề ở lại ngoài cửa.',
    moods: ['quiet', 'creative'],
    capacity: 8,
    includes: ['Đất sét, dụng cụ và tạp dề', 'Hướng dẫn tạo hình cho người mới', 'Một sản phẩm được nung và tráng men'],
    note: 'Nhận sản phẩm sau 10–14 ngày. Phí giao sản phẩm chưa bao gồm.'
  },
  {
    id: 've',
    name: 'Một chiều, nhiều sắc màu',
    type: 'Vẽ',
    price: 229000,
    duration: '2 giờ',
    area: 'Phú Nhuận',
    studio: 'Gác Màu',
    image: '/assets/art.jpg',
    tag: 'Không cần biết vẽ',
    desc: 'Tự do pha màu và mang một bức tranh của riêng mình về nhà.',
    moods: ['creative', 'friends'],
    capacity: 10,
    includes: ['Canvas 20 × 20 cm và màu acrylic', 'Cọ vẽ, tạp dề và hướng dẫn', 'Một ly trà và tranh mang về'],
    note: 'Màu có thể bám lên quần áo. Trạm đã chuẩn bị tạp dề cho bạn.'
  },
  {
    id: 'nen',
    name: 'Gói một chút hương thơm',
    type: 'Nến',
    price: 279000,
    duration: '90 phút',
    area: 'Bình Thạnh',
    studio: 'Tiệm Hương Dịu',
    image: '/assets/candle.jpg',
    tag: 'Một món quà tự tay làm',
    desc: 'Chọn mùi hương bạn thích, rót nến và viết một lời nhắn nhỏ.',
    moods: ['quiet', 'gift'],
    capacity: 6,
    includes: ['Sáp, hũ nến 120 g và hương liệu', 'Hướng dẫn phối mùi và rót nến', 'Hộp giấy và nhãn tên cá nhân'],
    note: 'Có sử dụng sáp nóng dưới sự hướng dẫn. Nến cần thời gian nguội trước khi mang về.'
  },
  {
    id: 'gomdoi',
    name: 'Hai chiếc cốc, một câu chuyện',
    type: 'Gốm',
    price: 269000,
    duration: '2 giờ 30',
    area: 'Thảo Điền',
    studio: 'Nhà Gốm Nhỏ',
    image: '/assets/pottery.jpg',
    tag: 'Hẹn bạn một buổi',
    desc: 'Mỗi người tạo một chiếc cốc, cùng nhau giữ lại một kỷ niệm.',
    moods: ['friends', 'gift'],
    capacity: 8,
    includes: ['Dụng cụ và đất sét cho mỗi người', 'Hướng dẫn làm cốc theo chủ đề đôi', 'Nung và tráng men một sản phẩm/người'],
    note: 'Giá theo người. Đặt ít nhất 2 người để trải nghiệm chủ đề đôi.'
  },
  {
    id: 'mau',
    name: 'Những tấm thiệp biết nói',
    type: 'Vẽ',
    price: 169000,
    duration: '90 phút',
    area: 'Phú Nhuận',
    studio: 'Gác Màu',
    image: '/assets/art.jpg',
    tag: 'Nhẹ nhàng cho ví',
    desc: 'Vẽ ba tấm thiệp màu nước cho mình và những người thương.',
    moods: ['gift', 'creative'],
    capacity: 10,
    includes: ['Giấy màu nước và bộ màu dùng tại buổi', 'Ba tấm thiệp kèm phong bì', 'Hướng dẫn kỹ thuật màu nước cơ bản'],
    note: 'Phù hợp với người bắt đầu. Toàn bộ vật liệu đã được chuẩn bị.'
  },
  {
    id: 'nenban',
    name: 'Hẹn nhau bên ánh nến',
    type: 'Nến',
    price: 259000,
    duration: '90 phút',
    area: 'Bình Thạnh',
    studio: 'Tiệm Hương Dịu',
    image: '/assets/candle.jpg',
    tag: 'Cùng nhau làm điều mới',
    desc: 'Một buổi phối hương và trang trí hũ nến cùng người bạn quý.',
    moods: ['friends', 'quiet'],
    capacity: 6,
    includes: ['Một hũ nến 100 g cho mỗi người', 'Nhãn trang trí và bảng phối hương', 'Một phần nước uống'],
    note: 'Giá theo người. Buổi trải nghiệm có người hướng dẫn.'
  }
];

// Phụ kiện & Dịch vụ liên kết F&B, Spa lân cận
interface ExtraItem {
  id: string;
  name: string;
  detail: string;
  price: number;
  category: 'fnb' | 'kit' | 'spa';
}

const extras: ExtraItem[] = [
  { id: 'tea', name: 'Trà trái cây nhiệt đới & Bánh ngọt', detail: 'Quán đối tác cách studio 100m, giao đúng giờ nghỉ', price: 35000, category: 'fnb' },
  { id: 'kit', name: 'Bộ sáng tạo mang về', detail: 'Một bộ nhỏ/người, theo hoạt động đã chọn', price: 69000, category: 'kit' },
  { id: 'card', name: 'Thiệp thủ công & Hộp quà tặng', detail: 'Bộ thiệp cao cấp kèm túi hoa khô', price: 25000, category: 'kit' },
  { id: 'spa', name: 'Gói ngâm chân thảo mộc 30 phút', detail: 'Tiệm Spa đối tác cạnh studio, thư giãn sau giờ làm gốm', price: 120000, category: 'spa' }
];

interface CartLine {
  kind: 'experience' | 'gift';
  key: string;
  id?: string;
  date?: string;
  time?: string;
  people?: number;
  extras?: string[];
  amount?: number;
  to?: string;
  from?: string;
  message?: string;
  theme?: string;
}

interface Order {
  id: string;
  name: string;
  email: string;
  note: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  status: 'confirmed' | 'cancelled' | 'checked_in' | 'rescheduled';
  created: string;
  changed: number[];
}

interface Poll {
  id: string;
  title: string;
  date: string;
  ids: string[];
  votes: Record<string, { name: string; choice: string }>;
}

export default function TramNghiHomePage() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [currentRoute, setCurrentRoute] = useState<'home' | 'explore' | 'builder' | 'friends' | 'gift' | 'tickets'>('home');
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [promoApplied, setPromoApplied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Experience | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filters State
  const [filterType, setFilterType] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'popular' | 'asc' | 'desc'>('popular');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [onlySaved, setOnlySaved] = useState(false);

  // Combo Builder State
  const [buildId, setBuildId] = useState('gom');
  const [buildPeople, setBuildPeople] = useState(2);
  const [buildDate, setBuildDate] = useState('');
  const [buildTime, setBuildTime] = useState('14:00');
  const [buildExtras, setBuildExtras] = useState<string[]>(['tea']);

  // Gift State
  const [giftTheme, setGiftTheme] = useState('sage');
  const [giftAmount, setGiftAmount] = useState(300000);
  const [giftTo, setGiftTo] = useState('');
  const [giftFrom, setGiftFrom] = useState('');
  const [giftMsg, setGiftMsg] = useState('Dành một ngày cho những điều khiến bạn vui nhé!');

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [quizResults, setQuizResults] = useState<Experience[]>([]);

  // AI Day Planner State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<any>(null);

  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Generate 14 upcoming dates
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const money = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live active services from Supabase
  const fetchActiveServices = async () => {
    try {
      const res = await fetch('/api/tram-nghi/services?status=active');
      const data = await res.json();
      if (data.services && data.services.length > 0) {
        const dbServices: Experience[] = data.services.map((s: any) => ({
          id: s.id,
          name: s.name,
          type: s.type || 'Gốm',
          price: Number(s.price),
          duration: s.duration || '2 giờ',
          area: s.area || 'Thảo Điền',
          studio: s.studio || 'Studio Đối Tác',
          image: s.image || (s.type === 'Vẽ' ? '/assets/art.jpg' : s.type === 'Nến' ? '/assets/candle.jpg' : '/assets/pottery.jpg'),
          tag: s.tag || 'Trải nghiệm chọn lọc',
          desc: s.desc || '',
          moods: s.moods || ['quiet', 'creative'],
          capacity: s.capacity || 8,
          includes: s.includes || ['Dụng cụ đầy đủ', 'Hướng dẫn tận tâm'],
          note: s.note || '',
          seller_id: s.seller_id
        }));

        // Merge DB services with default seed services if not already included
        const merged = [...dbServices];
        defaultExperiences.forEach(def => {
          if (!merged.some(m => m.id === def.id || m.name === def.name)) {
            merged.push(def);
          }
        });
        setExperiences(merged);
      }
    } catch (e) {
      console.warn('Using default experiences due to API error:', e);
    }
  };

  // Fetch live bookings from Supabase
  const fetchUserBookings = async (email?: string) => {
    try {
      const url = email ? `/api/tram-nghi/bookings?customer_email=${encodeURIComponent(email)}` : '/api/tram-nghi/bookings';
      const res = await fetch(url);
      const data = await res.json();
      if (data.bookings && data.bookings.length > 0) {
        const liveOrders: Order[] = data.bookings.map((b: any) => ({
          id: b.id,
          name: b.customerName,
          email: b.customerEmail,
          note: b.note || '',
          items: [{
            kind: 'experience',
            key: b.id,
            id: b.serviceId || 'gom',
            date: b.date,
            time: b.time,
            people: b.people,
            extras: []
          }],
          subtotal: b.total,
          discount: 0,
          status: b.status || 'confirmed',
          created: b.created || new Date().toISOString(),
          changed: []
        }));

        setOrders(prev => {
          const map = new Map<string, Order>();
          prev.forEach(o => map.set(o.id, o));
          liveOrders.forEach(o => map.set(o.id, o));
          return Array.from(map.values());
        });
      }
    } catch (e) {
      console.warn('Error loading live bookings:', e);
    }
  };

  // Load local state & sync with Supabase
  useEffect(() => {
    setBuildDate(availableDates[0]);
    try {
      const saved = localStorage.getItem('tram-nghi-demo-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.favorites) setFavorites(parsed.favorites);
        if (parsed.polls) setPolls(parsed.polls);
        if (parsed.promo) setPromoApplied(parsed.promo);
      }
    } catch {}

    // Initial fetch from live Supabase
    fetchActiveServices();
    fetchUserBookings();

    // Check Supabase Auth
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user?.email) fetchUserBookings(user.email);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u?.email) fetchUserBookings(u.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Save state
  const saveState = (newCart?: CartLine[], newOrders?: Order[], newFavs?: string[], newPolls?: Poll[], newPromo?: boolean) => {
    const stateToSave = {
      cart: newCart ?? cart,
      orders: newOrders ?? orders,
      favorites: newFavs ?? favorites,
      polls: newPolls ?? polls,
      promo: newPromo ?? promoApplied
    };
    localStorage.setItem('tram-nghi-demo-v1', JSON.stringify(stateToSave));
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
    setFavorites(next);
    saveState(undefined, undefined, next);
  };

  // Cart calculations
  const calculateLineCost = (x: CartLine) => {
    if (x.kind === 'gift') return x.amount || 0;
    const base = experiences.find(e => e.id === x.id)?.price || 0;
    const addOnsTotal = (x.extras || []).reduce((sum, extId) => sum + (extras.find(e => e.id === extId)?.price || 0), 0);
    return (base + addOnsTotal) * (x.people || 1);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + calculateLineCost(item), 0);
  const cartDiscount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const cartTotal = cartSubtotal - cartDiscount;

  // Add combo to cart
  const handleAddCombo = () => {
    const item: CartLine = {
      kind: 'experience',
      key: `C-${Date.now().toString(36).toUpperCase()}`,
      id: buildId,
      date: buildDate,
      time: buildTime,
      people: buildPeople,
      extras: [...buildExtras]
    };
    const next = [...cart, item];
    setCart(next);
    saveState(next);
    setShowCartModal(true);
    showToast('Đã thêm combo vào giỏ hàng');
  };

  // Add gift to cart
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTo.trim() || !giftFrom.trim()) {
      showToast('Vui lòng điền tên người gửi và người nhận.');
      return;
    }
    const item: CartLine = {
      kind: 'gift',
      key: `QT-${Date.now().toString(36).toUpperCase()}`,
      amount: giftAmount,
      theme: giftTheme,
      to: giftTo.trim(),
      from: giftFrom.trim(),
      message: giftMsg.trim()
    };
    const next = [...cart, item];
    setCart(next);
    saveState(next);
    setShowCartModal(true);
    showToast('Đã thêm phiếu quà tặng vào giỏ hàng');
  };

  // Checkout & Save to Supabase
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const note = (form.elements.namedItem('note') as HTMLTextAreaElement).value;

    let generatedBookingId = `TN-${Date.now().toString(36).toUpperCase()}`;

    // Prepare booking items for Supabase
    const bookingItems = cart.map(item => {
      const exp = experiences.find(e => e.id === item.id);
      return {
        id: item.id,
        name: item.kind === 'gift' ? `Phiếu quà tặng (${item.to})` : (exp?.name || 'Workshop Trạm Nghỉ'),
        studio: exp?.studio || 'Studio Đối Tác',
        seller_id: (exp as any)?.seller_id || '2b4c8e99-38ca-4853-8b31-04dbcdb4aeee',
        date: item.date || availableDates[0],
        time: item.time || '14:00',
        people: item.people || 1,
        price: calculateLineCost(item),
        extras: item.extras || []
      };
    });

    try {
      const res = await fetch('/api/tram-nghi/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          note,
          items: bookingItems,
          subtotal: cartSubtotal,
          discount: cartDiscount,
          total: cartTotal
        })
      });
      const data = await res.json();
      if (data.success && data.bookingCode) {
        generatedBookingId = data.bookingCode;
      }
    } catch (err) {
      console.warn('Saved locally, server sync failed:', err);
    }

    const newOrder: Order = {
      id: generatedBookingId,
      name,
      email,
      note,
      items: JSON.parse(JSON.stringify(cart)),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      status: 'confirmed',
      created: new Date().toISOString(),
      changed: []
    };

    const nextOrders = [newOrder, ...orders.filter(o => o.id !== generatedBookingId)];
    setOrders(nextOrders);
    setCart([]);
    setPromoApplied(false);
    saveState([], nextOrders, undefined, undefined, false);
    setShowCheckoutModal(false);
    setCurrentRoute('tickets');
    showToast(`Đặt chỗ thành công! Mã vé ${generatedBookingId} đã lưu vào hệ thống.`);
  };

  // AI Planner Execution (Calling Gemini or smart planning simulation)
  const handleRunAiPlanner = async (promptText: string) => {
    const text = promptText.trim();
    if (!text) return;
    setAiLoading(true);
    setAiPlanResult(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Bạn là trợ lý AI chuyên gia điều phối lịch trình của nền tảng "Trạm nghỉ" (lifestyle workshop, ẩm thực F&B, spa thư giãn tại TP.HCM). Khách hàng yêu cầu: "${text}". Hãy tạo một lịch trình hẹn hò/chữa lành hoàn chỉnh gồm 3 phần: 1. Workshop phù hợp (gốm/vẽ/nến) tại studio cụ thể; 2. Tiệm cà phê/trà bánh hoặc spa lân cận trong bán kính 300m; 3. Ước tính tổng chi phí và lý do lịch trình này giúp xoa dịu tâm trí. Trả lời bằng giọng văn nhẹ nhàng, ấm áp, đậm chất chữa lành của Trạm nghỉ.`
        })
      });
      const data = await res.json();
      if (data.reply) {
        setAiPlanResult({
          text: data.reply,
          workshopId: text.toLowerCase().includes('nến') ? 'nen' : text.toLowerCase().includes('vẽ') ? 've' : 'gom',
          people: text.includes('1') ? 1 : 2
        });
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback smart planner
      setAiPlanResult({
        text: `🌿 Trạm nghỉ đã thiết kế riêng cho bạn một buổi chiều thật trọn vẹn:\n\n1. 14:30 – 16:30: Workshop nặn gốm "Chạm đất, chạm bình yên" tại Nhà Gốm Nhỏ (Thảo Điền) — để đôi tay lấm lem đất sét và tâm trí được tĩnh lặng.\n2. 16:45 – 18:00: Thưởng thức Trà hoa cúc mật ong & bánh thủ công tại Tiệm Trà Yên (đối diện studio, đã kèm ưu đãi 15% cho khách Trạm nghỉ).\n3. 18:15 – 19:00: Gói ngâm chân thảo mộc xoa tan mỏi mệt tại Mộc Nhiên Spa ngay cạnh.\n\n✨ Tổng chi phí trọn gói ước tính: ~404.000đ/người. Bạn chỉ cần đến và tận hưởng một khoảng thở dịu dàng.`,
        workshopId: 'gom',
        people: 2
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Download Ticket HTML
  const downloadTicketHtml = (order: Order, itemIndex: number) => {
    const item = order.items[itemIndex];
    const exp = experiences.find(e => e.id === item.id);
    const content = item.kind === 'gift' 
      ? `<h1>Phiếu Quà Tặng Trạm Nghỉ</h1><h2>${money(item.amount || 0)}</h2><p>Gửi: ${item.to}</p><p>Lời nhắn: "${item.message}"</p><p>Từ: ${item.from}</p><p>Mã quà tặng: ${item.key}</p>`
      : `<h1>Vé Trải Nghiệm: ${exp?.name}</h1><p>Thời gian: ${item.date} lúc ${item.time}</p><p>Số lượng: ${item.people} người</p><p>Địa điểm: ${exp?.studio} (${exp?.area}, TP.HCM)</p><p>Người đặt: ${order.name} (${order.email})</p>`;

    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Vé Trạm Nghỉ - ${order.id}</title><style>body{font:16px/1.8 'Georgia',serif;background:#FAF8F2;color:#293D32;padding:40px;max-width:650px;margin:auto}article{border:1px solid #DEDFD4;padding:35px;border-radius:16px;background:white}h1{font-size:28px;color:#355743}small{color:#737B71;font-size:12px}</style></head><body><article><small>✳ TRẠM NGHỈ · VÉ XÁC NHẬN CHÍNH THỨC</small>${content}<hr style="border:none;border-top:1px dashed #DEDFD4;margin:25px 0"><p><small>Mã đơn hàng: <b>${order.id}</b> · Xuất ngày ${new Date().toLocaleDateString('vi-VN')}<br>Vui lòng xuất trình mã này khi đến studio. Dùng lệnh In của trình duyệt (Ctrl+P / Cmd+P) để lưu thành tệp PDF.</small></p></article></body></html>`;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ve-tram-nghi-${order.id}.html`;
    a.click();
    showToast('Đã tải vé HTML chuẩn in ấn');
  };

  // Reschedule Ticket with Supabase sync
  const handleReschedule = async (orderId: string, itemIdx: number) => {
    const newDate = prompt('Nhập ngày mới bạn muốn chuyển sang (Định dạng YYYY-MM-DD, ví dụ: ' + availableDates[2] + '):', availableDates[2]);
    if (!newDate) return;

    try {
      await fetch('/api/tram-nghi/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          action: 'reschedule',
          newDate
        })
      });
    } catch (err) {
      console.warn('Supabase reschedule error:', err);
    }

    const nextOrders = orders.map(o => {
      if (o.id === orderId) {
        const items = [...o.items];
        items[itemIdx] = { ...items[itemIdx], date: newDate };
        return { ...o, status: 'rescheduled' as const, items, changed: [...(o.changed || []), itemIdx] };
      }
      return o;
    });
    setOrders(nextOrders);
    saveState(undefined, nextOrders);
    showToast('Đã đổi lịch thành công sang ngày ' + newDate);
  };

  // Cancel Ticket with Supabase sync
  const handleCancelBooking = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy vé này?')) return;
    try {
      await fetch('/api/tram-nghi/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          action: 'cancel'
        })
      });
    } catch (err) {
      console.warn('Supabase cancel error:', err);
    }

    const nextOrders = orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);
    setOrders(nextOrders);
    saveState(undefined, nextOrders);
    showToast('Đã hủy vé thành công.');
  };

  // Filtered experiences
  const filteredExperiences = experiences
    .filter(e => filterType === 'Tất cả' || e.type === filterType)
    .filter(e => !onlySaved || favorites.includes(e.id))
    .filter(e => budgetFilter === 'all' || e.price <= Number(budgetFilter) * 1000)
    .filter(e => `${e.name} ${e.type} ${e.area} ${e.studio}`.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOption === 'asc' ? a.price - b.price : sortOption === 'desc' ? b.price - a.price : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#293D32] selection:bg-[#E9EEE3] selection:text-[#293D32] font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[#355743] text-[#F8F6E9] py-2 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-4">
        <span>Một chút chậm lại, một ngày đáng nhớ.</span>
        <span className="hidden sm:inline text-[#D8DFCD]">Khám phá khoảng nghỉ cho riêng bạn ↗</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#DEDFD4] px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        <button 
          onClick={() => setCurrentRoute('home')}
          className="flex items-center gap-2 text-2xl lg:text-3xl font-bold font-serif tracking-tight text-[#293D32] hover:opacity-90 transition-opacity"
        >
          <span className="text-[#355743] font-serif text-3xl font-normal">✳</span>
          trạm nghỉ<span className="text-[#EEB697] -ml-1">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-7 text-xs tracking-wide font-medium">
          <button 
            onClick={() => setCurrentRoute('explore')}
            className={`transition-colors py-1 ${currentRoute === 'explore' ? 'text-[#355743] font-bold border-b-2 border-[#355743]' : 'text-[#293D32] hover:text-[#355743]'}`}
          >
            Trải nghiệm
          </button>
          <button 
            onClick={() => setCurrentRoute('builder')}
            className={`transition-colors py-1 ${currentRoute === 'builder' ? 'text-[#355743] font-bold border-b-2 border-[#355743]' : 'text-[#293D32] hover:text-[#355743]'}`}
          >
            Tự tạo combo
          </button>
          <button 
            onClick={() => setCurrentRoute('friends')}
            className={`transition-colors py-1 ${currentRoute === 'friends' ? 'text-[#355743] font-bold border-b-2 border-[#355743]' : 'text-[#293D32] hover:text-[#355743]'}`}
          >
            Đi cùng bạn
          </button>
          <button 
            onClick={() => setCurrentRoute('gift')}
            className={`transition-colors py-1 ${currentRoute === 'gift' ? 'text-[#355743] font-bold border-b-2 border-[#355743]' : 'text-[#293D32] hover:text-[#355743]'}`}
          >
            Tặng khoảng nghỉ
          </button>
          <Link 
            href="/partner" 
            className="text-[#737B71] hover:text-[#355743] transition-colors"
          >
            Cổng đối tác ↗
          </Link>
          <Link 
            href="/admin/tram-nghi" 
            className="text-[#737B71] hover:text-[#355743] transition-colors"
          >
            Quản trị sàn ↗
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentRoute('tickets')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DEDFD4] hover:bg-[#E9EEE3] text-xs font-medium transition-colors"
          >
            <TicketIcon className="w-3.5 h-3.5 text-[#355743]" />
            <span className="hidden sm:inline">Vé của tôi</span>
          </button>

          <button 
            onClick={() => setShowCartModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DEDFD4] hover:bg-[#E9EEE3] text-xs font-medium transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#355743]" />
            <span>Giỏ hàng</span>
            <span className="w-5 h-5 rounded-full bg-[#355743] text-white text-[11px] font-bold grid place-items-center">
              {cart.length}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 text-xs font-medium text-[#355743] bg-[#E9EEE3] px-3 py-1.5 rounded-full">
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#355743] text-white hover:bg-[#293D32] text-xs font-medium transition-colors shadow-2xs"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#293D32] text-white px-5 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#EEB697]" />
          {toastMessage}
        </div>
      )}

      {/* ROUTE 1: HOME */}
      {currentRoute === 'home' && (
        <main className="space-y-16 lg:space-y-24">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#737B71] tracking-widest">
                <span className="w-6 h-px bg-current"></span>
                Dành một chút thời gian cho mình
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#293D32] leading-[1.15] tracking-tight">
                Bớt một chút vội.<br />
                Thêm một chút <br />
                <em className="text-[#355743] font-serif not-italic">thảnh thơi.</em>
              </h1>
              <p className="text-sm lg:text-base text-[#737B71] leading-relaxed max-w-lg">
                Để đôi tay làm điều mới, để tâm trí được nghỉ ngơi. Tìm một buổi làm gốm, vẽ tranh hay làm nến thơm, mang về một niềm vui cho riêng bạn.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => setCurrentRoute('explore')}
                  className="px-6 py-3.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"
                >
                  Tìm khoảng nghỉ của bạn ↗
                </button>
                <button 
                  onClick={() => { setQuizStep(0); setShowQuizModal(true); }}
                  className="px-5 py-3.5 border border-[#CBD3BF] bg-white hover:bg-[#E9EEE3] text-[#293D32] rounded-lg text-xs font-semibold tracking-wide transition-colors"
                >
                  Chưa biết chọn gì?
                </button>
                <button 
                  onClick={() => setShowAiModal(true)}
                  className="px-5 py-3.5 bg-[#EEB697] hover:bg-[#e4a785] text-[#293D32] rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#293D32]" />
                  Trạm AI Lên Lịch Trình 1-Chạm
                </button>
              </div>

              <div className="flex items-center gap-3 pt-4 text-xs text-[#737B71]">
                <div className="flex -space-x-1">
                  <span className="w-7 h-7 rounded-full bg-[#E5ECDC] grid place-items-center text-sm border border-[#FAF8F2]">✿</span>
                  <span className="w-7 h-7 rounded-full bg-[#EFDBC9] grid place-items-center text-sm border border-[#FAF8F2]">☼</span>
                  <span className="w-7 h-7 rounded-full bg-[#E8E2EE] grid place-items-center text-sm border border-[#FAF8F2]">✳</span>
                </div>
                <span>Đi một mình cũng vui. Đi cùng nhau càng nhớ.</span>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="relative h-[420px] sm:h-[480px] w-full rounded-t-[180px] rounded-b-2xl overflow-hidden shadow-md border-4 border-white">
                <Image 
                  src="/assets/pottery.jpg" 
                  alt="Làm gốm thủ công tại Trạm nghỉ" 
                  fill 
                  className="object-cover saturate-80"
                  priority
                />
              </div>
              <div className="absolute top-6 -left-4 sm:-left-6 w-20 h-20 rounded-full bg-[#EEB697] text-[#293D32] -rotate-12 grid place-content-center text-center text-[10px] font-bold shadow-md">
                HẸN MÌNH<br /><span className="text-xl">✳</span><br />KHOẢNG NGHỈ
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white border border-[#E3E2D8] rounded-xl p-4 shadow-xl flex items-center gap-3">
                <span className="text-2xl">☼</span>
                <div>
                  <div className="font-bold text-xs text-[#293D32]">Một buổi dành riêng cho bạn</div>
                  <div className="text-[11px] text-[#737B71]">Không cần giỏi. Chỉ cần muốn thử.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Value Props Strip */}
          <section className="border-y border-[#DEDFD4] py-4 px-6 bg-[#FAF8F2]">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs text-[#52634C] font-medium">
              <div className="flex items-center gap-2">
                <span className="text-[#355743] font-serif text-lg">✳</span>
                <span>Dành cho cả người mới bắt đầu (có người hướng dẫn)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#355743] font-serif text-lg">◷</span>
                <span>Chủ động chọn ngày giờ theo nhịp sống của bạn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#355743] font-serif text-lg">♧</span>
                <span>Một sản phẩm thủ công, một kỷ niệm mang về nhà</span>
              </div>
            </div>
          </section>

          {/* Featured Experiences */}
          <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#DEDFD4] pb-4">
              <div>
                <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">NHỮNG CUỘC HẸN NHO NHỎ</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#293D32] mt-1">Hôm nay, mình thử gì?</h2>
              </div>
              <button 
                onClick={() => setCurrentRoute('explore')}
                className="text-xs font-semibold text-[#355743] hover:underline flex items-center gap-1"
              >
                Xem tất cả 6 trải nghiệm ↗
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.slice(0, 3).map(exp => (
                <article key={exp.id} className="bg-white border border-[#DEDFD4] rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-[#E9EEE3]">
                      <Image 
                        src={exp.image} 
                        alt={exp.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#FAF8F2]/90 backdrop-blur-xs text-[#293D32] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {exp.tag}
                      </span>
                      <button 
                        onClick={() => toggleFavorite(exp.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 grid place-items-center text-sm transition-transform active:scale-90 ${favorites.includes(exp.id) ? 'text-rose-600' : 'text-[#737B71]'}`}
                      >
                        {favorites.includes(exp.id) ? '♥' : '♡'}
                      </button>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-semibold uppercase text-[#737B71] tracking-wider">
                        {exp.type} · {exp.area} · {exp.duration}
                      </div>
                      <h3 className="text-lg font-bold font-serif text-[#293D32]">{exp.name}</h3>
                      <p className="text-xs text-[#737B71] line-clamp-2 leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-[#FAF8F2] mt-2">
                    <div>
                      <div className="text-xs text-[#737B71]">Giá trải nghiệm</div>
                      <div className="text-base font-bold text-[#355743]">
                        {money(exp.price)} <small className="text-[10px] font-normal text-[#737B71]">/ người</small>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDetailModal(exp)}
                      className="px-3.5 py-1.5 bg-[#FAF8F2] hover:bg-[#355743] hover:text-white border border-[#DEDFD4] rounded-lg text-xs font-medium transition-colors"
                    >
                      Đặt chỗ ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Mood Selector Section */}
          <section className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="bg-[#E9EEE3] rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-[#CBD3BF]">
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[#355743] tracking-widest">MỖI NGƯỜI, MỘT KHOẢNG NGHỈ</span>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32]">Bạn đang muốn một ngày như thế nào?</h2>
                <p className="text-xs lg:text-sm text-[#52634C] max-w-md leading-relaxed">
                  Vài lựa chọn nhỏ để Trạm gợi ý trải nghiệm hợp sở thích, thời gian và túi tiền của bạn.
                </p>
                <button 
                  onClick={() => { setQuizStep(0); setShowQuizModal(true); }}
                  className="px-5 py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Làm bài trắc nghiệm 4 câu ↗
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'quiet', icon: '☁', label: 'Một chút yên tĩnh' },
                  { id: 'creative', icon: '✳', label: 'Thử điều mới mẻ' },
                  { id: 'friends', icon: '☻', label: 'Vui cùng bạn bè' },
                  { id: 'gift', icon: '✿', label: 'Tự tay làm quà' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => {
                      setQuizAnswers({ mood: m.id });
                      setQuizStep(1);
                      setShowQuizModal(true);
                    }}
                    className="p-4 bg-white/90 hover:bg-white border border-[#DEDFD4] rounded-xl text-left transition-all hover:-translate-y-0.5 shadow-2xs"
                  >
                    <span className="text-2xl block mb-2">{m.icon}</span>
                    <span className="text-xs font-semibold text-[#293D32]">{m.label} ↗</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Gift Voucher Banner */}
          <section className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="bg-[#EFDBC9] rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#DFCAA8]">
              <div className="space-y-3">
                <span className="text-xs uppercase font-semibold text-[#876144] tracking-widest">GỬI MỘT CHÚT QUAN TÂM</span>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#293D32]">Có những món quà là một khoảng thời gian.</h2>
                <p className="text-xs text-[#735A42] max-w-lg">
                  Tặng người thương một buổi làm điều họ thích, theo cách của họ. Tự chọn màu thiệp và viết lời chúc có sự hỗ trợ của AI.
                </p>
              </div>
              <button 
                onClick={() => setCurrentRoute('gift')}
                className="px-6 py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs"
              >
                Tặng một khoảng nghỉ ↗
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ROUTE 2: EXPLORE CATALOG */}
      {currentRoute === 'explore' && (
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">MỖI CUỘC HẸN LÀ MỘT KHỞI ĐẦU</span>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32] mt-1">Tìm khoảng nghỉ của bạn.</h1>
            <p className="text-xs text-[#737B71] mt-1">Những buổi trải nghiệm sáng tạo tại TP. Hồ Chí Minh với đầy đủ vật liệu và hướng dẫn.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-[#DEDFD4] shadow-2xs">
            <input 
              type="text"
              placeholder="Tìm theo tên workshop, khu vực (Thảo Điền, Phú Nhuận...)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-3.5 py-2 border border-[#DEDFD4] rounded-lg text-xs bg-[#FAF8F2]"
            />
            <select 
              value={budgetFilter}
              onChange={e => setBudgetFilter(e.target.value)}
              className="px-3 py-2 border border-[#DEDFD4] rounded-lg text-xs bg-[#FAF8F2]"
            >
              <option value="all">Mọi mức giá</option>
              <option value="200">Dưới 200.000đ/người</option>
              <option value="250">Đến 250.000đ/người</option>
            </select>
            <select 
              value={sortOption}
              onChange={e => setSortOption(e.target.value as any)}
              className="px-3 py-2 border border-[#DEDFD4] rounded-lg text-xs bg-[#FAF8F2]"
            >
              <option value="popular">Trạm gợi ý</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <button 
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${onlySaved ? 'bg-[#355743] text-white border-[#355743]' : 'border-[#DEDFD4] text-[#737B71] hover:bg-[#E9EEE3]'}`}
            >
              ♥ Đã lưu ({favorites.length})
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2">
            {['Tất cả', 'Gốm', 'Vẽ', 'Nến'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filterType === t ? 'bg-[#355743] text-white' : 'bg-white border border-[#DEDFD4] text-[#737B71] hover:bg-[#E9EEE3]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map(exp => (
              <article key={exp.id} className="bg-white border border-[#DEDFD4] rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-[#E9EEE3]">
                    <Image 
                      src={exp.image} 
                      alt={exp.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#FAF8F2]/90 backdrop-blur-xs text-[#293D32] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {exp.tag}
                    </span>
                    <button 
                      onClick={() => toggleFavorite(exp.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 grid place-items-center text-sm transition-transform active:scale-90 ${favorites.includes(exp.id) ? 'text-rose-600' : 'text-[#737B71]'}`}
                    >
                      {favorites.includes(exp.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-semibold uppercase text-[#737B71] tracking-wider">
                      {exp.type} · {exp.studio} ({exp.area}) · {exp.duration}
                    </div>
                    <h3 className="text-lg font-bold font-serif text-[#293D32]">{exp.name}</h3>
                    <p className="text-xs text-[#737B71] line-clamp-2 leading-relaxed">{exp.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#FAF8F2] mt-2">
                  <div>
                    <div className="text-xs text-[#737B71]">Giá vé</div>
                    <div className="text-base font-bold text-[#355743]">
                      {money(exp.price)} <small className="text-[10px] font-normal text-[#737B71]">/ người</small>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDetailModal(exp)}
                    className="px-4 py-2 bg-[#FAF8F2] hover:bg-[#355743] hover:text-white border border-[#DEDFD4] rounded-lg text-xs font-semibold transition-colors"
                  >
                    Xem & Đặt chỗ ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {/* ROUTE 3: COMBO BUILDER */}
      {currentRoute === 'builder' && (
        <main className="max-w-6xl mx-auto px-6 lg:px-12 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">BẠN CHỌN, TRẠM CHUẨN BỊ</span>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32] mt-1">Một buổi hẹn, đúng ý bạn.</h1>
            <p className="text-xs text-[#737B71] mt-1">Chọn hoạt động, ngày giờ và các tùy chọn bổ sung (ẩm thực, spa lân cận). Tổng tiền cập nhật tự động.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Options Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select activity */}
              <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#293D32]">
                  <span className="w-6 h-6 rounded-full bg-[#E9EEE3] text-[#355743] text-xs grid place-items-center">1</span>
                  Bắt đầu bằng hoạt động bạn thích
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {experiences.map(e => (
                    <button 
                      key={e.id}
                      onClick={() => setBuildId(e.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${buildId === e.id ? 'border-[#355743] bg-[#E9EEE3] ring-1 ring-[#355743]' : 'border-[#DEDFD4] bg-[#FAF8F2] hover:border-[#CBD3BF]'}`}
                    >
                      <div className="font-bold text-xs text-[#293D32]">{e.name}</div>
                      <div className="text-[11px] text-[#737B71] mt-1">{money(e.price)}/người · {e.type} ({e.duration})</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date, Time & People */}
              <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#293D32]">
                  <span className="w-6 h-6 rounded-full bg-[#E9EEE3] text-[#355743] text-xs grid place-items-center">2</span>
                  Hẹn bạn vào lúc nào?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#737B71] uppercase mb-1">Ngày trải nghiệm</label>
                    <select 
                      value={buildDate}
                      onChange={e => setBuildDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    >
                      {availableDates.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#737B71] uppercase mb-1">Khung giờ</label>
                    <select 
                      value={buildTime}
                      onChange={e => setBuildTime(e.target.value)}
                      className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    >
                      <option value="09:00">09:00 (Sáng thong thả)</option>
                      <option value="14:00">14:00 (Chiều mát mẻ)</option>
                      <option value="18:00">18:00 (Buổi tối ấm áp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#737B71] uppercase mb-1">Số người</label>
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      value={buildPeople}
                      onChange={e => setBuildPeople(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Add-ons (Cross-selling F&B / Spa) */}
              <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#293D32]">
                  <span className="w-6 h-6 rounded-full bg-[#E9EEE3] text-[#355743] text-xs grid place-items-center">3</span>
                  Thêm chút niềm vui (Ẩm thực & Thư giãn lân cận)
                </div>
                <div className="space-y-3">
                  {extras.map(ext => (
                    <label key={ext.id} className="flex items-center justify-between p-3.5 border border-[#DEDFD4] rounded-xl hover:bg-[#FAF8F2] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={buildExtras.includes(ext.id)}
                          onChange={e => {
                            if (e.target.checked) setBuildExtras([...buildExtras, ext.id]);
                            else setBuildExtras(buildExtras.filter(x => x !== ext.id));
                          }}
                          className="w-4 h-4 accent-[#355743]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#293D32]">{ext.name}</div>
                          <div className="text-[11px] text-[#737B71]">{ext.detail}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[#355743]">+{money(ext.price)}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Sticky Box */}
            <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-md space-y-4 sticky top-24">
              <span className="text-[10px] uppercase font-semibold text-[#737B71] tracking-widest">TỔNG KHOẢNG NGHỈ</span>
              {(() => {
                const exp = experiences.find(e => e.id === buildId);
                const extraItems = extras.filter(x => buildExtras.includes(x.id));
                const totalOnePerson = (exp?.price || 0) + extraItems.reduce((s, x) => s + x.price, 0);
                const grandTotal = totalOnePerson * buildPeople;

                return (
                  <div className="space-y-4">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-[#FAF8F2]">
                      <Image src={exp?.image || '/assets/pottery.jpg'} alt="Workshop" fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#293D32]">{exp?.name}</h3>
                      <div className="text-xs text-[#737B71] mt-1">{exp?.studio} ({exp?.area}) · {buildDate} lúc {buildTime}</div>
                    </div>

                    <div className="border-t border-[#DEDFD4] pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-[#737B71]">
                        <span>Workshop × {buildPeople} người</span>
                        <span className="font-semibold text-[#293D32]">{money((exp?.price || 0) * buildPeople)}</span>
                      </div>
                      {extraItems.map(ext => (
                        <div key={ext.id} className="flex justify-between text-[#737B71]">
                          <span>{ext.name} × {buildPeople}</span>
                          <span className="font-semibold text-[#293D32]">{money(ext.price * buildPeople)}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#DEDFD4] pt-3 flex justify-between text-base font-bold text-[#355743]">
                        <span>Tổng combo</span>
                        <span>{money(grandTotal)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleAddCombo}
                      className="w-full py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-xs"
                    >
                      Thêm combo vào giỏ ↗
                    </button>
                    <div className="text-[11px] text-center text-[#737B71]">
                      Thanh toán mô phỏng · Lưu giữ chỗ ngay lập tức
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </main>
      )}

      {/* ROUTE 4: GROUP VOTING */}
      {currentRoute === 'friends' && (
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">HẸN NHAU, BỚT PHÂN VÂN</span>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32] mt-1">Cả nhóm cùng chọn một niềm vui.</h1>
            <p className="text-xs text-[#737B71] mt-1">Tạo danh sách ngắn các workshop và để nhóm bạn cùng bỏ phiếu trước khi chốt lịch.</p>
          </div>

          <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#293D32]">Tạo Bảng Bình Chọn Mới</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experiences.map(e => (
                <div key={e.id} className="p-3 border border-[#DEDFD4] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#293D32]">{e.name}</div>
                    <div className="text-[11px] text-[#737B71]">{e.type} · {money(e.price)}/người</div>
                  </div>
                  <button 
                    onClick={() => {
                      setBuildId(e.id);
                      setCurrentRoute('builder');
                      showToast(`Đã chọn ${e.name}! Đang chuyển sang tạo combo...`);
                    }}
                    className="px-3 py-1 bg-[#E9EEE3] text-[#355743] font-semibold rounded-lg hover:bg-[#355743] hover:text-white transition-colors"
                  >
                    Chốt workshop này ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ROUTE 5: GIFT CARDS */}
      {currentRoute === 'gift' && (
        <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">TẶNG THỜI GIAN, GỬI QUAN TÂM</span>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32] mt-1">Một khoảng nghỉ cho người thương.</h1>
            <p className="text-xs text-[#737B71] mt-1">Người nhận có thể tự chọn trải nghiệm mình thích. Bạn chỉ cần chọn giá trị và gửi một lời chúc thật riêng.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <form onSubmit={handleAddGift} className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-2">1. Chọn giá trị quà tặng</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[200000, 300000, 500000, 1000000].map(v => (
                    <button 
                      key={v}
                      type="button"
                      onClick={() => setGiftAmount(v)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${giftAmount === v ? 'bg-[#355743] text-white border-[#355743]' : 'bg-[#FAF8F2] border-[#DEDFD4] text-[#293D32]'}`}
                    >
                      {money(v)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-2">2. Chọn màu thiệp</label>
                <div className="flex gap-3">
                  {[
                    { id: 'sage', color: '#E5ECDC', label: 'Xanh sage' },
                    { id: 'peach', color: '#EFDBC9', label: 'Cam đào' },
                    { id: 'lavender', color: '#E8E2EE', label: 'Tím nhạt' }
                  ].map(c => (
                    <button 
                      key={c.id}
                      type="button"
                      onClick={() => setGiftTheme(c.id)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${giftTheme === c.id ? 'border-[#355743] scale-110' : 'border-white'}`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#737B71] uppercase mb-1">Gửi đến</label>
                  <input 
                    required
                    placeholder="Tên người nhận"
                    value={giftTo}
                    onChange={e => setGiftTo(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737B71] uppercase mb-1">Từ</label>
                  <input 
                    required
                    placeholder="Tên của bạn"
                    value={giftFrom}
                    onChange={e => setGiftFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#737B71] uppercase">Lời nhắn của bạn</label>
                  <button 
                    type="button"
                    onClick={() => {
                      const wishes = [
                        "Dành một ngày thật thong thả cho những điều khiến bạn mỉm cười nhé!",
                        "Chúc bạn có một buổi sáng chậm rãi, nặn một chiếc cốc và tìm lại bình yên.",
                        "Hẹn nhau một chiều cuối tuần cùng làm nến thơm và quên hết muộn phiền."
                      ];
                      setGiftMsg(wishes[Math.floor(Math.random() * wishes.length)]);
                      showToast('AI đã tạo một lời chúc ngọt ngào!');
                    }}
                    className="text-[11px] text-[#355743] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#EEB697]" /> AI Gợi ý lời chúc
                  </button>
                </div>
                <textarea 
                  rows={3}
                  value={giftMsg}
                  onChange={e => setGiftMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Thêm phiếu quà tặng vào giỏ ({money(giftAmount)}) ↗
              </button>
            </form>

            {/* Live Card Preview */}
            <div className="sticky top-24">
              <span className="text-[10px] uppercase font-semibold text-[#737B71] tracking-widest block mb-2">XEM TRƯỚC THIỆP SỐ</span>
              <div 
                className="rounded-2xl p-8 text-center space-y-4 shadow-md border border-[#DEDFD4]"
                style={{ 
                  backgroundColor: giftTheme === 'sage' ? '#E5ECDC' : giftTheme === 'peach' ? '#EFDBC9' : '#E8E2EE'
                }}
              >
                <div className="text-[11px] uppercase tracking-widest text-[#52634C] font-semibold">TRẠM NGHỈ · MỘT MÓN QUÀ NHỎ</div>
                <div className="text-4xl text-[#355743] font-serif">✿</div>
                <h3 className="text-2xl font-serif font-bold text-[#293D32]">Tặng bạn một khoảng thảnh thơi.</h3>
                <div className="text-xs font-semibold text-[#293D32]">Gửi {giftTo || 'Người thương'}</div>
                <p className="text-xs text-[#52634C] italic max-w-sm mx-auto leading-relaxed">
                  "{giftMsg}"
                </p>
                <div className="text-2xl font-serif font-bold text-[#355743]">{money(giftAmount)}</div>
                <div className="text-xs text-[#737B71]">Một chút quan tâm từ {giftFrom || 'Bạn'}</div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ROUTE 6: TICKETS */}
      {currentRoute === 'tickets' && (
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-semibold text-[#737B71] tracking-widest">NHỮNG CUỘC HẸN ĐANG CHỜ</span>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#293D32] mt-1">Vé & Quà tặng của bạn.</h1>
            <p className="text-xs text-[#737B71] mt-1">Xem lại đơn, tải vé dạng file HTML có thể in sang PDF, hoặc đổi lịch khi có việc bận.</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-dashed border-[#CBD3BF] rounded-2xl p-12 text-center space-y-3">
              <div className="text-4xl text-[#355743]">♧</div>
              <h3 className="text-lg font-serif font-bold text-[#293D32]">Cuộc hẹn đầu tiên đang chờ bạn.</h3>
              <p className="text-xs text-[#737B71]">Thử đặt một trải nghiệm gốm, vẽ tranh hay nến thơm. Vé của bạn sẽ được lưu trữ tại đây.</p>
              <button 
                onClick={() => setCurrentRoute('explore')}
                className="px-5 py-2.5 bg-[#355743] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Khám phá trải nghiệm ↗
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-[#DEDFD4] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="bg-[#E9EEE3] px-6 py-3 border-b border-[#CBD3BF] flex flex-wrap justify-between items-center text-xs">
                    <span className="font-mono font-bold text-[#355743]">Mã đơn: {order.id}</span>
                    <span className="text-[#52634C]">{new Date(order.created).toLocaleDateString('vi-VN')} · Người đặt: {order.name}</span>
                  </div>

                  <div className="p-6 space-y-4">
                    {order.items.map((it, idx) => {
                      const exp = experiences.find(e => e.id === it.id);
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3 border-b border-[#FAF8F2] last:border-0">
                          <div>
                            <div className="font-serif font-bold text-lg text-[#293D32]">
                              {it.kind === 'gift' ? `Phiếu Quà Tặng cho ${it.to}` : exp?.name}
                            </div>
                            <div className="text-xs text-[#737B71] mt-0.5">
                              {it.kind === 'gift' 
                                ? `Trị giá ${money(it.amount || 0)} · Từ ${it.from}` 
                                : `${it.date} lúc ${it.time} · ${it.people} người · ${exp?.studio}`}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => downloadTicketHtml(order, idx)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#355743] text-[#355743] hover:bg-[#E9EEE3] rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Tải vé in PDF
                            </button>
                            {it.kind === 'experience' && order.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleReschedule(order.id, idx)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#CED4C7] hover:bg-[#FAF8F2] rounded-lg text-xs font-medium text-[#737B71] transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Đổi lịch
                              </button>
                            )}
                            {order.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleCancelBooking(order.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Hủy vé
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-2 flex justify-between items-center text-xs border-t border-[#DEDFD4]">
                      <span className="text-[#737B71]">Tổng thanh toán: <b className="text-[#355743] text-sm">{money(order.subtotal - order.discount)}</b></span>
                      <span className={`px-2.5 py-1 rounded-full font-medium ${
                        order.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        order.status === 'rescheduled' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status === 'checked_in' ? '✓ Đã Check-in' :
                         order.status === 'cancelled' ? '✕ Đã hủy vé' :
                         order.status === 'rescheduled' ? '↻ Đã đổi lịch' :
                         '● Đã xác nhận'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#DEDFD4] bg-[#FAF8F2] mt-24 py-12 px-6 lg:px-12 text-xs text-[#737B71]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-serif text-2xl font-bold text-[#293D32]">
              ✳ trạm nghỉ<span className="text-[#EEB697]">.</span>
            </div>
            <p className="leading-relaxed">Một khoảng thở, một chút vui.<br />Dành thời gian cho điều khiến bạn mỉm cười.</p>
          </div>

          <div>
            <div className="font-bold text-[#293D32] mb-3">Khám phá</div>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentRoute('explore')} className="hover:underline">Tất cả trải nghiệm</button></li>
              <li><button onClick={() => setCurrentRoute('builder')} className="hover:underline">Combo của riêng bạn</button></li>
              <li><button onClick={() => setCurrentRoute('gift')} className="hover:underline">Phiếu quà tặng</button></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#293D32] mb-3">Dành cho đối tác & Quản trị</div>
            <ul className="space-y-2">
              <li><Link href="/partner" className="text-[#355743] font-semibold hover:underline">Cổng đối tác Studio & F&B ↗</Link></li>
              <li><Link href="/admin/tram-nghi" className="text-[#355743] font-semibold hover:underline">Trang quản trị toàn sàn (Admin) ↗</Link></li>
              <li><Link href="/cupfy" className="text-[#737B71] hover:underline">Mã nguồn đồ án cũ (Cupfy) ↗</Link></li>
            </ul>
          </div>

          <div className="bg-[#E9EEE3] p-4 rounded-xl space-y-2 border border-[#CBD3BF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#355743]">BẢN DEMO HỌC PHẦN</span>
            <p className="text-[11px] leading-relaxed text-[#52634C]">
              Dịch vụ, địa điểm và giá là dữ liệu minh họa. Thanh toán mô phỏng, không thu tiền thật. Hệ thống tích hợp Next.js 16, Supabase và Gemini AI.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#DEDFD4] mt-8 pt-6 flex flex-wrap justify-between items-center gap-4 text-[11px]">
          <div>© 2026 Trạm nghỉ · Thiết kế cho những ngày cần một khoảng nghỉ.</div>
          <div className="text-[#355743] font-medium">Made with a little slowness ✳</div>
        </div>
      </footer>

      {/* MODAL: CART */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="font-serif text-2xl font-bold text-[#293D32]">Giỏ khoảng nghỉ ({cart.length})</h3>
              <button onClick={() => setShowCartModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-[#737B71] text-xs">Giỏ đang chờ một cuộc hẹn. Hãy chọn một workshop bạn thích nhé!</div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-[#E9EEE3]">
                  {cart.map(item => {
                    const exp = experiences.find(e => e.id === item.id);
                    return (
                      <div key={item.key} className="py-3 flex justify-between items-center gap-3">
                        <div>
                          <div className="font-serif font-bold text-sm text-[#293D32]">
                            {item.kind === 'gift' ? `Phiếu Quà Tặng (${item.to})` : exp?.name}
                          </div>
                          <div className="text-[11px] text-[#737B71]">
                            {item.kind === 'gift' ? `Từ ${item.from}` : `${item.date} lúc ${item.time} · ${item.people} người`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xs text-[#355743]">{money(calculateLineCost(item))}</div>
                          <button 
                            onClick={() => {
                              const next = cart.filter(x => x.key !== item.key);
                              setCart(next);
                              saveState(next);
                            }}
                            className="text-[10px] text-rose-700 hover:underline"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2">
                  <input 
                    placeholder="Nhập mã ưu đãi (Thử TRAM10)"
                    defaultValue={promoApplied ? 'TRAM10' : ''}
                    id="promoInput"
                    className="flex-1 px-3 py-1.5 border border-[#CED4C7] rounded-lg text-xs bg-white uppercase font-mono"
                  />
                  <button 
                    onClick={() => {
                      const input = (document.getElementById('promoInput') as HTMLInputElement).value.trim().toUpperCase();
                      if (input === 'TRAM10') {
                        setPromoApplied(true);
                        saveState(undefined, undefined, undefined, undefined, true);
                        showToast('Đã áp dụng mã giảm giá TRAM10 (-10%)');
                      } else {
                        showToast('Mã không hợp lệ. Hãy thử TRAM10.');
                      }
                    }}
                    className="px-4 py-1.5 bg-[#FAF8F2] border border-[#355743] text-[#355743] hover:bg-[#355743] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                <div className="border-t border-[#DEDFD4] pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#737B71]">
                    <span>Tạm tính</span>
                    <span>{money(cartSubtotal)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Ưu đãi demo TRAM10 (10%)</span>
                      <span>-{money(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[#355743] pt-1 border-t border-[#DEDFD4]">
                    <span>Thanh toán</span>
                    <span>{money(cartTotal)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowCartModal(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Tiến hành đặt chỗ ↗
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="font-serif text-2xl font-bold text-[#293D32]">Hẹn gặp bạn ở Trạm.</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Tên người đặt</label>
                <input 
                  required
                  placeholder="Ví dụ: Trần Gia Linh"
                  name="name"
                  defaultValue={user ? user.email?.split('@')[0] : ''}
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Email nhận vé (mô phỏng)</label>
                <input 
                  required
                  type="email"
                  name="email"
                  placeholder="ban@example.com"
                  defaultValue={user?.email || ''}
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Ghi chú cho studio (nếu có)</label>
                <textarea 
                  rows={2}
                  name="note"
                  placeholder="Ví dụ: Mình là người mới làm gốm lần đầu..."
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              <div className="p-3 bg-[#E9EEE3] rounded-xl text-[11px] text-[#52634C] space-y-1">
                <div className="font-bold">Chế độ giao dịch demo:</div>
                <div>Không trừ tiền thật. Đơn và vé được sinh mã tự động và lưu trên trình duyệt của bạn.</div>
              </div>

              <div className="border-t border-[#DEDFD4] pt-3 flex justify-between items-center font-bold text-sm text-[#355743]">
                <span>Tổng cộng:</span>
                <span className="text-lg">{money(cartTotal)}</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Xác nhận thanh toán demo ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#DEDFD4] pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#737B71] tracking-wider">{showDetailModal.type} · {showDetailModal.studio}</span>
                <h3 className="font-serif text-2xl font-bold text-[#293D32] mt-0.5">{showDetailModal.name}</h3>
              </div>
              <button onClick={() => setShowDetailModal(null)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#FAF8F2]">
              <Image src={showDetailModal.image} alt={showDetailModal.name} fill className="object-cover" />
            </div>

            <div className="text-xs text-[#737B71] leading-relaxed">{showDetailModal.desc}</div>

            <div className="space-y-2 border-t border-[#DEDFD4] pt-3 text-xs">
              <div className="font-bold text-[#293D32]">Buổi hẹn đã bao gồm:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#52634C]">
                {showDetailModal.includes.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#DEDFD4] pt-3 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-[#737B71]">Giá trải nghiệm</div>
                <div className="text-lg font-bold text-[#355743]">{money(showDetailModal.price)} <small className="text-xs font-normal">/ người</small></div>
              </div>
              <button 
                onClick={() => {
                  setBuildId(showDetailModal.id);
                  setShowDetailModal(null);
                  setCurrentRoute('builder');
                }}
                className="px-5 py-2.5 bg-[#355743] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Tự tạo combo & Đặt chỗ ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AI DAY PLANNER */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#CBD3BF] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#EEB697]" />
                <h3 className="font-serif text-2xl font-bold text-[#293D32]">Trạm AI Lên Lịch Trình 1-Chạm</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#737B71] leading-relaxed">
              Bạn chỉ cần mô tả ngày bạn muốn (khu vực, số người, tâm trạng, ngân sách). AI Gemini Flash sẽ kết hợp workshop + quán ăn/tiệm trà lân cận thành một ngày hoàn hảo.
            </p>

            <div className="space-y-3">
              <textarea 
                rows={3}
                placeholder="Ví dụ: Thứ 7 này mình hẹn hò 2 người ở Thảo Điền dưới 1 triệu, muốn làm nến và ăn tối lãng mạn..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#CED4C7] rounded-xl text-xs bg-white"
              />

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-[#737B71]">Gợi ý nhanh:</span>
                {[
                  'Hẹn hò 2 người Thảo Điền dưới 1 triệu',
                  'Đi 1 mình xả stress ở Bình Thạnh yên tĩnh',
                  'Nhóm 4 bạn thân ở Phú Nhuận thích vẽ tranh'
                ].map(s => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => {
                      setAiPrompt(s);
                      handleRunAiPlanner(s);
                    }}
                    className="px-2.5 py-1 bg-white border border-[#DEDFD4] hover:bg-[#E9EEE3] rounded-full text-[#355743]"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handleRunAiPlanner(aiPrompt)}
                disabled={aiLoading}
                className="w-full py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#EEB697]" />
                    Trạm AI đang tính toán khoảng cách & lên lịch trình...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#EEB697]" />
                    Lập Lịch Trình Ngay ↗
                  </>
                )}
              </button>
            </div>

            {aiPlanResult && (
              <div className="p-4 bg-white border border-[#CBD3BF] rounded-xl space-y-3 text-xs">
                <div className="font-serif font-bold text-sm text-[#355743] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Kế Hoạch Khoảng Nghỉ Dành Riêng Cho Bạn
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-[#293D32] text-[11px]">
                  {aiPlanResult.text}
                </div>
                <button 
                  onClick={() => {
                    setBuildId(aiPlanResult.workshopId || 'gom');
                    setBuildPeople(aiPlanResult.people || 2);
                    setShowAiModal(false);
                    setCurrentRoute('builder');
                    showToast('Đã áp dụng lịch trình vào bộ tạo combo!');
                  }}
                  className="w-full py-2 bg-[#EEB697] hover:bg-[#e4a785] text-[#293D32] rounded-lg font-bold text-xs shadow-2xs"
                >
                  Chọn Lịch Trình Này & Đặt Chỗ ↗
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: QUIZ (4 STEPS) */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#CBD3BF] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#355743]">GỢI Ý TỰ ĐỘNG · BƯỚC {quizStep + 1}/4</span>
                <h3 className="font-serif text-xl font-bold text-[#293D32] mt-0.5">
                  {quizStep === 0 && 'Bạn muốn một khoảng nghỉ thế nào?'}
                  {quizStep === 1 && 'Bạn sẽ đi cùng ai?'}
                  {quizStep === 2 && 'Ngân sách cho mỗi người?'}
                  {quizStep === 3 && 'Bạn thích khung giờ nào?'}
                </h3>
              </div>
              <button onClick={() => setShowQuizModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizStep === 0 && [
                { id: 'quiet', title: '☁ Một chút yên tĩnh', desc: 'Làm gốm hoặc nến thơm một mình' },
                { id: 'creative', title: '✳ Thử điều mới mẻ', desc: 'Khám phá sắc màu hội họa' },
                { id: 'friends', title: '☻ Vui cùng bạn bè', desc: 'Cùng nhau nặn cốc hoặc vẽ tranh' },
                { id: 'gift', title: '✿ Tự tay làm quà', desc: 'Rót nến thơm và viết thiệp' },
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => {
                    setQuizAnswers({ ...quizAnswers, mood: opt.id });
                    setQuizStep(1);
                  }}
                  className="p-3.5 bg-white border border-[#DEDFD4] hover:border-[#355743] hover:bg-[#E9EEE3] rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[#293D32]">{opt.title}</div>
                  <div className="text-[11px] text-[#737B71] mt-0.5">{opt.desc}</div>
                </button>
              ))}

              {quizStep === 1 && [
                { val: 1, title: 'Một mình', desc: 'Hẹn hò với chính bản thân' },
                { val: 2, title: 'Hai người', desc: 'Thêm một kỷ niệm đôi' },
                { val: 3, title: 'Nhóm 3 người', desc: 'Hội bạn thân thiết' },
                { val: 4, title: 'Nhóm 4 người', desc: 'Càng đông càng vui' },
              ].map(opt => (
                <button 
                  key={opt.val}
                  onClick={() => {
                    setQuizAnswers({ ...quizAnswers, people: opt.val });
                    setQuizStep(2);
                  }}
                  className="p-3.5 bg-white border border-[#DEDFD4] hover:border-[#355743] hover:bg-[#E9EEE3] rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[#293D32]">{opt.title}</div>
                  <div className="text-[11px] text-[#737B71] mt-0.5">{opt.desc}</div>
                </button>
              ))}

              {quizStep === 2 && [
                { val: 200000, title: 'Dưới 200.000đ', desc: 'Tiết kiệm, vẽ thiệp màu nước' },
                { val: 250000, title: 'Đến 250.000đ', desc: 'Hợp lý cho gốm & vẽ tranh' },
                { val: 300000, title: 'Đến 300.000đ', desc: 'Thoải mái thử nến thơm cao cấp' },
                { val: 500000, title: 'Trên 300.000đ', desc: 'Combo đầy đủ trà bánh & spa' },
              ].map(opt => (
                <button 
                  key={opt.val}
                  onClick={() => {
                    setQuizAnswers({ ...quizAnswers, budget: opt.val });
                    setQuizStep(3);
                  }}
                  className="p-3.5 bg-white border border-[#DEDFD4] hover:border-[#355743] hover:bg-[#E9EEE3] rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[#293D32]">{opt.title}</div>
                  <div className="text-[11px] text-[#737B71] mt-0.5">{opt.desc}</div>
                </button>
              ))}

              {quizStep === 3 && [
                { val: '09:00', title: '09:00 Sáng', desc: 'Một buổi sáng trong lành' },
                { val: '14:00', title: '14:00 Chiều', desc: 'Một chiều thảnh thơi' },
                { val: '18:00', title: '18:00 Tối', desc: 'Hẹn nhau sau giờ học/làm' },
              ].map(opt => (
                <button 
                  key={opt.val}
                  onClick={() => {
                    const finalAnswers = { ...quizAnswers, time: opt.val };
                    setQuizAnswers(finalAnswers);
                    // Match recommended
                    const match = experiences.find(e => e.price <= (finalAnswers.budget || 300000)) || experiences[0];
                    setBuildId(match.id);
                    setBuildPeople(finalAnswers.people || 2);
                    setBuildTime(opt.val);
                    setShowQuizModal(false);
                    setCurrentRoute('builder');
                    showToast(`Trạm gợi ý "${match.name}" phù hợp với bạn!`);
                  }}
                  className="p-3.5 bg-white border border-[#DEDFD4] hover:border-[#355743] hover:bg-[#E9EEE3] rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[#293D32]">{opt.title}</div>
                  <div className="text-[11px] text-[#737B71] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUTH SUPABASE */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#CBD3BF] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#293D32]">
                {authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthLoading(true);
                setAuthError('');
                const supabase = createClient();
                try {
                  if (authMode === 'login') {
                    const { error } = await supabase.auth.signInWithPassword({
                      email: authEmail,
                      password: authPass
                    });
                    if (error) throw error;
                    showToast('Đăng nhập thành công!');
                  } else {
                    const { error } = await supabase.auth.signUp({
                      email: authEmail,
                      password: authPass
                    });
                    if (error) throw error;
                    showToast('Đăng ký thành công!');
                  }
                  setShowAuthModal(false);
                } catch (err: any) {
                  setAuthError(err.message || 'Lỗi xác thực');
                } finally {
                  setAuthLoading(false);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-[#737B71] mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737B71] mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  required
                  value={authPass}
                  onChange={e => setAuthPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              {authError && (
                <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                  {authError}
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                {authLoading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
              </button>

              <div className="text-center text-[11px] text-[#737B71] pt-2">
                {authMode === 'login' ? (
                  <>Chưa có tài khoản? <button type="button" onClick={() => setAuthMode('signup')} className="text-[#355743] font-semibold underline">Đăng ký ngay</button></>
                ) : (
                  <>Đã có tài khoản? <button type="button" onClick={() => setAuthMode('login')} className="text-[#355743] font-semibold underline">Đăng nhập</button></>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
