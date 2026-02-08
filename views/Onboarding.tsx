import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  'Welcome',
  'Profile info',
  'Visual identity',
  'Interests',
  'Agreement & Plan'
];

const interestCategories = [
  { id: 'food', label: 'Food & Dining', icon: 'restaurant' },
  { id: 'adventure', label: 'Adventure', icon: 'explore' },
  { id: 'sports', label: 'Sports & Fitness', icon: 'fitness_center' },
  { id: 'arts', label: 'Arts & Creativity', icon: 'palette' },
  { id: 'entertainment', label: 'Entertainment & Chill', icon: 'local_activity' },
  { id: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { id: 'learning', label: 'Learning & Skill-Building', icon: 'school' },
  { id: 'volunteer', label: 'Volunteer', icon: 'volunteer_activism' },
  { id: 'sidequests', label: 'Side Quests!', icon: 'auto_awesome' },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: 'Male',
    instaUsername: '',
    photo: null as string | null,
    interests: [] as string[],
    agreed: false,
    subscription: 'free' // 'free' or 'paid'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="fixed inset-0 bg-[#8f1d17] animate-in fade-in duration-700">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-multiply bg-cover bg-center"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1623916523922-64ef3d20739b?q=80&w=2070&auto=format&fit=crop")' }}
            ></div>
            
            {/* Centered Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-8">
              <div className="text-center select-none">
                <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter mb-0 leading-none drop-shadow-2xl">
                  Hingaa...
                </h1>
                <h2 className="text-7xl md:text-9xl font-extrabold text-[#111111] tracking-tighter mt-0 leading-none">
                  Dhimaavaan?
                </h2>
              </div>
              
              <div className="absolute bottom-24 flex flex-col items-center gap-6">
                <button 
                  onClick={nextStep}
                  className="bg-white text-primary px-16 py-5 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all active:scale-95"
                >
                  Lets go!
                </button>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-right-8 duration-300">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Tell us about yourself</h2>
            </header>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-surface-dark border border-border-dark rounded-2xl p-4 text-white font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-1">Birth Date</label>
                  <input 
                    type="date" 
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full bg-surface-dark border border-border-dark rounded-2xl p-4 text-white font-bold focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-1">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-surface-dark border border-border-dark rounded-2xl p-4 text-white font-bold focus:border-primary transition-all appearance-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-1">Instagram (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                  <input 
                    type="text" 
                    value={formData.instaUsername}
                    onChange={e => setFormData({...formData, instaUsername: e.target.value})}
                    className="w-full bg-surface-dark border border-border-dark rounded-2xl p-4 pl-10 text-white font-bold focus:border-primary transition-all"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-w-md mx-auto text-center space-y-8 animate-in slide-in-from-right-8 duration-300">
            <header>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Your Profile Photo</h2>
              <p className="text-slate-500">Real photos help build trust in activities.</p>
            </header>
            <div className="relative group mx-auto w-48 h-48">
              <div className="w-full h-full rounded-full border-4 border-dashed border-border-dark overflow-hidden flex items-center justify-center bg-surface-dark group-hover:border-primary/50 transition-all">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-slate-700">person</span>
                )}
              </div>
              <button 
                onClick={() => setFormData({...formData, photo: 'https://picsum.photos/seed/onboarding/400/400'})}
                className="absolute bottom-2 right-2 size-12 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:bg-accent transition-all active:scale-90"
              >
                <span className="material-symbols-outlined">add_a_photo</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 italic">Click the camera icon to upload your favorite portrait.</p>
          </div>
        );
      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-300">
            <header className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">What do you love?</h2>
              <p className="text-slate-500">Select at least 3 to get better recommendations.</p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interestCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${
                    formData.interests.includes(cat.id)
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-surface-dark border-border-dark text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-300">
            <header className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Final Step</h2>
              <p className="text-slate-500">Agreement and membership selection.</p>
            </header>
            
            <div className="space-y-6">
              <div className="p-6 bg-surface-dark border border-border-dark rounded-[2rem]">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span> 
                  User Agreement
                </h3>
                <div className="h-24 overflow-y-auto custom-scrollbar text-xs text-slate-500 leading-relaxed mb-4 pr-2">
                  By using Hingaa, you agree to treat all members with respect. Harassment, illegal activities, and inappropriate content are strictly prohibited. We prioritize the safety of our small island communities. Your participation in physical activities is at your own risk.
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={formData.agreed} 
                      onChange={e => setFormData({...formData, agreed: e.target.checked})}
                      className="peer sr-only"
                    />
                    <div className="size-6 bg-slate-800 border-2 border-border-dark rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <span className="material-symbols-outlined absolute inset-0 text-white text-sm flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">check</span>
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">I agree to the Community Guidelines</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setFormData({...formData, subscription: 'free'})}
                  className={`p-8 rounded-[2rem] border-2 transition-all text-left group ${
                    formData.subscription === 'free'
                    ? 'bg-primary/5 border-primary shadow-2xl'
                    : 'bg-surface-dark border-border-dark opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl">timer</span>
                    {formData.subscription === 'free' && <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Selected</span>}
                  </div>
                  <h4 className="text-xl font-black text-white mb-1">Free Trial</h4>
                  <p className="text-xs text-slate-500">7 days full access. Cancel anytime.</p>
                </button>

                <button 
                  onClick={() => setFormData({...formData, subscription: 'paid'})}
                  className={`p-8 rounded-[2rem] border-2 transition-all text-left group ${
                    formData.subscription === 'paid'
                    ? 'bg-primary/5 border-primary shadow-2xl'
                    : 'bg-surface-dark border-border-dark opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl">workspace_premium</span>
                    {formData.subscription === 'paid' && <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Selected</span>}
                  </div>
                  <h4 className="text-xl font-black text-white mb-1">Pro Member</h4>
                  <p className="text-xs text-slate-500">MVR 35/month. Priority join & creation.</p>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.fullName || !formData.birthDate;
    if (currentStep === 3) return formData.interests.length < 3;
    if (currentStep === 4) return !formData.agreed;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-background-dark z-[500] flex flex-col overflow-hidden">
      {currentStep > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 flex gap-1 z-10">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-primary' : 'bg-slate-800'}`} 
            />
          ))}
        </div>
      )}

      <div className={`flex-1 flex flex-col items-center justify-center ${currentStep === 0 ? '' : 'p-8'} overflow-y-auto custom-scrollbar`}>
        {renderStepContent()}
      </div>

      {currentStep > 0 && (
        <div className="p-8 bg-surface-dark border-t border-border-dark flex justify-between items-center px-12 z-20">
          <button 
            onClick={prevStep}
            className={`text-slate-500 font-bold flex items-center gap-2 hover:text-white transition-colors`}
          >
            <span className="material-symbols-outlined">west</span>
            Back
          </button>

          <div className="text-center hidden md:block">
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] mb-1">Step {currentStep + 1} of {steps.length}</p>
            <p className="text-xs font-bold text-white uppercase">{steps[currentStep]}</p>
          </div>

          {currentStep === steps.length - 1 ? (
            <button 
              onClick={onComplete}
              disabled={!formData.agreed}
              className="bg-primary hover:bg-accent text-white px-10 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-30 disabled:grayscale"
            >
              Complete Setup
            </button>
          ) : (
            <button 
              onClick={nextStep}
              disabled={isNextDisabled()}
              className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
            >
              Continue
              <span className="material-symbols-outlined">east</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;