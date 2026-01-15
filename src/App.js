import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  X,
  MessageSquare
} from 'lucide-react';

/**
 * Taipan Media - Elite React Application
 * Integrated Matrix Background, Glassmorphism UI, and State-based Navigation.
 */

const App = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'education'
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Matrix Canvas Logic
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, columns;
    let drops = [];
    const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const initMatrix = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 20);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#00FF9D';
      ctx.font = '16px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    initMatrix();
    const interval = setInterval(drawMatrix, 50);
    window.addEventListener('resize', initMatrix);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', initMatrix);
    };
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    e.target.reset();
  };

  // Internal Components
  const TelegramLogo = ({ className }) => (
    <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.014.093.03.3.023.48z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        <div 
          className="absolute inset-0 opacity-20 -z-10" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)'
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,157,0.1)_0%,transparent_70%)] blur-[80px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-8">
        
        {currentView === 'main' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 
                className="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-2 font-serif relative"
                style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}
              >
                TAIPAN MEDIA
                <span className="absolute inset-0 -z-10 opacity-50 blur-[10px] animate-pulse bg-gradient-to-r from-[#00FF9D] via-[#ccff00] to-[#00FF9D] bg-clip-text text-transparent">
                  TAIPAN MEDIA
                </span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-semibold">Цифровые технологии</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Telegram Shop Card */}
              <div 
                onClick={() => openModal('Telegram Shop')}
                className="group relative bg-black/60 backdrop-blur-2xl border border-[#00FF9D]/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                  <TelegramLogo className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2">Telegram<br/>Магазин</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Создадим ваш магазин с продажами 24/7</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">
                  ЗАКАЗАТЬ <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Education Card */}
              <div 
                onClick={() => setCurrentView('education')}
                className="group relative bg-black/60 backdrop-blur-2xl border border-[#00FF9D]/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                  <GraduationCap className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2 leading-tight text-white group-hover:text-[#00FF9D] transition-colors">ОБУЧЕНИЕ</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2">Обучим создавать и продавать телеграм-магазины даже с телефона. Без кода, под ключ</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">
                  ПЕРЕЙТИ <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>

            {/* Mini App Card */}
            <div 
              onClick={() => openModal('Mini App')}
              className="group relative bg-black/60 backdrop-blur-2xl border border-[#00FF9D]/10 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center hover:border-[#00FF9D]/30 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Заказать для своего бизнеса</p>
            </div>
          </div>
        ) : (
          /* Education View */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col h-full">
            <button 
              onClick={() => setCurrentView('main')} 
              className="flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-8 hover:opacity-70 transition-all w-fit"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Назад
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tighter mb-2 font-sans">
                ПРОГРАММА<br/><span className="text-[#00FF9D]">ОБУЧЕНИЯ</span>
              </h2>
              <div className="h-1 w-12 bg-[#00FF9D]" />
            </div>

            <div className="space-y-4">
              {[
                { step: '01', title: 'Основы без кода', desc: 'Учимся создавать структуру магазина без единой строчки кода. Только логика и инструменты.' },
                { step: '02', title: 'Дизайн и UX', desc: 'Делаем интерфейс, в котором хочется покупать. Работа с визуалом прямо с телефона.' },
                { step: '03', title: 'Монетизация', desc: 'Как найти первого клиента и продать готовый магазин за высокий чек.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex gap-4 items-start shadow-xl">
                  <div className="text-2xl font-black text-[#00FF9D]/20">{item.step}</div>
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => openModal('Enroll Training')}
              className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_5px_20px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-auto text-xs"
            >
              ЗАПИСАТЬСЯ НА КУРС
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-zinc-700 text-[9px] uppercase tracking-[0.15em] font-bold">
        Данный mini app был создан <span className="text-zinc-500">TAIPAN MEDIA GROUP</span>
      </footer>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8 cursor-pointer" onClick={closeModal} />
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Оформить заявку</h2>
            <p className="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">Тема: <span className="text-[#00FF9D]">{modalType}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Ваше Имя" 
                required 
                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700"
              />
              <input 
                type="text" 
                placeholder="@username" 
                required 
                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700"
              />
              <button 
                type="submit" 
                className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl mt-4 text-xs shadow-[0_5px_15px_rgba(0,255,157,0.2)]"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in zoom-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          <span className="text-xs font-bold uppercase tracking-wider">Заявка отправлена</span>
        </div>
      )}

      {/* Styles for Animations */}
      <style>{`
        @keyframes contourPulse {
          0% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.8)); opacity: 1; }
          100% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default App;
