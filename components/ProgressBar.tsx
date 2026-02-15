
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <section className="mb-8 glass-card p-6 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Decorative top border gradient as seen in screenshot */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-green-500/50 via-white/20 to-red-500/50"></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-green-400 mb-2">Daily Goal</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{current}/{total}</span>
            <span className="text-sm font-bold text-gray-500">Lessons</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-black text-white">
          {percentage}%
        </div>
      </div>

      <div className="mt-4 w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-500 to-red-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/90">
        <span className="material-symbols-outlined text-yellow-500 text-xl fill">local_fire_department</span>
        <span>{total - current} more to hit your streak!</span>
      </div>
    </section>
  );
};

export default ProgressBar;
