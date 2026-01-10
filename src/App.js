import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Code, ChevronRight, Activity, Lock, 
  Users, Target, Calculator, Zap, Bot, 
  BrainCircuit, Send, Loader2, X, TrendingDown, TrendingUp
} from 'lucide-react';

// --- API INTEGRATION (OPENAI) ---
const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) return "🚀 Ошибка: Ключ API не найден в Vercel. Добавьте REACT_APP_OPENAI_API_KEY.";
  
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
          { role: "system", content: "Ты — AI Taipan Media. Твоя цель: показать клиенту, как Telegram Mini App вернет упущенную прибыль. Будь дерзким, экспертным и лаконичным." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка доступа к ядру AI.";
  } catch (error) {
    return "Связь прервана. Проверьте соединение.";
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(Math.floor(val)) + ' ₸';

// --- COMPONENTS ---
const TerminalSplash = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const sequence = [
      { text: "> ЗАГРУЗКА СИСТЕМЫ ТАЙПАН...", delay: 200 },
      { text: "> ОТКРЫТИЕ ДОСТУПОВ К МОДУЛЯМ...", delay: 700 },
      { text: "> ПОДКЛЮЧЕНИЕ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА...", delay: 1300 },
      { text: "> АНАЛИЗ РЫНКА КАЗАХСТАНА...", delay: 1900 },
      { text: "> ДОСТУП РАЗРЕШЕН.", delay: 2500, color: "text-emerald-500 font-bold" },
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
        {lines.map((l, i) => (
          <div key={i} className={`animate-in fade-in slide-in-from-left-2 ${l.color || "text-emerald-500/60"}`}>
            {l.text}
          </div>
        ))}
        <div className="w-2 h-4 bg-emerald-500 animate-pulse mt-2"></div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState('select');
  const [params, setParams] = useState({ leads: 0, conv: 0, check: 0, margin: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Система Taipan_AI запущена. Какой бизнес будем масштабировать сегодня?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- LOGIC CALCULATIONS ---
  const lostConv = 100 - (params.conv || 0); // % упущенных заявок
  const lostLeadsCount = params.leads * (lostConv / 100);
  const lostProfitPotential = lostLeadsCount * params.check * (params.margin / 100);
  
  // Эффект Тайпана: возвращаем 20% от упущенного
  const taipanRecoveryProfit = lostProfitPotential * 0.20;
  const setupCost = 100000;
  const roi = taipanRecoveryProfit > 0 ? (((taipanRecoveryProfit - setupCost) / setupCost) * 100).toFixed(0) : -100;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAIStrategy = async () => {
    setIsAnalyzing(true);
    const prompt = `Бизнес получает ${params.leads} заявок, конверсия ${params.conv}%. Они теряют ${formatCurrency(lostProfitPotential)} чистой прибыли. Как Telegram Mini App вернет 20% этих денег? Дай 3 конкретных шага.`;
    const res = await callOpenAIAPI(prompt);
    setAiAnalysis(res);
    setIsAnalyzing(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    const response = await callOpenAIAPI(chatInput);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  if (showSplash) return <TerminalSplash onComplete={() => setShowSplash(false)} />;

  if (mode === 'select') return (
    <div className="flex flex-col h-screen bg-[#050505] items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">TAIPAN<span className="text-emerald-500">MEDIA</span></h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mb-12">Scalability Protocol V1</p>
        <div className="grid gap-4">
          <button onClick={() => setMode('business')} className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-[32px] text-left hover:border-emerald-500/50 transition-all backdrop-blur-xl relative overflow-hidden">
            <Briefcase className="text-emerald-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white">Бизнес модуль</h3>
            <p className="text-zinc-500 text-xs italic">Анализ упущенной прибыли</p>
          </button>
          <button className="group p-6 bg-zinc-900/20 border border-zinc-800 rounded-[32px] text-left opacity-40 cursor-not-allowed">
            <Code className="text-blue-500 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white">Разработчик</h3>
            <p className="text-zinc-500 text-xs italic">Доступ ограничен</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-24 font-sans selection:bg-emerald-500/30">
      <div className="max-w-md mx-auto pt-6">
        <button onClick={() => setMode('select')} className="mb-6 text-zinc-500 flex items-center gap-2 hover:text-white transition-colors">
          <ChevronRight className="rotate-180" size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">В терминал</span>
        </button>

        {/* --- CALCULATOR CARD --- */}
        <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-6 shadow-2xl mb-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Calculator className="text-emerald-500" size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Прогноз Эффективности</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 transition-all focus-within:border-emerald-500/50">
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Users size={12}/> Трафик (Заявок в месяц)
              </label>
              <input type="number" placeholder="0" className="bg-transparent w-full text-2xl font-bold outline-none text-white" 
                onChange={(e) => setParams({...params, leads: parseFloat(e.target.value) || 0})}/>
            </div>

            <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 transition-all focus-within:border-emerald-500/50">
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Target size={12}/> Текущая конверсия (%)
              </label>
              <input type="number" placeholder="Напр: 45" className="bg-transparent w-full text-2xl font-bold outline-none text-emerald-500" 
                onChange={(e) => setParams({...params, conv: parseFloat(e.target.value) || 0})}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-center">Ср. Чек (₸)</label>
                <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" 
                  onChange={(e) => setParams({...params, check: parseFloat(e.target.value) || 0})}/>
              </div>
              <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-center">Маржа (%)</label>
                <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" 
                  onChange={(e) => setParams({...params, margin: parseFloat(e.target.value) || 0})}/>
              </div>
            </div>
          </div>

          {/* --- ANALYSIS BLOCK --- */}
          {params.leads > 0 && (
            <div className="mt-8 space-y-4 animate-in fade-in zoom-in duration-500">
               <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-red-400 uppercase mb-1">Вы теряете {lostConv}% потенциала</p>
                    <h3 className="text-xl font-black text-white">{formatCurrency(lostProfitPotential)}</h3>
                  </div>
                  <TrendingDown className="text-red-500 opacity-50" size={24}/>
               </div>

               <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-200 opacity-80 mb-1">Чистая прибыль (мес)</p>
                        <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(taipanRecoveryProfit)}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-emerald-200 opacity-80 mb-1">ROI</p>
                        <h3 className="text-2xl font-black">{roi}%</h3>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/10 rounded-2xl p-4 backdrop-blur-md mb-6">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                             <Zap size={10} className="fill-emerald-400 text-emerald-400"/> Возврат потерянных
                          </span>
                          <span className="text-xs font-bold text-emerald-300">+20%</span>
                       </div>
                       <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 transition-all duration-1000" style={{width: '65%'}}></div>
                       </div>
                       <p className="text-[9px] mt-3 opacity-70 italic leading-snug">Taipan автоматически реанимирует 20% клиентов, которые не дошли до оплаты.</p>
                    </div>

                    <button 
                      onClick={handleAIStrategy}
                      disabled={isAnalyzing}
                      className="w-full py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all"
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16}/>}
                      Сгенерировать стратегию
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* --- AI OUTPUT --- */}
        {aiAnalysis && (
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] animate-in slide-in-from-bottom-5">
             <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-4">
                <Bot size={14}/> Taipan_AI Аналитика
             </div>
             <p className="text-xs text-zinc-300 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 whitespace-pre-line">
               {aiAnalysis}
             </p>
          </div>
        )}
      </div>

      {/* --- FLOATING CHAT --- */}
      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform">
        <Bot className="text-black" size={28} />
      </button>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col animate-in slide-in-from-bottom-full duration-500">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><Bot className="text-black" size={20} /></div>
              <div><h2 className="text-sm font-black italic">TAIPAN_CORE_AI</h2><p className="text-[10px] text-emerald-500 font-bold animate-pulse">PROTOCOL_ACTIVE</p></div>
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
            <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-sm" placeholder="Запрос системе..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
            <button onClick={handleSendMessage} className="p-4 bg-emerald-500 rounded-2xl text-black transition-transform active:scale-90"><Send size={20}/></button>
          </div>
        </div>
      )}
    </div>
  );
}
