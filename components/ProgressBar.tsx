
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  onClick?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, onClick }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <section 
      onClick={onClick}
      className="mb-8 glass-card p-6 rounded-[2rem] relative overflow-hidden border border-white/10 shadow-2xl cursor-pointer active:scale-[0.98] transition-all"
    >
      {/* Decorative top border gradient as seen in screenshot */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-green-500/40 via-white/10 to-transparent"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 mb-2">Daily Goal</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white leading-none">{current}/{total}</span>
            <span className="text-sm font-bold text-gray-400">Lessons</span>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-black text-white shadow-inner">
          {percentage}%
        </div>
      </div>

      <div className="mt-2 w-full bg-white/5 h-[10px] rounded-full overflow-hidden border border-white/5 p-[1px]">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_12px_rgba(34,197,94,0.4)]" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs font-bold text-white/80">
        <span className="material-symbols-outlined text-orange-500 text-lg fill">local_fire_department</span>
        <span>{total - current} more to hit your streak!</span>
      </div>
    </section>
  );
};

export default ProgressBar;
