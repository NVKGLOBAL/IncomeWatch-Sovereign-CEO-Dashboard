import React, { useState, useEffect } from 'react';
import { 
  AIConfig, 
  AIProvider, 
  PROVIDER_PRESETS, 
  getStoredAIConfig, 
  saveAIConfig, 
  testAIConnection 
} from '../services/geminiService';
import { 
  Cpu, 
  Key, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Eye, 
  EyeOff, 
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AIEngineSettings: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>(getStoredAIConfig);
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string; latency?: number }>({
    status: 'idle',
    message: ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedPreset = PROVIDER_PRESETS.find(p => p.id === config.provider) || PROVIDER_PRESETS[0];

  const handleProviderChange = (providerId: AIProvider) => {
    const preset = PROVIDER_PRESETS.find(p => p.id === providerId) || PROVIDER_PRESETS[0];
    const newConfig: AIConfig = {
      ...config,
      provider: providerId,
      model: preset.defaultModel,
      baseUrl: preset.baseUrl
    };
    setConfig(newConfig);
    saveAIConfig(newConfig);
    setTestState({ status: 'idle', message: '' });
  };

  const handleSave = () => {
    saveAIConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTest = async () => {
    setTestState({ status: 'testing', message: 'Pinging model endpoint...' });
    saveAIConfig(config);
    
    const res = await testAIConnection(config);
    if (res.success) {
      setTestState({
        status: 'success',
        message: res.message,
        latency: res.latencyMs
      });
    } else {
      setTestState({
        status: 'error',
        message: res.message,
        latency: res.latencyMs
      });
    }
  };

  const getKeyHelpLink = () => {
    switch (config.provider) {
      case 'gemini': return { url: 'https://aistudio.google.com/app/apikey', label: 'Get Free Gemini Key' };
      case 'groq': return { url: 'https://console.groq.com/keys', label: 'Get Free Groq Key' };
      case 'openrouter': return { url: 'https://openrouter.ai/keys', label: 'Get Free OpenRouter Key' };
      case 'ollama': return { url: 'https://ollama.com', label: 'Download Ollama (Local)' };
      default: return null;
    }
  };

  const keyHelp = getKeyHelpLink();

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              AI Engine <span className="text-blue-500">& Open Model Hub</span>
            </h3>
            <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-[0.3em] mt-1">
              Swap any free, open-source, or custom AI provider
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck size={12} /> GitHub Ready Architecture
          </span>
        </div>
      </div>

      {/* Provider Selector Cards */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400 block">
          1. Select Model Provider
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROVIDER_PRESETS.map((preset) => {
            const isSelected = config.provider === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleProviderChange(preset.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-black/40 border-neutral-800 hover:border-neutral-700 hover:bg-black/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                      {preset.name}
                    </span>
                    {isSelected && <Check size={14} className="text-blue-400" />}
                  </div>
                  <p className="text-[9px] text-neutral-500 font-medium leading-relaxed">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-800/60 flex justify-between items-center text-[8px] font-mono text-neutral-600">
                  <span>Default:</span>
                  <span className="text-neutral-400 font-bold">{preset.defaultModel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model & API Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/50 p-6 rounded-[2rem] border border-neutral-800">
        
        {/* Model Name Input / Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
            <Zap size={12} className="text-amber-400" /> Active Model Name
          </label>
          
          <div className="space-y-2">
            <select
              className="w-full bg-neutral-900 text-xs font-mono font-bold rounded-xl px-4 py-3 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
              value={selectedPreset.models.includes(config.model) ? config.model : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  const updated = { ...config, model: e.target.value };
                  setConfig(updated);
                  saveAIConfig(updated);
                }
              }}
            >
              {selectedPreset.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value="custom">-- Type Custom Model ID --</option>
            </select>

            {(!selectedPreset.models.includes(config.model) || config.provider === 'custom' || config.provider === 'ollama') && (
              <input
                type="text"
                placeholder="e.g. qwen2.5-coder-72b-instruct, mistral-large, etc."
                className="w-full bg-neutral-900 text-xs font-mono rounded-xl px-4 py-2.5 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-blue-500"
                value={config.model}
                onChange={(e) => {
                  const updated = { ...config, model: e.target.value };
                  setConfig(updated);
                  saveAIConfig(updated);
                }}
              />
            )}
          </div>
          <p className="text-[8px] text-neutral-600 font-mono">
            Specify any model string recognized by your provider endpoint.
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Key size={12} className="text-emerald-400" /> API Access Key
            </label>
            {keyHelp && (
              <a
                href={keyHelp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-widest"
              >
                {keyHelp.label} <ExternalLink size={10} />
              </a>
            )}
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder={selectedPreset.keyPlaceholder}
              className="w-full bg-neutral-900 text-xs font-mono rounded-xl px-4 py-3 pr-10 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
              value={config.apiKey}
              onChange={(e) => {
                const updated = { ...config, apiKey: e.target.value };
                setConfig(updated);
                saveAIConfig(updated);
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-3.5 text-neutral-500 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-[8px] text-neutral-600 font-mono">
            {config.provider === 'ollama' ? 'Local Ollama runs without an API key.' : 'Keys are stored locally in your browser session.'}
          </p>
        </div>

        {/* Base URL Input */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
            <Globe size={12} className="text-blue-400" /> API Base Endpoint URL
          </label>
          <input
            type="text"
            placeholder={selectedPreset.baseUrl}
            className="w-full bg-neutral-900 text-xs font-mono rounded-xl px-4 py-3 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-blue-500"
            value={config.baseUrl}
            onChange={(e) => {
              const updated = { ...config, baseUrl: e.target.value };
              setConfig(updated);
              saveAIConfig(updated);
            }}
          />
          <p className="text-[8px] text-neutral-600 font-mono">
            Default endpoint for {selectedPreset.name}: <span className="text-neutral-400">{selectedPreset.baseUrl}</span>
          </p>
        </div>
      </div>

      {/* Action Footer & Test Connection */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={testState.status === 'testing'}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-neutral-700 transition-all shadow-md"
          >
            {testState.status === 'testing' ? (
              <>
                <RefreshCw size={14} className="animate-spin text-blue-400" /> Testing...
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-blue-400" /> Test AI Connection
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
          >
            {savedSuccess ? 'Saved!' : 'Save AI Config'}
          </button>
        </div>

        {/* Test Result Feedback */}
        {testState.status !== 'idle' && (
          <div className={`px-4 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            testState.status === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : testState.status === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-neutral-800 border-neutral-700 text-neutral-300'
          }`}>
            {testState.status === 'success' && <CheckCircle2 size={14} />}
            {testState.status === 'error' && <AlertCircle size={14} />}
            <span>{testState.message}</span>
            {testState.latency && <span className="opacity-75">({testState.latency}ms)</span>}
          </div>
        )}
      </div>
    </div>
  );
};
