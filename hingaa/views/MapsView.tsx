
import React, { useState } from 'react';

interface MapActivity {
  id: string;
  title: string;
  location: string;
  type: 'Social' | 'Food' | 'Sports' | 'Sightseeing';
  icon: string;
  x: string; // Percentage for mock map positioning
  y: string;
  isActive?: boolean;
}

interface MapsViewProps {
  onActivityClick: (id: string) => void;
  // Added onJoinRequest to fix the type mismatch error in App.tsx
  onJoinRequest: (id: string, title: string) => void;
}

const MapsView: React.FC<MapsViewProps> = ({ onActivityClick, onJoinRequest }) => {
  const [selectedActivity, setSelectedActivity] = useState<MapActivity | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const activities: MapActivity[] = [
    { 
      id: '1', 
      title: 'Sunset Beach Dinner', 
      location: 'Villingili Beach', 
      type: 'Food', 
      icon: 'restaurant',
      x: '15%', 
      y: '70%' 
    },
    { 
      id: '2', 
      title: 'Night Fishing Trip', 
      location: 'Hulhumalé Pier 4', 
      type: 'Sightseeing', 
      icon: 'sailing',
      x: '85%', 
      y: '20%',
      isActive: true
    },
    { 
      id: '3', 
      title: 'Startup Networking', 
      location: "Male' City Hub", 
      type: 'Social', 
      icon: 'groups',
      x: '45%', 
      y: '55%' 
    },
    { 
      id: '6', 
      title: 'Weekend Surf Trip', 
      location: "Raalhugandu", 
      type: 'Sports', 
      icon: 'surfing',
      x: '52%', 
      y: '65%' 
    }
  ];

  const regions = [
    { name: 'Villingili', x: '12%', y: '75%' },
    { name: "Male' City", x: '45%', y: '60%' },
    { name: 'Hulhumalé Phase 1', x: '82%', y: '30%' },
    { name: 'Hulhumalé Phase 2', x: '90%', y: '15%' },
    { name: 'Airport (VIA)', x: '70%', y: '40%' }
  ];

  const handleMarkerClick = (activity: MapActivity) => {
    setSelectedActivity(activity);
  };

  const filteredActivities = activeCategory === 'All' 
    ? activities 
    : activities.filter(a => a.type === activeCategory);

  const categories = ['All', 'Sightseeing', 'Social', 'Food', 'Sports'];

  return (
    <div className="flex-1 relative flex flex-col bg-[#0b0e14] overflow-hidden">
      {/* Real Map Integration Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale brightness-[0.4] contrast-125"></div>
        <div className="absolute inset-0 bg-background-dark/30 backdrop-blur-[1px]"></div>
      </div>

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[linear-gradient(to_right,#8f1d17_1px,transparent_1px),linear-gradient(to_bottom,#8f1d17_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="absolute top-0 inset-x-0 p-8 z-10 flex flex-col gap-6 pointer-events-none">
        <div className="flex items-center justify-between w-full pointer-events-auto">
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  setActiveCategory(cat);
                  if (selectedActivity && selectedActivity.type !== cat && cat !== 'All') {
                    setSelectedActivity(null);
                  }
                }}
                className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent' 
                    : 'bg-surface-dark/90 backdrop-blur-md border border-border-dark text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat === 'All' && <span className="material-symbols-outlined text-lg fill-1">layers</span>}
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-surface-dark/90 backdrop-blur-md border border-border-dark px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl">
              <div className="size-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Live in Male'</span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Labels */}
      {regions.map((region, i) => (
        <div 
          key={i} 
          style={{ left: region.x, top: region.y }} 
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap select-none">{region.name}</span>
        </div>
      ))}

      {/* Markers */}
      <div className="absolute inset-0 z-20">
        {filteredActivities.map((activity) => (
          <div 
            key={activity.id}
            style={{ left: activity.x, top: activity.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 group ${
              selectedActivity?.id === activity.id ? 'scale-125 z-30' : 'hover:scale-110'
            }`}
            onClick={() => handleMarkerClick(activity)}
          >
            <div className={`relative flex flex-col items-center`}>
              {/* Tooltip on hover */}
              <div className="absolute -top-12 bg-surface-dark border border-border-dark px-4 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none scale-90 group-hover:scale-100">
                <p className="text-xs font-black text-white">{activity.title}</p>
              </div>

              <div className={`size-14 rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all duration-300 ${
                selectedActivity?.id === activity.id 
                  ? 'bg-primary text-white ring-[6px] ring-primary/20 rotate-0' 
                  : 'bg-surface-dark/95 text-slate-400 border border-border-dark hover:border-primary/50 rotate-45'
              }`}>
                <span className={`material-symbols-outlined ${selectedActivity?.id !== activity.id ? '-rotate-45' : ''}`}>{activity.icon}</span>
                {activity.isActive && (
                  <span className="absolute -top-1 -right-1 size-4 bg-primary border-[3px] border-background-dark rounded-full shadow-lg"></span>
                )}
              </div>
              <div className={`w-0.5 h-6 mt-1 transition-all duration-300 ${
                selectedActivity?.id === activity.id ? 'bg-primary h-8' : 'bg-border-dark/50'
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Activity Card / Popup */}
      {selectedActivity && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md z-30 px-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-surface-dark/95 backdrop-blur-2xl border border-border-dark rounded-[3rem] p-10 shadow-2xl shadow-black/80 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <button 
              onClick={() => setSelectedActivity(null)}
              className="absolute top-8 right-8 size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">{selectedActivity.type}</span>
                {selectedActivity.isActive && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">● Happening Now</span>}
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-3 tracking-tight">{selectedActivity.title}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <span className="material-symbols-outlined text-lg text-primary fill-1">location_on</span>
                {selectedActivity.location}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Trigger the join request logic passed from App.tsx */}
              <button 
                onClick={() => onJoinRequest(selectedActivity.id, selectedActivity.title)}
                className="w-full bg-primary hover:bg-accent text-white py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
              >
                Request to Join
                <span className="material-symbols-outlined text-xl">person_add</span>
              </button>
              <button 
                onClick={() => onActivityClick(selectedActivity.id)}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-200 py-4 rounded-[2rem] font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                <span className="material-symbols-outlined text-lg">visibility</span> View Detailed Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-10">
        <button className="size-14 bg-surface-dark/90 backdrop-blur-md border border-border-dark rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-2xl active:scale-90">
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="size-14 bg-surface-dark/90 backdrop-blur-md border border-border-dark rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-2xl active:scale-90">
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button className="size-14 mt-4 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 transition-all hover:scale-110 active:rotate-45">
          <span className="material-symbols-outlined fill-1">near_me</span>
        </button>
      </div>

      {/* Island Scale Indicator */}
      <div className="absolute bottom-8 left-10 flex flex-col gap-1 z-10 pointer-events-none">
        <div className="flex items-end gap-1">
          <div className="w-[100px] h-0.5 bg-white/30 relative">
            <div className="absolute left-0 -top-1 w-0.5 h-2 bg-white/30"></div>
            <div className="absolute right-0 -top-1 w-0.5 h-2 bg-white/30"></div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1 KM</span>
        </div>
      </div>
    </div>
  );
};

export default MapsView;
