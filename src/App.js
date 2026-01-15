import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2
} from 'lucide-react';

/**
 * Taipan Media - Elite React Application
 * Обновление: Убран текстовый блок в обучении, изменен текст кнопки на "Стань тем кто успел".
 */

// Компоненты логотипов для визуального ряда
const BrandLogos = {
  Bitcoin: () => (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <svg viewBox="0 0 24 24" fill="#F7931A" className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(247,147,26,0.3)]">
        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.695 8.47-1.216 14.9-.388c6.426 1.602 10.34 8.09 8.738 15.292zM18.106 10.12c.264-1.765-1.08-2.71-2.914-3.344l.596-2.39-1.454-.362-.58 2.33c-.382-.096-.776-.186-1.166-.273l.586-2.355-1.454-.362-.596 2.39c-.316-.072-.625-.144-.925-.218l.002-.008-2.007-.502-.388 1.55s1.08.247 1.057.263c.59.147.696.537.678.847l-.68 2.73c.04.01.094.026.152.05-.054-.014-.112-.03-.17-.044l-1.103 4.426c-.072.178-.254.445-.664.343.014.02-1.057-.263-1.057-.263l-.723 1.67 1.894.474c.35.088.694.18 1.034.266l-.604 2.43 1.452.362.598-2.396c.396.108.783.21 1.16.307l-.592 2.38 1.454.363.604-2.43c2.482.47 4.35.28 5.136-1.965.634-1.808-.032-2.852-1.336-3.535 1.03-.238 1.81-.916 2.02-2.31zM14.47 14.524c-.45 1.81-3.5 0.83-4.484.588l.8-3.212c.983.244 4.14.726 3.684 2.624zm.45-4.44c-.41 1.644-2.96.81-3.774.606l.724-2.912c.814.204 3.468.583 3.05 2.306z"/>
      </svg>
      <p className="text-[#F7931A] font-black text-xl tracking-tighter">2009: BITCOIN</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">«Всего лишь забава»</p>
    </div>
  ),
  Instagram: () => (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(225,48,108,0.3)]">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
      <p className="text-[#E1306C] font-black text-xl tracking-tighter">2012: INSTAGRAM</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">«Не место для денег»</p>
    </div>
  ),
  Marketplaces: () => (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <div className="flex gap-4 mb-4 items-center">
        <span className="text-5xl font-black italic text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">WB</span>
        <span className="text-4xl font-bold text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">Kaspi</span>
      </div>
      <p className="text-white font-black text-xl tracking-tighter">2019: МАРКЕТПЛЕЙСЫ</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">«Непонятно и сложно»</p>
    </div>
  ),
  Telegram: () => (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <svg viewBox="0 0 24 24" fill="#0088cc" className="w-24 h-24 mb-4 drop-shadow-[0_0_25px_rgba(0,136,204,0.5)]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.4.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.75 3.88-1.69 6.47-2.8 7.76-3.32 3.69-1.5 4.45-1.76 4.95-1.77.11 0 .36.03.52.16.13.1.17.24.18.33.01.07.02.24.01.4z"/>
      </svg>
      <p className="text-white font-black text-2xl tracking-[0.1em]">2026: TELEGRAM STORE</p>
      <p className="text-[#00FF9D] text-[12px] uppercase tracking-[0.3em] mt-3 font-bold bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.1)]">
        То что нельзя упустить
      </p>
    </div>
  )
};

