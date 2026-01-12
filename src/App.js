import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, 
  CreditCard, Users, TrendingUp, PieChart, Coins, RefreshCcw, 
  ShoppingBag, Check, FileText, BarChart3, BellRing, X, 
  Calculator, Sparkles, Bot, BrainCircuit, MessageSquare, 
  Send, Loader2, ArrowDownRight, Terminal, Cpu, Palette, 
  Zap, ShieldCheck, Play, ArrowUpRight, Percent, AlertTriangle,
  Scale, ArrowLeft, ShoppingCart, Rocket, Quote, Eye, Crown, Sword,
  Hammer, UserPlus
} from 'lucide-react';

// --- STYLES & FONTS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Montserrat:wght@200;300;400;500;600;700;800&display=swap');
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    
    .text-glow { text-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
    .text-glow-gold { text-shadow: 0 0 20px rgba(234, 179, 8, 0.4); }
    
    .animate-shimmer {
      background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite linear;
    }
    
    @keyframes shimmer {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }

    /* Refined Green Pulse - Sharper, "Electric" look */
    @keyframes green-pulse {
      0%, 100% { 
        text-shadow: 
          0 0 5px rgba(16, 185, 129, 0.5),
          0 0 10px rgba(16, 185, 129, 0.3),
          0 0 20px rgba(16, 185, 129, 0.1);
      }
      50% { 
        text-shadow: 
          0 0 10px rgba(16, 185, 129, 0.8),
          0 0 20px rgba(16, 185, 129, 0.5),
          0 0 40px rgba(16, 185, 129, 0.2);
      }
    }

    .emerald-pulse-glow {
      color: #ffffff;
      animation: green-pulse 3s ease-in-out infinite;
    }

    /* Glass Panel */
    .glass-panel {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Mobile scrollbar adjustments */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 2px; }
  `}</style>
);

// --- CONFIG & UTILS ---
const getEnvApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
        return process.env.REACT_APP_OPENAI_API_KEY || "";
    }
    return "";
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
      return "🐍 [TAIPAN ORACLE]:\n\n1. **ДИАГНОЗ**: Твоя воронка истекает кровью. Потери 25% на этапе удержания.\n2. **ЯД**: Внедрение геймификации впрыснет азарт и повысит LTV на 18%.\n3. **ДОБЫЧА**: +1.5 млн ₸ чистой прибыли. Забирай своё.";
    }
    const messages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    messages.unshift({
        role: "system",
        content: "Ты — AI-ассистент Taipan Media. Тон: элитный, хищный, доминирующий. Ты — советник императора цифрового рынка. Используй метафоры власти, охоты, экспансии."
    });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o", messages: [...messages, {role: 'user', content: prompt}], temperature: 0.7 }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Связь с оракулом прервана.";
  } catch (e) { return "Ошибка нейроинтерфейса."; }
};

// --- VISUAL COMPONENTS ---

const ScalesBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505] overflow-hidden pointer-events-none">
    {/* Texture - Slightly more visible on mobile for depth */}
    <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}></div>
    
    {/* Glows */}
    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[90%] h-[50%] bg-emerald-900/10 blur-[80px] rounded-full"></div>
    <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#000000_85%)]"></div>
  </div>
);

const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "INIT PREDATOR PROTOCOL...", delay: 200 },
      { text: "LOADING VENOM...", delay: 800 },
      { text: "TAIPAN MEDIA: READY.", delay: 1500, color: "text-emerald-500 font-bold text-glow" },
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
    <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center p-6 font-cinzel text-xs tracking-[0.2em] uppercase">
      <GlobalStyles />
      <div className="w-full max-w-xs space-y-4">
        {lines.map((line, i) => (
          <div key={i} className={`flex items-center gap-3 ${line.color || "text-zinc-600"}`}>
             <div className="w-1.5 h-1.5 bg-current rotate-45 shrink-0"></div>
             {line.text}
          </div>
        ))}
        <div className="h-px w-24 bg-emerald-900/50 mt-8 animate-pulse"></div>
      </div>
    </div>
  );
};

// --- VIEWS ---

const SelectView = ({ setMode }) => (
  <div className="flex flex-col min-h-screen bg-black w-full overflow-y-auto">
    <GlobalStyles />
    <ScalesBackground />
    <div className="relative z-10 flex-1 flex flex-col px-4 py-8 justify-center items-center w-full">
      
      {/* Header */}
      <div className="mb-10 flex flex-col items-center w-full animate-in fade-in slide-in-from-top-10 duration-1000">
        
        {/* Crown Icon */}
        <div className="flex items-center gap-3 mb-6 opacity-60">
             <div className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500"></div>
             <Crown size={18} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" strokeWidth={1.5} />
             <div className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500"></div>
        </div>
        
        {/* TITLE */}
        <h1 className="emerald-pulse-glow font-cinzel text-5xl font-black tracking-widest leading-none mb-8 text-center select-none">
           TAIPAN<br/>
           <span className="text-white">MEDIA</span>
        </h1>

        {/* MISSION STATEMENT CONTAINER */}
        <div className="w-full relative glass-panel p-6 rounded-sm border-t border-b border-emerald-900/30">
           {/* Decorative corners */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50"></div>

           <div className="flex flex-col items-center gap-6 text-center">
               {/* Main Tagline */}
               <p className="font-cinzel text-white text-base tracking-[0.1em] font-bold text-glow leading-snug">
                 «МЫ СТРОИМ БИЗНЕС<br/>В TELEGRAM»
               </p>
               
               <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

               {/* Subtitles Grid */}
               <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20 mb-1">
                        <Hammer size={14} className="text-emerald-400" />
                      </div>
                      <p className="font-montserrat text-zinc-300 text-[11px] tracking-[0.05em] uppercase font-medium leading-relaxed">
                        <span className="text-emerald-500 font-bold block mb-1">Бизнесу</span>
                        даем инструмент для сверхприбыли
                      </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20 mb-1">
                        <UserPlus size={14} className="text-emerald-400" />
                      </div>
                      <p className="font-montserrat text-zinc-300 text-[11px] tracking-[0.05em] uppercase font-medium leading-relaxed">
                        <span className="text-emerald-500 font-bold block mb-1">Людям</span>
                        даем профессию, чтобы этот инструмент внедрять
                      </p>
                  </div>
               </div>
           </div>
        </div>
      </div>
      
      {/* Cards - Mobile Friendly: Full Width, larger touch targets */}
      <div className="grid gap-4 w-full">
        <button 
            onClick={() => setMode('business')} 
            className="group relative bg-zinc-950 border border-zinc-800 p-6 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] active:border-emerald-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
             <Briefcase className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={20} strokeWidth={1.5} />
          </div>
          <div>
             <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Империя</h3>
             <p className="font-montserrat text-zinc-500 text-[10px] uppercase tracking-widest">Масштабирование • Власть</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-700 group-hover:text-emerald-500 transition-colors" size={20} />
        </button>
        
        <button 
            onClick={() => setMode('dev')} 
            className="group relative bg-zinc-950 border border-zinc-800 p-6 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] active:border-emerald-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
             <Code className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={20} strokeWidth={1.5} />
          </div>
          <div>
             <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Создатель</h3>
             <p className="font-montserrat text-zinc-500 text-[10px] uppercase tracking-widest">Код • Эволюция</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-700 group-hover:text-emerald-500 transition-colors" size={20} />
        </button>
      </div>
    </div>
  </div>
);

// --- NEW DEV VIEW LOGIC ---

// INLINE SVG COMPONENTS
const BitcoinLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#000" stroke="#FFD700" strokeWidth="1" />
    <path fill="#FFD700" d="M44.5 25.8c.8-5.2-3.2-8-8.6-9.8l1.8-7-4.2-1-1.7 6.9c-1.1-.3-2.3-.5-3.4-.8l1.7-6.9-4.3-1-1.8 7.1c-.9-.2-1.8-.4-2.7-.6L19 12l-2.6 6.5s1.4.3 1.4.4c.8.2.9.6.9 1l-2.1 8.5c.1 0 .3.1.5.1-.1 0-.3 0-.4 0l-3 12c-.2.5-.7.6-1.5.4 0 0-1 .4-1 .4l-1.9 4.4 3.6.9c1 .2 2 .5 3 .8l-1.8 7.2 4.3 1 1.8-7.1c1.2.3 2.3.6 3.4.9l-1.8 7.2 4.3 1 1.8-7c7.3 1.4 12.8.8 15.1-5.8 1.9-5.3-1-8.4-4.5-10.4 3.2-.7 5.6-2.9 6.2-7.3zM37.8 40c-2 7.8-15.3 3.6-19.6 2.5l3.5-14c4.3 1.1 18.2 3.2 16.1 11.5zm1.7-16.6c-1.8 7.2-13.1 3.5-16.7 2.6l3.2-12.8c3.7.9 15.5 2.6 13.5 10.2z"/>
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl grayscale hover:grayscale-0 transition-all">
    <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500" />
    <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" className="text-zinc-500"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-500"/>
  </svg>
);

const TelegramLogo = () => (
  <div className="w-full h-full rounded-full flex items-center justify-center relative group">
      <div className="absolute inset-0 bg-emerald-500 blur-[50px] opacity-20 group-hover:opacity-100 transition-opacity duration-200 animate-pulse"></div>
      <div className="relative z-10 w-full h-full bg-black rounded-full flex items-center justify-center border border-emerald-500 shadow-[0_0_30px_#10b981]">
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] fill-emerald-500 translate-x-[-2px] translate-y-[1px]">
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
        quote: '«Цифровые фантики. Игрушка для гиков.»', 
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
        quote: '«Люди хотят щупать. Интернет не для продаж.»', 
        logo: (
            <div className="flex gap-4 w-full h-full justify-center items-center">
                 <ShoppingBag size={60} strokeWidth={1} className="text-zinc-600"/>
            </div>
        ),
        isPositive: false
    },
    { 
        year: '2026', 
        title: 'ТЕЛЕГРАМ', 
        quote: 'Экосистема нового мирового порядка. Твой ход.', 
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
      <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative w-full font-montserrat">
        <GlobalStyles />
        <ScalesBackground />
        
        <div className="relative z-10 flex flex-col h-full p-4 animate-in zoom-in-95 duration-1000 fade-in w-full">
           {/* Top Nav */}
           <div className="flex justify-between items-center mb-6">
              <button onClick={() => setMode('select')} className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                  <ArrowLeft size={18} />
              </button>
              <div className="px-3 py-1 border border-emerald-900/50 bg-emerald-950/20 text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] backdrop-blur-sm font-cinzel">
                  Система Активна
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 flex flex-col justify-center items-center w-full text-center space-y-6">
              <div className="space-y-4 flex flex-col items-center">
                  <div className="relative inline-block group">
                      <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] animate-pulse"></div>
                      <div className="w-20 h-20 mx-auto mb-4 relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out">
                          <TelegramLogo />
                      </div>
                      <h1 className="font-cinzel text-4xl font-black tracking-wide leading-none mb-1 text-white">
                          2026: <br/> <span className="text-emerald-500 text-glow">TG</span> МАРКЕТ
                      </h1>
                  </div>

                  <div className="space-y-4 flex flex-col items-center w-full">
                      <p className="text-zinc-400 font-montserrat text-[10px] uppercase tracking-[0.15em] leading-relaxed whitespace-nowrap mx-auto border-b border-zinc-800 pb-3">
                          Сайты — прошлое. Приложения — долго.
                      </p>
                      <div className="w-full bg-gradient-to-r from-transparent via-zinc-900 to-transparent p-px">
                        <div className="bg-black/40 backdrop-blur-md p-4 relative overflow-hidden text-center">
                             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                             <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                             <Quote className="mx-auto text-emerald-800 mb-1 opacity-50" size={14}/>
                             <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide leading-relaxed font-cinzel">
                                "Охоться там,<br/>где жертва проводит 90% жизни"
                            </p>
                        </div>
                      </div>
                  </div>
              </div>

              {/* BUTTONS */}
              <div className="grid gap-3 w-full">
                  <button className="group relative bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/50 p-4 text-left transition-all duration-300 active:scale-[0.98]">
                      <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                      <div className="flex justify-between items-center">
                          <div>
                            <div className="text-base font-bold font-cinzel text-white mb-0.5 group-hover:text-emerald-400 transition-colors tracking-wide">TG Магазины</div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium font-montserrat">Скрипты • Внедрение</p>
                          </div>
                          <ShoppingCart className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={18} strokeWidth={1.5}/>
                      </div>
                  </button>

                  <button className="group relative bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/50 p-4 text-left transition-all duration-300 active:scale-[0.98]">
                      <div className="absolute inset-y-0 left-0 w-1 bg-purple-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                      <div className="flex justify-between items-center">
                          <div>
                            <div className="text-base font-bold font-cinzel text-white mb-0.5 group-hover:text-purple-400 transition-colors tracking-wide">Нейро-Боты</div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium font-montserrat">AI • Автоматизация</p>
                          </div>
                          <BrainCircuit className="text-zinc-600 group-hover:text-purple-500 transition-colors" size={18} strokeWidth={1.5}/>
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
  
  let containerTransition = 'opacity-0 translate-y-8 scale-95 blur-sm'; 
  if (fadeState === 'visible') containerTransition = 'opacity-100 translate-y-0 scale-100 blur-0 duration-[700ms] ease-out';
  if (fadeState === 'out') containerTransition = 'opacity-0 scale-105 blur-md brightness-50 duration-[500ms] ease-in';

  // Styles
  const yearColor = isPositive ? 'text-emerald-500 text-glow' : 'text-zinc-600';
  const quoteBorder = isPositive ? 'border-emerald-500 bg-emerald-950/10' : 'border-red-900/30 bg-red-950/5';
  const footerText = isPositive ? 'ЦЕЛЬ ЗАХВАЧЕНА' : 'ЦЕЛЬ УПУЩЕНА';
  const footerColor = isPositive ? 'text-emerald-500' : 'text-red-900';

  return (
    <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-hidden items-center justify-center relative p-6 w-full">
      <GlobalStyles />
      <ScalesBackground />
      <div key={step} className={`relative z-10 flex flex-col items-center text-center transition-all ${containerTransition}`}>
        <div className="mb-8 scale-100">{current.logo}</div>
        <div className="space-y-6 flex flex-col items-center">
            <h2 className={`text-7xl font-cinzel font-black tracking-tighter ${yearColor}`}>
                {current.year}
            </h2>
            <div className={`relative p-6 text-center backdrop-blur-md border-y ${quoteBorder} max-w-[280px]`}>
                <p className={`${isPositive ? 'text-white' : 'text-zinc-500'} text-sm font-cinzel font-bold uppercase leading-normal`}>
                    {current.quote}
                </p>
                <div className="mt-4 flex justify-center">
                    <span className={`text-[9px] uppercase tracking-[0.4em] ${footerColor} font-bold border-b border-current pb-1`}>{footerText}</span>
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
        <div className="flex flex-col h-screen bg-black text-white font-montserrat items-center justify-center relative overflow-hidden p-6 w-full">
            <GlobalStyles />
            <ScalesBackground />
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse"></div>
                    <BrainCircuit size={64} className="text-emerald-500 relative z-10 animate-bounce" strokeWidth={1} />
                </div>
                <div>
                    <h2 className="text-2xl font-cinzel font-bold tracking-widest text-white mb-2">НЕЙРОСКАН</h2>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.3em]">Поиск уязвимостей...</p>
                        <div className="h-0.5 w-20 bg-zinc-800 rounded-full overflow-hidden mt-2">
                             <div className="h-full bg-emerald-500 animate-shimmer w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (analysisState === 'result') {
      return (
        <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-y-auto relative w-full">
            <GlobalStyles />
            <ScalesBackground />
            <div className="relative z-10 p-4 max-w-lg mx-auto w-full min-h-screen flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setAnalysisState('input')} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Назад</span>
                    </button>
                    <div className="text-emerald-500 border border-emerald-900/50 px-2 py-1 bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest font-cinzel">
                        Диагноз готов
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="text-center space-y-1">
                         <h2 className="text-3xl font-cinzel font-black tracking-wider text-white">ПЛАН <span className="text-emerald-500 text-glow">ЗАХВАТА</span></h2>
                    </div>

                    <div className="bg-zinc-900/20 border-l-2 border-emerald-500 p-4 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Quote size={30} className="text-emerald-500"/>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-emerald-400">
                            <div className="whitespace-pre-wrap leading-relaxed font-montserrat text-xs tracking-wide">
                                {aiAnalysis}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/30 p-4 border border-zinc-800 text-center transition-all hover:border-emerald-500/50 group active:scale-[0.98]">
                            <div className="text-[9px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Потенциал</div>
                            <div className="text-lg font-cinzel font-bold text-emerald-500 group-hover:text-glow transition-all">+{formatCurrency(recoveredProfit)}</div>
                        </div>
                        <div className="bg-zinc-900/30 p-4 border border-zinc-800 text-center transition-all hover:border-red-900/50 group active:scale-[0.98]">
                            <div className="text-[9px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Кровопотеря</div>
                            <div className="text-lg font-cinzel font-bold text-red-700 group-hover:text-red-600 transition-all">{formatCurrency(lostProfit)}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/50 text-center pb-6">
                    <button onClick={() => setAnalysisState('input')} className="w-full bg-white text-black font-cinzel font-black py-3 uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-[0.98] text-xs">
                        НОВАЯ ОХОТА
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // --- INPUT VIEW ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-y-auto relative w-full">
      <GlobalStyles />
      <ScalesBackground />
      
      <div className="sticky top-0 z-40 px-4 py-3 bg-black/80 backdrop-blur-xl flex justify-between items-center border-b border-zinc-900">
        <button onClick={() => setMode('select')} className="w-8 h-8 flex items-center justify-center hover:text-emerald-500 transition-colors">
            <ChevronRight className="rotate-180" size={20}/>
        </button>
        <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase animate-pulse font-cinzel">
            Анализатор
        </span>
        <div className="w-8"></div>
      </div>

      <div className="p-4 relative z-10 pb-32 max-w-lg mx-auto w-full">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-cinzel font-black tracking-wide mb-2 text-white leading-tight">
                АУДИТ <span className="text-emerald-600 text-glow block text-2xl mt-1">УПУЩЕННОЙ ПРИБЫЛИ</span>
            </h2>
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-medium">Калькулятор упущенного доминирования</p>
        </div>

        <div className="relative">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-emerald-500/50"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-emerald-500/50"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-emerald-500/50"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-emerald-500/50"></div>

            <div className="p-px bg-zinc-900/30 backdrop-blur-sm border border-zinc-800">
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                    {[
                        { label: 'ТРАФИК', icon: Users, val: bizParams.users, set: (v) => setBizParams({...bizParams, users: v}) },
                        { label: 'КОНВЕРСИЯ', icon: Percent, val: bizParams.currentConversion, set: (v) => setBizParams({...bizParams, currentConversion: v}) },
                        { label: 'СРЕДНИЙ ЧЕК', icon: Coins, val: bizParams.check, set: (v) => setBizParams({...bizParams, check: v}) },
                        { label: 'МАРЖА', icon: Scale, val: bizParams.margin, set: (v) => setBizParams({...bizParams, margin: v}) },
                    ].map((item, i) => (
                        <div key={i} className="space-y-2 flex flex-col items-center text-center group">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center justify-center gap-1.5 w-full tracking-[0.1em] group-hover:text-emerald-500 transition-colors font-cinzel">
                                <item.icon size={12} className="opacity-70" /> {item.label}
                            </label>
                            <input 
                                type="number" 
                                value={item.val} 
                                onChange={e => item.set(e.target.value)} 
                                className="w-full bg-transparent border-b border-zinc-800 py-1.5 text-white text-lg font-cinzel font-bold focus:outline-none focus:border-emerald-500 text-center transition-all placeholder-zinc-800"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>

                <div className="bg-black/50 p-6 space-y-6 border-t border-zinc-800 mt-2">
                    <div className="text-center">
                        <div className="text-[9px] font-bold text-zinc-600 mb-1 uppercase tracking-[0.2em]">Текущий доход</div>
                        <div className="text-2xl font-cinzel font-bold text-white tracking-wide">
                            {formatCurrency(baseProfit)}
                        </div>
                    </div>

                    <div className="relative bg-red-950/10 border-l-2 border-red-900 p-4">
                        <div className="flex flex-col items-center text-center space-y-1">
                            <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-[9px] tracking-[0.2em] animate-pulse">
                                <AlertTriangle size={12} /> Утечка капитала
                            </div>
                            <div className="text-[9px] text-zinc-500">
                                Упущенный трафик: <span className="text-zinc-300 font-bold">{lostPercent.toFixed(1)}%</span>
                            </div>
                            <div className="text-2xl font-cinzel font-bold text-red-800 opacity-90">
                                {formatCurrency(lostProfit)}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAI} 
                        className="w-full bg-emerald-600 text-black font-cinzel font-black text-xs py-4 uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                    >
                          ЗАПУСТИТЬ ПРОТОКОЛ
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Оракул слушает. Говори.' }]);
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
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-10 font-montserrat">
      <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-black/50">
        <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-white">Viper Link</span>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} strokeWidth={1}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 text-xs font-medium tracking-wide border ${m.sender === 'user' ? 'bg-emerald-900/10 border-emerald-900 text-emerald-100' : 'bg-zinc-900/50 border-zinc-800 text-zinc-300'}`}>
                {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-emerald-500/50 pl-2 animate-pulse uppercase tracking-widest font-cinzel">Анализ данных...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-5 bg-black border-t border-zinc-800 flex gap-4">
        <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            placeholder="Приказ..." 
            className="flex-1 bg-zinc-900/50 border border-zinc-800 px-6 py-4 focus:outline-none focus:border-emerald-900 text-sm text-white placeholder-zinc-700 font-montserrat tracking-wide"
        />
        <button onClick={send} className="px-6 bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"><Send size={20} strokeWidth={1.5}/></button>
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
    <div className="min-h-screen font-sans selection:bg-emerald-500/30 selection:text-white text-white bg-black w-full">
      <GlobalStyles />
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
      {mode === 'dev' && <DevView setMode={setMode} />}

      <button 
        onClick={() => setIsChatOpen(true)} 
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-emerald-700 text-white flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all hover:bg-emerald-500 group rounded-full"
      >
        <MessageSquare size={26} className="group-hover:rotate-12 transition-transform" strokeWidth={1.5}/>
      </button>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
