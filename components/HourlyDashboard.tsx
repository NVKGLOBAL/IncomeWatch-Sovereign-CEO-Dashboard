import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Coffee, 
  Home, 
  Cpu, 
  Coins, 
  Trash2, 
  Plus, 
  Play, 
  Square, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Briefcase, 
  Award, 
  Scale, 
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { LiveMoneyVisualizerEngine } from './MoneyGrowthVisualizers';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface Goal {
  id: string;
  name: string;
  cost: number;
  category: string;
}

interface HourlyDashboardProps {
  hourlyRate: number;
  setHourlyRate: (val: number) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  completedHoursThisMonth: number;
  setCompletedHoursThisMonth: (val: number) => void;
  dailyHoursTarget: number;
  setDailyHoursTarget: (val: number) => void;
  targetMonthlyEarnings: number;
  setTargetMonthlyEarnings: (val: number) => void;
  clockedIn: boolean;
  setClockedIn: (val: boolean) => void;
  clockInTime: number | null;
  setClockInTime: (val: number | null) => void;
  elapsedSecondsBeforeCurrentSession: number;
  setElapsedSecondsBeforeCurrentSession: (val: number) => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export const HourlyDashboard: React.FC<HourlyDashboardProps> = ({
  hourlyRate,
  setHourlyRate,
  taxRate,
  setTaxRate,
  completedHoursThisMonth,
  setCompletedHoursThisMonth,
  dailyHoursTarget,
  setDailyHoursTarget,
  targetMonthlyEarnings,
  setTargetMonthlyEarnings,
  clockedIn,
  setClockedIn,
  clockInTime,
  setClockInTime,
  elapsedSecondsBeforeCurrentSession,
  setElapsedSecondsBeforeCurrentSession,
  goals,
  setGoals
}) => {
  // Local state for live tracking
  const [msThisSession, setMsThisSession] = useState(0);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCost, setNewGoalCost] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Essential');

