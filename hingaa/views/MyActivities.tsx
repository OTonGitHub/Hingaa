
import React from 'react';

interface MyActivitiesProps {
  onActivityClick: (id: string) => void;
  onCreateClick: () => void;
  onNavigateToArchive: () => void;
  outgoingRequests: any[];
  onWithdraw: (id: string) => void;
}

const MyActivities: React.FC<MyActivitiesProps> = ({ 
  onActivityClick, 
  onCreateClick, 
  onNavigateToArchive,
  outgoingRequests,
  onWithdraw
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
      <header className="h-20 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input 
              className="w-full bg-slate-800/50 border border-border-dark rounded-full pl-12 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              placeholder="Search my activities..." 
              type="text"
            />
          </div>
        </div>
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Activity</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Activities</p>
            <h4 className="text-3xl font-black text-white">24</h4>
          </div>
          <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Activities</p>
            <h4 className="text-3xl font-black text-white">3</h4>
          </div>
          <div 
            onClick={onNavigateToArchive}
            className="bg-surface-dark p-6 rounded-2xl border border-border-dark cursor-pointer hover:border-primary hover:bg-white/5 transition-all group"
          >
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">Archive</p>
            <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-white">
                <span className="material-symbols-outlined text-2xl">calendar_today</span>
              </h4>
              <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Sections: Pending Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-6">
            Pending <span className="bg-amber-500/20 text-amber-500 text-xs px-2.5 py-0.5 rounded-full">{outgoingRequests.length}</span>
          </h2>
          {outgoingRequests.length === 0 ? (
            <div className="py-12 bg-surface-dark/30 rounded-3xl border-2 border-dashed border-border-dark flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-700 mb-2">inbox</span>
              <p className="text-slate-500 text-sm font-medium">No pending join requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.map((req) => (
                <div key={req.id} className="bg-card-dark rounded-2xl overflow-hidden border border-border-dark flex h-60 group hover:border-amber-500/50 transition-all shadow-xl">
                  <div className="w-1/2 relative overflow-hidden cursor-pointer" onClick={() => onActivityClick(req.activityId)}>
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={req.image} alt={req.activityTitle} />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-lg tracking-wider">{req.status}</span>
                    </div>
                  </div>
                  <div className="w-1/2 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors cursor-pointer" onClick={() => onActivityClick(req.activityId)}>{req.activityTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">calendar_today</span> {req.date}</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">location_on</span> {req.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-border-dark/50">
                      <p className="text-sm text-slate-400 line-clamp-2">Your request to join is being reviewed by the host.</p>
                      <button 
                        onClick={() => onWithdraw(req.id)}
                        className="bg-slate-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all border border-border-dark flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-6">
            Upcoming <span className="bg-primary/20 text-primary text-xs px-2.5 py-0.5 rounded-full">1</span>
          </h2>
          <div className="bg-card-dark rounded-2xl overflow-hidden border border-border-dark flex h-60 group hover:border-primary/50 transition-all shadow-xl cursor-pointer" onClick={() => onActivityClick('2')}>
            <div className="w-1/2 relative overflow-hidden">
              <img className="w-full h-full object-cover" src="https://picsum.photos/seed/startup/800/600" alt="startup" />
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg uppercase">Confirmed</span>
              </div>
            </div>
            <div className="w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Startup Pitch & Networking</h3>
                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">calendar_today</span> Tomorrow, 4:00 PM</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">location_on</span> Male' City Hub</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-border-dark/50">
                <div className="flex -space-x-2">
                  <img className="size-8 rounded-full border-2 border-card-dark" src="https://picsum.photos/seed/p1/100/100" alt="p" />
                  <img className="size-8 rounded-full border-2 border-card-dark" src="https://picsum.photos/seed/p2/100/100" alt="p" />
                  <div className="size-8 rounded-full bg-slate-800 border-2 border-card-dark flex items-center justify-center text-[10px] font-bold text-slate-300">+8</div>
                </div>
                <button className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">View Group</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyActivities;
