# 🤖 AI Model Configuration Guide (GitHub Open Source Setup)

This application features a **Universal Open Model AI Engine** that allows you to easily run or swap **any free, open-source, or custom AI model** (Google Gemini, Groq, OpenRouter, Ollama local LLM, DeepSeek, Llama 3, Qwen, Mistral, etc.) without vendor lock-in!

---

## 🚀 Quick Setup (In-App Settings)

You can configure your preferred AI provider directly inside the application UI:

1. Open the app and navigate to **Settings** (or click **AI: Provider** on the Growth Intelligence screen).
2. Choose your provider:
   - **Google Gemini (Free Tier)**: High-speed multimodal models (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).
   - **Groq Cloud (100% Free Rate Limits)**: Ultra-fast LPU inference (`llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`, `gemma2-9b-it`).
   - **OpenRouter (Free Community Models)**: Access open-source free models (`google/gemini-2.0-flash-lite-preview-02-05:free`, `meta-llama/llama-3.3-70b-instruct:free`).
   - **Ollama / Local LLM (100% Offline & Free)**: Run models locally on your hardware without needing an internet connection or API key (`llama3.3`, `qwen2.5`, `deepseek-r1:7b`).
   - **Custom OpenAI-Compatible API**: Connect to any private proxy, vLLM, LM Studio, or custom endpoint.
3. Enter your API Key or custom endpoint URL.
4. Click **Test AI Connection** to verify connection and measure round-trip latency!

---

## 🛠️ Environment Variables Setup (`.env`)

For GitHub deployments or server environment configuration, copy `.env.example` to `.env`:

```env
# AI Provider ('gemini' | 'groq' | 'openrouter' | 'ollama' | 'custom')
VITE_AI_PROVIDER=gemini

# Default Model Selection
VITE_AI_MODEL=gemini-2.5-flash

# Custom Endpoint Base URL (for Ollama, Groq, OpenRouter, LM Studio, etc.)
VITE_AI_BASE_URL=https://api.groq.com/openai/v1

# Primary API Key
API_KEY=your_api_key_here
```

---

## 🔑 Where to Get Free API Keys

- **Google Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (Free Tier)
- **Groq Cloud**: [console.groq.com/keys](https://console.groq.com/keys) (Free Tier)
- **OpenRouter**: [openrouter.ai/keys](https://openrouter.ai/keys) (Free Models)
- **Ollama**: [ollama.com](https://ollama.com) (Run locally on your Mac/PC)

---

## 💡 Built-in Fallback Intelligence

If no API key is provided, the application includes a **smart local fallback engine** that generates simulated executive research and financial insights so the app works seamlessly out of the box for anyone trying the project on GitHub!