  // Timer interval effect
  useEffect(() => {
    let animationFrameId: number;
    if (clockedIn && clockInTime) {
      const updateTimer = () => {
        const elapsed = Date.now() - clockInTime;
        setMsThisSession(elapsed);
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      animationFrameId = requestAnimationFrame(updateTimer);
    } else {
      setMsThisSession(0);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [clockedIn, clockInTime]);

  const totalSessionSeconds = elapsedSecondsBeforeCurrentSession + (msThisSession / 1000);
  const sessionEarnings = (totalSessionSeconds / 3600) * hourlyRate;
  const sessionEarningsAfterTax = sessionEarnings * (1 - taxRate / 100);

  // General calculated stats
  const monthlyCompletedEarnings = completedHoursThisMonth * hourlyRate;
  const monthlyCompletedEarningsAfterTax = monthlyCompletedEarnings * (1 - taxRate / 100);
  const estDailyEarnings = dailyHoursTarget * hourlyRate;
  const estDailyEarningsAfterTax = estDailyEarnings * (1 - taxRate / 100);

  // Rates breakdown
  const ratePerMin = hourlyRate / 60;
  const ratePerSecond = hourlyRate / 3600;
  const ratePerMs = hourlyRate / 3600000;

  // Time formatting with millisecond precision
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    const ms = Math.floor((totalSeconds % 1) * 1000);
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s .${ms.toString().padStart(3, '0')}ms`;
  };

  // Clock In / Out Toggle
  const handleClockToggle = () => {
    if (clockedIn) {
      // Clocking out: Add current session hours to completed hours
      const completedSessionHours = totalSessionSeconds / 3600;
      setCompletedHoursThisMonth(prev => Number((prev + completedSessionHours).toFixed(4)));
      setClockedIn(false);
      setClockInTime(null);
      setElapsedSecondsBeforeCurrentSession(0);
      setMsThisSession(0);
    } else {
      // Clocking in
      setClockedIn(true);
      setClockInTime(Date.now());
      setElapsedSecondsBeforeCurrentSession(0);
    }
  };

  // Add custom goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalCost) return;
    const costNum = Number(newGoalCost);
    if (isNaN(costNum) || costNum <= 0) return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      name: newGoalName,
      cost: costNum,
      category: newGoalCategory
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalName('');
    setNewGoalCost('');
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Chart projection based on daily hours target across 30 days
  const projectionData = Array.from({ length: 30 }).map((_, i) => {
    const day = i + 1;
    const standardWorkedHours = day * dailyHoursTarget;
    const gross = standardWorkedHours * hourlyRate;
    const net = gross * (1 - taxRate / 100);
    return {
      name: `Day ${day}`,
      gross: Math.round(gross),
      net: Math.round(net)
    };
  });

  return (
    <div className="space-y-8 pb-20">
      {/* REAL-TIME WORK SHIFT TICKER */}
      <div className="flex flex-col items-center justify-center space-y-6 p-8 md:p-10 bg-neutral-900/40 border border-neutral-800 rounded-[3rem] backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        {/* Status indicator */}
        <div className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] font-black flex items-center gap-4">
          <span className="w-8 h-[1px] bg-neutral-800"></span>
          ACTIVE WORKFLOW TIME-STREAM
          <span className={`text-[8px] px-2.5 py-0.5 rounded-full border font-black tracking-widest uppercase transition-all ${clockedIn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' : 'bg-neutral-800 text-neutral-500 border-neutral-700'}`}>
            {clockedIn ? 'Clocked In' : 'Shift Suspended'}
          </span>
          <span className="w-8 h-[1px] bg-neutral-800"></span>
        </div>

        {/* Large live session earnings */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-black uppercase text-neutral-600 tracking-widest block">Session Shift Asset Yield</span>
          <div className="text-5xl sm:text-6xl md:text-8xl font-mono font-bold text-emerald-400 tracking-tighter tabular-nums py-2 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            ${sessionEarnings.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <span className="text-neutral-500">Net (after Tax):</span>
            <span className="text-emerald-500/80 font-bold">${sessionEarningsAfterTax.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
          </div>
        </div>

        {/* Real-time Rate Yield Speedometer */}
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-3xl border border-neutral-800/80 font-mono text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          <div className="space-y-1 p-2">
            <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block">Yield / Hour</span>
            <span className="text-xs md:text-sm font-black text-white">${hourlyRate.toFixed(2)}<span className="text-neutral-500 text-[10px]">/h</span></span>
          </div>
          <div className="border-l border-neutral-800/40 space-y-1 p-2">
            <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block">Yield / Minute</span>
            <span className="text-xs md:text-sm font-black text-emerald-400">${ratePerMin.toFixed(4)}<span className="text-neutral-500 text-[10px]">/m</span></span>
          </div>
          <div className="border-l border-neutral-800/40 space-y-1 p-2">
            <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block">Yield / Second</span>
            <span className="text-xs md:text-sm font-black text-indigo-400">${ratePerSecond.toFixed(6)}<span className="text-neutral-500 text-[10px]">/s</span></span>
          </div>
          <div className="border-l border-neutral-800/40 space-y-1 p-2">
            <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block">Yield / Millisecond</span>
            <span className="text-xs md:text-sm font-black text-blue-400">${ratePerMs.toFixed(9)}<span className="text-neutral-500 text-[10px]">/ms</span></span>
          </div>
        </div>

        {/* Action Controls & Session Timer */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg justify-center bg-black/40 p-4 rounded-3xl border border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${clockedIn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
              <Clock size={18} className={clockedIn ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <span className="text-[8px] font-mono text-neutral-600 block uppercase tracking-widest">Active Shift Duration</span>
              <span className="font-mono text-xs sm:text-sm md:text-base font-black text-white tabular-nums">{formatTime(totalSessionSeconds)}</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-neutral-800 hidden sm:block"></div>

          <button
            onClick={handleClockToggle}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              clockedIn 
                ? 'bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            {clockedIn ? (
              <>
                <Square size={14} fill="currentColor" /> Clock Out
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" /> Clock In Shift
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE INTERACTIVE MONEY GROWTH VISUALIZERS (WATCH DIALS, RINGS, TACHYMETER, OSCILLOSCOPE) */}
      <LiveMoneyVisualizerEngine
        sessionEarnings={sessionEarnings}
        sessionEarningsAfterTax={sessionEarningsAfterTax}
        totalSessionSeconds={totalSessionSeconds}
        msThisSession={msThisSession}
        hourlyRate={hourlyRate}
        ratePerMin={ratePerMin}
        ratePerSecond={ratePerSecond}
        ratePerMs={ratePerMs}
        estDailyEarnings={estDailyEarnings}
        dailyHoursTarget={dailyHoursTarget}
        clockedIn={clockedIn}
        goals={goals}
      />

      {/* COMPACT DASHBOARD HOURLY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Hourly Asset Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-white">${hourlyRate}</span>
            <span className="text-xs text-neutral-500">/ hr</span>
          </div>
          <span className="text-[8.5px] font-bold text-neutral-600 block uppercase mt-2">Adjustable via settings</span>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Monthly Completed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-emerald-400">${monthlyCompletedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <span className="text-[8.5px] font-bold text-neutral-600 block uppercase mt-2">{completedHoursThisMonth} Completed Hours</span>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Gross Expected Day</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-blue-400">${estDailyEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <span className="text-[8.5px] font-bold text-neutral-600 block uppercase mt-2">{dailyHoursTarget} hrs Target Day</span>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Net Take-Home (Mo)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-indigo-400">${monthlyCompletedEarningsAfterTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <span className="text-[8.5px] font-bold text-neutral-600 block uppercase mt-2">Est. {taxRate}% Tax Rate Offset</span>
        </div>
      </div>

      {/* 24-HOUR DAILY TIME-ALLOCATION VISUALIZER */}
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
              <Clock size={18} className="text-emerald-500" />
              24-Hour Sovereign <span className="text-emerald-500">Time Allocation</span>
            </h3>
            <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest mt-1">
              Daily Life Partitioning: Labor Target vs Tax Burden vs Personal Freedom
            </p>
          </div>
          <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            24.0 Hours Cycle
          </span>
        </div>

        {(() => {
          const workHours = Math.min(dailyHoursTarget, 24);
          const taxHours = Number((workHours * (taxRate / 100)).toFixed(1));
          const netWorkHours = Number((workHours - taxHours).toFixed(1));
          const freeHours = Number((24 - workHours).toFixed(1));

          const netWorkPct = (netWorkHours / 24) * 100;
          const taxPct = (taxHours / 24) * 100;
          const freePct = (freeHours / 24) * 100;

          return (
            <div className="space-y-6">
              <div className="h-6 w-full bg-black rounded-2xl overflow-hidden flex border border-neutral-800 p-1 gap-1">
                <div 
                  style={{ width: `${netWorkPct}%` }} 
                  className="h-full bg-emerald-500 rounded-xl transition-all duration-700 shadow-sm relative group cursor-pointer"
                  title={`Net Earnings Labor: ${netWorkHours}h`}
                />
                <div 
                  style={{ width: `${taxPct}%` }} 
                  className="h-full bg-red-500/80 rounded-xl transition-all duration-700 shadow-sm relative group cursor-pointer"
                  title={`Tax Duty Labor: ${taxHours}h`}
                />
                <div 
                  style={{ width: `${freePct}%` }} 
                  className="h-full bg-indigo-500/60 rounded-xl transition-all duration-700 shadow-sm relative group cursor-pointer"
                  title={`Personal Sovereign Time: ${freeHours}h`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-black/40 p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-[9px] text-neutral-400 uppercase font-black">Net Labor Yield</span>
                  </div>
                  <span className="text-lg font-black text-emerald-400">{netWorkHours} hrs</span>
                  <span className="text-[9px] text-neutral-600 block uppercase font-bold">{netWorkPct.toFixed(1)}% of day</span>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full"></span>
                    <span className="text-[9px] text-neutral-400 uppercase font-black">Tax Duty Hours</span>
                  </div>
                  <span className="text-lg font-black text-red-400">{taxHours} hrs</span>
                  <span className="text-[9px] text-neutral-600 block uppercase font-bold">{taxPct.toFixed(1)}% of day ({taxRate}% tax)</span>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 bg-indigo-500/60 rounded-full"></span>
                    <span className="text-[9px] text-neutral-400 uppercase font-black">Personal Sovereign Time</span>
                  </div>
                  <span className="text-lg font-black text-indigo-300">{freeHours} hrs</span>
                  <span className="text-[9px] text-neutral-600 block uppercase font-bold">{freePct.toFixed(1)}% of day (rest/life)</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* AFFORDABILITY CONVERTER / LABOR REVELATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GOALS TABLE */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Hours To <span className="text-emerald-500">Freedom</span></h3>
              <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest mt-1">Labor Valuation of Capital Goals</p>
            </div>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-black tracking-widest uppercase">Direct Correlation</span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {goals.map(goal => {
              const hoursRequired = goal.cost / hourlyRate;
              const hoursInt = Math.floor(hoursRequired);
              const minsInt = Math.round((hoursRequired - hoursInt) * 60);

              return (
                <div key={goal.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-neutral-800/80 hover:border-neutral-700 transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase">{goal.name}</span>
                      <span className="text-[8px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">{goal.category}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold">${goal.cost.toLocaleString()} Capital Valuation</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-mono font-black text-emerald-400 block">{hoursInt}h {minsInt}m</span>
                      <span className="text-[8px] text-neutral-600 block uppercase font-bold tracking-widest">of physical labor</span>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-neutral-700 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/30 p-4 rounded-2xl border border-neutral-800/60">
            <div className="sm:col-span-2">
              <input 
                type="text" 
                placeholder="Target Goal Name..." 
                value={newGoalName}
                onChange={e => setNewGoalName(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 font-bold text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div>
              <input 
                type="number" 
                placeholder="Cost ($)..." 
                value={newGoalCost}
                onChange={e => setNewGoalCost(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 font-bold text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all py-3 flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10"
            >
              <Plus size={14} /> Add Goal
            </button>
          </form>
        </div>

        {/* HOURLY STRATEGIC ADVISOR */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-transparent"></div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-3 italic">
              <Award size={14} className="text-emerald-500" />
              Hourly Growth Advisor
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Contract renegotiation leverage</span>
                <p className="text-xs text-neutral-300 italic font-medium leading-relaxed">
                  "If you increase your hourly rate by just $10, you would achieve the same monthly revenue of ${monthlyCompletedEarnings.toLocaleString()} with {Math.round(monthlyCompletedEarnings / (hourlyRate + 10))} worked hours, liberating you of {Math.round(completedHoursThisMonth - (monthlyCompletedEarnings / (hourlyRate + 10)))} hours of work."
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Tax optimization vector</span>
                <p className="text-xs text-neutral-300 italic font-medium leading-relaxed">
                  {taxRate >= 25 ? 
                    `"With an estimated tax burden of ${taxRate}%, consider establishing a Single-Member LLC or S-Corp structure to claim valid business deductions (hardware, workspace write-offs), effectively reclaiming an estimated $${(monthlyCompletedEarnings * 0.05).toFixed(0)} of capital monthly."` : 
                    `"Your estimated tax burden is optimized. Maintain meticulous logs of software, energy, and desk write-offs for potential tax offsets."`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800/60 mt-6">
            <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <span>Monthly Target Progress</span>
              <span className="text-emerald-400">{(monthlyCompletedEarnings / (targetMonthlyEarnings || 1) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80 mt-2 p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                style={{ width: `${Math.min((monthlyCompletedEarnings / (targetMonthlyEarnings || 1) * 100), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TIMEFLOW PROJECTION GRAPH */}
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter">Gross vs. Net <span className="text-emerald-500">Projection</span></h3>
            <p className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest">30-Day Accumulation Model (Target worked hours: {dailyHoursTarget}h/day)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[8.5px] font-black uppercase tracking-widest text-neutral-500">Gross yield</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
              <span className="text-[8.5px] font-black uppercase tracking-widest text-neutral-500">Net Take-Home</span>
            </div>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
              <XAxis dataKey="name" stroke="#404040" fontSize={9} fontWeight="bold" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #1c1c1c', borderRadius: '20px' }}
                itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                labelStyle={{ color: '#525252', fontSize: '9px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="gross" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
              <Area type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
