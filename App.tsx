
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import VocabularyCard from './components/VocabularyCard';
import CategoryDetail from './components/CategoryDetail';
import { VOCABULARY_PACKS } from './constants';
import { VocabularyPack } from './types';

const App: React.FC = () => {
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
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#1a1f2e] text-white selection:bg-green-500/30">
      <Header />
      <main className="flex-1 px-6 pb-10 pt-6 relative">
        <div className="fixed top-0 left-[-20%] w-[80%] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-20 right-[-10%] w-[60%] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-md mx-auto w-full">{renderHomeContent()}</div>
      </main>
    </div>
  );
};

export default App;
