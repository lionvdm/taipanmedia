import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, 
  CreditCard, Users, TrendingUp, PieChart, Coins, RefreshCcw, 
  ShoppingBag, Check, FileText, BarChart3, BellRing, X, 
  Calculator, Sparkles, Bot, BrainCircuit, MessageSquare, 
  Send, Loader2, ArrowDownRight, Terminal, Cpu, Palette, 
  Zap, ShieldCheck, Play, ArrowUpRight, Percent, AlertTriangle,
  Scale, ArrowLeft, ShoppingCart, Rocket, Quote, Eye
} from 'lucide-react';

// --- CONFIG & UTILS ---
const getEnvApiKey = () => {
  try {
    return process.env.REACT_APP_OPENAI_API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getEnvApiKey();

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(Math.floor(val)) + ' ₸';

const callOpenAIAPI = async (prompt, history = []) => {
  try {
    if (!apiKey) {
      await new Promise(r => setTimeout(r, 2500));
      return "🤖 [VIPER AI]: Анализ завершен. Жертва обнаружена.\n\n1. **Уязвимость**: Вы теряете 25% клиентов на этапе удержания.\n2. **Яд**: Геймификация впрыснет азарт и поднимет чек на 15%.\n3. **Добыча**: +1.2 млн ₸ чистой прибыли уже в первый месяц.";
    }
    const messages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    messages.unshift({
        role: "system",
        content: "Ты — AI-ассистент Taipan Media. Твой тон: хищный, холодный, расчетливый, как змея. Используй змеиные метафоры (яд, укус, бросок, добыча). Ты эксперт в Telegram Mini Apps. Отвечай кратко, жестко, структурировано."
    });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o", messages: [...messages, {role: 'user', content: prompt}], temperature: 0.7 }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Сбой нейросети.";
  } catch (e) { return "Ошибка соединения."; }
};

// --- VISUAL COMPONENTS ---

const SnakeText = ({ children, className = "" }) => (
  <span className={`font-black italic tracking-tighter ${className}`} style={{
      color: '#4ade80',
      textShadow: '0 0 15px rgba(74, 222, 128, 0.6), 0 0 30px rgba(74, 222, 128, 0.2)',
      filter: 'drop-shadow(0 0 5px rgba(0,0,0,1))'
    }}>{children}</span>
);

const ScalesBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#020202] overflow-hidden">
    {/* Hexagonal Scales Pattern */}
    <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10s-10 4.477-10 10v20c0 5.523 4.477 10 10 10zM12 20c5.523 0 10-4.477 10-10V0H2v10c0 5.523 4.477 10 10 10z' fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '30px 50px'
    }}></div>
    
    {/* Venomous Glow Spots */}
    <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-emerald-900/20 blur-[150px] animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#064e3b] blur-[120px] opacity-30"></div>
    
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]"></div>
  </div>
);

const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "> ПРОБУЖДЕНИЕ ЗМЕИ...", delay: 200 },
      { text: "> ВПРЫСК ЯДА...", delay: 800 },
      { text: "> СИСТЕМА TAIPAN ГОТОВА.", delay: 1500, color: "text-emerald-400 font-bold glow" },
    ];
    let timeouts = [];
    sequence.forEach(({ text, delay, color }, i) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        if (i === sequence.length - 1) setTimeout(onComplete, 800);
      }, delay);
      timeouts.push(t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-end p-10 font-mono text-xs tracking-widest uppercase">
      {lines.map((line, i) => <div key={i} className={`mb-3 ${line.color || "text-emerald-900"}`}>{line.text}</div>)}
      <div className="w-3 h-6 bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]"></div>
    </div>
  );
};

// --- VIEWS ---

