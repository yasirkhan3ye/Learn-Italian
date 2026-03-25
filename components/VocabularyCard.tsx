
import React, { useState, useEffect } from 'react';
import { VocabularyPack } from '../types';
import { generateCategoryImage } from './imageGenerator';

interface VocabularyCardProps extends VocabularyPack {
  onClick?: () => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ id, title, subtitle, imageUrl, icon, items, onClick }) => {
  const [currentImage, setCurrentImage] = useState<string>(imageUrl);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const loadImage = async () => {
      setIsGenerating(true);
      const generated = await generateCategoryImage(id);
      if (mounted && generated) {
        setCurrentImage(generated);
      }
      if (mounted) {
        setIsGenerating(false);
      }
    };
    loadImage();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div 
      onClick={onClick}
      className="group glass-card rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 active:scale-95 shadow-2xl cursor-pointer overflow-hidden border border-white/5 flex flex-col h-full relative"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img 
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100 ${isGenerating && currentImage === imageUrl ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`} 
          alt={title} 
          src={currentImage}
          referrerPolicy="no-referrer"
        />
        {isGenerating && currentImage === imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/40 via-transparent to-transparent"></div>
        
        {/* Icon Overlay as seen in screenshot */}
        <div className="absolute top-4 left-4 w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <span className="material-symbols-outlined text-white text-base font-light">
            {icon}
          </span>
        </div>
        
        {/* Item count badge */}
        <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 flex items-center">
          <span className="text-[10px] font-bold text-white tracking-wider">{items?.length || 0} WORDS</span>
        </div>
      </div>
      
      <div className="p-5 pt-4 bg-[#232936]/50 flex-1 flex flex-col justify-center">
        <h3 className="font-black text-xl leading-tight text-white mb-1 tracking-tight">{title}</h3>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.08em] opacity-80">{subtitle}</p>
      </div>
    </div>
  );
};

export default VocabularyCard;
