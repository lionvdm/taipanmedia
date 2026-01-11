import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, CreditCard, Users,
  TrendingUp, PieChart, Coins, RefreshCcw, ShoppingBag, Check, FileText,
  BarChart3, BellRing, X, Calculator, Sparkles, Bot, BrainCircuit,
  MessageSquare, Send, Loader2, ArrowDownRight, Terminal, Cpu, Palette,
  Zap, ShieldCheck, Play
} from 'lucide-react';

// --- OPENAI API INTEGRATION ---
// ВАЖНО: Мы берем ключ из переменных окружения Vercel
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const callOpenAIAPI = async (prompt, history = []) => {
  try {
    if (!apiKey) {
      console.error("API Key is missing! Check Vercel Environment Variables.");
      return "ОШИБКА: API ключ не настроен в Vercel. Добавьте REACT_APP_OPENAI_API_KEY.";
    }

    const messages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    messages.unshift({
        role: "system",
        content: `Ты — AI-ассистент элитного агентства Taipan Media. Твой тон: уверенный, профессиональный, немного дерзкий ("хищный"), но вежливый. Ты эксперт в Telegram Mini Apps. 
        Твоя цель: продавать услуги агентства (разработка, аудит) или обучение. 
        Используй эмодзи. Отвечай кратко и по делу.`
    });

    messages.push({ role: 'user', content: prompt });

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o", 
          messages: messages,
          temperature: 0.7
        }),
      }
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        // Если лимиты кончились или ключ забанен, мы увидим это в консоли
        console.error("OpenAI Error:", errorData);
        return `Ошибка API: ${errorData.error?.message || "Неизвестная ошибка"}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка анализа данных.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Связь с сервером прервана. Проверьте интернет или настройки CORS.";
  }
};

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- DATA ---
const PORTFOLIO = [
  { id: 1, title: 'ROMANTIC SHYMKENT', type: 'ЦВЕТОЧНЫЙ БРЕНД #1', stat: '+210%', statLabel: 'РОСТ ПРОДАЖ', img: 'from-rose-500/20 to-rose-900/10' },
  { id: 2, title: 'КАСТРЮЛЬКА ЕДЫ', type: 'ДОСТАВКА ЕДЫ', stat: '+180%', statLabel: 'ПОВТОРНЫЕ ПОКУПКИ', img: 'from-orange-500/20 to-orange-900/10' },
  { id: 3, title: 'VIRGINIA', type: 'МАГАЗИН ТАБАКА', stat: 'x2.5', statLabel: 'ЧАСТОТА ПОКУПОК', img: 'from-zinc-500/20 to-zinc-900/10' },
];

const SERVICES = [
  {
    id: 'dev',
    title: 'ПРОТОКОЛ: КОБРА',
    price: 100000,
    desc: 'ПОЛНАЯ РАЗРАБОТКА MINI APP ПОД КЛЮЧ',
    details: ['Уникальный UI/UX дизайн (Taipan Style)', 'Frontend (React/Vue) + Анимации', 'Backend & База данных', 'Интеграция с Telegram API', 'Админ-панель для управления', 'Техническая поддержка 1 мес.'],
    accent: 'emerald'
  },
  {
    id: 'audit',
    title: 'ПРОТОКОЛ: ПИТОН',
    price: 50000,
    desc: 'АУДИТ БИЗНЕСА И ТЕХНИЧЕСКОЕ ЗАДАНИЕ',
    details: ['Анализ ниши и конкурентов', 'Разработка воронки продаж', 'Техническое задание (ТЗ) для разработки', 'Просчет юнит-экономики', 'Рекомендации по маркетингу'],
    accent: 'blue'
  },
];

// --- COMPONENTS (Backgrounds & Text) ---

const SnakeText = ({ children, className = "" }) => (
  <span className={`font-black ${className}`} style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')`,
      backgroundSize: '150%', backgroundPosition: 'center 40%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 20px rgba(16, 185, 129, 0.4)', filter: 'brightness(1.3) contrast(1.2)', display: 'inline-block', paddingRight: '0.15em'
    }}>{children}</span>
);

