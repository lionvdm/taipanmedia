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
  ArrowDownRight,
  Terminal,
  Cpu,
  Palette,
  Zap,
  ShieldCheck,
  Play
} from 'lucide-react';

// --- OPENAI API INTEGRATION ---
const apiKey = "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"; 

const callOpenAIAPI = async (prompt, history = []) => {
  try {
    if (!apiKey) {
      // Mock response if API key is missing
      await new Promise(r => setTimeout(r, 2000));
      return "СИСТЕМА: API ключ не обнаружен. Проверьте настройки.";
    }

    // Формируем историю сообщений для OpenAI
    // OpenAI использует роли: 'system', 'user', 'assistant'
    const messages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Добавляем системный промпт
    messages.unshift({
        role: "system",
        content: `Ты — AI-ассистент элитного агентства Taipan Media. Твой тон: уверенный, профессиональный, немного дерзкий ("хищный"), но вежливый. Ты эксперт в Telegram Mini Apps. 
        Твоя цель: продавать услуги агентства (разработка, аудит) или обучение. 
        Используй эмодзи. Отвечай кратко и по делу.`
    });

    // Добавляем текущий запрос пользователя
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
          model: "gpt-4o", // Используем актуальную модель
          messages: messages,
          temperature: 0.7
        }),
      }
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error Details:", errorData);
        throw new Error('API Error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка анализа данных.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
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

const DEV_ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Архитектор',
    icon: <Code size={24} />,
    desc: 'Визуал, анимации, интерфейсы. Ты делаешь так, чтобы это выглядело дорого.',
    color: 'emerald'
  },
  {
    id: 'backend',
    title: 'Backend Инженер',
    icon: <Cpu size={24} />,
    desc: 'Логика, базы данных, API. Ты строишь "мозги" системы.',
    color: 'blue'
  },
  {
    id: 'design',
    title: 'UI/UX Дизайнер',
    icon: <Palette size={24} />,
    desc: 'Стиль, психология, удобство. Ты управляешь вниманием пользователя.',
    color: 'purple'
  },
  {
    id: 'traffic',
    title: 'Арбитраж Трафика',
    icon: <Zap size={24} />,
    desc: 'Реклама, воронки, лиды. Ты приводишь клиентов и делаешь кэш.',
    color: 'amber'
  }
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
      { text: "> ЗАГРУЗКА ЯДРА...", delay: 200 },
      { text: "> ПОДКЛЮЧЕНИЕ НЕЙРОСЕТИ...", delay: 800 },
      { text: "> АНАЛИЗ РЫНКА...", delay: 1500 },
      { text: "> ПРОТОКОЛ TAIPAN АКТИВИРОВАН.", delay: 2200, color: "text-emerald-500 font-bold" },
    ];

    let timeouts = [];
    sequence.forEach(({ text, delay, color }, index) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        if (index === sequence.length - 1) {
          setTimeout(onComplete, 1200);
        }
      }, delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-end p-8 font-mono text-xs md:text-sm">
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

    const responseText = await callOpenAIAPI(input, messages);
    
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
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
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
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/20"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-white/60 text-[10px] font-medium tracking-wide">SYSTEM ONLINE</span>
        </div>
        
        {/* ONE LINE SNAKE TEXT */}
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-4 whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
           <SnakeText>TAIPAN MEDIA</SnakeText>
        </h1>
        
        <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs animate-in fade-in duration-700 delay-200">
          Выберите свой протокол для продолжения.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <button
          onClick={() => setMode('business')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-1 hover:border-emerald-500/50 transition-all duration-500 active:scale-[0.98]"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-gradient-to-br from-zinc-800/80 to-black/90 rounded-[20px] p-6 h-full relative z-10 text-left backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform">
                   <Briefcase size={24} />
                </div>
                <ArrowRight className="text-zinc-700 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1 duration-300" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1">Предприниматель</h3>
             <p className="text-zinc-500 text-xs">Масштабирование бизнеса и рост продаж.</p>
          </div>
        </button>

        <button
          onClick={() => setMode('dev')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-1 hover:border-blue-500/50 transition-all duration-500 active:scale-[0.98]"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-gradient-to-br from-zinc-800/80 to-black/90 rounded-[20px] p-6 h-full relative z-10 text-left backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-110 transition-transform">
                   <Code size={24} />
                </div>
                <ArrowRight className="text-zinc-700 group-hover:text-blue-500 transition-colors group-hover:translate-x-1 duration-300" />
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
    
    const prompt = `Ты - ведущий стратег Taipan Media.
    
    ЦИФРЫ КЛИЕНТА:
    - Трафик: ${traffic} клиентов/мес
    - Конверсия: ${currentConvRate}% (значит ${100 - currentConvRate}% уходят без покупки!)
    - Средний чек: ${bizParams.check} ₸
    - Потенциал возврата (Saved Revenue): ${savedRevenue} ₸ в месяц
    
    ЗАДАЧА:
    1. Напиши стратегию масштабирования на основе этих цифр.
    2. Объясни, ПОЧЕМУ Taipan Store (наше Mini App решение) спасает эти упущенные продажи, в отличие от обычного сайта.
    3. Докажи, как именно мы вернем эти деньги в бизнес (инструменты: Push-рассылки, программа лояльности, "дожим" через бота).
    
    Тон: Дерзкий, экспертный, убедительный. Без "воды". Используй эмодзи.`;

    const result = await callOpenAIAPI(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Service Detail Modal Renderer
  const renderServiceDetail = () => {
    if (!selectedService) return null;
    return (
      <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col justify-end sm:justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-[#111] border border-zinc-800 rounded-3xl p-6 w-full max-w-md mx-auto relative shadow-2xl animate-in slide-in-from-bottom-10">
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

            <button className="w-full bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-bold py-4 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
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

      <div className="p-4 relative z-10 pb-32 max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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
                       className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-[10px] py-3 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
                    >
                       {isAnalyzing ? (
                         <>
                            <Loader2 size={14} className="animate-spin text-emerald-500"/>
                            АНАЛИЗ...
                         </>
                       ) : (
                         <>
                            <Sparkles size={14} className="text-amber-400 group-hover:rotate-12 transition-transform"/>
                            СГЕНЕРИРОВАТЬ СТРАТЕГИЮ
                         </>
                       )}
                    </button>

                 </div>
              </div>
              
              {/* AI Analysis Result Display */}
              {aiAnalysis && (
                 <div className="animate-in fade-in slide-in-from-top-4 mt-6 bg-[#0A0A0A] border border-emerald-500/20 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
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
                      className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors active:scale-[0.98]"
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
  const [devStep, setDevStep] = useState(0); // 0: Intro, 1: Roles, 2: Loading, 3: Result
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleAnalysis, setRoleAnalysis] = useState('');
  
  const handleRoleSelect = async (role) => {
      setSelectedRole(role);
      setDevStep(2); // Loading step
      
      const prompt = `Ты - мотивационный ментор в IT-академии Taipan. 
      Пользователь выбрал роль: "${role.title}". 
      Объясни ему в 2-3 предложениях, почему эта роль идеально подходит для старта в разработке Telegram Mini Apps и как он сможет выйти на доход 100 000+ тенге.
      Стиль: вдохновляющий, уверенный, "ты сможешь". Без воды.`;

      const analysis = await callOpenAIAPI(prompt);
      setRoleAnalysis(analysis);
      setDevStep(3); // Result step
  };

  const renderContent = () => {
    switch(devStep) {
        case 0:
            return (
                <div className="h-full flex flex-col justify-center px-6 animate-in fade-in duration-500">
                    <div className="mb-8">
                        <div className="inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
                            <Terminal size={32} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4">
                            INITIATION<span className="text-blue-500">.EXE</span>
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Telegram Mini Apps — это новый "Дикий Запад". Рынок пуст. Спрос огромен. 
                            <br/><br/>
                            В Taipan мы не просто пишем код. Мы создаем цифровые активы.
                            Готов выбрать свою специализацию?
                        </p>
                    </div>
                    <button 
                        onClick={() => setDevStep(1)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Начать Инициацию <ArrowRight size={16}/>
                    </button>
                </div>
            );
        case 1:
            return (
                <div className="px-4 py-8 pb-32 animate-in slide-in-from-right duration-500">
                     <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users size={20} className="text-blue-500"/> Выбери свой путь
                     </h2>
                     <div className="grid gap-3">
                         {DEV_ROLES.map(role => (
                             <button 
                                key={role.id}
                                onClick={() => handleRoleSelect(role)}
                                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-left hover:border-blue-500/50 hover:bg-zinc-900 transition-all group relative overflow-hidden active:scale-[0.98]"
                             >
                                 <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <div className="flex justify-between items-start mb-2 relative z-10">
                                     <div className={`p-2 rounded-lg bg-${role.color}-500/10 text-${role.color}-500`}>
                                         {role.icon}
                                     </div>
                                     <ArrowRight className="text-zinc-700 group-hover:text-white transition-colors"/>
                                 </div>
                                 <div className="relative z-10">
                                     <h3 className="text-white font-bold text-sm mb-1">{role.title}</h3>
                                     <p className="text-zinc-500 text-xs leading-snug">{role.desc}</p>
                                 </div>
                             </button>
                         ))}
                     </div>
                </div>
            );
        case 2:
            return (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 animate-in fade-in duration-300">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Bot size={24} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="text-blue-500 font-mono text-xs mb-2">PROCESSING_DATA...</div>
                    <h3 className="text-white font-bold text-lg">Анализ психотипа</h3>
                    <p className="text-zinc-500 text-xs mt-2">Нейросеть подбирает программу обучения...</p>
                </div>
            );
        case 3:
            return (
                <div className="px-4 py-8 pb-32 animate-in slide-in-from-bottom duration-500">
                    <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-[32px] p-6 relative overflow-hidden mb-6">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <ShieldCheck size={64} className="text-blue-500"/>
                        </div>
                        
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                Результат Анализа
                            </span>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                {selectedRole?.title}
                            </h2>
                            <div className="text-sm text-zinc-300 leading-relaxed font-medium bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                                {roleAnalysis}
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                        <h3 className="text-white font-bold mb-2">Академия Taipan</h3>
                        <p className="text-zinc-400 text-xs mb-6">
                            Мы не продаем курсы. Мы вербуем агентов.
                            <br/>
                            Получи доступ к закрытому чату, мануалам и первым заказам.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-white text-black font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors active:scale-[0.98]">
                                Доступ: 15 000 ₸
                            </button>
                            <button 
                                onClick={() => setDevStep(0)}
                                className="text-zinc-500 text-xs hover:text-white transition-colors py-2"
                            >
                                Начать заново
                            </button>
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-y-auto no-scrollbar">
       <div className="fixed inset-0 z-0 bg-[#050505]">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Top Bar */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-[#050505]/80 backdrop-blur-md flex justify-between items-center border-b border-white/5">
        <button onClick={() => setMode('select')} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
          <ChevronRight className="rotate-180" size={18}/>
        </button>
        <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">Dev Модуль</span>
        <div className="w-8"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full">
         {renderContent()}
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [mode, setMode] = useState('splash'); // splash, select, business, dev
  const [showChat, setShowChat] = useState(false);
  const [bizParams, setBizParams] = useState({
      users: 0,
      currentConversion: 0,
      check: 0,
      margin: 0
  });

  const handleSplashComplete = () => {
     setMode('select');
  };

  return (
    <div className="bg-black min-h-screen text-white">
       {/* Global Chat Button (Only in Business/Dev modes) */}
       {(mode === 'business' || mode === 'dev') && (
         <button 
           onClick={() => setShowChat(true)}
           className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${mode === 'business' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-blue-600 shadow-blue-900/20'}`}
         >
             <MessageSquare className="text-white" size={24} />
         </button>
       )}

       <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />

       {mode === 'splash' && <TerminalSplash onComplete={handleSplashComplete} />}
       {mode === 'select' && <SelectView setMode={setMode} />}
       {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
       {mode === 'dev' && <DevView setMode={setMode} />}
    </div>
  );
};

export default App;