const App = () => {
  const [currentView, setCurrentView] = useState('main');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    <BrandLogos.Bitcoin />,
    <BrandLogos.Instagram />,
    <BrandLogos.Marketplaces />,
    <BrandLogos.Telegram />
  ];

  useEffect(() => {
    if (currentView === 'education') {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [currentView]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops = [];
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
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
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

  const TelegramLogoMain = ({ className }) => (
    <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.014.093.03.3.023.48z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      {/* Импорт премиального шрифта Syne */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Фон */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        <div className="absolute inset-0 opacity-20 -z-10" 
             style={{
               backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
               maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)',
               WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)'
             }} />
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,157,0.1)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-8">
        {currentView === 'main' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Заголовок: шрифт Syne, одна строка, адаптивный размер */}
            <div className="mb-14 text-center px-2">
              <h1 
                className="font-['Syne'] font-[800] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative inline-block w-full text-center"
                style={{ 
                    fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)',
                    textShadow: '0 0 20px rgba(0,255,157,0.3)',
                    color: '#ffffff'
                }}
              >
                TAIPAN MEDIA
                <span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">
                  TAIPAN MEDIA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-zinc-700"></div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-bold">Digital Agency</p>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div onClick={() => openModal('Telegram Shop')} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                  <TelegramLogoMain className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2 leading-tight">Telegram<br/>Магазин</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Бизнес продает 24/7</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">ЗАКАЗАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>

              <div onClick={() => setCurrentView('education')} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                  <GraduationCap className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2 leading-tight">ОБУЧЕНИЕ</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2 text-zinc-500">Твой шанс в Telegram</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">УЗНАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>
            </div>

            <div onClick={() => openModal('Mini App')} className="group relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Заказать для своего бизнеса</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => setCurrentView('main')} className="flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit">
              <ChevronLeft className="w-4 h-4 mr-1" /> Назад
            </button>

            <div className="flex-grow flex flex-col items-center justify-center space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Syne']">Упущенные<br/><span className="text-[#00FF9D]">Возможности</span></h2>
                <div className="h-1 w-24 bg-[#00FF9D] mx-auto opacity-50" />
              </div>

              {/* СЕКЦИЯ С ДЫМОМ И ЛОГОТИПАМИ */}
              <div className="relative w-full h-80 flex items-center justify-center overflow-hidden rounded-[40px] bg-white/5 border border-white/5 shadow-2xl">
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-[smokeDrift_10s_infinite]" />
                   <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[60px] animate-[smokeDrift_12s_infinite]" />
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00FF9D]/10 rounded-full blur-[60px] animate-[smokeDrift_8s_infinite_reverse]" />
                 </div>
                 
                 {slides.map((logo, idx) => (
                   <div key={idx} className={`absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out transform ${activeSlide === idx ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-3xl'}`}>
                     <div className="relative">
                        <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full transform scale-150" />
                        <div className="relative z-10">
                          {logo}
                        </div>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Текстовый блок убран по запросу пользователя */}
            </div>

            {/* Кнопка с обновленным текстом */}
            <button onClick={() => openModal('Join Education')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-10 text-xs">
               Стань тем кто успел
            </button>
          </div>
        )}
      </div>

      <footer className="relative z-10 text-center py-8 text-zinc-700 text-[9px] uppercase tracking-[0.15em] font-bold">Данный mini app был создан <span className="text-zinc-500">TAIPAN MEDIA GROUP</span></footer>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,0,0,1)]">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8 cursor-pointer" onClick={closeModal} />
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Начать сейчас</h2>
            <p className="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">Интерес: <span className="text-[#00FF9D]">{modalType}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Ваше Имя" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700" />
              <input type="text" placeholder="@username" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700" />
              <button type="submit" className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl mt-4 text-xs">Связаться со мной</button>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in zoom-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          <span className="text-xs font-bold uppercase tracking-wider">Запрос принят</span>
        </div>
      )}

      <style>{`
        .glass-card {
            background: rgba(10, 10, 10, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 255, 157, 0.08); 
            box-shadow: 0 0 4px rgba(0, 255, 157, 0.05), 0 4px 30px rgba(0, 0, 0, 0.5);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card:hover {
            border-color: rgba(0, 255, 157, 0.3);
            box-shadow: 0 0 8px rgba(0, 255, 157, 0.15);
        }
        @keyframes contourPulse {
          0% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.8)); opacity: 1; }
          100% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
        }
        @keyframes smokeDrift {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(15px, -15px) scale(1.1); opacity: 0.6; }
          66% { transform: translate(-10px, 10px) scale(0.9); opacity: 0.4; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default App;