const SelectView = ({ setMode }) => (
  <div className="flex flex-col h-screen relative overflow-hidden font-sans bg-black">
    <ScalesBackground />
    <div className="relative z-10 flex-1 flex flex-col p-8 justify-center items-center text-center">
      
      {/* Header */}
      <div className="mb-16 flex flex-col items-center animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-flex items-center gap-3 px-4 py-1 rounded-none border-x border-emerald-500/50 bg-emerald-900/10 mb-8 backdrop-blur-md">
           <Eye size={12} className="text-emerald-500 animate-pulse" />
           <span className="text-emerald-500 text-[10px] font-black tracking-[0.3em] uppercase">Цель захвачена</span>
        </div>
        
        {/* SNAKE SCALE TEXT EFFECT */}
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-6 whitespace-nowrap" 
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4)) contrast(1.3) brightness(1.2)'
            }}>
           TAIPAN
        </h1>

        <p className="text-emerald-500/60 text-xs font-mono tracking-[0.2em] max-w-md uppercase">
            Хищник цифрового рынка
        </p>
      </div>
      
      {/* Cards */}
      <div className="grid gap-6 w-full max-w-md">
        <button 
            onClick={() => setMode('business')} 
            className="group relative overflow-hidden bg-black border border-zinc-800 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.05)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_infinite]"></div>
          <Briefcase className="text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300 mb-4" size={32} />
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">Бизнес</h3>
          <p className="text-zinc-600 text-[10px] mt-2 font-mono uppercase tracking-widest group-hover:text-zinc-400">Масштабирование • Охота</p>
        </button>
        
        <button 
            onClick={() => setMode('dev')} 
            className="group relative overflow-hidden bg-black border border-zinc-800 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.05)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_infinite]"></div>
          <Code className="text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300 mb-4" size={32} />
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">Разработчик</h3>
          <p className="text-zinc-600 text-[10px] mt-2 font-mono uppercase tracking-widest group-hover:text-zinc-400">Код • Эволюция</p>
        </button>
      </div>
    </div>
  </div>
);

// --- NEW DEV VIEW LOGIC ---

// INLINE SVG COMPONENTS
const BitcoinLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#000" stroke="#FFD700" strokeWidth="2" />
    <path fill="#FFD700" d="M44.5 25.8c.8-5.2-3.2-8-8.6-9.8l1.8-7-4.2-1-1.7 6.9c-1.1-.3-2.3-.5-3.4-.8l1.7-6.9-4.3-1-1.8 7.1c-.9-.2-1.8-.4-2.7-.6L19 12l-2.6 6.5s1.4.3 1.4.4c.8.2.9.6.9 1l-2.1 8.5c.1 0 .3.1.5.1-.1 0-.3 0-.4 0l-3 12c-.2.5-.7.6-1.5.4 0 0-1 .4-1 .4l-1.9 4.4 3.6.9c1 .2 2 .5 3 .8l-1.8 7.2 4.3 1 1.8-7.1c1.2.3 2.3.6 3.4.9l-1.8 7.2 4.3 1 1.8-7c7.3 1.4 12.8.8 15.1-5.8 1.9-5.3-1-8.4-4.5-10.4 3.2-.7 5.6-2.9 6.2-7.3zM37.8 40c-2 7.8-15.3 3.6-19.6 2.5l3.5-14c4.3 1.1 18.2 3.2 16.1 11.5zm1.7-16.6c-1.8 7.2-13.1 3.5-16.7 2.6l3.2-12.8c3.7.9 15.5 2.6 13.5 10.2z"/>
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl grayscale hover:grayscale-0 transition-all">
    <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500" />
    <path fill="none" stroke="currentColor" strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" className="text-zinc-500"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-500"/>
  </svg>
);

