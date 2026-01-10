import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, 
  Users, TrendingUp, ShoppingBag, Check, X, Calculator,
  Sparkles, Bot, BrainCircuit, Send, Loader2
} from 'lucide-react';

// --- API INTEGRATION (OPENAI) ---
const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("API Key not found in Vercel. Using Demo Mode.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "🚀 Стратегия Taipan (Демо): Внедрите Push-рассылки и программу лояльности. Это вернет до 20% клиентов!";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты — AI-ассистент агентства Taipan Media. Твой тон: уверенный, дерзкий, экспертный. Ты профи в Telegram Mini Apps. Отвечай коротко, используй эмодзи." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка получения ответа.";
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Связь прервана. Проверьте баланс API.";
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- DATA ---
const PORTFOLIO = [
  { id: 1, title: 'ROMANTIC SHYMKENT', type: 'ЦВЕТОЧНЫЙ БРЕНД #1', stat: '+210%', statLabel: 'РОСТ ПРОДАЖ', img: 'from-rose-500/20 to-rose-900/10' },
  { id: 2, title: 'КАСТРЮЛЬКА ЕДЫ', type: 'ДОСТАВКА ЕДЫ', stat: '+180%', statLabel: 'ПОВТОРНЫЕ ПОКУПКИ', img: 'from-orange-500/20 to-orange-900/10' },
  { id: 3, title: 'VIRGINIA', type: 'МАГАЗИН ТАБАКА', stat: 'x2.5', statLabel: 'ЧАСТОТА ПОКУПОК', img: 'from-zinc-500/20 to-zinc-900/10' },
];

const SERVICES = [
  { id: 'dev', title: 'ПРОТОКОЛ: КОБРА', price: 100000, desc: 'MINI APP ПОД КЛЮЧ', details: ['UI/UX дизайн', 'Frontend + Анимации', 'Backend & База', 'Telegram API', 'Админка'], accent: 'emerald' },
  { id: 'audit', title: 'ПРОТОКОЛ: ПИТОН', price: 50000, desc: 'АУДИТ И ТЗ', details: ['Анализ ниши', 'Воронка продаж', 'ТЗ для разработки', 'Юнит-экономика'], accent: 'blue' },
];

// --- STYLED COMPONENTS ---
const SnakeText = ({ children }) => (
  <span className="font-black italic tracking-tighter" style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'brightness(1.3) contrast(1.2)',
    display: 'inline-block'
  }}>
    {children}
  </span>
);

