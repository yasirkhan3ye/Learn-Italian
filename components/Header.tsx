
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-[#1a1f2e]/80 backdrop-blur-xl px-6 pt-10 pb-4 border-b border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Ciao!</h1>
          <p className="text-sm font-bold text-white/50 tracking-tight">Let's Learn Italian</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
