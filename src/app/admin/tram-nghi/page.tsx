"use client";

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Ticket, 
  DollarSign, 
  Palette, 
  Check, 
  X,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Enterprise {
  id: string;
  name: string;
  ownerName?: string;
  email?: string;
  category: string;
  area: string;
  address: string;
  phone: string;
  commission: number;
  status: 'active' | 'pending' | 'suspended';
  createdDate: string;
  servicesCount?: number;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  capacity: number;
  area: string;
  studio: string;
  approval_status: 'active' | 'pending' | 'rejected';
  is_available: boolean;
}

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  studioName: string;
  date: string;
  time: string;
  people: number;
  total: number;
  status: 'confirmed' | 'checked_in' | 'rescheduled' | 'cancelled';
  created: string;
}

export default function AdminTramNghiPage() {
  const [activeTab, setActiveTab] = useState<'enterprises' | 'services' | 'bookings'>('enterprises');
  const [loading, setLoading] = useState(true);

  // Live Data from Supabase
  const [stats, setStats] = useState<any>({
    totalPartners: 0,
    activePartners: 0,
    pendingPartners: 0,
    totalServices: 0,
    activeServices: 0,
    pendingServices: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    gmv: 0,
    commission: 0,
    occupancyRate: 0
  });
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [actionMessage, setActionMessage] = useState('');

  // Modals
  const [showAddEnterpriseModal, setShowAddEnterpriseModal] = useState(false);
  const [newEnt, setNewEnt] = useState({
    businessName: '',
    category: 'Studio Thủ Công',
    area: 'Thảo Điền, TP. Thủ Đức',
    address: '',
    phone: '',
    ownerName: '',
    email: '',
    commission: 12
  });

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    type: 'Gốm',
    price: 249000,
    duration: '2 giờ',
    capacity: 8,
    area: 'Thảo Điền',
    studio: 'Nhà Gốm Nhỏ',
    includes: 'Đất sét, dụng cụ, tạp dề\nHướng dẫn tạo hình cơ bản'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Stats
      const resStats = await fetch('/api/tram-nghi/stats');
      const dataStats = await resStats.json();
      if (dataStats.stats) setStats(dataStats.stats);

      // 2. Load Partners
      const resPartners = await fetch('/api/tram-nghi/partners');
      const dataPartners = await resPartners.json();
      if (dataPartners.partners) setEnterprises(dataPartners.partners);

      // 3. Load All Services
      const resServices = await fetch('/api/tram-nghi/services?status=all');
      const dataServices = await resServices.json();
      if (dataServices.services) setServices(dataServices.services);

      // 4. Load Bookings
      const resBookings = await fetch('/api/tram-nghi/bookings');
      const dataBookings = await resBookings.json();
      if (dataBookings.bookings) setBookings(dataBookings.bookings);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };

  // Admin approves / toggles partner status in Supabase
  const handleTogglePartner = async (partnerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/tram-nghi/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: partnerId, status: nextStatus })
      });
      if (res.ok) {
        showFeedback(`Đã cập nhật trạng thái đối tác sang: ${nextStatus === 'active' ? 'Đã duyệt' : 'Tạm dừng'}`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin approves / rejects service in Supabase
  const handleApproveService = async (serviceId: string, approval_status: 'active' | 'rejected') => {
    try {
      const res = await fetch('/api/tram-nghi/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId, approval_status })
      });
      if (res.ok) {
        showFeedback(approval_status === 'active' ? 'Đã duyệt dịch vụ lên sàn!' : 'Đã từ chối dịch vụ');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin creates enterprise in Supabase
  const handleAddEnterprise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tram-nghi/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnt)
      });
      if (res.ok) {
        showFeedback('Đã thêm doanh nghiệp vào cơ sở dữ liệu!');
        setShowAddEnterpriseModal(false);
        setNewEnt({ businessName: '', category: 'Studio Thủ Công', area: 'Thảo Điền', address: '', phone: '', ownerName: '', email: '', commission: 12 });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin creates service in Supabase
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tram-nghi/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          includes: newService.includes.split('\n').filter(Boolean),
          is_admin: true
        })
      });
      if (res.ok) {
        showFeedback('Đã tạo workshop và mở bán trực tiếp lên sàn!');
        setShowAddServiceModal(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Action Notification */}
      {actionMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#355743] text-white px-5 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#EEB697]" />
          {actionMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#355743]">
            <span className="w-2 h-2 rounded-full bg-[#355743] animate-pulse"></span>
            Super Admin Portal · Kết nối Supabase PostgreSQL Trực Tiếp
          </div>
          <h1 className="text-3xl font-bold text-[#293D32] mt-1 font-serif">Quản Trị Mạng Lưới Trạm Nghỉ</h1>
          <p className="text-sm text-[#737B71] mt-1">
            Dữ liệu đồng bộ trực tiếp giữa Khách hàng (Customer), Đối tác (Partner) và Ban quản trị.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#DEDFD4] hover:bg-[#FAF8F2] rounded-lg text-xs font-semibold text-[#293D32] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#355743]' : ''}`} />
            Làm mới
          </button>
          <button 
            onClick={() => setShowAddEnterpriseModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#355743] hover:bg-[#293D32] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Thêm Doanh Nghiệp
          </button>
          <button 
            onClick={() => setShowAddServiceModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF8F2] hover:bg-[#E9EEE3] text-[#293D32] border border-[#DEDFD4] rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4 text-[#355743]" />
            Tạo Workshop Mới
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Realtime from Supabase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Doanh nghiệp đối tác</span>
            <Building2 className="w-5 h-5 text-[#355743]" />
          </div>
          <div className="text-3xl font-bold text-[#293D32] mt-3">{stats.totalPartners} cơ sở</div>
          <div className="text-xs text-[#52634C] mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {stats.activePartners} đối tác đang hoạt động ({stats.pendingPartners} chờ duyệt)
          </div>
        </div>

        <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Workshop & Dịch vụ</span>
            <Palette className="w-5 h-5 text-[#355743]" />
          </div>
          <div className="text-3xl font-bold text-[#293D32] mt-3">{stats.totalServices} dịch vụ</div>
          <div className="text-xs text-[#737B71] mt-2">
            {stats.activeServices} đang mở bán · {stats.pendingServices} chờ Admin duyệt
          </div>
        </div>

        <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Booking trên hệ thống</span>
            <Ticket className="w-5 h-5 text-[#355743]" />
          </div>
          <div className="text-3xl font-bold text-[#293D32] mt-3">{stats.totalBookings} lượt đặt</div>
          <div className="text-xs text-emerald-700 mt-2 font-medium">
            {stats.confirmedBookings} đơn thành công · Công suất lấp đầy: {stats.occupancyRate}%
          </div>
        </div>

        <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737B71] uppercase tracking-wider">Tổng GMV toàn sàn</span>
            <DollarSign className="w-5 h-5 text-[#355743]" />
          </div>
          <div className="text-3xl font-bold text-[#293D32] mt-3">
            {new Intl.NumberFormat('vi-VN').format(stats.gmv)}đ
          </div>
          <div className="text-xs text-[#876144] mt-2 font-medium">
            Hoa hồng sàn 12%: ~{new Intl.NumberFormat('vi-VN').format(stats.commission)}đ
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DEDFD4] gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('enterprises')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'enterprises'
              ? 'border-[#355743] text-[#355743] font-semibold'
              : 'border-transparent text-[#737B71] hover:text-[#293D32]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Doanh Nghiệp Đối Tác ({enterprises.length})
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
          Quản Lý Workshop ({services.length})
          {stats.pendingServices > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
              {stats.pendingServices} chờ duyệt
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-[#355743] text-[#355743] font-semibold'
              : 'border-transparent text-[#737B71] hover:text-[#293D32]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Booking & Vé Toàn Sàn ({bookings.length})
        </button>
      </div>

      {/* TAB 1: ENTERPRISES */}
      {activeTab === 'enterprises' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#293D32]">Danh Sách Đối Tác Cung Ứng Đăng Ký (B2B)</h3>
            <span className="text-xs text-[#737B71]">Bấm vào nút thao tác để duyệt hoặc tạm dừng đối tác</span>
          </div>

          <div className="bg-white border border-[#DEDFD4] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F2] border-b border-[#DEDFD4] text-xs uppercase text-[#737B71]">
                  <tr>
                    <th className="px-5 py-3.5">Cơ Sở / Doanh Nghiệp</th>
                    <th className="px-5 py-3.5">Loại Hình</th>
                    <th className="px-5 py-3.5">Địa Chỉ & Khu Vực</th>
                    <th className="px-5 py-3.5">Số Điện Thoại</th>
                    <th className="px-5 py-3.5">Trạng Thái</th>
                    <th className="px-5 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EEE3]">
                  {enterprises.map(ent => (
                    <tr key={ent.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#293D32]">{ent.name}</div>
                        <div className="text-xs text-[#737B71]">Chủ cơ sở: {ent.ownerName} · Tham gia {ent.createdDate}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9EEE3] text-[#355743]">
                          {ent.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#52634C]">
                        <div className="font-medium text-[#293D32]">{ent.area}</div>
                        <div className="text-[#737B71]">{ent.address}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#293D32]">{ent.phone}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          ent.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          ent.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ent.status === 'active' ? 'bg-emerald-600' :
                            ent.status === 'pending' ? 'bg-amber-600' : 'bg-rose-600'
                          }`}></span>
                          {ent.status === 'active' ? 'Đã phê duyệt' : ent.status === 'pending' ? 'Chờ Admin duyệt' : 'Đang tạm khóa'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {ent.status === 'pending' ? (
                          <button
                            onClick={() => handleTogglePartner(ent.id, 'pending')}
                            className="px-3 py-1 bg-[#355743] text-white hover:bg-[#293D32] rounded-lg text-xs font-semibold"
                          >
                            Phê duyệt ngay
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTogglePartner(ent.id, ent.status)}
                            className="text-xs text-[#355743] hover:underline font-semibold"
                          >
                            {ent.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES & APPROVAL */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#293D32]">Quản Lý Dịch Vụ & Phê Duyệt Workshop</h3>
              <p className="text-xs text-[#737B71]">Khi Admin duyệt dịch vụ ở đây, workshop sẽ lập tức xuất hiện trên Customer Portal</p>
            </div>
          </div>

          <div className="bg-white border border-[#DEDFD4] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F2] border-b border-[#DEDFD4] text-xs uppercase text-[#737B71]">
                  <tr>
                    <th className="px-5 py-3.5">Tên Workshop / Dịch Vụ</th>
                    <th className="px-5 py-3.5">Đơn Vị & Địa Điểm</th>
                    <th className="px-5 py-3.5">Thể Loại</th>
                    <th className="px-5 py-3.5">Giá Niêm Yết</th>
                    <th className="px-5 py-3.5">Trạng Thái Phê Duyệt</th>
                    <th className="px-5 py-3.5 text-right">Hành Động Của Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EEE3]">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#293D32]">{s.name}</div>
                        <div className="text-xs text-[#737B71]">Thời lượng: {s.duration} · Sức chứa: {s.capacity} chỗ/buổi</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#52634C]">
                        <div className="font-medium text-[#293D32]">{s.studio}</div>
                        <div className="text-[#737B71]">{s.area}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded text-xs bg-[#E9EEE3] text-[#355743] font-medium">
                          {s.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#355743]">
                        {new Intl.NumberFormat('vi-VN').format(s.price)}đ
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          s.approval_status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          s.approval_status === 'pending' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {s.approval_status === 'active' ? '✓ Đang mở bán trên sàn' :
                           s.approval_status === 'pending' ? '⏳ Chờ Admin duyệt' : '✕ Bị từ chối'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {s.approval_status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApproveService(s.id, 'active')}
                              className="px-3 py-1 bg-[#355743] text-white hover:bg-[#293D32] rounded-lg text-xs font-semibold"
                            >
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => handleApproveService(s.id, 'rejected')}
                              className="px-2.5 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#737B71]">Đã kiểm duyệt</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#293D32]">Toàn Bộ Lượt Đặt Chỗ (Đồng Bộ Trực Tiếp)</h3>
            <span className="text-xs text-[#737B71]">Customer đặt ➔ Hiển thị ngay tại đây</span>
          </div>

          <div className="bg-white border border-[#DEDFD4] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F2] border-b border-[#DEDFD4] text-xs uppercase text-[#737B71]">
                  <tr>
                    <th className="px-5 py-3.5">Mã Vé</th>
                    <th className="px-5 py-3.5">Khách Hàng</th>
                    <th className="px-5 py-3.5">Workshop</th>
                    <th className="px-5 py-3.5">Lịch Hẹn</th>
                    <th className="px-5 py-3.5">Số Khách</th>
                    <th className="px-5 py-3.5">Tổng Tiền</th>
                    <th className="px-5 py-3.5 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EEE3]">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#355743]">{b.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#293D32]">{b.customerName}</div>
                        <div className="text-xs text-[#737B71]">{b.customerEmail}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#293D32]">{b.serviceName}</div>
                        <div className="text-xs text-[#737B71]">{b.studioName}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#52634C]">{b.date} · <b>{b.time}</b></td>
                      <td className="px-5 py-4 text-xs font-semibold">{b.people} người</td>
                      <td className="px-5 py-4 font-bold text-[#355743]">
                        {new Intl.NumberFormat('vi-VN').format(b.total)}đ
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'rescheduled' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {b.status === 'checked_in' ? '✓ Đã check-in tham gia' :
                           b.status === 'confirmed' ? 'Đã xác nhận' :
                           b.status === 'rescheduled' ? 'Đã đổi lịch' : 'Đã hủy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Enterprise */}
      {showAddEnterpriseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="text-xl font-bold font-serif text-[#293D32]">Thêm Doanh Nghiệp / Cơ Sở Mới</h3>
              <button onClick={() => setShowAddEnterpriseModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddEnterprise} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Tên Doanh Nghiệp</label>
                <input 
                  required
                  value={newEnt.businessName}
                  onChange={e => setNewEnt({ ...newEnt, businessName: e.target.value })}
                  placeholder="Ví dụ: Gác Màu Nghệ Thuật"
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Khu Vực</label>
                  <input 
                    value={newEnt.area}
                    onChange={e => setNewEnt({ ...newEnt, area: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Số Điện Thoại</label>
                  <input 
                    required
                    value={newEnt.phone}
                    onChange={e => setNewEnt({ ...newEnt, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Địa Chỉ Chi Tiết</label>
                <input 
                  value={newEnt.address}
                  onChange={e => setNewEnt({ ...newEnt, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#355743] text-white rounded-lg text-xs font-bold mt-2">
                Lưu Vào Cơ Sở Dữ Liệu ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#DEDFD4] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#DEDFD4] pb-3">
              <h3 className="text-xl font-bold font-serif text-[#293D32]">Tạo Workshop / Dịch Vụ Mới</h3>
              <button onClick={() => setShowAddServiceModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Tên Dịch Vụ</label>
                <input 
                  required
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Ví dụ: Workshop Tạo Hình Đất Sét Wabi-Sabi"
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Thể Loại</label>
                  <select 
                    value={newService.type}
                    onChange={e => setNewService({ ...newService, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Gốm">Làm Gốm</option>
                    <option value="Vẽ">Vẽ Tranh</option>
                    <option value="Nến">Nến Thơm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Giá Vé (VNĐ/người)</label>
                  <input 
                    type="number"
                    value={newService.price}
                    onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Khu Vực</label>
                  <input 
                    value={newService.area}
                    onChange={e => setNewService({ ...newService, area: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#737B71] mb-1">Sức Chứa / Buổi</label>
                  <input 
                    type="number"
                    value={newService.capacity}
                    onChange={e => setNewService({ ...newService, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#355743] text-white rounded-lg text-xs font-bold mt-2">
                Tạo Dịch Vụ & Mở Bán Ngay ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
