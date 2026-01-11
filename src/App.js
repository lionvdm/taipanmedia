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
// ИСПРАВЛЕНО: Теперь ключ берется из системных переменных Vercel, а не из текста кода
const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 

const callOpenAIAPI = async (prompt, history = []) => {
  try {
    if (!apiKey) {
      console.error("API Key missing in Environment Variables");
      return "СИСТЕМА: API ключ не обнаружен в настройках Vercel.";
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
        console.error("OpenAI API Error Details:", errorData);
        throw new Error('API Error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка анализа данных.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Система временно недоступна. Попробуйте позже.";
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
    color: 'emerald'
  },
  {
    id: 'design',
    title: 'UI/UX Дизайнер',
    icon: <Palette size={24} />,
    desc: 'Стиль, психология, удобство. Ты управляешь вниманием пользователя.',
    color: 'emerald'
  },
  {
    id: 'traffic',
    title: 'Арбитраж Трафика',
    icon: <Zap size={24} />,
    desc: 'Реклама, воронки, лиды. Ты приводишь клиентов и делаешь кэш.',
    color: 'emerald'
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

const ShatterText = ({ visible, children }) => {
  const [status, setStatus] = useState('hidden'); // hidden, visible, shattering
  const [shatter, setShatter] = useState(false);

  useEffect(() => {
    if (visible) {
      setStatus('visible');
      setShatter(false);
    } else if (status === 'visible') {
      setStatus('shattering');
      requestAnimationFrame(() => {
          setShatter(true);
      });
      const timer = setTimeout(() => setStatus('hidden'), 800);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (status === 'hidden') return null;

  if (status === 'visible') {
    return (
      <div className="animate-in fade-in zoom-in duration-500 relative z-10 w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full pointer-events-none">
        <div 
            className={`absolute inset-0 transition-all duration-700 ease-out ${shatter ? '-translate-x-12 -translate-y-12 -rotate-12 opacity-0 blur-sm scale-110' : ''}`} 
            style={{ clipPath: 'polygon(0 0, 60% 0, 40% 40%, 0 50%)' }}
        >
            {children}
        </div>
        <div 
            className={`absolute inset-0 transition-all duration-700 ease-out ${shatter ? 'translate-x-16 -translate-y-8 rotate-12 opacity-0 blur-sm scale-110' : ''}`} 
            style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 60%, 40% 40%)' }}
        >
            {children}
        </div>
        <div 
            className={`absolute inset-0 transition-all duration-700 ease-out ${shatter ? 'translate-x-8 translate-y-16 -rotate-6 opacity-0 blur-sm scale-110' : ''}`} 
            style={{ clipPath: 'polygon(40% 40%, 100% 60%, 100% 100%, 30% 100%)' }}
        >
            {children}
        </div>
        <div 
            className={`absolute inset-0 transition-all duration-700 ease-out ${shatter ? '-translate-x-16 translate-y-8 rotate-6 opacity-0 blur-sm scale-110' : ''}`} 
            style={{ clipPath: 'polygon(0 50%, 40% 40%, 30% 100%, 0 100%)' }}
        >
            {children}
        </div>
        <div className={`absolute inset-0 bg-emerald-500/20 mix-blend-overlay transition-opacity duration-300 ${shatter ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

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

      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спросите что-нибудь..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ---
export default function TaipanApp() {
  const [mode, setMode] = useState('select');
  const [bizParams, setBizParams] = useState({ users: 1000, currentConversion: 3, check: 15000, margin: 40 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <TerminalSplash onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-black text-white">
      {mode === 'select' && <SelectView setMode={setMode} />}
      {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
      
      {mode !== 'select' && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageSquare className="text-white" />
        </button>
      )}

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

// ВНИМАНИЕ: Здесь должны идти SelectView, BusinessView и другие части твоего оригинального кода
// Я оставляю их структуру без изменений, чтобы дизайн остался твоим.
