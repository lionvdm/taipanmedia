import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Briefcase, 
  Code, 
  ChevronRight, 
  ArrowRight, 
  Activity, 
  Lock, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Check, 
  Calculator,
  X
} from 'lucide-react';

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- DATA ---
const PORTFOLIO = [
  { id: 1, title: 'ROMANTIC SHYMKENT', type: 'ЦВЕТОЧНЫЙ БРЕНД #1', stat: '+210%', statLabel: 'РОСТ ПРОДАЖ', img: 'from-rose-500/20 to-rose-900/10' },
  { id: 2, title: 'КАСТРЮЛЬКА ЕДЫ', type: 'ДОСТАВКА ЕДЫ', stat: '+180%', statLabel: 'ПОВТОРНЫЕ ПОКУПКИ', img: 'from-orange-500/20 to-orange-900/10' },
  { id: 3, title: 'VIRGINIA', type: 'МАГАЗИН ТАБАКА', stat: 'x2.5', statLabel: 'ЧАСТОТА ПОКУПОК', img: 'from-zinc-500/20 to-zinc-900/10' },
];

const SERVICES = [
  { id: 'dev', title: 'ПРОТОКОЛ: КОБРА', price: 100000, desc: 'ПОЛНАЯ РАЗРАБОТКА MINI APP ПОД КЛЮЧ', details: ['Уникальный UI/UX дизайн', 'Frontend (React) + Анимации', 'Backend & База данных', 'Интеграция с Telegram API', 'Админ-панель', 'Техподдержка 1 мес.'], accent: 'emerald' },
  { id: 'audit', title: 'ПРОТОКОЛ: ПИТОН', price: 50000, desc: 'АУДИТ БИЗНЕСА И ТЗ', details: ['Анализ ниши', 'Разработка воронки', 'Техническое задание', 'Просчет юнит-экономики', 'Рекомендации'], accent: 'blue' },
];

// --- COMPONENTS ---

const SnakeText = ({ children, className = "" }) => (
  <span 
    className={`font-black ${className}`}
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')`, 
      backgroundSize: '150%', 
      backgroundPosition: 'center 40%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 20px rgba(16, 185, 129, 0.4)',
      filter: 'brightness(1.3) contrast(1.2)', 
      display: 'inline-block',
      paddingRight: '0.15em' 
    }}
  >
    {children}
  </span>
);

const SnakePatternBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-emerald-900/10"></div>
  </div>
);

