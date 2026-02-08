
import React, { useState } from 'react';

interface Member {
  name: string;
  role: 'Admin' | 'Member';
  avatar: string;
  online?: boolean;
}

interface GroupChatProps {
  members: Member[];
  pastConnections: any[];
  onRemoveMember: (name: string) => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ members, pastConnections, onRemoveMember }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  
  // Reporting State
  const [reportingTarget, setReportingTarget] = useState<{ name: string; type: 'user' | 'group' } | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [showReportConfirmation, setShowReportConfirmation] = useState(false);

  // Recurrence state
  const [recurrence, setRecurrence] = useState({
    type: 'weekly',
    repeatUntil: '',
    days: [] as string[]
  });

  const reportReasons = [
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Spam or scam",
    "Impersonation",
    "Inappropriate or sexual content",
    "Threats or violence",
    "Misinformation",
    "Self-harm content",
    "Intellectual property violation",
    "Other"
  ];

  const messages = [
    { sender: 'Mariyam Sara', text: 'Hey everyone! Are we still on for the sunset session at the beach tomorrow? 🌅', time: '10:45 AM', avatar: 'https://picsum.photos/seed/sara/100/100', self: false },
    { sender: 'Hussain Ali', text: "I'm definitely in! Bringing my extra mat if someone needs it.", time: '11:02 AM', avatar: 'https://picsum.photos/seed/hussain/100/100', self: false },
    { sender: 'You', text: 'Good morning! Yes, the spot near the Phase 2 bridge. See you all at 5:30 PM! 🧘‍♂️', time: '9:15 AM', avatar: 'https://picsum.photos/seed/user/100/100', self: true },
  ];

  const handleReportSubmit = () => {
    // Logic for submitting report would go here
    setReportingTarget(null);
    setReportReason('');
    setOtherReason('');
    setShowReportConfirmation(true);
  };

  const shareLink = "https://hingaa.mv/join/yoga-123";
  const joinCode = "MV-1024-8842";
  const isAdmin = true; // Simulating current user is Admin

  const platforms = [
    { name: 'Facebook', color: 'bg-[#1877F2]', icon: 'share' },
    { name: 'Viber', color: 'bg-[#7360f2]', icon: 'chat' },
    { name: 'Messenger', color: 'bg-[#00B2FF]', icon: 'forum' },
    { name: 'TikTok', color: 'bg-[#000000]', icon: 'music_note' },
    { name: 'Telegram', color: 'bg-[#24A1DE]', icon: 'send' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 flex flex-col bg-background-dark">
        <header className="h-20 flex-shrink-0 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img className="size-12 rounded-full object-cover border-2 border-primary" src="https://picsum.photos/seed/yoga/100/100" alt="Group" />
              <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-[3px] border-surface-dark rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Yoga Enthusiasts <span className="material-symbols-outlined text-primary text-base fill-1">verified</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">{members.length} Members • {members.filter(m => m.online).length} Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`size-10 flex items-center justify-center rounded-full border transition-all ${isSettingsOpen ? 'bg-primary border-primary text-white' : 'bg-slate-800 text-slate-400 border-border-dark'}`}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-widest border border-border-dark/50">Today</span>
          </div>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-2xl ${msg.self ? 'flex-row-reverse self-end' : ''}`}>
              <img className="size-10 rounded-full object-cover mt-1" src={msg.avatar} alt={msg.sender} />
              <div className={`flex flex-col gap-1 ${msg.self ? 'items-end' : ''}`}>
                <div className={`flex items-center gap-2 ${msg.self ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-bold text-white">{msg.sender}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm border ${msg.self ? 'bg-primary border-primary/20 rounded-tr-none text-white' : 'bg-surface-dark border-border-dark rounded-tl-none text-slate-200'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-surface-dark border-t border-border-dark">
          <div className="max-w-4xl mx-auto relative flex items-center gap-3">
            <button className="size-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 border border-border-dark">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="relative flex-1">
              <input className="w-full bg-slate-900 border-border-dark border rounded-xl py-3 px-4 text-sm text-white focus:ring-1 focus:ring-primary" placeholder="Send a message to Yoga Enthusiasts..." type="text" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-xl">mood</span></button>
              </div>
            </div>
            <button className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><span className="material-symbols-outlined">send</span></button>
          </div>
        </div>
      </div>

      {/* Group Settings Sidebar */}
      <aside className={`w-80 border-l border-border-dark bg-surface-dark flex flex-col transition-all duration-300 ${isSettingsOpen ? 'mr-0 opacity-100' : '-mr-80 opacity-0'} absolute right-0 top-0 h-full z-30 shadow-2xl xl:relative xl:mr-0 xl:opacity-100 ${!isSettingsOpen ? 'xl:hidden' : 'xl:flex'}`}>
        <header className="p-6 border-b border-border-dark flex items-center justify-between">
          <h3 className="font-bold text-white tracking-tight">Group Settings</h3>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="text-slate-500 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 flex flex-col items-center border-b border-border-dark">
            <div className="relative mb-4">
              <div className="size-24 rounded-full p-1 border-2 border-primary/30">
                <img className="size-full rounded-full object-cover border-4 border-surface-dark" src="https://picsum.photos/seed/yoga/200/200" alt="G" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center">Yoga Enthusiasts</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Admin: Mariyam Sara</p>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Spread the word</p>
              <button 
                onClick={() => { setIsShareModalOpen(true); setShowAllPlatforms(false); }}
                className="w-full h-14 bg-primary hover:bg-accent text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                Share Group
              </button>
              <p className="mt-3 text-[10px] text-slate-500 italic text-center leading-relaxed px-4">New members must use the join link to request access.</p>
            </section>

            {isAdmin && (
              <section>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Admin Controls</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowRecurringModal(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/40 border border-border-dark hover:border-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">event_repeat</span>
                    <span className="text-[9px] font-bold text-white uppercase">Recurring</span>
                  </button>
                  <button 
                    onClick={() => { alert('Opening activity listing in edit mode...'); }}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/40 border border-border-dark hover:border-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">edit_note</span>
                    <span className="text-[9px] font-bold text-white uppercase">Edit Details</span>
                  </button>
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Members ({members.length})</p>
              </div>

              <div className="space-y-4">
                {members.map((member, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={member.avatar} className="size-8 rounded-full object-cover border border-border-dark" alt="" />
                        {member.online && <span className="absolute bottom-0 right-0 size-2 bg-green-500 border border-surface-dark rounded-full"></span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{member.name}</p>
                        <p className="text-[9px] text-slate-500 font-medium">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isAdmin && member.role !== 'Admin' && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Remove ${member.name} from the group?`)) {
                              onRemoveMember(member.name);
                            }
                          }}
                          className="size-6 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                          title="Remove Member"
                        >
                          <span className="material-symbols-outlined text-sm">person_remove</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setReportingTarget({ name: member.name, type: 'user' })}
                        className="size-6 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-colors"
                        title="Report User"
                      >
                        <span className="material-symbols-outlined text-sm">report</span>
                      </button>
                      <button 
                        onClick={() => { if(window.confirm(`Block ${member.name}?`)) alert(`${member.name} blocked.`); }}
                        className="size-6 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                        title="Block User"
                      >
                        <span className="material-symbols-outlined text-sm">block</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-3 pt-4 border-t border-border-dark">
              <button 
                onClick={() => setReportingTarget({ name: 'Yoga Enthusiasts Group', type: 'group' })}
                className="w-full flex items-center justify-start gap-3 py-2 px-3 rounded-lg text-slate-400 hover:bg-amber-500/10 hover:text-amber-500 transition-all text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-lg text-amber-500/60">report</span> Report Group
              </button>
              <button 
                className="w-full flex items-center justify-start gap-3 py-2 px-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-lg text-red-500/60">block</span> Block Group
              </button>
              <button className="w-full flex items-center justify-start gap-3 py-3 px-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold mt-4 shadow-lg shadow-red-500/5">
                <span className="material-symbols-outlined text-lg">logout</span> Leave Group
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Report Reason Modal */}
      {reportingTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setReportingTarget(null)}></div>
          <div className="relative w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <header className="p-8 border-b border-border-dark shrink-0">
              <h3 className="text-2xl font-black text-white tracking-tight">Report {reportingTarget.name}</h3>
              <p className="text-sm text-slate-400 mt-1">Why are you reporting this {reportingTarget.type}?</p>
            </header>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-1">
                {reportReasons.map((reason) => (
                  <button 
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      reportReason === reason 
                      ? 'bg-primary/10 border border-primary text-white' 
                      : 'bg-transparent border border-transparent text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm font-bold">{reason}</span>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      reportReason === reason ? 'border-primary bg-primary' : 'border-slate-700'
                    }`}>
                      {reportReason === reason && <div className="size-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              {reportReason === 'Other' && (
                <div className="mt-4 p-2 animate-in slide-in-from-top-2 duration-300">
                  <textarea 
                    className="w-full bg-slate-900 border border-border-dark rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                    placeholder="Please specify your reason..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <footer className="p-8 border-t border-border-dark shrink-0 flex gap-3">
              <button 
                onClick={() => setReportingTarget(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={!reportReason || (reportReason === 'Other' && !otherReason.trim())}
                onClick={handleReportSubmit}
                className="flex-1 bg-primary hover:bg-accent text-white py-4 rounded-2xl font-black transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-primary/20"
              >
                Report
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Report Confirmation Modal */}
      {showReportConfirmation && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowReportConfirmation(false)}></div>
          <div className="relative w-full max-w-sm bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-200">
            <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl fill-1">verified_user</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Thanks for letting us know.</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">Your safety is our priority. We’ll review this shortly and take the necessary actions.</p>
            <button 
              onClick={() => setShowReportConfirmation(false)}
              className="w-full bg-primary hover:bg-accent text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary/20"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hingaa Dhimaavaan Share Modal */}
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
              <div className="p-5 md:p-6 bg-slate-900/50 rounded-3xl border border-border-dark flex flex-col items-center gap-3 text-center">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Group Code</p>
                <div className="text-3xl font-black text-primary tracking-tighter">{joinCode}</div>
                <button onClick={() => copyToClipboard(joinCode)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                </button>
              </div>

              <div className="relative">
                <input readOnly value={shareLink} className="w-full bg-slate-900 border border-border-dark rounded-xl py-3 pl-4 pr-20 text-xs text-slate-300 font-medium" />
                <button onClick={() => copyToClipboard(shareLink)} className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider">Copy</button>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Share via</p>
                
                <button 
                  className="w-full h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined fill-1">camera</span>
                  Instagram
                </button>

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

      {/* Recurring Activity Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRecurringModal(false)}></div>
          <div className="relative w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <header className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white">Setup Recurrence</h3>
                <p className="text-xs text-slate-400">Automate your activity schedule</p>
              </div>
              <button onClick={() => setShowRecurringModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 px-1">Recurrence Pattern</label>
                <div className="grid grid-cols-2 gap-2">
                  {['daily', 'weekly', 'monthly', 'custom'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setRecurrence({ ...recurrence, type })}
                      className={`py-3 rounded-xl font-bold text-xs uppercase transition-all border ${recurrence.type === type ? 'bg-primary text-white border-primary' : 'bg-slate-900 text-slate-400 border-border-dark hover:border-slate-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {recurrence.type === 'weekly' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 px-1">Repeat on</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const key = `${day}-${i}`;
                          const newDays = recurrence.days.includes(key) 
                            ? recurrence.days.filter(d => d !== key)
                            : [...recurrence.days, key];
                          setRecurrence({ ...recurrence, days: newDays });
                        }}
                        className={`size-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${recurrence.days.some(d => d.startsWith(day) && d.endsWith(i.toString())) ? 'bg-primary text-white' : 'bg-slate-900 text-slate-500 border border-border-dark'}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 px-1">Repeat Until (Date)</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-900 border border-border-dark rounded-xl p-4 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  value={recurrence.repeatUntil}
                  onChange={(e) => setRecurrence({ ...recurrence, repeatUntil: e.target.value })}
                />
                <p className="mt-2 text-[10px] text-slate-500 italic">Activity will automatically re-list on the selected dates until this date.</p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => { alert('Recurrence pattern saved successfully!'); setShowRecurringModal(false); }}
                  className="w-full bg-primary hover:bg-accent text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">save</span>
                  Save Recurrence Pattern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
