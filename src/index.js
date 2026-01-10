import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const apiKey = "AIzaSyBL5gCb5jrvRKakSwu_WCUomBvS_IWjsYA"; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('select');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAI = async () => {
    setIsAnalyzing(true);
    setAnalysis('Taipan ИИ анализирует рынок...');
    
    try {
      // ВНИМАНИЕ: Изменен адрес на v1beta — это решит проблему со скриншота
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Ты эксперт Taipan Media. Дай один очень короткий и дерзкий совет для бизнеса в Казахстане по Telegram Mini Apps. 1-2 предложения." 
            }] 
          }]
        })
      });
      
      const data = await response.json();

      if (data.error) {
        setAnalysis(`Ошибка: ${data.error.message}`);
      } else if (data.candidates && data.candidates[0].content) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("ИИ не ответил. Попробуйте еще раз.");
      }
    } catch (e) {
      setAnalysis("Ошибка сети. Попробуйте обновить страницу.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return (
    <div style={{backgroundColor: 'black', color: '#10b981', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace'}}>
      > СИСТЕМА TAIPAN ЗАГРУЖАЕТСЯ...
    </div>
  );

  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif'}}>
      <header style={{marginBottom: '40px'}}>
        <h1 style={{color: '#10b981', fontStyle: 'italic', fontWeight: '900', fontSize: '28px', margin: 0}}>TAIPAN MEDIA</h1>
        <p style={{color: '#71717a', fontSize: '10px', letterSpacing: '2px', marginTop: '5px'}}>PREMIUM DIGITAL SOLUTIONS</p>
      </header>
      
      {view === 'select' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <button onClick={() => setView('biz')} style={{padding: '25px', backgroundColor: '#18181b', border: '1px solid #10b98144', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer'}}>
            <div style={{fontSize: '18px', fontWeight: 'bold'}}>💼 Предприниматель</div>
            <div style={{fontSize: '12px', color: '#71717a'}}>Узнать профит от Mini App</div>
          </button>
        </div>
      ) : (
        <div style={{animation: 'fadeIn 0.5s ease'}}>
          <button onClick={() => setView('select')} style={{color: '#71717a', background: 'none', border: 'none', marginBottom: '20px', cursor: 'pointer'}}>← НАЗАД</button>
          <div style={{backgroundColor: '#18181b', padding: '30px', borderRadius: '25px', border: '1px solid #10b98122'}}>
            <h2 style={{fontSize: '20px', marginBottom: '15px', fontWeight: '800'}}>АНАЛИТИКА TAIPAN ИИ</h2>
            <button 
              onClick={handleAI} 
              disabled={isAnalyzing}
              style={{width: '100%', backgroundColor: '#10b981', color: 'black', fontWeight: '900', padding: '18px', borderRadius: '15px', border: 'none', cursor: 'pointer'}}
            >
              {isAnalyzing ? "АНАЛИЗ..." : "СГЕНЕРИРОВАТЬ СОВЕТ"}
            </button>
            {analysis && (
              <div style={{marginTop: '25px', padding: '20px', backgroundColor: '#000', borderRadius: '15px', fontSize: '15px', borderLeft: '4px solid #10b981', color: '#e4e4e7'}}>
                {analysis}
              </div>
            )}
          </div>
        </div>
      )}
      <p style={{textAlign: 'center', color: '#27272a', fontSize: '10px', marginTop: '40px'}}>TAIPAN MEDIA © 2026</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
