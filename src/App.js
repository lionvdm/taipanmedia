import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, 
  CreditCard, Users, TrendingUp, PieChart, Coins, RefreshCcw, 
  ShoppingBag, Check, FileText, BarChart3, BellRing, X, 
  Calculator, Sparkles, Bot, BrainCircuit, MessageSquare, 
  Send, Loader2, ArrowDownRight, Terminal, Cpu, Palette, 
  Zap, ShieldCheck, Play, ArrowUpRight, Percent, AlertTriangle,
  Scale, ArrowLeft, ShoppingCart, Rocket, Quote
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
      return "🤖 [DEMO]: Система Taipan проанализировала ваши цифры. \n\n1. **Удержание**: Внедрение Mini App с программой лояльности вернет до 25% ушедших клиентов.\n2. **Рост чека**: Геймификация покупок увеличит средний чек на 15%.\n3. **Итог**: Ваш потенциальный рост чистой прибыли составит минимум 1.2 млн ₸ в первый квартал.";
    }
    const messages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    messages.unshift({
        role: "system",
        content: "Ты — AI-ассистент Taipan Media. Твой тон: уверенный, экспертный, хищный. Ты эксперт в Telegram Mini Apps. Отвечай кратко, структурировано, используй маркдаун."
    });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o", messages: [...messages, {role: 'user', content: prompt}], temperature: 0.7 }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка анализа.";
  } catch (e) { return "Ошибка связи с ядром."; }
};

// --- SHARED COMPONENTS ---

const SnakeText = ({ children, className = "" }) => (
  <span className={`font-black ${className}`} style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')`,
      backgroundSize: '150%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 20px rgba(16, 185, 129, 0.4)', filter: 'brightness(1.3) contrast(1.2)',
      display: 'inline-block'
    }}>{children}</span>
);

const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505] overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

const SnakePatternBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)',
             backgroundSize: '16px 16px'
           }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-emerald-900/10"></div>
    </div>
);

const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "> INITIALIZING CORE...", delay: 200 },
      { text: "> CONNECTING TO NEURAL NET...", delay: 600 },
      { text: "> TAIPAN PROTOCOL ACTIVE.", delay: 1200, color: "text-emerald-500 font-bold" },
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
    <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-end p-8 font-mono text-xs">
      {lines.map((line, i) => <div key={i} className={`mb-2 ${line.color || "text-emerald-500/70"}`}>{line.text}</div>)}
      <div className="w-2 h-4 bg-emerald-500 animate-pulse"></div>
    </div>
  );
};

// --- VIEWS ---

const SelectView = ({ setMode }) => (
  <div className="flex flex-col h-screen relative overflow-hidden font-sans bg-black">
    <SnakePatternBackground />
    <div className="relative z-10 flex-1 flex flex-col p-8 justify-center">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-white/60 text-[10px] font-medium tracking-wide uppercase">System Online</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-4 whitespace-nowrap">
           <SnakeText>TAIPAN MEDIA</SnakeText>
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs">Выберите свой протокол для продолжения.</p>
      </div>
      <div className="grid gap-4 w-full max-w-md">
        <button onClick={() => setMode('business')} className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-left hover:border-emerald-500/50 transition-all active:scale-[0.98]">
          <Briefcase className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h3 className="text-xl font-bold text-white">Предприниматель</h3>
          <p className="text-zinc-500 text-xs">Масштабирование бизнеса и рост продаж.</p>
        </button>
        <button onClick={() => setMode('dev')} className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-left hover:border-emerald-500/50 transition-all active:scale-[0.98]">
          <Code className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
          <h3 className="text-xl font-bold text-white">Разработчик</h3>
          <p className="text-zinc-500 text-xs">Обучение созданию Mini Apps и заработок.</p>
        </button>
      </div>
    </div>
  </div>
);

// --- NEW DEV VIEW LOGIC ---

