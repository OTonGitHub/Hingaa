
import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('onboarding_complete') === 'true';
  });
  const [currentView, setCurrentView] = useState('discover');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Mock User Identity
  const currentUser = { id: 'me', name: 'Ahmed Zaeem', avatar: 'https://picsum.photos/seed/user/100/100' };

  // New state for past activity partners
  const [pastConnections] = useState<any[]>([
    { name: 'Aishath Riva', avatar: 'https://picsum.photos/seed/riva/100/100', bio: 'Yoga practitioner' },
    { name: 'Mohamed Shifau', avatar: 'https://picsum.photos/seed/shifau/100/100', bio: 'Outdoor enthusiast' },
  ]);

  // Track join requests sent by the user
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([
    {
      id: 'out_1',
      activityId: '1',
      activityTitle: 'Night Fishing Experience',
      status: 'Awaiting Approval',
      image: 'https://picsum.photos/seed/fishing/800/600',
      date: 'Dec 24, 8:00 PM',
      location: 'Hulhumalé Marina'
    }
  ]);

  // App State for incoming requests
  const [pendingRequests, setPendingRequests] = useState<any[]>([
    {
      id: 'req_1',
      userId: 'user_zeen',
      userName: 'Fathimath Zeen',
      avatar: 'https://picsum.photos/seed/z1/100/100',
      activityId: '1',
      activityTitle: 'Night Fishing Trip',
      time: '2 mins ago'
    }
  ]);
  
  const [activityMembers, setActivityMembers] = useState<Record<string, any[]>>({
    '1': [
      { name: 'Ahmed F.', role: 'Organizer', avatar: 'https://picsum.photos/seed/AhmedF/100/100' },
      { name: 'Sara M.', role: 'Verified', avatar: 'https://picsum.photos/seed/SaraM/100/100' },
      { name: 'Ibrahim S.', role: 'Verified', avatar: 'https://picsum.photos/seed/IbrahimS/100/100' }
    ],
    'yoga': [
      { name: 'Mariyam Sara', role: 'Admin', avatar: 'https://picsum.photos/seed/sara/100/100', online: true },
      { name: 'Hussain Ali', role: 'Member', avatar: 'https://picsum.photos/seed/hussain/100/100', online: true },
      { name: 'Ahmed Zaeem', role: 'Member', avatar: 'https://picsum.photos/seed/user/100/100', online: true },
    ]
  });

  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [declineCounts, setDeclineCounts] = useState<Record<string, number>>({});
  const [showStatusModal, setShowStatusModal] = useState<{title: string, message: string} | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState<{userId: string, userName: string} | null>(null);

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

  const handleJoinRequest = (activityId: string, activityTitle: string) => {
    if (blockedUsers.includes('organizer_id')) {
      setShowStatusModal({
        title: "Action Restricted",
        message: "You cannot join activities organized by this user."
      });
      return;
    }

    const newRequest = {
      id: `out_${Date.now()}`,
      activityId,
      activityTitle,
      status: 'Awaiting Approval',
      image: 'https://picsum.photos/seed/new/800/600',
      date: 'TBD',
      location: 'TBD'
    };

    setOutgoingRequests(prev => [...prev, newRequest]);

    setShowStatusModal({
      title: "Request Sent!",
      message: `Your request to join "${activityTitle}" has been sent to the organizer.`
    });
  };

  const handleWithdrawRequest = (requestId: string) => {
    setOutgoingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const acceptRequest = (requestId: string) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;

    setActivityMembers(prev => ({
      ...prev,
      [req.activityId]: [...(prev[req.activityId] || []), { 
        name: req.userName, 
        role: 'Verified', 
        avatar: req.avatar 
      }]
    }));

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    
    setShowStatusModal({
      title: "User Accepted",
      message: `${req.userName} has been added to "${req.activityTitle}" and its group chat.`
    });
  };

  const declineRequest = (requestId: string) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;

    const newCount = (declineCounts[req.userId] || 0) + 1;
    setDeclineCounts(prev => ({ ...prev, [req.userId]: newCount }));
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));

    if (newCount >= 3) {
      setShowBlockConfirm({ userId: req.userId, userName: req.userName });
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    setShowBlockConfirm(null);
    setShowStatusModal({
      title: "User Blocked",
      message: "This user will no longer be able to request your activities or join groups with you."
    });
  };

  const handleRemoveMember = (groupId: string, memberName: string) => {
    setActivityMembers(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(m => m.name !== memberName)
    }));
  };

  const renderView = () => {
    if (!hasCompletedOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentView) {
      case 'discover':
        return (
          <Discover 
            onActivityClick={(id) => navigateTo('activity-details', id)} 
            onCreateClick={() => navigateTo('create-activity')}
            onToggleNotifications={toggleNotifications}
            onJoinRequest={handleJoinRequest}
          />
        );
      case 'maps':
        return (
          <MapsView 
            onActivityClick={(id) => navigateTo('activity-details', id)} 
            onJoinRequest={handleJoinRequest}
          />
        );
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
            onBack={() => navigateTo('discover')} 
            onOpenMaps={() => navigateTo('maps')}
            members={selectedActivityId ? (activityMembers[selectedActivityId] || []) : []}
            onJoinRequest={handleJoinRequest}
          />
        );
      case 'group-chat':
        return (
          <GroupChat 
            members={activityMembers['yoga'] || []} 
            pastConnections={pastConnections}
            onRemoveMember={(name) => handleRemoveMember('yoga', name)}
          />
        );
      case 'create-activity':
        return <CreateActivity onPublish={() => navigateTo('discover')} />;
      case 'settings':
        return <Settings blockedUsers={blockedUsers} />;
      case 'profile':
        return <Profile onActivityClick={(id) => navigateTo('activity-details', id)} />;
      default:
        return <Discover onActivityClick={(id) => navigateTo('activity-details', id)} onCreateClick={() => navigateTo('create-activity')} onToggleNotifications={toggleNotifications} onJoinRequest={handleJoinRequest} />;
    }
  };

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
            {pendingRequests.length > 0 && (
              <span className="absolute top-0 right-0 size-4 bg-red-500 rounded-full border-2 border-primary animate-pulse"></span>
            )}
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
            <button 
              onClick={() => setShowStatusModal(null)}
              className="w-full bg-primary hover:bg-accent text-white py-4 rounded-2xl font-bold transition-all"
            >
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
            <p className="text-slate-400 text-sm mb-8">This user has been declined multiple times. Blocking will prevent them from joining any of your groups or activities.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowBlockConfirm(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => blockUser(showBlockConfirm.userId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20"
              >
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
