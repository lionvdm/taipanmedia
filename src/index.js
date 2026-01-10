import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Твой действующий API ключ
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
    setAnalysis('Taipan ИИ подключается к базе данных...');
    
    try {
      // Используем актуальный путь для v1/gemini-1.5-flash
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Ты эксперт Taipan Media. Дай один очень короткий и дерзкий совет для бизнеса в Казахстане, как заработать больше через Telegram Mini Apps. Не более 2 предложений." 
            }] 
          }]
        })
      });
      
      const data = await response.json();

      if (data.error) {
        setAnalysis(`Ошибка Google: ${data.error.message}`);
      } else if (data.candidates && data.candidates[0].content) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("ИИ прислал пустой ответ. Попробуйте еще раз.");
      }
    } catch (e) {
      setAnalysis("Ошибка сети. Если вы в Казахстане, для работы ИИ-функций может потребоваться VPN.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return (
    <div style={{backgroundColor: 'black', color: '#10b981', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '14px'}}>
      > СИСТЕМА TAIPAN ЗАГРУЖАЕТСЯ...
    </div>
  );

  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: '-apple-system, sans-serif'}}>
      <header style={{marginBottom: '40px'}}>
        <h1 style={{color: '#10b981', fontStyle: 'italic', fontWeight: '900', fontSize: '28px', margin: 0}}>TAIPAN MEDIA</h1>
        <p style={{color: '#71717a', fontSize: '10px', letterSpacing: '2px', marginTop: '5px'}}>PREMIUM DIGITAL SOLUTIONS</p>
      </header>
      
      {view === 'select' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <button 
            onClick={() => setView('biz')} 
            style={{padding: '25px', backgroundColor: '#18181b', border: '1px solid #10b98144', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer'}}
          >
            <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '5px'}}>💼 Предприниматель</div>
            <div style={{fontSize: '12px', color: '#71717a'}}>Узнать профит от Mini App</div>
          </button>
          
          <button 
            onClick={() => alert('Скоро!')} 
            style={{padding: '25px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer', opacity: 0.7}}
          >
            <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: '#3b82f6'}}>💻 Разработчик</div>
            <div style={{fontSize: '12px', color: '#71717a'}}>Обучение и заказы</div>
          </button>
        </div>
      ) : (
        <div style={{animation: 'fadeIn 0.5s ease'}}>
          <button 
            onClick={() => setView('select')} 
            style={{color: '#71717a', background: 'none', border: 'none', marginBottom: '20px', cursor: 'pointer', fontSize: '14px'}}
          >
            ← НАЗАД В МЕНЮ
          </button>
          
          <div style={{backgroundColor: '#18181b', padding: '30px', borderRadius: '25px', border: '1px solid #10b98122'}}>
            <h2 style={{fontSize: '20px', marginBottom: '15px', fontWeight: '800'}}>АНАЛИТИКА TAIPAN ИИ</h2>
            <p style={{fontSize: '14px', color: '#a1a1aa', marginBottom: '25px'}}>Нажмите на кнопку для генерации совета от нейросети.</p>
            
            <button 
              onClick={handleAI} 
              disabled={isAnalyzing}
              style={{
                width: '100%', 
                backgroundColor: isAnalyzing ? '#064e3b' : '#10b981', 
                color: 'black', 
                fontWeight: '900', 
                padding: '18px', 
                borderRadius: '15px', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              {isAnalyzing ? "ОБРАБОТКА..." : "СГЕНЕРИРОВАТЬ СОВЕТ"}
            </button>
            
            {analysis && (
              <div style={{
                marginTop: '25px', 
                padding: '20px', 
                backgroundColor: '#000', 
                borderRadius: '15px', 
                fontSize: '15px', 
                lineHeight: '1.6', 
                borderLeft: '4px solid #10b981',
                color: '#e4e4e7'
              }}>
                {analysis}
              </div>
            )}
          </div>
        </div>
      )}
      
      <footer style={{marginTop: '50px', textAlign: 'center'}}>
        <p style={{color: '#27272a', fontSize: '10px', fontWeight: 'bold'}}>TAIPAN MEDIA © 2026</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
