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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFCF8]/95 backdrop-blur-md border-t border-[#EADFE4] px-2 py-1.5 shadow-lg safe-area-pb"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
                item.isActive
                  ? 'text-[#68415F]'
                  : 'text-[#756871] hover:text-[#211A22]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  item.isActive ? 'bg-[#F2E8F0]' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    item.isActive ? 'text-[#68415F] stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-tight mt-0.5 ${
                  item.isActive ? 'text-[#68415F]' : 'text-[#756871]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
