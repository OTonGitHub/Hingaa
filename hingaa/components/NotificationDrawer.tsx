
import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityClick: (id: string) => void;
  requests: any[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onActivityClick, 
  requests,
  onAccept,
  onDecline
}) => {
  const recommendations = [
    {
      id: '1',
      title: 'Island BBQ Party',
      host: 'Ismail R.',
      time: 'Tomorrow, 5 PM',
      avatar: 'https://picsum.photos/seed/bbq/100/100',
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-surface-dark border-l border-border-dark z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="p-6 border-b border-border-dark flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill-1">notifications</span> Activity Feed
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">person_add</span> Activity Requests
                </span>
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{requests.length}</span>
              </div>
              {requests.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-4 italic">No pending requests</p>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-card-dark/30 border border-border-dark rounded-xl p-4 mb-3 animate-in fade-in slide-in-from-right-4">
                    <div className="flex gap-3 mb-3">
                      <img src={req.avatar} className="size-10 rounded-full object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-snug">
                          <span className="font-bold text-white">{req.userName}</span> wants to join <span className="text-primary font-bold">{req.activityTitle}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{req.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onAccept(req.id)}
                        className="flex-1 bg-primary text-white text-[10px] font-bold py-2 rounded-lg hover:bg-accent transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => onDecline(req.id)}
                        className="flex-1 bg-slate-800 text-slate-400 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-700 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span> AI Recommendations
                </span>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-border-dark group">
                    <img src={rec.avatar} className="size-12 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{rec.title}</p>
                      <p className="text-[10px] text-slate-400">By {rec.host} • {rec.time}</p>
                    </div>
                    <button onClick={() => onActivityClick(rec.id)} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold transition-all">Details</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer className="p-6 border-t border-border-dark bg-slate-900/50">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl transition-all border border-border-dark">Settings & Privacy</button>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default NotificationDrawer;
