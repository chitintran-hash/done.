import { fetchAllUsers } from "../../actions/admin";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const users = await fetchAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Tài Khoản</h1>
          <p className="text-muted-foreground mt-2">Theo dõi và phân quyền người dùng trong hệ thống DONE.</p>
        </div>
      </div>
      
      <UsersClient initialUsers={users} />
    </div>
  );
}
