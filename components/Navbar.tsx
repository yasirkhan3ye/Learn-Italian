
import React from 'react';
import { NavItem } from '../types';

interface NavbarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: NavItem.HOME, label: 'Home', icon: 'home' },
    { id: NavItem.LESSONS, label: 'Lessons', icon: 'menu_book' },
    { id: NavItem.PROFILE, label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card backdrop-blur-xl border-t border-white/5 pb-6 pt-3 px-8 flex justify-between items-center z-30">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1.5 group transition-colors ${
              isActive ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <div className="relative">
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isActive ? 'fill' : ''}`}>
                {item.icon}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;
