
import React, { useState, useRef, useEffect } from 'react';
import { VocabularyPack } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface CategoryDetailProps {
  pack: VocabularyPack;
  onBack: () => void;
}

// Global audio context to avoid "too many AudioContexts" errors in the browser session
let globalAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return globalAudioContext;
}

// Helper functions for audio processing as per Gemini API guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  // Cleanup audio and error timeouts on unmount
  useEffect(() => {
    return () => {
      if (currentSource.current) {
        currentSource.current.stop();
      }
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    if (errorTimeoutRef.current) window.clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = window.setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  };

  const playPronunciation = async (text: string, index: number) => {
    // Stop current playback if any to satisfy "only one at a time" requirement
    if (currentSource.current) {
      try {
        currentSource.current.stop();
      } catch (e) {
        // Source might have already ended naturally
      }
      currentSource.current = null;
    }

    setPlayingIndex(index);
    setErrorMessage(null); // Clear any previous errors
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Pronuncia chiaramente in italiano: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = getAudioContext();
        
        // Browsers often require resuming the context on user interaction
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContext,
          24000,
          1,
        );
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          setPlayingIndex((prev) => prev === index ? null : prev);
          currentSource.current = null;
        };
        
        currentSource.current = source;
        source.start();
      } else {
        throw new Error("No audio data returned from the service.");
      }
    } catch (error) {
      console.error("Failed to generate pronunciation:", error);
      setPlayingIndex(null);
      showError("Spiacenti! We couldn't play that audio right now.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 relative">
      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 shadow-2xl shadow-red-500/20">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm font-bold text-white">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-auto text-white/50 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{pack.title}</h2>
          <p className="text-gray-400 text-sm font-medium">{pack.subtitle}</p>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden mb-8 h-48 group shadow-2xl">
        <img 
          src={pack.imageUrl} 
          alt={pack.title}
          className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6">
          <span className="material-symbols-outlined text-green-400 text-4xl mb-2">{pack.icon}</span>
          <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">Learning {pack.items.length} Phrases</p>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        {pack.items.map((item, index) => {
          const isCurrent = playingIndex === index;
          return (
            <div 
              key={index}
              onClick={() => playPronunciation(item.italian, index)}
              className={`glass-card p-6 rounded-2xl flex items-center justify-between group transition-all duration-300 cursor-pointer border active:scale-[0.99] ${
                isCurrent ? 'border-green-500/50 bg-green-500/10' : 'border-white/5 hover:bg-white/10'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1">
                <p className={`text-2xl font-extrabold transition-colors mb-3 tracking-tight ${
                  isCurrent ? 'text-green-400' : 'text-white group-hover:text-green-400'
                }`}>{item.italian}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-sm px-3 py-1.5 rounded-xl bg-white/10 text-gray-200 border border-white/5 font-bold shadow-inner">
                    {item.english}
                  </span>
                  <span className="text-sm px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/10 font-bold" dir="rtl">
                    {item.urdu}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(item.italian, index);
                }}
                aria-label={`Replay pronunciation for ${item.italian}`}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4 shadow-xl ${
                  isCurrent 
                  ? 'bg-green-500 text-white scale-110 shadow-[0_0_25px_rgba(0,220,130,0.5)]' 
                  : 'bg-white/5 text-gray-400 group-hover:bg-green-500/20 group-hover:text-green-400'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${isCurrent ? 'animate-pulse' : ''}`}>
                  {isCurrent ? 'graphic_eq' : 'replay'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDetail;
