import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, GraduationCap, Smartphone, ArrowRight, ChevronRight, X } from 'lucide-react';

const App = () => {
  const canvasRef = useRef(null);
  const [modal, setModal] = useState({ isVisible: false, type: '' });
  const [showToast, setShowToast] = useState(false);

  // Matrix Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let columns = Math.floor(width / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;
    const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(2, 2, 2, 0.05)';
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

    const interval = setInterval(drawMatrix, 50);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 20);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openModal = (type) => setModal({ isVisible: true, type });
  const closeModal = () => setModal({ ...modal, isVisible: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#00FF9D]/30">
      
      {/* --- ТЕХНО-ФОН --- */}
      <div className="fixed inset-0 z-0 bg-[#020202]">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-20 z-10 pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF9D]/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* --- КОНТЕНТ --- */}
      <main className="flex-grow px-4 pb-8 z-20 flex flex-col justify-center max-w-lg mx-auto w-full pt-10">
        
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 mb-2 filter drop-shadow-[0_0_15px_rgba(0,255,157,0.3)]">
            TAIPAN MEDIA
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-semibold">Цифровые технологии</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Card 1 */}
          <div onClick={() => openModal('Telegram Shop')} 
               className="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
            <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-[#00FF9D]/10 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide mb-2">Telegram<br/>Магазин</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Автоматизация продаж</p>
            <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              ЗАКАЗАТЬ <ArrowRight size={12} className="ml-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div onClick={() => openModal('Education')} 
               className="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
            <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-[#00FF9D]/10 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide mb-2">Обучение<br/>DEV</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Мастерство разработки</p>
            <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              НАЧАТЬ <ArrowRight size={12} className="ml-1" />
            </div>
          </div>
        </div>

        {/* Card Long */}
        <div onClick={() => openModal('Mini App')}
             className="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00FF9D]/10 text-[#00FF9D]">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Mini App</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Разработка под ключ</p>
            </div>
          </div>
          <ChevronRight className="text-zinc-600 group-hover:text-[#00FF9D] group-hover:translate-x-1 transition-all" />
        </div>
      </main>

      <footer className="text-center py-8 text-zinc-700 text-[10px] tracking-[0.3em] font-bold z-20">
        TAIPAN MEDIA CORP &copy; 2024
      </footer>

      {/* --- MODAL (BOTTOM SHEET) --- */}
      {modal.isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Оформить заявку</h2>
            <p className="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">Услуга: <span className="text-[#00FF9D]">{modal.type}</span></p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Ваше Имя" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center focus:border-[#00FF9D]/50 outline-none transition-all" />
              <input type="text" placeholder="@username" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center focus:border-[#00FF9D]/50 outline-none transition-all" />
              <button className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_10px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TOAST --- */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-bounce">
          <div className="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Заявка отправлена</span>
        </div>
      )}
    </div>
  );
};

export default App;
