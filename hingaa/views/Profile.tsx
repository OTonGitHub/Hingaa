
import React from 'react';

interface ProfileProps {
  onActivityClick: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onActivityClick }) => {
  const interests = ['#Statesmanship', '#Oratory', '#Law', '#Hiking'];
  const recommendations = [
    { id: '1', title: 'Local Debate Night', desc: 'This Friday • 4 participants joined', image: 'https://picsum.photos/seed/debate/400/300' },
    { id: '2', title: 'Philosophical Reading', desc: 'Saturday morning • 8 slots left', image: 'https://picsum.photos/seed/reading/400/300' },
    { id: '6', title: 'Sunset Reflection Walk', desc: 'Sunday evening • For all levels', image: 'https://picsum.photos/seed/walk/400/300' }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
      <div className="h-64 w-full bg-gradient-to-b from-primary/20 to-transparent absolute top-0 left-0 -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="flex justify-end mb-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-dark shadow-lg text-primary border border-border-dark hover:scale-105 transition-all">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full border-4 border-background-dark overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover" src="https://picsum.photos/seed/lincoln/400/400" alt="Abraham" />
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition-colors">
              <span className="material-symbols-outlined">photo_camera</span>
            </button>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Abraham Lincoln, 56</h1>
          
          <div className="mt-10 w-full max-w-2xl">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Brief Bio</label>
            <div className="bg-surface-dark/50 border border-border-dark rounded-2xl p-6 text-slate-300 italic text-lg">
              "A house divided against itself cannot stand. Believer in liberty, justice, and the power of a good debate."
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-16">
          <button className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:scale-105 transition-all shadow-xl shadow-primary/20 font-bold">
            Connect Instagram
          </button>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">My Interests</h2>
            <button className="text-primary text-sm font-semibold hover:underline">+ Add More</button>
          </div>
          <div className="flex flex-wrap gap-4">
            {interests.map(tag => (
              <span key={tag} className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary rounded-full text-base font-medium flex items-center gap-2 hover:bg-primary/20 transition-all cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-surface-dark rounded-2xl p-5 border border-border-dark hover:border-primary/40 transition-all group cursor-pointer">
                <div className="h-40 w-full rounded-xl mb-5 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={rec.image} alt={rec.title} />
                  {i === 0 && <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">New</div>}
                </div>
                <h3 className="font-bold text-lg text-white mb-1">{rec.title}</h3>
                <p className="text-sm text-slate-500 mb-5">{rec.desc}</p>
                <button 
                  onClick={() => onActivityClick(rec.id)}
                  className="w-full bg-slate-800 text-white py-3 rounded-full text-sm font-bold hover:bg-primary transition-all"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
