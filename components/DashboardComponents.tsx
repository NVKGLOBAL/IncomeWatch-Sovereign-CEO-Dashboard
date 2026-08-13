import React from 'react';
import { motion } from 'motion/react';
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
  Bar,
  Legend
} from 'recharts';
import { 
  Zap, 
  Gem,
  Activity,
  ChevronRight,
  ShieldCheck,
  Target,
  Clock,
  Users,
  CheckCircle2,
  PieChart as PieIcon,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { FinancialStats } from '../types';

export type ViewMode = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export function OmniChart({ chartData, viewMode, setViewMode, stats }: { chartData: any[], viewMode: ViewMode, setViewMode: (v: ViewMode) => void, stats: FinancialStats }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-10 rounded-[3rem] space-y-8 shadow-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Omni-Timeflow Projection</h3>
            <span className="text-[7px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black tracking-[0.2em] uppercase">Verified Math</span>
          </div>
          <p className="text-[9px] text-neutral-600 mt-2 font-mono uppercase tracking-widest leading-relaxed">Dynamic Exponential Model // BIAS: {stats.compoundingRate}% MoM Basis</p>
        </div>
        <div className="flex bg-black p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto w-full md:w-auto scrollbar-hide shadow-xl">
           {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as ViewMode[]).map((mode) => (
             <button 
              key={mode}
              onClick={() => setViewMode(mode)} 
              className={`text-[8.5px] font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all whitespace-nowrap ${viewMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-neutral-600 hover:text-neutral-400'}`}
             >
               {mode}
             </button>
           ))}
        </div>
      </div>
      <div className="h-[280px] md:h-[450px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#171717" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#404040" 
              axisLine={false} 
              tickLine={false} 
              fontSize={9} 
              fontWeight="bold"
              interval={viewMode === 'daily' ? 6 : 0}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #171717', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', padding: '16px' }}
              itemStyle={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
              labelStyle={{ color: '#525252', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}
              cursor={{ stroke: '#262626', strokeWidth: 2 }}
              formatter={(v: number, name: string) => [
                `$${v.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 
                name === 'actual' ? 'Asset Velocity' : 'Strategic Pot'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              name="actual"
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
            <Area 
              type="monotone" 
              dataKey="potential" 
              name="potential"
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="10 6"
              fillOpacity={1} 
              fill="url(#colorPotential)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-10 pt-4 border-t border-neutral-800/50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">Asset Velocity</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">Strategic potential</span>
        </div>
      </div>
    </div>
  );
}

export function StrategicYield({ calculated }: { calculated: any }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl relative group">
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-8 flex items-center gap-3 italic">
         <Zap size={14} className="text-amber-500 group-hover:scale-125 transition-transform" />
         Yield Forecast
       </h3>
       <div className="space-y-6">
          <QuarterItem label="Q1 STRATEGIC" value={calculated.q1} color="text-blue-400" />
          <QuarterItem label="Q2 GROWTH" value={calculated.q2} color="text-indigo-400" />
          <QuarterItem label="Q3 EXPANSION" value={calculated.q3} color="text-emerald-400" />
          <QuarterItem label="Q4 PEAK" value={calculated.q4} color="text-emerald-500" />
       </div>
    </div>
  );
}

export function LegacyWealth({ calculated }: { calculated: any }) {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
        <Gem size={150} />
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-3 italic">
         <Gem size={14} className="text-blue-500 group-hover:rotate-12 transition-transform" />
         Wealth Horizon
      </h3>
      
      <div className="space-y-6">
         <LegacyCard label="12 Month Target" value={calculated.yearOneTotal} sub="Operational" />
         <LegacyCard label="5 Year Assets" value={calculated.fiveYearWealth} sub="Compounded" color="text-emerald-400" />
         <LegacyCard label="10 Year Legacy" value={calculated.tenYearWealth} sub="Sovereign" color="text-blue-400" />
      </div>
    </div>
  );
}

export function RatioCard({ label, value, suffix = "", prefix = "", subtext }: { label: string, value: number, suffix?: string, prefix?: string, subtext: string }) {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl group hover:border-blue-500/20 transition-all shadow-sm">
      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 block mb-1">{label}</span>
      <div className="text-2xl font-mono font-black text-white mb-1">
        {prefix}{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}{suffix}
      </div>
      <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-tighter">{subtext}</span>
    </div>
  );
}

export function FunnelStep({ icon, label, value, color, width, highlight }: { icon: any, label: string, value: number, color: string, width: string, highlight?: boolean }) {
  return (
    <div className="space-y-1 group">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1 px-1">
        <div className="flex items-center gap-2 text-neutral-500 group-hover:text-neutral-300 transition-colors">
          {icon}
          {label}
        </div>
        <span className={`${highlight ? 'text-emerald-400 font-mono text-xs' : 'text-neutral-600'}`}>{value}</span>
      </div>
      <div className={`h-4 bg-black rounded-full border border-neutral-800 p-[2px] ${width} transition-all duration-700`}>
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-sm`} />
      </div>
    </div>
  );
}

export function QuarterItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex justify-between items-center group">
       <div className="flex items-center gap-3">
          <ChevronRight size={14} className="text-neutral-800 group-hover:text-blue-500 transition-colors" />
          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest group-hover:text-neutral-400 transition-colors">{label}</span>
       </div>
       <span className={`text-xl font-mono font-black ${color} tabular-nums`}>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
    </div>
  );
}

