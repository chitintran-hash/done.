export const dynamic = 'force-dynamic';

import { fetchAdminOrderDetail } from '@/app/actions/admin';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, CheckCircle2, Truck, AlertCircle, FileText, User, MapPin, Printer } from 'lucide-react';
import AdminOrderDetailClient from './AdminOrderDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id: orderId } = await params;
  const order = await fetchAdminOrderDetail(orderId);

  if (!order) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E8DFD8] text-center max-w-lg mx-auto mt-12 shadow-xs">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#3A211E] mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-[#765B52] mb-6">Mã đơn hàng không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link href="/admin/orders" className="px-6 py-3 bg-[#FFBF00] text-[#3A211E] rounded-full font-bold text-sm shadow-xs hover:bg-[#FFBF00]/90">
          Quay lại danh sách đơn
        </Link>
      </div>
    );
  }

  return <AdminOrderDetailClient order={order} />;
}
