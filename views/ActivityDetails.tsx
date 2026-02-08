
import React, { useState } from 'react';
import { Activity } from '../types';

interface ActivityDetailsProps {
  id: string | null;
  activity: Activity | null;
  onBack: () => void;
  onOpenMaps: () => void;
  members: any[];
  onJoinRequest: (id: string, title: string) => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ id, activity, onBack, onOpenMaps, members, onJoinRequest }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const joinCode = `MV-${(id || 'X').padStart(4, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const shareLink = `https://hingaa.mv/join/${id || 'active'}`;

  const activityTitle = activity?.title || 'Activity';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const platforms = [
    { name: 'Facebook', color: 'bg-[#1877F2]', icon: 'share' },
    { name: 'Viber', color: 'bg-[#7360f2]', icon: 'chat' },
    { name: 'Messenger', color: 'bg-[#00B2FF]', icon: 'forum' },
    { name: 'TikTok', color: 'bg-[#000000]', icon: 'music_note' },
    { name: 'Telegram', color: 'bg-[#24A1DE]', icon: 'send' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 pb-24 md:pb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-bold">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1.5 text-primary text-xs md:text-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">calendar_today</span> {activity?.date || 'TBD'} • {activity?.time || 'TBD'}
                </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">{activityTitle}</h1>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((m, i) => (
                  <img key={i} className="size-8 rounded-full border-2 border-background-dark" src={m.avatar} alt={m.name} title={m.name} />
                ))}
                {members.length > 3 && (
                  <div className="size-8 rounded-full bg-slate-800 border-2 border-background-dark flex items-center justify-center text-[10px] font-bold text-slate-300">
                    +{members.length - 3}
                  </div>
                )}
              </div>
              <p className="text-xs md:text-sm text-slate-400 font-medium">{Math.max((activity?.participantLimit || members.length) - members.length, 0)} spots left • Organized by <span className="text-white font-bold">{activity?.hostName || 'Host'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 fixed bottom-24 md:relative md:bottom-0 inset-x-4 md:inset-x-0 z-30">
            <button 
              onClick={() => onJoinRequest(id || '1', activityTitle)}
              className="flex-1 md:flex-none bg-primary hover:bg-accent text-white px-8 md:px-12 py-3.5 md:py-4 rounded-full font-bold shadow-xl shadow-primary/20 transition-all text-base md:text-lg"
            >
              Join Activity
            </button>
            <button 
              onClick={() => {
                setIsShareModalOpen(true);
                setShowAllPlatforms(false);
              }}
              className="size-12 md:size-14 flex items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white transition-all border border-border-dark"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 md:mb-12 items-stretch">
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-border-dark h-64 md:h-[400px]">
            <img className="w-full h-full object-cover" src={activity?.image || 'https://picsum.photos/seed/fishing/1200/800'} alt="hero" />
          </div>
          <div className="lg:col-span-4 bg-card-dark rounded-2xl border border-border-dark overflow-hidden flex flex-col h-64 md:h-[400px]">
             <div className="flex-1 bg-slate-900/50 relative flex items-center justify-center overflow-hidden">
                <img className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" alt="map preview" />
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-primary text-3xl fill-1">location_on</span>
                  <p className="text-[10px] font-black text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest text-center mx-4">{activity?.location || 'Unknown location'}</p>
                </div>
             </div>
             <div className="p-5 md:p-6 bg-surface-dark border-t border-border-dark">
                <button onClick={onOpenMaps} className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-lg">map</span> View in Maps
                </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-16">
          <div className="lg:col-span-3 text-slate-400 leading-relaxed text-base md:text-xl space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 mb-4 md:mb-8">
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">description</span>
              <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight">Activity Details</h3>
            </div>
            <p>{activity?.description || 'No details yet for this activity.'}</p>
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">group</span>
                <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight">Members</h3>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">{members.length} Joined</span>
            </div>
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={i} className="bg-card-dark p-3 md:p-4 rounded-2xl border border-border-dark flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <img className="size-10 md:size-14 rounded-full object-cover" src={m.avatar} alt={m.name} />
                  <div>
                    <p className="text-sm md:text-lg font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsShareModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-white tracking-tighter">Hingaa Dhimaavaan?</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Join Code Display */}
              <div className="p-5 md:p-6 bg-slate-900/50 rounded-3xl border border-border-dark flex flex-col items-center gap-3 text-center">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Activity Code</p>
                <div className="text-3xl font-black text-primary tracking-tighter">{joinCode}</div>
                <button onClick={() => copyToClipboard(joinCode)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                </button>
              </div>

              {/* Share Link */}
              <div className="relative">
                <input readOnly value={shareLink} className="w-full bg-slate-900 border border-border-dark rounded-xl py-3 pl-4 pr-20 text-xs text-slate-300 font-medium" />
                <button onClick={() => copyToClipboard(shareLink)} className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider">Copy</button>
              </div>

              {/* Social Platforms */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Share via</p>
                
                {/* Main Instagram Button */}
                <button 
                  className="w-full h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined fill-1">camera</span>
                  Instagram
                </button>

                {/* Secondary Platforms (Grid) */}
                {!showAllPlatforms ? (
                  <button 
                    onClick={() => setShowAllPlatforms(true)}
                    className="w-full h-12 rounded-xl bg-white/5 border border-border-dark text-slate-300 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                    Other Platforms
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {platforms.map((platform) => (
                      <button 
                        key={platform.name}
                        className={`h-12 rounded-xl ${platform.color} text-white flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-wider shadow-md active:scale-95 transition-all`}
                      >
                        <span className="material-symbols-outlined text-base">{platform.icon}</span>
                        {platform.name}
                      </button>
                    ))}
                    <button 
                      onClick={() => setShowAllPlatforms(false)}
                      className="h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center border border-border-dark hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">expand_less</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetails;
