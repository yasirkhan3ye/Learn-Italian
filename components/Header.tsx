
import React from 'react';
import { USER_IMAGE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-[#1a1f2e]/80 backdrop-blur-xl px-6 pt-10 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Ciao!</h1>
          <p className="text-sm font-bold text-white/50 tracking-tight">Let's Learn Italian</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-11 h-11 rounded-full p-0.5 bg-white/10 border border-white/20 overflow-hidden shadow-xl active:scale-90 transition-transform cursor-pointer">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover rounded-full" 
              src={USER_IMAGE}
            />
          </div>
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">ADD PROFILE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
