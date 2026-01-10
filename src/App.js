import React, { useState, useEffect } from 'react';
import { 
  Briefcase, ChevronRight, Calculator, Zap, 
  BrainCircuit, Loader2, TrendingDown, GraduationCap,
  CheckCircle2, Star, Rocket, Activity, Code, Target, Users
} from 'lucide-react';

// --- API INTEGRATION (OPENAI) ---
const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) return "Ошибка: Настройте API ключ в Vercel (REACT_APP_OPENAI_API_KEY).";
  
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
          { role: "system", content: "Ты эксперт Taipan Media. Отвечай кратко, профессионально, без использования LaTeX и символов \\[ \\]. Только текст." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) return `Ошибка OpenAI: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Ошибка получения данных.";
  } catch (error) {
    return "Связь прервана. Проверьте баланс OpenAI.";
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(Math.floor(val)) + ' ₸';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState('select'); 
  const [learnStep, setLearnStep] = useState('manifesto');
  const [viewedFaq, setViewedFaq] = useState(new Set());
  const [params, setParams] = useState({ leads: 0, conv: 0, check: 0, margin: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Переход между экранами со сбросом анализа ИИ
  const navigateTo = (newMode) => {
    setAiAnalysis(''); 
    setMode(newMode);
    setLearnStep('manifesto');
    setViewedFaq(new Set());
  };

  const handleAIStrategy = async () => {
    setIsAnalyzing(true);
    const lostConv = 100 - (params.conv || 0);
    const lostProfit = (params.leads * (lostConv / 100)) * params.check * (params.margin / 100);
    const res = await callOpenAIAPI(`Бизнес теряет ${lostConv}% заявок. Упущенная прибыль: ${formatCurrency(lostProfit)}. Как Mini App вернет 20%? Дай 3 конкретных совета.`);
    setAiAnalysis(res);
    setIsAnalyzing(false);
  };

  if (showSplash) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-emerald-500 text-xs">
      <div className="animate-pulse">> TAIPAN_PROTOCOL_LOADED...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-md mx-auto pt-6">
        
        {/* HEADER */}
        <div className="text-center mb-10 cursor-pointer" onClick={() => navigateTo('select')}>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">TAIPAN<span className="text-emerald-500">MEDIA</span></h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] mt-2">Scalability Protocol V1</p>
        </div>

        {/* --- MAIN MENU --- */}
        {mode === 'select' && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button onClick={() => navigateTo('business')} className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-[32px] text-left hover:border-emerald-500/50 transition-all">
              <Briefcase className="text-emerald-500 mb-4" size={28} />
              <h3 className="text-xl font-bold">Бизнес модуль</h3>
              <p className="text-zinc-500 text-xs italic">Анализ упущенной прибыли</p>
            </button>
            <button onClick={() => navigateTo('learn')} className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-[32px] text-left hover:border-blue-500/50 transition-all">
              <GraduationCap className="text-blue-500 mb-4" size={28} />
              <h3 className="text-xl font-bold uppercase">Разработчик</h3>
              <p className="text-zinc-500 text-xs italic">Обучение созданию Mini Apps</p>
            </button>
          </div>
        )}

        {/* --- BUSINESS MODULE --- */}
        {mode === 'business' && (
          <div className="animate-in zoom-in duration-500">
            <button onClick={() => navigateTo('select')} className="mb-6 text-zinc-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronRight className="rotate-180" size={14}/> Назад</button>
            <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-8"><Calculator className="text-emerald-500" size={20} /><h2 className="text-xl font-bold tracking-tight">Прогноз Эффективности</h2></div>
              <div className="space-y-4">
                <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block flex items-center gap-2"><Users size={12}/> Трафик в месяц</label>
                  <input type="number" placeholder="0" className="bg-transparent w-full text-2xl font-bold outline-none" onChange={(e) => setParams({...params, leads: parseFloat(e.target.value) || 0})}/>
                </div>
                <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                  <label className="text-[10px] font-bold text-emerald-500 uppercase mb-2 block flex items-center gap-2"><Target size={12}/> Конверсия (%)</label>
                  <input type="number" placeholder="0" className="bg-transparent w-full text-2xl font-bold outline-none text-emerald-500" onChange={(e) => setParams({...params, conv: parseFloat(e.target.value) || 0})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 text-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Ср. Чек</label>
                    <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" onChange={(e) => setParams({...params, check: parseFloat(e.target.value) || 0})}/>
                  </div>
                  <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 text-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Маржа (%)</label>
                    <input type="number" placeholder="0" className="bg-transparent w-full text-xl font-bold outline-none text-center" onChange={(e) => setParams({...params, margin: parseFloat(e.target.value) || 0})}/>
                  </div>
                </div>
              </div>
              
              {params.leads > 0 && (
                <div className="mt-8 space-y-4 animate-in fade-in">
                   <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex justify-between items-center">
                      <div><p className="text-[9px] font-bold text-red-400 uppercase mb-1">Упущенная прибыль</p><h3 className="text-xl font-black">{formatCurrency((params.leads * ((100-params.conv)/100) * params.check * (params.margin/100)))}</h3></div>
                      <TrendingDown className="text-red-500 opacity-50" size={24}/>
                   </div>
                   <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6 text-white relative z-10">
                        <div><p className="text-[10px] font-black uppercase opacity-80 mb-1">Вернем с Mini App (мес)</p><h3 className="text-3xl font-black">{formatCurrency((params.leads * ((100-params.conv)/100) * params.check * (params.margin/100)) * 0.2)}</h3></div>
                      </div>
                      <button onClick={handleAIStrategy} disabled={isAnalyzing} className="w-full py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all relative z-10">
                        {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16}/>} Получить стратегию ИИ
                      </button>
                   </div>
                   {aiAnalysis && (
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[30px] animate-in slide-in-from-top-4">
                       <p className="text-xs text-zinc-300 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 whitespace-pre-line">{aiAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- LEARN MODULE --- */}
        {mode === 'learn' && (
          <div className="animate-in slide-in-from-right duration-500">
             <button onClick={() => navigateTo('select')} className="mb-6 text-zinc-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronRight className="rotate-180" size={14}/> Назад</button>
             <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-8 shadow-2xl min-h-[440px] flex flex-col justify-center">
                
                {learnStep === 'manifesto' && (
                  <div className="animate-in fade-in">
                    <h2 className="text-xl font-black italic mb-6 leading-tight uppercase">Telegram-шопп: Тренд или хайп?</h2>
                    <div className="space-y-4 text-zinc-400 text-sm leading-relaxed mb-10 italic">
                       <p>❌ 2009: Bitcoin — забава</p>
                       <p>❌ 2019: Kaspi — непонятно</p>
                       <p className="text-white font-bold not-italic">Вы снова зритель? Или пора что-то менять?</p>
                    </div>
                    <button onClick={() => setLearnStep('faq')} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">🔥 ПОРА ВСЁ МЕНЯТЬ</button>
                  </div>
                )}

                {learnStep === 'faq' && (
                  <div className="animate-in fade-in">
                    <h2 className="text-sm font-bold mb-6 text-blue-400 uppercase tracking-widest text-center">3 вопроса учеников:</h2>
                    <div className="space-y-3 mb-8">
                      {['📈 Нужно ли это бизнесу?', '💰 Смогу ли я заработать?', '⚙️ А если я не технарь?'].map((q, i) => (
                        <button key={i} onClick={() => setViewedFaq(new Set([...viewedFaq, i]))} className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 text-xs font-bold ${viewedFaq.has(i) ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-blue-500/5 border-blue-500/20 text-blue-100'}`}>
                          {viewedFaq.has(i) ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Activity size={16}/>} {q}
                        </button>
                      ))}
                    </div>
                    {viewedFaq.size >= 3 && (
                      <button onClick={() => setLearnStep('segments')} className="w-full py-5 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-widest animate-bounce">🤔 А У МЕНЯ ПОЛУЧИТСЯ?</button>
                    )}
                  </div>
                )}

                {learnStep === 'segments' && (
                   <div className="animate-in fade-in text-center">
                      <h2 className="text-xl font-black mb-6 uppercase text-blue-400 italic">Конечно получится!</h2>
                      <p className="text-zinc-400 text-xs mb-8">Выбери свою точку старта:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["Мама в декрете", "В найме", "Без работы", "SMM / Профи"].map(s => (
                          <button key={s} onClick={() => setLearnStep('offer')} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-bold uppercase hover:border-blue-500 transition-colors">{s}</button>
                        ))}
                      </div>
                   </div>
                )}

                {learnStep === 'offer' && (
                  <div className="animate-in zoom-in text-center">
                    <Star className="text-yellow-400 mx-auto mb-4" size={40} fill="currentColor"/>
                    <h2 className="text-2xl font-black mb-4 uppercase leading-none">Твой старт</h2>
                    <p className="text-xs text-zinc-500 mb-8 leading-relaxed">Начни создавать системы и зарабатывать от 100.000 ₸</p>
                    <a href="https://t.me/taipanmedia" className="block w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest mb-4 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
                       <Rocket size={16}/> НАПИСАТЬ МЕНЕДЖЕРУ
                    </a>
                  </div>
                )}

             </div>
          </div>
        )}
      </div>
    </div>
  );
}
