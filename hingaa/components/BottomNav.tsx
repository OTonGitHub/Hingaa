
import React from 'react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'discover', label: 'Discover', icon: 'explore' },
    { id: 'maps', label: 'Maps', icon: 'map' },
    { id: 'create-activity', label: 'Create', icon: 'add_circle' },
    { id: 'my-activities', label: 'Activities', icon: 'event' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-20 bg-surface-dark border-t border-border-dark flex items-center justify-around px-4 z-50 lg:hidden safe-area-bottom">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
            currentView === item.id 
              ? 'text-primary' 
              : 'text-slate-500'
          }`}
        >
          <span className={`material-symbols-outlined text-2xl ${currentView === item.id ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          {currentView === item.id && (
            <span className="absolute -bottom-1 size-1 bg-primary rounded-full"></span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
