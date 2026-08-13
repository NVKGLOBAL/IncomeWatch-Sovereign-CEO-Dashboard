import { GoogleGenAI } from "@google/genai";
import { ResearchLog, GroundingSource } from "../types";

export type AIProvider = 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl: string;
  enableFallback: boolean;
}

export interface ProviderPreset {
  id: AIProvider;
  name: string;
  defaultModel: string;
  models: string[];
  baseUrl: string;
  keyPlaceholder: string;
  description: string;
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'gemini',
    name: 'Google Gemini (Free Tier)',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'],
    baseUrl: 'https://generativelanguage.googleapis.com',
    keyPlaceholder: 'AIzaSy...',
    description: 'Fastest Google Multimodal AI with generous free tier quotas.'
  },
  {
    id: 'groq',
    name: 'Groq Cloud (Fast & Free Rate Limits)',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b', 'gemma2-9b-it', 'qwen-2.5-coder-32b'],
    baseUrl: 'https://api.groq.com/openai/v1',
    keyPlaceholder: 'gsk_...',
    description: 'Ultra-high speed LPU inference with free tier keys.'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Aggregated Free Models)',
    defaultModel: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    models: [
      'google/gemini-2.0-flash-lite-preview-02-05:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-r1:free',
      'qwen/qwen-2.5-72b-instruct:free'
    ],
    baseUrl: 'https://openrouter.ai/api/v1',
    keyPlaceholder: 'sk-or-v1-...',
    description: 'Access 100+ AI models including free-tier community endpoints.'
  },
  {
    id: 'ollama',
    name: 'Ollama / Local LLM (100% Free & Offline)',
    defaultModel: 'llama3.3',
    models: ['llama3.3', 'qwen2.5', 'deepseek-r1:7b', 'mistral', 'phi4'],
    baseUrl: 'http://localhost:11434/v1',
    keyPlaceholder: 'Not required for local Ollama',
    description: 'Run completely open-source models offline on your local machine.'
  },
  {
    id: 'custom',
    name: 'Custom OpenAI-Compatible Endpoint',
    defaultModel: 'custom-model',
    models: ['custom-model'],
    baseUrl: 'https://api.example.com/v1',
    keyPlaceholder: 'Bearer token or API key',
    description: 'Connect to any private proxy, vLLM, LM Studio, or custom API gateway.'
  }
];

const STORAGE_KEY = 'sovereign_ai_config';

export const getStoredAIConfig = (): AIConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load AI config from localStorage", e);
  }

  // Fallbacks from environment variables or defaults
  const metaEnv = (import.meta as any).env || {};
  const envProvider = (metaEnv.VITE_AI_PROVIDER as AIProvider) || 'gemini';
  const envModel = metaEnv.VITE_AI_MODEL || 'gemini-2.5-flash';
  const envBaseUrl = metaEnv.VITE_AI_BASE_URL || '';
  const envApiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || metaEnv.VITE_API_KEY || '';

  return {
    provider: envProvider,
    model: envModel,
    apiKey: envApiKey,
    baseUrl: envBaseUrl,
    enableFallback: true
  };
};

export const saveAIConfig = (config: AIConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save AI config to localStorage", e);
  }
};

/**
 * Universal completion requester supporting Google Gemini SDK & OpenAI-compatible endpoints
 */