const TelegramLogo = () => (
  <div className="w-full h-full rounded-full flex items-center justify-center relative group">
      <div className="absolute inset-0 bg-emerald-500 blur-[50px] opacity-20 group-hover:opacity-100 transition-opacity duration-200 animate-pulse"></div>
      <div className="relative z-10 w-full h-full bg-black rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_30px_#10b981]">
        <svg viewBox="0 0 24 24" className="w-[55%] h-[55%] fill-emerald-500 translate-x-[-2px] translate-y-[1px]">
            <path d="M22.2646 2.42743C22.569 2.27532 22.8837 2.47863 22.8021 2.81232L19.9814 16.5135C19.7997 17.4022 18.7381 17.7423 18.0673 17.126L14.155 13.9189L12.0622 15.9329C11.8396 16.1469 11.4787 15.9926 11.4924 15.6841L11.7509 11.2336C11.7766 10.7916 11.9687 10.3752 12.2852 10.076L17.7562 5.24432C18.0253 5.00676 17.697 4.60676 17.3879 4.80917L8.90367 10.1556C8.28335 10.5463 7.50293 10.5189 6.91037 10.2974L3.4563 9.00632C2.79379 8.75883 2.84687 7.80993 3.53569 7.63223L22.2646 2.42743Z"/>
        </svg>
      </div>
  </div>
);

