
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import VocabularyCard from './components/VocabularyCard';
import Navbar from './components/Navbar';
import CategoryDetail from './components/CategoryDetail';
import { VOCABULARY_PACKS } from './constants';
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
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6 relative z-10 px-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Vocabulary Packs</h2>
          <button className="text-[11px] font-black text-white hover:brightness-110 transition-all flex items-center gap-2 bg-[#00DC82] px-5 py-2 rounded-full shadow-lg shadow-[#00DC82]/20 active:scale-95">
            View All
            <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 relative z-10 mb-8">
          {VOCABULARY_PACKS.map((pack) => (
            <VocabularyCard 
              key={pack.id} 
              {...pack} 
              onClick={() => setSelectedPackId(pack.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavItem.HOME:
        return renderHomeContent();
      case NavItem.LESSONS:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-2xl p-8 animate-in zoom-in-95 duration-300">
            <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">auto_stories</span>
            <h2 className="text-2xl font-bold mb-2">My Lessons</h2>
            <p className="text-gray-400 max-w-xs">Continue your journey through the Italian language. More levels coming soon.</p>
          </div>
        );
      case NavItem.PROFILE:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-2xl p-8 animate-in zoom-in-95 duration-300">
            <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">person_celebrate</span>
            <h2 className="text-2xl font-bold mb-2">Student Profile</h2>
            <p className="text-gray-400 max-w-xs">View your achievements, badges, and language streaks.</p>
          </div>
        );
    }
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
    if (tab !== NavItem.HOME) {
      setSelectedPackId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#1a1f2e] text-white selection:bg-green-500/30">
      <Header />
      
      <main className="flex-1 px-6 pb-28 pt-6 relative">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-[-20%] w-[80%] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-20 right-[-10%] w-[60%] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-md mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