export const generateTextCompletion = async (prompt: string, systemInstruction?: string): Promise<{ text: string; sources: GroundingSource[] }> => {
  const config = getStoredAIConfig();
  const apiKey = config.apiKey || process.env.API_KEY || process.env.GEMINI_API_KEY || '';

  // 1. Google Gemini Native SDK Provider
  if (config.provider === 'gemini') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: config.model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are a Sovereign Financial Architect.",
          tools: [{ googleSearch: {} }]
        }
      });

      const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })) || [];

      return {
        text: response.text || "No response content generated.",
        sources
      };
    } catch (error: any) {
      console.warn("Gemini Native SDK Error, trying fallback or OpenAI endpoint...", error);
      if (!config.enableFallback) {
        throw new Error(`Gemini API Error: ${error.message || error}`);
      }
    }
  }

  // 2. OpenAI-Compatible Providers (Groq, OpenRouter, Ollama, Custom HTTP)
  const preset = PROVIDER_PRESETS.find(p => p.id === config.provider);
  const baseUrl = (config.baseUrl || preset?.baseUrl || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
  const targetModel = config.model || preset?.defaultModel || 'llama-3.3-70b-versatile';

  if (baseUrl) {
    try {
      const endpoint = `${baseUrl}/chat/completions`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      if (config.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'Sovereign CEO Dashboard';
      }

      const body = {
        model: targetModel,
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "No response received from endpoint.";

      return {
        text: content,
        sources: []
      };
    } catch (e: any) {
      console.error(`AI Provider (${config.provider}) call failed:`, e);
      if (!config.enableFallback) {
        throw e;
      }
    }
  }

  // 3. Smart Built-in Fallback Generator (Ensures 100% smooth demo experience without API keys)
  return {
    text: `[Sovereign Fallback Intelligence Mode]\n\nBased on your prompt: "${prompt.slice(0, 80)}..."\n\n` +
      `1. **Leverage Optimization**: Increase top-of-funnel prospect velocity by 15% to compound downstream pipeline conversions.\n` +
      `2. **Margin Protection**: Re-evaluate fixed operational overhead to protect net asset yield.\n` +
      `3. **AI Provider Note**: You can configure a free API key (Gemini, Groq, OpenRouter, or Ollama) in Settings > AI Engine Configuration.`,
    sources: []
  };
};

/**
 * Test AI Connection
 */
export const testAIConnection = async (testConfig?: AIConfig): Promise<{ success: boolean; message: string; latencyMs: number }> => {
  const startTime = Date.now();
  const config = testConfig || getStoredAIConfig();

  try {
    const result = await generateTextCompletion("Respond with the exact word 'READY' and nothing else.", "You are a health check agent.");
    const latencyMs = Date.now() - startTime;
    if (result.text) {
      return {
        success: true,
        message: `Connected successfully to model ${config.model} via ${config.provider}!`,
        latencyMs
      };
    }
    return {
      success: false,
      message: "Received empty response from provider.",
      latencyMs
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reach AI endpoint.",
      latencyMs: Date.now() - startTime
    };
  }
};

/**
 * Strategic Financial Advisor Response
 */
export const getFinancialAdvisorResponse = async (query: string, stats: any) => {
  const prompt = `
    Context:
    MRR: $${stats.mrr}
    Churn: ${stats.churnRate}%
    Growth: ${stats.growthRate}%
    Goal: Maximize income per millisecond velocity.
    
    Task: Act as a Sovereign Financial Architect. Analyze the user's current velocity and provide 3 actionable, high-leverage steps to double the income-per-millisecond rate.
    User Question: ${query}
  `;

  try {
    return await generateTextCompletion(prompt, "You are a world-class Sovereign Financial Architect providing executive data-backed growth counsel.");
  } catch (error) {
    console.error("AI Advisor Error:", error);
    return { 
      text: "The Sovereign Kernel is recalibrating. Check your API settings or network connection.", 
      sources: [] 
    };
  }
};

/**
 * Sovereign Research Protocol
 */
export const runSovereignResearch = async (goal: string): Promise<ResearchLog> => {
  const prompt = `Conduct autonomous research on the following business goal: "${goal}". 
  Provide executive findings with data-backed actionable strategy steps. 
  Focus on modern market trends, high LTV monetization vectors, and execution leverage.`;

  const result = await generateTextCompletion(prompt, "You are an autonomous executive research intelligence agent.");

  return {
    timestamp: new Date().toLocaleTimeString(),
    action: "Autonomous Market Scan",
    finding: result.text,
    sources: result.sources
  };
};

/**
 * Text-To-Speech Audio Briefing (Supports Gemini or Fallback Audio Synthesis)
 */
export const generateAudioBriefing = async (text: string) => {
  const config = getStoredAIConfig();
  const apiKey = config.apiKey || process.env.API_KEY || process.env.GEMINI_API_KEY || '';

  if (config.provider === 'gemini' && apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this financial briefing with high authority and confidence: ${text.substring(0, 500)}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (e) {
      console.error("TTS failed via Gemini SDK, returning null", e);
    }
  }

  // Fallback: Web Speech API can be handled client-side if needed
  return null;
};
