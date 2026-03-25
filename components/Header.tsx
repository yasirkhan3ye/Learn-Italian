
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-[#1a1f2e]/80 backdrop-blur-xl px-6 py-4 border-b border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-black tracking-tighter text-white">Ciao!</h1>
          <p className="text-xs font-bold text-white/40 tracking-tight uppercase">Let's Learn Italian</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
