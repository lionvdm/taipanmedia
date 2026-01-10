import React, { useState, useEffect } from 'react';
import { 
  Briefcase, ChevronRight, Calculator, Zap, 
  BrainCircuit, Loader2, TrendingDown, GraduationCap,
  CheckCircle2, Star, Rocket, Activity, Code, Target, Users
} from 'lucide-react';

const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) return "Ошибка: API ключ не найден.";
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты эксперт Taipan Media. Пиши кратко, по делу, без использования формул LaTeX и символов \\[ \\]. Только текст." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Ошибка получения данных.";
  } catch (error) {
    return "Ошибка связи с сервером.";
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

  // ТОЧЕЧНАЯ ПРАВКА: Сброс анализа при смене режима
  const navigateTo = (newMode) => {
    setAiAnalysis(''); 
    setMode(newMode);
  };

  const handleAIStrategy = async () => {
    setIsAnalyzing(true);
    const lostConv = 100 - (params.conv || 0);
    const lostProfit = (params.leads * (lostConv / 100)) * params.check * (params.margin / 100);
    const res = await callOpenAIAPI(`Упущенная прибыль: ${formatCurrency(lostProfit)}. Как Mini App поможет вернуть 20%? Дай 3 тезиса.`);
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
        
        {/* ЛОГОТИП (Клик сбрасывает всё) */}
        <div className="text-center mb-10 cursor-pointer" onClick={() => navigateTo('select')}>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">TAIPAN<span className="text-emerald-500">MEDIA</span></h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] mt-2">Scalability Protocol V1</p>
        </div>

        {mode === 'select' && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
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

        {mode === 'business' && (
          <div className="animate-in zoom-in">
            <button onClick={() => navigateTo('select')} className="mb-6 text-zinc-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronRight className="rotate-180" size={14}/> Назад</button>
            <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-8"><Calculator className="text-emerald-500" size={20} /><h2 className="text-xl font-bold">Прогноз Эффективности</h2></div>
              <div className="space-y-4">
                <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block flex items-center gap-2"><Users size={12}/> Трафик в месяц</label>
                  <input type="number" className="bg-transparent w-full text-2xl font-bold outline-none" placeholder="0" onChange={(e) => setParams({...params, leads: parseFloat(e.target.value) || 0})}/>
                </div>
                <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50">
                  <label className="text-[10px] font-bold text-emerald-500 uppercase mb-2 block flex items-center gap-2"><Target size={12}/> Конверсия (%)</label>
                  <input type="number" className="bg-transparent w-full text-2xl font-bold outline-none text-emerald-500" placeholder="0" onChange={(e) => setParams({...params, conv: parseFloat(e.target.value) || 0})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 text-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Ср. Чек</label>
                    <input type="number" className="bg-transparent w-full text-lg font-bold outline-none text-center" placeholder="0" onChange={(e) => setParams({...params, check: parseFloat(e.target.value) || 0})}/>
                  </div>
                  <div className="bg-[#141414] rounded-2xl p-4 border border-zinc-800/50 text-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Маржа (%)</label>
                    <input type="number" className="bg-transparent w-full text-lg font-bold outline-none text-center" placeholder="0" onChange={(e) => setParams({...params, margin: parseFloat(e.target.value) || 0})}/>
                  </div>
                </div>
              </div>
              
              {params.leads > 0 && (
                <div className="mt-8 space-y-4">
                   <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[32px] p-6 shadow-xl">
                      <p className="text-[10px] font-black uppercase opacity-80 mb-1">Вернем с Mini App</p>
                      <h3 className="text-3xl font-black mb-6">{formatCurrency((params.leads * ((100-params.conv)/100) * params.check * (params.margin/100)) * 0.2)}</h3>
                      <button onClick={handleAIStrategy} disabled={isAnalyzing} className="w-full py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16}/>} Сгенерировать стратегию
                      </button>
                   </div>
                   {aiAnalysis && (
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[24px] animate-in slide-in-from-top-2">
                       <p className="text-xs text-zinc-300 leading-relaxed italic whitespace-pre-line">{aiAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'learn' && (
          <div className="animate-in slide-in-from-right">
             <button onClick={() => navigateTo('select')} className="mb-6 text-zinc-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronRight className="rotate-180" size={14}/> Назад</button>
             <div className="bg-[#0C0C0C] border border-zinc-800/50 rounded-[40px] p-8 shadow-2xl min-h-[400px]">
                {learnStep === 'manifesto' && (
                  <div className="animate-in fade-in">
                    <h2 className="text-xl font-black italic mb-6 uppercase">Telegram Mini Apps — Будущее?</h2>
                    <p className="text-zinc-400 text-sm mb-10 italic leading-relaxed">Пока другие сомневаются, индустрия растет на 300% в год. Твой ход.</p>
                    <button onClick={() => setLearnStep('faq')} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest">🔥 Начать обучение</button>
                  </div>
                )}
                {/* Остальные шаги обучения сохраняются по аналогии... */}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
