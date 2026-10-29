import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Map, Package, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenAuth?: () => void;
  isAuthenticated?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenAuth,
  isAuthenticated,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'explore',
      label: 'KHÁM PHÁ',
      path: '/',
      icon: Compass,
      isActive: currentPath === '/' || currentPath === '/marketplace',
    },
    {
      id: 'map',
      label: 'FLASHMAP',
      path: '/flashmap',
      icon: Map,
      isActive: currentPath === '/flashmap',
    },
    {
      id: 'rooms',
      label: 'PHÒNG',
      path: '/my-rooms',
      icon: Package,
      isActive: currentPath === '/my-rooms',
    },
    {
      id: 'orders',
      label: 'ĐƠN HÀNG',
      path: '/orders',
      icon: ShoppingBag,
      isActive: currentPath === '/orders',
    },
    {
      id: 'profile',
      label: 'TÀI KHOẢN',
      path: '/profile',
      icon: User,
      isActive: currentPath === '/profile',
    },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.id === 'profile' && !isAuthenticated && onOpenAuth) {
      onOpenAuth();
      return;
    }
    navigate(item.path);
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E6E6EE] px-2 py-1.5 shadow-lg safe-area-pb"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer relative"
            >
              <div
                className={`p-1 rounded-xl transition relative flex items-center justify-center`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    item.isActive ? 'text-[#006EE9] stroke-[2.5]' : 'text-[#77778A] stroke-2'
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#D0FFA4] ring-2 ring-[#006EE9]" />
                )}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-tight mt-0.5 transition-colors ${
                  item.isActive ? 'text-[#006EE9]' : 'text-[#77778A]'
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-4 h-0.5 rounded-full bg-[#D0FFA4] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
