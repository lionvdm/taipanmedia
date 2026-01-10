import React, { useState, useEffect } from 'react';
import { 
  Zap, Briefcase, Code, ChevronRight, ArrowRight, Activity, 
  Users, TrendingUp, ShoppingBag, Calculator, X, BrainCircuit, Loader2
} from 'lucide-react';

const formatCurrency = (val) => new Intl.NumberFormat('ru-RU').format(val) + ' ₸';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('select'); 
  const [bizParams, setBizParams] = useState({ users: 0, check: 0, margin: 0, currentConversion: 2 });
  
  // Состояния для ИИ
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getAiStrategy = async () => {
    setIsAiLoading(true);
    setAiResponse("");
    
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const prompt = `Ты — эксперт по Telegram Mini Apps. 
    Бизнес данные: Трафик ${bizParams.users} чел/мес, Ср. чек ${bizParams.check} тенге, Маржа ${bizParams.margin}%. 
    Напиши краткую, дерзкую стратегию (3 пункта), как увеличить прибыль именно этому бизнесу через Mini App. 
    Отвечай на русском языке, используй эмодзи.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setAiResponse(data.choices[0].message.content);
    } catch (err) {
      setAiResponse("Ошибка: Проверьте баланс OpenAI или настройки ключа в Vercel.");
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-emerald-500">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="animate-pulse">CONNECTING TO TAIPAN_AI...</p>
      </div>
    </div>
  );

  if (mode === 'select') {
    return (
      <div className="flex flex-col h-screen bg-black text-white p-8 justify-center items-center">
        <h1 className="text-4xl font-black mb-8 italic text-emerald-500">TAIPAN MEDIA</h1>
        <div className="grid gap-4 w-full max-w-xs">
          <button onClick={() => setMode('business')} className="p-6 bg-zinc-900 border border-emerald-500/30 rounded-3xl hover:bg-emerald-900/20 transition-all text-left">
            <Briefcase className="mb-2 text-emerald-500" />
            <h3 className="font-bold">Бизнес</h3>
            <p className="text-xs text-zinc-500">Рассчитать прибыль и ИИ стратегию</p>
          </button>
          <button onClick={() => setMode('dev')} className="p-6 bg-zinc-900 border border-blue-500/30 rounded-3xl hover:bg-blue-900/20 transition-all text-left">
            <Code className="mb-2 text-blue-500" />
            <h3 className="font-bold">Разработчик</h3>
            <p className="text-xs text-zinc-500">Доступ к протоколам</p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'business') {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 pb-20">
        <button onClick={() => setMode('select')} className="mb-6 text-zinc-500 flex items-center gap-2"><ChevronRight className="rotate-180" size={16}/> Назад</button>
        
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[28px] p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calculator size={20} className="text-emerald-500"/> Калькулятор</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Трафик / мес</label>
                <input type="number" value={bizParams.users} onChange={(e) => setBizParams({...bizParams, users: e.target.value})} className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl mt-1 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Средний чек (₸)</label>
                <input type="number" value={bizParams.check} onChange={(e) => setBizParams({...bizParams, check: e.target.value})} className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl mt-1 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Маржа (%)</label>
                <input type="number" value={bizParams.margin} onChange={(e) => setBizParams({...bizParams, margin: e.target.value})} className="w-full bg-black/40 border border-zinc-800 p-3 rounded-xl mt-1 focus:border-emerald-500 outline-none" />
              </div>
            </div>

            <button 
              onClick={getAiStrategy}
              disabled={isAiLoading || !bizParams.users}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={20}/> : <BrainCircuit size={20}/>}
              {aiResponse ? "Обновить стратегию ИИ" : "Сгенерировать стратегию ИИ"}
            </button>
          </div>

          {aiResponse && (
            <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-[28px] p-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-emerald-500 font-bold mb-4 flex items-center gap-2">
                <Zap size={18}/> Taipan AI Советует:
              </h3>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default App;
