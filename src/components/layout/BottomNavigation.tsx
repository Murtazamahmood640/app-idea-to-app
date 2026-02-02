import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Package,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export const BottomNavigation: React.FC = () => {
  const { user } = useAuth();
  const { getItemCount } = useCart();
  const location = useLocation();
  const itemCount = getItemCount();

  const customerNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const vendorNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/vendor' },
    { icon: Package, label: 'Products', path: '/vendor/products' },
    { icon: PlusCircle, label: 'Add', path: '/vendor/products/new' },
    { icon: ClipboardList, label: 'Sales', path: '/vendor/sales' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = user?.role === 'vendor' ? vendorNavItems : customerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.path === '/cart' && itemCount > 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
