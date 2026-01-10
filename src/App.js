import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Code, ChevronRight, Activity, Lock, 
  Users, TrendingUp, Calculator, Sparkles, Bot, 
  BrainCircuit, Send, Loader2, X, Target, Zap
} from 'lucide-react';

// --- API INTEGRATION ---
const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) return "🚀 Ошибка: Ключ API не найден в Vercel.";
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты — AI Taipan Media. Твой стиль: хищный, экспертный, лаконичный. Давай конкретные цифры и тактики для Telegram Mini Apps." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка связи с ядром.";
  } catch (error) { return "Проверьте соединение."; }
};

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

// --- STYLES & COMPONENTS ---
const MeshBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/5 blur-[120px]"></div>
  </div>
);

const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "> ЗАГРУЗКА СИСТЕМЫ...", delay: 200 },
      { text: "> ОТКРЫТИЕ ДОСТУПОВ...", delay: 600 },
      { text: "> ПОДКЛЮЧЕНИЕ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА...", delay: 1100 },
      { text: "> АНАЛИЗ РЫНКА...", delay: 1600 },
      { text: "> ДОСТУП РАЗРЕШЕН.", delay: 2100, color: "text-emerald-500 font-bold" },
    ];
    sequence.forEach(({ text, delay, color }, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        if (i === sequence.length - 1) setTimeout(onComplete, 800);
      }, delay);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-end p-10 font-mono text-xs">
      <div className="space-y-2">
        {lines.map((l, i) => <div key={i} className={`animate-in fade-in slide-in-from-left-2 ${l.color || "text-emerald-500/60"}`}>{l.text}</div>)}
        <div className="w-2 h-4 bg-emerald-500 animate-pulse"></div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState('select');
  const [params, setParams] = useState({ users: 0, conv: 0, check: 0, margin: 0 });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Система готова. Какой бизнес анализируем?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Расчеты
  const revenue = params.users * (params.conv / 100) * params.check;
  const totalProfit = Math.floor(revenue * (params.margin / 100));
  const lostRecovery = Math.floor(totalProfit * 0.2); // Симуляция возврата 20%
  const setupCost = 100000;
  const roi = totalProfit > 0 ? (((totalProfit - setupCost) / setupCost) * 100).toFixed(0) : -100;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleAI = async () => {
    setIsAnalyzing(true);
    const res = await callOpenAIAPI(`Бизнес: Трафик ${params.users}, Конверсия ${params.conv}%, Чек ${params.check}тг. Дай 3 тактики для роста.`);
    setAiAnalysis(res);
    setIsAnalyzing(false);
  };

  const handleSend = async () => {
    if (!chatInput.trim() || isTyping) return;
    const m = { role: 'user', content: chatInput };
    setMessages(p => [...p, m]); setChatInput(''); setIsTyping(true);
    const r = await callOpenAIAPI(chatInput);
    setMessages(p => [...p, { role: 'assistant', content: r }]); setIsTyping(false);
  };

  if (showSplash) return <TerminalSplash onComplete={() => setShowSplash(false)} />;

  if (mode === 'select') return (
    <div className="flex flex-col h-screen bg-[#050505] items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <MeshBackground />
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">TAIPAN<span className="text-emerald-500">MEDIA</span></h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-12">Scalability Protocol</p>
        <div className="grid gap-4">
          <button onClick={() => setMode('business')} className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-[32px] text-left hover:border-emerald-500/50 transition-all backdrop-blur-xl">
            <Briefcase className="text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold text-white">Бизнес модуль</h3>
            <p className="text-zinc-500 text-xs">Прогноз эффективности</p>
          </button>
          <button onClick={() => setMode('dev')} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[32px] text-left opacity-50">
            <Code className="text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-white">Разработчик</h3>
            <p className="text-zinc-500 text-xs">Доступ ограничен</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pb-24 overflow-x-hidden font-sans">
      <MeshBackground />
      <div className="relative z-10 max-w-md mx-auto">
        <div className="flex justify-center mb-8">
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-4 py-1 rounded-full border border-emerald-500/20">Бизнес модуль</span>
        </div>

        {/* --- НОВЫЙ КАЛЬКУЛЯТОР СО СКРИНШОТА --- */}
        <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-6 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Calculator className="text-emerald-500" size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Прогноз эффективности</h2>
          </div>

          <div className="space-y-4">
            {/* Трафик */}
            <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Users size={12}/> Трафик в месяц
              </label>
              <div className="flex items-center gap-3">
                <span className="text-zinc-600 font-bold text-xl">👤</span>
                <input type="number" placeholder="0" className="bg-transparent w-full text-2xl font-bold outline-none" 
                  onChange={(e) => setParams({...params, users: parseInt(e.target.value) || 0})}/>
              </div>
            </div>

            {/* Конверсия */}
            <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Target size={12}/> Текущая конверсия (%)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-zinc-600 font-bold text-xl">📈</span>
                <input type="number" placeholder="0" className="bg-transparent w-full text-2xl font-bold outline-none" 
                  onChange={(e) => setParams({...params, conv: parseInt(e.target.value) || 0})}/>
              </div>
            </div>

            {/* Чек и Маржа в ряд */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-center">Ср. чек (₸)</label>
                <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" 
                  onChange={(e) => setParams({...params, check: parseInt(e.target.value) || 0})}/>
              </div>
              <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-center">Маржа (%)</label>
                <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" 
                  onChange={(e) => setParams({...params, margin: parseInt(e.target.value) || 0})}/>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center px-2">
             <div className="flex items-center gap-2 text-zinc-500">
                <Lock size={12}/> <span className="text-[10px] font-bold uppercase tracking-widest">Стоимость внедрения</span>
             </div>
             <span className="text-[10px] font-bold">{formatCurrency(setupCost)}</span>
          </div>

          {/* Зеленый блок результатов */}
          <div className="mt-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[30px] p-6 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <p className="text-[10px] font-black uppercase opacity-60 mb-1">Чистая прибыль (мес)</p>
                     <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(totalProfit)}</h3>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase opacity-60 mb-1">ROI</p>
                     <h3 className={`text-2xl font-black ${roi > 0 ? 'text-emerald-200' : 'text-red-300'}`}>{roi}%</h3>
                   </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                   <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase">Возврат потерянных</span>
                      </div>
                      <span className="text-xs font-bold">{formatCurrency(lostRecovery)}</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-emerald-400 transition-all duration-1000" style={{width: params.users > 0 ? '65%' : '0%'}}></div>
                   </div>
                   <p className="text-[9px] leading-tight opacity-70 italic">Taipan автоматически возвращает 20% клиентов, которые ушли без покупки.</p>
                </div>

                <button onClick={handleAI} disabled={isAnalyzing} className="w-full mt-6 py-4 bg-black/20 hover:bg-black/40 border border-white/20 rounded-2xl flex items-center justify-center gap-2 transition-all group">
                   {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} className="text-emerald-400 group-hover:scale-125 transition-transform"/>}
                   <span className="text-[10px] font-black uppercase tracking-widest">Сгенерировать стратегию</span>
                </button>
             </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-[32px] p-6 animate-in slide-in-from-bottom-5">
            <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase text-[10px] tracking-widest"><BrainCircuit size={16}/> Taipan AI Recommendation</h4>
            <div className="text-xs text-zinc-300 leading-relaxed italic border-l border-emerald-500/30 pl-4 whitespace-pre-line">{aiAnalysis}</div>
          </div>
        )}

        <p className="text-center text-[9px] text-zinc-600 mt-8 uppercase tracking-widest">*ROI = (Прибыль за месяц - {setupCost} ₸) / {setupCost} ₸ × 100%</p>
      </div>

      {/* Чат */}
      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"><Bot className="text-black" size={24} /></button>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col animate-in slide-in-from-bottom-full duration-500">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><Bot className="text-black" size={20} /></div>
              <div><h2 className="text-sm font-black italic">TAIPAN_CORE_AI</h2><p className="text-[10px] text-emerald-500 font-bold animate-pulse">ONLINE</p></div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-3 bg-zinc-900 rounded-full text-white"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none italic'}`}>{m.content}</div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800"><Loader2 className="animate-spin text-emerald-500" size={16}/></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-6 bg-[#0A0A0A] border-t border-white/5 flex gap-3">
            <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-sm" placeholder="Запрос системе..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="p-4 bg-emerald-500 rounded-2xl text-black"><Send size={20}/></button>
          </div>
        </div>
      )}
    </div>
  );
}
