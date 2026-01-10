import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const apiKey = "AIzaSyBL5gCb5jrvRKakSwu_WCUomBvS_IWjsYA"; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('select');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAI = async () => {
    setIsAnalyzing(true);
    setAnalysis('Taipan ИИ анализирует... Подождите.');
    
    // Пробуем модель flash-latest, она самая стабильная для v1beta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Напиши один очень короткий, хищный совет для бизнеса в Казахстане по Telegram Mini Apps. 1 предложение." }] }]
        })
      });
      
      const data = await response.json();

      if (data.error) {
        setAnalysis(`Google заблокировал запрос. Причина: ${data.error.message}. Попробуйте включить VPN.`);
      } else if (data.candidates && data.candidates[0].content) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("ИИ не смог ответить. Попробуйте еще раз.");
      }
    } catch (e) {
      setAnalysis("Ошибка соединения. Включите VPN, если вы в Казахстане.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return (
    <div style={{backgroundColor: 'black', color: '#10b981', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace'}}>
      > СИСТЕМА ЗАГРУЖАЕТСЯ...
    </div>
  );

  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif'}}>
      <h1 style={{color: '#10b981', fontStyle: 'italic', fontWeight: '900', fontSize: '28px'}}>TAIPAN MEDIA</h1>
      
      {view === 'select' ? (
        <button onClick={() => setView('biz')} style={{width: '100%', marginTop: '30px', padding: '25px', backgroundColor: '#18181b', border: '1px solid #10b98144', borderRadius: '20px', textAlign: 'left', color: 'white'}}>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>💼 Предприниматель</div>
          <div style={{fontSize: '12px', color: '#71717a'}}>Получить совет от ИИ</div>
        </button>
      ) : (
        <div>
          <button onClick={() => setView('select')} style={{color: '#71717a', background: 'none', border: 'none', marginBottom: '20px'}}>← НАЗАД</button>
          <div style={{backgroundColor: '#18181b', padding: '30px', borderRadius: '25px', border: '1px solid #10b98122'}}>
            <button 
              onClick={handleAI} 
              disabled={isAnalyzing}
              style={{width: '100%', backgroundColor: '#10b981', color: 'black', fontWeight: '900', padding: '18px', borderRadius: '15px', border: 'none'}}
            >
              {isAnalyzing ? "ДУМАЮ..." : "СГЕНЕРИРОВАТЬ СОВЕТ"}
            </button>
            {analysis && (
              <div style={{marginTop: '25px', padding: '20px', backgroundColor: '#000', borderRadius: '15px', borderLeft: '4px solid #10b981'}}>
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
