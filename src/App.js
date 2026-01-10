import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Code, 
  ChevronRight, 
  ArrowRight, 
  Activity, 
  Lock, 
  CreditCard, 
  Users, 
  TrendingUp, 
  PieChart, 
  Coins, 
  RefreshCcw, 
  ShoppingBag, 
  Check, 
  FileText, 
  BarChart3, 
  BellRing, 
  X,
  Calculator,
  Sparkles,
  Bot,
  BrainCircuit,
  MessageSquare,
  Send,
  Loader2,
  ArrowDownRight
} from 'lucide-react';

// --- GEMINI API INTEGRATION ---
const apiKey = ""; // API key injected by environment

const callGeminiAPI = async (prompt, history = []) => {
  try {
    // Формируем историю чата для контекста
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // Добавляем текущий запрос
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: `Ты — AI-ассистент элитного агентства Taipan Media. Твой тон: уверенный, профессиональный, немного дерзкий ("хищный"), но вежливый. Ты эксперт в Telegram Mini Apps. 
            Твоя цель: продавать услуги агентства (разработка, аудит) или обучение.
            Используй эмодзи. Отвечай кратко и по делу.` }]
          }
        }),
      }
    );
    
    if (!response.ok) {
       throw new Error('API Error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ошибка анализа данных.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Система перегружена. Повторите попытку позже.";
  }
};

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- DATA ---
const PORTFOLIO = [
  { 
    id: 1, 
    title: 'ROMANTIC SHYMKENT', 
    type: 'ЦВЕТОЧНЫЙ БРЕНД #1', 
    stat: '+210%', 
    statLabel: 'РОСТ ПРОДАЖ',
    img: 'from-rose-500/20 to-rose-900/10' 
  },
  { 
    id: 2, 
    title: 'КАСТРЮЛЬКА ЕДЫ', 
    type: 'ДОСТАВКА ЕДЫ', 
    stat: '+180%', 
    statLabel: 'ПОВТОРНЫЕ ПОКУПКИ',
    img: 'from-orange-500/20 to-orange-900/10' 
  },
  { 
    id: 3, 
    title: 'VIRGINIA', 
    type: 'МАГАЗИН ТАБАКА', 
    stat: 'x2.5', 
    statLabel: 'ЧАСТОТА ПОКУПОК',
    img: 'from-zinc-500/20 to-zinc-900/10' 
  },
];

const SERVICES = [
  { 
    id: 'dev', 
    title: 'ПРОТОКОЛ: КОБРА', 
    price: 100000, 
    desc: 'ПОЛНАЯ РАЗРАБОТКА MINI APP ПОД КЛЮЧ',
    details: [
      'Уникальный UI/UX дизайн (Taipan Style)',
      'Frontend (React/Vue) + Анимации',
      'Backend & База данных',
      'Интеграция с Telegram API',
      'Админ-панель для управления',
      'Техническая поддержка 1 мес.'
    ],
    accent: 'emerald'
  },
  { 
    id: 'audit', 
    title: 'ПРОТОКОЛ: ПИТОН', 
    price: 50000, 
    desc: 'АУДИТ БИЗНЕСА И ТЕХНИЧЕСКОЕ ЗАДАНИЕ',
    details: [
      'Анализ ниши и конкурентов',
      'Разработка воронки продаж',
      'Техническое задание (ТЗ) для разработки',
      'Просчет юнит-экономики',
      'Рекомендации по маркетингу'
    ],
    accent: 'blue'
  },
];

// --- SHARED COMPONENTS ---

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

const MatrixBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
    <div className="absolute inset-0 opacity-20" 
         style={{ 
           backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', 
           backgroundSize: '40px 40px' 
         }}>
    </div>
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
      { text: "> ПОДКЛЮЧЕНИЕ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА...", delay: 800 },
      { text: "> АНАЛИЗ РЫНКА...", delay: 1500 },
      { text: "> ДОСТУП РАЗРЕШЕН.", delay: 2200, color: "text-emerald-500 font-bold" },
    ];

    let timeouts = [];
    sequence.forEach(({ text, delay, color }, index) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        if (index === sequence.length - 1) {
          setTimeout(onComplete, 1000);
        }
      }, delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-end p-8 font-mono text-xs md:text-sm">
      {lines.map((line, i) => (
        <div key={i} className={`mb-2 ${line.color || "text-emerald-500/70"}`}>{line.text}</div>
      ))}
      <div className="w-2 h-4 bg-emerald-500 animate-pulse"></div>
    </div>
  );
};

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

