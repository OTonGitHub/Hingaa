import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import NotificationDrawer from './components/NotificationDrawer';
import Discover from './views/Discover';
import MapsView from './views/MapsView';
import MyActivities from './views/MyActivities';
import ActivityDetails from './views/ActivityDetails';
import GroupChat from './views/GroupChat';
import CreateActivity from './views/CreateActivity';
import Settings from './views/Settings';
import Profile from './views/Profile';
import Archive from './views/Archive';
import Onboarding from './views/Onboarding';
import Auth from './views/Auth';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { mapDbActivityToUi } from './lib/activityMappers';
import { Activity, DbActivity } from './types';

type OutgoingRequest = {
  id: string;
  activityId: string;
  activityTitle: string;
  status: string;
  image: string;
  date: string;
  location: string;
};

type PendingRequest = {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  activityId: string;
  activityTitle: string;
  time: string;
};

type BlockedUserInfo = {
  id: string;
  name: string;
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('onboarding_complete') === 'true';
  });
  const [currentView, setCurrentView] = useState('discover');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dbActivities, setDbActivities] = useState<DbActivity[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activityMembers, setActivityMembers] = useState<Record<string, any[]>>({});
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [blockedUsersInfo, setBlockedUsersInfo] = useState<BlockedUserInfo[]>([]);
  const [declineCounts, setDeclineCounts] = useState<Record<string, number>>({});
  const [showStatusModal, setShowStatusModal] = useState<{ title: string; message: string } | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState<{ userId: string; userName: string } | null>(null);

  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const bootstrapSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoadingSession(false);
    };
    bootstrapSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshActivities = useCallback(async () => {
    const { data: activityRows, error } = await supabase
      .from('activities')
      .select('id,host_id,title,description,category,participant_limit,activity_date,activity_time,location_name,latitude,longitude,image_url,status,created_at,profiles:host_id(full_name,avatar_url)')
      .order('created_at', { ascending: false });

    if (error || !activityRows) return;

    const { data: memberRows } = await supabase
      .from('activity_members')
      .select('activity_id')
      .eq('status', 'active');

    const counts = new Map<string, number>();
    for (const row of memberRows || []) {
      const key = row.activity_id as string;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const mappedDb = activityRows as unknown as DbActivity[];
    setDbActivities(mappedDb);
    setActivities(mappedDb.map((a) => mapDbActivityToUi(a, counts.get(a.id) || 0)));
  }, []);

  const refreshRequests = useCallback(async () => {
    if (!currentUserId) return;

    const { data: outgoing } = await supabase
      .from('join_requests')
      .select('id,activity_id,status,created_at')
      .eq('user_id', currentUserId)
      .in('status', ['pending', 'approved']);

    const outgoingActivityIds = Array.from(new Set((outgoing || []).map((r) => r.activity_id)));
    const { data: outgoingActivities } = outgoingActivityIds.length
      ? await supabase
          .from('activities')
          .select('id,title,image_url,location_name,activity_date,activity_time')
          .in('id', outgoingActivityIds)
      : { data: [] as any[] };

    const activityById = new Map((outgoingActivities || []).map((a) => [a.id, a]));
    setOutgoingRequests(
      (outgoing || [])
        .filter((r) => r.status === 'pending')
        .map((r) => {
          const act = activityById.get(r.activity_id);
          const dateValue = act?.activity_date ? new Date(act.activity_date).toLocaleDateString() : 'TBD';
          return {
            id: r.id,
            activityId: r.activity_id,
            activityTitle: act?.title || 'Activity',
            status: 'Awaiting Approval',
            image: act?.image_url || `https://picsum.photos/seed/${r.activity_id}/800/600`,
            date: dateValue,
            location: act?.location_name || 'TBD'
          };
        })
    );

    const { data: hostedActivities } = await supabase.from('activities').select('id').eq('host_id', currentUserId);
    const hostedIds = (hostedActivities || []).map((a) => a.id);
    if (!hostedIds.length) {
      setPendingRequests([]);
      return;
    }

    const { data: pending } = await supabase
      .from('join_requests')
      .select('id,activity_id,user_id,created_at')
      .eq('status', 'pending')
      .in('activity_id', hostedIds);

    const requesterIds = Array.from(new Set((pending || []).map((r) => r.user_id)));
    const pendingActivityIds = Array.from(new Set((pending || []).map((r) => r.activity_id)));

    const [{ data: requesterProfiles }, { data: requestActivities }] = await Promise.all([
      requesterIds.length ? supabase.from('profiles').select('id,full_name,avatar_url').in('id', requesterIds) : Promise.resolve({ data: [] as any[] }),
      pendingActivityIds.length ? supabase.from('activities').select('id,title').in('id', pendingActivityIds) : Promise.resolve({ data: [] as any[] })
    ]);

    const profileById = new Map((requesterProfiles || []).map((p) => [p.id, p]));
    const requestActivityById = new Map((requestActivities || []).map((a) => [a.id, a]));

    setPendingRequests(
      (pending || []).map((req) => {
        const profile = profileById.get(req.user_id);
        const act = requestActivityById.get(req.activity_id);
        return {
          id: req.id,
          userId: req.user_id,
          userName: profile?.full_name || 'User',
          avatar: profile?.avatar_url || `https://picsum.photos/seed/${req.user_id}/100/100`,
          activityId: req.activity_id,
          activityTitle: act?.title || 'Activity',
          time: new Date(req.created_at).toLocaleTimeString()
        };
      })
    );
  }, [currentUserId]);

  const refreshBlocks = useCallback(async () => {
    if (!currentUserId) return;
    const { data } = await supabase.from('user_blocks').select('blocked_id').eq('blocker_id', currentUserId);
    const blockedIds = (data || []).map((b) => b.blocked_id);
    setBlockedUsers(blockedIds);

    if (!blockedIds.length) {
      setBlockedUsersInfo([]);
      return;
    }

    const { data: profileRows } = await supabase.from('profiles').select('id,full_name').in('id', blockedIds);
    const profileById = new Map((profileRows || []).map((p) => [p.id, p.full_name || 'Blocked user']));
    setBlockedUsersInfo(blockedIds.map((id) => ({ id, name: profileById.get(id) || 'Blocked user' })));
  }, [currentUserId]);

  const handleUnblock = async (userId: string) => {
    if (!currentUserId) return;
    await supabase.from('user_blocks').delete().eq('blocker_id', currentUserId).eq('blocked_id', userId);
    await refreshBlocks();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentView('discover');
  };

  const refreshMembers = useCallback(
    async (activityId: string) => {
      const { data: members } = await supabase
        .from('activity_members')
        .select('user_id,role,status')
        .eq('activity_id', activityId)
        .eq('status', 'active');

      const userIds = (members || []).map((m) => m.user_id);
      const { data: profiles } = userIds.length
        ? await supabase.from('profiles').select('id,full_name,avatar_url').in('id', userIds)
        : { data: [] as any[] };

      const profileById = new Map((profiles || []).map((p) => [p.id, p]));

      setActivityMembers((prev) => ({
        ...prev,
        [activityId]: (members || []).map((m) => {
          const profile = profileById.get(m.user_id);
          return {
            id: m.user_id,
            name: profile?.full_name || 'Member',
            role: m.role === 'host' ? 'Organizer' : 'Verified',
            avatar: profile?.avatar_url || `https://picsum.photos/seed/${m.user_id}/100/100`,
            online: true
          };
        })
      }));
    },
    []
  );

  useEffect(() => {
    if (!currentUserId) return;
    refreshActivities();
    refreshRequests();
    refreshBlocks();
  }, [currentUserId, refreshActivities, refreshRequests, refreshBlocks]);

  useEffect(() => {
    if (!currentUserId) return;
    const channel = supabase
      .channel(`requests:${currentUserId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'join_requests' }, () => {
        refreshRequests();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, refreshRequests]);

  useEffect(() => {
    if (!selectedActivityId) return;
    refreshMembers(selectedActivityId);
  }, [selectedActivityId, refreshMembers]);

  const navigateTo = (view: string, id: string | null = null) => {
    setCurrentView(view);
    setSelectedActivityId(id);
    setIsNotificationsOpen(false);
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding_complete', 'true');
    setCurrentView('discover');
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleJoinRequest = async (activityId: string, activityTitle: string) => {
    if (!currentUserId) return;
    const targetActivity = dbActivities.find((a) => a.id === activityId);
    const targetHostId = targetActivity?.host_id;
    if (targetHostId && blockedUsers.includes(targetHostId)) {
      setShowStatusModal({
        title: 'Action Restricted',
        message: 'You cannot join activities organized by this user.'
      });
      return;
    }

    const { error } = await supabase.from('join_requests').upsert(
      {
        activity_id: activityId,
        user_id: currentUserId,
        status: 'pending'
      },
      { onConflict: 'activity_id,user_id' }
    );

    if (error) {
      setShowStatusModal({ title: 'Request Failed', message: error.message });
      return;
    }

    await refreshRequests();
    setShowStatusModal({
      title: 'Request Sent!',
      message: `Your request to join "${activityTitle}" has been sent to the organizer.`
    });
  };

  const handleWithdrawRequest = async (requestId: string) => {
    if (!currentUserId) return;
    await supabase
      .from('join_requests')
      .update({ status: 'withdrawn' })
      .eq('id', requestId)
      .eq('user_id', currentUserId)
      .eq('status', 'pending');
    refreshRequests();
  };

  const acceptRequest = async (requestId: string) => {
    const { error } = await supabase.rpc('approve_join_request', { request_id: requestId });
    if (error) {
      setShowStatusModal({ title: 'Action Failed', message: error.message });
      return;
    }
    await refreshRequests();
    if (selectedActivityId) refreshMembers(selectedActivityId);
    setShowStatusModal({ title: 'User Accepted', message: 'The user has been added to the activity and chat.' });
  };

  const declineRequest = async (requestId: string) => {
    const req = pendingRequests.find((r) => r.id === requestId);
    if (!req) return;
    const newCount = (declineCounts[req.userId] || 0) + 1;
    setDeclineCounts((prev) => ({ ...prev, [req.userId]: newCount }));

    const { error } = await supabase.rpc('decline_join_request', { request_id: requestId });
    if (error) {
      setShowStatusModal({ title: 'Action Failed', message: error.message });
      return;
    }
    await refreshRequests();
    if (newCount >= 3) setShowBlockConfirm({ userId: req.userId, userName: req.userName });
  };

  const blockUser = async (userId: string) => {
    if (!currentUserId) return;
    await supabase.from('user_blocks').upsert({ blocker_id: currentUserId, blocked_id: userId }, { onConflict: 'blocker_id,blocked_id' });
    await refreshBlocks();
    setShowBlockConfirm(null);
    setShowStatusModal({
      title: 'User Blocked',
      message: 'This user will no longer be able to request your activities.'
    });
  };

  const handleRemoveMember = async (groupId: string, memberId: string) => {
    await supabase
      .from('activity_members')
      .update({ status: 'removed' })
      .eq('activity_id', groupId)
      .eq('user_id', memberId);
    refreshMembers(groupId);
  };

  const selectedActivity = useMemo(() => activities.find((a) => a.id === selectedActivityId) || null, [activities, selectedActivityId]);
  const fallbackChatActivityId = useMemo(() => selectedActivityId || dbActivities[0]?.id || null, [selectedActivityId, dbActivities]);

  const renderView = () => {
    if (!hasCompletedOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentView) {
      case 'discover':
        return (
          <Discover
            activities={activities}
            onActivityClick={(id) => navigateTo('activity-details', id)}
            onCreateClick={() => navigateTo('create-activity')}
            onToggleNotifications={toggleNotifications}
            onJoinRequest={handleJoinRequest}
          />
        );
      case 'maps':
        return <MapsView onActivityClick={(id) => navigateTo('activity-details', id)} onJoinRequest={handleJoinRequest} />;
      case 'my-activities':
        return (
          <MyActivities
            onActivityClick={(id) => navigateTo('activity-details', id)}
            onCreateClick={() => navigateTo('create-activity')}
            onNavigateToArchive={() => navigateTo('archive')}
            outgoingRequests={outgoingRequests}
            onWithdraw={handleWithdrawRequest}
          />
        );
      case 'archive':
        return <Archive onActivityClick={(id) => navigateTo('activity-details', id)} />;
      case 'activity-details':
        return (
          <ActivityDetails
            id={selectedActivityId}
            activity={selectedActivity}
            onBack={() => navigateTo('discover')}
            onOpenMaps={() => navigateTo('maps')}
            members={selectedActivityId ? activityMembers[selectedActivityId] || [] : []}
            onJoinRequest={handleJoinRequest}
          />
        );
      case 'group-chat':
        return (
          <GroupChat
            activityId={fallbackChatActivityId}
            members={fallbackChatActivityId ? activityMembers[fallbackChatActivityId] || [] : []}
            pastConnections={[]}
            onRemoveMember={(memberId) => {
              if (fallbackChatActivityId) handleRemoveMember(fallbackChatActivityId, memberId);
            }}
          />
        );
      case 'create-activity':
        return (
          <CreateActivity
            onPublish={() => {
              refreshActivities();
              navigateTo('discover');
            }}
          />
        );
      case 'settings':
        return <Settings email={session?.user?.email} blockedUsers={blockedUsersInfo} onUnblock={handleUnblock} onSignOut={handleSignOut} />;
      case 'profile':
        return <Profile onActivityClick={(id) => navigateTo('activity-details', id)} />;
      default:
        return (
          <Discover
            activities={activities}
            onActivityClick={(id) => navigateTo('activity-details', id)}
            onCreateClick={() => navigateTo('create-activity')}
            onToggleNotifications={toggleNotifications}
            onJoinRequest={handleJoinRequest}
          />
        );
    }
  };

  if (loadingSession) {
    return <div className="h-screen bg-background-dark text-white flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background-dark relative">
      {hasCompletedOnboarding && !isMobile && <Sidebar currentView={currentView} onNavigate={navigateTo} />}

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${hasCompletedOnboarding && isMobile ? 'pb-20' : ''}`}>
        {renderView()}
      </main>

      {hasCompletedOnboarding && isMobile && (
        <>
          <button
            onClick={toggleNotifications}
            className="fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl z-[60] active:scale-95 transition-all border-4 border-background-dark"
          >
            <span className="material-symbols-outlined text-2xl fill-1">notifications</span>
            {pendingRequests.length > 0 && <span className="absolute top-0 right-0 size-4 bg-red-500 rounded-full border-2 border-primary animate-pulse"></span>}
          </button>
          <BottomNav currentView={currentView} onNavigate={navigateTo} />
        </>
      )}

      {hasCompletedOnboarding && (
        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onActivityClick={(id) => navigateTo('activity-details', id)}
          requests={pendingRequests}
          onAccept={acceptRequest}
          onDecline={declineRequest}
        />
      )}

      {showStatusModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowStatusModal(null)}></div>
          <div className="relative w-full max-w-sm bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">info</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{showStatusModal.title}</h3>
            <p className="text-slate-400 text-sm mb-8">{showStatusModal.message}</p>
            <button onClick={() => setShowStatusModal(null)} className="w-full bg-primary hover:bg-accent text-white py-4 rounded-2xl font-bold transition-all">
              Got it
            </button>
          </div>
        </div>
      )}

      {showBlockConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowBlockConfirm(null)}></div>
          <div className="relative w-full max-w-sm bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Block {showBlockConfirm.userName}?</h3>
            <p className="text-slate-400 text-sm mb-8">This user has been declined multiple times. Blocking will prevent them from joining your future groups.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBlockConfirm(null)} className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-bold transition-all">
                Cancel
              </button>
              <button onClick={() => blockUser(showBlockConfirm.userId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20">
                Block User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
