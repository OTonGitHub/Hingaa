
import React from 'react';

interface ArchiveProps {
  onActivityClick: (id: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ onActivityClick }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const pastActivities = [
    { id: '3', day: 4, title: 'Beach Cleanup', image: 'https://picsum.photos/seed/cleanup/100/100' },
    { id: '4', day: 12, title: 'Island Picnic', image: 'https://picsum.photos/seed/picnic/100/100' },
    { id: '5', day: 22, title: 'Bodu Beru Night', image: 'https://picsum.photos/seed/music/100/100' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
      <header className="h-20 bg-surface-dark border-b border-border-dark px-8 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Archive</h2>
        <div className="flex items-center gap-4">
           <span className="text-slate-400 font-bold">November 2024</span>
           <div className="flex gap-2">
             <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
             <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">{d}</div>
          ))}
          {/* Calendar Grid */}
          {days.map(day => {
            const activity = pastActivities.find(a => a.day === day);
            return (
              <div 
                key={day} 
                className={`min-h-[140px] border border-border-dark rounded-2xl p-4 transition-all hover:border-primary group ${activity ? 'bg-surface-dark cursor-pointer' : 'bg-transparent'}`}
                onClick={activity ? () => onActivityClick(activity.id) : undefined}
              >
                <span className={`text-sm font-bold ${activity ? 'text-white' : 'text-slate-700'}`}>{day}</span>
                {activity && (
                  <div className="mt-2 flex flex-col gap-2">
                    <img className="size-full h-16 rounded-lg object-cover border border-border-dark" src={activity.image} alt={activity.title} />
                    <p className="text-[10px] font-bold text-slate-400 truncate">{activity.title}</p>
                    <span className="bg-slate-800 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase self-start">Completed</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Archive;
