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
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "🚀 Ошибка доступа: Ключ API не найден в системе. Настройте REACT_APP_OPENAI_API_KEY в Vercel.";
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
          { role: "system", content: "Ты — AI-ассистент агентства Taipan Media. Твой тон: уверенный, дерзкий, экспертный. Ты профи в Telegram Mini Apps. Отвечай коротко, используй эмодзи. Ты находишься в Шымкенте, Казахстан." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Система временно недоступна.";
  } catch (error) {
    return "Связь прервана. Проверьте соединение.";
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

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
  
  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Система Taipan_AI запущена. Какой бизнес будем масштабировать сегодня?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const prompt = `Бизнес: Трафик ${bizParams.users}, Чек ${bizParams.check}тг, Маржа ${bizParams.margin}%. Дай 3 жестких совета по росту через Telegram Mini App.`;
    const result = await callOpenAIAPI(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    const response = await callOpenAIAPI(chatInput);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center font-mono text-emerald-500">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="animate-pulse tracking-widest text-xs uppercase">Connecting to Taipan_Core...</p>
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
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-tighter">Масштабирование через Telegram Mini Apps</p>
        </div>
        <div className="grid gap-4">
          <button onClick={() => setMode('business')} className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-[32px] text-left hover:border-emerald-500/50 transition-all backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Briefcase className="text-emerald-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-1">Предприниматель</h3>
            <p className="text-zinc-500 text-xs italic">Расчет прибыли и заказ разработки</p>
          </button>
          <button onClick={() => setMode('dev')} className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-[32px] text-left hover:border-blue-500/50 transition-all backdrop-blur-xl">
            <Code className="text-blue-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-1">Разработчик</h3>
            <p className="text-zinc-500 text-xs italic">Протоколы кода и обучение</p>
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
            <ChevronRight className="rotate-180" size={20}/> <span className="text-[10px] font-bold uppercase tracking-widest">Вернуться</span>
          </button>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-xl mb-8">
            <div className="flex items-center gap-3 mb-8">
               <Calculator className="text-emerald-500" />
               <h2 className="text-2xl font-black italic tracking-tighter">ANALYTICS_V1</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Трафик (чел/мес)', key: 'users', icon: Users },
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

            <div className="mt-8 p-6 bg-emerald-600 rounded-[24px] text-white shadow-lg shadow-emerald-900/20">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">Чистая прибыль</p>
                    <h3 className="text-3xl font-black tracking-tighter">{formatCurrency(totalProfit)}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">ROI</p>
                    <h3 className="text-2xl font-black text-emerald-200">{roi}%</h3>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-6 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all uppercase text-[10px] tracking-[0.2em]"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              Получить ИИ-стратегию
            </button>
          </div>

          {aiAnalysis && (
            <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-[32px] p-8 animate-in slide-in-from-bottom-5">
              <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase text-[10px] tracking-widest">
                <BrainCircuit size={16}/> Taipan AI Recommendation
              </h4>
              <div className="text-sm text-zinc-200 leading-relaxed italic whitespace-pre-line font-medium border-l-2 border-emerald-500/50 pl-4">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
        
        {/* Floating Chat Button */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform z-50 animate-bounce-slow"
        >
          <Bot className="text-black" size={28} />
        </button>

        {isChatOpen && (
          <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Bot className="text-black" size={20} />
                 </div>
                 <div>
                    <h2 className="text-sm font-black italic tracking-tighter">TAIPAN_CORE_AI</h2>
                    <p className="text-[10px] text-emerald-500 font-bold animate-pulse">ACTIVE PROTOCOL</p>
                 </div>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="p-3 bg-zinc-900 rounded-full text-white hover:bg-zinc-800"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none italic'
                    }`}>
                      {msg.content}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-zinc-800">
                       <Loader2 className="animate-spin text-emerald-500" size={16}/>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-[#0A0A0A] border-t border-white/5">
               <div className="flex gap-3 max-w-2xl mx-auto">
                 <input 
                   className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-sm" 
                   placeholder="Введите запрос..." 
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={isTyping}
                   className="p-4 bg-emerald-500 rounded-2xl text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                 >
                   <Send size={20}/>
                 </button>
               </div>
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
       <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">System Locked</h2>
       <p className="text-zinc-500 text-sm max-w-xs mb-8 italic">Доступ к репозиторию протокола "КОБРА" ограничен. Требуется ключ доступа уровня 4.</p>
       <button onClick={() => setMode('select')} className="text-blue-500 font-bold uppercase text-[10px] tracking-widest border-b border-blue-500 pb-1">Вернуться в терминал</button>
    </div>
  );

  return null;
}