const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('select');
  const [bizParams, setBizParams] = useState({ users: 5000, check: 12000, margin: 30, currentConversion: 2 });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const prompt = `Бизнес: Трафик ${bizParams.users}, Чек ${bizParams.check}тг, Маржа ${bizParams.margin}%. Дай 3 совета по росту через Telegram Mini App.`;
    const result = await callOpenAIAPI(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center font-mono text-emerald-500">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="animate-pulse tracking-widest text-xs">INITIALIZING TAIPAN_CORE...</p>
    </div>
  );

  if (mode === 'select') return (
    <div className="flex flex-col h-screen bg-black relative overflow-hidden items-center justify-center p-8 text-center">
      <MeshBackground />
      <div className="relative z-10 max-w-md w-full">
        <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-6 backdrop-blur-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-emerald-500/80 text-[10px] font-bold tracking-widest">SYSTEM ONLINE</span>
            </div>
            <h1 className="text-5xl font-black mb-4"><SnakeText>TAIPAN MEDIA</SnakeText></h1>
            <p className="text-zinc-500 text-sm">Выберите протокол для входа в систему</p>
        </div>
        <div className="grid gap-4">
          <button onClick={() => setMode('business')} className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-[32px] text-left hover:border-emerald-500/50 transition-all backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Briefcase className="text-emerald-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-1">Бизнес</h3>
            <p className="text-zinc-500 text-xs italic">Масштабирование и AI-стратегии</p>
          </button>
          <button onClick={() => setMode('dev')} className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-[32px] text-left hover:border-blue-500/50 transition-all backdrop-blur-xl">
            <Code className="text-blue-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-1">Разработчик</h3>
            <p className="text-zinc-500 text-xs italic">Протоколы разработки и обучение</p>
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === 'business') {
    const totalProfit = Math.floor((bizParams.users * (bizParams.currentConversion/100) * bizParams.check) * (bizParams.margin/100));
    const roi = (((totalProfit - 100000) / 100000) * 100).toFixed(0);

    return (
      <div className="min-h-screen bg-black text-white relative font-sans p-6 overflow-y-auto pb-32">
        <MeshBackground />
        <div className="relative z-10 max-w-md mx-auto">
          <button onClick={() => setMode('select')} className="mb-8 text-zinc-500 flex items-center gap-2 hover:text-white transition-colors">
            <ChevronRight className="rotate-180" size={20}/> <span className="text-xs font-bold uppercase tracking-widest">Назад</span>
          </button>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-xl mb-8">
            <div className="flex items-center gap-3 mb-8">
               <Calculator className="text-emerald-500" />
               <h2 className="text-2xl font-black italic tracking-tighter">КАЛЬКУЛЯТОР_РОСТА</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Трафик / Мес', key: 'users', icon: Users },
                { label: 'Ср. Чек (₸)', key: 'check', icon: TrendingUp },
                { label: 'Маржа (%)', key: 'margin', icon: Activity }
              ].map((input) => (
                <div key={input.key} className="bg-black/40 rounded-2xl p-4 border border-zinc-800">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{input.label}</label>
                  <input 
                    type="number" 
                    value={bizParams[input.key]} 
                    onChange={(e) => setBizParams({...bizParams, [input.key]: parseInt(e.target.value) || 0})}
                    className="w-full bg-transparent text-xl font-bold outline-none text-emerald-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-emerald-500 rounded-[24px] text-black">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-70">Прибыль в месяц</p>
                    <h3 className="text-3xl font-black tracking-tighter">{formatCurrency(totalProfit)}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-70">ROI</p>
                    <h3 className="text-2xl font-black">{roi}%</h3>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-6 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all uppercase text-xs tracking-widest"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
              Сгенерировать стратегию
            </button>
          </div>

          {aiAnalysis && (
            <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-[32px] p-8 animate-in slide-in-from-bottom-5">
              <h4 className="flex items-center gap-2 text-emerald-500 font-bold mb-4 uppercase text-xs tracking-widest">
                <BrainCircuit size={18}/> Taipan AI Анализ
              </h4>
              <div className="text-sm text-zinc-300 leading-relaxed italic whitespace-pre-line">
                {aiAnalysis}
              </div>
            </div>
          )}

          <div className="mt-12 space-y-4">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 px-4">Наше портфолио</h3>
             {PORTFOLIO.map(item => (
               <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-[28px] flex justify-between items-center backdrop-blur-sm">
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-500 font-black text-xl italic">{item.stat}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Floating Chat Button */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 hover:scale-110 transition-transform z-50"
        >
          <Bot className="text-black" size={28} />
        </button>

        {isChatOpen && (
          <div className="fixed inset-0 z-[100] bg-black p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black italic"><SnakeText>TAIPAN_CHAT</SnakeText></h2>
               <button onClick={() => setIsChatOpen(false)} className="p-3 bg-zinc-900 rounded-full text-white"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
               <div className="bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none border border-zinc-800 text-sm italic">
                  Система активна. Какой протокол вас интересует?
               </div>
            </div>
            <div className="mt-4 flex gap-2">
               <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500" placeholder="Запрос системе..." />
               <button className="p-4 bg-emerald-500 rounded-2xl text-black font-bold"><Send size={20}/></button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'dev') return (
    <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center justify-center text-center">
       <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
          <Lock className="text-blue-500" size={32}/>
       </div>
       <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">Доступ заблокирован</h2>
       <p className="text-zinc-500 text-sm max-w-xs mb-8 italic">Протокол "КОБРА" доступен только авторизованным партнерам Taipan Media.</p>
       <button onClick={() => setMode('select')} className="text-blue-500 font-bold uppercase text-xs tracking-widest border-b border-blue-500 pb-1">Вернуться в терминал</button>
    </div>
  );

  return null;
}
