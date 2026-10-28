import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';

interface RouteGuardProps {
  currentUser: User | null;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  fallbackRedirect?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  currentUser,
  allowedRoles,
  children,
  fallbackRedirect = '/',
}) => {
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={fallbackRedirect} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-fade-in">
        <div className="bg-[#FFFCF8] rounded-3xl border border-[#EADFE4] p-8 max-w-md w-full shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-slate-900">TRUY CẬP BỊ TỪ CHỐI</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tài khoản của bạn ({currentUser.name} - vai trò: <strong className="uppercase">{currentUser.role}</strong>) không có quyền truy cập vào phân hệ này.
          </p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const RequireAuth: React.FC<{ currentUser: User | null; children: React.ReactNode }> = ({
  currentUser,
  children,
}) => <RouteGuard currentUser={currentUser}>{children}</RouteGuard>;

export const RequireBuyer: React.FC<{ currentUser: User | null; children: React.ReactNode }> = ({
  currentUser,
  children,
}) => (
  <RouteGuard currentUser={currentUser} allowedRoles={['buyer', 'admin']}>
    {children}
  </RouteGuard>
);

export const RequireSupplier: React.FC<{ currentUser: User | null; children: React.ReactNode }> = ({
  currentUser,
  children,
}) => (
  <RouteGuard currentUser={currentUser} allowedRoles={['supplier', 'admin']}>
    {children}
  </RouteGuard>
);

export const RequireAdmin: React.FC<{ currentUser: User | null; children: React.ReactNode }> = ({
  currentUser,
  children,
}) => (
  <RouteGuard currentUser={currentUser} allowedRoles={['admin']}>
    {children}
  </RouteGuard>
);