export function LegacyCard({ label, value, sub, color = "text-white" }: { label: string, value: number, sub: string, color?: string }) {
  return (
    <div className="group border-b border-neutral-900 pb-5 last:border-0 hover:border-neutral-800 transition-all">
       <div className="flex justify-between items-end">
          <div className="space-y-1">
             <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] block">{label}</span>
             <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-widest block">{sub}</span>
          </div>
          <span className={`text-3xl font-mono font-black ${color} group-hover:scale-110 transition-transform origin-right tabular-nums`}>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
       </div>
    </div>
  );
}

export function SettingsInput({ label, value, type, color = "text-white", onChange }: { label: string, value: any, type: string, color?: string, onChange: (v: any) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className={`w-full bg-black border border-neutral-800 rounded-2xl px-5 py-4 font-mono ${color} focus:outline-none focus:border-blue-500 transition-all shadow-inner`}
      />
    </div>
  );
}

export function AdviceCard({ title, value, status, description }: { title: string, value: string, status: 'error' | 'warning' | 'success' | 'info', description: string }) {
  const statusColors = {
    error: 'text-red-500 bg-red-500/10 border-red-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    info: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className="bg-black/40 border border-neutral-800 p-6 rounded-[2rem] space-y-4 hover:border-neutral-700 transition-all group">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{title}</h4>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${statusColors[status]}`}>
          {value}
        </div>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed font-medium italic">
        "{description}"
      </p>
    </div>
  );
}

export function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-500 scale-110' : 'text-neutral-600'}`}
    >
      <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 22 })}
      </div>
      <span className="text-[7.5px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

export function FooterIcon({ icon, label, color }: { icon: any, label: string, color: string }) {
  const colorMap: any = {
    blue: 'text-blue-500',
    pink: 'text-pink-500',
    amber: 'text-amber-500',
    emerald: 'text-emerald-500'
  };
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
       <div className={`p-4 bg-neutral-900 border border-neutral-800 rounded-2xl group-hover:scale-110 group-hover:border-neutral-700 transition-all ${colorMap[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
       </div>
       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600 group-hover:text-neutral-400">{label}</span>
    </div>
  );
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'];

export function RevenueDistributionChart({ stats }: { stats: FinancialStats }) {
  const data = stats.revenueStreams.map((s, idx) => {
    const monthlyValue = s.type === 'mrr' ? s.value * s.count : (s.value * s.count) / 12;
    return {
      name: s.name,
      value: monthlyValue,
      color: PIE_COLORS[idx % PIE_COLORS.length]
    };
  }).filter(d => d.value > 0);

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
            <PieIcon size={18} className="text-blue-500" />
            Revenue Stream <span className="text-blue-500">Allocation</span>
          </h3>
          <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest mt-1">
            Portfolio Diversification & Asset Concentration
          </p>
        </div>
        <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length > 0 ? data : [{ name: 'No Streams', value: 1, color: '#262626' }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {(data.length > 0 ? data : [{ name: 'No Streams', value: 1, color: '#262626' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '16px' }}
                formatter={(val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {data.map((item, idx) => {
            const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
            return (
              <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-neutral-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-bold text-white uppercase">{item.name}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-black block">${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="text-[9px] text-neutral-500 block">{pct}% of total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OperationalLeakChart({ stats }: { stats: FinancialStats }) {
  const totalRevenue = stats.revenueStreams.reduce((acc, s) => {
    return acc + (s.type === 'mrr' ? s.value * s.count : (s.value * s.count) / 12);
  }, 0);

  const totalExpenses = stats.expenses.reduce((acc, e) => acc + e.amount, 0);
  const netMargin = totalRevenue - totalExpenses;

  const barData = [
    { name: 'Gross Yield', amount: totalRevenue, fill: '#10b981' },
    { name: 'Op Leaks', amount: totalExpenses, fill: '#ef4444' },
    { name: 'Net Margin', amount: Math.max(netMargin, 0), fill: '#3b82f6' }
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
            <TrendingDown size={18} className="text-red-500" />
            Capital Retention <span className="text-red-500">& Leaks</span>
          </h3>
          <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest mt-1">
            Monthly Inflow vs Operational Expense Retention
          </p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono uppercase text-neutral-500 block">Margin Efficiency</span>
          <span className="text-xs font-mono font-black text-indigo-400">
            {totalRevenue > 0 ? ((netMargin / totalRevenue) * 100).toFixed(0) : 0}% Net
          </span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" horizontal={false} />
            <XAxis type="number" stroke="#404040" fontSize={9} tickFormatter={v => `$${v}`} />
            <YAxis dataKey="name" type="category" stroke="#a3a3a3" fontSize={10} fontWeight="bold" width={90} />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '16px' }}
              formatter={(val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
            <Bar dataKey="amount" radius={[0, 12, 12, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
