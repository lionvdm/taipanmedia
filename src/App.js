import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Code, ChevronRight, ArrowRight, Activity, Lock, Users, 
  TrendingUp, ShoppingBag, Check, Calculator, Sparkles, Bot, 
  BrainCircuit, Send, Loader2, X 
} from 'lucide-react';

// --- OPENAI API INTEGRATION ---
const openAIKey = "sk-...."; // Твой ключ OpenAI

const callOpenAIAPI = async (prompt, history = []) => {
  try {
    // Формируем сообщения для OpenAI (system -> history -> user)
    const messages = [
      {
        role: "system",
        content: `Ты — AI-ассистент элитного агентства Taipan Media. Твой тон: уверенный, профессиональный, немного дерзкий ("хищный"), но вежливый. Ты эксперт в Telegram Mini Apps. 
        Твоя цель: продавать услуги агентства (разработка, аудит) или обучение. 
        Используй эмодзи. Отвечай кратко и по делу.`
      }
    ];

    // Добавляем историю (превращаем твой формат 'model' в 'assistant')
    history.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Добавляем текущий запрос
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content || "Ошибка получения ответа.";
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Ошибка API. Проверь баланс или ключ.";
  }
};

// --- Вспомогательные функции ---
const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- ДАННЫЕ (ПОРТФОЛИО И УСЛУГИ) ---
const PORTFOLIO = [
  { id: 1, title: 'ROMANTIC SHYMKENT', type: 'ЦВЕТОЧНЫЙ БРЕНД #1', stat: '+210%', statLabel: 'РОСТ ПРОДАЖ', img: 'from-rose-500/20 to-rose-900/10' },
  { id: 2, title: 'КАСТРЮЛЬКА ЕДЫ', type: 'ДОСТАВКА ЕДЫ', stat: '+180%', statLabel: 'ПОВТОРНЫЕ ПОКУПКИ', img: 'from-orange-500/20 to-orange-900/10' },
  { id: 3, title: 'VIRGINIA', type: 'МАГАЗИН ТАБАКА', stat: 'x2.5', statLabel: 'ЧАСТОТА ПОКУПОК', img: 'from-zinc-500/20 to-zinc-900/10' },
];

const SERVICES = [
  { id: 'dev', title: 'ПРОТОКОЛ: КОБРА', price: 100000, desc: 'ПОЛНАЯ РАЗРАБОТКА MINI APP ПОД КЛЮЧ', details: ['UI/UX Taipan Style', 'React/Vue Frontend', 'Backend & DB', 'Telegram API', 'Админ-панель', 'Поддержка 1 мес.'], accent: 'emerald' },
  { id: 'audit', title: 'ПРОТОКОЛ: ПИТОН', price: 50000, desc: 'АУДИТ БИЗНЕСА И ТЗ', details: ['Анализ ниши', 'Воронка продаж', 'Техническое задание', 'Юнит-экономика', 'Маркетинг план'], accent: 'blue' },
];

// --- КОМПОНЕНТЫ ФОНА ---
const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

// --- ОСНОВНОЙ ЧАТ ---
const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'model', text: 'Taipan AI (GPT-4o) на связи. Чем могу быть полезен?' }
  ]);
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
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex flex-col font-sans">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-emerald-500" />
          <h3 className="text-sm font-bold text-white">Taipan AI</h3>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-full bg-zinc-900"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-500 text-xs animate-pulse">Печатает...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <div className="relative flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Спросите GPT-4o..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-3 bg-emerald-600 text-white rounded-xl"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// --- VIEW: BUSINESS (С калькулятором и AI анализом) ---
const BusinessView = ({ setMode, bizParams, setBizParams }) => {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    if (bizParams.users === 0) return;
    setIsAnalyzing(true);
    const prompt = `Проведи бизнес-анализ: Трафик ${bizParams.users} чел, чек ${bizParams.check}₸, маржа ${bizParams.margin}%. Дай 3 жестких совета по внедрению Mini App.`;
    const result = await callOpenAIAPI(prompt, []);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-y-auto p-4">
      <MeshBackground />
      <button onClick={() => setMode('select')} className="mb-4 text-zinc-500">&larr; Назад</button>
      
      <div className="relative z-10 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4">Калькулятор прибыли</h2>
        <input type="number" placeholder="Трафик" className="w-full bg-black mb-2 p-3 rounded-lg" onChange={(e) => setBizParams({...bizParams, users: e.target.value})} />
        <input type="number" placeholder="Чек" className="w-full bg-black mb-4 p-3 rounded-lg" onChange={(e) => setBizParams({...bizParams, check: e.target.value})} />
        
        <button onClick={handleAIAnalysis} className="w-full bg-emerald-600 p-3 rounded-xl font-bold flex justify-center gap-2">
          {isAnalyzing ? <Loader2 className="animate-spin"/> : <Sparkles size={18}/>} ГЕНЕРИРОВАТЬ СТРАТЕГИЮ
        </button>

        {aiAnalysis && (
          <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-xs whitespace-pre-line">
            {aiAnalysis}
          </div>
        )}
      </div>
    </div>
  );
};

// Экспортируй основной компонент App, где будут переключаться эти View
export default function TaipanApp() {
    const [mode, setMode] = useState('select'); // 'select', 'business', 'dev'
    const [bizParams, setBizParams] = useState({ users: 0, check: 0, margin: 20, currentConversion: 3 });
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black">
            {mode === 'select' && (
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <h1 className="text-white text-3xl font-black">TAIPAN MEDIA</h1>
                    <button onClick={() => setMode('business')} className="bg-emerald-600 text-white p-4 rounded-2xl w-64">БИЗНЕС</button>
                    <button onClick={() => setMode('dev')} className="bg-blue-600 text-white p-4 rounded-2xl w-64">РАЗРАБОТЧИК</button>
                </div>
            )}
            {mode === 'business' && <BusinessView setMode={setMode} bizParams={bizParams} setBizParams={setBizParams} />}
            
            <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg z-50">
                <Bot color="white" />
            </button>
            <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
}
