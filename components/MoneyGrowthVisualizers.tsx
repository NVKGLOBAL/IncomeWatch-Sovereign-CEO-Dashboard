import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Watch, 
  Target, 
  Zap, 
  TrendingUp, 
  Award, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Gauge, 
  Layers,
  Flame,
  ChevronRight,
  DollarSign
} from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  cost: number;
  category: string;
}

interface VisualizerProps {
  sessionEarnings: number;
  sessionEarningsAfterTax: number;
  totalSessionSeconds: number;
  msThisSession: number;
  hourlyRate: number;
  ratePerMin: number;
  ratePerSecond: number;
  ratePerMs: number;
  estDailyEarnings: number;
  dailyHoursTarget: number;
  clockedIn: boolean;
  goals: Goal[];
}

/**
 * 1. LUXURY CHRONOGRAPH WATCH DIAL VISUALIZER
 * Features a classic chronograph watch face with sweeping hands & sub-dials.
 */
export const ChronographWatchVisualizer: React.FC<VisualizerProps> = ({
  sessionEarnings,
  totalSessionSeconds,
  msThisSession,
  hourlyRate,
  estDailyEarnings,
  clockedIn
}) => {
  // Sweeping second hand angle (6 degrees per second)
  const secondsAngle = ((totalSessionSeconds % 60) + (msThisSession % 1000) / 1000) * 6;
  
  // Fast millisecond hand angle (360 deg per 1000ms)
  const msAngle = ((msThisSession % 1000) / 1000) * 360;

  // Shift goal progress hand angle (240 deg max arc)
  const goalPct = estDailyEarnings > 0 ? Math.min(sessionEarnings / estDailyEarnings, 1) : 0;
  const shiftGoalAngle = -120 + goalPct * 240;

  // Hourly fraction dial angle (360 deg per $hourlyRate earned in current hour)
  const currentHourEarnings = sessionEarnings % (hourlyRate || 1);
  const hourFractionPct = currentHourEarnings / (hourlyRate || 1);
  const hourFractionAngle = hourFractionPct * 360;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      
      {/* Watch Title */}
      <div className="flex items-center gap-2 mb-4">
        <Watch size={16} className="text-blue-400" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-neutral-400">
          CHRONOGRAPH SOVEREIGN CALIBER // v3.0
        </span>
      </div>

      {/* SVG Watch Face */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Outer Bezel */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="metallicBezel" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#171717" />
              <stop offset="95%" stopColor="#262626" />
              <stop offset="100%" stopColor="#3b82f6" />
            </radialGradient>
            <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Watch Case Outer Shadow Ring */}
          <circle cx="100" cy="100" r="96" fill="#0a0a0a" stroke="#262626" strokeWidth="2" />
          <circle cx="100" cy="100" r="90" fill="url(#metallicBezel)" stroke="#171717" strokeWidth="3" />

          {/* Minute / Second Ticks (60 ticks) */}
          {Array.from({ length: 60 }).map((_, i) => {
            const isHour = i % 5 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            const x1 = 100 + 82 * Math.cos(angle);
            const y1 = 100 + 82 * Math.sin(angle);
            const x2 = 100 + (isHour ? 74 : 78) * Math.cos(angle);
            const y2 = 100 + (isHour ? 74 : 78) * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHour ? '#3b82f6' : '#525252'}
                strokeWidth={isHour ? 2 : 0.8}
              />
            );
          })}

          {/* Daily Goal Arc Gauge */}
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="#171717"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="url(#goldGlow)"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 86}
            strokeDashoffset={2 * Math.PI * 86 * (1 - goalPct)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Sub-Dial Left: Millisecond Fast Engine (cx: 65, cy: 100, r: 22) */}
          <circle cx="65" cy="100" r="22" fill="#000" stroke="#262626" strokeWidth="1" />
          <text x="65" y="87" fill="#737373" fontSize="5" textAnchor="middle" fontWeight="bold">MS ENGINE</text>

          {/* Sub-Dial Right: Hourly Quota Fraction (cx: 135, cy: 100, r: 22) */}
          <circle cx="135" cy="100" r="22" fill="#000" stroke="#262626" strokeWidth="1" />
          <text x="135" y="87" fill="#737373" fontSize="5" textAnchor="middle" fontWeight="bold">1 HOUR YIELD</text>

          {/* Sub-Dial Bottom: Shift Target Dial (cx: 100, cy: 138, r: 22) */}
          <circle cx="100" cy="138" r="22" fill="#000" stroke="#262626" strokeWidth="1" />
          <text x="100" y="125" fill="#737373" fontSize="5" textAnchor="middle" fontWeight="bold">SHIFT GOAL</text>
        </svg>

        {/* Sub-Dial Hands (HTML overlays for easy rotation) */}
        {/* Left Subdial Hand (MS Engine) */}
        <div 
          className="absolute w-10 h-0.5 bg-blue-400 left-[55px] top-[135px] origin-right transition-transform"
          style={{ transform: `rotate(${msAngle - 90}deg)` }}
        ></div>

        {/* Right Subdial Hand (Hourly Fraction) */}
        <div 
          className="absolute w-10 h-0.5 bg-emerald-400 left-[125px] top-[135px] origin-right transition-transform"
          style={{ transform: `rotate(${hourFractionAngle - 90}deg)` }}
        ></div>

        {/* Bottom Subdial Hand (Shift Goal) */}
        <div 
          className="absolute w-10 h-0.5 bg-amber-400 left-[90px] top-[173px] origin-right transition-transform"
          style={{ transform: `rotate(${shiftGoalAngle - 90}deg)` }}
        ></div>

        {/* Main Sweeping Second Hand */}
        <div 
          className="absolute w-28 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-200 left-[34px] top-[135px] sm:left-[42px] sm:top-[143px] origin-right shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10"
          style={{ transform: `rotate(${secondsAngle - 90}deg)` }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 absolute right-0 -top-0.75 shadow-[0_0_10px_#10b981]"></div>
        </div>

        {/* Center Cap */}
        <div className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.9)] z-20 flex items-center justify-center">
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>

        {/* Digital Readout Center Top Overlay */}
        <div className="absolute top-[28%] text-center z-10 pointer-events-none">
          <span className="text-[9px] font-mono font-black text-neutral-500 uppercase tracking-widest block">SHIFT ASSET</span>
          <span className="text-base sm:text-lg font-mono font-black text-emerald-400 tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            ${sessionEarnings.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Watch Footer Specs */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center font-mono text-[9px] bg-neutral-950 p-2.5 rounded-2xl border border-neutral-800">
        <div>
          <span className="text-neutral-500 block uppercase">Hour Progress</span>
          <span className="font-bold text-emerald-400">{(hourFractionPct * 100).toFixed(1)}%</span>
        </div>
        <div className="border-x border-neutral-800">
          <span className="text-neutral-500 block uppercase">Daily Quota</span>
          <span className="font-bold text-blue-400">{(goalPct * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-neutral-500 block uppercase">Sweeping Speed</span>
          <span className="font-bold text-indigo-400">{clockedIn ? '60 FPS LIVE' : 'PAUSED'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. SOVEREIGN ACTIVITY RINGS
 * Concentric progress rings (Apple Watch Style) tracking Daily Goal, Hourly Quota, and Goal Unlock.
 */
export const SovereignActivityRings: React.FC<VisualizerProps> = ({
  sessionEarnings,
  hourlyRate,
  estDailyEarnings,
  goals
}) => {
  // Ring 1: Daily Target Progress
  const dailyPct = estDailyEarnings > 0 ? Math.min((sessionEarnings / estDailyEarnings) * 100, 100) : 0;
  
  // Ring 2: Hourly Quota Progress (0-100% of current $hourlyRate)
  const currentHourEarnings = sessionEarnings % (hourlyRate || 1);
  const hourlyPct = Math.min((currentHourEarnings / (hourlyRate || 1)) * 100, 100);

  // Ring 3: Next Goal Unlock Progress
  const sortedGoals = [...goals].sort((a, b) => a.cost - b.cost);
  const nextGoal = sortedGoals.find(g => g.cost > sessionEarnings) || sortedGoals[sortedGoals.length - 1];
  const goalCost = nextGoal ? nextGoal.cost : 100;
  const goalUnlockPct = Math.min((sessionEarnings / goalCost) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-emerald-400" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-neutral-400">
          SOVEREIGN YIELD RINGS
        </span>
      </div>

      {/* SVG Rings */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Ring 1 (Outer Emerald): Daily Shift Target (r: 82) */}
          <circle cx="100" cy="100" r="82" fill="none" stroke="#064e3b" strokeWidth="12" opacity="0.3" />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 82}
            strokeDashoffset={2 * Math.PI * 82 * (1 - dailyPct / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Ring 2 (Middle Blue): Hourly Quota (r: 64) */}
          <circle cx="100" cy="100" r="64" fill="none" stroke="#1e3a8a" strokeWidth="12" opacity="0.3" />
          <circle
            cx="100"
            cy="100"
            r="64"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 64}
            strokeDashoffset={2 * Math.PI * 64 * (1 - hourlyPct / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Ring 3 (Inner Amber): Next Goal Unlock (r: 46) */}
          <circle cx="100" cy="100" r="46" fill="none" stroke="#78350f" strokeWidth="12" opacity="0.3" />
          <circle
            cx="100"
            cy="100"
            r="46"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - goalUnlockPct / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Ring Center Metrics */}
        <div className="absolute text-center z-10 space-y-0.5">
          <span className="text-[8px] font-mono font-black text-neutral-500 uppercase tracking-widest block">DAILY REACH</span>
          <span className="text-2xl font-mono font-black text-emerald-400 tracking-tighter block">
            {dailyPct.toFixed(0)}%
          </span>
          <span className="text-[9px] font-mono text-neutral-400 block">${sessionEarnings.toFixed(2)} / ${estDailyEarnings.toFixed(0)}</span>
        </div>
      </div>

      {/* Ring Legend & Metrics */}
      <div className="mt-4 space-y-2 w-full text-xs font-mono">
        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-neutral-300 font-bold">Shift Quota</span>
          </div>
          <span className="font-black text-emerald-400">{dailyPct.toFixed(1)}% (${estDailyEarnings.toFixed(0)})</span>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-neutral-300 font-bold">Active Hour</span>
          </div>
          <span className="font-black text-blue-400">{hourlyPct.toFixed(1)}% (${hourlyRate.toFixed(0)}/h)</span>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-neutral-300 font-bold truncate max-w-[120px]">{nextGoal?.name || 'Target Goal'}</span>
          </div>
          <span className="font-black text-amber-400">{goalUnlockPct.toFixed(1)}% (${goalCost})</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. TACHYMETER YIELD SPEEDOMETER
 * Vintage / Futuristic analog speedometer with needle pointing to current yield speed.
 */
export const TachymeterSpeedGauge: React.FC<VisualizerProps> = ({
  sessionEarnings,
  hourlyRate,
  ratePerMin,
  ratePerSecond,
  clockedIn
}) => {
  // Speed percentage relative to hourly rate (100% = working at full rate, >100% = hyper yield)
  // Arc spans from -120 deg to +120 deg (total 240 deg)
  const speedPct = clockedIn ? 1.0 : 0.0; // 100% when active
  const needleAngle = -120 + speedPct * 240;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Gauge size={16} className="text-indigo-400" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-neutral-400">
          YIELD VELOCITY TACHYMETER
        </span>
      </div>

      {/* Speedometer Arc */}
      <div className="relative w-64 h-48 sm:w-72 sm:h-52 flex items-center justify-center mt-2">
        <svg className="w-full h-full" viewBox="0 0 200 150">
          <defs>
            <linearGradient id="speedArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 130 A 80 80 0 1 1 180 130"
            fill="none"
            stroke="#171717"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 130 A 80 80 0 1 1 180 130"
            fill="none"
            stroke="url(#speedArcGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="335"
            strokeDashoffset={clockedIn ? "0" : "335"}
            className="transition-all duration-1000"
          />

          {/* Major Speed Ticks */}
          {[0, 25, 50, 75, 100, 125, 150].map((val, idx) => {
            const angle = (-120 + (idx / 6) * 240) * (Math.PI / 180);
            const x1 = 100 + 64 * Math.cos(angle);
            const y1 = 130 + 64 * Math.sin(angle);
            const x2 = 100 + 56 * Math.cos(angle);
            const y2 = 130 + 56 * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#525252"
                strokeWidth="2"
              />
            );
          })}

          {/* Center Pivot */}
          <circle cx="100" cy="130" r="10" fill="#262626" stroke="#525252" strokeWidth="2" />
        </svg>

        {/* Needle Hand */}
        <div 
          className="absolute w-24 h-1 bg-gradient-to-r from-red-500 to-indigo-400 left-[28px] sm:left-[44px] top-[130px] origin-right transition-transform duration-700 shadow-[0_0_12px_rgba(239,68,68,0.9)] z-10 rounded-full"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 absolute left-0 -top-1 shadow-[0_0_10px_#ef4444]"></div>
        </div>

        {/* Digital Speed Display in Arc Center */}
        <div className="absolute top-[50%] text-center z-10 pointer-events-none space-y-0.5">
          <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${clockedIn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-neutral-800 text-neutral-500 border-neutral-700'}`}>
            {clockedIn ? 'HYPER-FLOW ACTIVE' : 'SHIFT STANDBY'}
          </span>
          <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight pt-1">
            ${ratePerSecond.toFixed(4)}<span className="text-neutral-500 text-xs">/s</span>
          </div>
        </div>
      </div>

      {/* Speed Metrics Breakdown */}
      <div className="grid grid-cols-3 gap-2 w-full text-center font-mono text-[9px] bg-neutral-950 p-3 rounded-2xl border border-neutral-800 mt-2">
        <div>
          <span className="text-neutral-500 block uppercase">Hour Speed</span>
          <span className="font-bold text-white">${hourlyRate.toFixed(2)}/h</span>
        </div>
        <div className="border-x border-neutral-800">
          <span className="text-neutral-500 block uppercase">Min Speed</span>
          <span className="font-bold text-emerald-400">${ratePerMin.toFixed(4)}/m</span>
        </div>
        <div>
          <span className="text-neutral-500 block uppercase">Sec Speed</span>
          <span className="font-bold text-indigo-400">${ratePerSecond.toFixed(6)}/s</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. REAL-TIME INCOME PULSE OSCILLOSCOPE (ECG / Heartbeat Waveform)
 * Live high-frequency rolling chart showing yield pulses over time.
 */
export const IncomePulseOscilloscope: React.FC<VisualizerProps> = ({
  sessionEarnings,
  msThisSession,
  clockedIn
}) => {
  const [buffer, setBuffer] = useState<number[]>(Array(30).fill(0));

  useEffect(() => {
    if (!clockedIn) return;
    const interval = setInterval(() => {
      setBuffer(prev => [...prev.slice(1), sessionEarnings]);
    }, 500);
    return () => clearInterval(interval);
  }, [clockedIn, sessionEarnings]);

  const maxVal = Math.max(...buffer, 0.001);
  const minVal = Math.min(...buffer, 0);
  const range = maxVal - minVal || 1;

  // Generate SVG Path
  const points = buffer.map((val, idx) => {
    const x = (idx / (buffer.length - 1)) * 260;
    const norm = (val - minVal) / range;
    const y = 100 - norm * 80;
    return `${x},${y}`;
  }).join(' L ');

  const areaPoints = `0,110 L ${points} L 260,110 Z`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
      
      {/* Title */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-neutral-400">
            INCOME HEARTBEAT WAVEFORM
          </span>
        </div>
        <span className="text-[8px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          500ms TICK PULSE
        </span>
      </div>

      {/* SVG Waveform Box */}
      <div className="relative w-full h-48 bg-black/80 rounded-2xl border border-neutral-800/80 p-4 overflow-hidden flex items-center justify-center">
        {/* Oscilloscope Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 260 110">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPoints} fill="url(#waveGrad)" />

          {/* Wave Line */}
          <path
            d={`M ${points}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          />

          {/* Latest Point Indicator Dot */}
          {buffer.length > 0 && (() => {
            const lastVal = buffer[buffer.length - 1];
            const norm = (lastVal - minVal) / range;
            const lastY = 100 - norm * 80;
            return (
              <circle
                cx="260"
                cy={lastY}
                r="5"
                fill="#06b6d4"
                className="animate-ping"
              />
            );
          })()}
        </svg>

        {/* Center Live Readout Badge */}
        <div className="absolute bottom-3 right-4 bg-black/90 p-2 px-3 rounded-xl border border-cyan-500/30 text-right font-mono">
          <span className="text-[8px] text-neutral-500 uppercase font-black block">Yield Accumulation</span>
          <span className="text-xs font-black text-cyan-400">${sessionEarnings.toFixed(4)}</span>
        </div>
      </div>

      {/* Oscilloscope Footer */}
      <div className="mt-4 flex items-center justify-between w-full text-xs font-mono text-neutral-400 bg-neutral-950 p-2.5 rounded-2xl border border-neutral-800">
        <span className="text-[9px] uppercase font-bold text-neutral-500">Live Telemetry</span>
        <span className="text-[9px] font-black text-emerald-400">{clockedIn ? '● STREAMING LIVE DATA' : '○ SHIFT PAUSED'}</span>
      </div>
    </div>
  );
};

/**
 * 5. GOAL UNLOCK PROGRESS WATCH STACK
 * Live radial dials for every target goal in the user's list.
 */
export const GoalUnlockProgressStack: React.FC<VisualizerProps> = ({
  sessionEarnings,
  goals
}) => {
  return (
    <div className="p-6 bg-black/60 border border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl space-y-4">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-amber-400" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-neutral-400">
            REAL-TIME GOAL UNLOCK GAUGES
          </span>
        </div>
        <span className="text-[8px] font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          {goals.length} TARGETS
        </span>
      </div>

      {/* Goal Ring List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
        {goals.map((goal) => {
          const pct = Math.min((sessionEarnings / goal.cost) * 100, 100);
          const isUnlocked = sessionEarnings >= goal.cost;
          const remaining = Math.max(goal.cost - sessionEarnings, 0);

          return (
            <div 
              key={goal.id} 
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                isUnlocked 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                  : 'bg-black/40 border-neutral-800'
              }`}
            >
              {/* Mini Ring Dial */}
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#262626"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isUnlocked ? '#10b981' : '#f59e0b'}
                    strokeWidth="3.5"
                    strokeDasharray={`${pct}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-black text-white">
                  {pct.toFixed(0)}%
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 font-mono">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-white truncate">{goal.name}</span>
                  <span className="text-[9px] font-black text-amber-400">${goal.cost}</span>
                </div>
                {isUnlocked ? (
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={10} /> UNLOCKED SHIFT ASSET!
                  </span>
                ) : (
                  <span className="text-[9px] text-neutral-500 block mt-0.5">
                    ${remaining.toFixed(2)} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * UNIFIED MONEY GROWTH VISUALIZER ENGINE
 * Interactive multi-view visualizer dashboard container.
 */
export const LiveMoneyVisualizerEngine: React.FC<VisualizerProps> = (props) => {
  const [activeMode, setActiveMode] = useState<'chronograph' | 'rings' | 'tachymeter' | 'pulse' | 'goals' | 'quad'>('quad');

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-2 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2 px-2">
          <Sparkles size={16} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-300">
            VISUAL MONEY GAUGES
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveMode('quad')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'quad'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Layers size={12} /> Quad View
          </button>

          <button
            onClick={() => setActiveMode('chronograph')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'chronograph'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Watch size={12} /> Chronograph Watch
          </button>

          <button
            onClick={() => setActiveMode('rings')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'rings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Target size={12} /> Yield Rings
          </button>

          <button
            onClick={() => setActiveMode('tachymeter')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'tachymeter'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Gauge size={12} /> Tachymeter
          </button>

          <button
            onClick={() => setActiveMode('pulse')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'pulse'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Activity size={12} /> Heartbeat
          </button>

          <button
            onClick={() => setActiveMode('goals')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeMode === 'goals'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Award size={12} /> Goal Dials
          </button>
        </div>
      </div>

      {/* Render Selected Visualizer(s) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeMode === 'quad' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChronographWatchVisualizer {...props} />
              <SovereignActivityRings {...props} />
              <TachymeterSpeedGauge {...props} />
              <IncomePulseOscilloscope {...props} />
            </div>
          )}

          {activeMode === 'chronograph' && (
            <div className="max-w-xl mx-auto">
              <ChronographWatchVisualizer {...props} />
            </div>
          )}

          {activeMode === 'rings' && (
            <div className="max-w-xl mx-auto">
              <SovereignActivityRings {...props} />
            </div>
          )}

          {activeMode === 'tachymeter' && (
            <div className="max-w-xl mx-auto">
              <TachymeterSpeedGauge {...props} />
            </div>
          )}

          {activeMode === 'pulse' && (
            <div className="max-w-xl mx-auto">
              <IncomePulseOscilloscope {...props} />
            </div>
          )}

          {activeMode === 'goals' && (
            <div className="max-w-xl mx-auto">
              <GoalUnlockProgressStack {...props} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
