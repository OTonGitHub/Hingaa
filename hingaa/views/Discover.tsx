
import React, { useState } from 'react';
import { Activity, ActivityStatus } from '../types';
import ActivityCard from '../components/ActivityCard';
import { GoogleGenAI, Type } from "@google/genai";

interface DiscoverProps {
  onActivityClick: (id: string) => void;
  onCreateClick: () => void;
  onToggleNotifications: () => void;
  onJoinRequest: (id: string, title: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onActivityClick, onCreateClick, onToggleNotifications, onJoinRequest }) => {
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'weekend'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[] | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Hardcoded for demo - usually these would come from a backend
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Night Fishing Experience',
      description: 'Experience the traditional Maldivian way of night fishing under the stars. Join us for a calm and fruitful evening on the sea.',
      date: 'Today',
      time: '8:00 PM',
      hostName: 'Ahmed Hassan',
      hostAvatar: 'https://picsum.photos/seed/host1/100/100',
      participants: 16,
      participantLimit: 22,
      location: 'Hulhumalé',
      status: ActivityStatus.OPEN,
      image: 'https://picsum.photos/seed/fishing/800/600',
      tags: ['Fishing', 'Outdoor']
    },
    {
      id: '2',
      title: 'Startup Pitch & Networking',
      description: 'A private session for early-stage founders to practice their pitches and get constructive feedback from local mentors.',
      date: 'Dec 11',
      time: '4:00 PM',
      hostName: 'Sara M.',
      hostAvatar: 'https://picsum.photos/seed/host2/100/100',
      participants: 8,
      participantLimit: 12,
      location: "Male' City",
      status: ActivityStatus.REQUEST,
      image: 'https://picsum.photos/seed/startup/800/600',
      tags: ['Business', 'Networking']
    },
    {
      id: '6',
      title: 'Weekend Surf Trip',
      description: 'Heading out to Cokes and Chickens. Intermediate surfers only please.',
      date: 'Saturday',
      time: '6:00 AM',
      hostName: 'Ali Surf',
      hostAvatar: 'https://picsum.photos/seed/surf/100/100',
      participants: 4,
      participantLimit: 6,
      location: "Thulusdhoo",
      status: ActivityStatus.OPEN,
      image: 'https://picsum.photos/seed/surfing/800/600',
      tags: ['Sports', 'Water']
    }
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setAiMatches(null);
      setAiSuggestion(null);
      return;
    }

    if (searchQuery.toUpperCase().startsWith('MV-')) {
      const parts = searchQuery.split('-');
      if (parts.length >= 2) {
        const potentialId = parts[1].replace(/^0+/, ''); 
        const match = activities.find(a => a.id === potentialId);
        if (match) {
          onActivityClick(match.id);
          return;
        }
      }
    }

    setIsSearching(true);
    setAiMatches(null);
    setAiSuggestion(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const activityData = activities.map(a => ({ id: a.id, title: a.title, desc: a.description }));
      
      const prompt = `User query: "${searchQuery}"
      Available activities: ${JSON.stringify(activityData)}
      
      Task:
      1. Identify which activity IDs best match the user's intent. Return them in an array 'matches'.
      2. If no activities are a good match, provide a brief suggestion for a NEW activity that would satisfy the user in 'suggestion'.
      3. Return a JSON object.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestion: { type: Type.STRING, nullable: true }
            },
            required: ["matches"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setAiMatches(result.matches);
      if (result.matches.length === 0) {
        setAiSuggestion(result.suggestion || "Create a new custom activity based on your prompt.");
      }
    } catch (error) {
      console.error("AI Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAiMatches(null);
    setAiSuggestion(null);
  };

  const filteredActivities = activities.filter(activity => {
    if (aiMatches !== null) {
      return aiMatches.includes(activity.id);
    }
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterDate === 'all') return matchesSearch;
    if (filterDate === 'today') return matchesSearch && activity.date === 'Today';
    if (filterDate === 'weekend') return matchesSearch && (activity.date === 'Saturday' || activity.date === 'Sunday');
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark overflow-hidden">
      <header className="min-h-[96px] bg-surface-dark/80 backdrop-blur-md border-b border-border-dark px-4 md:px-8 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 py-4 gap-4">
        <form onSubmit={handleSearch} className="w-full md:flex-1 md:max-w-2xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-xl">
              {isSearching ? 'sync' : 'search'}
            </span>
            <input 
              className={`w-full bg-slate-800/50 border border-border-dark rounded-full pl-12 pr-28 md:pr-32 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-slate-500 text-slate-200 ${isSearching ? 'animate-pulse' : ''}`} 
              placeholder="Ask AI or enter code..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button type="button" onClick={clearSearch} className="p-1.5 text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
              <button type="submit" className="bg-primary hover:bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center gap-4 self-end md:self-auto">
          <button onClick={onToggleNotifications} className="hidden lg:flex size-10 md:size-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all relative border border-border-dark group">
            <span className="material-symbols-outlined group-hover:fill-1 transition-all text-xl">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-surface-dark animate-pulse"></span>
          </button>
          <button onClick={onCreateClick} className="hidden lg:flex items-center gap-2 bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/25 transition-all">
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Create</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {(aiMatches !== null || aiSuggestion !== null) && (
          <div className="mb-6 flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary fill-1">auto_awesome</span>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">AI Results</p>
                <p className="text-[10px] text-slate-400">"{searchQuery}"</p>
              </div>
            </div>
            <button onClick={clearSearch} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Clear</button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
            {aiMatches !== null ? 'Found Matches' : 'Happening Now'}
          </h2>
          <button onClick={onCreateClick} className="lg:hidden flex items-center justify-center size-10 bg-primary rounded-full text-white shadow-lg">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {aiMatches === null && (
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            <button onClick={() => setFilterDate('all')} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filterDate === 'all' ? 'bg-primary text-white border-primary' : 'bg-surface-dark border-border-dark text-slate-300'}`}>All</button>
            <button onClick={() => setFilterDate('today')} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filterDate === 'today' ? 'bg-primary text-white border-primary' : 'bg-surface-dark border-border-dark text-slate-300'}`}>Today</button>
            <button onClick={() => setFilterDate('weekend')} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filterDate === 'weekend' ? 'bg-primary text-white border-primary' : 'bg-surface-dark border-border-dark text-slate-300'}`}>Weekend</button>
          </div>
        )}

        <div className="space-y-6 pb-20 md:pb-0">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onClick={onActivityClick} 
                onJoinRequest={onJoinRequest}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-surface-dark/30 rounded-3xl border-2 border-dashed border-border-dark px-6 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">{isSearching ? 'search' : 'event_busy'}</span>
              <p className="text-slate-500 text-sm font-bold max-w-xs">{isSearching ? 'Analyzing activities...' : aiSuggestion ? aiSuggestion : 'No activities found matching your filters.'}</p>
              <button onClick={onCreateClick} className="mt-6 bg-white/5 text-white px-6 py-2.5 rounded-xl font-bold border border-border-dark text-xs">
                Start a Custom Activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
