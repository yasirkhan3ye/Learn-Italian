
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import VocabularyCard from './components/VocabularyCard';
import ConversationCard from './components/ConversationCard';
import Navbar from './components/Navbar';
import CategoryDetail from './components/CategoryDetail';
import ProgressBar from './components/ProgressBar';
import { VOCABULARY_PACKS, CONVERSATION_PACK } from './constants';
import { NavItem, VocabularyPack } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.HOME);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const selectedPack = useMemo(() => 
    VOCABULARY_PACKS.find(p => p.id === selectedPackId), 
  [selectedPackId]);

  const renderHomeContent = () => {
    if (selectedPackId && selectedPack) {
      return (
        <CategoryDetail 
          pack={selectedPack} 
          onBack={() => setSelectedPackId(null)} 
        />
      );
    }

    return (
      <div className="animate-in fade-in duration-700 space-y-8">
        <ProgressBar 
          current={2} 
          total={5} 
          onClick={() => setActiveTab(NavItem.LESSONS)}
        />
        
        <div className="px-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] opacity-90">Italian Basics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 relative z-10 mb-10">
            {VOCABULARY_PACKS.map((pack) => (
              <VocabularyCard 
                key={pack.id} 
                {...pack} 
                onClick={() => setSelectedPackId(pack.id)}
              />
            ))}
          </div>

          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 opacity-90">Daily Challenge</h2>
          <ConversationCard {...CONVERSATION_PACK} />
        </div>
      </div>
    );
  };

  const renderLessons = () => (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 px-1 pb-10">
      <h2 className="text-2xl font-black mb-2">My Learning Path</h2>
      {[
        { level: '1', title: 'The Basics', progress: 100, icon: 'looks_one', status: 'Completed' },
        { level: '2', title: 'Home Life', progress: 40, icon: 'looks_two', status: 'In Progress' },
        { level: '3', title: 'Food & Dining', progress: 0, icon: 'looks_3', status: 'Locked' },
        { level: '4', title: 'Travel Essentials', progress: 0, icon: 'looks_4', status: 'Locked' },
      ].map((lesson, idx) => (
        <div key={idx} className={`glass-card p-6 rounded-3xl flex items-center gap-5 border transition-all ${lesson.status === 'Locked' ? 'opacity-40 grayscale' : 'border-white/10 hover:bg-white/10 active:scale-[0.98]'}`}>
          <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-black">
            <span className="material-symbols-outlined">{lesson.icon}</span>
          </div>
          <div className="flex-1">
             <div className="flex justify-between items-center mb-1">
               <h3 className="font-bold text-lg">{lesson.title}</h3>
               <span className="text-[10px] font-black uppercase text-green-400/80">{lesson.status}</span>
             </div>
             <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{width: `${lesson.progress}%`}}></div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500 px-1 pb-10">
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-green-500 via-white to-red-500 mb-4 shadow-2xl relative">
           <img className="w-full h-full object-cover rounded-full border-4 border-[#1a1f2e]" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" alt="User" />
           <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1a1f2e] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
           </div>
        </div>
        <h2 className="text-3xl font-black">Alex Rossi</h2>
        <p className="text-green-400 font-black tracking-[0.2em] text-[10px] uppercase mt-1">Fluent Level 12</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Streak', value: '14', icon: 'local_fire_department', color: 'text-orange-500' },
          { label: 'Exp', value: '2.4k', icon: 'bolt', color: 'text-yellow-500' },
          { label: 'Rank', value: '#4', icon: 'military_tech', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl text-center border border-white/5 shadow-lg">
            <span className={`material-symbols-outlined ${stat.color} mb-1 fill`}>{stat.icon}</span>
            <div className="text-xl font-black">{stat.value}</div>
            <div className="text-[9px] font-black uppercase text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-sm uppercase tracking-[0.15em] text-white/50">Recent Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           {['trophy', 'workspace_premium', 'star', 'rocket', 'auto_awesome'].map((ach, i) => (
             <div key={i} className="w-16 h-16 rounded-2xl glass-card flex-shrink-0 flex items-center justify-center text-yellow-500 border-yellow-500/10 hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-3xl fill">{ach}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case NavItem.HOME: return renderHomeContent();
      case NavItem.LESSONS: return renderLessons();
      case NavItem.PROFILE: return renderProfile();
      default: return null;
    }
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
    if (tab !== NavItem.HOME) setSelectedPackId(null);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#1a1f2e] text-white selection:bg-green-500/30">
      <Header />
      <main className="flex-1 px-6 pb-28 pt-6 relative">
        <div className="fixed top-0 left-[-20%] w-[80%] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-20 right-[-10%] w-[60%] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-md mx-auto w-full">{renderContent()}</div>
      </main>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
