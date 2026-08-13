
import React, { useState, useMemo, useEffect } from 'react';
import { FinancialStats, SalesFunnel, RevenueStream, Expense } from './types';
import { IncomeTicker } from './components/IncomeTicker';
import { ResearchAgent } from './components/ResearchAgent';
import { HourlyDashboard } from './components/HourlyDashboard';
import { AIEngineSettings } from './components/AIEngineSettings';
import { motion, AnimatePresence } from 'motion/react';
import { 
  OmniChart, 
  StrategicYield, 
  LegacyWealth, 
  RatioCard, 
  FunnelStep, 
  SettingsInput,
  AdviceCard,
  NavButton,
  FooterIcon,
  ViewMode,
  RevenueDistributionChart,
  OperationalLeakChart
} from './components/DashboardComponents';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Sun, 
  Bot, 
  Settings, 
  Target, 
  Clock,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Gem,
  Music,
  Activity,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Phone,
  DoorOpen,
  CheckCircle2,
  BarChart4,
  Plus,
  Trash2,
  Rocket,
  Briefcase,
  PieChart,
  ArrowRight
} from 'lucide-react';

const INITIAL_STATS: FinancialStats = {
  companyName: "Sovereign Enterprise",
  revenueStreams: [
    { 
      id: '1', 
      name: 'SaaS Platform', 
      type: 'mrr', 
      value: 49, 
      count: 100,
      funnel: { prospects: 1000, leads: 200, appointments: 50, sales: 10, period: 'monthly' }
    },
    { 
      id: '2', 
      name: 'Sales Commissions', 
      type: 'one-time', 
      value: 5000, 
      count: 2,
      funnel: { prospects: 50, leads: 10, appointments: 5, sales: 2, period: 'monthly' }
    }
  ],
  expenses: [
    { id: '1', name: 'Cloud Infrastructure', amount: 1200 },
    { id: '2', name: 'Marketing', amount: 2500 }
  ],
  targetMonthlyIncome: 50000,
  compoundingRate: 10
};

