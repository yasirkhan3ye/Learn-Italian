
import React from 'react';
import { ConversationPack } from '../types';

const ConversationCard: React.FC<ConversationPack> = ({ title, subtitle, imageUrl, icon }) => {
  return (
    <div className="col-span-2 group glass-card p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20 flex items-center gap-4 cursor-pointer mt-4">
      <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 shadow-md">
        <img 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-110" 
          alt={title} 
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/40 to-transparent mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-green-400 text-xl">{icon}</span>
          <h3 className="font-bold text-lg leading-tight text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
        <span className="material-symbols-outlined">chevron_right</span>
      </div>
    </div>
  );
};

export default ConversationCard;
