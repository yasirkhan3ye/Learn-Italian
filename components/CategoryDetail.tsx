
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  Check, 
  Search, 
  Shuffle, 
  LayoutList, 
  Style, 
  ChevronLeft, 
  ChevronRight,
  RotateCw,
  Trophy,
  BrainCircuit
} from 'lucide-react';
import { VocabularyPack, WordItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CategoryDetailProps {
  pack: VocabularyPack;
  onBack: () => void;
}

type ViewMode = 'list' | 'flashcard';
type FilterMode = 'all' | 'learning' | 'mastered';

let globalAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return globalAudioContext;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ pack, onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<{item: WordItem, originalIndex: number}[]>([]);
  
  const currentSource = useRef<AudioBufferSourceNode | null>(null);

  // Initialize shuffled items
  useEffect(() => {
    setShuffledItems(pack.items.map((item, idx) => ({ item, originalIndex: idx })));
  }, [pack]);

  const filteredItems = useMemo(() => {
    return shuffledItems.filter(({ item, originalIndex }) => {
      const matchesSearch = item.italian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.english.toLowerCase().includes(searchQuery.toLowerCase());
      const isDone = completedItems[originalIndex] ?? false;
      
      if (filterMode === 'learning') return matchesSearch && !isDone;
      if (filterMode === 'mastered') return matchesSearch && isDone;
      return matchesSearch;
    });
  }, [shuffledItems, searchQuery, filterMode, completedItems]);

  const completedCount = useMemo(() => 
    Object.values(completedItems).filter(Boolean).length
  , [completedItems]);

  const progressPercentage = (completedCount / pack.items.length) * 100;

  const playPronunciation = async (text: string, index: number) => {
    if (currentSource.current) {
      try { currentSource.current.stop(); } catch (e) {}
    }
    setPlayingIndex(index);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Italian pronunciation for: ${text}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      let base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = getAudioContext();
        if (audioContext.state === 'suspended') await audioContext.resume();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setPlayingIndex(null);
        currentSource.current = source;
        source.start();
      }
    } catch (error) {
      setPlayingIndex(null);
    }
  };

  const shuffle = () => {
    const newItems = [...shuffledItems];
    for (let i = newItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
    }
    setShuffledItems(newItems);
    setFlashcardIndex(0);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % filteredItems.length);
    }, 200);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }, 200);
  };

  const isSessionComplete = completedCount === pack.items.length;

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 pb-20">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-[#1a1f2e]/90 backdrop-blur-xl pt-4 pb-6 flex flex-col gap-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black">{pack.title}</h2>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
                <span className="text-[10px] font-black text-green-400 uppercase">{completedCount}/{pack.items.length}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={shuffle}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:rotate-180 transition-transform duration-500 text-white/60"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode(v => v === 'list' ? 'flashcard' : 'list')}
              className={`px-4 h-10 rounded-2xl glass-card flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'flashcard' ? 'bg-green-500 text-white' : 'text-white/60'}`}
            >
              {viewMode === 'list' ? <BrainCircuit className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
              {viewMode === 'list' ? 'Practice' : 'List View'}
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="space-y-4 px-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input 
                type="text"
                placeholder={`Search in ${pack.title.toLowerCase()}...`}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(['all', 'learning', 'mastered'] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    filterMode === mode ? 'bg-white text-[#1a1f2e] border-white' : 'bg-white/5 text-white/40 border-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      {viewMode === 'list' ? (
        <div className="mt-4 space-y-3">
          {filteredItems.map(({ item, originalIndex }) => {
            const isPlaying = playingIndex === originalIndex;
            const isDone = completedItems[originalIndex] ?? false;
            
            return (
              <motion.div 
                layout
                key={originalIndex}
                onClick={() => playPronunciation(item.italian, originalIndex)}
                className={`glass-card p-5 rounded-3xl flex items-center justify-between transition-all active:scale-95 cursor-pointer border-l-4 ${
                  isPlaying ? 'border-green-500 bg-green-500/10' : 'border-white/5'
                } ${isDone ? 'opacity-40 grayscale-[0.5]' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setCompletedItems(p => ({...p, [originalIndex]: !isDone})) 
                      }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-white/20 hover:border-white/40'}`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <h3 className={`text-xl font-black tracking-tight ${isPlaying ? 'text-green-400' : 'text-white'}`}>{item.italian}</h3>
                  </div>
                  <div className="flex gap-3 text-sm ml-9 items-center">
                    <span className="text-gray-400 font-medium">{item.english}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                    <span className="text-green-400/50 font-bold" dir="rtl">{item.urdu}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPlaying ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-white/20'}`}>
                  {isPlaying ? <RotateCw className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                </div>
              </motion.div>
            );
          })}
          
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Search className="w-12 h-12 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">No words found</p>
            </div>
          )}
        </div>
      ) : (
        /* Flashcard View */
        <div className="mt-8 flex flex-col items-center px-4">
          {filteredItems.length > 0 ? (
            <>
              <div className="w-full max-w-sm perspective-1000 relative h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={flashcardIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full h-full"
                  >
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer"
                      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center text-center border-2 border-white/10 shadow-2xl">
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
                          <BrainCircuit className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Active Recall</span>
                        </div>
                        
                        <h3 className="text-4xl font-black mb-4 tracking-tighter">{filteredItems[flashcardIndex]?.item.italian}</h3>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-2">Tap to flip</p>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playPronunciation(filteredItems[flashcardIndex]?.item.italian, filteredItems[flashcardIndex]?.originalIndex);
                          }}
                          className={`mt-12 w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                            playingIndex === filteredItems[flashcardIndex]?.originalIndex 
                              ? 'bg-green-500 text-white shadow-xl shadow-green-500/40' 
                              : 'bg-white/5 text-green-400 hover:bg-white/10'
                          }`}
                        >
                          {playingIndex === filteredItems[flashcardIndex]?.originalIndex 
                            ? <RotateCw className="w-8 h-8 animate-spin" /> 
                            : <Volume2 className="w-8 h-8" />}
                        </button>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center text-center border-2 border-green-500/20 shadow-2xl bg-green-500/5">
                        <div className="space-y-10 w-full">
                          <div>
                            <p className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-3 opacity-60">English</p>
                            <h3 className="text-3xl font-black tracking-tight">{filteredItems[flashcardIndex]?.item.english}</h3>
                          </div>
                          <div className="pt-10 border-t border-white/5">
                            <p className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-3 opacity-60">Urdu</p>
                            <h3 className="text-4xl font-bold" dir="rtl">{filteredItems[flashcardIndex]?.item.urdu}</h3>
                          </div>
                        </div>

                        <div className="absolute bottom-10 flex gap-4 w-full px-10">
                           <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = filteredItems[flashcardIndex]?.originalIndex;
                              setCompletedItems(p => ({...p, [idx]: true}));
                              handleNextFlashcard();
                            }}
                            className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                           >
                             <Check className="w-4 h-4" />
                             Mastered
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 flex items-center gap-10">
                <button 
                  onClick={handlePrevFlashcard}
                  className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-white/40 active:scale-90 transition-transform hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">
                    {flashcardIndex + 1} <span className="text-white/20 mx-1">/</span> {filteredItems.length}
                  </span>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Cards Left</p>
                </div>
                <button 
                  onClick={handleNextFlashcard}
                  className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-white/40 active:scale-90 transition-transform hover:text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-black mb-2">Category Mastered!</h3>
              <p className="text-white/40 text-sm mb-8 max-w-[200px]">You've learned all the words in this pack. Great job!</p>
              <button 
                onClick={() => {
                  setCompletedItems({});
                  setViewMode('list');
                }}
                className="px-8 py-3 rounded-2xl bg-white text-[#1a1f2e] font-black text-xs uppercase tracking-widest active:scale-95"
              >
                Reset Progress
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CategoryDetail;
