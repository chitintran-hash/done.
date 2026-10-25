"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  QrCode, 
  ArrowLeft, 
  TrendingUp, 
  Check, 
  X,
  Palette,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface PartnerService {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  capacity: number;
  approval_status: string;
  is_available: boolean;
  includes: string[];
}

interface CustomerCheckin {
  id: string;
  customerName: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  people: number;
  status: 'confirmed' | 'checked_in' | 'rescheduled' | 'cancelled';
}

export default function PartnerPortalPage() {
  const [partnerInfo] = useState({
    name: 'Nhà Gốm Nhỏ (Thảo Điền)',
    type: 'Studio Nghệ Thuật Thủ Công',
    address: '42 Đường số 12, P. Thảo Điền, TP. Thủ Đức',
    commission: 12,
    partnerId: '2b4c8e99-38ca-4853-8b31-04dbcdb4aeee'
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'checkin' | 'register'>('overview');
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<PartnerService[]>([]);
  const [checkins, setCheckins] = useState<CustomerCheckin[]>([]);
  const [inputTicketId, setInputTicketId] = useState('');
  const [checkinMessage, setCheckinMessage] = useState('');

  // Modal: Add New Service
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    type: 'Gốm',
    price: 249000,
    duration: '2 giờ',
    capacity: 8,
    area: 'Thảo Điền',
    includes: 'Đất sét, dụng cụ, tạp dề\nHướng dẫn tạo hình cơ bản\nNung và tráng men sản phẩm'
  });

  // Partner Registration Form State
  const [regForm, setRegForm] = useState({
    businessName: '',
    category: 'Studio Thủ Công',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    area: 'Thảo Điền, TP. Thủ Đức',
    notes: ''
  });
  const [regSuccess, setRegSuccess] = useState(false);

  const loadPartnerData = async () => {
    setLoading(true);
    try {
      // 1. Load services for this partner from Supabase
      const resServ = await fetch(`/api/tram-nghi/services?status=all&partner_id=${partnerInfo.partnerId}`);
      const dataServ = await resServ.json();
      if (dataServ.services) setServices(dataServ.services);

      // 2. Load bookings for this partner from Supabase
      const resBook = await fetch(`/api/tram-nghi/bookings?partner_id=${partnerInfo.partnerId}`);
      const dataBook = await resBook.json();
      if (dataBook.bookings) setCheckins(dataBook.bookings);
    } catch (err) {
      console.error('Error loading partner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  // Partner creates a new service -> Saved to Supabase (approval_status: pending)
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;
    try {
      const res = await fetch('/api/tram-nghi/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          studio: partnerInfo.name,
          seller_id: partnerInfo.partnerId,
          includes: newService.includes.split('\n').filter(Boolean),
          is_admin: false // Partner đăng cần Admin duyệt
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setCheckinMessage('✅ Đã gửi workshop lên hệ thống! Dịch vụ đang chờ Super Admin phê duyệt.');
        loadPartnerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Partner confirms check-in via Supabase API
  const handleCheckin = async (ticketId: string) => {
    const code = ticketId.trim();
    if (!code) return;
    try {
      const res = await fetch('/api/tram-nghi/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: code, action: 'check_in' })
      });
      const data = await res.json();
      if (res.ok) {
        setCheckinMessage(`✅ Check-in thành công cho vé ${code}! Trạng thái đã được đồng bộ lên Supabase.`);
        setInputTicketId('');
        loadPartnerData();
      } else {
        setCheckinMessage(`❌ ${data.error || 'Check-in không thành công'}`);
      }
    } catch (err) {
      setCheckinMessage('❌ Lỗi kết nối khi check-in.');
    }
  };

  // Partner submits registration form -> Saved to Supabase profiles
  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.businessName || !regForm.phone) return;
    try {
      const res = await fetch('/api/tram-nghi/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      if (res.ok) {
        setRegSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#293D32] font-sans">
      {/* Top Bar */}
      <header className="border-b border-[#DEDFD4] bg-[#FAF8F2] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#737B71] hover:text-[#293D32] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ Trạm nghỉ
          </Link>
          <div className="h-4 w-px bg-[#DEDFD4]" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#293D32]">
              ✳ trạm nghỉ<span className="text-[#EEB697]">.</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#355743] text-white">
              CỔNG ĐỐI TÁC (B2B)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="font-bold text-[#293D32]">{partnerInfo.name}</div>
            <div className="text-[#737B71]">{partnerInfo.type} · Hoa hồng {partnerInfo.commission}%</div>
          </div>
          <button 
            onClick={() => setActiveTab('register')}
            className="px-3.5 py-1.5 rounded-lg border border-[#355743] text-[#355743] hover:bg-[#E9EEE3] font-medium transition-colors"
          >
            Đăng ký đối tác mới
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {checkinMessage && (
          <div className="p-4 bg-[#E9EEE3] border border-[#CBD3BF] rounded-xl text-xs font-semibold text-[#293D32] flex items-center justify-between">
            <span>{checkinMessage}</span>
            <button onClick={() => setCheckinMessage('')} className="text-[#737B71] hover:text-[#293D32]">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DEDFD4] gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#355743] text-[#355743] font-semibold'
                : 'border-transparent text-[#737B71] hover:text-[#293D32]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Tổng Quan Cơ Sở
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'services'
                ? 'border-[#355743] text-[#355743] font-semibold'
                : 'border-transparent text-[#737B71] hover:text-[#293D32]'
            }`}
          >
            <Palette className="w-4 h-4" />
            Dịch Vụ Của Studio ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'checkin'
                ? 'border-[#355743] text-[#355743] font-semibold'
                : 'border-transparent text-[#737B71] hover:text-[#293D32]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Quét Vé Khách Đến ({checkins.length})
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'register'
                ? 'border-[#355743] text-[#355743] font-semibold'
                : 'border-transparent text-[#737B71] hover:text-[#293D32]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Đăng Ký Cơ Sở Mới
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
                <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Tổng khách đặt</span>
                <div className="text-3xl font-bold text-[#293D32] mt-2">{checkins.length} khách</div>
                <div className="text-xs text-[#355743] mt-2 font-medium">Đồng bộ từ Supabase</div>
              </div>

              <div className="bg-white border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
                <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Khách đã check-in</span>
                <div className="text-3xl font-bold text-blue-800 mt-2">
                  {checkins.filter(c => c.status === 'checked_in').length} khách
                </div>
                <div className="text-xs text-[#737B71] mt-2">Đã xác nhận tham gia workshop</div>
              </div>

              <div className="bg-white border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
                <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Dịch vụ đang mở bán</span>
                <div className="text-3xl font-bold text-emerald-700 mt-2">
                  {services.filter(s => s.approval_status === 'active').length} dịch vụ
                </div>
                <div className="text-xs text-[#737B71] mt-2">
                  {services.filter(s => s.approval_status === 'pending').length} dịch vụ chờ Admin duyệt
                </div>
              </div>

              <div className="bg-white border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
                <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Doanh thu tạm tính</span>
                <div className="text-3xl font-bold text-[#355743] mt-2">
                  {new Intl.NumberFormat('vi-VN').format(
                    checkins.reduce((sum, c: any) => sum + (c.total || 0), 0) * 0.88
                  )}đ
                </div>
                <div className="text-xs text-[#737B71] mt-2">Sau khi khấu trừ 12% hoa hồng sàn</div>
              </div>
            </div>

            {/* Quick check-in banner */}
            <div className="bg-[#E9EEE3] border border-[#CBD3BF] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold text-[#355743] tracking-wider">Tiếp nhận khách hàng</span>
                <h3 className="text-xl font-bold font-serif text-[#293D32] mt-1">Khách đang có mặt tại cửa?</h3>
                <p className="text-xs text-[#52634C] mt-1">
                  Nhập mã vé trên điện thoại của khách (bắt đầu bằng TN-...) để xác nhận check-in trực tiếp vào cơ sở dữ liệu.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('checkin')}
                className="px-5 py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-xs"
              >
                Mở màn hình Check-in ↗
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Services */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#293D32]">Danh Sách Workshop & Dịch Vụ Của Bạn</h2>
                <p className="text-xs text-[#737B71] mt-1">
                  Đăng workshop mới. Dịch vụ sau khi gửi sẽ chuyển sang trạng thái "Chờ duyệt" và hiển thị lên trang chủ khi Admin phê duyệt.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Đăng Workshop / Dịch Vụ Mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(s => (
                <div key={s.id} className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-xs bg-[#E9EEE3] text-[#355743] font-semibold">
                        {s.type} · {s.duration}
                      </span>
                      <h3 className="text-lg font-bold font-serif text-[#293D32] mt-2">{s.name}</h3>
                      <div className="text-base font-bold text-[#355743] mt-1">
                        {new Intl.NumberFormat('vi-VN').format(s.price)}đ <small className="font-normal text-xs text-[#737B71]">/ người</small>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.approval_status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        s.approval_status === 'pending' ? 'bg-amber-100 text-amber-900' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {s.approval_status === 'active' ? '✓ Đang mở bán' :
                         s.approval_status === 'pending' ? '⏳ Chờ Admin duyệt' : '✕ Bị từ chối'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#DEDFD4] pt-3 text-xs text-[#737B71]">
                    <div className="font-semibold text-[#293D32] mb-1">Sức chứa tối đa: {s.capacity} chỗ/khung giờ</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {s.includes.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Check-in */}
        {activeTab === 'checkin' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-semibold text-[#355743] tracking-wider">CỔNG TIẾP NHẬN KHÁCH ĐẾN</span>
              <h2 className="text-3xl font-bold font-serif text-[#293D32]">Quét Vé & Xác Nhận Check-in</h2>
              <p className="text-xs text-[#737B71]">
                Khách hàng xuất trình mã vé (ví dụ: TN-K8J2-A1B). Thao tác xác nhận sẽ được lưu trực tiếp vào Supabase.
              </p>
            </div>

            <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-sm space-y-4">
              <label className="block text-xs font-semibold uppercase text-[#737B71]">Nhập mã vé của khách</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Ví dụ: TN-K8J2-A1B"
                  value={inputTicketId}
                  onChange={e => setInputTicketId(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-[#CED4C7] rounded-lg bg-[#FAF8F2] font-mono text-sm uppercase"
                />
                <button
                  onClick={() => handleCheckin(inputTicketId)}
                  className="px-6 py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>

            {/* Live bookings list from Supabase */}
            <div className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#293D32]">Danh Sách Khách Hẹn Đã Đặt</h3>
              <div className="divide-y divide-[#E9EEE3]">
                {checkins.map(c => (
                  <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#355743]">{c.id}</div>
                      <div className="font-semibold text-sm text-[#293D32] mt-0.5">{c.customerName} · {c.phone}</div>
                      <div className="text-xs text-[#737B71]">{c.serviceName} · Khung {c.time} ({c.people} người)</div>
                    </div>
                    <div>
                      {c.status === 'checked_in' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" /> Đã check-in
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckin(c.id)}
                          className="px-3.5 py-1.5 bg-[#FAF8F2] border border-[#355743] text-[#355743] hover:bg-[#355743] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Check-in ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Register New Partner */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-semibold text-[#355743] tracking-wider">HỢP TÁC CÙNG PHÁT TRIỂN</span>
              <h2 className="text-3xl font-bold font-serif text-[#293D32]">Đăng Ký Gia Nhập Mạng Lưới Trạm Nghỉ</h2>
              <p className="text-xs text-[#737B71]">
                Hồ sơ sau khi gửi sẽ lưu trực tiếp vào cơ sở dữ liệu và chờ Super Admin phê duyệt.
              </p>
            </div>

            {regSuccess ? (
              <div className="bg-[#E9EEE3] border border-[#CBD3BF] rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#355743] mx-auto" />
                <h3 className="text-xl font-bold font-serif text-[#293D32]">Đã Gửi Hồ Sơ Lên Cơ Sở Dữ Liệu!</h3>
                <p className="text-xs text-[#52634C] max-w-md mx-auto">
                  Ban quản trị Trạm nghỉ sẽ xét duyệt hồ sơ của <b>{regForm.businessName}</b> trong trang Super Admin.
                </p>
                <button
                  onClick={() => setRegSuccess(false)}
                  className="px-5 py-2 bg-[#355743] text-white rounded-lg text-xs font-medium"
                >
                  Gửi hồ sơ khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterPartner} className="bg-white border border-[#DEDFD4] rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Tên Doanh Nghiệp / Thương Hiệu</label>
                  <input
                    required
                    placeholder="Ví dụ: Gác Màu Nghệ Thuật"
                    value={regForm.businessName}
                    onChange={e => setRegForm({ ...regForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Lĩnh Vực Hoạt Động</label>
                    <select
                      value={regForm.category}
                      onChange={e => setRegForm({ ...regForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    >
                      <option value="Studio Thủ Công">Studio Thủ Công (Gốm/Vẽ/Nến)</option>
                      <option value="Ẩm Thực F&B">Quán Cà Phê / Tiệm Bánh / F&B</option>
                      <option value="Thư Giãn & Spa">Tiệm Spa / Ngâm Chân Thảo Mộc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Khu Vực</label>
                    <input
                      placeholder="Thảo Điền, Phú Nhuận..."
                      value={regForm.area}
                      onChange={e => setRegForm({ ...regForm, area: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Họ Tên Người Đại Diện</label>
                    <input
                      required
                      placeholder="Nguyễn Văn A"
                      value={regForm.ownerName}
                      onChange={e => setRegForm({ ...regForm, ownerName: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Số Điện Thoại</label>
                    <input
                      required
                      placeholder="09xx xxx xxx"
                      value={regForm.phone}
                      onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Địa Chỉ Cơ Sở</label>
                  <input
                    required
                    placeholder="Số nhà, tên đường, phường, quận..."
                    value={regForm.address}
                    onChange={e => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-[#FAF8F2]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  Gửi Hồ Sơ Đăng Ký Lên Supabase ↗
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Modal: Partner Adds Service */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="text-xl font-bold font-serif text-[#293D32]">Đăng Workshop Mới (Chờ Admin Duyệt)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#737B71] hover:text-[#293D32]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Tên Dịch Vụ</label>
                <input
                  required
                  placeholder="Ví dụ: Workshop Nặn Cốc Cà Phê Mộc"
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Loại Dịch Vụ</label>
                  <select
                    value={newService.type}
                    onChange={e => setNewService({ ...newService, type: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                  >
                    <option value="Gốm">Làm Gốm</option>
                    <option value="Vẽ">Vẽ Tranh</option>
                    <option value="Nến">Làm Nến Thơm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Giá Vé (VNĐ/người)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newService.price}
                    onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Thời Lượng</label>
                  <input
                    placeholder="2 giờ, 90 phút..."
                    value={newService.duration}
                    onChange={e => setNewService({ ...newService, duration: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Sức Chứa / Khung Giờ</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newService.capacity}
                    onChange={e => setNewService({ ...newService, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-[#CED4C7] rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#DEDFD4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#DEDFD4] rounded-lg text-xs text-[#737B71]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#355743] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Gửi Duyệt Lên Sàn ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