const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "> ЗАГРУЗКА СИСТЕМЫ...", delay: 200 },
      { text: "> ПОДКЛЮЧЕНИЕ ИИ...", delay: 800 },
      { text: "> АНАЛИЗ РЫНКА...", delay: 1500 },
      { text: "> ДОСТУП РАЗРЕШЕН.", delay: 2200, color: "text-emerald-500 font-bold" },
    ];
    let timeouts = sequence.map(({ text, delay, color }, index) => 
      setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        if (index === sequence.length - 1) setTimeout(onComplete, 1000);
      }, delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-end p-8 font-mono text-xs md:text-sm">
      {lines.map((line, i) => (
        <div key={i} className={`mb-2 ${line.color || "text-emerald-500/70"}`}>{line.text}</div>
      ))}
      <div className="w-2 h-4 bg-emerald-500 animate-pulse"></div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('select'); 
  const [selectedService, setSelectedService] = useState(null); 
  const [bizParams, setBizParams] = useState({ users: 0, check: 0, margin: 0, currentConversion: 0 });

  if (loading) return <TerminalSplash onComplete={() => setLoading(false)} />;

  if (mode === 'select') {
    return (
      <div className="flex flex-col h-screen relative overflow-hidden font-sans bg-black">
        <SnakePatternBackground />
        <div className="relative z-10 flex-1 flex flex-col p-8 justify-center max-w-md mx-auto w-full">
          <div className="mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-white/60 text-[10px] font-medium tracking-wide">SYSTEM ONLINE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-4">
               <SnakeText>TAIPAN MEDIA</SnakeText>
            </h1>
            <p className="text-zinc-400 text-sm font-light">Выберите протокол для продолжения.</p>
          </div>

          <div className="grid gap-4">
            <button onClick={() => setMode('business')} className="group relative rounded-3xl bg-zinc-900/80 border border-zinc-800 p-1 hover:border-emerald-500/50 transition-all">
              <div className="bg-gradient-to-br from-zinc-800 to-black rounded-[20px] p-6 text-left">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"><Briefcase size={24} /></div>
                    <ArrowRight className="text-zinc-700 group-hover:text-emerald-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Предприниматель</h3>
                 <p className="text-zinc-500 text-xs">Масштабирование и рост продаж.</p>
              </div>
            </button>
            <button onClick={() => setMode('dev')} className="group relative rounded-3xl bg-zinc-900/80 border border-zinc-800 p-1 hover:border-blue-500/50 transition-all">
              <div className="bg-gradient-to-br from-zinc-800 to-black rounded-[20px] p-6 text-left">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><Code size={24} /></div>
                    <ArrowRight className="text-zinc-700 group-hover:text-blue-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Разработчик</h3>
                 <p className="text-zinc-500 text-xs">Обучение и создание Mini Apps.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'business') {
    const FIXED_INVESTMENT = 100000;
    const traffic = bizParams.users;
    const currentConvRate = bizParams.currentConversion;
    const lostClients = traffic * ((100 - currentConvRate) / 100);
    const recoveredClients = Math.floor(lostClients * 0.20); 
    const savedRevenue = recoveredClients * bizParams.check; 
    const baseRevenue = Math.floor(traffic * (currentConvRate / 100)) * bizParams.check;
    const totalProfit = Math.floor((baseRevenue + savedRevenue) * (bizParams.margin / 100));
    const roiValue = FIXED_INVESTMENT > 0 ? ((totalProfit - FIXED_INVESTMENT) / FIXED_INVESTMENT) * 100 : 0;

    return (
      <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto">
        <MeshBackground />
        <div className="sticky top-0 z-40 px-6 py-4 bg-[#050505]/80 backdrop-blur-md flex justify-between items-center border-b border-white/5">
          <button onClick={() => setMode('select')} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><ChevronRight className="rotate-180" size={18}/></button>
          <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">БИЗНЕС МОДУЛЬ</span>
          <div className="w-8"></div>
        </div>

        <div className="p-6 relative z-10 pb-32 max-w-md mx-auto w-full">
          <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-[28px] p-6 mb-10 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calculator size={20} className="text-emerald-500"/> Калькулятор ROI</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Трафик / мес</label>
                <input type="number" value={bizParams.users || ''} onChange={(e) => setBizParams({...bizParams, users: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-white text-xl font-bold focus:outline-none" placeholder="0"/>
              </div>
              <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Ср. чек (₸)</label>
                <input type="number" value={bizParams.check || ''} onChange={(e) => setBizParams({...bizParams, check: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-white text-xl font-bold focus:outline-none" placeholder="0"/>
              </div>
              <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Маржа (%)</label>
                <input type="number" value={bizParams.margin || ''} onChange={(e) => setBizParams({...bizParams, margin: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-white text-xl font-bold focus:outline-none" placeholder="0"/>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-black p-6 border border-emerald-500/20">
               <div className="text-[10px] text-emerald-200/60 uppercase font-bold mb-1">Прибыль / мес</div>
               <div className="text-3xl font-bold mb-4">{formatCurrency(totalProfit)}</div>
               <div className="text-[10px] text-emerald-200/60 uppercase font-bold mb-1">ROI</div>
               <div className="text-3xl font-bold text-emerald-400">{roiValue.toFixed(0)}%</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 px-2"><Activity size={18} className="text-emerald-500"/> Кейсы</h3>
            {PORTFOLIO.map(item => (
              <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-sm">{item.title}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">{item.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-500 font-bold">{item.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'dev') {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <MeshBackground />
        <div className="p-10 relative z-10 text-center">
          <h2 className="text-2xl font-bold mb-4">DEV MODE</h2>
          <p className="text-zinc-500 mb-8">Раздел в разработке...</p>
          <button onClick={() => setMode('select')} className="text-emerald-500 underline">Вернуться</button>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
