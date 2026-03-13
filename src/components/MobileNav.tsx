import { Home, Repeat, Tag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCompare } from '../context/CompareContext';

export default function MobileNav() {
  const location = useLocation();
  const { compareList } = useCompare();

  const navItems = [
    { name: 'HOME', icon: Home, href: '/' },
    { name: 'COMPARE', icon: Repeat, href: '/compare', badge: compareList.length },
    { name: 'DEALS', icon: Tag, href: '/deals' },
    { name: 'PROFILE', icon: User, href: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center gap-1 relative"
            >
              <Icon className={cn("w-6 h-6", isActive ? "text-[#ff6600]" : "text-gray-400")} />
              {item.badge ? (
                <span className="absolute -top-1 right-2 w-4 h-4 bg-[#ff6600] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              ) : null}
              <span className={cn("text-[10px] font-bold", isActive ? "text-[#ff6600]" : "text-gray-400")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
