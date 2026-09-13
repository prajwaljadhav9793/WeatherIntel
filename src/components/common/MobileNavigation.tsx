import React from 'react';
import { Home, Radio, FileText, Map, User, Bell } from 'lucide-react';
import { ActivePage } from '../../types';

interface MobileNavigationProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenAuth?: () => void;
  activeAlertsCount?: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activePage,
  onNavigate,
  onOpenAuth,
  activeAlertsCount = 4,
}) => {
  const items: { id: ActivePage; label: string; icon: React.ReactNode; isAction?: boolean }[] = [
    { id: 'overview', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'monitor', label: 'Live', icon: <Radio className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'geospatial', label: 'Map', icon: <Map className="w-5 h-5" /> },
    { id: 'auth', label: 'Profile', icon: <User className="w-5 h-5" />, isAction: true },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-[#D8EAF0] px-3 py-2 flex items-center justify-around shadow-lg"
    >
      {items.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            onClick={() => {
              if (item.isAction) {
                if (onOpenAuth) {
                  onOpenAuth();
                } else {
                  onNavigate('auth');
                }
              } else {
                onNavigate(item.id);
              }
            }}
            className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 transition-colors ${
              isActive
                ? 'text-[#087E9B] font-semibold bg-[#EAF7FD]'
                : 'text-[#607B86] hover:text-[#12313D]'
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
