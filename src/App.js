import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, 
  CreditCard, Users, TrendingUp, PieChart, Coins, RefreshCcw, 
  ShoppingBag, Check, FileText, BarChart3, BellRing, X, 
  Calculator, Sparkles, Bot, BrainCircuit, MessageSquare, 
  Send, Loader2, ArrowDownRight, Terminal, Cpu, Palette, 
  Zap, ShieldCheck, Play, ArrowUpRight, Percent, AlertTriangle,
  Scale, ArrowLeft, ShoppingCart, Rocket, Quote, Eye, Crown, Sword,
  Hammer, UserPlus, Info, ImageIcon, Smartphone, ExternalLink, Star,
  Menu, Search, Plus, Minus
} from 'lucide-react';

// --- STYLES & FONTS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Montserrat:wght@200;300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    .font-inter { font-family: 'Inter', sans-serif; }
    
    .text-glow { text-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
    .text-glow-red { text-shadow: 0 0 20px rgba(220, 38, 38, 0.4); }
    
    .animate-shimmer {
      background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite linear;
    }
    
    @keyframes shimmer {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }

    @keyframes green-pulse {
      0%, 100% { 
        text-shadow: 
          0 0 5px rgba(16, 185, 129, 0.5),
          0 0 10px rgba(16, 185, 129, 0.3);
      }
      50% { 
        text-shadow: 
          0 0 15px rgba(16, 185, 129, 0.8),
          0 0 25px rgba(16, 185, 129, 0.5);
      }
    }

    /* Smoke Effects */
    @keyframes smoke-enter {
      0% { opacity: 0; filter: blur(15px); transform: scale(0.9) translateY(10px); }
      100% { opacity: 1; filter: blur(0); transform: scale(1) translateY(0); }
    }
    @keyframes smoke-exit {
      0% { opacity: 1; filter: blur(0); transform: scale(1) translateY(0); }
      100% { opacity: 0; filter: blur(20px); transform: scale(1.1) translateY(-20px); }
    }
    
    .smoke-enter { animation: smoke-enter 1.2s ease-out forwards; }
    .smoke-exit { animation: smoke-exit 1s ease-in forwards; }

    /* Number Pulse Effect */
    @keyframes num-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    
    .animate-num-pulse {
      animation: num-pulse 2s ease-in-out infinite;
      display: inline-block;
    }

    .emerald-pulse-glow {
      color: #ffffff;
      animation: green-pulse 3s ease-in-out infinite;
    }

    /* Glass Panel */
    .glass-panel {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    /* Mobile scrollbar adjustments */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 2px; }

    /* Hide number input spinners */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
  `}</style>
);

// --- UTILS ---

const formatCurrency = (val) => {
  if (!val && val !== 0) return '0\u00A0₸';
  return new Intl.NumberFormat('ru-RU').format(Math.floor(val)) + '\u00A0₸';
};

// --- DEMO STORE COMPONENT (Telegram Mini App Simulator) ---
const DemoStore = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState({});
  const [notification, setNotification] = useState(null);

  const products = [
    { id: 1, name: "Набор 'Шеф-Повар'", price: 24000, img: "🍳", desc: "Кастрюля 5л + Сковорода" },
    { id: 2, name: "Сковорода WOK", price: 12500, img: "🥘", desc: "Антипригарное покрытие" },
    { id: 3, name: "Ножи 'Самурай'", price: 8900, img: "🔪", desc: "Японская сталь, 3 шт." },
    { id: 4, name: "Чайник Vintage", price: 15000, img: "🫖", desc: "Эмаль, свисток, 3л" },
  ];

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showNotification("Добавлено в корзину");
  };

  const showNotification = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 2000);
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#1c1c1e] h-[80vh] rounded-[30px] overflow-hidden flex flex-col shadow-2xl relative border border-zinc-700">
        
        {/* Fake Status Bar */}
        <div className="h-10 bg-[#1c1c1e] flex items-end justify-between px-6 pb-2 text-white text-xs select-none">
           <span>9:41</span>
           <div className="flex gap-1.5">
             <div className="w-4 h-2.5 bg-white rounded-sm"></div>
             <div className="w-0.5 h-2.5 bg-white/30 rounded-sm"></div>
           </div>
        </div>

        {/* Header */}
        <div className="bg-[#1c1c1e] p-4 flex items-center justify-between border-b border-white/10 relative z-10">
           <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-[#007aff] font-inter text-base">Закрыть</button>
           </div>
           <div className="font-inter font-semibold text-white">Kastrylka Bot</div>
           <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-bold">...</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-black text-white p-4 font-inter relative">
           
           {/* Notification */}
           {notification && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-in slide-in-from-top-5 fade-in duration-300 z-50">
               {notification}
             </div>
           )}

           {/* Stories / Banners */}
           <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
              <div className="w-24 h-32 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex-shrink-0 flex items-end p-2 text-xs font-bold">Скидки</div>
              <div className="w-24 h-32 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex-shrink-0 flex items-end p-2 text-xs font-bold">Новинки</div>
              <div className="w-24 h-32 bg-gradient-to-br from-orange-500 to-red-700 rounded-xl flex-shrink-0 flex items-end p-2 text-xs font-bold">Хиты</div>
           </div>

           <h2 className="text-xl font-bold mb-4">Популярное</h2>
           
           <div className="grid grid-cols-2 gap-3 pb-20">
              {products.map(p => (
                <div key={p.id} className="bg-[#1c1c1e] rounded-xl p-3 flex flex-col gap-2">
                   <div className="w-full aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-4xl">
                      {p.img}
                   </div>
                   <div className="text-sm font-semibold">{p.name}</div>
                   <div className="text-[10px] text-zinc-400">{p.desc}</div>
                   <div className="mt-auto flex justify-between items-center">
                      <div className="text-emerald-400 font-bold text-sm">{p.price.toLocaleString()} ₸</div>
                      <button 
                        onClick={() => addToCart(p.id)}
                        className="w-7 h-7 bg-[#007aff] rounded-full flex items-center justify-center text-white hover:bg-blue-500 active:scale-90 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Main Button (Telegram Style) */}
        {cartCount > 0 && (
           <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-10 duration-300">
              <button className="w-full bg-[#007aff] text-white font-inter font-semibold py-3 rounded-xl flex justify-between px-4 active:scale-[0.98] transition-transform shadow-lg shadow-blue-900/20">
                 <span>Оформить заказ</span>
                 <span>{cartTotal.toLocaleString()} ₸</span>
              </button>
           </div>
        )}

      </div>
    </div>
  );
};

// --- VISUAL COMPONENTS ---

const ScalesBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505] overflow-hidden pointer-events-none">
    {/* Texture */}
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
  <div className="flex flex-col min-h-[100dvh] bg-black w-full overflow-y-auto">
    <GlobalStyles />
    <ScalesBackground />
    <div className="relative z-10 flex-1 flex flex-col px-4 py-6 justify-center items-center w-full">
      
      {/* Header */}
      <div className="mb-8 flex flex-col items-center w-full animate-in fade-in slide-in-from-top-10 duration-1000">
        
        {/* Crown Icon */}
        <div className="flex items-center gap-3 mb-6 opacity-60">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-500"></div>
             <Crown size={16} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" strokeWidth={1.5} />
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-500"></div>
        </div>
        
        {/* TITLE */}
        <h1 className="emerald-pulse-glow font-cinzel text-4xl md:text-6xl font-black tracking-[0.15em] leading-none mb-8 text-center select-none">
           TAIPAN<br/>
           <span className="text-white block mt-2">MEDIA</span>
        </h1>

        {/* MISSION STATEMENT CONTAINER */}
        <div className="w-full relative glass-panel p-5 rounded-sm border-t border-b border-emerald-900/30">
           {/* Decorative corners */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50"></div>

           <div className="flex flex-col items-center gap-5 text-center">
               <p className="font-cinzel text-white text-sm tracking-[0.1em] font-bold text-glow leading-normal max-w-[280px]">
                 МЫ СТРОИМ БИЗНЕС<br/>В TELEGRAM
               </p>
               
               <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

               <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20 mb-1">
                        <Hammer size={14} className="text-emerald-400" />
                      </div>
                      <p className="font-montserrat text-zinc-300 text-[10px] tracking-[0.05em] uppercase font-medium leading-relaxed">
                        <span className="text-emerald-500 font-bold block mb-0.5">Бизнесу</span>
                        даем инструмент для сверхприбыли
                      </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20 mb-1">
                        <UserPlus size={14} className="text-emerald-400" />
                      </div>
                      <p className="font-montserrat text-zinc-300 text-[10px] tracking-[0.05em] uppercase font-medium leading-relaxed">
                        <span className="text-emerald-500 font-bold block mb-0.5">Людям</span>
                        даем профессию, чтобы этот инструмент внедрять
                      </p>
                  </div>
               </div>
           </div>
        </div>
      </div>
      
      {/* Cards - Compact touch targets */}
      <div className="grid gap-3 w-full">
        <button 
            onClick={() => setMode('business')} 
            className="group relative bg-zinc-950 border border-zinc-800 p-5 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] active:border-emerald-500/50 hover:bg-zinc-900"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
             <Briefcase className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={18} strokeWidth={1.5} />
          </div>
          <div>
             <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Империя</h3>
             <p className="font-montserrat text-zinc-500 text-[9px] uppercase tracking-widest">Масштабирование</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-700 group-hover:text-emerald-500 transition-colors" size={18} />
        </button>
        
        <button 
            onClick={() => setMode('dev')} 
            className="group relative bg-zinc-950 border border-zinc-800 p-5 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] active:border-emerald-500/50 hover:bg-zinc-900"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
             <Code className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={18} strokeWidth={1.5} />
          </div>
          <div>
             <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Создатель</h3>
             <p className="font-montserrat text-zinc-500 text-[9px] uppercase tracking-widest">Код • Эволюция</p>
          </div>
          <ChevronRight className="ml-auto text-zinc-700 group-hover:text-emerald-500 transition-colors" size={18} />
        </button>
      </div>
    </div>
  </div>
);

// --- NEW DEV VIEW LOGIC ---

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

const WildberriesLogo = () => (
  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#cb11ab] to-[#481173] flex items-center justify-center shadow-lg relative group overflow-hidden">
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
    <span className="font-sans font-black text-white text-2xl tracking-tighter">WB</span>
  </div>
);

const KaspiLogo = () => (
  <div className="w-full h-full rounded-2xl bg-[#f14635] flex items-center justify-center shadow-lg relative group overflow-hidden">
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
    <span className="font-sans font-black text-white text-3xl">K</span>
  </div>
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
        quote: 'Цифровые фантики. Игрушка для гиков.', 
        logo: <div className="w-32 h-32 md:w-48 md:h-48"><BitcoinLogo /></div>,
        isPositive: false
    },
    { 
        year: '2012', 
        title: 'Instagram', 
        quote: 'Фото еды? В этом нет денег.', 
        logo: <div className="w-32 h-32 md:w-48 md:h-48"><InstagramLogo /></div>,
        isPositive: false
    },
    { 
        year: '2019', 
        title: 'Маркетплейсы', 
        quote: 'Люди хотят щупать. Интернет не для продаж.', 
        logo: (
            <div className="flex gap-4 w-full h-full justify-center items-center">
                 <div className="w-16 h-16 md:w-24 md:h-24"><WildberriesLogo /></div>
                 <div className="w-16 h-16 md:w-24 md:h-24"><KaspiLogo /></div>
            </div>
        ),
        isPositive: false
    },
    { 
        year: '2026', 
        title: 'ТЕЛЕГРАМ', 
        quote: 'Экосистема нового мирового порядка. Твой ход.', 
        logo: <div className="w-32 h-32 md:w-48 md:h-48 animate-pulse"><TelegramLogo /></div>,
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
                      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-6 relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out">
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


const BusinessView = ({ setMode, bizParams, setBizParams, onOpenChat }) => {
  const [analysisState, setAnalysisState] = useState('input');
  const [activeTooltip, setActiveTooltip] = useState(null); // State for annotations
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidePhase, setSlidePhase] = useState('in'); // in, visible, out
  const [showDemo, setShowDemo] = useState(false);

  const traffic = Number(bizParams.users) || 0;
  const currentConvRate = Number(bizParams.currentConversion) || 0;
  const margin = Number(bizParams.margin) || 0;
  const check = Number(bizParams.check) || 0;

  const baseRevenue = traffic * (currentConvRate / 100) * check;
  const baseProfit = baseRevenue * (margin / 100);
  const lostPercent = Math.max(0, 100 - currentConvRate);
  const lostProfit = (traffic * (lostPercent / 100) * check) * (margin / 100);
  const recoveredProfit = lostProfit * 0.20;

  const startAnalysis = async () => {
    setAnalysisState('loading');
    setTimeout(() => {
        setAnalysisState('result');
        setSlideIndex(0);
        setSlidePhase('in');
    }, 2000); // Имитация анализа 2 секунды
  };

  // МЕСТО ДЛЯ ВАШИХ ИЗОБРАЖЕНИЙ (Замените ссылки на свои)
  const metricImages = [
    "https://placehold.co/400x300/000000/10B981?text=Трафик+Инфо", // Картинка для Трафика
    "https://placehold.co/400x300/000000/10B981?text=Конверсия+Инфо", // Картинка для Конверсии
    "https://placehold.co/400x300/000000/10B981?text=Средний+Чек", // Картинка для Среднего чека
    "https://placehold.co/400x300/000000/10B981?text=Маржа+Инфо"  // Картинка для Маржи
  ];

  // Data with annotations
  const metrics = [
    { 
        label: 'ТРАФИК', 
        icon: Users, 
        val: bizParams.users, 
        set: (v) => setBizParams({...bizParams, users: v}),
        imageIndex: 0
    },
    { 
        label: 'КОНВЕРСИЯ', 
        icon: Percent, 
        val: bizParams.currentConversion, 
        set: (v) => setBizParams({...bizParams, currentConversion: v}),
        imageIndex: 1
    },
    { 
        label: 'СРЕДНИЙ ЧЕК', 
        icon: Coins, 
        val: bizParams.check, 
        set: (v) => setBizParams({...bizParams, check: v}),
        imageIndex: 2
    },
    { 
        label: 'МАРЖА', 
        icon: Scale, 
        val: bizParams.margin, 
        set: (v) => setBizParams({...bizParams, margin: v}),
        imageIndex: 3
    },
  ];

  const analysisSlides = [
      {
          title: "УТЕЧКА ТРАФИКА",
          val: `${lostPercent.toFixed(0)}%`,
          sub: "Посетителей уходят без покупки",
          desc: "«Вы платите за 100% трафика, но 70% ваших денег сгорает в Direct из-за \"человеческого фактора\"»",
          color: "text-red-600",
          glow: "text-glow-red"
      },
      {
          title: "ФИНАНСОВЫЕ ПОТЕРИ",
          val: formatCurrency(lostProfit),
          sub: "Ваша упущенная чистая прибыль ежемесячно",
          desc: "Эти деньги могли быть в вашей кассе уже сегодня, если бы процесс продажи был автоматизирован.",
          color: "text-red-600",
          glow: "text-glow-red"
      },
      {
          title: "РЫНОК TELEGRAM",
          val: "+400%",
          sub: "Ежегодный рост продаж в мессенджере",
          desc: "«Пока вы сомневаетесь, покупают ли здесь люди, ваши конкуренты уже оформляют заказы. Telegram стал новым Amazon — быстрее, ближе и без лишних кликов».",
          color: "text-white",
          glow: "text-glow"
      },
      {
          title: "РЕШЕНИЕ: ТЕЛЕГРАМ-МАГАЗИН",
          val: formatCurrency(recoveredProfit),
          sub: "Минимальный возврат при внедрении",
          desc: "«Мы не ломаем ваши процессы, мы внедряем Telegram-магазин как мощный рычаг, который автоматически возвращает от 20% потерянной чистой прибыли».",
          color: "text-emerald-500",
          glow: "text-glow"
      }
  ];

  const solutionSlides = [
      {
          title: "ИИ-АЛГОРИТМЫ",
          val: "+30%",
          sub: "К СРЕДНЕМУ ЧЕКУ",
          desc: "Система сама анализирует товары и предлагает блоки «С этим покупают». Рост выручки без участия менеджера и затрат на трафик.",
          color: "text-purple-400",
          glow: "text-glow"
      },
      {
          title: "БЕСПЛАТНЫЙ РЕТАРГЕТИНГ",
          val: "90%",
          sub: "OPEN RATE РАССЫЛОК",
          desc: "Убийца платной рекламы. Умные уведомления приходят прямо в личку, превращая разовую покупку в LTV (пожизненную ценность).",
          color: "text-emerald-400",
          glow: "text-glow"
      },
      {
          title: "АВТОНОМНАЯ КАССА",
          val: "24/7",
          sub: "БИЗНЕС В КАРМАНЕ",
          desc: "Интеграция с платежами и доступ в 2 клика. Магазин продает, пока вы спите. Никакого ожидания в Direct и «человеческого фактора».",
          color: "text-emerald-400",
          glow: "text-glow"
      }
  ];

  const allSlides = [...analysisSlides, ...solutionSlides];

  useEffect(() => {
    if (analysisState === 'result') {
      if (slideIndex < allSlides.length - 1) {
         setSlidePhase('in');
         
         const hideTimer = setTimeout(() => {
             setSlidePhase('out');
         }, 5000); 

         const nextTimer = setTimeout(() => {
             setSlideIndex(prev => prev + 1);
             setSlidePhase('in'); 
         }, 6000); 

         return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
      } else {
         setSlidePhase('in');
      }
    }
  }, [analysisState, slideIndex, allSlides.length]);

  // Show Demo Store Modal
  if (showDemo) {
    return (
        <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-y-auto relative w-full">
            <GlobalStyles />
            <ScalesBackground />
            <DemoStore onClose={() => setShowDemo(false)} />
        </div>
    );
  }

  if (analysisState === 'reviews') {
      return (
        <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-y-auto relative w-full">
            <GlobalStyles />
            <ScalesBackground />
            
            <div className="sticky top-0 z-40 px-4 py-3 bg-black/80 backdrop-blur-xl flex justify-between items-center border-b border-zinc-900">
                <button onClick={() => setAnalysisState('input')} className="w-8 h-8 flex items-center justify-center hover:text-emerald-500 transition-colors">
                    <X size={20}/>
                </button>
                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase animate-pulse font-cinzel">
                    Кейсы
                </span>
                <div className="w-8"></div>
            </div>

            <div className="relative z-10 p-6 max-w-lg mx-auto w-full flex flex-col justify-center items-center min-h-[80vh] animate-in slide-in-from-bottom-10 fade-in duration-700">
                
                <h2 className="text-2xl font-cinzel font-black tracking-wide text-white mb-8 text-center">
                    РЕАЛЬНЫЕ <span className="text-emerald-500 text-glow">РЕЗУЛЬТАТЫ</span>
                </h2>

                <div className="w-full bg-zinc-900/40 border border-zinc-800 p-2 backdrop-blur-md rounded-lg mb-8 relative group overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10"></div>
                    {/* Updated with user provided screenshot */}
                    <img 
                        src="https://i.ibb.co.com/3mNHQCWd/Gemini-Generated-Image-71b25a71b25a71b2.png" 
                        alt="Отзыв клиента" 
                        className="w-full h-auto object-cover rounded opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-3 right-3 z-20">
                        <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-emerald-500/30 text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            Проверено
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowDemo(true)}
                    className="w-full bg-white text-black font-cinzel font-black py-4 uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2 group text-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] rounded-sm"
                >
                    Смотреть живой проект
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

            </div>
        </div>
      );
  }

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
                    <h2 className="text-xl md:text-2xl font-cinzel font-bold tracking-wide text-white mb-4 uppercase leading-snug">
                        Проводим анализ<br/>вашего бизнеса
                    </h2>
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
      const slide = allSlides[slideIndex];
      const isLast = slideIndex === allSlides.length - 1;

      return (
        <div className="flex flex-col h-screen bg-black text-white font-montserrat overflow-y-auto relative w-full justify-center">
            <GlobalStyles />
            <ScalesBackground />
            
            <div className="relative z-10 p-6 max-w-lg mx-auto w-full flex flex-col items-center">
                
                {/* Slide Content with Smoke Animation */}
                <div 
                    className={`w-full text-center ${slidePhase === 'out' ? 'smoke-exit' : 'smoke-enter'}`} 
                    key={`${analysisState}-${slideIndex}`} // Unique key forces re-render for animation
                >
                    {/* Value FIRST */}
                    <div className={`text-6xl md:text-7xl font-cinzel font-black tracking-wide mb-4 ${slide.color} ${slide.glow} animate-num-pulse`}>
                        {slide.val}
                    </div>

                    {/* Title SECOND */}
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em] mb-2">{slide.title}</h3>
                    
                    {/* Subtitle */}
                    <p className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-6 border-b border-zinc-800 pb-4 inline-block">
                        {slide.sub}
                    </p>

                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-md relative overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent"></div>
                        <p className="text-zinc-300 text-xs leading-relaxed font-montserrat">
                            {slide.desc}
                        </p>
                    </div>
                </div>

                {/* Controls - Only on Last Slide */}
                {isLast && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                        <button 
                            onClick={() => setAnalysisState('reviews')}
                            className="w-full bg-white text-black font-cinzel font-black py-4 uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2 group"
                        >
                            Посмотреть примеры
                        </button>
                    </div>
                )}
                
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
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-medium">Сколько вы теряете без нашего магазина</p>
        </div>

        <div className="relative">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-emerald-500/50"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-emerald-500/50"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-emerald-500/50"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-emerald-500/50"></div>

            <div className="p-px bg-zinc-900/30 backdrop-blur-sm border border-zinc-800">
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-8">
                    {metrics.map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            <button 
                                onClick={() => setActiveTooltip(activeTooltip === i ? null : i)}
                                className="flex items-center justify-center gap-1.5 w-full text-[9px] font-bold text-zinc-500 uppercase tracking-[0.1em] hover:text-emerald-500 transition-colors font-cinzel mb-1"
                            >
                                <item.icon size={12} className="opacity-70" /> {item.label}
                                <ImageIcon size={10} className="text-zinc-700 hover:text-emerald-400 transition-colors" />
                            </button>
                            
                            {/* Annotation Popover (IMAGE) */}
                            {activeTooltip === i && (
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-zinc-950 border border-emerald-500/30 p-1 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                    <div className="w-full aspect-[4/3] bg-zinc-900 relative">
                                        <img 
                                            src={metricImages[item.imageIndex]} 
                                            alt={item.label}
                                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 border border-white/5 pointer-events-none"></div>
                                    </div>
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 border-r border-b border-emerald-500/30 rotate-45"></div>
                                </div>
                            )}

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
                        <div className="text-2xl font-cinzel font-bold text-white tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                            {formatCurrency(baseProfit)}
                        </div>
                    </div>

                    <div className="relative bg-red-950/10 border-l-2 border-red-900 p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-[9px] tracking-[0.2em] animate-pulse">
                                <AlertTriangle size={12} /> Внимание
                            </div>
                            <div className="text-[9px] text-zinc-500">
                                Упущенный трафик и конверсия: <span className="text-zinc-300 font-bold">{lostPercent.toFixed(1)}%</span>
                            </div>
                            
                            <div className="flex flex-col items-center w-full">
                                <span className="text-[9px] text-zinc-500 mb-1">В деньгах вы недополучаете:</span>
                                <div className="text-2xl font-cinzel font-bold text-red-600 text-glow-red opacity-90 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                    {formatCurrency(lostProfit)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={startAnalysis} 
                        className="w-full bg-emerald-600 text-black font-cinzel font-black text-xs py-4 uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                    >
                          ПРЕКРАТИТЬ УТЕЧКУ ПРОДАЖ
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
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { sender: 'user', text: input };
    setMessages(p => [...p, msg]);
    setInput('');
    setTimeout(() => {
        setMessages(p => [...p, { sender: 'bot', text: "Система в автономном режиме. Обратитесь к оператору." }]);
    }, 1000);
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
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} onOpenChat={setIsChatOpen} />}
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
