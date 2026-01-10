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
    setAnalysis('Подключаюсь к нейросети...');
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Напиши один короткий совет для бизнеса." }] }]
        })
      });
      
      const data = await response.json();

      // Если Google вернул ошибку в самом ответе
      if (data.error) {
        setAnalysis(`Ошибка Google: ${data.error.message}`);
        return;
      }

      if (data.candidates && data.candidates[0].content) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("ИИ прислал пустой ответ. Попробуй еще раз.");
      }
    } catch (e) {
      setAnalysis("Ошибка сети: скорее всего, доступ к Google AI заблокирован в вашем регионе. Попробуйте включить VPN.");
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
      <h1 style={{color: '#10b981', fontStyle: 'italic', fontWeight: '900', fontSize: '28px', margin: 0}}>TAIPAN MEDIA</h1>
      <p style={{color: '#71717a', fontSize: '10px', marginBottom: '30px'}}>PREMIUM SYSTEMS</p>
      
      {view === 'select' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <button onClick={() => setView('biz')} style={{padding: '25px', backgroundColor: '#18181b', border: '1px solid #10b98144', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer'}}>
            <div style={{fontSize: '18px', fontWeight: 'bold'}}>💼 Предприниматель</div>
            <div style={{fontSize: '12px', color: '#71717a'}}>Рассчитать стратегию роста</div>
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setView('select')} style={{color: '#71717a', background: 'none', border: 'none', marginBottom: '20px', cursor: 'pointer'}}>← НАЗАД</button>
          <div style={{backgroundColor: '#18181b', padding: '30px', borderRadius: '25px', border: '1px solid #10b98122'}}>
            <h2 style={{fontSize: '18px', marginBottom: '20px'}}>АНАЛИТИКА TAIPAN ИИ</h2>
            <button 
              onClick={handleAI} 
              disabled={isAnalyzing}
              style={{width: '100%', backgroundColor: '#10b981', color: 'black', fontWeight: '900', padding: '18px', borderRadius: '15px', border: 'none', cursor: 'pointer'}}
            >
              {isAnalyzing ? "ЗАПРОС..." : "СГЕНЕРИРОВАТЬ СТРАТЕГИЮ"}
            </button>
            {analysis && (
              <div style={{marginTop: '25px', padding: '20px', backgroundColor: 'black', borderRadius: '15px', fontSize: '14px', borderLeft: '4px solid #10b981'}}>
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
