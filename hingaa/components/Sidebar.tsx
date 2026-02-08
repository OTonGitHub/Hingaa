
import React from 'react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'discover', label: 'Discover', icon: 'explore' },
    { id: 'my-activities', label: 'My Activities', icon: 'event' },
    { id: 'maps', label: 'Maps', icon: 'map' },
  ];

  const groups = [
    { id: 'yoga', name: 'Yoga Enthusiasts', members: '12 members', avatar: 'https://picsum.photos/seed/yoga/100/100', active: true },
    { id: 'boardgames', name: "Male' Board Gamers", members: '5 active now', avatar: 'https://picsum.photos/seed/games/100/100', active: true },
    { id: 'diving', name: 'Diving Maldives', members: 'Inactive', avatar: 'https://picsum.photos/seed/diving/100/100', active: false },
  ];

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border-dark bg-surface-dark flex flex-col z-20">
      <div className="p-6">
        <div 
          className="flex items-center gap-3 mb-8 cursor-pointer group/logo" 
          onClick={() => onNavigate('discover')}
          title="Go to Discover"
        >
          <div className="bg-primary p-2 rounded-xl text-white group-hover/logo:bg-accent transition-colors">
            <span className="material-symbols-outlined text-2xl fill-1">waves</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover/logo:text-primary transition-colors">Hingaa</h1>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all font-medium ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${currentView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-border-dark flex-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">My Groups</p>
        <div className="space-y-4">
          {groups.map((group) => (
            <div 
              key={group.id} 
              onClick={() => onNavigate('group-chat')}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img className={`size-8 rounded-full object-cover border-2 ${group.active ? 'border-primary/30' : 'border-transparent opacity-60'}`} src={group.avatar} alt={group.name} />
                {group.active && <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-surface-dark rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${group.active ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'}`}>{group.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{group.members}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-border-dark">
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer group" onClick={() => onNavigate('profile')}>
          <img className="size-10 rounded-full object-cover border border-border-dark group-hover:border-primary transition-colors" src="https://picsum.photos/seed/user/100/100" alt="Profile" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Ahmed Zaeem</p>
            <p className="text-[10px] text-slate-500 font-medium">Pro Member</p>
          </div>
          <button 
            className="text-slate-500 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); onNavigate('settings'); }}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