// --- AI CHAT COMPONENT ---
const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'model', text: 'Taipan AI на связи. Чем могу быть полезен? Рассчитать стоимость или подсказать по стратегии?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await callGeminiAPI(input, messages);
    
    setMessages(prev => [...prev, { sender: 'model', text: responseText }]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex flex-col font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
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
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-full bg-zinc-900">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-sm border border-zinc-700 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спросите что-нибудь..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all placeholder:text-zinc-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
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
           <span className="text-white/60 text-[10px] font-medium tracking-wide">SYSTEM ONLINE</span>
        </div>
        
        {/* ONE LINE SNAKE TEXT */}
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-4 whitespace-nowrap">
           <SnakeText>TAIPAN MEDIA</SnakeText>
        </h1>
        
        <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs">
          Выберите протокол для продолжения.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        <button 
          onClick={() => setMode('business')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-1 hover:border-emerald-500/50 transition-all duration-500"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-gradient-to-br from-zinc-800/80 to-black/90 rounded-[20px] p-6 h-full relative z-10 text-left backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                   <Briefcase size={24} />
                </div>
                <ArrowRight className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1">Предприниматель</h3>
             <p className="text-zinc-500 text-xs">Масштабирование бизнеса и рост продаж.</p>
          </div>
        </button>

        <button 
          onClick={() => setMode('dev')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-1 hover:border-blue-500/50 transition-all duration-500"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-gradient-to-br from-zinc-800/80 to-black/90 rounded-[20px] p-6 h-full relative z-10 text-left backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                   <Code size={24} />
                </div>
                <ArrowRight className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1">Разработчик</h3>
             <p className="text-zinc-500 text-xs">Обучение созданию Mini Apps и заработок.</p>
          </div>
        </button>
      </div>
    </div>
    
    <div className="relative z-10 p-6 text-center">
        <p className="text-zinc-700 text-[10px] font-medium tracking-widest">EST. 2026 SHYMKENT</p>
    </div>
  </div>
);

const BusinessView = ({ setMode, bizParams, setBizParams }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const FIXED_INVESTMENT = 100000;
  const traffic = bizParams.users;
  const currentConvRate = bizParams.currentConversion;
  
  // Logic
  const lostTrafficRate = Math.max(0, 100 - currentConvRate) / 100;
  const lostClients = Math.floor(traffic * lostTrafficRate);
  const recoveredClients = Math.floor(lostClients * 0.20); 
  const savedRevenue = recoveredClients * bizParams.check; 
  
  const baseClients = Math.floor(traffic * (currentConvRate / 100));
  const baseRevenue = baseClients * bizParams.check;
  
  const totalRevenue = baseRevenue + savedRevenue;
  const totalProfit = Math.floor(totalRevenue * (bizParams.margin / 100));
  
  let roiValue = 0;
  if (FIXED_INVESTMENT > 0) {
      roiValue = ((totalProfit - FIXED_INVESTMENT) / FIXED_INVESTMENT) * 100;
  }
  const roiDisplay = roiValue.toFixed(0);

  const handleAIAnalysis = async () => {
    if (traffic === 0 || bizParams.check === 0) return;
    setIsAnalyzing(true);
    setAiAnalysis('');
    
    const prompt = `Ты - бизнес-аналитик элитного агентства Taipan Media. 
    Входные данные клиента:
    - Трафик: ${traffic} чел/мес
    - Текущая конверсия: ${currentConvRate}%
    - Средний чек: ${bizParams.check} ₸
    - Маржа: ${bizParams.margin}%
    - Прогноз доп. выручки с Taipan (возврат клиентов): ${savedRevenue} ₸
    
    Дай 3 коротких, жестких и стратегически важных совета, как внедрение Telegram Mini App (Push-уведомления, нативная оплата, программа лояльности) увеличит эти показатели.
    Используй стиль "агрессивный бизнес-коучинг". Используй эмодзи. Отвечай списком.`;

    const result = await callGeminiAPI(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Service Detail Modal Renderer
  const renderServiceDetail = () => {
    if (!selectedService) return null;
    return (
      <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col justify-end sm:justify-center p-4 animate-fadeIn">
        <div className="bg-[#111] border border-zinc-800 rounded-3xl p-6 w-full max-w-md mx-auto relative shadow-2xl">
            <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
            >
                <X size={16}/>
            </button>

            <div className="mb-6">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Досье проекта</span>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedService.title}</h2>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                    {formatCurrency(selectedService.price)}
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {selectedService.details.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-emerald-500" />
                        </div>
                        <span className="text-zinc-400 text-sm leading-snug">{item}</span>
                    </div>
                ))}
            </div>

            <button className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl text-sm transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Связаться с менеджером
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto no-scrollbar">
      <MeshBackground />
      {renderServiceDetail()}
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-[#050505]/80 backdrop-blur-md flex justify-between items-center border-b border-white/5">
        <button onClick={() => setMode('select')} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
          <ChevronRight className="rotate-180" size={18}/>
        </button>
        <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Бизнес Модуль</span>
        <div className="w-8"></div>
      </div>

      <div className="p-4 relative z-10 pb-32 max-w-md mx-auto w-full">
        
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Calculator size={20} className="text-emerald-500" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-white leading-tight">Прогноз <br/>Эффективности</h2>
           </div>
        </div>

        {/* Premium Calculator Card */}
        <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-[28px] overflow-hidden shadow-2xl relative mb-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="p-6 space-y-6">
             
             {/* Input Group */}
             <div className="space-y-4">
                <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-2">Трафик в месяц</label>
                   <div className="flex items-center gap-3">
                      <Users size={18} className="text-zinc-600"/>
                      <input 
                         type="number" 
                         value={bizParams.users || ''} 
                         onChange={(e) => setBizParams({...bizParams, users: Math.max(0, parseInt(e.target.value) || 0)})}
                         className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-zinc-700"
                         placeholder="0"
                      />
                   </div>
                </div>

                <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-2">Текущая конверсия (%)</label>
                   <div className="flex items-center gap-3">
                      <TrendingUp size={18} className="text-zinc-600"/>
                      <input 
                         type="number" 
                         value={bizParams.currentConversion || ''} 
                         onChange={(e) => setBizParams({...bizParams, currentConversion: Math.max(0, parseFloat(e.target.value) || 0)})}
                         className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-zinc-700"
                         placeholder="0"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-2">Ср. чек (₸)</label>
                      <input 
                         type="number" 
                         value={bizParams.check || ''} 
                         onChange={(e) => setBizParams({...bizParams, check: Math.max(0, parseInt(e.target.value) || 0)})}
                         className="w-full bg-transparent text-white text-lg font-bold focus:outline-none placeholder:text-zinc-700"
                         placeholder="0"
                      />
                   </div>
                   <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-2">Маржа (%)</label>
                      <input 
                         type="number" 
                         value={bizParams.margin || ''} 
                         onChange={(e) => setBizParams({...bizParams, margin: Math.max(0, parseFloat(e.target.value) || 0)})}
                         className="w-full bg-transparent text-white text-lg font-bold focus:outline-none placeholder:text-zinc-700"
                         placeholder="0"
                      />
                   </div>
                </div>
             </div>

             {/* Constant */}
             <div className="flex justify-between items-center px-2 opacity-50">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1.5"><Lock size={10}/> Стоимость внедрения</span>
                 <span className="text-[10px] font-bold text-white">100 000 ₸</span>
             </div>

             {/* Result Card */}
             <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-black p-6 border border-emerald-500/20 shadow-lg">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <div className="text-[10px] text-emerald-200/60 uppercase font-bold tracking-widest mb-1">Чистая прибыль (мес)</div>
                         <div className="text-3xl font-bold text-white tracking-tight">{formatCurrency(totalProfit)}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-emerald-200/60 uppercase font-bold tracking-widest mb-1">ROI</div>
                         <div className="text-3xl font-bold text-emerald-400">{roiValue > 0 ? '+' : ''}{roiDisplay}%</div>
                      </div>
                   </div>

                   {/* Visual Bar - Saved Revenue */}
                   <div className="bg-black/30 rounded-xl p-3 border border-white/5 backdrop-blur-sm mb-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            ВОЗВРАТ ПОТЕРЯННЫХ
                         </span>
                         <span className="text-xs font-bold text-emerald-400">{formatCurrency(savedRevenue)}</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <p className="text-[9px] text-zinc-400 mt-2 leading-snug">
                         Taipan автоматически возвращает 20% клиентов, которые ушли без покупки.
                      </p>
                   </div>
                   
                   {/* AI Analyze Button - NEW */}
                   <button 
                      onClick={handleAIAnalysis}
                      disabled={isAnalyzing || bizParams.users === 0}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-[10px] py-3 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                      {isAnalyzing ? (
                        <>
                           <Loader2 size={14} className="animate-spin text-emerald-500"/>
                           АНАЛИЗ...
                        </>
                      ) : (
                        <>
                           <Sparkles size={14} className="text-amber-400"/>
                           СГЕНЕРИРОВАТЬ СТРАТЕГИЮ
                        </>
                      )}
                   </button>

                </div>
             </div>
             
             {/* AI Analysis Result Display */}
             {aiAnalysis && (
                <div className="animate-fadeIn mt-6 bg-[#0A0A0A] border border-emerald-500/20 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-transparent to-transparent"></div>
                   <div className="flex items-center gap-2 mb-4">
                      <BrainCircuit size={18} className="text-emerald-400"/>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Стратегия Taipan AI</h4>
                   </div>
                   <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                      {aiAnalysis}
                   </div>
                </div>
             )}
             
             <div className="text-center">
                <p className="text-[9px] text-zinc-600">
                  *ROI = (Прибыль за месяц - 100 000 ₸) / 100 000 ₸ × 100%
                </p>
             </div>

          </div>
        </div>

        {/* Cases */}
        <div className="mb-10">
           <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 px-2">
             <Activity size={18} className="text-emerald-500"/> Кейсы
           </h3>
           <div className="space-y-3">
             {PORTFOLIO.map(item => (
               <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.img} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative z-10 flex justify-between items-center">
                      <div>
                         <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                         <div className="text-[10px] text-zinc-500 font-bold tracking-wide uppercase bg-black/40 inline-block px-2 py-0.5 rounded border border-white/5">{item.type}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-emerald-500 font-bold text-lg">{item.stat}</div>
                         <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">{item.statLabel}</div>
                      </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Services */}
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 px-2">
           <ShoppingBag size={18} className="text-emerald-500"/> Пакеты
        </h3>
        <div className="grid gap-4">
           {SERVICES.map(srv => (
             <div key={srv.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm group hover:bg-zinc-900 transition-all">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${srv.accent === 'emerald' ? 'emerald' : 'blue'}-500/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-${srv.accent === 'emerald' ? 'emerald' : 'blue'}-500/10 transition-all`}></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-bold text-sm tracking-wide">{srv.title}</div>
                   </div>
                   <div className="text-2xl font-bold text-white mb-2 tracking-tight">{formatCurrency(srv.price)}</div>
                   <p className="text-zinc-500 text-xs mb-5 line-clamp-2 leading-relaxed">{srv.desc}</p>
                   <button 
                      onClick={() => setSelectedService(srv)} 
                      className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors"
                   >
                      Подробнее
                   </button>
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

const DevView = ({ setMode }) => {
  const [devStep, setDevStep] = useState(0);
  const [roleAnalysis, setRoleAnalysis] = useState('');
  const [isAnalyzingRole, setIsAnalyzingRole] = useState(false);

  const handleRoleSelect = async (role) => {
      setDevStep(3); // Loading step
      setIsAnalyzingRole(true);
      
      const prompt = `Ты - мотивационный ментор в IT-академии Taipan.
      Пользователь выбрал роль: "${role}".
      Объясни ему в 2-3 предложениях, почему эта роль идеально подходит для старта в разработке Telegram Mini Apps и как он сможет выйти на доход 100 000+ тенге.
      Стиль: вдохновляющий, уверенный, "ты сможешь". Без воды.`;

      const analysis = await callGeminiAPI(prompt);
      setRoleAnalysis(analysis);
      setIsAnalyzingRole(false);
      setDevStep(4); // Result step
  };

  const steps = [
    // Step 0: Manifesto
    (
      <div className="animate-fadeIn pb-24">
         <div className="bg-[#111] border border-zinc-800 rounded-3xl p-6 mb-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
             <h3 className="text-2xl font-bold text-white mb-4">MANIFESTO <span className="text-zinc-600">V1</span></h3>
             <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
                <p>❌ 2009: Bitcoin был "шуткой".</p>
                <p>❌ 2012: Instagram был "просто фотками".</p>
                <p className="text-white font-medium">✅ 2026: Telegram Apps — это новый веб.</p>
             </div>
             <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-500 mb-4">Ты будешь снова смотреть? Или начнешь кодить будущее?</p>
                <button onClick={() => setDevStep(1)} className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">Запустить Протокол</button>
             </div>
         </div>
      </div>
    ),
    // Step 1: FAQ
    (
      <div className="animate-fadeIn pb-24">
         <div className="bg-[#111] border border-zinc-800 rounded-3xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">FAQ</h3>
            <div className="space-y-4">
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-xs font-bold text-blue-500 mb-1">СПРОС?</div>
                <p className="text-zinc-400 text-xs">8,000 запросов бизнеса/мес. Рынок пуст.</p>
              </div>
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-xs font-bold text-blue-500 mb-1">ДЕНЬГИ?</div>
                <p className="text-zinc-400 text-xs">Чек от 100к. Один клиент = окупаемость.</p>
              </div>
            </div>
            <button onClick={() => setDevStep(2)} className="w-full mt-6 py-4 border border-zinc-700 text-white font-bold uppercase tracking-wider hover:bg-zinc-800 rounded-xl">Далее</button>
         </div>
      </div>
    ),
    // Step 2: Role Selection
    (
      <div className="animate-fadeIn pb-24">
         <h3 className="text-xl font-bold text-white mb-4 px-2">ВЫБОР КЛАССА</h3>
         <div className="grid grid-cols-2 gap-3">
            {['БЕЗ РАБОТЫ', 'СТУДЕНТ', 'ФРИЛАНСЕР', 'В НАЙМЕ'].map((role) => (
              <button key={role} onClick={() => handleRoleSelect(role)} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-blue-500 text-zinc-400 text-xs font-bold transition-all h-24 flex items-center justify-center text-center">{role}</button>
            ))}
         </div>
      </div>
    ),
    // Step 3: Loading
    (
       <div className="flex flex-col items-center justify-center h-64 animate-fadeIn">
           <Bot size={48} className="text-blue-500 mb-4 animate-bounce" />
           <p className="text-zinc-400 text-xs uppercase tracking-widest">AI Анализирует профиль...</p>
       </div>
    ),
    // Step 4: Result (Offer)
    (
      <div className="animate-fadeIn pb-24">
         <div className="bg-[#111] border border-zinc-800 rounded-3xl p-6 text-center">
            
            {/* AI Insight */}
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mb-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles size={16} className="text-blue-400"/></div>
                <p className="text-zinc-300 text-xs leading-relaxed italic">
                    "{roleAnalysis}"
                </p>
            </div>

            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20"><Lock size={32} className="text-blue-500"/></div>
            <h2 className="text-2xl font-bold text-white mb-2">ДОСТУП ОГРАНИЧЕН</h2>
            <p className="text-zinc-500 text-xs mb-6">Полный доступ к Академии требует авторизации.</p>
            
            <div className="bg-zinc-900 rounded-xl p-4 mb-6 text-left space-y-2">
               <div className="flex justify-between text-sm"><span className="text-zinc-400">Базовый</span><span className="text-white font-bold">50 000 ₸</span></div>
               <div className="flex justify-between text-sm"><span className="text-zinc-400">VIP Ментор</span><span className="text-blue-500 font-bold">150 000 ₸</span></div>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-500">Написать 'СТАРТ'</button>
            <button onClick={() => setDevStep(0)} className="block w-full mt-4 text-zinc-600 text-xs hover:text-white">В начало</button>
         </div>
      </div>
    )
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto no-scrollbar">
      <MeshBackground />
      <div className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center">
        <button onClick={() => setMode('select')} className="text-zinc-500 hover:text-white flex items-center gap-1 text-xs"><ChevronRight className="rotate-180" size={14}/> Выход</button>
        <div className="text-blue-500 font-bold tracking-widest text-xs">DEV_MODE</div>
      </div>
      <div className="p-6 flex-1 flex flex-col relative z-10">{steps[devStep]}</div> 
    </div>
  );
};

// --- MAIN WRAPPER ---
const TaipanAgencyApp = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('select'); 
  const [bizParams, setBizParams] = useState({ 
    users: 0, 
    check: 0, 
    margin: 0,
    currentConversion: 0
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading) return <TerminalSplash onComplete={() => setLoading(false)} />;

  return (
    <>
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
      {mode === 'dev' && <DevView setMode={setMode} />}
      
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-50 hover:scale-110 transition-transform"
      >
        <MessageSquare size={24} className="text-white" fill="currentColor" />
      </button>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default TaipanAgencyApp;
