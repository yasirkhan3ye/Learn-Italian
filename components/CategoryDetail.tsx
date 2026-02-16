
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { VocabularyPack } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CategoryDetailProps {
  pack: VocabularyPack;
  onBack: () => void;
}

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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  
  const currentSource = useRef<AudioBufferSourceNode | null>(null);

  const filteredItems = useMemo(() => {
    return pack.items.filter(item => 
      item.italian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.english.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pack.items, searchQuery]);

  const completedCount = useMemo(() => 
    Object.values(completedItems).filter(Boolean).length
  , [completedItems]);

  useEffect(() => {
    return () => {
      if (currentSource.current) currentSource.current.stop();
    };
  }, []);

  const playPronunciation = async (text: string, index: number) => {
    if (currentSource.current) {
      try { currentSource.current.stop(); } catch (e) {}
    }
    setPlayingIndex(index);
    setErrorMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      setErrorMessage("Pronunciation unavailable");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-500 pb-20">
      <div className="sticky top-0 z-30 bg-[#1a1f2e]/90 backdrop-blur-xl pt-4 pb-6 flex flex-col gap-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-black">{pack.title}</h2>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-green-400 tracking-tighter uppercase">{completedCount}/{pack.items.length} COMPLETED</span>
          </div>
        </div>
        <div className="relative px-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30">search</span>
          <input 
            type="text"
            placeholder={`Search in ${pack.title.toLowerCase()}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filteredItems.map((item, idx) => {
          const globalIndex = pack.items.indexOf(item);
          const isPlaying = playingIndex === globalIndex;
          const isDone = completedItems[globalIndex] ?? false;
          
          return (
            <div 
              key={globalIndex}
              onClick={() => playPronunciation(item.italian, globalIndex)}
              className={`glass-card p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 cursor-pointer border-l-4 ${
                isPlaying ? 'border-green-500 bg-green-500/10' : 'border-white/5'
              } ${isDone ? 'opacity-50' : ''}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCompletedItems(p => ({...p, [globalIndex]: !isDone})) }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-white/20'}`}
                  >
                    {isDone && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                  </button>
                  <h3 className={`text-xl font-black tracking-tight ${isPlaying ? 'text-green-400' : 'text-white'}`}>{item.italian}</h3>
                </div>
                <div className="flex gap-2 text-sm ml-8">
                  <span className="text-gray-400">{item.english}</span>
                  <span className="text-green-400/50" dir="rtl">{item.urdu}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-green-500 text-white shadow-lg animate-pulse' : 'bg-white/5 text-white/40'}`}>
                <span className="material-symbols-outlined">{isPlaying ? 'graphic_eq' : 'volume_up'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDetail;