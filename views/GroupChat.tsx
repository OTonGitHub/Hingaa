import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  name: string;
  role: 'Admin' | 'Member' | 'Organizer' | 'Verified';
  avatar: string;
  online?: boolean;
}

interface GroupChatProps {
  activityId: string | null;
  members: Member[];
  pastConnections: any[];
  onRemoveMember: (memberId: string) => void;
}

interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  senderName: string;
  senderAvatar: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ activityId, members, onRemoveMember }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMyUserId(data.user?.id || null));
  }, []);

  useEffect(() => {
    if (!activityId) {
      setMessages([]);
      return;
    }

    let mounted = true;

    const loadMessages = async () => {
      const { data: rows } = await supabase
        .from('messages')
        .select('id,user_id,content,created_at')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: true });

      const userIds = Array.from(new Set((rows || []).map((m) => m.user_id)));
      const { data: profiles } = userIds.length
        ? await supabase.from('profiles').select('id,full_name,avatar_url').in('id', userIds)
        : { data: [] as any[] };

      const profileById = new Map((profiles || []).map((p) => [p.id, p]));

      if (!mounted) return;
      setMessages(
        (rows || []).map((m) => ({
          ...m,
          senderName: profileById.get(m.user_id)?.full_name || 'Member',
          senderAvatar: profileById.get(m.user_id)?.avatar_url || `https://picsum.photos/seed/${m.user_id}/100/100`
        }))
      );
    };

    loadMessages();

    const channel = supabase
      .channel(`chat:${activityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `activity_id=eq.${activityId}`
        },
        async (payload) => {
          const row = payload.new as { id: string; user_id: string; content: string; created_at: string };
          const { data: profile } = await supabase.from('profiles').select('id,full_name,avatar_url').eq('id', row.user_id).maybeSingle();
          setMessages((prev) => [
            ...prev,
            {
              ...row,
              senderName: profile?.full_name || 'Member',
              senderAvatar: profile?.avatar_url || `https://picsum.photos/seed/${row.user_id}/100/100`
            }
          ]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [activityId]);

  const sendMessage = async () => {
    if (!activityId || !myUserId || !draft.trim()) return;
    await supabase.from('messages').insert({
      activity_id: activityId,
      user_id: myUserId,
      content: draft.trim()
    });
    setDraft('');
  };

  const onlineCount = useMemo(() => members.filter((m) => m.online).length, [members]);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 flex flex-col bg-background-dark">
        <header className="h-20 flex-shrink-0 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img className="size-12 rounded-full object-cover border-2 border-primary" src="https://picsum.photos/seed/group/100/100" alt="Group" />
              <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-[3px] border-surface-dark rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">Activity Chat</h2>
              <p className="text-xs text-slate-400 font-medium">{members.length} Members • {onlineCount} Online</p>
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
          {!activityId && <p className="text-slate-500 text-center py-10">Select an activity to open group chat.</p>}
          {messages.map((msg) => {
            const self = msg.user_id === myUserId;
            return (
              <div key={msg.id} className={`flex gap-3 max-w-2xl ${self ? 'flex-row-reverse self-end' : ''}`}>
                <img className="size-10 rounded-full object-cover mt-1" src={msg.senderAvatar} alt={msg.senderName} />
                <div className={`flex flex-col gap-1 ${self ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 ${self ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-bold text-white">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{new Date(msg.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm border ${self ? 'bg-primary border-primary/20 rounded-tr-none text-white' : 'bg-surface-dark border-border-dark rounded-tl-none text-slate-200'}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-surface-dark border-t border-border-dark">
          <div className="max-w-4xl mx-auto relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                className="w-full bg-slate-900 border-border-dark border rounded-xl py-3 px-4 text-sm text-white focus:ring-1 focus:ring-primary"
                placeholder="Send a message..."
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />
            </div>
            <button onClick={sendMessage} className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <aside className={`w-80 border-l border-border-dark bg-surface-dark flex flex-col transition-all duration-300 ${isSettingsOpen ? 'mr-0 opacity-100' : '-mr-80 opacity-0'} absolute right-0 top-0 h-full z-30 shadow-2xl xl:relative xl:mr-0 xl:opacity-100 ${!isSettingsOpen ? 'xl:hidden' : 'xl:flex'}`}>
        <header className="p-6 border-b border-border-dark flex items-center justify-between">
          <h3 className="font-bold text-white tracking-tight">Group Members</h3>
          <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img src={member.avatar} className="size-8 rounded-full object-cover border border-border-dark" alt="" />
                <div>
                  <p className="text-xs font-bold text-white">{member.name}</p>
                  <p className="text-[9px] text-slate-500">{member.role}</p>
                </div>
              </div>
              {member.role !== 'Organizer' && (
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                  title="Remove member"
                >
                  <span className="material-symbols-outlined text-sm">person_remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default GroupChat;
