
import React, { useState } from 'react';
import { SovereignState, ResearchLog } from '../types';
import { runSovereignResearch, generateAudioBriefing, getStoredAIConfig } from '../services/geminiService';
import { AIEngineSettings } from './AIEngineSettings';
import { Loader2, Zap, Play, Volume2, Globe, Search, Sparkles, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ResearchAgent: React.FC = () => {
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [state, setState] = useState<SovereignState>({
    currentGoal: '',
    status: 'idle',
    logs: []
  });

  const aiConfig = getStoredAIConfig();

  const handleRunResearch = async () => {
    if (!state.currentGoal) return;
    
    setState(prev => ({ ...prev, status: 'researching' }));
    
    try {
      const newLog = await runSovereignResearch(state.currentGoal);
      setState(prev => ({
        ...prev,
        status: 'idle',
        logs: [newLog, ...prev.logs]
      }));
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, status: 'idle' }));
    }
  };

  const playBriefing = async (text: string) => {
    const base64Audio = await generateAudioBriefing(text);
    if (!base64Audio) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const bytes = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-6 md:p-10 h-full flex flex-col shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
               <Zap className="text-blue-500 w-5 h-5" />
             </div>
             <h2 className="text-2xl font-black uppercase italic tracking-tighter">Growth <span className="text-blue-500">Intelligence</span></h2>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.3em] mt-2">Autonomous Market Reconnaissance protocol</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAiSettings(!showAiSettings)}
            className="flex items-center gap-2 bg-black/60 hover:bg-neutral-800 px-3.5 py-2 rounded-xl border border-neutral-800 text-neutral-300 font-mono text-[10px] uppercase font-bold transition-all"
          >
            <Cpu size={14} className="text-blue-400" />
            <span>AI: <strong className="text-white">{aiConfig.provider}</strong> ({aiConfig.model})</span>
            {showAiSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-neutral-800">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Open Model Engine</span>
          </div>
        </div>
      </div>

      {showAiSettings && (
        <div className="mb-8 relative z-20">
          <AIEngineSettings />
        </div>
      )}

      <div className="space-y-6 flex-grow overflow-hidden flex flex-col relative z-10">
        <div className="flex gap-4 bg-black p-2 rounded-2xl border border-neutral-800 shadow-xl">
          <input 
            type="text" 
            placeholder="Define autonomous vector (e.g. 'Target high LTV real-estate agencies')..."
            className="flex-grow bg-transparent px-4 py-3 text-sm font-medium text-neutral-200 focus:outline-none placeholder:text-neutral-700"
            value={state.currentGoal}
            onChange={(e) => setState(prev => ({ ...prev, currentGoal: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleRunResearch()}
          />
          <button 
            onClick={handleRunResearch}
            disabled={state.status !== 'idle' || !state.currentGoal}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-900 disabled:text-neutral-700 text-white px-6 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {state.status === 'researching' ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Scanning
              </>
            ) : (
              <>
                <Search size={16} />
                Deploy
              </>
            )}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {state.logs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-neutral-700 text-center gap-4 py-12"
              >
                <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-neutral-800 flex items-center justify-center">
                  <Globe size={24} className="opacity-20" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-[0.2em] italic">Awaiting Calibration</p>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-800">Operational readiness at 100%</p>
                </div>
              </motion.div>
            ) : (
              state.logs.map((log, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 p-6 rounded-[2rem] border border-neutral-800 space-y-4 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-500/20">
                      <span className="text-[10px] uppercase tracking-widest text-blue-500 font-black italic">{log.action}</span>
                    </div>
                    <span className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest">{log.timestamp}</span>
                  </div>
                  
                  <p className="text-neutral-300 leading-relaxed font-medium">
                    {log.finding}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {log.sources.slice(0, 4).map((s, si) => (
                      <a 
                        key={si} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all"
                      >
                        <div className="w-6 h-6 rounded bg-black flex items-center justify-center border border-neutral-800">
                          <Globe size={10} className="text-neutral-500" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 truncate uppercase tracking-widest">
                          {s.title || 'Data Source'}
                        </span>
                      </a>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                    <button 
                      onClick={() => playBriefing(log.finding)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Volume2 size={14} />
                      Synthesize Briefing
                    </button>
                    <div className="h-1 w-12 bg-neutral-900 rounded-full"></div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
