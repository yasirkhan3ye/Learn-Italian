import React, { useEffect, useState } from 'react';
import { APP_VERSION, CHANGELOG } from '../version';

const VersionManager: React.FC = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');
    
    if (!storedVersion) {
      // First time user, just set it
      localStorage.setItem('app_version', APP_VERSION);
    } else if (storedVersion !== APP_VERSION) {
      // Version changed, show update modal
      setShowUpdateModal(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('app_version', APP_VERSION);
    setShowUpdateModal(false);
  };

  return (
    <>
      {/* Fixed Version Badge */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white/50 text-[10px] px-3 py-1.5 rounded-full font-mono font-medium tracking-widest uppercase hover:text-white/80 transition-colors cursor-default">
          v{APP_VERSION}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleAcknowledge}></div>
          <div className="bg-[#1a1f2e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/20">
                <span className="material-symbols-outlined text-2xl">update</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">App Updated!</h3>
                <p className="text-xs text-green-400 font-mono font-bold tracking-wider mt-1">VERSION {APP_VERSION}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em]">What's New</h4>
              <ul className="space-y-3">
                {CHANGELOG.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-3 leading-snug">
                    <span className="text-green-500 mt-0.5 text-xs">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleAcknowledge}
              className="w-full py-3.5 bg-white text-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors active:scale-[0.98]"
            >
              Awesome, let's go!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VersionManager;
