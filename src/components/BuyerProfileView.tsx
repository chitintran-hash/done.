import React, { useState } from 'react';
import {
  User,
  Order,
  GroupParticipation,
  GroupRoom,
  Review,
  LoyaltyTransaction,
  Referral,
} from '../types';
import {
  formatVND,
  calculateLoyaltyBalance,
  getPersonalReferralUrl,
  getSafeFirstName,
} from '../utils/pricing';
import {
  Mail,
  MapPin,
  Package,
  TrendingDown,
  CreditCard,
  Users,
  Star,
  Edit2,
  Check,
  X,
  Gift,
  Copy,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Home,
  Briefcase,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { SavedBuyerAddress, VietnamAddress, AddressLabelType } from '../types/address';
import { savedBuyerAddressService } from '../services/vietnamAddressService';
import { VietnamAddressSelector } from './VietnamAddressSelector';

interface BuyerProfileProps {
  currentUser: User;
  orders: Order[];
  participations: GroupParticipation[];
  rooms: GroupRoom[];
  reviews: Review[];
  loyaltyTransactions: LoyaltyTransaction[];
  referrals: Referral[];
  onUpdateProfile: (updatedData: Partial<User>) => void;
  showToast: (msg: string) => void;
}

export const BuyerProfileView: React.FC<BuyerProfileProps> = ({
  currentUser,
  orders,
  participations,
  rooms,
  reviews,
  loyaltyTransactions,
  referrals,
  onUpdateProfile,
  showToast,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentUser.name);
  const [phone, setPhone] = useState<string>(currentUser.phone || '');
  const [pickupPoint, setPickupPoint] = useState<string>(
    currentUser.preferredPickupPoint || 'KTX A – Locker 03'
  );
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // 17. Saved Addresses State (ĐỊA CHỈ CỦA TÔI)
  const [savedAddresses, setSavedAddresses] = useState<SavedBuyerAddress[]>(() =>
    savedBuyerAddressService.getSavedAddresses(currentUser.id)
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedBuyerAddress | null>(null);

  const [modalLabel, setModalLabel] = useState<AddressLabelType>('NHÀ');
  const [modalRecipientName, setModalRecipientName] = useState<string>(currentUser.name);
  const [modalRecipientPhone, setModalRecipientPhone] = useState<string>(currentUser.phone || '');
  const [modalDeliveryNote, setModalDeliveryNote] = useState<string>('');
  const [modalIsDefault, setModalIsDefault] = useState<boolean>(false);

  const reloadAddresses = () => {
    setSavedAddresses(savedBuyerAddressService.getSavedAddresses(currentUser.id));
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setModalLabel('NHÀ');
    setModalRecipientName(currentUser.name);
    setModalRecipientPhone(currentUser.phone || '');
    setModalDeliveryNote('');
    setModalIsDefault(savedAddresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: SavedBuyerAddress) => {
    setEditingAddress(addr);
    setModalLabel(addr.label);
    setModalRecipientName(addr.recipientName);
    setModalRecipientPhone(addr.recipientPhone);
    setModalDeliveryNote(addr.deliveryNote || '');
    setModalIsDefault(addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      savedBuyerAddressService.deleteAddress(id);
      reloadAddresses();
      showToast('Đã xóa địa chỉ thành công.');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    savedBuyerAddressService.setDefaultAddress(id, currentUser.id);
    reloadAddresses();
    showToast('Đã đặt làm địa chỉ mặc định.');
  };

  const handleSaveAddressFromSelector = (
    vAddr: VietnamAddress,
    _geocoded?: any
  ) => {
    if (!vAddr.formattedAddress) {
      showToast('Vui lòng hoàn tất việc chọn địa chỉ.');
      return;
    }

    if (editingAddress) {
      savedBuyerAddressService.updateAddress(editingAddress.id, {
        label: modalLabel,
        recipientName: modalRecipientName.trim() || currentUser.name,
        recipientPhone: modalRecipientPhone.trim() || currentUser.phone || '',
        deliveryNote: modalDeliveryNote.trim(),
        isDefault: modalIsDefault,
        address: vAddr,
      });
      showToast('Đã cập nhật địa chỉ thành công!');
    } else {
      savedBuyerAddressService.saveAddress({
        userId: currentUser.id,
        label: modalLabel,
        recipientName: modalRecipientName.trim() || currentUser.name,
        recipientPhone: modalRecipientPhone.trim() || currentUser.phone || '',
        deliveryNote: modalDeliveryNote.trim(),
        isDefault: modalIsDefault,
        address: vAddr,
      });
      showToast('Đã thêm địa chỉ mới thành công!');
    }

    setIsAddressModalOpen(false);
    reloadAddresses();
  };

  // Stats calculation
  const myOrders = orders.filter((o) => o.userId === currentUser.id && o.status !== 'cancelled');
  const myParticipations = participations.filter(
    (p) => p.userId === currentUser.id && p.status !== 'cancelled'
  );
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  // Req 28: Loyalty balance strictly calculated from sum(points)
  const myLoyaltyHistory = loyaltyTransactions.filter((t) => t.userId === currentUser.id);
  const flashPointsBalance = calculateLoyaltyBalance(loyaltyTransactions, currentUser.id);

  // Req 46: Buyer Referral metrics
  const myReferrals = referrals.filter((r) => r.referrerUserId === currentUser.id);
  const successfulReferrals = myReferrals.filter((r) => r.status === 'completed');
  const pendingReferrals = myReferrals.filter((r) => r.status !== 'completed');
  const referralPointsEarned = myLoyaltyHistory
    .filter((t) => t.type === 'referral')
    .reduce((sum, t) => sum + Number(t.points || 0), 0);

  const personalReferralUrl = getPersonalReferralUrl(currentUser.id);

  const handleCopyPersonalReferral = async () => {
    try {
      await navigator.clipboard?.writeText(personalReferralUrl);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
      showToast('Đã sao chép link giới thiệu cá nhân!');
    } catch {
      showToast('Vui lòng bôi đen đường dẫn và nhấn Ctrl+C.');
    }
  };

  const totalSpent = myOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  // Requirement 47: Estimated Savings: sum of (initialPrice - unitPrice) * quantity
  const estimatedSavings = myOrders.reduce((acc, order) => {
    const room = rooms.find((r) => r.id === order.roomId);
    if (!room) return acc;
    const savingPerUnit = Math.max(0, room.initialPrice - order.unitPrice);
    return acc + savingPerUnit * order.quantity;
  }, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Họ tên không được để trống.');
      return;
    }
    onUpdateProfile({
      name: name.trim(),
      phone: phone.trim(),
      preferredPickupPoint: pickupPoint,
    });
    setIsEditing(false);
    showToast('Đã cập nhật thông tin hồ sơ thành công!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center ring-4 ring-emerald-500/10 overflow-hidden shrink-0">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start space-x-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{currentUser.email}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Điểm nhận quen thuộc: <strong>{currentUser.preferredPickupPoint || 'Chưa thiết lập'}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition flex items-center space-x-1.5 shadow-sm"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Hủy sửa</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa hồ sơ</span>
              </>
            )}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Cập nhật thông tin</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Point ưa thích</label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="KTX A – Locker 03">KTX A – Locker 03</option>
                  <option value="KTX B – Tạp hóa sinh viên số 2">KTX B – Tạp hóa sinh viên số 2</option>
                  <option value="Chung cư Safira – Sảnh D">Chung cư Safira – Sảnh D</option>
                  <option value="Tòa The Sun Avenue – Tháp 4">Tòa The Sun Avenue – Tháp 4</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Phòng đã gom</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{myParticipations.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Đơn hoàn tất</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{myOrders.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-slate-400 font-semibold mb-1">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span>Tổng chi tiêu</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900">{formatVND(totalSpent)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-emerald-600 font-bold mb-1">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Đã tiết kiệm</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600">{formatVND(estimatedSavings)}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-amber-500 font-bold mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Đánh giá đã gửi</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{myReviews.length}</div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PHASE 6: FLASHPOINTS CARD & HISTORY (Req 25, 26, 28, 29, 41, 42, 43) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FlashPoints Balance & History */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-slate-900">FlashPoints</h3>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Điểm thưởng demo
                  </span>
                </div>
                <p className="text-xs text-slate-500">Tích điểm từ đơn hoàn tất, đánh giá và mời bạn bè</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {flashPointsBalance} điểm
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-500 block">Đơn hoàn tất</span>
              <strong className="text-emerald-700 font-black">+10 điểm</strong>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-slate-500 block">Referral thành công</span>
              <strong className="text-emerald-700 font-black">+20 điểm</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Đánh giá SP</span>
              <strong className="text-emerald-700 font-black">+5 điểm</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Lịch sử điểm thưởng ({myLoyaltyHistory.length})
            </h4>
            {myLoyaltyHistory.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có giao dịch điểm thưởng nào.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {myLoyaltyHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{tx.description}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        tx.points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} điểm
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* PHASE 6: BUYER REFERRAL SECTION ("Mời bạn bè" - Req 46, 55, 56)      */}
        {/* ==================================================================== */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Mời bạn bè</h3>
                <p className="text-xs text-slate-500">
                  Càng đông càng rẻ • Nhận +20 FlashPoints cho mỗi lượt giới thiệu hoàn tất
                </p>
              </div>
            </div>

            {/* Referral Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Successful referrals
                </span>
                <span className="text-xl font-black text-emerald-700 mt-0.5 block">
                  {successfulReferrals.length}
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  Pending referrals
                </span>
                <span className="text-xl font-black text-amber-700 mt-0.5 block">
                  {pendingReferrals.length}
                </span>
              </div>
              <div className="bg-slate-900 text-white rounded-2xl p-3 text-center">
                <span className="text-[10px] font-bold text-emerald-300 uppercase block">
                  FlashPoints earned
                </span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  +{referralPointsEarned}
                </span>
              </div>
            </div>

            {/* Personal Referral Link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider block">
                Link giới thiệu cá nhân của bạn
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={personalReferralUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 text-xs font-mono bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleCopyPersonalReferral}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shrink-0 transition"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Mẹo: Chia sẻ trực tiếp từ trang Phòng gom (`/room/id?ref=...`) sẽ ưu tiên ghi nhận trực tiếp cho phòng đó!
              </p>
            </div>

            {/* Referrals List */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Danh sách bạn bè đã mời ({myReferrals.length})
              </h4>
              {myReferrals.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs font-semibold text-slate-500">
                  Bạn chưa mời ai.
                </div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {myReferrals.map((ref) => {
                    const room = rooms.find((r) => r.id === ref.roomId);
                    return (
                      <div
                        key={ref.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">
                            {ref.referredUserName
                              ? getSafeFirstName(ref.referredUserName)
                              : ref.referredUserId
                              ? `Thành viên #${ref.referredUserId.slice(0, 6)}`
                              : 'Khách mở link giới thiệu'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {room ? `Phòng: ${room.productName}` : 'Giới thiệu chung'} •{' '}
                            {new Date(ref.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ref.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : ref.status === 'joined'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ref.status === 'completed'
                            ? 'HOÀN TẤT (+20Đ)'
                            : ref.status === 'joined'
                            ? 'ĐÃ THAM GIA PHÒNG'
                            : ref.status === 'registered'
                            ? 'ĐÃ ĐĂNG KÝ'
                            : 'ĐÃ MỞ LINK'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Ưu đãi, điểm thưởng và chương trình giới thiệu trong prototype là dữ liệu mô phỏng.
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* REQUIREMENT 17 & 18: ĐỊA CHỈ CỦA TÔI (SAVED BUYER ADDRESSES & PRIVACY) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                SỔ ĐỊA CHỈ GIAO HÀNG
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                BẢO MẬT TUYỆT ĐỐI
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">ĐỊA CHỈ CỦA TÔI</h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              Quản lý các địa chỉ nhận hàng cá nhân. Theo quy định quyền riêng tư (Req 18 & 19), địa chỉ nhà riêng của bạn <strong>không bao giờ hiển thị công khai trên FlashMap hay trong phòng gom</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddAddress}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>

        {/* Address Cards List */}
        {savedAddresses.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
            Bạn chưa lưu địa chỉ nào. Nhấn "Thêm địa chỉ mới" để thiết lập.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  item.isDefault
                    ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px] flex items-center gap-1">
                        {item.label === 'NHÀ' && <Home className="w-3 h-3 text-emerald-600" />}
                        {item.label === 'CÔNG TY' && <Briefcase className="w-3 h-3 text-blue-600" />}
                        {item.label === 'KHÁC' && <MapPin className="w-3 h-3 text-slate-600" />}
                        {item.label}
                      </span>
                      {item.isDefault && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase">
                          MẶC ĐỊNH
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddress(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-bold">{item.recipientName}</strong>
                    <span className="mx-2 text-slate-300">|</span>
                    <span>{item.recipientPhone}</span>
                  </div>

                  {/* Formatted Address Display */}
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">
                    {item.address.formattedAddress || 'Chưa định dạng địa chỉ'}
                  </div>

                  {item.deliveryNote && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      Ghi chú: {item.deliveryNote}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  {!item.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(item.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer hover:underline"
                    >
                      Thiết lập làm mặc định
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Địa chỉ nhận hàng chính
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    Cập nhật: {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL TO ADD / EDIT ADDRESS */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">
                  {editingAddress ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI'}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {editingAddress ? 'Cập nhật địa chỉ nhận hàng' : 'Nhập địa chỉ giao hàng của bạn'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details & Label Inputs */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Loại địa chỉ</label>
                <div className="flex items-center gap-2">
                  {(['NHÀ', 'CÔNG TY', 'KHÁC'] as AddressLabelType[]).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setModalLabel(lbl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                        modalLabel === lbl
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalRecipientName}
                    onChange={(e) => setModalRecipientName(e.target.value)}
                    placeholder="Họ và tên"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={modalRecipientPhone}
                    onChange={(e) => setModalRecipientPhone(e.target.value)}
                    placeholder="090..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Ghi chú giao hàng (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={modalDeliveryNote}
                  onChange={(e) => setModalDeliveryNote(e.target.value)}
                  placeholder="VD: Gọi trước khi giao, gửi bảo vệ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsDefaultCheck"
                  checked={modalIsDefault}
                  onChange={(e) => setModalIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label
                  htmlFor="modalIsDefaultCheck"
                  className="text-xs font-bold text-slate-700 cursor-pointer select-none"
                >
                  Đặt làm địa chỉ nhận hàng mặc định
                </label>
              </div>
            </div>

            {/* Hierarchical VietnamAddressSelector */}
            <VietnamAddressSelector
              initialAddress={editingAddress?.address}
              onConfirmAddress={handleSaveAddressFromSelector}
              className="border-0 p-0 shadow-none"
            />
          </div>
        </div>
      )}

      {/* Member Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Thông tin tài khoản</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Số điện thoại nhận hàng:</span>
            <div className="font-bold text-slate-800">{currentUser.phone || 'Chưa cung cấp'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Ngày gia nhập nền tảng:</span>
            <div className="font-bold text-slate-800">
              {new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