const DevView = ({ setMode }) => {
  const [step, setStep] = useState(0);
  const [fadeState, setFadeState] = useState('in');

  const missedOpportunities = [
    { 
        year: '2009', 
        title: 'Bitcoin', 
        quote: '«Фантики для гиков. Пустышка.»', 
        logo: <BitcoinLogo />,
        isPositive: false
    },
    { 
        year: '2012', 
        title: 'Instagram', 
        quote: '«Фото еды? В этом нет денег.»', 
        logo: <InstagramLogo />,
        isPositive: false
    },
    { 
        year: '2019', 
        title: 'Маркетплейсы', 
        quote: '«Люди хотят щупать. Интернет не для торговли.»', 
        logo: (
            <div className="flex gap-4 w-full h-full justify-center items-center">
                 <ShoppingBag size={60} className="text-zinc-600"/>
            </div>
        ),
        isPositive: false
    },
    { 
        year: '2026', 
        title: 'ТЕЛЕГРАМ', 
        quote: 'Новая экосистема. Твой шанс.', 
        logo: <div className="w-32 h-32 md:w-40 md:h-40 animate-pulse"><TelegramLogo /></div>,
        isPositive: true 
    },
  ];

  useEffect(() => {
    if (step < 4) {
      setFadeState('in');
      const timerVisible = setTimeout(() => setFadeState('visible'), 500); 
      const stayDuration = step === 3 ? 3500 : 3500; 
      const timerOut = setTimeout(() => setFadeState('out'), 500 + stayDuration); 
      const timerNext = setTimeout(() => {
        setStep(prev => prev + 1);
        setFadeState('in');
      }, 500 + stayDuration + 1000); 
      return () => { clearTimeout(timerVisible); clearTimeout(timerOut); clearTimeout(timerNext); };
    }
  }, [step]);

  // --- FINAL SCREEN (STEP 4) ---
  if (step === 4) {
    return (
      <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden relative">
        <ScalesBackground />
        
        <div className="relative z-10 flex flex-col h-full p-6 animate-in zoom-in-95 duration-1000 fade-in">
           {/* Top Nav */}
           <div className="flex justify-between items-center mb-6 md:mb-8">
              <button onClick={() => setMode('select')} className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}>
                  <ArrowLeft size={20} />
              </button>
              <div className="px-4 py-2 border-x border-emerald-500/50 bg-emerald-900/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest backdrop-blur-sm">
                  Протокол активен
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full text-center space-y-8">
              <div className="space-y-6 flex flex-col items-center">
                  <div className="relative inline-block group">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] animate-pulse"></div>
                      <div className="w-24 h-24 mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                          <TelegramLogo />
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                          2026: <br/> <span className="text-emerald-500 drop-shadow-[0_0_20px_#10b981]">TG</span> МАГАЗИН
                      </h1>
                  </div>

                  <div className="space-y-4 flex flex-col items-center">
                      <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest leading-relaxed whitespace-nowrap mx-auto border-b border-zinc-800 pb-4">
                          Сайты — прошлое. Приложения — долго.
                      </p>
                      <div className="bg-black/80 border border-emerald-900/50 p-6 backdrop-blur-md relative overflow-hidden" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 90%, 95% 100%, 0 100%, 0 10%)' }}>
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                           <p className="text-emerald-400 text-sm font-bold uppercase tracking-wide leading-relaxed italic">
                              "Бизнес должен быть там,<br/>где жертва проводит 90% времени"
                          </p>
                      </div>
                  </div>
              </div>

              {/* BUTTONS */}
              <div className="grid gap-4 w-full">
                  <button className="group relative bg-zinc-900/50 border border-zinc-700 hover:border-emerald-500 p-6 text-left transition-all duration-300 active:scale-[0.98]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}>
                      <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xl font-black italic text-white mb-1 group-hover:text-emerald-400 transition-colors">TG Магазины</div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Обучение • Скрипты</p>
                          </div>
                          <ShoppingCart className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={24}/>
                      </div>
                  </button>

                  <button className="group relative bg-zinc-900/50 border border-zinc-700 hover:border-purple-500 p-6 text-left transition-all duration-300 active:scale-[0.98]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}>
                      <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xl font-black italic text-white mb-1 group-hover:text-purple-400 transition-colors">Авторские боты</div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">React • Node.js • AI</p>
                          </div>
                          <Rocket className="text-zinc-600 group-hover:text-purple-500 transition-colors" size={24}/>
                      </div>
                  </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- FADE SCREENS ---
  const current = missedOpportunities[step];
  const isPositive = current.isPositive;
  
  let containerTransition = 'opacity-0 translate-y-4 scale-95 blur-sm'; 
  if (fadeState === 'visible') containerTransition = 'opacity-100 translate-y-0 scale-100 blur-0 duration-[500ms]';
  if (fadeState === 'out') containerTransition = 'opacity-0 scale-110 blur-xl brightness-50 duration-[500ms]';

  // Styles
  const yearColor = isPositive ? 'text-emerald-500 drop-shadow-[0_0_30px_#10b981]' : 'text-zinc-700';
  const quoteBorder = isPositive ? 'border-l-4 border-emerald-500 bg-emerald-950/20' : 'border-l-2 border-red-900/50 bg-red-950/10';
  const footerText = isPositive ? 'Цель захвачена' : 'Цель упущена';
  const footerColor = isPositive ? 'text-emerald-500' : 'text-red-900';

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden items-center justify-center relative p-6">
      <ScalesBackground />
      <div key={step} className={`relative z-10 flex flex-col items-center text-center transition-all ${containerTransition}`}>
        <div className="mb-8">{current.logo}</div>
        <div className="space-y-6 flex flex-col items-center">
            <h2 className={`text-8xl font-black italic tracking-tighter ${yearColor}`}>
                {current.year}
            </h2>
            <div className={`relative p-6 text-left backdrop-blur-md ${quoteBorder} max-w-xs`}>
                <Quote size={20} className={`${isPositive ? 'text-emerald-500' : 'text-zinc-800'} mb-3`} />
                <p className={`${isPositive ? 'text-white' : 'text-zinc-500'} text-lg font-black italic uppercase leading-tight`}>
                    {current.quote}
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <div className={`h-px flex-1 ${isPositive ? 'bg-emerald-500/30' : 'bg-zinc-900'}`}></div>
                    <span className={`text-[9px] uppercase tracking-[0.2em] ${footerColor} font-bold`}>{footerText}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const BusinessView = ({ setMode, bizParams, setBizParams }) => {
  const [analysisState, setAnalysisState] = useState('input');
  const [aiAnalysis, setAiAnalysis] = useState('');

  const traffic = Number(bizParams.users) || 0;
  const currentConvRate = Number(bizParams.currentConversion) || 0;
  const margin = Number(bizParams.margin) || 0;
  const check = Number(bizParams.check) || 0;

  const baseRevenue = traffic * (currentConvRate / 100) * check;
  const baseProfit = baseRevenue * (margin / 100);
  const lostPercent = Math.max(0, 100 - currentConvRate);
  const lostProfit = (traffic * (lostPercent / 100) * check) * (margin / 100);
  const recoveredProfit = lostProfit * 0.20;

  const handleAI = async () => {
    setAnalysisState('loading');
    const res = await callOpenAIAPI(`Трафик: ${traffic}, Чек: ${check}, Конверсия: ${currentConvRate}%, Маржа: ${margin}%, Упускаем: ${lostPercent}%, Можем вернуть: ${recoveredProfit}. Рассчитай эффект.`);
    setAiAnalysis(res);
    setAnalysisState('result');
  };

  if (analysisState === 'loading') {
    return (
        <div className="flex flex-col h-screen bg-black text-white font-sans items-center justify-center relative overflow-hidden p-6">
            <ScalesBackground />
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-pulse">
                <BrainCircuit size={100} className="text-emerald-500 drop-shadow-[0_0_30px_#10b981]" />
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">НЕЙРОСКАН</h2>
                    <p className="text-emerald-500/70 text-xs font-mono uppercase tracking-[0.3em]">Внедрение алгоритмов...</p>
                </div>
            </div>
        </div>
    );
  }

  if (analysisState === 'result') {
      return (
        <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto relative">
            <ScalesBackground />
            <div className="relative z-10 p-6 max-w-lg mx-auto w-full min-h-screen flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setAnalysisState('input')} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Назад</span>
                    </button>
                    <div className="text-emerald-500 border border-emerald-500/30 px-3 py-1 bg-emerald-900/20 text-[10px] font-bold uppercase tracking-widest">
                        Анализ завершен
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="text-center space-y-2">
                         <h2 className="text-5xl font-black italic tracking-tighter text-white">ПЛАН <span className="text-emerald-500">АТАКИ</span></h2>
                    </div>

                    <div className="bg-black/80 border border-emerald-500/30 p-6 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.1)]" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-emerald-400">
                            <div className="whitespace-pre-wrap leading-relaxed font-mono text-xs">
                                {aiAnalysis}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-4 border border-zinc-800 text-center hover:border-emerald-500 transition-colors group">
                            <div className="text-[9px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Возврат</div>
                            <div className="text-xl font-black italic text-emerald-500 group-hover:drop-shadow-[0_0_10px_#10b981]">+{formatCurrency(recoveredProfit)}</div>
                        </div>
                        <div className="bg-zinc-900/50 p-4 border border-zinc-800 text-center hover:border-red-500 transition-colors group">
                            <div className="text-[9px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Убытки</div>
                            <div className="text-xl font-black italic text-red-700 group-hover:text-red-500">{formatCurrency(lostProfit)}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                    <button onClick={() => setAnalysisState('input')} className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-emerald-400 hover:scale-[1.01] transition-all" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}>
                        ПЕРЕЗАПУСТИТЬ
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // --- INPUT VIEW ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto relative">
      <ScalesBackground />
      
      <div className="sticky top-0 z-40 px-6 py-4 bg-black/80 backdrop-blur-xl flex justify-between items-center border-b border-zinc-800">
        <button onClick={() => setMode('select')} className="w-10 h-10 flex items-center justify-center hover:text-emerald-500 transition-colors">
            <ChevronRight className="rotate-180" size={24}/>
        </button>
        <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase animate-pulse">
            Система: Активна
        </span>
        <div className="w-10"></div>
      </div>

      <div className="p-6 relative z-10 pb-32 max-w-lg mx-auto w-full">
        <div className="mb-10 text-center">
            <h2 className="text-5xl font-black italic tracking-tighter mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                ОХОТНИК ЗА <span className="text-emerald-600">ПРИБЫЛЬЮ</span>
            </h2>
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em]">Калькулятор упущенной выгоды</p>
        </div>

        <div className="border border-zinc-800 p-1 relative bg-black/50" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 98%, 95% 100%, 0 100%, 0 2%)' }}>
            <div className="p-6 grid grid-cols-2 gap-8 bg-black">
                {[
                    { label: 'Трафик', icon: Users, val: bizParams.users, set: (v) => setBizParams({...bizParams, users: v}) },
                    { label: 'Конверсия', icon: Percent, val: bizParams.currentConversion, set: (v) => setBizParams({...bizParams, currentConversion: v}) },
                    { label: 'Чек (₸)', icon: CreditCard, val: bizParams.check, set: (v) => setBizParams({...bizParams, check: v}) },
                    { label: 'Маржа (%)', icon: Scale, val: bizParams.margin, set: (v) => setBizParams({...bizParams, margin: v}) },
                ].map((item, i) => (
                    <div key={i} className="space-y-2 flex flex-col items-center text-center group">
                        <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center justify-center gap-2 w-full tracking-widest group-hover:text-emerald-500 transition-colors">
                            <item.icon size={12} /> {item.label}
                        </label>
                        <input 
                            type="number" 
                            value={item.val} 
                            onChange={e => item.set(e.target.value)} 
                            className="w-full bg-black border-b-2 border-zinc-800 py-2 text-white text-xl font-black italic focus:outline-none focus:border-emerald-500 text-center transition-colors placeholder-zinc-800 font-mono"
                            placeholder="0"
                        />
                    </div>
                ))}
            </div>

            <div className="bg-[#050505] p-6 space-y-6 border-t border-zinc-900">
                <div className="text-center">
                    <div className="text-[9px] font-bold text-zinc-600 mb-1 uppercase tracking-[0.2em]">Текущий профит</div>
                    <div className="text-4xl font-black text-white tracking-tighter italic">
                        {formatCurrency(baseProfit)}
                    </div>
                </div>

                <div className="relative bg-red-950/10 border-l-4 border-red-900 p-5">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-widest animate-pulse">
                            <AlertTriangle size={12} /> Внимание
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                            Вы теряете <span className="text-white font-bold">{lostPercent.toFixed(1)}%</span> трафика
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-red-600 tracking-tighter italic opacity-80">
                            {formatCurrency(lostProfit)}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAI} 
                    className="w-full bg-emerald-600 text-black font-black text-xs py-4 uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}
                >
                      Вскрыть потенциал
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Змея проснулась. Задавай вопрос.' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = { sender: 'user', text: input };
    setMessages(p => [...p, msg]);
    setInput('');
    setIsTyping(true);
    const res = await callOpenAIAPI(input, messages);
    setMessages(p => [...p, { sender: 'bot', text: res }]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-10 font-mono">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black">
        <div className="flex items-center gap-2"><Bot size={18} className="text-emerald-500"/><span className="font-bold text-xs uppercase tracking-[0.2em] text-white">Связь Viper</span></div>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 text-xs border ${m.sender === 'user' ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`} style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}>{m.text}</div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-emerald-500/50 pl-2 animate-pulse uppercase tracking-widest">Обработка жертвы...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-black border-t border-zinc-800 flex gap-2">
        <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            placeholder="Команда..." 
            className="flex-1 bg-black border border-zinc-800 px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm text-emerald-500 placeholder-zinc-800 font-mono"
        />
        <button onClick={send} className="p-3 bg-emerald-600 text-black hover:bg-emerald-500 transition-colors"><Send size={18}/></button>
      </div>
    </div>
  );
};

// --- APP ---

export default function App() {
  const [mode, setMode] = useState('select');
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bizParams, setBizParams] = useState({ users: 0, currentConversion: 0, check: 0, margin: 0 });

  if (loading) return <TerminalSplash onComplete={() => setLoading(false)} />;

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500/30 selection:text-white text-white bg-black">
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
      {mode === 'dev' && <DevView setMode={setMode} />}

      <button 
        onClick={() => setIsChatOpen(true)} 
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-600 text-black flex items-center justify-center shadow-[0_0_30px_#10b981] hover:scale-110 active:scale-95 transition-all hover:bg-white group"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform"/>
      </button>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
