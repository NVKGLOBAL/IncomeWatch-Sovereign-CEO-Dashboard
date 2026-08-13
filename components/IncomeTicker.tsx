
import React, { useState, useEffect, useRef } from 'react';

interface IncomeTickerProps {
  totalMonthlyVelocity: number;
}

const MS_PER_MONTH = 30 * 24 * 60 * 60 * 1000;

export const IncomeTicker: React.FC<IncomeTickerProps> = ({ totalMonthlyVelocity }) => {
  const [totalAccumulated, setTotalAccumulated] = useState(0);
  const incomePerMs = totalMonthlyVelocity / MS_PER_MONTH;
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    let frameId: number;
    
    const update = () => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      
      if (delta > 0) {
        setTotalAccumulated(prev => prev + (incomePerMs * delta));
        lastUpdateRef.current = now;
      }
      
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [incomePerMs]);

  const formattedAccumulated = totalAccumulated.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });

  const formattedPerSec = (incomePerMs * 1000).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-10 bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] font-black flex items-center gap-4">
        <span className="w-8 h-[1px] bg-neutral-800"></span>
        Sovereign Live Wealth Stream
        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black tracking-widest uppercase">Mathematical Engine Active</span>
        <span className="w-8 h-[1px] bg-neutral-800"></span>
      </div>
      
      <div className="text-7xl md:text-9xl font-mono font-bold gold-glow gradient-text tracking-tighter tabular-nums py-2">
        ${formattedAccumulated}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-blue-400 text-lg font-mono flex items-center gap-3 bg-blue-500/10 px-6 py-2 rounded-full border border-blue-500/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
          </span>
          <span className="font-black">${formattedPerSec}</span>
          <span className="text-xs text-blue-500/60 uppercase tracking-widest font-bold">per sec velocity</span>
        </div>
      </div>
    </div>
  );
};
