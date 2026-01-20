import React, { useState, useEffect, useRef } from 'react';

// --- СТИЛИ ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; }
    /* Скрытие скроллбара для Chrome, Safari и Opera */
    ::-webkit-scrollbar {
      display: none;
    }
    /* Скрытие скроллбара для IE, Edge и Firefox */
    body {
      -ms-overflow-style: none;  /* IE и Edge */
      scrollbar-width: none;  /* Firefox */
    }
    /* Убираем стрелочки у input type="number" */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    .glass-card {
        background: rgba(20, 20, 20, 0.4);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .glass-card:hover {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: none;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    @keyframes contourPulse {
      0% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
      50% { filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.6)); opacity: 1; }
      100% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
    }
    @keyframes smokeIn {
      0% { opacity: 0; filter: blur(20px); transform: translateY(10px) scale(0.9); }
      100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
    }
    @keyframes smokeOut {
      0% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
      100% { opacity: 0; filter: blur(20px); transform: translateY(-10px) scale(1.1); }
    }
    @keyframes smokeDrift {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      33% { transform: translate(15px, -15px) scale(1.1); opacity: 0.6; }
      66% { transform: translate(-10px, 10px) scale(0.9); opacity: 0.4; }
      100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    }
    @keyframes glitchText {
      0% { transform: translate(0); text-shadow: none; }
      20% { transform: translate(-2px, 2px); text-shadow: 2px 0 #00FF9D, -2px 0 #ff00de; }
      40% { transform: translate(2px, -2px); text-shadow: -2px 0 #00FF9D, 2px 0 #ff00de; }
      60% { transform: translate(0); text-shadow: none; }
      80% { transform: translate(1px, -1px); text-shadow: 1px 0 #00FF9D, -1px 0 #ff00de; }
      100% { transform: translate(0); text-shadow: none; }
    }
    @keyframes glitch {
      0% { transform: translate(0) skew(0deg); opacity: 1; filter: none; }
      10% { transform: translate(-2px, 1px) skew(-2deg); opacity: 0.8; filter: brightness(1.5); }
      20% { transform: translate(2px, -1px) skew(2deg); opacity: 1; }
      30% { transform: translate(-1px, 2px) skew(0deg); opacity: 0.8; filter: contrast(2); }
      40% { transform: translate(1px, -2px) skew(0deg); opacity: 1; }
      50% { transform: translate(-1px, 0) skew(-5deg); opacity: 0.3; filter: brightness(0.5); }
      60% { transform: translate(1px, 0) skew(5deg); opacity: 1; }
      70% { transform: translate(0, 1px) skew(0deg); opacity: 0.8; }
      80% { transform: translate(0, -1px) skew(0deg); opacity: 1; filter: contrast(1.5); }
      90% { transform: translate(-1px, 1px) skew(0deg); opacity: 0.9; }
      100% { transform: translate(0) skew(0deg); opacity: 1; filter: none; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-150%) skewX(12deg); }
      100% { transform: translateX(150%) skewX(12deg); }
    }
    @keyframes heightGrow {
      from { height: 0; }
    }
    @keyframes scan {
        0% { top: 0%; opacity: 0; }
        50% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
    @keyframes widthGrow {
      from { width: 0; }
    }
    @keyframes scrollLeft {
      0% { transform: translateX(0); } 
      100% { transform: translateX(-33.333%); }
    }
    .animate-scrollLeft {
      animation: scrollLeft 30s linear infinite;
    }
    .mask-gradient-horizontal {
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
     
    /* Анимации текста */
    @keyframes premiumSlideUp {
      0% { opacity: 0; transform: translateY(20px); filter: blur(5px); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes goldReveal {
       0% { opacity: 0; transform: scale(0.95); letter-spacing: 0em; }
       100% { opacity: 1; transform: scale(1); letter-spacing: 0.05em; }
    }
    /* Анимация Snake Flow */
    @keyframes snakeFlow {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes premiumOut {
      0% { opacity: 1; transform: scale(1); filter: blur(0); }
      100% { opacity: 0; transform: scale(1.05); filter: blur(10px); }
    }
     
    /* Кинематографичные анимации для интро */
    @keyframes cinematicIn {
        0% { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(10px); }
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes cinematicOut {
        0% { opacity: 1; transform: scale(1); filter: blur(0); }
        100% { opacity: 0; transform: scale(1.1); filter: blur(20px); }
    }
     
    /* Плавающая анимация для логотипов партнеров */
    @keyframes premiumFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
     
    /* Кибер-появление */
    @keyframes cyberReveal {
      0% { 
        opacity: 0; 
        transform: scale(1.5); 
        filter: blur(20px) hue-rotate(90deg);
      }
      20% {
        opacity: 1;
        transform: scale(1.2);
        filter: blur(0);
      }
      40% {
         transform: scale(1.35);
         filter: brightness(1.5);
      }
      100% { 
        opacity: 1; 
        transform: scale(1.25); 
        filter: none;
      }
    }
    @keyframes scanLine {
      0% { transform: translateY(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(100%); opacity: 0; }
    }
  `}} />
);

// --- ХУК ДЛЯ АНИМАЦИИ ЦИФР (ODOMETER) ---
const useOdometer = (targetValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const startValue = startValueRef.current;
    const endValue = targetValue;
    
    if (startValue === endValue) return;

    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease Out Quart - плавная остановка
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(startValue + (endValue - startValue) * ease);
      
      setDisplayValue(current);
      startValueRef.current = current;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = 0;
        setDisplayValue(endValue);
        startValueRef.current = endValue;
      }
    };
    
    cancelAnimationFrame(frameRef.current);
    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [targetValue, duration]);

  return displayValue;
};

// --- КОМПОНЕНТ ЖИВОГО СЧЕТЧИКА (SYSTEM MONITOR) ---
const LiveUserCounter = () => {
  const [users, setUsers] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => {
        // Change by a small random amount between -3 and +3
        const change = Math.floor(Math.random() * 7) - 3;
        // Ensure we don't go below a realistic number (e.g., 90)
        return Math.max(90, prev + change);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-[#00FF9D]/10 animate-in fade-in duration-1000 pointer-events-none">
      <div className="relative flex items-center justify-center">
         <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse relative z-10"></div>
         <div className="absolute w-full h-full rounded-full bg-[#00FF9D] animate-ping opacity-20"></div>
      </div>
      <p className="text-[8px] font-mono text-[#00FF9D]/80 tracking-widest leading-none">
        СЕЙЧАС ОНЛАЙН: <span className="text-white font-bold">{users}</span>
      </p>
    </div>
  );
};

// --- Компоненты Иконок ---

const GraduationCap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);
const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const ChevronLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
const CheckCircle2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);
const Lock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const HelpCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
);
const TrendingUp = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const Wallet = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>
);
const X = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const Zap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const Target = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const Bell = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const Search = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const TelegramLogoMain = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
);

// --- Новый компонент: SmartImage (Оптимизация изображений) ---
const SmartImage = ({ src, alt, className, style, wrapperClass = "", overflowHidden = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${overflowHidden ? 'overflow-hidden' : ''} ${wrapperClass} ${className?.includes('rounded') ? '' : 'rounded-none'}`}>
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 bg-zinc-900/50 animate-pulse z-0 ${className}`} style={style} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
           setHasError(true);
           if (e.target.src !== "https://via.placeholder.com/400x200?text=Error") {
             e.target.style.display = 'none'; // Скрыть битое изображение, если нет фоллбэка
           }
        }}
        className={`${className} transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
      />
    </div>
  );
};

// --- Компонент Поля Ввода (Вынесен наружу для исправления бага фокуса) ---
const InputField = ({ label, value, setValue, suffix = "" }) => (
  <div className="mb-2">
    <label className="block text-[9px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        value={value === 0 ? '' : value} 
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder="0"
        className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl p-2.5 text-white focus:border-[#00FF9D]/50 outline-none transition-all font-['Chakra_Petch'] text-sm appearance-none placeholder-zinc-700"
      />
      {suffix && <span className="absolute right-4 top-2.5 text-zinc-500 text-xs font-bold pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

// --- Компонент Калькулятора Прибыли (Обновленный: Триггер-версия с кнопкой) ---
const ProfitCalculator = ({ onAction, data, setData }) => {
  // Логика расчета:
  // Продажи = Трафик * (Конверсия / 100)
  // Выручка = Продажи * Средний чек
  // Чистая прибыль = Выручка * (Маржа / 100)
  
  const sales = Math.floor(data.traffic * (data.conversion / 100));
  const revenue = sales * data.avgCheck;
  const profit = Math.floor(revenue * (data.margin / 100));
  
  // Анимация цифр
  const animatedProfit = useOdometer(profit);
  const animatedSales = useOdometer(sales);

  // Сумма для возврата (20% от упущенной прибыли)
  const returnAmount = Math.floor(profit * 0.2);

  // Упущенная конверсия (100 - указанная)
  const missedConversion = 100 - data.conversion;

  return (
    <div className="w-full animate-in slide-in-from-bottom duration-500">
      <InputField label="Сколько людей в месяц?" value={data.traffic} setValue={(v) => setData({...data, traffic: v})} />
      <InputField label="Какая конверсия?" value={data.conversion} setValue={(v) => setData({...data, conversion: v})} suffix="%" />
      <InputField label="Средний чек" value={data.avgCheck} setValue={(v) => setData({...data, avgCheck: v})} suffix="₸" />
      <InputField label="Средний % чистой прибыли" value={data.margin} setValue={(v) => setData({...data, margin: v})} suffix="%" />

      <div className="relative overflow-hidden bg-[#00FF9D]/5 border border-[#00FF9D]/30 p-5 rounded-2xl text-center group mt-4 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
        {/* --- СЕТКА И СКАНЛАЙН ЭФФЕКТ (GREEN VERSION) --- */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/5 to-transparent animate-[scanLine_3s_linear_infinite]"></div>
        
        <div className="relative z-10">
            <div className="flex flex-col items-center justify-center mb-2">
               <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mb-1">ВАШ БИЗНЕС МОЖЕТ ПРИНОСИТЬ</p>
               <p className="text-3xl sm:text-4xl font-black text-[#00FF9D] font-['Chakra_Petch'] drop-shadow-[0_0_15px_rgba(0,255,157,0.4)] mb-1">
                 НА {animatedProfit.toLocaleString()} ₸
               </p>
               <p className="text-[12px] text-white font-bold uppercase tracking-[0.2em]">
                 БОЛЬШЕ ЕЖЕМЕСЯЧНО
               </p>
            </div>
            
            <div className="bg-[#00FF9D]/5 border-t border-b border-[#00FF9D]/10 py-3 mt-3 backdrop-blur-sm">
               <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-medium leading-relaxed">
                 ЭТО <span className="text-[#00FF9D] font-black">{animatedSales} ПОКУПАТЕЛЕЙ</span>, КОТОРЫЕ<br/>ГОТОВЫ ПЛАТИТЬ ВАМ УЖЕ СЕЙЧАС
               </p>
            </div>
            
            <p className="text-[8px] text-zinc-500 mt-3 italic">
               *Мы знаем как увеличить конверсию от 20% и выше
            </p>
        </div>
      </div>

      <button 
        onClick={onAction} 
        className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse mt-4"
      >
        ПОЛУЧИТЬ СТРАТЕГИЮ ОТ TAIPAN GROUP
      </button>
    </div>
  );
};

// --- Компонент Доказательства (Хакерский стиль) ---
const HackerProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <React.Fragment>
      <div 
        className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
        }}
      >
        <SmartImage 
          src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" 
          className="w-full object-cover" 
          alt="Encrypted Proof" 
        />
        {/* Подсказка увеличения */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10">
          <Search className="w-3 h-3 text-[#00FF9D]" />
        </div>

        {/* --- СЕТКА И СКАНЛАЙН ЭФФЕКТ --- */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none z-10"></div>
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
           <div>
              <p className="text-[#00FF9D] text-[10px] font-black font-mono bg-black/80 px-2 py-0.5 inline-block border-l-2 border-[#00FF9D]">VIRGINIA GOLD</p>
              <p className="text-white text-[9px] font-mono bg-black/80 px-2 py-0.5 mt-1 inline-block">ЧЕК: 100.000 Т</p>
           </div>
           <CheckCircle2 className="w-6 h-6 text-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
        </div>
      </div>

      {/* Развернутый вид */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-2xl">
             <SmartImage 
               src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" 
               className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]"
               alt="Proof Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

// --- Компонент Доказательства Спроса ---
const ClientDemandProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <React.Fragment>
      <div 
        className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
        }}
      >
        <SmartImage 
          src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" 
          className="w-full object-cover opacity-90 filter grayscale-[0.5] contrast-[1.1] brightness-[0.9]" 
          alt="Client Demand" 
        />
        {/* Подсказка увеличения */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10">
          <Search className="w-3 h-3 text-[#00FF9D]" />
        </div>

        {/* --- СЕТКА И СКАНЛАЙН ЭФФЕКТ --- */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-3 left-3 bg-black/80 border border-[#00FF9D]/30 px-2 py-1 rounded z-20">
          <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div>
              <span className="text-[9px] font-mono text-[#00FF9D]">DEMAND_HIGH</span>
          </div>
        </div>
      </div>

       {/* Развернутый вид */}
       {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-2xl">
             <SmartImage 
               src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" 
               className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]"
               alt="Demand Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

// --- Сканер Навыков ---
const SkillScanner = () => (
  <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500 group">
      {/* --- СЕТКА И СКАНЛАЙН ЭФФЕКТ --- */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/05 to-transparent animate-[scanLine_4s_linear_infinite]"></div>

    <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse"></div>
             <span className="text-[10px] font-mono text-[#00FF9D] tracking-widest">СИСТЕМНЫЙ_АНАЛИЗ</span>
           </div>
           <span className="text-[9px] text-zinc-600 font-mono">v.2.0.4</span>
        </div>

        <div className="space-y-4">
          {/* Метрика 1 */}
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-zinc-400">НАВЫКИ (КОДИНГ)</span>
              <span className="text-zinc-600">НЕ ТРЕБУЕТСЯ</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full">
               <div className="w-[0%] h-full bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Метрика 2 */}
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-zinc-400">ВРЕМЯ НАСТРОЙКИ</span>
              <span className="text-[#00FF9D]">~45 МИН</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full">
               <div className="w-[15%] h-full bg-[#00FF9D] rounded-full shadow-[0_0_8px_#00FF9D] animate-[widthGrow_1s_ease-out]"></div>
            </div>
          </div>

          {/* Метрика 3 */}
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-zinc-400">АВТОМАТИЗАЦИЯ</span>
              <span className="text-[#00FF9D]">90%</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full">
               <div className="w-[90%] h-full bg-[#00FF9D] rounded-full shadow-[0_0_8px_#00FF9D] animate-[widthGrow_1.5s_ease-out]"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-2 bg-[#00FF9D]/5 rounded border border-[#00FF9D]/10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#00FF9D]/5 animate-pulse"></div>
           <p className="text-[9px] text-[#00FF9D] font-black tracking-widest uppercase relative z-10">ВЕРДИКТ: ИДЕАЛЬНО ДЛЯ НОВИЧКОВ</p>
        </div>
    </div>
  </div>
);

// --- Таймлайн Настройки ---
const SetupTimeline = () => {
  const steps = [
    { title: "ШАГ 1: ТОКЕН", time: "~ 2 МИН", desc: "Создайте бота. Вставьте токен. Магазин запущен." },
    { title: "ШАГ 2: ТОВАРЫ", time: "~ 4 МИН", desc: "Добавьте товары вручную или загрузите через Excel/XML." },
    { title: "ШАГ 3: ОПЛАТА", time: "~ 2.5 МИН", desc: "Подключите карты, крипту или СБП. Работает из коробки." },
    { title: "ШАГ 4: ДОСТАВКА", time: "~ 1.5 МИН", desc: "Настройте зоны доставки или самовывоз." }
  ];

  return (
    <div className="w-full pl-2 mb-4 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-6">
         <span className="text-[10px] text-[#00FF9D] font-mono tracking-widest border border-[#00FF9D]/30 px-2 py-1 rounded">ПРОТОКОЛ ЗАПУСКА</span>
         <span className="text-[10px] text-zinc-500 font-mono">TOTAL: ~10 МИН</span>
      </div>

      <div className="relative border-l border-[#00FF9D]/20 ml-2 space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-6 group">
             {/* Светящаяся точка */}
             <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-[#050505] border border-[#00FF9D] rounded-full group-hover:bg-[#00FF9D] group-hover:shadow-[0_0_10px_#00FF9D] transition-all"></div>
             
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-sm font-bold text-white font-['Chakra_Petch'] leading-none mb-1 group-hover:text-[#00FF9D] transition-colors">{step.title}</h4>
                 <p className="text-[11px] text-zinc-400 leading-snug max-w-[220px]">{step.desc}</p>
               </div>
               <span className="text-[9px] font-mono text-[#00FF9D]/70 bg-[#00FF9D]/5 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">{step.time}</span>
             </div>
          </div>
        ))}
        
        {/* Финальный Блок */}
        <div className="relative pl-6 mt-8">
           <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 bg-[#00FF9D] rounded-full animate-pulse shadow-[0_0_15px_#00FF9D]"></div>
           <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 p-3 rounded-lg">
             <h4 className="text-sm font-black text-[#00FF9D] uppercase tracking-wider mb-1">МАГАЗИН ГОТОВ</h4>
             <p className="text-[10px] text-zinc-300 leading-snug">Можно запускать трафик и получать прибыль. Система работает автономно.</p>
           </div>
        </div>
      </div>
    </div>
  );
};


// --- График Яндекс Вордстат ---
const WordstatGraph = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <React.Fragment>
      <div 
        className="w-full bg-[#1c1c1e] rounded-xl border border-zinc-700 overflow-hidden mb-6 font-sans shadow-xl cursor-zoom-in relative group"
        onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
        }}
      >
        <div className="bg-[#242426] px-4 py-3 border-b border-zinc-700 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[11px] text-zinc-300 font-bold">История запросов (Яндекс Вордстат)</span>
            </div>
            <p className="text-[13px] text-white mt-0.5 font-medium">«телеграм магазин»</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Всего показов</p>
            <p className="text-[16px] font-bold text-white">6 650</p>
          </div>
        </div>

        {/* Контейнер Скриншота */}
        <div className="relative w-full h-auto">
          <SmartImage 
            src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" 
            alt="Real Wordstat Data"
            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
          {/* --- СЕТКА И СКАНЛАЙН ЭФФЕКТ --- */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>
          
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none z-10"></div>
           {/* Подсказка увеличения */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-white/20 z-20">
             <Search className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

       {/* Развернутый вид */}
       {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-4xl">
             <SmartImage 
               src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" 
               className="w-full h-auto rounded-lg border border-zinc-700 shadow-2xl"
               alt="Wordstat Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

// --- Компоненты Логотипов Брендов ---
const BrandLogos = {
  Bitcoin: ({ isActive }) => {
    const [isMissed, setIsMissed] = useState(false);
    useEffect(() => {
      if (isActive) {
        setIsMissed(false);
        const timer = setTimeout(() => {
          setIsMissed(true);
          if (navigator.vibrate) navigator.vibrate(50);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <svg viewBox="0 0 24 24" fill="#F7931A" className={`w-16 h-16 mb-4 transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80 drop-shadow-[0_0_15px_rgba(247,147,26,0.5)]'}`}><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.695 8.47-1.216 14.9-.388c6.426 1.602 10.34 8.09 8.738 15.292zM18.106 10.12c.264-1.765-1.08-2.71-2.914-3.344l.596-2.39-1.454-.362-.58 2.33c-.382-.096-.776-.186-1.166-.273l.586-2.355-1.454-.362-.596 2.39c-.316-.072-.625-.144-.925-.218l.002-.008-2.007-.502-.388 1.55s1.08.247 1.057.263c.59.147.696.537.678.847l-.68 2.73c.04.01.094.026.152.05-.054-.014-.112-.03-.17-.044l-1.103 4.426c-.072.178-.254.445-.664.343.014.02-1.057-.263-1.057-.263l-.723 1.67 1.894.474c.35.088.694.18 1.034.266l-.604 2.43 1.452.362.598-2.396c.396.108.783.21 1.16.307l-.592 2.38 1.454.363.604-2.43c2.482.47 4.35.28 5.136-1.965.634-1.808-.032-2.852-1.336-3.535 1.03-.238 1.81-.916 2.02-2.31zM14.47 14.524c-.45 1.81-3.5 0.83-4.484.588l.8-3.212c.983.244 4.14.726 3.684 2.624zm.45-4.44c-.41 1.644-2.96.81-3.774.606l.724-2.912c.814.204 3.468.583 3.05 2.306z"/></svg>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-[#F7931A]'}`}>2009: BITCOIN</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 backdrop-blur-sm transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
        </div>
        <div className="mt-2 text-center px-6">
          <p className="text-zinc-500 text-[11px] leading-tight font-medium">«Пока ты думал, что это фантики...»</p>
          <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 transition-colors duration-700 ${isMissed ? 'text-zinc-700' : 'text-white'}`}>Другие стали миллионерами</p>
        </div>
      </div>
    );
  },
  Instagram: ({ isActive }) => {
    const [isMissed, setIsMissed] = useState(false);
    useEffect(() => {
      if (isActive) {
        setIsMissed(false);
        const timer = setTimeout(() => {
          setIsMissed(true);
          if (navigator.vibrate) navigator.vibrate(50);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-16 h-16 mb-4 transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80 drop-shadow-[0_0_15px_rgba(225,48,108,0.5)]'}`}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-[#E1306C]'}`}>2012: INSTAGRAM</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 backdrop-blur-sm transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
        </div>
        <div className="mt-2 text-center px-6">
          <p className="text-zinc-500 text-[11px] leading-tight font-medium">«Пока ты просто выкладывал еду...»</p>
          <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 transition-colors duration-700 ${isMissed ? 'text-zinc-700' : 'text-white'}`}>Другие построили империи</p>
        </div>
      </div>
    );
  },
  Marketplaces: ({ isActive }) => {
    const [isMissed, setIsMissed] = useState(false);
    useEffect(() => {
      if (isActive) {
        setIsMissed(false);
        const timer = setTimeout(() => {
          setIsMissed(true);
          if (navigator.vibrate) navigator.vibrate(50);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <div className={`flex gap-3 mb-4 items-center transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80'}`}><span className="text-4xl font-black italic text-purple-500">WB</span><span className="text-3xl font-bold text-red-600">Kaspi</span></div>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-white'}`}>2019: МАРКЕТПЛЕЙСЫ</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 backdrop-blur-sm transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
        </div>
        <div className="mt-2 text-center px-6">
          <p className="text-zinc-500 text-[11px] leading-tight font-medium">«Пока ты боялся логистики...»</p>
          <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 transition-colors duration-700 ${isMissed ? 'text-zinc-700' : 'text-white'}`}>Другие захватили рынок</p>
        </div>
      </div>
    );
  },
  Telegram: ({ isActive }) => (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <svg viewBox="0 0 24 24" fill="#0088cc" className="w-20 h-20 mb-4 drop-shadow-[0_0_25px_rgba(0,136,204,0.5)]"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/></svg>
      <p className="text-white font-black text-2xl tracking-[0.1em] font-['Chakra_Petch']">2026: TELEGRAM STORE</p>
      {/* Centering fix here */}
      <p className="text-[#00FF9D] text-[12px] uppercase tracking-[0.3em] mt-3 font-bold bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.2)] text-center">
        Обучись новому тренду с нами
      </p>
    </div>
  )
};

// --- Новый компонент: 3D Карусель (Оптимизированная) ---
const Carousel3D = () => {
  const images = [
    "https://i.ibb.co.com/Fp52kXy/666.png",
    "https://i.ibb.co.com/9H5ZxPfy/555.png",
    "https://i.ibb.co.com/bjV5YtR2/444.png",
    "https://i.ibb.co.com/Q3k778bd/333.png",
    "https://i.ibb.co.com/M5tCqhDs/222.png",
    "https://i.ibb.co.com/BV1gXyf7/111.png"
  ];
   
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 секунды
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
       {images.map((img, i) => {
         // Логика стека уведомлений
         const total = images.length;
         const dist = (index - i + total) % total;
         
         // Стиль по умолчанию для скрытых элементов
         let styleClass = "opacity-0 scale-50 z-0 translate-y-[100px]"; 
         
         if (dist === 0) {
            // ПЕРЕДНИЙ (Активный)
            styleClass = "opacity-100 scale-100 z-30 translate-y-[0px]";
         } else if (dist === 1) {
            // ПРЕДЫДУЩИЙ 1
            styleClass = "opacity-60 scale-90 z-20 -translate-y-[40px]";
         } else if (dist === 2) {
            // ПРЕДЫДУЩИЙ 2
            styleClass = "opacity-30 scale-80 z-10 -translate-y-[70px]";
         } else if (dist === total - 1) {
            // СЛЕДУЮЩИЙ (Предстоящий) - Готов к появлению снизу
            styleClass = "opacity-0 scale-100 z-40 translate-y-[100%] pointer-events-none"; 
         }
         
         return (
           <div 
             key={i}
             className={`absolute transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) w-[320px] h-[180px] flex items-center justify-center ${styleClass}`}
           >
              <img 
                src={img} 
                alt="Notification" 
                className="max-w-full max-h-full object-contain rounded-[32px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              />
           </div>
         )
       })}
    </div>
  );
};

// --- Новый компонент: Вступительная последовательность магазина ---
const ShopIntroSequence = ({ onComplete }) => {
  const message = { 
    part1: "МЕНЬШЕ ДИАЛОГОВ — БОЛЬШЕ ДЕНЕГ.", 
    part2: "СПАСАЕМ ОТ 20% УПУЩЕННОЙ ПРИБЫЛИ" 
  };

  useEffect(() => {
    // Автоматическое завершение через 3 секунды
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] px-4 cursor-pointer" onClick={onComplete}>
       {/* Фоновый прожектор для фокуса */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[200px] bg-white/5 blur-[80px] rounded-full -z-10 pointer-events-none animate-[pulse_4s_infinite]"></div>

       <div className="w-full text-center max-w-3xl animate-in fade-in duration-1000">
         {/* Часть 1 - Платиновый/Серебряный текст */}
         <h2 className="text-lg sm:text-2xl font-light uppercase tracking-[0.2em] font-['Outfit'] text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           {message.part1}
         </h2>

         {/* Часть 2 - Роскошный змеиный текст */}
         <div className="relative inline-block mt-6">
             <h2 className="text-3xl sm:text-5xl font-black uppercase font-['Chakra_Petch'] text-transparent bg-clip-text bg-gradient-to-r from-[#444] via-[#00FF9D] to-[#444] bg-[length:200%_auto] animate-[snakeFlow_3s_linear_infinite] drop-shadow-[0_0_30px_rgba(0,255,157,0.3)] tracking-widest">
               {message.part2}
             </h2>
         </div>
       </div>
       
       <div className="absolute bottom-20 text-[10px] text-zinc-600 uppercase tracking-[0.3em] animate-pulse">
         Пропуск через 3 сек
       </div>
    </div>
  );
};

// --- Компонент Логотипов Партнеров (Обновлено: Цикл одного логотипа) ---
const PartnersCredits = () => {
  const logos = [
    "https://i.ibb.co.com/PvND9HRh/Picsart-Background-Remover.png",
    "https://i.ibb.co.com/YHbCZm2/Yandex-Metrika-hd-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/DfQywRwj/Picsart-Background-Remover.png",
    "https://i.ibb.co.com/QZpjR8B/salon-cvetov-janym-photo-place-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/3mKHz61B/Picsart-Background-Remover.png",
    "https://i.ibb.co.com/4g74sZT7/maxresdefault-Picsart-Background-Remover.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 2500); // Смена каждые 2.5 секунды
    return () => clearInterval(timer);
  }, []);

  const currentLogo = logos[currentIndex];
  // Логика для конкретных логотипов
  const isYandex = currentLogo.includes("Yandex");
  const isRomantic = currentLogo.includes("janym");
  const isFood = currentLogo.includes("DfQywRwj"); // Определение по хешу
  const isPicsartLogo = currentLogo.includes("PvND9HRh"); // Выбранный пользователем
  const isLargeLogo = currentLogo.includes("4g74sZT7"); // Новый логотип, который нужно увеличить

  let specificStyle = { 
    filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.15)) brightness(1.1) contrast(1.1) saturate(1.2)' 
  };

  if (isYandex) {
      specificStyle = { filter: 'invert(1) hue-rotate(180deg) saturate(3) brightness(1.2)' };
  } else if (isRomantic) {
      specificStyle = { filter: 'brightness(1.5) contrast(1.2)' };
  } else if (isFood) {
      specificStyle = { filter: 'brightness(1.1) contrast(1.1)' };
  } else if (isPicsartLogo) {
      specificStyle = { filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))' };
  } else if (isLargeLogo) {
      // Убираем лишние эффекты, если нужно, или оставляем дефолтные, но увеличиваем размер ниже
      specificStyle = { filter: 'brightness(1.2)' };
  }
   
  // Увеличиваем масштаб специально для этого логотипа (scale-[2.5] вместо scale-125)
  const scaleClass = isLargeLogo ? 'scale-[2.5]' : 'scale-125';
  const translateClass = isFood ? 'translate-y-6' : '';
  
  const logoClasses = `h-24 w-auto object-contain max-w-[90%] transform ${scaleClass} ${translateClass}`;

  return (
    <div className="w-full mt-12 mb-8 relative px-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4 mb-6 opacity-100">
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#00FF9D]"></div>
        <p className="text-center text-[10px] text-[#00FF9D] uppercase tracking-[0.4em] mr-[-0.4em] font-bold shadow-green-glow animate-pulse">Наши партнёры</p>
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#00FF9D]"></div>
      </div>
       
      {/* Контейнер для одного логотипа */}
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-white/5 rounded-xl border border-[#00FF9D]/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         {/* Эффект сетки фона */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         
         {/* Анимация смены ключа для перезапуска анимации */}
         <div key={currentIndex} className="relative z-10 animate-[cyberReveal_0.5s_cubic-bezier(0.215,0.61,0.355,1)_both] w-full flex justify-center">
            <SmartImage 
               src={currentLogo} 
               alt="Partner Logo" 
               style={specificStyle}
               className={logoClasses}
               wrapperClass="relative z-10 flex justify-center w-full"
             />
         </div>
         
         {/* Декоративный сканлайн */}
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite]"></div>
      </div>

      {/* Индикаторы пагинации */}
      <div className="flex gap-1.5 mt-4">
        {logos.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#00FF9D] shadow-[0_0_10px_#00FF9D]' : 'w-1.5 bg-zinc-800'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- КОМПОНЕНТ РАСЧЕТА ROI (Новый) ---
const RoiView = ({ profit, onBack, onAction }) => {
  const investment = 100000;
  // User logic: We bring *from* 20% of the lost conversion/profit.
  const conservativeProfit = Math.floor(profit * 0.2); 
  
  // Calculate percentage of investment returned in the first month (always positive or 0)
  const returnPercentage = Math.round((conservativeProfit / investment) * 100);
  
  // Рассчитываем срок окупаемости в днях (если прибыль > 0)
  // Прибыль указана в месяц, значит в день = profit / 30
  // Дней до окупаемости = investment / (profit / 30)
  const daysToRecoup = conservativeProfit > 0 ? Math.ceil(investment / (conservativeProfit / 30)) : Infinity;
  const isProfitable = returnPercentage > 0;

  const handleConsultation = () => {
    window.open('https://t.me/taipanmedia', '_blank');
  };

  // Анимация для ROI
  const animatedProfit = useOdometer(conservativeProfit);
  const animatedPercentage = useOdometer(returnPercentage);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
        <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
        
        <div className="flex-grow flex flex-col items-center w-full space-y-6">
            <div className="text-center px-4 w-full">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">
                РАСЧЁТ <span className="text-[#00FF9D]">ОКУПАЕМОСТИ</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Эффективность инвестиций</p>
            </div>

            {/* Карточка стоимости */}
            <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-zinc-800">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Стоимость разработки</span>
                <span className="text-sm font-black text-white font-['Chakra_Petch']">100 000 ₸</span>
            </div>

             {/* Карточка дохода (из калькулятора) */}
             <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-[#00FF9D]/20 bg-[#00FF9D]/5">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Потенциальный возврат</span>
                <span className="text-sm font-black text-[#00FF9D] font-['Chakra_Petch']">{animatedProfit.toLocaleString()} ₸/мес</span>
            </div>

            {/* Главный блок Возврата Вложений */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-3xl text-center group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-3 relative z-10 leading-relaxed">
                    При указанных вами показателях,<br/>в первый месяц вы вернёте
                </p>
                <div className={`text-5xl font-black font-['Chakra_Petch'] mb-3 relative z-10 ${isProfitable ? 'text-[#00FF9D]' : 'text-zinc-500'}`}>
                    {animatedPercentage}% <span className="text-sm font-bold text-zinc-500 uppercase tracking-wide">вложений</span>
                </div>
                
                {isProfitable ? (
                   <div className="inline-block bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-3 py-1 rounded-full relative z-10">
                      <p className="text-[10px] text-[#00FF9D] font-bold uppercase tracking-wider">
                        Полная окупаемость: ~{daysToRecoup} {daysToRecoup === 1 ? 'день' : (daysToRecoup > 1 && daysToRecoup < 5) ? 'дня' : 'дней'}
                      </p>
                   </div>
                ) : (
                   <p className="text-[10px] text-zinc-600 relative z-10">Заполните калькулятор для расчета</p>
                )}
            </div>

            <div className="w-full pt-4">
                <button 
                    onClick={handleConsultation} 
                    className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse"
                >
                    ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ
                </button>
            </div>
        </div>
    </div>
  );
};

const App = () => {
  // Force system refresh
  useEffect(() => {
    console.log("Taipan Media App Initialized");
  }, []);

  const [currentView, setCurrentView] = useState('main'); // 'main', 'education', 'faq', 'program', 'shop', 'calculator', 'strategy', 'roi'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Состояние калькулятора (поднято вверх)
  const [calcData, setCalcData] = useState({
    traffic: 0,
    conversion: 0,
    avgCheck: 0,
    margin: 0
  });

  // Вспомогательный расчет прибыли для передачи в RoiView
  const calculateProfit = () => {
      const sales = Math.floor(calcData.traffic * (calcData.conversion / 100));
      const revenue = sales * calcData.avgCheck;
      return Math.floor(revenue * (calcData.margin / 100));
  };

  // Анимированные хуки для одометра в калькуляторе.
  // Они должны быть вызваны внутри компонента, поэтому передаем данные, а хуки используем внутри ProfitCalculator
   
  // Состояние для интро магазина
  const [shopIntroFinished, setShopIntroFinished] = useState(false);
   
  // Состояние для модального окна FAQ
  const [activeFaq, setActiveFaq] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
    
  const slides = [BrandLogos.Bitcoin, BrandLogos.Instagram, BrandLogos.Marketplaces, BrandLogos.Telegram];

  useEffect(() => {
    if (currentView === 'education') {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 4500);
      return () => clearInterval(timer);
    }
  }, [currentView]);
   
  // Сброс интро при открытии магазина
  useEffect(() => {
    if (currentView === 'shop') {
       // Обрабатывается в обработчике клика
    }
  }, [currentView]);

  const canvasRef = useRef(null);

  // ОПТИМИЗИРОВАННЫЙ ЭФФЕКТ МАТРИЦЫ ДЛЯ МОБИЛЬНЫХ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let columns, drops = [];
    const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     
    const initMatrix = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // УМЕНЬШЕННАЯ ПЛОТНОСТЬ ДЛЯ МОБИЛЬНЫХ (width / 25 вместо 20)
      columns = Math.floor(width / 25);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };
     
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Увеличенное затухание следа для меньшего визуального перересовывания
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00FF9D';
      ctx.font = '14px monospace'; // Шрифт поменьше
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 25, drops[i] * 25);
        if (drops[i] * 25 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
     
    initMatrix();
    // УМЕНЬШЕННАЯ ЧАСТОТА КАДРОВ (75мс вместо 50мс) для экономии CPU на мобильных
    const interval = setInterval(drawMatrix, 75);
     
    // ЗАЩИТА: Переинициализация матрицы только при изменении ширины (предотвращает сброс при скролле адресной строки на мобильных)
    const handleResize = () => {
        if (window.innerWidth !== width) {
            initMatrix();
        }
    };

    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e) => { e.preventDefault(); closeModal(); setShowToast(true); setTimeout(() => setShowToast(false), 3000); e.target.reset(); };

  // Данные элементов FAQ
  const faqItems = [
    {
      id: 'stats',
      question: "Это вообще покупают?",
      icon: <TrendingUp className="w-5 h-5 text-[#00FF9D]" />,
      component: (
        <div className="w-full">
          <WordstatGraph />
          <h3 className="text-white font-bold mb-3 uppercase tracking-wide text-sm font-['Chakra_Petch'] leading-tight">
            6 650 человек ищут тебя. Как долго ты будешь их игнорировать?
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4">
            Это официальная статистика Яндекса: <span className="text-[#00FF9D] font-bold">6 650</span> прямых запросов на ТГ-магазины в месяц. 
            <br/><br/>
            Пока ты ищешь «подходящий момент», наши ученики уже забирают эти чеки по <span className="text-white font-bold">100 000₸</span>, просто потому что они оказались на связи.
            <br/><br/>
            Мы даем тебе все инструменты и доступ к этому потоку. Твой результат — это просто вопрос того, возьмешь ли ты готовую систему и начнешь ли по ней работать. 
            <br/><br/>
            <span className="text-[#00FF9D] italic font-medium">Рынок платит тем, кто действует, а не тем, кто наблюдает.</span>
          </p>
        </div>
      )
    },
    {
      id: 'proof',
      question: "А это реально работает?",
      icon: <Lock className="w-5 h-5 text-[#00FF9D]" />,
      component: (
        <div className="w-full">
          <HackerProof />
          <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-2">
            Пока ты сомневаешься, <span className="text-[#00FF9D] font-bold">Карашаш</span> прошла наше обучение и уже забирает свои <span className="text-white font-bold">100 000₸</span>.
            <br/><br/>
            На скриншоте — результат её работы. Она просто взяла знания, которые мы даём, и закрыла одного из <span className="text-[#00FF9D] font-bold">6 650</span> горячих клиентов в Яндексе. Ей не нужен был «подходящий момент», ей нужна была рабочая система.
            <br/><br/>
            <span className="text-white italic">Рынок пустой. Деньги на столе. Ты следующий или так и будешь смотреть на чужие чеки?</span>
          </p>
        </div>
      )
    },
    {
      id: 'difficulty',
      question: "А сложно это делать?",
      icon: <Zap className="w-5 h-5 text-[#00FF9D]" />,
      component: (
        <div className="w-full">
           <SkillScanner /> 
           <SetupTimeline /> 
          <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4">
            <span className="text-white font-bold">Программистом быть не нужно.</span>
            <br/><br/>
            Собрать такой магазин проще, чем выложить пост в Инстаграм. Мы даем всё готовое: ты просто расставляешь блоки по местам за один вечер.
            <br/><br/>
            <span className="text-[#00FF9D] font-bold">Работай с телефона:</span> Не нужен компьютер, всё настраивается прямо в смартфоне.
            <br/><br/>
            <span className="text-[#00FF9D] font-bold">Для декрета или совмещения:</span> Занимайся этим, пока ребенок спит или после основной работы.
            <br/><br/>
            <span className="text-[#00FF9D] font-bold">Просто и понятно:</span> Если умеешь переписываться в Telegram — ты справишься.
            <br/><br/>
            <span className="text-white font-bold italic">Хватит смотреть на чужие чеки. Заходи и делай свои.</span>
          </p>
        </div>
      )
    },
    {
      id: 'calc',
      question: "Найду ли я клиентов?",
      icon: <Wallet className="w-5 h-5 text-[#00FF9D]" />,
      isCalc: true,
      component: (
        <div className="w-full">
          {/* Интеграция нового скриншота */}
          <ClientDemandProof />
          
          {/* Обновленный текст */}
          <div className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4">
            <p><span className="text-white font-bold">Ты не просто их найдешь — они тоже будут тебя искать.</span></p>
            <br/>
            <p>Статистика Яндекса не врет: каждый месяц <span className="text-[#00FF9D] font-bold">6 650</span> предпринимателей ищут, кто сделает им магазин в Telegram. Спрос огромный, а тех, кто умеет делать это качественно — единицы.</p>
            <br/>
            <p>На обучении мы даем не только технические навыки, но и <span className="text-white font-bold">полную систему продаж</span>:</p>
            <br/>
            <ul className="list-disc pl-4 space-y-2">
                <li><span className="text-[#00FF9D] font-bold">Где брать клиентов:</span> Покажем, как выйти на те самые тысячи заказов.</li>
                <li><span className="text-[#00FF9D] font-bold">Как продавать:</span> Научим вести переговоры с бизнесменами и закрывать сделки на высокие чеки.</li>
                <li><span className="text-[#00FF9D] font-bold">Готовые шаблоны предложений:</span> Тебе не нужно ничего придумывать — просто бери наше проверенное КП и отправляй клиенту.</li>
            </ul>
            <br/>
            <p>Мы научим тебя делать результат «под ключ», чтобы ты мог уверенно забирать свои <span className="text-white font-bold">100 000₸</span> за проект.</p>
          </div>
        </div>
      )
    }
  ];

  const handleFaqClick = (item) => {
    setActiveFaq(item);
    setShowCalculator(false);
  };

  const closeFaq = () => {
    setActiveFaq(null);
    setShowCalculator(false);
  };
   
  const handleShopClick = () => {
    setShopIntroFinished(false);
    setCurrentView('shop');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      <GlobalStyles />
      {/* Фон - Эффект Авроры добавлен здесь */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        {/* Аврора капли */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF9D]/5 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-20 -z-10" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)' }} />
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
      </div>
      
      {/* --- LIVE COUNTER ADDED HERE --- */}
      <LiveUserCounter />

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-20"> {/* pb-20 для тикера */}
        
        {currentView === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
            <div className="mb-14 w-full text-center">
              <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)', color: '#ffffff' }}>
                <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
              </h1>
              
              {/* ЗАМЕНЕНО: ДИНАМИЧЕСКИЙ ДЫМ НА СТАТИЧНЫЙ ПОДЗАГОЛОВОК "DIGITAL MEDIA" */}
              <div className="flex items-center justify-center gap-4 mt-3 w-full">
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-700"></div>
                <p className="text-[10px] uppercase tracking-[0.6em] mr-[-0.6em] text-zinc-500 font-bold whitespace-nowrap">DIGITAL MEDIA</p>
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
              <div onClick={handleShopClick} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><TelegramLogoMain className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" /></div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2 leading-tight">Telegram<br/>Магазин</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2">
                  Выведите свой бизнес на новый уровень, и заберите ту прибыль, которую вы упускаете
                </p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">ЗАКАЗАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>
              <div onClick={() => setCurrentView('education')} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><GraduationCap className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" /></div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2 leading-tight">ОБУЧЕНИЕ</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2 text-zinc-500">
                  Освой трендовый навык с большим спросом, и получи возможность зарабатывать из дома
                </p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">УЗНАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>
            </div>
            <div onClick={() => openModal('Mini App')} className="group relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center w-full">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Заказать персональный mini app</p>
            </div>
            
            {/* СКРОЛЛ ЛОГОТИПОВ ПАРТНЕРОВ */}
            <PartnersCredits />
          </div>
        )}

        {/* ПЕРЕРАБОТАННАЯ СЕКЦИЯ FAQ: Минимальный Список + Полноэкранное Модальное Окно */}
        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => setCurrentView('education')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              
              {/* --- ИЗМЕНЕНО: ЗАГОЛОВОК ЗАМЕНЕН НА 3D КАРУСЕЛЬ --- */}
              <div className="w-full mb-6">
                <Carousel3D />
                <div className="text-center mt-2">
                   {/* УБРАН ТЕКСТ "РЕЗУЛЬТАТЫ" */}
                </div>
              </div>
              
              {/* Сохраненный список FAQ */}
              <div className="w-full space-y-4">
                {faqItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleFaqClick(item)}
                    className="glass-card rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 hover:border-[#00FF9D]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-[#00FF9D]/10 p-2 rounded-full border border-[#00FF9D]/20">
                        {item.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors">{item.question}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF9D] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setCurrentView('program')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 text-xs">Смотреть программу</button>
          </div>
        )}

        {currentView === 'program' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => setCurrentView('faq')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              
              {/* --- ЦЕНТРИРОВАННЫЙ ЗАГОЛОВОК --- */}
              <div className="flex flex-col items-center text-center px-4 w-full mb-6 mx-auto max-w-sm">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase mb-2 font-['Chakra_Petch'] leading-tight">
                  Модули обучения<br/><span className="text-[#00FF9D]">TAIPAN ACADEMY</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Система доминирования</p>
              </div>

              <div className="w-full space-y-3">
                {[
                  { 
                    title: "Модуль 1: Быстрый старт", 
                    subtitle: "Запуск системы",
                    desc: "Регистрируем бота и получаем API ключ. Пара кликов — и движок твоего будущего магазина официально запущен.",
                    easy: "Никакого кода, только стандартные настройки Telegram за 2 минуты.",
                    locked: false 
                  },
                  { 
                    title: "Модуль 2: Красивая витрина", 
                    subtitle: "Наполнение",
                    desc: "Загружаем товары, создаем категории и описание. Твой бот превращается в профессиональный онлайн-маркет.",
                    easy: "Работает как обычный альбом в соцсетях: добавил фото, поставил цену — готово.",
                    locked: false 
                  },
                  { 
                    title: "Модуль 3: Автопилот", 
                    subtitle: "Платежи и доставка",
                    desc: "Подключаем оплату (Kaspi/карты) и настраиваем доставку. Теперь магазин сам принимает заказы и деньги 24/7.",
                    easy: "Один раз выбрал нужные галочки в настройках, и система работает без твоего участия.",
                    locked: false 
                  },
                  { 
                    title: "Модуль 4: Карта прибыли", 
                    subtitle: "Где твои деньги",
                    desc: "Покажем список ниш, где за такие магазины платят больше всего. Даем готовое предложение, которое остается только отправить.",
                    easy: "Тебе не нужно ничего выдумывать — мы даем наводку на прибыльные места и готовый текст для сделки.",
                    locked: false // РАЗБЛОКИРОВАНО по запросу
                  }
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-start gap-3 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.locked ? 'bg-zinc-900 text-zinc-600' : 'bg-[#00FF9D]/10 text-[#00FF9D]'}`}>
                          {item.locked ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                          <h4 className={`text-sm font-bold uppercase tracking-wider ${item.locked ? 'text-zinc-600' : 'text-white'}`}>{item.title}</h4>
                          <p className="text-[10px] text-[#00FF9D] font-bold uppercase tracking-wider">{item.subtitle}</p>
                        </div>
                      </div>
                      {/* Стрелка удалена отсюда */}
                    </div>
                    
                    <div className="pl-[3.5rem] w-full">
                        <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">{item.desc}</p>
                        <div className="bg-[#00FF9D]/5 border-l-2 border-[#00FF9D]/30 pl-3 py-2 rounded-r-lg">
                          <p className="text-[8px] text-[#00FF9D] font-bold uppercase mb-0.5 tracking-widest">ПОЧЕМУ ЭТО ПРОСТО:</p>
                          <p className="text-[9px] text-zinc-500 italic leading-snug">{item.easy}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">Стоимость обучения</p>
              <div className="text-2xl font-black text-white mb-2 font-['Chakra_Petch']">50 000 ₸ <span className="text-zinc-600 text-lg line-through decoration-red-600 decoration-2 ml-2">80 000 ₸</span></div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Длительность обучения (14 дней)</p>
              
              {/* Removed Purchase Button */}

              <button
                onClick={() => window.open('https://t.me/taipanmedia', '_blank')}
                className="block w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
              >
                Получить подробную консультацию
              </button>
            </div>
          </div>
        )}
      </div>

      {/* МОДАЛЬНОЕ ОКНО ЛИД-ГЕНЕРАЦИИ */}
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

      {/* МОДАЛЬНОЕ ОКНО КОНТЕНТА FAQ (НОВОЕ) */}
      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          {/* Размытие фона */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300" onClick={closeFaq} />
          {/* Карточка контента */}
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,255,157,0.15)] flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 cursor-pointer" onClick={closeFaq} />
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 rounded-full bg-[#00FF9D]/10 text-[#00FF9D]">{activeFaq.icon}</div>
               <h2 className="text-xl font-bold font-['Chakra_Petch'] leading-tight">{activeFaq.question}</h2>
            </div>
            
            {/* Динамический контент */}
            <div className="mb-4">{activeFaq.component}</div>

            {/* Специальная логика калькулятора */}
            {activeFaq.isCalc && !showCalculator && (
               <button 
                 onClick={() => setShowCalculator(true)}
                 className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse hover:scale-[1.02] transition-all text-xs"
               >
                 РАССЧИТАТЬ ПРИБЫЛЬ
               </button>
            )}
            
            {/* Показать калькулятор, если активирован */}
            {activeFaq.isCalc && showCalculator && (
              <div className="mt-6 border-t border-[#00FF9D]/20 pt-6">
                <ProfitCalculator data={calcData} setData={setCalcData} onAction={() => setCurrentView('strategy')} />
              </div>
            )}

            <button onClick={closeFaq} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in zoom-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          <span className="text-xs font-bold uppercase tracking-wider">Запрос принят</span>
        </div>
      )}
    </div>
  );
};

export default App;
