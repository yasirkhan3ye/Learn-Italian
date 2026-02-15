
import React from 'react';
import { VocabularyPack } from '../types';

interface VocabularyCardProps extends VocabularyPack {
  onClick?: () => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ title, subtitle, imageUrl, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group glass-card rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 active:scale-95 shadow-2xl cursor-pointer overflow-hidden border border-white/5"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100" 
          alt={title} 
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/40 via-transparent to-transparent"></div>
        
        {/* Icon Overlay as seen in screenshot */}
        <div className="absolute top-4 left-4 w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <span className="material-symbols-outlined text-white text-base font-light">
            {icon}
          </span>
        </div>
      </div>
      
      <div className="p-5 pt-4 bg-[#232936]/50">
        <h3 className="font-black text-xl leading-tight text-white mb-1 tracking-tight">{title}</h3>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.08em] opacity-80">{subtitle}</p>
      </div>
    </div>
  );
};

export default VocabularyCard;