export default function App() {
  const [stats, setStats] = useState<FinancialStats>(() => {
    const saved = localStorage.getItem('ceo_dashboard_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'funnels' | 'growth' | 'settings'>('dashboard');
  const [isOnboarding, setIsOnboarding] = useState(() => !localStorage.getItem('ceo_dashboard_onboarded'));
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedStreamId, setSelectedStreamId] = useState<string | 'global'>('global');

  // HOURLY WORKER MODE STATES
  const [userMode, setUserMode] = useState<'ceo' | 'hourly'>(() => {
    const saved = localStorage.getItem('ceo_dashboard_user_mode');
    return (saved === 'hourly' || saved === 'ceo') ? saved : 'ceo';
  });

  const [hourlyRate, setHourlyRate] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_hourly_rate');
    return saved ? Number(saved) : 55;
  });

  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_tax_rate');
    return saved ? Number(saved) : 25;
  });

  const [completedHoursThisMonth, setCompletedHoursThisMonth] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_completed_hours');
    return saved ? Number(saved) : 120;
  });

  const [dailyHoursTarget, setDailyHoursTarget] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_daily_hours');
    return saved ? Number(saved) : 8;
  });

  const [targetMonthlyEarnings, setTargetMonthlyEarnings] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_target_earnings');
    return saved ? Number(saved) : 8000;
  });

  const [clockedIn, setClockedIn] = useState<boolean>(() => {
    return localStorage.getItem('ceo_dashboard_clocked_in') === 'true';
  });

  const [clockInTime, setClockInTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('ceo_dashboard_clock_in_time');
    return saved ? Number(saved) : null;
  });

  const [elapsedSecondsBeforeCurrentSession, setElapsedSecondsBeforeCurrentSession] = useState<number>(() => {
    const saved = localStorage.getItem('ceo_dashboard_elapsed_seconds');
    return saved ? Number(saved) : 0;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('ceo_dashboard_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: "1", name: "Rent & Housing", cost: 1800, category: "Essential" },
      { id: "2", name: "Groceries & Food", cost: 400, category: "Essential" },
      { id: "3", name: "Sovereign Gadget / Laptop", cost: 1500, category: "Tech" },
      { id: "4", name: "Premium Beans & Espresso", cost: 80, category: "Luxury" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_user_mode', userMode);
  }, [userMode]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_hourly_rate', String(hourlyRate));
  }, [hourlyRate]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_tax_rate', String(taxRate));
  }, [taxRate]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_completed_hours', String(completedHoursThisMonth));
  }, [completedHoursThisMonth]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_daily_hours', String(dailyHoursTarget));
  }, [dailyHoursTarget]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_target_earnings', String(targetMonthlyEarnings));
  }, [targetMonthlyEarnings]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_clocked_in', String(clockedIn));
  }, [clockedIn]);

  useEffect(() => {
    if (clockInTime !== null) {
      localStorage.setItem('ceo_dashboard_clock_in_time', String(clockInTime));
    } else {
      localStorage.removeItem('ceo_dashboard_clock_in_time');
    }
  }, [clockInTime]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_elapsed_seconds', String(elapsedSecondsBeforeCurrentSession));
  }, [elapsedSecondsBeforeCurrentSession]);

  useEffect(() => {
    localStorage.setItem('ceo_dashboard_goals', JSON.stringify(goals));
  }, [goals]);

  const completeOnboarding = () => {
    localStorage.setItem('ceo_dashboard_onboarded', 'true');
    setIsOnboarding(false);
  };

  const calculated = useMemo(() => {
    const { revenueStreams, expenses } = stats;
    
    const mrrTotal = revenueStreams
      .filter(s => s.type === 'mrr')
      .reduce((acc, s) => acc + (s.value * s.count), 0);
    
    const oneTimeTotal = revenueStreams
      .filter(s => s.type === 'one-time')
      .reduce((acc, s) => acc + (s.value * s.count), 0);
    
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const currentMonthly = mrrTotal + oneTimeTotal - totalExpenses;

    // Aggregate Funnels (Normalized to Monthly)
    const aggregateFunnel = revenueStreams.reduce((acc, stream) => {
      const funnel = stream.funnel || { prospects: 0, leads: 0, appointments: 0, sales: 0, period: 'monthly' };
      const multiplier = funnel.period === 'daily' ? 30 : funnel.period === 'weekly' ? 4.33 : 1;
      return {
        prospects: acc.prospects + (funnel.prospects * multiplier),
        leads: acc.leads + (funnel.leads * multiplier),
        appointments: acc.appointments + (funnel.appointments * multiplier),
        sales: acc.sales + (funnel.sales * multiplier),
      };
    }, { prospects: 0, leads: 0, appointments: 0, sales: 0 });

    // Potential Revenue based on Funnel Sales * Stream Value
    const funnelMonthlyRevenue = revenueStreams.reduce((acc, stream) => {
      const funnel = stream.funnel || { prospects: 0, leads: 0, appointments: 0, sales: 0, period: 'monthly' };
      const multiplier = funnel.period === 'daily' ? 30 : funnel.period === 'weekly' ? 4.33 : 1;
      const monthlySales = funnel.sales * multiplier;
      return acc + (monthlySales * stream.value);
    }, 0) - totalExpenses;
    
    const monthlyRate = 1 + (stats.compoundingRate / 100);
    const project = (val: number, months: number) => val * Math.pow(monthlyRate, months);
    
    const yearOneTotal = Array.from({ length: 12 }).reduce((acc: number, _, i) => acc + project(currentMonthly, i), 0);
    const fiveYearWealth = Array.from({ length: 60 }).reduce((acc: number, _, i) => acc + project(currentMonthly, i), 0);
    const tenYearWealth = Array.from({ length: 120 }).reduce((acc: number, _, i) => acc + project(currentMonthly, i), 0);

    const q1 = project(currentMonthly, 0) + project(currentMonthly, 1) + project(currentMonthly, 2);
    const q2 = project(currentMonthly, 3) + project(currentMonthly, 4) + project(currentMonthly, 5);
    const q3 = project(currentMonthly, 6) + project(currentMonthly, 7) + project(currentMonthly, 8);
    const q4 = project(currentMonthly, 9) + project(currentMonthly, 10) + project(currentMonthly, 11);

    // Selected Funnel for UI
    const selectedStream = revenueStreams.find(s => s.id === selectedStreamId);
    const activeFunnel = selectedStreamId === 'global' || !selectedStream
      ? { ...aggregateFunnel, name: 'Global Enterprise' }
      : { 
          ...(selectedStream.funnel || { prospects: 0, leads: 0, appointments: 0, sales: 0, period: 'monthly' }), 
          name: selectedStream.name 
        };

    const prospectToLead = activeFunnel.prospects > 0 ? (activeFunnel.leads / activeFunnel.prospects) * 100 : 0;
    const leadToAppt = activeFunnel.leads > 0 ? (activeFunnel.appointments / activeFunnel.leads) * 100 : 0;
    const apptToSale = activeFunnel.appointments > 0 ? (activeFunnel.sales / activeFunnel.appointments) * 100 : 0;
    const leadValue = activeFunnel.sales > 0 ? currentMonthly / activeFunnel.prospects : 0;

    return {
      mrrTotal,
      oneTimeTotal,
      totalExpenses,
      currentMonthly,
      funnelMonthlyRevenue,
      aggregateFunnel,
      activeFunnel,
      hour: currentMonthly / (30 * 24),
      day: currentMonthly / 30,
      week: (currentMonthly / 30) * 7,
      q1, q2, q3, q4,
      yearOneTotal,
      fiveYearWealth,
      tenYearWealth,
      progress: Math.min((currentMonthly / stats.targetMonthlyIncome) * 100, 100),
      prospectToLead,
      leadToAppt,
      apptToSale,
      leadValue,
      monthlyRate
    };
  }, [stats, selectedStreamId]);

  const chartData = useMemo(() => {
    const { currentMonthly, funnelMonthlyRevenue, monthlyRate } = calculated;
    
    const getPoints = (len: number, rate: number, labelPrefix: string) => {
      return Array.from({ length: len }).map((_, i) => ({
        name: i === 0 ? 'Now' : `${labelPrefix}${i}`,
        actual: currentMonthly * Math.pow(rate, i),
        potential: funnelMonthlyRevenue * Math.pow(rate, i)
      }));
    };

    switch (viewMode) {
      case 'daily': 
        return getPoints(31, Math.pow(monthlyRate, 1/30), 'D');
      case 'weekly':
        return getPoints(13, Math.pow(monthlyRate, 7/30), 'W');
      case 'quarterly':
        return getPoints(9, Math.pow(monthlyRate, 3), 'Q');
      case 'yearly':
        return getPoints(11, Math.pow(monthlyRate, 12), 'Y');
      case 'monthly':
      default:
        return getPoints(13, monthlyRate, 'M');
    }
  }, [calculated, viewMode]);

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-blue-500/30 p-10 rounded-[3rem] max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Rocket className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Initialize</h2>
                <p className="text-neutral-500 text-[10px] uppercase font-mono tracking-widest">Enterprise OS v1.2</p>
              </div>
            </div>
            <div className="space-y-8">
              <SettingsInput label="Enterprise Name" value={stats.companyName} type="text" onChange={v => setStats({...stats, companyName: v})} />
              <div className="grid grid-cols-2 gap-4">
                <SettingsInput label="Monthly Goal ($)" value={stats.targetMonthlyIncome} type="number" onChange={v => setStats({...stats, targetMonthlyIncome: v})} />
                <SettingsInput label="Growth Bias (% MoM)" value={stats.compoundingRate} type="number" onChange={v => setStats({...stats, compoundingRate: v})} />
              </div>
              <button 
                onClick={completeOnboarding}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Launch Protocol <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 flex flex-col max-w-[1800px] mx-auto font-sans selection:bg-blue-500/30 overflow-x-hidden pb-24 md:pb-8">
      {/* NVK EXECUTIVE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-neutral-800 p-4 md:p-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-950 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl italic shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-400/20">
              {stats.companyName.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none whitespace-nowrap">
                {stats.companyName.split(' ')[0]} <span className="text-blue-500">{stats.companyName.split(' ').slice(1).join(' ') || 'GLOBAL'}</span>
              </h1>
              <p className="text-neutral-500 text-[8px] font-mono uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                <ShieldCheck size={10} className="text-blue-500"/>
                OMNI-TIMEFLOW ALPHA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
            <div className="hidden md:block flex-1">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">
                <span className="italic">Strategic Revenue Alignment</span>
                <span className="text-blue-400 font-mono">{calculated.progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  style={{ width: `${calculated.progress}%` }}
                />
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800/80 gap-1 select-none">
              <button 
                onClick={() => setUserMode('ceo')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all ${userMode === 'ceo' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                CEO
              </button>
              <button 
                onClick={() => setUserMode('hourly')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all ${userMode === 'hourly' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                Hourly
              </button>
            </div>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`p-2.5 md:p-3 rounded-xl border transition-all group ${activeTab === 'settings' ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/30' : 'bg-neutral-900 border-neutral-800 hover:border-blue-500/50'}`}
            >
              <Settings size={20} className={`${activeTab === 'settings' ? 'text-white' : 'text-neutral-400'} group-hover:rotate-45 transition-transform`} />
            </button>
          </div>
        </div>
      </header>

      <main className="mt-24 px-4 md:px-8 space-y-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              {userMode === 'hourly' ? (
                <HourlyDashboard
                  hourlyRate={hourlyRate}
                  setHourlyRate={setHourlyRate}
                  taxRate={taxRate}
                  setTaxRate={setTaxRate}
                  completedHoursThisMonth={completedHoursThisMonth}
                  setCompletedHoursThisMonth={setCompletedHoursThisMonth}
                  dailyHoursTarget={dailyHoursTarget}
                  setDailyHoursTarget={setDailyHoursTarget}
                  targetMonthlyEarnings={targetMonthlyEarnings}
                  setTargetMonthlyEarnings={setTargetMonthlyEarnings}
                  clockedIn={clockedIn}
                  setClockedIn={setClockedIn}
                  clockInTime={clockInTime}
                  setClockInTime={setClockInTime}
                  elapsedSecondsBeforeCurrentSession={elapsedSecondsBeforeCurrentSession}
                  setElapsedSecondsBeforeCurrentSession={setElapsedSecondsBeforeCurrentSession}
                  goals={goals}
                  setGoals={setGoals}
                />
              ) : (
                <>
                  <IncomeTicker totalMonthlyVelocity={calculated.currentMonthly} />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                     <RatioCard label="P -> L" value={calculated.prospectToLead} suffix="%" subtext="Marketing" />
                     <RatioCard label="L -> A" value={calculated.leadToAppt} suffix="%" subtext="Sales" />
                     <RatioCard label="Closing" value={calculated.apptToSale} suffix="%" subtext="Closing" />
                     <RatioCard label="L-Value" value={calculated.leadValue} prefix="$" subtext="Unit Econ" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    <div className="lg:col-span-2">
                      <OmniChart chartData={chartData} viewMode={viewMode} setViewMode={setViewMode} stats={stats} />
                    </div>
                    <div className="space-y-8">
                      <StrategicYield calculated={calculated} />
                      <LegacyWealth calculated={calculated} />
                    </div>

                    {/* PORTFOLIO ALLOCATION & CAPITAL LEAKS VISUALIZATIONS */}
                    <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <RevenueDistributionChart stats={stats} />
                      <OperationalLeakChart stats={stats} />
                    </div>

                    {/* STRATEGIC ADVISOR SECTION */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[3.5rem] relative overflow-hidden shadow-3xl">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                          <Bot size={24} className="text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">Strategic <span className="text-blue-500">Advisor</span></h3>
                          <p className="text-neutral-500 text-[9px] font-mono uppercase tracking-[0.4em]">Real-time Operational Insight // Engine v2.0</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AdviceCard 
                          title="Conversion Optimizer" 
                          value={calculated.apptToSale < 20 ? "CRITICAL" : "STABLE"} 
                          status={calculated.apptToSale < 20 ? "error" : "success"}
                          description={calculated.apptToSale < 20 ? 
                            "Your closing rate is below benchmark (20%). A 5% increase here yields an immediate $"+(calculated.currentMonthly * 0.25).toLocaleString()+" monthly lift." : 
                            "Closing rate is highly efficient. Focus on increasing lead volume to scale current velocity."}
                        />
                        <AdviceCard 
                          title="Top-of-Funnel Health" 
                          value={calculated.prospectToLead < 10 ? "LEAKING" : "HEALTHY"} 
                          status={calculated.prospectToLead < 10 ? "warning" : "success"}
                          description={calculated.prospectToLead < 10 ? 
                            "Prospect-to-Lead conversion is low. Audit your landing page copy or ad targeting immediately." : 
                            "Marketing resonance is peak. Current acquisition strategy is working at high efficiency."}
                        />
                        <AdviceCard 
                          title="Growth Trajectory" 
                          value={stats.compoundingRate >= 10 ? "AGGRESSIVE" : "CONSERVATIVE"} 
                          status="info"
                          description={"At a "+stats.compoundingRate+"% growth bias, you will achieve your $"+stats.targetMonthlyIncome.toLocaleString()+" goal in approximately "+Math.ceil(Math.log(stats.targetMonthlyIncome/calculated.currentMonthly)/Math.log(1+stats.compoundingRate/100))+" months."}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}


          {activeTab === 'funnels' && (
            <motion.div 
              key="funnels"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8 pb-12"
            >
              <div className="bg-neutral-900 p-6 md:p-10 rounded-[2.5rem] border border-neutral-800 shadow-2xl">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Command <span className="text-blue-500">Funnels</span></h2>
                      <p className="text-neutral-500 text-xs font-mono uppercase tracking-[0.3em]">Precision Pipeline Management</p>
                    </div>
                    <select 
                      className="w-full md:w-auto bg-black text-xs font-black uppercase tracking-widest border border-neutral-800 rounded-xl px-5 py-4 text-neutral-400 focus:outline-none focus:border-blue-500 shadow-xl"
                      value={selectedStreamId}
                      onChange={(e) => setSelectedStreamId(e.target.value)}
                    >
                      <option value="global">Global Enterprise</option>
                      {stats.revenueStreams.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                   <div className="space-y-8">
                      <FunnelStep icon={<Users size={18}/>} label="PROSPECTS" value={calculated.activeFunnel.prospects} color="bg-purple-600" width="w-full" />
                      <FunnelStep icon={<Target size={18}/>} label="LEADS" value={calculated.activeFunnel.leads} color="bg-blue-600" width="w-[85%]" />
                      <FunnelStep icon={<Clock size={18}/>} label="APPOINTMENTS" value={calculated.activeFunnel.appointments} color="bg-indigo-600" width="w-[50%]" />
                      <FunnelStep icon={<CheckCircle2 size={18}/>} label="SALES CLOSED" value={calculated.activeFunnel.sales} color="bg-emerald-600" width="w-[30%]" highlight />
                   </div>
                   
                   <div className="bg-black border border-neutral-800 p-10 rounded-[3rem] space-y-10 shadow-inner relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:bg-emerald-500 transition-colors"></div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 italic text-center">Unit Efficiency Metrics</h4>
                      <div className="grid grid-cols-2 gap-12">
                        <div className="text-center">
                          <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Mkt Ratio</span>
                          <span className="text-5xl font-mono font-black text-white">x{(calculated.activeFunnel.prospects / (calculated.activeFunnel.sales || 1)).toFixed(0)}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Asset Growth</span>
                          <span className="text-5xl font-mono font-black text-emerald-500">+{stats.compoundingRate}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-center text-neutral-400 leading-relaxed font-medium italic border-t border-neutral-800 pt-8">
                        At this efficiency, achieving ${stats.targetMonthlyIncome.toLocaleString()} requires generating 
                        <span className="text-blue-500 font-black mx-1">
                          {(stats.targetMonthlyIncome / (calculated.activeFunnel.sales > 0 ? (calculated.currentMonthly / calculated.activeFunnel.sales) : 1) * (calculated.activeFunnel.prospects / (calculated.activeFunnel.sales || 1))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span> 
                        new prospects monthly.
                      </p>
                   </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'growth' && (
            <motion.div 
              key="growth"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="h-[calc(100vh-14rem)] min-h-[500px] pb-12"
            >
              <ResearchAgent />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pb-24"
            >
              <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-10 rounded-[3rem] shadow-3xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-neutral-800/60 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-widest italic leading-tight">Operations <span className="text-blue-500">Nucleus</span></h3>
                      <p className="text-neutral-500 text-[9px] font-mono uppercase tracking-[0.4em]">Protocol Configuration // v1.2</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                    }}
                    className="w-full sm:w-auto px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 border border-blue-400/20"
                  >
                    <CheckCircle2 size={16} /> Save & Close Settings
                  </button>
                </div>
                
                {/* AI ENGINE & OPEN MODEL CONFIGURATION */}
                <div className="mb-12">
                  <AIEngineSettings />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {userMode === 'ceo' ? (
                    <>
                      {/* CEO MODE SETTINGS */}
                      <div className="space-y-10">
                        <SettingsInput label="Enterprise Identity" value={stats.companyName} type="text" onChange={v => setStats({...stats, companyName: v})} />
                        <div className="grid grid-cols-2 gap-6">
                          <SettingsInput label="Target Wealth ($)" value={stats.targetMonthlyIncome} type="number" color="text-blue-400" onChange={v => setStats({...stats, targetMonthlyIncome: v})} />
                          <SettingsInput label="Compound Bias (%)" value={stats.compoundingRate} type="number" color="text-emerald-400" onChange={v => setStats({...stats, compoundingRate: v})} />
                        </div>

                        <div className="space-y-6">
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 italic ml-2">Revenue Streams</h4>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  if(confirm('Are you sure you want to restore default template?')) {
                                    setStats(INITIAL_STATS);
                                  }
                                }}
                                className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-xl hover:bg-neutral-700 transition-all font-black text-[10px] uppercase tracking-widest border border-neutral-700"
                              >
                                Reset
                              </button>
                              <button 
                                onClick={() => setStats({
                                  ...stats, 
                                  revenueStreams: [
                                    ...stats.revenueStreams, 
                                    { 
                                      id: Math.random().toString(), 
                                      name: 'New Asset', 
                                      type: 'mrr', 
                                      value: 0, 
                                      count: 0,
                                      funnel: { prospects: 0, leads: 0, appointments: 0, sales: 0, period: 'monthly' }
                                    }
                                  ]
                                })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg font-black text-[10px] uppercase tracking-widest"
                              >
                                Add Stream
                              </button>
                            </div>
                          </div>
                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats.revenueStreams.map((stream, idx) => (
                              <div key={stream.id} className="space-y-6 bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner">
                                <div className="flex gap-4 items-center">
                                  <input 
                                    className="bg-transparent text-lg font-black uppercase tracking-tighter text-blue-500 focus:outline-none flex-grow"
                                    value={stream.name}
                                    onChange={(e) => {
                                      const newStreams = [...stats.revenueStreams];
                                      newStreams[idx].name = e.target.value;
                                      setStats({...stats, revenueStreams: newStreams});
                                    }}
                                  />
                                  <button 
                                    onClick={() => setStats({...stats, revenueStreams: stats.revenueStreams.filter((_, i) => i !== idx)})}
                                    className="p-2 text-neutral-700 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Type</label>
                                    <select 
                                      className="w-full bg-neutral-900 text-xs rounded-xl px-3 py-3 border border-neutral-800 text-neutral-300 font-bold"
                                      value={stream.type}
                                      onChange={(e) => {
                                        const newStreams = [...stats.revenueStreams];
                                        newStreams[idx].type = e.target.value as any;
                                        setStats({...stats, revenueStreams: newStreams});
                                      }}
                                    >
                                      <option value="mrr">MRR</option>
                                      <option value="one-time">DEAL</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Pricing</label>
                                    <input 
                                      type="number"
                                      className="w-full bg-neutral-900 text-xs rounded-xl px-3 py-3 border border-neutral-800 text-white font-mono"
                                      value={stream.value}
                                      onChange={(e) => {
                                        const newStreams = [...stats.revenueStreams];
                                        newStreams[idx].value = Number(e.target.value);
                                        setStats({...stats, revenueStreams: newStreams});
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Volume</label>
                                    <input 
                                      type="number"
                                      className="w-full bg-neutral-900 text-xs rounded-xl px-3 py-3 border border-neutral-800 text-white font-mono"
                                      value={stream.count}
                                      onChange={(e) => {
                                        const newStreams = [...stats.revenueStreams];
                                        newStreams[idx].count = Number(e.target.value);
                                        setStats({...stats, revenueStreams: newStreams});
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="pt-6 border-t border-neutral-800/50 space-y-4">
                                  <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.3em] italic">Pipeline Calibration</span>
                                  <div className="grid grid-cols-4 gap-3">
                                    {['prospects', 'leads', 'appointments', 'sales'].map((field) => (
                                      <div key={field} className="space-y-1">
                                        <label className="text-[7px] font-bold text-neutral-700 uppercase">{field}</label>
                                        <input 
                                          type="number"
                                          className="w-full bg-neutral-900 text-[11px] rounded-lg px-2 py-2 border border-neutral-800 text-neutral-300 font-mono"
                                          value={stream.funnel ? (stream.funnel as any)[field] : 0}
                                          onChange={(e) => {
                                            const newStreams = [...stats.revenueStreams];
                                            if (!newStreams[idx].funnel) {
                                              newStreams[idx].funnel = { prospects: 0, leads: 0, appointments: 0, sales: 0, period: 'monthly' };
                                            }
                                            (newStreams[idx].funnel as any)[field] = Number(e.target.value);
                                            setStats({...stats, revenueStreams: newStreams});
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="space-y-6">
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 italic ml-2">Operational Leaks (Expenses)</h4>
                            <button 
                              onClick={() => setStats({...stats, expenses: [...stats.expenses, { id: Math.random().toString(), name: 'New Expense', amount: 0 }]})}
                              className="px-4 py-2 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600/30 transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20"
                            >
                              Add Leak
                            </button>
                          </div>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats.expenses.map((expense, idx) => (
                              <div key={expense.id} className="flex gap-4 items-center bg-black p-6 rounded-3xl border border-neutral-800 shadow-sm group">
                                <div className="flex-grow space-y-2">
                                  <label className="text-[8px] font-black text-neutral-700 uppercase tracking-widest">Allocation Description</label>
                                  <input 
                                    className="bg-transparent text-sm font-bold uppercase tracking-widest text-neutral-300 focus:outline-none w-full"
                                    value={expense.name}
                                    onChange={(e) => {
                                      const newExpenses = [...stats.expenses];
                                      newExpenses[idx].name = e.target.value;
                                      setStats({...stats, expenses: newExpenses});
                                    }}
                                  />
                                </div>
                                <div className="w-32 space-y-2">
                                  <label className="text-[8px] font-black text-neutral-700 uppercase tracking-widest">Burn ($)</label>
                                  <input 
                                    type="number"
                                    className="bg-neutral-900 text-sm font-mono rounded-xl px-4 py-2.5 border border-neutral-800 w-full text-red-500 font-black"
                                    value={expense.amount}
                                    onChange={(e) => {
                                      const newExpenses = [...stats.expenses];
                                      newExpenses[idx].amount = Number(e.target.value);
                                      setStats({...stats, expenses: newExpenses});
                                    }}
                                  />
                                </div>
                                <button 
                                  onClick={() => setStats({...stats, expenses: stats.expenses.filter((_, i) => i !== idx)})}
                                  className="p-3 text-neutral-800 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={24} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-blue-600/5 border border-blue-500/10 p-10 rounded-[3rem] mt-12 space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                              <ShieldCheck size={24} className="text-blue-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black uppercase text-blue-400 italic tracking-[0.2em]">Sovereign Control Protocol</h4>
                              <span className="text-[9px] font-mono text-neutral-600 block uppercase tracking-widest">Local Buffer Storage Active</span>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                            Your strategic enterprise parameters are cached within the Sovereign command buffer. No external cloud sync is active, ensuring absolute strategic privacy.
                          </p>
                          <button 
                            onClick={() => {
                              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ stats, hourlyRate, taxRate, completedHoursThisMonth, dailyHoursTarget, targetMonthlyEarnings, goals }));
                              const downloadAnchorNode = document.createElement('a');
                              downloadAnchorNode.setAttribute("href", dataStr);
                              downloadAnchorNode.setAttribute("download", `${stats.companyName}_sovereign_backup.json`);
                              document.body.appendChild(downloadAnchorNode);
                              downloadAnchorNode.click();
                              downloadAnchorNode.remove();
                            }}
                            className="w-full bg-neutral-800 hover:bg-white hover:text-black hover:border-white text-white font-black uppercase tracking-widest py-5 rounded-2xl text-xs transition-all border border-neutral-700 shadow-xl"
                          >
                            Initiate External Export
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* HOURLY WORKER MODE SETTINGS */}
                      <div className="space-y-10">
                        <SettingsInput label="Enterprise Identity" value={stats.companyName} type="text" onChange={v => setStats({...stats, companyName: v})} />
                        
                        <div className="space-y-6 bg-black/40 p-6 rounded-[2rem] border border-neutral-800 shadow-inner">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 italic mb-4">Hourly Time-Asset Calibration</h4>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <SettingsInput label="Hourly Asset Rate ($)" value={hourlyRate} type="number" color="text-emerald-400" onChange={v => setHourlyRate(v)} />
                            <SettingsInput label="Completed Hours (Mo)" value={completedHoursThisMonth} type="number" color="text-emerald-400" onChange={v => setCompletedHoursThisMonth(v)} />
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-900">
                            <div>
                              <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest block mb-2">Target Revenue ($)</label>
                              <input 
                                type="number"
                                className="w-full bg-neutral-900 text-xs rounded-xl px-4 py-3 border border-neutral-800 text-white font-mono font-black"
                                value={targetMonthlyEarnings}
                                onChange={e => setTargetMonthlyEarnings(Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest block mb-2">Daily Hours Target</label>
                              <input 
                                type="number"
                                className="w-full bg-neutral-900 text-xs rounded-xl px-4 py-3 border border-neutral-800 text-white font-mono font-black"
                                value={dailyHoursTarget}
                                onChange={e => setDailyHoursTarget(Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-black text-neutral-600 uppercase tracking-widest block mb-2">Estimated Tax Burden (%)</label>
                              <input 
                                type="number"
                                className="w-full bg-neutral-900 text-xs rounded-xl px-4 py-3 border border-neutral-800 text-white font-mono font-black"
                                value={taxRate}
                                onChange={e => setTaxRate(Number(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-600/5 border border-emerald-500/10 p-8 rounded-[2rem] space-y-4">
                          <h4 className="text-xs font-black uppercase text-emerald-400 tracking-widest">Active Shift Diagnostics</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div className="bg-black/60 p-3 rounded-xl border border-neutral-900">
                              <span className="text-[8px] text-neutral-500 uppercase tracking-widest block mb-1">Gross Yield rate</span>
                              <span className="text-emerald-400 font-bold">${(hourlyRate / 60).toFixed(4)} / min</span>
                            </div>
                            <div className="bg-black/60 p-3 rounded-xl border border-neutral-900">
                              <span className="text-[8px] text-neutral-500 uppercase tracking-widest block mb-1">Net Yield rate</span>
                              <span className="text-indigo-400 font-bold">${((hourlyRate * (1 - taxRate / 100)) / 60).toFixed(4)} / min</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-10">
                        {/* Interactive Reset / Import Card */}
                        <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-[2.5rem] space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Predefined Valuation Goals</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            These goals are converted to actual hours and minutes of labor on your main dashboard to help you maintain strict capital consciousness.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {goals.map(g => (
                              <span key={g.id} className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2">
                                {g.name} (${g.cost})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-emerald-900/5 border border-emerald-500/10 p-10 rounded-[3rem] space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                              <ShieldCheck size={24} className="text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black uppercase text-emerald-400 italic tracking-[0.2em]">Hourly Protocol Sovereign Control</h4>
                              <span className="text-[9px] font-mono text-neutral-600 block uppercase tracking-widest">Secure offline isolation</span>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                            Your hourly workflow constants and accumulated metrics are safely structured inside your browser buffer. No external servers or telemetry systems can track your labor yield.
                          </p>
                          <button 
                            onClick={() => {
                              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ stats, hourlyRate, taxRate, completedHoursThisMonth, dailyHoursTarget, targetMonthlyEarnings, goals }));
                              const downloadAnchorNode = document.createElement('a');
                              downloadAnchorNode.setAttribute("href", dataStr);
                              downloadAnchorNode.setAttribute("download", `${stats.companyName}_hourly_sovereign_backup.json`);
                              document.body.appendChild(downloadAnchorNode);
                              downloadAnchorNode.click();
                              downloadAnchorNode.remove();
                            }}
                            className="w-full bg-neutral-800 hover:bg-white hover:text-black hover:border-white text-white font-black uppercase tracking-widest py-5 rounded-2xl text-xs transition-all border border-neutral-700 shadow-xl"
                          >
                            Initiate External Export
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-800/60 flex justify-center">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                    }}
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-3 border border-blue-400/20"
                  >
                    <CheckCircle2 size={16} /> Save Settings & Go to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>

          )}
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#050505]/90 backdrop-blur-2xl border-t border-neutral-800 flex justify-around items-center p-3 pb-8 shadow-[0_-10px_50px_rgba(0,0,0,1)]">
        <NavButton icon={<Activity />} label="Dash" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={<Target />} label="Funnels" active={activeTab === 'funnels'} onClick={() => setActiveTab('funnels')} />
        <NavButton icon={<Rocket />} label="Growth" active={activeTab === 'growth'} onClick={() => setActiveTab('growth')} />
        <NavButton icon={<Settings />} label="Nucleus" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* FOOTER - ONLY SHOWN ON DESKTOP OR IN SETTINGS */}
      <footer className="hidden md:flex mt-auto py-16 text-center border-t border-neutral-900 flex-col items-center gap-8 bg-neutral-950/20">
        <div className="flex justify-center gap-16 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
          <FooterIcon icon={<Bot />} label="Sovereign AI" color="blue" />
          <FooterIcon icon={<PieChart />} label="Analytics" color="pink" />
          <FooterIcon icon={<Briefcase />} label="Enterprise" color="amber" />
          <FooterIcon icon={<ShieldCheck />} label="Secure" color="emerald" />
        </div>
        <p className="text-neutral-800 text-[9px] font-mono uppercase tracking-[1.2em] font-black">
          {stats.companyName} // STRATEGIC COMMAND INTERFACE // ALPHA PROTOCOL v1.2
        </p>
      </footer>
    </div>
  );
}
