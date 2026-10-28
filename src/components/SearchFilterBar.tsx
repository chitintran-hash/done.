import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ArrowUpDown, ChevronDown } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  category: string;
  maxDistanceMeters: number;
  status: string;
  pickupPoint: string;
  maxPrice: number;
  sortBy: 'near_me' | 'ending_soon' | 'lowest_price' | 'highest_discount' | 'most_popular' | 'newest';
}

interface SearchFilterBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  categories: string[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  categories,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input (Requirement 41) */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, nhà cung cấp hoặc ngành hàng..."
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Sort Select (Requirement 43) */}
        <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
          <div className="relative flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
              className="pl-8 pr-8 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none w-full cursor-pointer"
            >
              <option value="near_me">Gần tôi nhất (Near Me)</option>
              <option value="ending_soon">Sắp kết thúc (Ending Soon)</option>
              <option value="lowest_price">Giá thấp nhất (Lowest Price)</option>
              <option value="highest_discount">Mức giảm sâu nhất (Highest Discount)</option>
              <option value="most_popular">Đông người nhất (Most Popular)</option>
              <option value="newest">Mới mở gom (Newest)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Toggle Filter Button */}
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
              showAdvanced
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Options (Requirement 42) */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fade-in">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Khoảng cách tối đa</label>
            <select
              value={filters.maxDistanceMeters}
              onChange={(e) => onChangeFilters({ ...filters, maxDistanceMeters: Number(e.target.value) })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value={500}>Dưới 500m</option>
              <option value={1000}>Dưới 1km</option>
              <option value={3000}>Dưới 3km</option>
              <option value={10000}>Tất cả bán kính</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Trạng thái phòng</label>
            <select
              value={filters.status}
              onChange={(e) => onChangeFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang mở gom (Active)</option>
              <option value="successful">Đã chốt giá (Successful)</option>
              <option value="closed">Đã đóng gom (Closed)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Điểm nhận (Pickup Point)</label>
            <select
              value={filters.pickupPoint}
              onChange={(e) => onChangeFilters({ ...filters, pickupPoint: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">Tất cả điểm nhận</option>
              <option value="Locker Quận 1">Smart Locker Quận 1</option>
              <option value="Locker Quận 7">Smart Locker Quận 7</option>
              <option value="Locker Thủ Đức">Smart Locker TP. Thủ Đức</option>
              <option value="Locker Cầu Giấy">Smart Locker Cầu Giấy (Hà Nội)</option>
              <option value="KTX">Điểm nhận KTX Đại học</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={onResetFilters}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc (Reset)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
