import React, { useState, useEffect } from 'react';
import { 
  Briefcase, ChevronRight, Calculator, Zap, 
  BrainCircuit, Loader2, TrendingDown, GraduationCap,
  CheckCircle2, Star, Rocket, Activity, Code
} from 'lucide-react';

// --- API INTEGRATION ---
const callOpenAIAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) return "Ошибка: Настройте API ключ в Vercel.";
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты — эксперт Taipan Media. Отвечай кратко, профессионально, без использования LaTeX или формул вида \\[ \\]. Пиши обычным текстом и простыми числами." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) return `Ошибка: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || "Ошибка системы.";
  } catch (error) {
    return "Связь прервана. Проверьте баланс аккаунта OpenAI.";
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

  // Функция для безопасного возврата в меню
  const resetToMenu = () => {
    setAiAnalysis(''); // Очищаем стратегию, чтобы она не «преследовала» на других экранах
    setMode('select');
    setLearnStep('manifesto');
    setViewedFaq(new Set());
  };

  const handleAIStrategy = async () => {
    setIsAnalyzing(true);
    const lostConv = 100 - (params.conv || 0);
    const lostProfit = (params.leads * (lostConv / 100)) * params.check * (params.margin / 100);
    const res = await callOpenAIAPI(`Бизнес теряет ${lostConv}% заявок. Упущенная прибыль: ${formatCurrency(lostProfit)}. Как Mini App вернет часть денег? Дай 3 конкретных шага.`);
    setAiAnalysis(res);
    setIsAnalyzing(false);
  };

  if (showSplash) return (
    <div style={{backgroundColor: '#000', color: '#10b981', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace'}}>
      <p className="animate-pulse">> TAIPAN_ACCESS_GRANTED</p>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#050505', color: '#fff', padding: '16px', fontFamily: 'sans-serif'}}>
      <div style={{maxWidth: '400px', margin: '0 auto', paddingTop: '24px'}}>
        
        {/* HEADER */}
        <div style={{textAlign: 'center', marginBottom: '40px'}} onClick={resetToMenu}>
          <h1 style={{fontSize: '28px', fontWeight: '900', fontStyle: 'italic', margin: 0}}>TAIPAN<span style={{color: '#10b981'}}>MEDIA</span></h1>
          <p style={{fontSize: '9px', color: '#71717a', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '8px'}}>Scalability Protocol V1</p>
        </div>

        {/* MENU SELECT */}
        {mode === 'select' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <button onClick={() => setMode('business')} style={{textAlign: 'left', padding: '24px', backgroundColor: '#18181b66', border: '1px solid #27272a', borderRadius: '32px', cursor: 'pointer'}}>
              <Briefcase style={{color: '#10b981', marginBottom: '16px'}} size={28} />
              <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: '#fff'}}>Бизнес модуль</h3>
              <p style={{margin: 0, fontSize: '12px', color: '#71717a', fontStyle: 'italic'}}>Анализ упущенной прибыли</p>
            </button>
            <button onClick={() => setMode('learn')} style={{textAlign: 'left', padding: '24px', backgroundColor: '#18181b66', border: '1px solid #27272a', borderRadius: '32px', cursor: 'pointer'}}>
              <GraduationCap style={{color: '#3b82f6', marginBottom: '16px'}} size={28} />
              <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: '#fff'}}>Хочу научиться</h3>
              <p style={{margin: 0, fontSize: '12px', color: '#71717a', fontStyle: 'italic'}}>Создавать Mini Apps</p>
            </button>
          </div>
        )}

        {/* BUSINESS MODULE */}
        {mode === 'business' && (
          <div className="animate-in fade-in">
            <button onClick={resetToMenu} style={{background: 'none', border: 'none', color: '#71717a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '24px'}}>
              <ChevronRight style={{transform: 'rotate(180deg)'}} size={14}/> Назад
            </button>
            
            <div style={{backgroundColor: '#0c0c0c', border: '1px solid #27272a80', borderRadius: '40px', padding: '24px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
                <Calculator style={{color: '#10b981'}} size={20} /> Прогноз
              </h2>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{backgroundColor: '#141414', padding: '16px', borderRadius: '16px', border: '1px solid #27272a80'}}>
                  <label style={{fontSize: '10px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px'}}>Трафик / мес</label>
                  <input type="number" placeholder="0" style={{background: 'none', border: 'none', color: '#fff', fontSize: '24px', fontWeight: 'bold', outline: 'none', width: '100%'}} onChange={(e) => setParams({...params, leads: parseFloat(e.target.value) || 0})}/>
                </div>
                <div style={{backgroundColor: '#141414', padding: '16px', borderRadius: '16px', border: '1px solid #27272a80'}}>
                  <label style={{fontSize: '10px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px'}}>Конверсия (%)</label>
                  <input type="number" placeholder="0" style={{background: 'none', border: 'none', color: '#10b981', fontSize: '24px', fontWeight: 'bold', outline: 'none', width: '100%'}} onChange={(e) => setParams({...params, conv: parseFloat(e.target.value) || 0})}/>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div style={{backgroundColor: '#141414', padding: '16px', borderRadius: '16px', border: '1px solid #27272a80'}}>
                    <label style={{fontSize: '10px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px'}}>Чек</label>
                    <input type="number" placeholder="0" style={{background: 'none', border: 'none', color: '#fff', fontSize: '18px', fontWeight: 'bold', outline: 'none', width: '100%'}} onChange={(e) => setParams({...params, check: parseFloat(e.target.value) || 0})}/>
                  </div>
                  <div style={{backgroundColor: '#141414', padding: '16px', borderRadius: '16px', border: '1px solid #27272a80'}}>
                    <label style={{fontSize: '10px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px'}}>Маржа %</label>
                    <input type="number" placeholder="0" style={{background: 'none', border: 'none', color: '#fff', fontSize: '18px', fontWeight: 'bold', outline: 'none', width: '100%'}} onChange={(e) => setParams({...params, margin: parseFloat(e.target.value) || 0})}/>
                  </div>
                </div>
              </div>

              {params.leads > 0 && (
                <div style={{marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                   <div style={{padding: '24px', background: 'linear-gradient(to bottom right, #059669, #064e3b)', borderRadius: '32px'}}>
                      <p style={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8, margin: '0 0 4px 0'}}>Вернем с Mini App</p>
                      <h3 style={{fontSize: '32px', fontWeight: '900', margin: 0}}>{formatCurrency((params.leads * ((100-params.conv)/100) * params.check * (params.margin/100)) * 0.2)}</h3>
                      <button onClick={handleAIStrategy} disabled={isAnalyzing} style={{width: '100%', marginTop: '24px', padding: '16px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer'}}>
                        {isAnalyzing ? 'Загрузка...' : 'Получить стратегию ИИ'}
                      </button>
                   </div>
                   {aiAnalysis && (
                    <div style={{padding: '20px', backgroundColor: '#10b98110', border: '1px solid #10b98133', borderRadius: '24px'}}>
                      <p style={{fontSize: '13px', color: '#d1d5db', lineHeight: '1.6', fontStyle: 'italic', margin: 0}}>{aiAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEARN MODULE */}
        {mode === 'learn' && (
          <div className="animate-in fade-in">
             <button onClick={resetToMenu} style={{background: 'none', border: 'none', color: '#71717a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '24px'}}>
              <ChevronRight style={{transform: 'rotate(180deg)'}} size={14}/> Назад
            </button>
             <div style={{backgroundColor: '#0c0c0c', border: '1px solid #27272a80', borderRadius: '40px', padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                {learnStep === 'manifesto' && (
                  <div>
                    <h2 style={{fontSize: '22px', fontWeight: '900', fontStyle: 'italic', marginBottom: '24px'}}>Telegram-шопп: Тренд или хайп?</h2>
                    <p style={{color: '#71717a', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px'}}>Пока одни смотрят со стороны, другие внедряют Mini Apps и меняют правила игры. Вы готовы?</p>
                    <button onClick={() => setLearnStep('faq')} style={{width: '100%', padding: '20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase'}}>🔥 Пора менять всё</button>
                  </div>
                )}
                {learnStep === 'faq' && (
                  <div>
                    <h2 style={{fontSize: '14px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '24px', textAlign: 'center'}}>Топ вопросы:</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      {['Смогу ли я?', 'Нужно ли бизнесу?', 'Как заработать?'].map((q, i) => (
                        <button key={i} onClick={() => setViewedFaq(new Set([...viewedFaq, i]))} style={{padding: '16px', backgroundColor: viewedFaq.has(i) ? '#18181b' : '#3b82f610', border: '1px solid #3b82f633', borderRadius: '16px', color: '#fff', textAlign: 'left', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          {q} {viewedFaq.has(i) && <CheckCircle2 size={16} color="#10b981"/>}
                        </button>
                      ))}
                    </div>
                    {viewedFaq.size >= 3 && (
                      <button onClick={() => setLearnStep('offer')} style={{width: '100%', marginTop: '32px', padding: '20px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase'}}>Узнать путь</button>
                    )}
                  </div>
                )}
                {learnStep === 'offer' && (
                  <div style={{textAlign: 'center'}}>
                    <Star style={{color: '#fbbf24', marginBottom: '16px'}} size={48} />
                    <h2 style={{fontSize: '24px', fontWeight: '900', marginBottom: '16px'}}>Твой старт в IT</h2>
                    <p style={{color: '#71717a', fontSize: '12px', marginBottom: '32px'}}>Начни зарабатывать на создании Mini Apps от 100.000 ₸</p>
                    <a href="https://t.me/taipanmedia" style={{display: 'block', padding: '20px', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase'}}>🎯 Написать куратору</a>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
