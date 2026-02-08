
import React from 'react';

interface SettingsProps {
  blockedUsers?: string[];
}

const Settings: React.FC<SettingsProps> = ({ blockedUsers = [] }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-slate-400 mt-2">Manage your account preferences and application settings.</p>
      </header>

      <div className="max-w-4xl space-y-12">
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span> Account Settings
          </h3>
          <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden divide-y divide-border-dark">
            {[
              { label: 'Email Address', value: 'ahmed.zaeem@example.mv', icon: 'mail' },
              { label: 'Phone Number', value: '+960 777 1234', icon: 'phone' },
              { label: 'Change Password', value: 'Last updated 3 months ago', icon: 'lock' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.value}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">edit</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">block</span> Blocked Users
          </h3>
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            {blockedUsers.length === 0 ? (
              <p className="text-sm text-slate-500">You haven't blocked any users yet.</p>
            ) : (
              <div className="space-y-4">
                {blockedUsers.map((userId, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">ID</div>
                      <span className="text-sm text-white font-medium">Blocked User {userId}</span>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Unblock</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span> Privacy & Safety
          </h3>
          <div className="bg-surface-dark border border-border-dark rounded-2xl divide-y divide-border-dark">
            {[
              { title: 'Private Profile', desc: 'Only approved connections can see your activities', active: true },
              { title: 'Show Online Status', desc: 'Let others see when you\'re active', active: false },
              { title: 'Activity Visibility', desc: 'Control who sees your upcoming hosted activities', active: true }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.active ? 'bg-primary' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-10 border-t border-border-dark flex flex-col items-center gap-6">
          <button className="w-full md:w-64 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">logout</span> Log Out
          </button>
          <p className="text-xs text-slate-500">Hingaa App Version 2.4.0 (Build 892)</p>
        </footer>
      </div>
    </div>
  );
};

export default Settings;
