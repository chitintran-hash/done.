export const dynamic = "force-dynamic";

import { fetchAdminCustomers } from '@/app/actions/admin';
import UsersClient from "./UsersClient";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await fetchAdminCustomers();

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3A211E] tracking-wide uppercase bg-[#FFF3C4] px-3 py-1 rounded-full w-fit mb-3 border border-[#E8DFD8]">
            Customer CRM & Security
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3A211E] tracking-tight">
            Quản Lý Tài Khoản Khách Hàng
          </h1>
          <p className="text-sm text-[#765B52] mt-1.5">
            Theo dõi danh sách người mua, tổng chi tiêu trọn đời (LTV), lịch sử đơn hàng và phân quyền bảo mật.
          </p>
        </div>
      </div>
      
      <UsersClient initialUsers={users} />
    </div>
  );
}