// INLINE SVG COMPONENTS
const BitcoinLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFC107" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <linearGradient id="goldGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF7D1" />
        <stop offset="50%" stopColor="#FFE082" />
        <stop offset="100%" stopColor="#FFC107" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#goldGradient)" stroke="#FF8C00" strokeWidth="2" />
    <circle cx="32" cy="32" r="25" fill="url(#goldGradientLight)" stroke="#FFC107" strokeWidth="1" />
    <path fill="#FF8C00" d="M44.5 25.8c.8-5.2-3.2-8-8.6-9.8l1.8-7-4.2-1-1.7 6.9c-1.1-.3-2.3-.5-3.4-.8l1.7-6.9-4.3-1-1.8 7.1c-.9-.2-1.8-.4-2.7-.6L19 12l-2.6 6.5s1.4.3 1.4.4c.8.2.9.6.9 1l-2.1 8.5c.1 0 .3.1.5.1-.1 0-.3 0-.4 0l-3 12c-.2.5-.7.6-1.5.4 0 0-1 .4-1 .4l-1.9 4.4 3.6.9c1 .2 2 .5 3 .8l-1.8 7.2 4.3 1 1.8-7.1c1.2.3 2.3.6 3.4.9l-1.8 7.2 4.3 1 1.8-7c7.3 1.4 12.8.8 15.1-5.8 1.9-5.3-1-8.4-4.5-10.4 3.2-.7 5.6-2.9 6.2-7.3zM37.8 40c-2 7.8-15.3 3.6-19.6 2.5l3.5-14c4.3 1.1 18.2 3.2 16.1 11.5zm1.7-16.6c-1.8 7.2-13.1 3.5-16.7 2.6l3.2-12.8c3.7.9 15.5 2.6 13.5 10.2z"/>
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl">
    <defs>
      <radialGradient id="igGradient" cx="0.2" cy="1" r="1.2">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="url(#igGradient)" />
    <path fill="none" stroke="#fff" strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WBLogo = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#9c1c9c] to-[#5e0d5e] rounded-xl flex items-center justify-center p-2 shadow-2xl">
     <span className="text-white font-black italic tracking-tighter text-2xl md:text-3xl">WB</span>
  </div>
);

const KaspiLogo = () => (
  <div className="w-full h-full bg-[#f14635] rounded-xl flex items-center justify-center p-1 shadow-2xl border-b-4 border-[#c0392b]">
      <span className="text-white font-bold tracking-tight text-sm md:text-lg">Kaspi.kz</span>
  </div>
);

const TelegramLogo = () => (
  <div className="w-full h-full rounded-full flex items-center justify-center relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-emerald-500 blur-[30px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse"></div>
      
      {/* Icon Container */}
      <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] rounded-full flex items-center justify-center shadow-2xl border border-white/10">
        <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-white translate-x-[-2px] translate-y-[1px] drop-shadow-md">
            <path d="M22.2646 2.42743C22.569 2.27532 22.8837 2.47863 22.8021 2.81232L19.9814 16.5135C19.7997 17.4022 18.7381 17.7423 18.0673 17.126L14.155 13.9189L12.0622 15.9329C11.8396 16.1469 11.4787 15.9926 11.4924 15.6841L11.7509 11.2336C11.7766 10.7916 11.9687 10.3752 12.2852 10.076L17.7562 5.24432C18.0253 5.00676 17.697 4.60676 17.3879 4.80917L8.90367 10.1556C8.28335 10.5463 7.50293 10.5189 6.91037 10.2974L3.4563 9.00632C2.79379 8.75883 2.84687 7.80993 3.53569 7.63223L22.2646 2.42743Z"/>
        </svg>
      </div>
  </div>
);

