import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Briefcase, Code, ChevronRight, ArrowRight, Calculator, Sparkles, Bot, Loader2, X, Check
} from 'lucide-react';

// Твой ключ уже внутри
const apiKey = "AIzaSyBL5gCb5jrvRKakSwu_WCUomBvS_IWjsYA"; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('select');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleAI = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Дай один короткий и дерзкий совет для бизнеса в Telegram." }] }] })
      });
      const data = await response.json();
      setAnalysis(data.candidates[0].content.parts[0].text);
    } catch (e) {
      setAnalysis("Ошибка подключения к ИИ.");
    }
    setIsAnalyzing(false);
  };

  if (loading) return (
    <div className="flex h-screen bg-black items-center justify-center font-mono text-emerald-500">
      > ЗАГРУЗКА TAIPAN SYSTEM...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <h1 className="text-3xl font-black italic mb-8 text-emerald-500">TAIPAN MEDIA</h1>
      
      {view === 'select' ? (
        <div className="grid gap-4">
          <button onClick={() => setView('biz')} className="p-6 bg-zinc-900 rounded-2xl border border-emerald-500/30 text-left">
            <Briefcase className="mb-2 text-emerald-500" />
            <h2 className="text-xl font-bold">Предприниматель</h2>
            <p className="text-zinc-500 text-sm">Узнать профит от Mini App</p>
          </button>
          <button onClick={() => alert('Скоро!')} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 text-left">
            <Code className="mb-2 text-blue-500" />
            <h2 className="text-xl font-bold">Разработчик</h2>
            <p className="text-zinc-500 text-sm">Обучение и заказы</p>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setView('select')} className="text-zinc-500 flex items-center gap-2">
            <ChevronRight className="rotate-180" /> Назад
          </button>
          <div className="bg-zinc-900 p-6 rounded-3xl border border-emerald-500/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calculator size={18} /> ИИ Стратегия
            </h3>
            <button 
              onClick={handleAI}
              disabled={isAnalyzing}
              className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              ГЕНЕРИРОВАТЬ СОВЕТ
            </button>
            {analysis && (
              <div className="mt-4 p-4 bg-black/50 rounded-xl text-sm border border-emerald-500/10">
                {analysis}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
