import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Твой рабочий ключ Gemini
const apiKey = "AIzaSyBL5gCb5jrvRKakSwu_WCUomBvS_IWjsYA"; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('select');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Красивая задержка для имитации загрузки системы
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAI = async () => {
    setIsAnalyzing(true);
    setAnalysis(''); // Очищаем старый текст перед новым запросом
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Ты эксперт агентства Taipan Media. Дай один очень короткий, дерзкий и полезный совет для предпринимателя в Казахстане, как использовать Telegram Mini Apps для увеличения прибыли. Тон: профессиональный, хищный. Не более 2-3 предложений." 
            }] 
          }]
        })
      });
      
      const data = await response.json();
      
      // Проверка: пришел ли текст от ИИ
      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        setAnalysis("ИИ временно недоступен. Попробуйте еще раз через минуту.");
      }
    } catch (e) {
      console.error("Error:", e);
      setAnalysis("Ошибка сети. Убедитесь, что ваш API ключ активен.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Экран загрузки
  if (loading) return (
    <div style={{backgroundColor: 'black', color: '#10b981', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '14px'}}>
      > СИСТЕМА TAIPAN ЗАГРУЖАЕТСЯ...
    </div>
  );

  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
      <header style={{marginBottom: '40px'}}>
        <h1 style={{color: '#10b981', fontStyle: 'italic', fontWeight: '900', fontSize: '28px', letterSpacing: '-1px', margin: 0}}>TAIPAN MEDIA</h1>
        <p style={{color: '#71717a', fontSize: '10px', marginTop: '5px', letterSpacing: '2px'}}>PREMIUM DIGITAL SOLUTIONS</p>
      </header>
      
      {view === 'select' ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <button 
            onClick={() => setView('biz')} 
            style={{padding: '24px', backgroundColor: '#18181b', border: '1px solid #10b98144', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer', transition: '0.3s'}}
          >
            <div style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '5px'}}>💼 Предприниматель</div>
            <div style={{fontSize: '13px', color: '#a1a1aa'}}>Рассчитать стратегию захвата рынка</div>
          </button>
          
          <button 
            onClick={() => alert('Регистрация в Академию откроется скоро!')} 
            style={{padding: '24px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '20px', textAlign: 'left', color: 'white', cursor: 'pointer', opacity: 0.8}}
          >
            <div style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', color: '#3b82f6'}}>💻 Разработчик</div>
            <div style={{fontSize: '13px', color: '#a1a1aa'}}>Получить доступ к заказам</div>
          </button>
        </div>
      ) : (
        <div style={{animation: 'fadeIn 0.5s ease-in'}}>
          <button 
            onClick={() => setView('select')} 
            style={{color: '#71717a', background: 'none', border: 'none', marginBottom: '25px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}
          >
            ← ВЕРНУТЬСЯ В МЕНЮ
          </button>
          
          <div style={{backgroundColor: '#18181b', padding: '30px', borderRadius: '28px', border: '1px solid #10b98122', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            <h2 style={{fontSize: '20px', marginBottom: '20px', fontWeight: '800'}}>АНАЛИТИКА TAIPAN ИИ</h2>
            <p style={{fontSize: '14px', color: '#a1a1aa', marginBottom: '25px'}}>Нажмите кнопку, чтобы нейросеть сгенерировала персональный совет для вашего бизнеса.</p>
            
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
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                transition: '0.2s'
              }}
            >
              {isAnalyzing ? "СИСТЕМА ДУМАЕТ..." : "СГЕНЕРИРОВАТЬ СТРАТЕГИЮ"}
            </button>
            
            {analysis && (
              <div style={{
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#000', 
                borderRadius: '15px', 
                fontSize: '15px', 
                lineHeight: '1.6', 
                borderLeft: '4px solid #10b981',
                color: '#e4e4e7',
                animation: 'slideUp 0.4s ease-out'
              }}>
                {analysis}
              </div>
            )}
          </div>
        </div>
      )}
      
      <footer style={{position: 'fixed', bottom: '20px', width: 'calc(100% - 40px)', textAlign: 'center'}}>
        <p style={{color: '#27272a', fontSize: '10px', fontWeight: 'bold'}}>TAIPAN MEDIA © 2026</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
