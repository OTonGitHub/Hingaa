
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { magicFillActivity, moderateActivityContent } from '../lib/ai';

interface CreateActivityProps {
  onPublish: () => void;
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onPublish }) => {
  const [magicInput, setMagicInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Social Gathering',
    participantLimit: 5,
    date: '',
    time: '',
    location: '',
    latitude: '',
    longitude: ''
  });
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMagicFill = async () => {
    if (!magicInput.trim()) return;
    setIsMagicLoading(true);
    setErrorMessage(null);

    try {
      const result = await magicFillActivity(magicInput);
      setFormData(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error("AI Magic Fill failed", error);
      setErrorMessage((error as Error).message || "Could not parse magic input. Please try again.");
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      setErrorMessage("Please fill in the title, description, and location.");
      return;
    }

    setIsPublishing(true);
    setErrorMessage(null);

    try {
      const result = await moderateActivityContent(formData.title, formData.description);
      
      if (result.safe) {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error('Please sign in before publishing an activity.');
        }

        const { error: insertError } = await supabase.from('activities').insert({
          host_id: authData.user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          participant_limit: formData.participantLimit,
          activity_date: formData.date || null,
          activity_time: formData.time || null,
          location_name: formData.location,
          latitude: formData.latitude ? Number(formData.latitude) : null,
          longitude: formData.longitude ? Number(formData.longitude) : null,
          image_url: 'https://picsum.photos/seed/' + Date.now() + '/800/600',
          status: 'open'
        });

        if (insertError) throw insertError;

        onPublish();
      } else {
        setErrorMessage(`Content restricted: ${result.reason || "The content violates our safety guidelines (e.g. inappropriate topics, drugs, or violence)."}`);
      }
    } catch (error) {
      console.error("Moderation failed", error);
      setErrorMessage((error as Error).message || "A technical error occurred during moderation. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-dark">
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8 pb-32">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">Create Activity</h2>
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-tight">{errorMessage}</p>
            </div>
          )}
        </header>

        {/* AI Assistant Section */}
        <section className="mb-10">
          <div className="bg-surface-dark p-1 rounded-3xl border border-border-dark shadow-2xl shadow-primary/5">
            <div className="flex flex-col">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-base md:text-lg p-6 min-h-[100px] md:min-h-[120px] resize-none placeholder:text-slate-500 text-white font-medium" 
                placeholder="What are you planning? (e.g., A night fishing trip next Friday for 5 people)"
                value={magicInput}
                onChange={(e) => setMagicInput(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/5 rounded-b-[1.4rem] border-t border-white/5 gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Intelligence</span>
                </div>
                <button 
                  onClick={handleMagicFill}
                  disabled={isMagicLoading || isPublishing}
                  className="w-full sm:w-auto bg-primary hover:bg-accent text-white px-6 py-2 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
                >
                  <span className="material-symbols-outlined text-lg">{isMagicLoading ? 'sync' : 'magic_button'}</span>
                  {isMagicLoading ? 'Thinking...' : 'Magic Fill'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Standard Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Activity Title</label>
              <input 
                className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm" 
                placeholder="Catchy name" 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Description</label>
              <textarea 
                className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 min-h-[120px] md:min-h-[160px] focus:border-primary focus:ring-0 transition-all text-slate-300 font-medium leading-relaxed text-sm" 
                placeholder="Details about the event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Schedule</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm" 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <input 
                  className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm" 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Location</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-xl">location_on</span>
                <input 
                  className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 pl-12 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm" 
                  placeholder="Where is it happening?" 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Coordinates (Optional)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm"
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
                <input
                  className="w-full bg-surface-dark border-border-dark rounded-xl md:rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all text-white font-bold text-sm"
                  placeholder="Longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 px-1 text-slate-500 uppercase tracking-widest">Capacity</label>
              <div className="flex items-center bg-surface-dark border border-border-dark rounded-xl md:rounded-2xl h-14 md:h-[60px] overflow-hidden">
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, participantLimit: Math.max(1, prev.participantLimit - 1) }))}
                  className="w-14 md:w-16 h-full flex items-center justify-center text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <div className="flex-1 text-center font-black text-lg md:text-xl text-white">{formData.participantLimit}</div>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, participantLimit: prev.participantLimit + 1 }))}
                  className="w-14 md:w-16 h-full flex items-center justify-center text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 lg:bottom-0 inset-x-0 lg:left-[18rem] bg-background-dark/90 backdrop-blur-2xl border-t border-border-dark p-4 md:p-6 z-[60] flex flex-col sm:flex-row justify-end items-center px-4 md:px-12 gap-4">
        {isPublishing && (
          <div className="flex items-center gap-3 text-primary animate-pulse">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Auditing Content...</span>
          </div>
        )}
        <button 
          onClick={handlePublish}
          disabled={isPublishing || isMagicLoading}
          className="w-full sm:w-auto sm:min-w-[240px] h-12 md:h-14 bg-primary hover:bg-accent text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl shadow-primary/40 transition-all disabled:opacity-50"
        >
          {isPublishing ? 'Publishing...' : 'Publish Activity'}
          <span className="material-symbols-outlined text-xl">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};

export default CreateActivity;