const DevView = ({ setMode }) => {
  const [step, setStep] = useState(0);
  const [fadeState, setFadeState] = useState('in'); // 'in' | 'visible' | 'out'

  const missedOpportunities = [
    { 
        year: '2009', 
        title: 'Bitcoin', 
        quote: '«Электронные фантики. Это никогда не заменит реальные деньги.»', 
        logo: <BitcoinLogo />,
        isPositive: false
    },
    { 
        year: '2012', 
        title: 'Instagram', 
        quote: '«Кому нужны фото еды? Там нет бизнеса, это просто игрушка.»', 
        logo: <InstagramLogo />,
        isPositive: false
    },
    { 
        year: '2019', 
        title: 'WB и Kaspi', 
        quote: '«Люди хотят щупать товар. Маркетплейсы убьют только время.»', 
        logo: (
            <div className="flex gap-4 w-full h-full justify-center">
                 <div className="w-20 h-20 md:w-24 md:h-24 rotate-[-6deg] hover:rotate-0 transition-transform duration-500"><WBLogo /></div>
                 <div className="w-20 h-20 md:w-24 md:h-24 rotate-[6deg] hover:rotate-0 transition-transform duration-500"><KaspiLogo /></div>
            </div>
        ),
        isPositive: false
    },
    { 
        year: '2026', 
        title: 'Telegram Магазины', 
        quote: 'Тренд, который вам нельзя упускать.', 
        logo: <div className="w-32 h-32 md:w-40 md:h-40 animate-[bounce_3s_infinite]"><TelegramLogo /></div>,
        isPositive: true 
    },
  ];

  useEffect(() => {
    // We now have 4 steps (0, 1, 2, 3) before final screen (step 4)
    if (step < 4) {
      setFadeState('in');
      
      const timerVisible = setTimeout(() => {
        setFadeState('visible');
      }, 500); 

      // Telegram step (index 3) stays longer
      const stayDuration = step === 3 ? 3500 : 3500; 

      const timerOut = setTimeout(() => {
        setFadeState('out');
      }, 500 + stayDuration); 

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
        <MeshBackground />
        
        <div className="relative z-10 flex flex-col h-full p-6 animate-in zoom-in-95 duration-1000 fade-in">
           {/* Top Nav */}
           <div className="flex justify-between items-center mb-6 md:mb-8">
              <button onClick={() => setMode('select')} className="w-10 h-10 rounded-full bg-zinc-900/50 flex items-center justify-center border border-white/5 hover:border-emerald-500/50 transition-colors">
                  <ArrowLeft size={20} />
              </button>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Dev Protocol
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full text-center space-y-6 md:space-y-10">
              <div className="space-y-4 md:space-y-6">
                  {/* HERO HEADER */}
                  <div className="relative inline-block">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-[50px] animate-pulse"></div>
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 relative z-10">
                          <TelegramLogo />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-2">
                          2026: <br/> <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">TELEGRAM</span> <SnakeText>STORE</SnakeText>
                      </h1>
                  </div>

                  {/* SLOGAN */}
                  <div className="space-y-3 md:space-y-4">
                      <p className="text-zinc-300 font-medium text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                          Сайты мертвы. Приложения — это дорого и сложно. 
                      </p>
                      <div className="bg-zinc-900/50 border border-emerald-500/30 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm">
                          <p className="text-emerald-400 text-xs md:text-sm font-bold uppercase tracking-wide leading-relaxed">
                              "Твой бизнес должен быть там,<br/>где люди проводят 90% времени"
                          </p>
                      </div>
                  </div>
              </div>

              {/* BUTTONS */}
              <div className="grid gap-3 md:gap-4 w-full">
                  <button className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-5 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all active:scale-[0.98]">
                      <div className="absolute top-0 right-0 p-3 md:p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                          <ShoppingCart size={60} className="text-emerald-500 -rotate-12 translate-x-4 -translate-y-4"/>
                      </div>
                      <div className="relative z-10">
                          <div className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">TG Магазины</div>
                          <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-bold">Обучение • Скрипты • Заказы</p>
                      </div>
                  </button>

                  <button className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-5 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all active:scale-[0.98]">
                      <div className="absolute top-0 right-0 p-3 md:p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Rocket size={60} className="text-purple-500 -rotate-12 translate-x-4 -translate-y-4"/>
                      </div>
                      <div className="relative z-10">
                          <div className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Custom Mini Apps</div>
                          <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-bold">React • Node.js • Сложные боты</p>
                      </div>
                  </button>
              </div>

              <div className="pt-2 md:pt-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Доступ к базе знаний Taipan</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- FADE SEQUENCE SCREENS ---
  const current = missedOpportunities[step];
  
  // Logic for staggered entrance on positive slide (Telegram)
  const isPositive = current.isPositive;

  // Base classes for container transition
  let containerTransition = 'opacity-0 translate-y-4 scale-95 blur-sm'; 
  if (fadeState === 'visible') containerTransition = 'opacity-100 translate-y-0 scale-100 blur-0 duration-[800ms]';
  if (fadeState === 'out') containerTransition = 'opacity-0 scale-105 blur-lg brightness-50 duration-[500ms]';

  // Special "Smoke/Ethereal" container transition for Telegram
  if (isPositive) {
      if (fadeState === 'in') containerTransition = 'opacity-0'; // Start invisible
      if (fadeState === 'visible') containerTransition = 'opacity-100 duration-1000'; // Fade in container
      if (fadeState === 'out') containerTransition = 'opacity-0 blur-xl scale-95 duration-1000'; // Fade out container
  }

  // Styles
  const yearColor = isPositive ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-400' : 'text-zinc-200';
  const decorationStyle = 'no-underline'; 
  const quoteBorder = isPositive ? 'border-l-4 border-emerald-500 bg-emerald-950/30' : 'border-l-2 border-red-800 bg-[#111]';
  const footerText = isPositive ? 'Лови момент' : 'Возможность упущена';
  const footerColor = isPositive ? 'text-emerald-400' : 'text-red-500';

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden items-center justify-center relative p-6">
      <MeshBackground />
      
      {/* Smoke/Aurora Effect Layer */}
      {isPositive && fadeState === 'visible' && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-emerald-500/5 blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
          </div>
      )}
      
      <div 
        key={step} 
        className={`relative z-10 flex flex-col items-center text-center transition-all ${containerTransition}`}
      >
        {/* LOGO AREA */}
        <div className={`mb-8 flex items-center justify-center ${isPositive ? 'animate-in fade-in zoom-in duration-[1500ms] delay-0 fill-mode-both' : ''}`}>
            {current.logo}
        </div>
        
        <div className="space-y-6 md:space-y-8 max-w-sm md:max-w-lg">
            {/* YEAR */}
            <div className={`relative inline-block ${isPositive ? 'animate-in fade-in slide-in-from-bottom-8 duration-[1500ms] delay-500 fill-mode-both' : ''}`}>
                 <h2 className={`relative z-10 text-6xl md:text-8xl font-serif font-black italic tracking-tighter drop-shadow-2xl ${yearColor} ${decorationStyle}`}>
                    {current.year}
                 </h2>
            </div>

            {/* TITLE (Only for Telegram Slide) */}
            {isPositive && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-[1500ms] delay-1000 fill-mode-both">
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {current.title}
                    </h3>
                </div>
            )}
            
            {/* QUOTE BLOCK */}
            <div className={`relative p-6 text-left rounded-2xl shadow-2xl backdrop-blur-md ${quoteBorder} ${isPositive ? 'animate-in fade-in slide-in-from-bottom-8 duration-[1500ms] delay-[1500ms] fill-mode-both' : ''}`}>
                <Quote size={20} className={`${isPositive ? 'text-emerald-500' : 'text-zinc-600'} mb-3 fill-current md:w-6 md:h-6`} />
                <p className={`${isPositive ? 'text-white text-lg md:text-xl' : 'text-zinc-300 text-sm md:text-lg'} font-mono leading-relaxed italic`}>
                    {current.quote}
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <div className={`h-px flex-1 ${isPositive ? 'bg-emerald-500/30' : 'bg-zinc-800'}`}></div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] ${footerColor} font-bold`}>{footerText}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const BusinessView = ({ setMode, bizParams, setBizParams }) => {
  const [analysisState, setAnalysisState] = useState('input'); // 'input', 'loading', 'result'
  const [aiAnalysis, setAiAnalysis] = useState('');

  const traffic = Number(bizParams.users) || 0;
  const currentConvRate = Number(bizParams.currentConversion) || 0;
  const margin = Number(bizParams.margin) || 0;
  const check = Number(bizParams.check) || 0;

  // Calculations
  const baseRevenue = traffic * (currentConvRate / 100) * check;
  const baseProfit = baseRevenue * (margin / 100);
  const lostPercent = Math.max(0, 100 - currentConvRate);
  const lostUsers = traffic * (lostPercent / 100);
  const lostRevenue = lostUsers * check;
  const lostProfit = lostRevenue * (margin / 100);
  const recoveredProfit = lostProfit * 0.20;

  const handleAI = async () => {
    setAnalysisState('loading');
    const res = await callOpenAIAPI(`Трафик: ${traffic}, Чек: ${check}, Конверсия: ${currentConvRate}%, Маржа: ${margin}%, Упускаем: ${lostPercent}%, Можем вернуть: ${recoveredProfit}. Рассчитай эффект от внедрения Telegram Mini App.`);
    setAiAnalysis(res);
    setAnalysisState('result');
  };

  // --- ANALYSIS LOADING VIEW ---
  if (analysisState === 'loading') {
    return (
        <div className="flex flex-col h-screen bg-black text-white font-sans items-center justify-center relative overflow-hidden p-6">
            <MeshBackground />
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                    <BrainCircuit size={80} className="text-emerald-500 relative z-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                        GEMINI АНАЛИЗИРУЕТ
                    </h2>
                    <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest animate-pulse">Обработка показателей...</p>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
  }

  // --- ANALYSIS RESULT VIEW ---
  if (analysisState === 'result') {
      return (
        <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto relative">
            <MeshBackground />
            <div className="relative z-10 p-6 max-w-lg mx-auto w-full min-h-screen flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setAnalysisState('input')} className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Назад</span>
                    </button>
                    <div className="text-emerald-500 flex items-center gap-2">
                        <Bot size={18} />
                        <span className="text-xs font-bold uppercase">Анализ завершен</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                         <h2 className="text-3xl font-black italic tracking-tighter">СТРАТЕГИЯ <span className="text-emerald-500">РОСТА</span></h2>
                         <p className="text-zinc-400 text-sm">Персональный план на основе ваших данных</p>
                    </div>

                    <div className="bg-[#09090b]/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-emerald-400">
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {aiAnalysis}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Потенциал возврата</div>
                            <div className="text-xl font-bold text-white">+{formatCurrency(recoveredProfit)}</div>
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Упущенная выгода</div>
                            <div className="text-xl font-bold text-red-500/80">{formatCurrency(lostProfit)}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-4">Taipan Media Agency</p>
                    <button onClick={() => setAnalysisState('input')} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-400 transition-colors">
                        РАССЧИТАТЬ НОВЫЙ ПРОЕКТ
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // --- INPUT VIEW (DEFAULT) ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto relative">
      <MeshBackground />
      {/* Navbar */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-black/80 backdrop-blur-xl flex justify-between items-center border-b border-white/5">
        <button onClick={() => setMode('select')} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors group">
            <ChevronRight className="rotate-180 group-hover:text-emerald-500 transition-colors" size={18}/>
        </button>
        <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase flex items-center gap-2">
            <Activity size={12} /> Анализ Бизнеса
        </span>
        <div className="w-8"></div>
      </div>

      <div className="p-6 relative z-10 pb-32 max-w-lg mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-black italic tracking-tighter mb-2">
                <span className="text-emerald-500">TAIPAN</span> ANALYTICS
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Калькулятор упущенной прибыли</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#09090b] border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden">
            
            {/* Input Section */}
            <div className="p-6 grid grid-cols-2 gap-4 bg-zinc-900/30 rounded-t-[20px] border-b border-white/5">
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                        <Users size={10} /> Трафик
                    </label>
                    <input 
                        type="number" 
                        value={bizParams.users} 
                        onChange={e => setBizParams({...bizParams, users: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-center"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                        <Percent size={10} /> Конверсия
                    </label>
                    <input 
                        type="number" 
                        value={bizParams.currentConversion} 
                        onChange={e => setBizParams({...bizParams, currentConversion: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-center"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                        <CreditCard size={10} /> Чек (₸)
                    </label>
                    <input 
                        type="number" 
                        value={bizParams.check} 
                        onChange={e => setBizParams({...bizParams, check: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-center"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                        <Scale size={10} /> Маржа (%)
                    </label>
                    <input 
                        type="number" 
                        value={bizParams.margin} 
                        onChange={e => setBizParams({...bizParams, margin: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-bold focus:outline-none focus:border-emerald-500/50 text-center"
                    />
                </div>
            </div>

            {/* Result Display */}
            <div className="relative bg-black p-6 space-y-6">
                
                {/* Profit Block */}
                <div className="text-center">
                    <div className="text-[9px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">Текущая чистая прибыль</div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        {formatCurrency(baseProfit)}
                    </div>
                </div>

                {/* THE VOID / LOST PROFIT - AGGRESSIVE UI */}
                <div className="relative overflow-hidden rounded-2xl bg-red-950/20 border border-red-900/30 p-5 group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                            <AlertTriangle size={12} /> Внимание
                        </div>
                        
                        <div className="text-sm text-zinc-400 font-medium">
                            Вы упускаете <span className="text-white font-bold">{lostPercent.toFixed(1)}%</span> конверсии
                        </div>
                        
                        <div className="w-full h-px bg-red-900/30 my-2"></div>
                        
                        <div className="text-[10px] text-red-400 font-bold uppercase">В деньгах вы теряете</div>
                        <div className="text-3xl sm:text-4xl font-black text-red-500 tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            {formatCurrency(lostProfit)}
                        </div>
                    </div>
                </div>

                {/* THE SOLUTION / RECOVERED PROFIT */}
                <div className="relative overflow-hidden rounded-2xl bg-emerald-900/20 border border-emerald-500/30 p-5 group animate-in slide-in-from-bottom-2">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[10px] tracking-widest">
                            <RefreshCcw size={12} /> Возможность
                        </div>
                        
                        <div className="text-sm text-zinc-300 font-medium leading-tight">
                             Благодаря Telegram магазину вы сможете вернуть от <span className="text-white font-bold">20%</span> потерянных продаж
                        </div>
                        
                        <div className="w-full h-px bg-emerald-900/30 my-2"></div>
                        
                        <div className="text-[10px] text-emerald-400/80 font-bold uppercase">Дополнительный доход</div>
                        <div className="text-3xl sm:text-4xl font-black text-emerald-500 tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            +{formatCurrency(recoveredProfit)}
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button 
                    onClick={handleAI} 
                    className="w-full bg-white text-black font-black text-xs py-4 rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                     <Sparkles size={14} />
                     Как забрать эти деньги?
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Taipan AI на связи. Чем могу помочь?' }]);
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
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
        <div className="flex items-center gap-2"><Bot size={20} className="text-emerald-500"/><span className="font-bold text-sm text-white">TAIPAN CHAT</span></div>
        <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>{m.text}</div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-zinc-500 pl-2 flex gap-1 items-center"><Loader2 size={10} className="animate-spin"/> Taipan думает...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-black flex gap-2 border-t border-white/10">
        <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            placeholder="Спроси о стратегии..." 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm text-white transition-colors"
        />
        <button onClick={send} className="p-3 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-colors"><Send size={18}/></button>
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
    <div className="min-h-screen font-sans selection:bg-emerald-500/30 text-white bg-black">
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
      {mode === 'dev' && <DevView setMode={setMode} />}

      <button 
        onClick={() => setIsChatOpen(true)} 
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all hover:bg-emerald-400 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform"/>
      </button>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
