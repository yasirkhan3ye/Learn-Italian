
import React from 'react';
import { USER_IMAGE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-[#1a1f2e]/80 backdrop-blur-xl px-6 pt-8 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Ciao!</h1>
          <p className="text-lg font-medium text-gray-300">Let's Learn Italian</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              src={USER_IMAGE}
            />
          </div>
          <span className="text-[10px] font-black text-white/70 uppercase tracking-tighter">ADD PROFILE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