const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

const SnakePatternBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-emerald-900/10"></div>
  </div>
);

// --- AI CHAT COMPONENT ---
const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'model', text: 'Taipan AI на связи. Чем могу быть полезен? Рассчитать стоимость или подсказать по стратегии?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const responseText = await callOpenAIAPI(input, messages);
    setMessages(prev => [...prev, { sender: 'model', text: responseText }]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex flex-col font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Bot size={20} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Taipan AI</h3>
            <span className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-full bg-zinc-900"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><Loader2 className="animate-spin text-emerald-500" size={20}/></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <div className="relative flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Спросите что-нибудь..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-emerald-500 focus:outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function TaipanApp() {
  const [mode, setMode] = useState('select'); // select, business, dev
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bizParams, setBizParams] = useState({ users: 1000, currentConversion: 3, check: 15000, margin: 40 });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && (
        <BusinessView 
          setMode={setMode} 
          bizParams={bizParams} 
          setBizParams={setBizParams} 
        />
      )}
      
      {/* Кнопка чата всегда доступна кроме главного экрана выбора */}
      {mode !== 'select' && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/50 hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="text-white" />
        </button>
      )}

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

// --- SUB-VIEWS (SelectView & BusinessView) ---

const SelectView = ({ setMode }) => (
  <div className="flex flex-col h-screen relative overflow-hidden bg-black">
    <SnakePatternBackground />
    <div className="relative z-10 flex-1 flex flex-col p-8 justify-center items-center text-center">
      <h1 className="text-5xl font-black italic mb-4"><SnakeText>TAIPAN MEDIA</SnakeText></h1>
      <p className="text-zinc-400 mb-12">Выберите протокол взаимодействия</p>
      <div className="grid gap-4 w-full max-w-sm">
        <button onClick={() => setMode('business')} className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-emerald-500 transition-all flex justify-between items-center">
          <div className="text-left"><h3 className="font-bold">Бизнес</h3><p className="text-xs text-zinc-500">Масштабирование</p></div>
          <Briefcase className="text-emerald-500" />
        </button>
        <button onClick={() => setMode('dev')} className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-emerald-500 transition-all flex justify-between items-center">
          <div className="text-left"><h3 className="font-bold">Разработка</h3><p className="text-xs text-zinc-500">Обучение и заказы</p></div>
          <Code className="text-emerald-500" />
        </button>
      </div>
    </div>
  </div>
);

const BusinessView = ({ setMode, bizParams, setBizParams }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const handleAI = async () => {
    setIsAnalyzing(true);
    const prompt = `Проанализируй бизнес: Трафик ${bizParams.users}, Чек ${bizParams.check}₸, Конверсия ${bizParams.currentConversion}%. Дай 3 совета по росту через Mini App.`;
    const res = await callOpenAIAPI(prompt);
    setAiAnalysis(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <MeshBackground />
      <div className="relative z-10">
        <button onClick={() => setMode('select')} className="mb-6 text-zinc-500 flex items-center gap-2"><ChevronRight className="rotate-180"/> Назад</button>
        <h2 className="text-2xl font-bold mb-6">Калькулятор прибыли</h2>
        
        <div className="space-y-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-2">ТРАФИК (В МЕСЯЦ)</label>
            <input type="number" value={bizParams.users} onChange={(e) => setBizParams({...bizParams, users: e.target.value})} className="w-full bg-black rounded-xl p-3 border border-zinc-800" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-2">СРЕДНИЙ ЧЕК (₸)</label>
            <input type="number" value={bizParams.check} onChange={(e) => setBizParams({...bizParams, check: e.target.value})} className="w-full bg-black rounded-xl p-3 border border-zinc-800" />
          </div>
          <button onClick={handleAI} disabled={isAnalyzing} className="w-full bg-emerald-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2">
            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} АНАЛИЗ СТРАТЕГИИ
          </button>
        </div>

        {aiAnalysis && (
          <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
            {aiAnalysis}
          </div>
        )}
      </div>
    </div>
  );
};
