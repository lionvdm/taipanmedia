import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// --- FIREBASE INTEGRATION ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';

// --- CONFIGURATION & INIT ---
const firebaseConfig = {
  apiKey: "AIzaSyCdcj_56EdygidWa8pQm17fegnF39XB8Xg",
  authDomain: "taipan-680b2.firebaseapp.com",
  projectId: "taipan-680b2",
  storageBucket: "taipan-680b2.firebasestorage.app",
  messagingSenderId: "990538734233",
  appId: "1:990538734233:web:dbfe47aed6d87626207608",
  measurementId: "G-QFJTFTCNNY"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Получаем ID приложения
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- TELEGRAM WEB APP UTILS ---
const tg = window.Telegram?.WebApp;

// Helper for Haptic Feedback
const haptic = (style = 'light') => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred(style);
  }
};

const notify = (type = 'success') => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred(type);
  }
};

// --- STYLES ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }

    .glass-card {
        background-color: rgba(15, 15, 15, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 255, 157, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        position: relative;
        overflow: hidden;
    }
    
    .grid-bg {
        background-image: 
            linear-gradient(rgba(0, 255, 157, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 157, 0.07) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .glass-card:hover {
        background-color: rgba(0, 255, 157, 0.05);
        border-color: rgba(0, 255, 157, 0.4);
        box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
    }
    .glass-card:active { transform: scale(0.98); }
    .hw-accelerated {
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
    }

    /* Strategy Card Style (Minimalist Dark) */
    .strategy-card {
        background-color: #0A0A0A;
        border: 1px solid #1f1f1f;
        border-radius: 16px;
        padding: 20px;
        position: relative;
        overflow: hidden;
    }

    @keyframes contourPulse {
      0% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
      50% { filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.6)); opacity: 1; }
      100% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
    }
    @keyframes scanLine {
      0% { transform: translateY(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(100%); opacity: 0; }
    }
    @keyframes cyberReveal {
      0% { opacity: 0; transform: scale(1.5); filter: blur(20px) hue-rotate(90deg); }
      20% { opacity: 1; transform: scale(1.2); filter: blur(0); }
      40% { transform: scale(1.35); filter: brightness(1.5); }
      100% { opacity: 1; transform: scale(1.25); filter: none; }
    }
    @keyframes widthGrow { from { width: 0; } }
    @keyframes simple-glow {
      0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 157, 0.3); transform: scale(1); color: #fff; }
      50% { text-shadow: 0 0 25px rgba(0, 255, 157, 0.8), 0 0 10px rgba(0, 255, 157, 0.5); transform: scale(1.02); color: #00FF9D; }
    }
    @keyframes smoke-fade {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `}} />
);

// --- COMPONENT DEFINITIONS ---

// 1. Matrix Background
const MatrixBackground = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);

    let lastTime = 0;
    const fps = 30; 
    const interval = 1000 / fps;

    let animationFrameId;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00FF9D';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    draw(0);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1] opacity-20 mix-blend-screen pointer-events-none" style={{ willChange: 'contents' }} />;
});

// 2. Odometer Hook
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

// 3. Icons
const GraduationCap = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
const ArrowRight = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const ChevronLeft = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m15 18-6-6 6-6" /></svg>;
const CheckCircle2 = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
const Lock = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const TrendingUp = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const Wallet = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>;
const X = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
const Zap = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const Search = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const Users = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Shield = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const Crosshair = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>;
const Code = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const Database = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
const Trash2 = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18" /><path d="M19 6v14c0 1.1-.9 2 2 2H7c-1.1 0-2-.9-2-2V6" /><path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" /></svg>;
const Activity = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const Edit2 = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;
const Save = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const Filter = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const BarChart2 = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const PieChart = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>;
const Copy = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>;

const TelegramLogoMain = React.memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
));

// 4. SmartImage
const SmartImage = React.memo(({ src, alt, className, style, wrapperClass = "", overflowHidden = true }) => {
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
             e.target.style.display = 'none'; 
           }
        }}
        className={`${className} hw-accelerated transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ ...style, contentVisibility: 'auto' }} 
      />
    </div>
  );
});

// 5. InputField
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

// 6. ProfitCalculator
const ProfitCalculator = ({ onAction, data, setData }) => {
  const sales = Math.floor(data.traffic * (data.conversion / 100));
  const revenue = sales * data.avgCheck;
  const profit = Math.floor(revenue * (data.margin / 100));
  
  const animatedProfit = useOdometer(profit);
  const animatedSales = useOdometer(sales);

  useEffect(() => {
    if (!tg) return;

    const mainBtn = tg.MainButton;
    mainBtn.setText("ПОЛУЧИТЬ СТРАТЕГИЮ");
    mainBtn.setTextColor("#000000"); 
    mainBtn.setColor("#00FF9D");      
    
    if (!mainBtn.isVisible) {
      mainBtn.show();
    }

    const handleClick = () => {
      haptic('heavy');
      onAction();
    };

    mainBtn.onClick(handleClick);
    return () => {
      mainBtn.offClick(handleClick);
      mainBtn.hide();
    };
  }, [onAction]);

  return (
    <div className="w-full animate-in slide-in-from-bottom duration-500">
      <InputField label="Сколько людей в месяц?" value={data.traffic} setValue={(v) => setData({...data, traffic: v})} />
      <InputField label="Какая конверсия?" value={data.conversion} setValue={(v) => setData({...data, conversion: v})} suffix="%" />
      <InputField label="Средний чек" value={data.avgCheck} setValue={(v) => setData({...data, avgCheck: v})} suffix="₸" />
      <InputField label="Средний % чистой прибыли" value={data.margin} setValue={(v) => setData({...data, margin: v})} suffix="%" />

      <div className="relative overflow-hidden bg-[#00FF9D]/5 border border-[#00FF9D]/30 p-5 rounded-2xl text-center group mt-4 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/5 to-transparent animate-[scanLine_3s_linear_infinite]"></div>
        <div className="relative z-10">
            <div className="flex flex-col items-center justify-center mb-2">
               <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mb-1">ВАШ БИЗНЕС МОЖЕТ ПРИНОСИТЬ</p>
               <p className="text-3xl sm:text-4xl font-black text-[#00FF9D] font-['Chakra_Petch'] drop-shadow-[0_0_15px_rgba(0,255,157,0.4)] mb-1">НА {animatedProfit.toLocaleString()} ₸</p>
               <p className="text-[12px] text-white font-bold uppercase tracking-[0.2em]">БОЛЬШЕ ЕЖЕМЕСЯЧНО</p>
            </div>
            <div className="bg-[#00FF9D]/5 border-t border-b border-[#00FF9D]/10 py-3 mt-3 backdrop-blur-sm">
               <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-medium leading-relaxed">ЭТО <span className="text-[#00FF9D] font-black">{animatedSales} ПОКУПАТЕЛЕЙ</span>, КОТОРЫЕ<br/>ГОТОВЫ ПЛАТИТЬ ВАМ УЖЕ СЕЙЧАС</p>
            </div>
            <p className="text-[8px] text-zinc-500 mt-3 italic">*Мы знаем как увеличить конверсию от 20% и выше</p>
        </div>
      </div>
      
      {!tg?.initData && (
        <button onClick={onAction} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse mt-4">ПОЛУЧИТЬ СТРАТЕГИЮ ОТ TAIPAN GROUP</button>
      )}
    </div>
  );
};

// 6.1 AcademyCalculator
const AcademyCalculator = ({ data, setData, onAction }) => {
  const { salary, days, hours } = data;
  
  const updateData = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
  };

  const totalHours = Math.max(1, days * hours);
  const currentRate = Math.floor(salary / totalHours);
  const targetRate = 100000;
  const efficiency = Math.max(1, targetRate / Math.max(1, currentRate));
  const hoursToPlow = Math.ceil(targetRate / Math.max(1, currentRate));
  const hoursPerMonth = days * hours;
  const hoursPerWeek = hoursPerMonth / 4.3; 
  const weeksToPlow = (hoursToPlow / Math.max(1, hoursPerWeek)).toFixed(1);
  const animatedRate = useOdometer(currentRate);

  return (
    <div className="w-full animate-in slide-in-from-bottom duration-500">
      <InputField 
        label="Ваша примерная зарплата в месяц?" 
        value={salary} 
        setValue={(v) => updateData('salary', v)} 
      />
      <div className="flex flex-col gap-2">
        <InputField 
            label="Сколько дней в месяц вы работаете?" 
            value={days} 
            setValue={(v) => updateData('days', v)} 
        />
        <InputField 
            label="Сколько часов в день вы работаете?" 
            value={hours} 
            setValue={(v) => updateData('hours', v)} 
        />
      </div>

      <div className="relative overflow-hidden bg-[#00FF9D]/5 border border-[#00FF9D]/30 p-5 rounded-2xl text-center group mt-4 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/5 to-transparent animate-[scanLine_3s_linear_infinite]"></div>
         
         <div className="relative z-10 space-y-4 text-left">
            <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2 text-center">ТВОЙ РЕЗУЛЬТАТ:</p>
                
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-zinc-400">Сейчас ваш час стоит:</span>
                    <span className="text-sm font-bold text-white font-mono">{animatedRate.toLocaleString()} ₸</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-[#00FF9D]">Час работы по нашей методике:</span>
                    <span className="text-sm font-bold text-[#00FF9D] font-mono">100 000 ₸</span>
                </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
                <p className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-1">ТВОЯ ЭФФЕКТИВНОСТЬ НИЖЕ В</p>
                <p className="text-5xl font-black text-red-500 font-['Chakra_Petch'] drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{Math.floor(efficiency)} РАЗ!</p>
            </div>

            <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">ЧТО ЭТО ЗНАЧИТ?</p>
                <p className="text-[11px] text-zinc-300 leading-relaxed mb-2">
                    Чтобы заработать те же <span className="text-white font-bold">100 000 тенге</span>, которые наш выпускник получает за <span className="text-white font-bold">1 час</span>, тебе нужно пахать <span className="text-red-500 font-bold">{hoursToPlow} часов</span>.
                </p>
                <p className="text-[10px] text-zinc-500 italic">
                    (это {weeksToPlow > 0.8 && weeksToPlow < 1.2 ? 'одна' : weeksToPlow} рабочие недели!)
                </p>
            </div>
            
            <div className="border-l-2 border-[#00FF9D] pl-3 py-1">
                <p className="text-[11px] text-white font-bold leading-tight">
                    Ты точно хочешь продолжать тратить недели жизни на то, что можно сделать за час?
                </p>
            </div>
         </div>
      </div>

      <button onClick={onAction} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse mt-4">
        ИСПРАВИТЬ СИТУАЦИЮ
      </button>
    </div>
  );
};

// 7. BaneIntro
const BaneIntro = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const audio = new Audio('/VID_20260122_010534_539 (online-audio-converter.com).mp3');
        audio.volume = 1.0;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio autoplay prevented (expected in preview):", error);
            });
        }

        const t1 = setTimeout(() => setPhase(1), 50); 
        const t2 = setTimeout(() => setPhase(2), 3400); 
        const t3 = setTimeout(() => setPhase(3), 4400); 
        const t4 = setTimeout(() => onComplete(), 7800); 

        return () => { 
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); 
            audio.pause();
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={onComplete}>
            <div className="max-w-md w-full relative">
                 {/* Voice Visualizer */}
                <div className="flex justify-center items-end gap-1 h-16 mb-12 opacity-50">
                      {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-2 bg-[#00FF9D] rounded-full animate-[voiceWave_0.8s_ease-in-out_infinite]" style={{ animationDelay: `${Math.random() * 0.5}s`, height: '10%' }}></div>
                      ))}
                </div>

                <div className="space-y-8 relative z-10">
                    <div className={`transition-all duration-[1500ms] ease-out ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-xl sm:text-2xl font-black uppercase font-['Chakra_Petch'] tracking-[0.2em] text-zinc-500 animate-[smoke-fade_2s_ease-out_forwards]">
                            НЕВАЖНО КТО МЫ ТАКИЕ
                        </h2>
                    </div>
                    
                    <div className={`transition-all duration-[100ms] ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase font-['Chakra_Petch'] tracking-widest text-white animate-[aggressive-glitch-text_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_both]">
                            ВАЖНО ТО
                        </h2>
                    </div>

                    <div className={`transition-all duration-[500ms] ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="relative inline-block">
                            <h2 className="text-3xl sm:text-5xl font-black uppercase font-['Chakra_Petch'] tracking-widest text-[#00FF9D] animate-[simple-glow_3s_infinite_ease-in-out]">
                                КАКОЙ У НАС ПЛАН
                            </h2>
                        </div>
                    </div>
                </div>
                
                <div className="absolute bottom-[-100px] left-0 right-0 text-center">
                    <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] animate-pulse">Включите звук</p>
                </div>
            </div>
        </div>
    );
};

// 8. HackerProof
const HackerProof = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div 
        className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
      >
        <SmartImage src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" className="w-full object-cover" alt="Encrypted Proof" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10"><Search className="w-3 h-3 text-[#00FF9D]" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none z-10"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
           <div><p className="text-[#00FF9D] text-[10px] font-black font-mono bg-black/80 px-2 py-0.5 inline-block border-l-2 border-[#00FF9D]">VIRGINIA GOLD</p><p className="text-white text-[9px] font-mono bg-black/80 px-2 py-0.5 mt-1 inline-block">ЧЕК: 100.000 Т</p></div>
           <CheckCircle2 className="w-6 h-6 text-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
        </div>
      </div>
      {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
          <div className="relative w-full max-w-2xl">
             <SmartImage src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]" alt="Proof Full" />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
});

// 9. ClientDemandProof
const ClientDemandProof = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full object-cover opacity-90 filter grayscale-[0.5] contrast-[1.1] brightness-[0.9]" alt="Client Demand" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10"><Search className="w-3 h-3 text-[#00FF9D]" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-3 left-3 bg-black/80 border border-[#00FF9D]/30 px-2 py-1 rounded z-20">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div><span className="text-[9px] font-mono text-[#00FF9D]">DEMAND_HIGH</span></div>
        </div>
      </div>
       {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
          <div className="relative w-full max-w-2xl">
             <SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]" alt="Demand Full" />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
});

// 10. SkillScanner
const SkillScanner = () => (
  <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500 group">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/05 to-transparent animate-[scanLine_4s_linear_infinite]"></div>
    <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse"></div><span className="text-[10px] font-mono text-[#00FF9D] tracking-widest">СИСТЕМНЫЙ_АНАЛИЗ</span></div>
           <span className="text-[9px] text-zinc-600 font-mono">v.2.0.4</span>
        </div>
        <div className="space-y-4">
          <div><div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">НАВЫКИ (КОДИНГ)</span><span className="text-zinc-600">НЕ ТРЕБУЕТСЯ</span></div><div className="w-full h-1 bg-zinc-900 rounded-full"><div className="w-[0%] h-full bg-red-500 rounded-full"></div></div></div>
          <div><div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">ВРЕМЯ НАСТРОЙКИ</span><span className="text-[#00FF9D]">~45 МИН</span></div><div className="w-full h-1 bg-zinc-900 rounded-full"><div className="w-[15%] h-full bg-[#00FF9D] rounded-full shadow-[0_0_8px_#00FF9D] animate-[widthGrow_1s_ease-out]"></div></div></div>
          <div><div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-zinc-400">АВТОМАТИЗАЦИЯ</span><span className="text-[#00FF9D]">90%</span></div><div className="w-full h-1 bg-zinc-900 rounded-full"><div className="w-[90%] h-full bg-[#00FF9D] rounded-full shadow-[0_0_8px_#00FF9D] animate-[widthGrow_1.5s_ease-out]"></div></div></div>
        </div>
        <div className="mt-4 p-2 bg-[#00FF9D]/5 rounded border border-[#00FF9D]/10 text-center relative overflow-hidden"><div className="absolute inset-0 bg-[#00FF9D]/5 animate-pulse"></div><p className="text-[9px] text-[#00FF9D] font-black tracking-widest uppercase relative z-10">ВЕРДИКТ: ИДЕАЛЬНО ДЛЯ НОВИЧКОВ</p></div>
    </div>
  </div>
);

// 11. SetupTimeline
const SetupTimeline = () => {
  const steps = [
    { title: "ШАГ 1: ТОКЕН", time: "~ 2 МИН", desc: "Создайте бота. Вставьте токен. Магазин запущен." },
    { title: "ШАГ 2: ТОВАРЫ", time: "~ 4 МИН", desc: "Добавьте товары вручную или загрузите через Excel/XML." },
    { title: "ШАГ 3: ОПЛАТА", time: "~ 2.5 МИН", desc: "Подключите карты, крипту или СБП. Работает из коробки." },
    { title: "ШАГ 4: ДОСТАВКА", time: "~ 1.5 МИН", desc: "Настройте зоны доставки или самовывоз." }
  ];
  return (
    <div className="w-full pl-2 mb-4 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-6"><span className="text-[10px] text-[#00FF9D] font-mono tracking-widest border border-[#00FF9D]/30 px-2 py-1 rounded">ПРОТОКОЛ ЗАПУСКА</span><span className="text-[10px] text-zinc-500 font-mono">TOTAL: ~10 МИН</span></div>
      <div className="relative border-l border-[#00FF9D]/20 ml-2 space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-6 group">
             <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-[#050505] border border-[#00FF9D] rounded-full group-hover:bg-[#00FF9D] group-hover:shadow-[0_0_10px_#00FF9D] transition-all"></div>
             <div className="flex justify-between items-start">
               <div><h4 className="text-sm font-bold text-white font-['Chakra_Petch'] leading-none mb-1 group-hover:text-[#00FF9D] transition-colors">{step.title}</h4><p className="text-[11px] text-zinc-400 leading-snug max-w-[220px]">{step.desc}</p></div>
               <span className="text-[9px] font-mono text-[#00FF9D]/70 bg-[#00FF9D]/5 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">{step.time}</span>
             </div>
          </div>
        ))}
        <div className="relative pl-6 mt-8"><div className="absolute -left-[7px] top-1 w-3.5 h-3.5 bg-[#00FF9D] rounded-full animate-pulse shadow-[0_0_15px_#00FF9D]"></div><div className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 p-3 rounded-lg"><h4 className="text-sm font-black text-[#00FF9D] uppercase tracking-wider mb-1">МАГАЗИН ГОТОВ</h4><p className="text-[10px] text-zinc-300 leading-snug">Можно запускать трафик и получать прибыль. Система работает автономно.</p></div></div>
      </div>
    </div>
  );
};

// 12. WordstatGraph
const WordstatGraph = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="w-full bg-[#1c1c1e] rounded-xl border border-zinc-700 overflow-hidden mb-6 font-sans shadow-xl cursor-zoom-in relative group" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <div className="bg-[#242426] px-4 py-3 border-b border-zinc-700 flex justify-between items-center">
          <div><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="text-[11px] text-zinc-300 font-bold">История запросов (Яндекс Вордстат)</span></div><p className="text-[13px] text-white mt-0.5 font-medium">«телеграм магазин»</p></div>
          <div className="text-right"><p className="text-[9px] text-zinc-500 uppercase tracking-wider">Всего показов</p><p className="text-[16px] font-bold text-white">6 650</p></div>
        </div>
        <div className="relative w-full h-auto">
          <SmartImage src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" alt="Real Wordstat Data" className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite] z-10"></div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none z-10"></div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-white/20 z-20"><Search className="w-3 h-3 text-white" /></div>
        </div>
      </div>
       {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
          <div className="relative w-full max-w-4xl"><SmartImage src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" className="w-full h-auto rounded-lg border border-zinc-700 shadow-2xl" alt="Wordstat Full" /><p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p></div>
        </div>
      )}
    </React.Fragment>
  );
});

// 13. BrandLogos
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
        {/* Adjusted viewBox to prevent clipping of the top part of the logo */}
        <svg viewBox="-2 -2 28 28" fill="#F7931A" className={`w-16 h-16 mb-4 transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80 drop-shadow-[0_0_15px_rgba(247,147,26,0.5)]'}`}><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.695 8.47-1.216 14.9-.388c6.426 1.602 10.34 8.09 8.738 15.292zM18.106 10.12c.264-1.765-1.08-2.71-2.914-3.344l.596-2.39-1.454-.362-.58 2.33c-.382-.096-.776-.186-1.166-.273l.586-2.355-1.454-.362-.596 2.39c-.316-.072-.625-.144-.925-.218l.002-.008-2.007-.502-.388 1.55s1.08.247 1.057.263c.59.147.696.537.678.847l-.68 2.73c.04.01.094.026.152.05-.054-.014-.112-.03-.17-.044l-1.103 4.426c-.072.178-.254.445-.664.343.014.02-1.057-.263-1.057-.263l-.723 1.67 1.894.474c.35.088.694.18 1.034.266l-.604 2.43 1.452.362.598-2.396c.396.108.783.21 1.16.307l-.592 2.38 1.454.363.604-2.43c2.482.47 4.35.28 5.136-1.965.634-1.808-.032-2.852-1.336-3.535 1.03-.238 1.81-.916 2.02-2.31zM14.47 14.524c-.45 1.81-3.5 0.83-4.484.588l.8-3.212c.983.244 4.14.726 3.684 2.624zm.45-4.44c-.41 1.644-2.96.81-3.774.606l.724-2.912c.814.204 3.468.583 3.05 2.306z"/></svg>
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
      <p className="text-[#00FF9D] text-[12px] uppercase tracking-[0.3em] mt-3 font-bold bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.2)] text-center">Обучись новому тренду с нами</p>
    </div>
  )
};

// --- Carousel3D (RESTORED) ---
const Carousel3D = () => {
  const images = [
    "https://i.ibb.co.com/Fp52kXy/666.png", "https://i.ibb.co.com/9H5ZxPfy/555.png",
    "https://i.ibb.co.com/bjV5YtR2/444.png", "https://i.ibb.co.com/Q3k778bd/333.png",
    "https://i.ibb.co.com/M5tCqhDs/222.png", "https://i.ibb.co.com/BV1gXyf7/111.png"
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setIndex((prev) => (prev + 1) % images.length); }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
       {images.map((img, i) => {
         const total = images.length;
         const dist = (index - i + total) % total;
         let styleClass = "opacity-0 scale-50 z-0 translate-y-[100px]"; 
         if (dist === 0) styleClass = "opacity-100 scale-100 z-30 translate-y-[0px]";
         else if (dist === 1) styleClass = "opacity-60 scale-90 z-20 -translate-y-[40px]";
         else if (dist === 2) styleClass = "opacity-30 scale-80 z-10 -translate-y-[70px]";
         else if (dist === total - 1) styleClass = "opacity-0 scale-100 z-40 translate-y-[100%] pointer-events-none"; 
         return (
           <div key={i} className={`absolute transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) w-[320px] h-[180px] flex items-center justify-center ${styleClass}`}>
              {/* Dark Glass Container */}
              <div className="relative inline-block rounded-[24px] overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)]">
                  
                  {/* Subtle Noise Texture for realism (optional, kept simple here) */}
                  
                  {/* Top Lighting/Gloss - Very subtle to not obscure text */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-30"></div>
                  
                  {/* The Image itself */}
                  <div className="relative z-10 p-1">
                    <img src={img} alt="Notification" className="max-w-full max-h-full object-contain rounded-[20px]" />
                  </div>

                  {/* Inner Glow / Bottom Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5 pointer-events-none z-20"></div>
              </div>
           </div>
         )
       })}
    </div>
  );
};

// --- ShopIntroSequence (RESTORED) ---
const ShopIntroSequence = ({ onComplete }) => {
  const message = { part1: "МЕНЬШЕ ДИАЛОГОВ — БОЛЬШЕ ДЕНЕГ.", part2: "СПАСАЕМ ОТ 20% УПУЩЕННОЙ ПРИБЫЛИ" };
  useEffect(() => {
    const timer = setTimeout(() => { onComplete(); }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] px-4 cursor-pointer" onClick={onComplete}>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[200px] bg-white/5 blur-[80px] rounded-full -z-10 pointer-events-none animate-[pulse_4s_infinite]"></div>
       <div className="w-full text-center max-w-3xl animate-in fade-in duration-1000">
         <h2 className="text-lg sm:text-2xl font-light uppercase tracking-[0.2em] font-['Outfit'] text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{message.part1}</h2>
         <div className="relative inline-block mt-6">
             <h2 className="text-3xl sm:text-5xl font-black uppercase font-['Chakra_Petch'] text-transparent bg-clip-text bg-gradient-to-r from-[#444] via-[#00FF9D] to-[#444] bg-[length:200%_auto] animate-[snakeFlow_3s_linear_infinite] drop-shadow-[0_0_30px_rgba(0,255,157,0.3)] tracking-widest">{message.part2}</h2>
         </div>
       </div>
       <div className="absolute bottom-20 text-[10px] text-zinc-600 uppercase tracking-[0.3em] animate-pulse">Пропуск через 3 сек</div>
    </div>
  );
};

// --- PartnersCredits (RESTORED) ---
const PartnersCredits = () => {
  const logos = [
    "https://i.ibb.co.com/PvND9HRh/Picsart-Background-Remover.png", "https://i.ibb.co.com/YHbCZm2/Yandex-Metrika-hd-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/DfQywRwj/Picsart-Background-Remover.png", "https://i.ibb.co.com/QZpjR8B/salon-cvetov-janym-photo-place-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/3mKHz61B/Picsart-Background-Remover.png", "https://i.ibb.co.com/MDKssj1s/mojsklad-Picsart-Background-Remover.png"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % logos.length); }, 2500);
    return () => clearInterval(timer);
  }, []);
  const currentLogo = logos[currentIndex];
  const isYandex = currentLogo.includes("Yandex");
  const isRomantic = currentLogo.includes("janym");
  const isFood = currentLogo.includes("DfQywRwj");
  const isPicsartLogo = currentLogo.includes("PvND9HRh");
  const isMoiSklad = currentLogo.includes("3mKHz61B") || currentLogo.includes("PvND9HRh"); 
  const isNewPartner = currentLogo.includes("MDKssj1s"); // Updated ID for the new MoiSklad logo
  
  // Base filters
  let specificStyle = { 
    filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.15)) brightness(1.1) contrast(1.1) saturate(1.2)',
    transition: 'transform 0.5s ease' // Smooth scaling
  };

  // Specific styles
  if (isYandex) specificStyle = { ...specificStyle, filter: 'invert(1) hue-rotate(180deg) saturate(3) brightness(1.2)' };
  else if (isRomantic) specificStyle = { ...specificStyle, filter: 'brightness(1.5) contrast(1.2)' };
  else if (isFood) specificStyle = { ...specificStyle, filter: 'brightness(1.1) contrast(1.1)' };
  else if (isPicsartLogo) specificStyle = { ...specificStyle, filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))' };
  else if (isNewPartner) {
      // Adjusted scale down from 1.5 to 0.75 as requested (approx 2x smaller)
      specificStyle = { 
          ...specificStyle, 
          filter: 'brightness(1.1) contrast(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.2))',
          transform: 'scale(0.75)' 
      };
  } 

  // Uniform scaling for others (scale-125 matches Romantic), removing generic scaling for isNewPartner from classes to use inline style instead
  const logoClasses = `h-24 w-auto object-contain max-w-[90%] transform ${!isNewPartner ? 'scale-125' : ''} ${isFood ? 'translate-y-10' : ''}`;
  
  return (
    <div className="w-full mt-2 mb-4 relative px-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4 mb-3 opacity-100">
        <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#00FF9D]"></div>
        <p className="text-center text-[9px] text-[#00FF9D] uppercase tracking-[0.4em] mr-[-0.4em] font-bold shadow-green-glow animate-pulse">Наши партнёры</p>
        <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#00FF9D]"></div>
      </div>
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-white/5 rounded-xl border border-[#00FF9D]/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         <div key={currentIndex} className="relative z-10 animate-[cyberReveal_0.5s_cubic-bezier(0.215,0.61,0.355,1)_both] w-full flex justify-center">
            <SmartImage src={currentLogo} alt="Partner Logo" style={specificStyle} className={logoClasses} wrapperClass="relative z-10 flex justify-center w-full" />
         </div>
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite]"></div>
      </div>
      <div className="flex gap-1.5 mt-3">
        {logos.map((_, idx) => ( <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#00FF9D] shadow-[0_0_10px_#00FF9D]' : 'w-1.5 bg-zinc-800'}`} /> ))}
      </div>
    </div>
  );
};

// --- RoiView (RESTORED) ---
const RoiView = ({ profit, onBack, onAction }) => {
  const investment = 100000;
  const conservativeProfit = Math.floor(profit * 0.2); 
  const returnPercentage = Math.round((conservativeProfit / investment) * 100);
  const daysToRecoup = conservativeProfit > 0 ? Math.ceil(investment / (conservativeProfit / 30)) : Infinity;
  const isProfitable = returnPercentage > 0;
  // --- UPDATED: Handle Consultation with Logging ---
  const handleConsultation = () => {
      // Use Haptic
      haptic('light');
      window.open('https://t.me/taipanmedia', '_blank');
  };
  
  const animatedProfit = useOdometer(conservativeProfit);
  const animatedPercentage = useOdometer(returnPercentage);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
        <button onClick={() => { haptic('light'); onBack(); }} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
        <div className="flex-grow flex flex-col items-center w-full space-y-6">
            <div className="text-center px-4 w-full"><h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">РАСЧЁТ <span className="text-[#00FF9D]">ОКУПАЕМОСТИ</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Эффективность инвестиций</p></div>
            <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-zinc-800"><span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Стоимость разработки</span><span className="text-sm font-black text-white font-['Chakra_Petch']">100 000 ₸</span></div>
             <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-[#00FF9D]/20 bg-[#00FF9D]/5"><span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Потенциальный возврат</span><span className="text-sm font-black text-[#00FF9D] font-['Chakra_Petch']">{animatedProfit.toLocaleString()} ₸/мес</span></div>
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-3xl text-center group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-3 relative z-10 leading-relaxed">При указанных вами показателях,<br/>в первый месяц вы вернёте</p>
                <div className={`text-5xl font-black font-['Chakra_Petch'] mb-3 relative z-10 ${isProfitable ? 'text-[#00FF9D]' : 'text-zinc-500'}`}>{animatedPercentage}% <span className="text-sm font-bold text-zinc-500 uppercase tracking-wide">вложений</span></div>
                {isProfitable ? (<div className="inline-block bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-3 py-1 rounded-full relative z-10"><p className="text-[10px] text-[#00FF9D] font-bold uppercase tracking-wider">Полная окупаемость: ~{daysToRecoup} {daysToRecoup === 1 ? 'день' : (daysToRecoup > 1 && daysToRecoup < 5) ? 'дня' : 'дней'}</p></div>) : (<p className="text-[10px] text-zinc-600 relative z-10">Заполните калькулятор для расчета</p>)}
            </div>
            <div className="w-full pt-4"><button onClick={handleConsultation} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse">ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ</button></div>
        </div>
    </div>
  );
};

// --- ANALYTICS CHART COMPONENT ---
const AnalyticsChart = ({ leads }) => {
    // 1. Calculate Stats
    const stats = useMemo(() => {
        const counts = leads.reduce((acc, lead) => {
            const type = lead.type || 'Не указано';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        
        const total = leads.length;
        
        return Object.keys(counts).map(key => ({
            label: key,
            count: counts[key],
            percentage: total > 0 ? Math.round((counts[key] / total) * 100) : 0
        })).sort((a, b) => b.count - a.count);
    }, [leads]);

    const maxCount = Math.max(...stats.map(s => s.count), 1);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
             {/* SUMMARY CARDS */}
             <div className="grid grid-cols-2 gap-3">
                 <div className="glass-card p-4 rounded-xl border border-zinc-800">
                     <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">ВСЕГО ЛИДОВ</p>
                     <p className="text-3xl font-black text-white font-mono">{leads.length}</p>
                 </div>
                 <div className="glass-card p-4 rounded-xl border border-zinc-800">
                     <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">TOP ВЫБОР</p>
                     <p className="text-xl font-bold text-[#00FF9D] truncate">{stats[0]?.label || '---'}</p>
                 </div>
             </div>

             {/* BAR CHART */}
             <div className="glass-card p-5 rounded-xl border border-zinc-800">
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                         <BarChart2 className="w-4 h-4 text-[#00FF9D]" />
                         Популярность услуг
                     </h3>
                 </div>
                 
                 <div className="space-y-4">
                     {stats.map((item, idx) => (
                         <div key={idx} className="relative">
                             <div className="flex justify-between items-end mb-1">
                                 <span className="text-[10px] font-bold text-zinc-300">{item.label}</span>
                                 <span className="text-[10px] font-mono text-[#00FF9D]">{item.count} ({item.percentage}%)</span>
                             </div>
                             <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-gradient-to-r from-[#00FF9D]/50 to-[#00FF9D] rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                                 >
                                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                                 </div>
                             </div>
                         </div>
                     ))}
                     {stats.length === 0 && <p className="text-center text-[10px] text-zinc-600 py-4">Нет данных для отображения</p>}
                 </div>
             </div>

             {/* DONUT CHART SIMULATION (CSS CONIC) */}
             <div className="glass-card p-5 rounded-xl border border-zinc-800 flex items-center justify-between">
                 <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-[#00FF9D]" />
                        Доли трафика
                    </h3>
                    <p className="text-[9px] text-zinc-500 leading-relaxed max-w-[150px]">
                        Распределение интереса аудитории по категориям услуг.
                    </p>
                 </div>
                 <div className="relative w-20 h-20 flex-shrink-0">
                     <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#111" strokeWidth="4" />
                        {stats.map((item, i) => {
                             // Simple calc for demo visualization of top item
                             if (i > 0) return null; 
                             return (
                                <path 
                                    key={i}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" 
                                    fill="none" 
                                    stroke="#00FF9D" 
                                    strokeWidth="4" 
                                    strokeDasharray={`${item.percentage}, 100`}
                                    className="animate-[widthGrow_1s_ease-out]"
                                />
                             )
                        })}
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-[8px] text-zinc-500 font-bold">TOP</span>
                         <span className="text-[10px] font-bold text-white">{stats[0]?.percentage || 0}%</span>
                     </div>
                 </div>
             </div>
        </div>
    );
};


// --- Admin Panel Component ---
const AdminPanel = ({ leads, visitors, onBack, onClearLeads, onUpdateLead, onUpdateVisitor }) => {
    const [activeTab, setActiveTab] = useState('visitors');
    const [editingItem, setEditingItem] = useState(null); 
    const [editCollection, setEditCollection] = useState(''); 

    // --- Daily Visitors Calculation ---
    const dailyVisitorsCount = useMemo(() => {
        const todayStr = new Date().toDateString();
        return visitors.filter(v => {
            if (!v.lastActive) return false;
            // Handle both Firestore Timestamp and JS Date
            const d = v.lastActive.toDate ? v.lastActive.toDate() : new Date(v.lastActive);
            return d.toDateString() === todayStr;
        }).length;
    }, [visitors]);

    const handleEditClick = (item, collectionType) => {
        setEditingItem(item);
        setEditCollection(collectionType);
        haptic('light');
    };

    const handleSave = (e) => {
        e.preventDefault();
        haptic('medium');
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData.entries());

        if (editCollection === 'leads') {
            onUpdateLead(editingItem.id, updates);
        } else if (editCollection === 'visitors') {
            onUpdateVisitor(editingItem.id, updates);
        }
        setEditingItem(null);
    };

    const handleTabChange = (tab) => {
        haptic('light');
        setActiveTab(tab);
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full relative">
            <button onClick={() => { haptic('light'); onBack(); }} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit">
                <ChevronLeft className="w-4 h-4 mr-1" /> ВЫХОД ИЗ СИСТЕМЫ
            </button>
            
            <div className="w-full flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-zinc-900 border border-[#00FF9D]/30 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-[#00FF9D]/10"></div>
                    <Shield className="w-8 h-8 text-[#00FF9D]" />
                </div>
                <h2 className="text-2xl font-black font-['Chakra_Petch'] uppercase tracking-widest">ПАНЕЛЬ УПРАВЛЕНИЯ</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Admin Mode: ACCESS GRANTED</p>
            </div>

            <div className="flex w-full mb-4 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 gap-1 overflow-x-auto no-scrollbar">
                <button onClick={() => handleTabChange('stats')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'stats' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>📊 Статистика</button>
                <button onClick={() => handleTabChange('leads')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'leads' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>Заявки ({leads.length})</button>
                {/* Updated Visitors Button Label */}
                <button onClick={() => handleTabChange('visitors')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'visitors' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>
                    Посетители <span className="opacity-70 text-[8px] ml-1">({dailyVisitorsCount}/{visitors.length})</span>
                </button>
            </div>

            <div className="w-full flex-grow overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                        {activeTab === 'leads' ? 'ВХОДЯЩИЕ ЛИДЫ' : activeTab === 'visitors' ? `ТРАФИК (СЕГОДНЯ: ${dailyVisitorsCount})` : 'ОТЧЕТЫ СИСТЕМЫ'}
                    </p>
                    {(activeTab === 'leads' || activeTab === 'stats') && (
                        <button onClick={() => { haptic('warning'); onClearLeads(); }} className="text-[9px] text-red-500 uppercase font-bold hover:text-red-400 flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> {activeTab === 'stats' ? 'СБРОСИТЬ ВСЁ' : 'ОЧИСТИТЬ'}
                        </button>
                    )}
                </div>
                
                <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 pb-20">
                    
                    {/* STATS TAB (NEW) */}
                    {activeTab === 'stats' && <AnalyticsChart leads={leads} />}

                    {/* LEADS TAB */}
                    {activeTab === 'leads' && (
                        leads.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                                <Database className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Нет новых заявок</p>
                            </div>
                        ) : (
                            leads.map((lead) => (
                                <div key={lead.id} className="glass-card p-3 rounded-lg border border-zinc-800 flex items-center justify-between group hover:border-[#00FF9D]/30 transition-all">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div>
                                            <p className="text-xs font-bold text-white font-mono">{lead.name}</p>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono">{lead.contact}</p>
                                        <p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-wider">{lead.type}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[9px] text-zinc-500 font-mono">{lead.time}</p>
                                            <a href={`https://t.me/${lead.contact.replace('@', '')}`} target="_blank" rel="noreferrer" className="mt-2 inline-block bg-[#00FF9D]/10 text-[#00FF9D] text-[8px] font-bold px-2 py-1 rounded border border-[#00FF9D]/20 hover:bg-[#00FF9D]/20">
                                                НАПИСАТЬ
                                            </a>
                                        </div>
                                        <button onClick={() => handleEditClick(lead, 'leads')} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {/* VISITORS TAB */}
                    {activeTab === 'visitors' && (
                        visitors.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                                <Activity className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Загрузка трафика...</p>
                            </div>
                        ) : (
                            visitors.map((user) => (
                                <div key={user.id} className="glass-card p-3 rounded-lg border border-zinc-800 flex items-center justify-between group hover:bg-[#00FF9D]/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#00FF9D] border border-zinc-700">
                                            {user.userName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white font-mono">{user.userName}</p>
                                            <p className="text-[9px] text-zinc-500 font-mono">ID: {user.chatId}</p>
                                            {user.notes && <p className="text-[8px] text-[#00FF9D] mt-1 bg-[#00FF9D]/10 px-1 rounded inline-block">{user.notes}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 mb-1">
                                                <div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse shadow-[0_0_5px_#00FF9D]"></div>
                                                <span className="text-[9px] text-[#00FF9D] font-bold uppercase">ONLINE</span>
                                            </div>
                                            <p className="text-[8px] text-zinc-600 font-mono">
                                                {user.lastActive?.toDate ? user.lastActive.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Сейчас'}
                                            </p>
                                        </div>
                                        <button onClick={() => handleEditClick(user, 'visitors')} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingItem && (
                <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="w-full max-w-sm bg-[#0F0F0F] border border-[#00FF9D]/30 p-6 rounded-2xl shadow-2xl relative">
                        <button 
                            onClick={() => setEditingItem(null)} 
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-[#00FF9D]" /> 
                            Редактирование
                        </h3>
                        
                        <form onSubmit={handleSave} className="space-y-3">
                            {editCollection === 'leads' ? (
                                <>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Имя</label>
                                        <input name="name" defaultValue={editingItem.name} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Контакт</label>
                                        <input name="contact" defaultValue={editingItem.contact} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Услуга</label>
                                        <input name="type" defaultValue={editingItem.type} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <p className="text-[10px] text-zinc-400">ID: {editingItem.chatId}</p>
                                        <p className="text-[10px] text-zinc-400">Name: {editingItem.userName}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Заметки о клиенте</label>
                                        <textarea name="notes" defaultValue={editingItem.notes || ''} placeholder="Например: интересовался обучением..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none h-20 resize-none" />
                                    </div>
                                </>
                            )}
                            
                            <button type="submit" className="w-full bg-[#00FF9D] hover:bg-[#00FF9D]/90 text-black font-bold uppercase text-xs py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Сохранить
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
  useEffect(() => { console.log("Taipan Media App Initialized"); }, []);
  const [currentView, setCurrentView] = useState('role_selection'); 
  // Добавляем состояние для хранения предыдущего экрана
  const [previousView, setPreviousView] = useState('role_selection');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  
  // Admin & Leads State
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [leads, setLeads] = useState([]); 

  // --- REAL VISITORS STATE ---
  const [visitors, setVisitors] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // State for Bane Intro
  const [baneIntroActive, setBaneIntroActive] = useState(false);
  // State for image preview modal
  const [previewImage, setPreviewImage] = useState(null);
  // --- User State ---
  const [userName, setUserName] = useState('AGENT');
  const [userRole, setUserRole] = useState('business'); 
  const [currentUserId, setCurrentUserId] = useState(null); 
  const [spotsLeft, setSpotsLeft] = useState(4);

  // New State for Academy Calculator (Lifted Up)
  const [academyCalcData, setAcademyCalcData] = useState({ salary: 300000, days: 22, hours: 8 });
  const [isStudent, setIsStudent] = useState(false); // New State for student status

  // Calculate current hourly rate (derived state)
  const totalHours = Math.max(1, academyCalcData.days * academyCalcData.hours);
  const currentHourlyRate = Math.floor(academyCalcData.salary / totalHours);
  const animatedHourlyRate = useOdometer(currentHourlyRate);

  // --- TELEGRAM MAIN BUTTON INTEGRATION (FOR MODAL) ---
  useEffect(() => {
    if (!tg) return;
    const mainBtn = tg.MainButton;

    if (isModalOpen) {
      mainBtn.setText("СВЯЗАТЬСЯ СО МНОЙ");
      mainBtn.setTextColor("#000000");
      mainBtn.setColor("#00FF9D");
      mainBtn.show();

      const handleMainBtnClick = () => {
        // Find form and submit it programmatically
        const form = document.getElementById('contactForm');
        if (form) form.requestSubmit();
        haptic('heavy');
      };

      mainBtn.onClick(handleMainBtnClick);
      return () => {
        mainBtn.offClick(handleMainBtnClick);
        mainBtn.hide();
      };
    } else {
      mainBtn.hide();
    }
  }, [isModalOpen]);

  // --- FIREBASE AUTH LISTENER ---
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          setFirebaseUser(user);
      });
      return () => unsubscribe();
  }, []);

  // --- FIREBASE TRACKING EFFECT ---
  useEffect(() => {
    const initApp = async () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand(); 
            const user = tg.initDataUnsafe?.user;
            if (user?.first_name) {
                setUserName(user.first_name.toUpperCase());
            }
            if (user?.id) {
                setCurrentUserId(user.id); 
                try {
                    await signInAnonymously(auth);
                    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', user.id.toString());
                    await setDoc(userRef, {
                        chatId: user.id,
                        userName: user.first_name || 'Агент',
                        lastActive: serverTimestamp(),
                        notified: false 
                    }, { merge: true });
                    console.log("📡 СВЯЗЬ С ТЕРМИНАЛОМ УСТАНОВЛЕНА");
                } catch (e) {
                    console.error("Ошибка синхронизации с базой:", e);
                }
            }
        }
    };
    initApp();
    const timer = setTimeout(() => {
        setSpotsLeft(prev => prev > 2 ? prev - 1 : prev);
    }, 15000); 
    return () => clearTimeout(timer);
  }, []);

  // --- PRELOAD KASPI CAROUSEL IMAGES ---
  useEffect(() => {
      const images = [
        "https://i.ibb.co.com/Fp52kXy/666.png", 
        "https://i.ibb.co.com/9H5ZxPfy/555.png",
        "https://i.ibb.co.com/bjV5YtR2/444.png", 
        "https://i.ibb.co.com/Q3k778bd/333.png",
        "https://i.ibb.co.com/M5tCqhDs/222.png", 
        "https://i.ibb.co.com/BV1gXyf7/111.png"
      ];
      // Keep references to prevent GC
      window.preloadedKaspiImages = images.map(src => {
          const img = new Image();
          img.src = src;
          return img;
      });
  }, []);

  // --- FETCH REAL VISITORS FOR ADMIN ---
  useEffect(() => {
      if (currentView === 'admin' && firebaseUser) {
          const usersCollection = collection(db, 'artifacts', appId, 'public', 'data', 'app_visitors');
          const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
              const usersData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              }));
              
              usersData.sort((a, b) => {
                    const timeA = a.lastActive?.toMillis ? a.lastActive.toMillis() : 0;
                    const timeB = b.lastActive?.toMillis ? b.lastActive.toMillis() : 0;
                    return timeB - timeA;
              });

              setVisitors(usersData.slice(0, 50)); 
          }, (error) => {
              console.error("Admin fetch error:", error);
          });
          return () => unsubscribe();
      }
  }, [currentView, firebaseUser]);

  // --- UPDATE FUNCTIONS ---
  const updateLead = (id, newData) => {
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...newData } : lead));
  };

  const updateVisitor = async (id, newData) => {
      try {
          const visitorRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', id);
          await updateDoc(visitorRef, newData);
          console.log("Visitor updated successfully");
      } catch (e) {
          console.error("Error updating visitor:", e);
      }
  };

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 16)); 
    const interval = setInterval(() => { setOnlineCount(Math.floor(Math.random() * 16)); }, 60000); 
    return () => clearInterval(interval);
  }, []);
  
  const [calcData, setCalcData] = useState({ traffic: 0, conversion: 0, avgCheck: 0, margin: 0 });
  const calculateProfit = () => {
      const sales = Math.floor(calcData.traffic * (calcData.conversion / 100));
      const revenue = sales * calcData.avgCheck; // Correctly referencing calcData
      return Math.floor(revenue * (calcData.margin / 100));
  };
  const [shopIntroFinished, setShopIntroFinished] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const slides = [BrandLogos.Bitcoin, BrandLogos.Instagram, BrandLogos.Marketplaces, BrandLogos.Telegram];

  useEffect(() => {
    if (currentView === 'education') {
      const timer = setInterval(() => { setActiveSlide((prev) => (prev + 1) % slides.length); }, 4500);
      return () => clearInterval(timer);
    }
  }, [currentView]);
    
  const canvasRef = useRef(null);
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
      columns = Math.floor(width / 25);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00FF9D';
      ctx.font = '14px monospace'; 
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    initMatrix();
    const interval = setInterval(drawMatrix, 75);
    const handleResize = () => { if (window.innerWidth !== width) initMatrix(); };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  const openModal = (type) => { 
    haptic('light');
    setModalType(type); 
    setIsModalOpen(true); 
  };
  const closeModal = () => {
    haptic('light');
    setIsModalOpen(false);
  };
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    notify('success');

    const name = e.target[0].value;
    const contact = e.target[1].value;

    const newLead = {
        id: Date.now(), 
        name: name,
        contact: contact,
        type: modalType,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setLeads(prev => [newLead, ...prev]);

    closeModal(); 
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000); 
    e.target.reset(); 
  };
  const handleFaqClick = (item) => { haptic('light'); setActiveFaq(item); setShowCalculator(false); };
  const closeFaq = () => { haptic('light'); setActiveFaq(null); setShowCalculator(false); };
  const handleShopClick = () => { 
      haptic('medium');
      setShopIntroFinished(false); 
      setCurrentView('shop'); 
  };
  const handleEducationClick = () => {
    haptic('medium');
    setCurrentView('education');
  }
  const handleStrategyClick = () => {
       haptic('light');
       setCurrentView('strategy');
  };
  const handleBackClick = (target) => {
    haptic('light');
    setCurrentView(target);
  }
  const handleAboutClick = () => {
       haptic('medium');
       setBaneIntroActive(true);
  }
  const handleBaneIntroComplete = () => {
       setBaneIntroActive(false);
       setCurrentView('about');
  }

  // --- Admin Logic ---
  const handleTitleClick = () => {
      setTapCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
              haptic('warning');
              setIsAdminAuthOpen(true);
              return 0;
          }
          haptic('light');
          return newCount;
      });
  };

  const handleAdminAuth = (e) => {
      e.preventDefault();
      const code = e.target[0].value;
      if (code === 'admin') {
          haptic('success');
          setIsAdminAuthOpen(false);
          setCurrentView('admin');
      } else {
          haptic('error');
          alert("ACCESS DENIED");
      }
  };

  const faqItems = [
    { id: 'stats', question: "Это вообще покупают?", icon: <TrendingUp className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><WordstatGraph /><h3 className="text-white font-bold mb-3 uppercase tracking-wide text-sm font-['Chakra_Petch'] leading-tight">6 650 человек ищут тебя. Как долго ты будешь их игнорировать?</h3><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4">Это официальная статистика Яндекса: <span className="text-[#00FF9D] font-bold">6 650</span> прямых запросов на ТГ-магазины в месяц.<br/><br/>Пока ты ищешь «подходящий момент», наши ученики уже забирают эти чеки по <span className="text-white font-bold">100 000₸</span>, просто потому что они оказались на связи.<br/><br/>Мы даем тебе все инструменты и доступ к этому потоку. Твой результат — это просто вопрос того, возьмешь ли ты готовую систему и начнешь ли по ней работать.<br/><br/><span className="text-[#00FF9D] italic font-medium">Рынок платит тем, кто действует, а не тем, кто наблюдает.</span></p></div>) },
    { id: 'proof', question: "А это реально работает?", icon: <Lock className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><HackerProof /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-2">Пока ты сомневаешься, <span className="text-[#00FF9D] font-bold">Карашаш</span> прошла наше обучение и уже забирает свои <span className="text-white font-bold">100 000₸</span>.<br/><br/>На скриншоте — результат её работы. Она просто взяла знания, которые мы даём, и закрыла одного из <span className="text-[#00FF9D] font-bold">6 650</span> горячих клиентов в Яндексе. Ей не нужен был «подходящий момент», ей нужна была рабочая система.<br/><br/><span className="text-white italic">Рынок пустой. Деньги на столе. Ты следующий или так и будешь смотреть на чужие чеки?</span></p></div>) },
    { id: 'difficulty', question: "А сложно это делать?", icon: <Zap className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><SkillScanner /> <SetupTimeline /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4"><span className="text-white font-bold">Программистом быть не нужно.</span><br/><br/>Собрать такой магазин проще, чем выложить пост в Инстаграм. Мы даем всё готовое: ты просто расставляешь блоки по местам за один вечер.<br/><br/><span className="text-[#00FF9D] font-bold">Работай с телефона:</span> Не нужен компьютер, всё настраивается прямо в смартфоне.<br/><br/><span className="text-[#00FF9D] font-bold">Для декрета или совмещения:</span> Занимайся этим, пока ребенок спит или после основной работы.<br/><br/><span className="text-[#00FF9D] font-bold">Просто и понятно:</span> Если умеешь переписываться в Telegram — ты справишься.<br/><br/><span className="text-white font-bold italic">Хватит смотреть на чужие чеки. Заходи и делай свои.</span></p></div>) },
    { id: 'calc', question: "Найду ли я клиентов?", icon: <Wallet className="w-5 h-5 text-[#00FF9D]" />, isCalc: true, component: (<div className="w-full"><ClientDemandProof /><div className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4"><p><span className="text-white font-bold">Ты не просто их найдешь — они тоже будут тебя искать.</span></p><br/><p>Статистика Яндекса не врет: каждый месяц <span className="text-[#00FF9D] font-bold">6 650</span> предпринимателей ищут, кто сделает им магазин в Telegram. Спрос огромный, а тех, кто умеет делать это качественно — единицы.</p><br/><p>На обучении мы даем не только технические навыки, но и <span className="text-white font-bold">полную систему продаж</span>:</p><br/><ul className="list-disc pl-4 space-y-2"><li><span className="text-[#00FF9D] font-bold">Где брать клиентов:</span> Покажем, как выйти на те самые тысячи заказов.</li><li><span className="text-[#00FF9D] font-bold">Как продавать:</span> Научим вести переговоры с бизнесменами и закрывать сделки на высокие чеки.</li><li><span className="text-[#00FF9D] font-bold">Готовые шаблоны предложений:</span> Тебе не нужно ничего придумывать — просто бери наше проверенное КП и отправляй клиенту.</li></ul><br/><p>Мы научим тебя делать результат «под ключ», чтобы ты мог уверенно забирать свои <span className="text-white font-bold">100 000₸</span> за проект.</p></div></div>) }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      <GlobalStyles />
      {/* Bane Intro Overlay */}
      {baneIntroActive && <BaneIntro onComplete={handleBaneIntroComplete} />}
      
      {/* MATRIX BACKGROUND COMPONENT (FIXED z-index and position) */}
      <MatrixBackground />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF9D]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 opacity-20 -z-10" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-5 pb-20">
        
        {currentView === 'role_selection' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center justify-center h-full w-full px-4 pt-5 pb-20">
              <div className="text-center mb-12">
                  {/* GLOWING TITLE */}
                  <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px #00FF9D', color: '#ffffff' }}>
                    <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
                  </h1>
                  
                  <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#00FF9D]"></div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Выберите цель</p>
                      <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#00FF9D]"></div>
                  </div>
              </div>
              
              <div className="w-full space-y-4 mb-8 flex flex-col items-center">
                  {/* BUSINESS CARD */}
                  <div onClick={() => { setUserRole('business'); setCurrentView('main'); haptic('medium'); }} className="group relative w-10/12 max-w-[280px] bg-zinc-900/60 backdrop-blur-xl border border-[#00FF9D]/20 p-1 rounded-3xl overflow-hidden transition-all duration-300 hover:border-[#00FF9D] hover:shadow-[0_0_30px_rgba(0,255,157,0.15)] active:scale-[0.98] cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00FF9D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex flex-col items-center justify-center bg-[#050505]/50 rounded-[20px] p-5 h-full text-center">
                          <div className="w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-[#00FF9D]/20 to-black border border-[#00FF9D]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.1)] group-hover:scale-110 transition-transform duration-300">
                               <TelegramLogoMain className="w-7 h-7 text-[#00FF9D] drop-shadow-[0_0_5px_rgba(0,255,157,0.8)]" />
                          </div>
                          
                          <h3 className="text-lg font-black font-['Chakra_Petch'] uppercase tracking-wider text-white group-hover:text-[#00FF9D] transition-colors mb-1">ДЛЯ БИЗНЕСА</h3>
                          <p className="text-[9px] text-zinc-400 font-mono tracking-wide group-hover:text-zinc-300">Заказать разработку</p>
                      </div>
                  </div>

                  {/* ACADEMY CARD */}
                  <div onClick={() => { 
                      setUserRole('academy'); 
                      setPreviousView('role_selection'); // Запоминаем, что пришли с выбора роли
                      setCurrentView('education'); 
                      haptic('medium'); 
                  }} className="group relative w-10/12 max-w-[280px] bg-zinc-900/60 backdrop-blur-xl border border-blue-500/20 p-1 rounded-3xl overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] active:scale-[0.98] cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex flex-col items-center justify-center bg-[#050505]/50 rounded-[20px] p-5 h-full text-center">
                          <div className="w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-blue-500/20 to-black border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-110 transition-transform duration-300">
                               <GraduationCap className="w-7 h-7 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                          </div>
                          
                          <h3 className="text-lg font-black font-['Chakra_Petch'] uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors mb-1 leading-tight">НАЧАТЬ<br/>ЗАРАБАТЫВАТЬ</h3>
                      </div>
                  </div>
              </div>
              
              {/* PARTNERS */}
              <PartnersCredits />
              
              <div className="mt-auto pt-4 opacity-50 text-[8px] text-zinc-600 uppercase tracking-widest text-center">
                  Taipan Media © 2026
              </div>
          </div>
        )}
        
        {/* ... (Rest of the component remains exactly the same: main, shop, calculator, etc.) ... */}
        {currentView === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center w-full">
            <div className="mb-14 w-full text-center" onClick={handleTitleClick}>
              <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center select-none cursor-pointer active:scale-95 transition-transform" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)', color: '#ffffff' }}>
                <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
              </h1>
              
              <div className="flex items-center justify-center gap-2 mt-3 w-full">
                <div className={`h-1.5 w-1.5 rounded-full ${userRole === 'business' ? 'bg-[#00FF9D] shadow-[0_0_5px_#00FF9D]' : 'bg-blue-500 shadow-[0_0_5px_#3B82F6]'} animate-pulse`}></div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] mr-[-0.4em] font-bold">РЕЖИМ: <span className={userRole === 'business' ? 'text-[#00FF9D]' : 'text-blue-500'}>{userRole === 'business' ? 'БИЗНЕС' : 'АКАДЕМИЯ'}</span></p>
              </div>

              <div className="flex items-center justify-center gap-4 mt-2 w-full">
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-700"></div>
                {/* --- DYNAMIC GREETING --- */}
                <p className="text-[10px] uppercase tracking-[0.6em] mr-[-0.6em] text-white font-bold whitespace-nowrap opacity-60">
                  ПРИВЕТ, {userName}
                </p>
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>
            </div>
            
            {/* SEGMENTED CONTENT */}
            <div className="w-full space-y-3">
                {userRole === 'business' ? (
                    <>
                        <div onClick={handleShopClick} className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-[#00FF9D]/40 hover:bg-[#00FF9D]/10 transition-all text-center relative overflow-hidden group mb-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/10 to-transparent opacity-50"></div>
                            <TelegramLogoMain className="w-8 h-8 text-[#00FF9D] mb-1.5 relative z-10" />
                            <span className="text-base font-bold text-white relative z-10 font-['Chakra_Petch'] tracking-wider">ТЕЛЕГРАМ МАГАЗИН</span>
                            <p className="text-[9px] text-zinc-400 relative z-10 uppercase tracking-widest mt-0.5">Заказать разработку под ключ</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div onClick={() => setCurrentView('calculator')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <Wallet className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">ROI</span>
                            </div>
                            <div onClick={() => openModal('Mini App')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <Code className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">Mini App</span>
                            </div>
                            <div onClick={() => setCurrentView('strategy')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <TrendingUp className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">Кейсы</span>
                            </div>
                        </div>

                        {/* NEW: Personal Cabinet Button for Business */}
                        <div onClick={() => setCurrentView('strategy')} className="glass-card p-4 rounded-2xl flex items-center justify-between cursor-pointer border-white/5 hover:border-[#00FF9D]/30 hover:bg-[#00FF9D]/5 transition-all group mt-2">
                             <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-zinc-800/50 border border-white/10 group-hover:border-[#00FF9D]/30 transition-colors">
                                    <Users className="w-5 h-5 text-zinc-400 group-hover:text-[#00FF9D] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors font-['Chakra_Petch'] tracking-wider">ЛИЧНЫЙ КАБИНЕТ</h4>
                                    <p className="text-[9px] text-zinc-500 font-mono">Статус заказов и профиль</p>
                                </div>
                             </div>
                             <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                    </>
                ) : (
                    // === ACADEMY ROLE ===
                    // Hero Button (Education)
                    <div className="w-full space-y-3">
                         {/* Hero Button - Compact Version */}
                        <div onClick={() => setCurrentView('program')} className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-[#00FF9D]/40 hover:bg-[#00FF9D]/10 transition-all text-center relative overflow-hidden group mb-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/10 to-transparent opacity-50"></div>
                            <GraduationCap className="w-8 h-8 text-[#00FF9D] mb-1.5 relative z-10" />
                            <span className="text-base font-bold text-white relative z-10 font-['Chakra_Petch'] tracking-wider">НАЧАТЬ ОБУЧЕНИЕ</span>
                            <p className="text-[9px] text-zinc-400 relative z-10 uppercase tracking-widest mt-0.5">Пошаговая программа выхода на доход</p>
                        </div>

                        {/* Secondary Buttons Grid - Larger Version */}
                        <div className="grid grid-cols-3 gap-2">
                             <div onClick={() => setCurrentView('strategy')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <Users className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">Кабинет</span>
                            </div>
                            <div onClick={() => setCurrentView('calculator')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <Wallet className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">Доход</span>
                            </div>
                            <div onClick={() => setCurrentView('faq')} className="glass-card p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF9D]/30 transition-all h-28 group">
                                <Lock className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] mb-3 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-300 text-center leading-tight uppercase tracking-wider">FAQ</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- SWITCHER FOOTER --- */}
            <div className="w-full mt-12 pt-6 border-t border-zinc-900 flex flex-col items-center gap-6">
                <button 
                    onClick={() => { haptic('light'); setCurrentView('role_selection'); }}
                    className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] hover:text-[#00FF9D] transition-colors border border-zinc-800 px-6 py-3 rounded-full hover:border-[#00FF9D]/30 active:scale-95"
                >
                    Сменить направление
                </button>
                
                <div className="flex gap-8 opacity-40">
                    <div onClick={handleAboutClick} className="uppercase text-[9px] tracking-widest cursor-pointer hover:text-white transition-colors">О нас</div>
                    <div onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="uppercase text-[9px] tracking-widest cursor-pointer hover:text-[#00FF9D] transition-colors">Контакт</div>
                </div>
            </div>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            {!shopIntroFinished ? (
               <ShopIntroSequence onComplete={() => setShopIntroFinished(true)} />
            ) : (
              <React.Fragment>
                <button onClick={() => handleBackClick('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
                <div className="flex-grow flex flex-col items-center w-full space-y-6 animate-in slide-in-from-bottom duration-700">
                  <div className="text-center px-4 w-full mb-4">
                      <TelegramLogoMain className="w-20 h-20 mx-auto text-[#00FF9D] mb-4 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-[contourPulse_3s_ease-in-out_infinite]" />
                      <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch'] leading-none">TELEGRAM<br/><span className="text-[#00FF9D]">STORE</span></h2>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Ваш бизнес ещё никогда не был так близок к покупателю</p>
                  </div>
                  <div className="w-full space-y-3">
                      {[{ title: "Каталог и Корзина", desc: "Полноценный интернет-магазин внутри мессенджера. Удобный выбор товаров без лишних переходов." }, { title: "Оплата в 1 клик", desc: "Интеграция с Kaspi, картами и криптовалютой. Мгновенные транзакции." }, { title: "CRM Система", desc: "Управление заказами, статусами и клиентами прямо внутри Telegram." }, { title: "Авто-рассылки", desc: "Push-уведомления клиентам о новинках и акциях с открываемостью 90%." }].map((item, i) => (
                        <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition-all">
                           <div className="mt-1 bg-[#00FF9D]/10 p-2 rounded-full text-[#00FF9D] border border-[#00FF9D]/20"><CheckCircle2 className="w-4 h-4" /></div>
                           <div><h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h4><p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p></div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00FF9D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <button onClick={() => {
                          setCurrentView('calculator');
                      }} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs relative z-10 flex items-center justify-center gap-2 animate-pulse">РАССЧИТАТЬ УПУЩЕННУЮ ПРИБЫЛЬ</button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            {/* Logic for Back Button: Return to Main if Academy, else go back to Shop or Main based on context */}
            <button onClick={() => handleBackClick(userRole === 'academy' ? 'main' : 'shop')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-2 animate-in slide-in-from-bottom duration-700">
                {userRole === 'business' ? (
                    <div className="text-center px-4 w-full mb-2">
                        <Wallet className="w-12 h-12 mx-auto text-[#00FF9D] mb-2 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-[contourPulse_3s_ease-in-out_infinite]" />
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">ВАША <span className="text-[#00FF9D]">ПРИБЫЛЬ</span></h2>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Узнайте сколько вы теряете</p>
                    </div>
                ) : (
                    <div className="text-center px-4 w-full mb-2">
                        <Wallet className="w-12 h-12 mx-auto text-[#00FF9D] mb-2 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-[contourPulse_3s_ease-in-out_infinite]" />
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">ЧАС НА <span className="text-[#00FF9D]">МИЛЛИОН</span></h2>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Узнай реальную цену своего времени</p>
                    </div>
                )}
                
                <div className="w-full glass-card p-4 rounded-3xl border border-[#00FF9D]/20 relative overflow-hidden">
                    {userRole === 'business' ? (
                        <ProfitCalculator data={calcData} setData={setCalcData} onAction={() => {
                            setCurrentView('strategy');
                        }} />
                    ) : (
                        <AcademyCalculator data={academyCalcData} setData={setAcademyCalcData} onAction={() => setCurrentView('strategy')} />
                    )}
                </div>
            </div>
          </div>
        )}

        {currentView === 'strategy' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
             <button onClick={() => handleBackClick(userRole === 'academy' ? 'main' : 'calculator')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
             <div className="flex-grow flex flex-col items-center w-full space-y-6 overflow-y-auto pb-20 no-scrollbar">
                
                {/* NEW PERSONAL CABINET HEADER FOR ACADEMY */}
                {userRole === 'academy' && (
                    <div className="w-full space-y-3 animate-in slide-in-from-bottom duration-500">
                        {/* 1. Profile Card (As per screenshot) */}
                        <div className="strategy-card flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center text-zinc-400 font-black text-sm border border-zinc-700 cursor-pointer" onClick={() => setIsAdminAuthOpen(true)}>
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-wider leading-none">{userName}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isStudent ? 'bg-[#00FF9D]' : 'bg-zinc-600'}`}></div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isStudent ? 'text-[#00FF9D]' : 'text-zinc-500'}`}>
                                            {isStudent ? 'АКТИВНЫЙ СТУДЕНТ' : 'ГОСТЬ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {!isStudent && (
                                <button 
                                    onClick={() => window.open('https://t.me/taipanmedia', '_blank')}
                                    className="text-[10px] font-bold border border-zinc-700 px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                                >
                                    НАЧАТЬ
                                </button>
                            )}
                        </div>

                        {/* 2. Finance Card (As per screenshot) */}
                        <div className="strategy-card relative">
                            <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-4">ТЕКУЩАЯ СТОИМОСТЬ ЧАСА</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <div className="text-5xl font-black text-white font-['Chakra_Petch'] tracking-tighter">
                                    {currentHourlyRate.toLocaleString().replace(/\s/g, ' ')}
                                </div>
                                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">₸ / час</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setCurrentView('calculator')}
                                    className="flex items-center gap-2 bg-[#1c1c1e] hover:bg-[#252525] px-3 py-2 rounded-lg text-[10px] text-zinc-400 border border-zinc-800 transition-all"
                                >
                                    <Edit2 className="w-3 h-3" /> 
                                    <span className="font-bold">Пересчитать</span>
                                </button>
                                <span className="text-[9px] text-zinc-600 font-mono">Обновлено: только что</span>
                            </div>
                            
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                                <Wallet className="w-24 h-24 text-white stroke-1" />
                            </div>
                        </div>

                        {/* 3. Partner Program (As per screenshot) */}
                        <div className="strategy-card relative overflow-hidden" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">ПАРТНЕРСКАЯ ПРОГРАММА</h3>
                                    <p className="text-[10px] text-zinc-400 leading-snug max-w-[200px]">
                                        Ваш бонус: <span className="text-[#a855f7] font-bold">10% (5 000 ₸)</span> с каждой оплаты привлеченного ученика.
                                    </p>
                                </div>
                                <div className="bg-[#1a1625] border border-purple-500/20 rounded-lg p-2 text-center min-w-[70px]">
                                    <div className="text-lg font-black text-white font-mono leading-none mb-1">0</div>
                                    <div className="text-[7px] text-[#a855f7] font-bold uppercase tracking-wider">ПАРТНЕРОВ</div>
                                </div>
                            </div>

                            {/* Input Field */}
                            <div className="flex items-center gap-2 bg-[#121212] border border-zinc-800 p-2 rounded-xl mb-3 relative z-10">
                                <div className="flex-grow text-[10px] text-zinc-500 font-mono px-2 truncate select-all">
                                    t.me/taipan_bot?start={currentUserId || 'id'}
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`https://t.me/taipan_bot?start=${currentUserId}`);
                                        notify('success');
                                    }}
                                    className="bg-[#1c1c1e] hover:bg-[#252525] p-2 rounded-lg text-zinc-400 transition-colors border border-zinc-700"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-center text-[9px] text-zinc-600 font-mono">Используйте эту ссылку для приглашения</p>
                        </div>
                    </div>
                )}

                {/* EXISTING CASES CONTENT (ONLY FOR BUSINESS ROLE) */}
                {userRole !== 'academy' && (
                    <>
                        <div className="text-center px-4 w-full">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">КЕЙСЫ <span className="text-[#00FF9D]">ПАРТНЕРОВ</span></h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Реальные магазины на платформе</p>
                        </div>
                        <div className="w-full mb-4 flex flex-col items-center">
                            <div className="w-2/3 max-w-[200px]"><SmartImage src="https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg" className="rounded-[20px] w-full h-auto object-contain" alt="Fashion Store Case" /></div>
                            <div className="w-full mt-4 px-2 text-center"><h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">КЕЙС «КАСТРЮЛЬКА ЕДЫ»</h3><p className="text-[10px] text-zinc-400 leading-relaxed">Пока другие тратят бюджет на рекламу, мы включили продажи по расписанию. Пуш в 18:00 на пустой желудок принес <span className="text-[#00FF9D] font-bold">+43% к чекам</span>. Мы превратили хаотичные заказы в предсказуемый алгоритм. Taipan Media заставляет технологии работать на ваших инстинктах.</p></div>
                        </div>
                        <div className="w-full mb-4 flex flex-col items-center">
                            <div className="w-2/3 max-w-[200px]"><SmartImage src="https://i.ibb.co.com/ks9Sz9zz/5438294939344244554.jpg" className="rounded-[20px] w-full h-auto object-contain" alt="Romantic Store Case" /></div>
                            <div className="w-full mt-4 px-2 text-center"><h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">КЕЙС «ROMANTIC»</h3><p className="text-[10px] text-zinc-400 leading-relaxed">Мы внедрили ИИ-алгоритмы, которые анализируют поведение ваших покупателей и допродают товар в момент пикового интереса, показывая, что с этим товаром обычно покупают другие. Результат: <span className="text-[#00FF9D] font-bold">+57% к чеку</span> за счет маржинальных допов. Мы не ждем желания клиента — Taipan Media создает его через алгоритмы.</p></div>
                        </div>
                        <div className="w-full pt-4 pb-8">
                            <button onClick={() => setCurrentView('roi')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse">УЗНАТЬ СТОИМОСТЬ И СРОКИ</button>
                            <p className="text-center text-[9px] text-zinc-600 mt-3">Оставьте заявку для бесплатной консультации</p>
                        </div>
                    </>
                )}
             </div>
          </div>
        )}

        {/* VIEW: ROI VIEW (Kept as is) */}
        {currentView === 'roi' && (
           <RoiView profit={calculateProfit()} onBack={() => handleBackClick('strategy')} onAction={() => openModal('Start Project')} />
        )}

        {/* VIEW: EDUCATION (Kept as is) */}
        {currentView === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            {/* Используем previousView для кнопки Назад */}
            <button onClick={() => handleBackClick(previousView)} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center justify-center space-y-10 w-full">
              <div className="text-center px-4 w-full mb-10"><h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch']">Упущенные<br/><span className="text-[#00FF9D]">Возможности</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">История твоих сомнений</p></div>
              <div className="relative w-full h-[280px] flex items-center justify-center">
                  <div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden">
                    {slides.map((SlideComponent, idx) => (
                       <div key={idx} className={`absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out transform ${activeSlide === idx ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-3xl'}`}>
                         <div className="relative w-full text-center">
                            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full transform scale-150 left-1/2 -translate-x-1/2" />
                            <div className="relative z-10"><SlideComponent isActive={activeSlide === idx} /></div>
                         </div>
                       </div>
                     ))}
                  </div>
              </div>
              <div className="text-center w-full px-6 flex justify-center mb-8"><p className="text-zinc-500 text-[12px] font-bold uppercase tracking-widest mr-[-0.1em] animate-pulse whitespace-nowrap">Не стань историей упущенных шансов</p></div>
            </div>
            {/* Кнопка ведет в главное меню (main), а не в FAQ */}
            <button onClick={() => setCurrentView('main')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 text-xs">Стань тем кто успел</button>
          </div>
        )}

        {/* VIEW: FAQ (Kept as is) */}
        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleBackClick(userRole === 'academy' ? 'main' : 'education')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              <div className="w-full mb-6"><Carousel3D /><div className="text-center mt-2"></div></div>
              <div className="w-full space-y-4">
                {faqItems.map((item) => (
                  <div key={item.id} onClick={() => handleFaqClick(item)} className="glass-card rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 hover:border-[#00FF9D]/30 transition-all">
                    <div className="flex items-center gap-4"><div className="bg-[#00FF9D]/10 p-2 rounded-full border border-[#00FF9D]/20">{item.icon}</div><h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors">{item.question}</h4></div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF9D] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setCurrentView('program')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 text-xs">Смотреть программу</button>
          </div>
        )}

        {/* VIEW: PROGRAM (Kept as is) */}
        {currentView === 'program' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleBackClick(userRole === 'academy' ? 'main' : 'faq')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              <div className="flex flex-col items-center text-center px-4 w-full mb-6 mx-auto max-w-sm"><h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase mb-2 font-['Chakra_Petch'] leading-tight">Модули обучения<br/><span className="text-[#00FF9D]">TAIPAN ACADEMY</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Система доминирования</p></div>
              
              <div className="w-full space-y-3">
                {[{ title: "Модуль 1: Быстрый старт", subtitle: "Запуск системы", desc: "Регистрируем бота и получаем API ключ. Пара кликов — и движок твоего будущего магазина официально запущен.", easy: "Никакого кода, только стандартные настройки Telegram за 2 минуты.", locked: false }, { title: "Модуль 2: Красивая витрина", subtitle: "Наполнение", desc: "Загружаем товары, создаем категории и описание. Твой бот превращается в профессиональный онлайн-маркет.", easy: "Работает как обычный альбом в соцсетях: добавил фото, поставил цену — готово.", locked: false }, { title: "Модуль 3: Автопилот", subtitle: "Платежи и доставка", desc: "Подключаем оплату (Kaspi/карты) и настраиваем доставку. Теперь магазин сам принимает заказы и деньги 24/7.", easy: "Один раз выбрал нужные галочки в настройках, и система работает без твоего участия.", locked: false }, { title: "Модуль 4: Карта прибыли", subtitle: "Где твои деньги", desc: "Покажем список ниш, где за такие магазины платят больше всего. Даем готовое предложение, которое остается только отправить.", easy: "Тебе не нужно ничего выдумывать — мы даем наводку на прибыльные места и готовый текст для сделки.", locked: false }].map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-start gap-3 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center justify-between w-full"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.locked ? 'bg-zinc-900 text-zinc-600' : 'bg-[#00FF9D]/10 text-[#00FF9D]'}`}>{item.locked ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-5 h-5" />}</div><div className="text-left"><h4 className={`text-sm font-bold uppercase tracking-wider ${item.locked ? 'text-zinc-600' : 'text-white'}`}>{item.title}</h4><p className="text-[10px] text-[#00FF9D] font-bold uppercase tracking-wider">{item.subtitle}</p></div></div></div>
                    <div className="pl-[3.5rem] w-full"><p className="text-[10px] text-zinc-400 leading-relaxed mb-3">{item.desc}</p><div className="bg-[#00FF9D]/5 border-l-2 border-[#00FF9D]/30 pl-3 py-2 rounded-r-lg"><p className="text-[8px] text-[#00FF9D] font-bold uppercase mb-0.5 tracking-widest">ПОЧЕМУ ЭТО ПРОСТО:</p><p className="text-[9px] text-zinc-500 italic leading-snug">{item.easy}</p></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20">
                <div className="mb-4 bg-red-500/10 border border-red-500/30 p-2 rounded-lg animate-pulse">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
                        🔥 Осталось мест: {spotsLeft} из 10
                    </p>
                    <p className="text-[8px] text-zinc-500 mt-1">Следующая цена: 80 000 ₸</p>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">Стоимость обучения</p>
                <div className="text-2xl font-black text-white mb-4 font-['Chakra_Petch']">
                    50 000 ₸ <span className="text-zinc-600 text-lg line-through decoration-red-600 decoration-2 ml-2">80 000 ₸</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Длительность обучения (14 дней)</p>
                <button onClick={() => {
                    window.open('https://t.me/taipanmedia', '_blank');
                }} className="block w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">Получить подробную консультацию</button>
            </div>
          </div>
        )}

        {/* VIEW: ABOUT (Kept as is) */}
        {currentView === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            <button onClick={() => handleBackClick('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
                <div className="text-center px-4 w-full mb-4">
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch'] whitespace-nowrap">КТО <span className="text-[#00FF9D]">МЫ</span></h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">И КАКОЙ У НАС ПЛАН</p>
                </div>
                
                <div className="relative w-full glass-card p-6 rounded-sm border border-[#00FF9D]/30 overflow-hidden bg-black/40 tactical-grid">
                    <div className="absolute top-0 right-0 p-2 opacity-30"><Code className="w-16 h-16 text-[#00FF9D]" /></div>
                    <div className="absolute bottom-0 left-0 p-1 opacity-50 text-[8px] font-mono text-[#00FF9D]">SYS.INIT_SEQ_2026</div>

                    <p className="text-sm font-bold text-white mb-4 relative z-10 leading-relaxed font-mono uppercase border-l-2 border-[#00FF9D] pl-3">
                        «Наш план: позволить таргету доводить каждого лида до товара, без молчания и тишины».
                    </p>
                    
                    <p className="text-[10px] text-zinc-400 leading-relaxed relative z-10 font-mono">
                        Личности не имеют значения. Значение имеет только результат.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 w-full">
                    {/* Block 1 */}
                    <div className="glass-card p-4 rounded-sm border border-zinc-800 flex items-start gap-4 hover:border-[#00FF9D]/40 transition-colors group">
                        <div className="mt-1"><Shield className="w-6 h-6 text-[#00FF9D] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_#00FF9D] transition-all" /></div>
                        <div>
                             <div className="flex items-baseline gap-2 mb-1">
                                 <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Опыт в продажах и разработках</span>
                                 <span className="text-[10px] text-[#00FF9D] font-mono">[10 ЛЕТ]</span>
                             </div>
                             <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">10 лет в продажах позволяют нам знать что хочет клиент, что ему доставляет комфорт и позволяет плавно совершать покупку.</p>
                        </div>
                    </div>
                    {/* Block 2 */}
                      <div className="glass-card p-4 rounded-sm border border-zinc-800 flex items-start gap-4 hover:border-[#00FF9D]/40 transition-colors group">
                        <div className="mt-1"><Zap className="w-6 h-6 text-[#00FF9D] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_#00FF9D] transition-all" /></div>
                        <div>
                             <div className="flex items-baseline gap-2 mb-1">
                                 <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Оперативность</span>
                                 <span className="text-[10px] text-[#00FF9D] font-mono">[ОТ 7 ДНЕЙ]</span>
                             </div>
                             <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">Мы не ведем переговоры месяцами. Мы запускаем MVP и улучшаем его под ваши запросы. Наша цель, не затягивать то, что может приносить вам доход уже завтра.</p>
                        </div>
                    </div>
                    {/* Block 3 */}
                    <div className="glass-card p-4 rounded-sm border border-zinc-800 flex items-start gap-4 hover:border-[#00FF9D]/40 transition-colors group">
                        <div className="mt-1"><GraduationCap className="w-6 h-6 text-[#00FF9D] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_#00FF9D] transition-all" /></div>
                        <div>
                             <div className="flex items-baseline gap-2 mb-1">
                                 <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">ОБУЧЕНИЕ</span>
                                 <span className="text-[10px] text-[#00FF9D] font-mono">[100%]</span>
                             </div>
                             <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">Мы не только разрабатываем телеграм-магазины, мы обучаем ваш персонал использовать его на 100%.</p>
                             <p className="text-[10px] text-zinc-400 leading-relaxed font-mono mt-2 pt-2 border-t border-zinc-800">Так же мы обучаем физ.лиц, которые хотят освоить трендовый навык, и обеспечить себе дополнительный доход с нашей командой.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4 pt-4 border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mb-2 pl-2">СТАДИИ ВНЕДРЕНИЯ</p>
                    <div className="relative pl-6 border-l border-[#00FF9D]/30 ml-2 space-y-6">
                        {/* Stage 1 */}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-0 w-3 h-3 bg-[#050505] border border-[#00FF9D] rounded-full"></div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">01 // АНАЛИЗ ЦЕЛИ</h4>
                            <p className="text-[10px] text-zinc-500 font-mono">Детальный разбор вашего продукта и аудитории.</p>
                        </div>
                         {/* Stage 2 */}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-0 w-3 h-3 bg-[#050505] border border-[#00FF9D] rounded-full"></div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">02 // СБОРКА АРСЕНАЛА</h4>
                            <p className="text-[10px] text-zinc-500 font-mono">Проектирование Mini App с учетом психологии захвата внимания покупателя.</p>
                        </div>
                         {/* Stage 3 */}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-0 w-3 h-3 bg-[#00FF9D] rounded-full shadow-[0_0_10px_#00FF9D]"></div>
                            <h4 className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider mb-1 font-mono">03 // ЗАПУСК</h4>
                            <p className="text-[10px] text-zinc-400 font-mono">Активация системы и начало приема оплат.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full pt-4">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mb-3 pl-2">УСПЕШНЫЕ ОПЕРАЦИИ</p>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="glass-card p-3 rounded-sm border border-zinc-800 flex flex-col items-center justify-center h-24 opacity-80 hover:opacity-100 hover:border-[#00FF9D]/30 transition-all cursor-pointer" onClick={() => setPreviewImage("https://i.ibb.co.com/ks9Sz9zz/5438294939344244554.jpg")}>
                              <SmartImage src="https://i.ibb.co.com/ks9Sz9zz/5438294939344244554.jpg" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity rounded-sm" alt="ROMANTIC Case" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/40 transition-colors">
                                  <span className="text-[10px] font-bold text-white font-mono tracking-wider">ROMANTIC</span>
                              </div>
                          </div>
                          <div className="glass-card p-3 rounded-sm border border-zinc-800 flex flex-col items-center justify-center h-24 opacity-80 hover:opacity-100 hover:border-[#00FF9D]/30 transition-all cursor-pointer" onClick={() => setPreviewImage("https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg")}>
                              <SmartImage src="https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity rounded-sm" alt="FOOD Case" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/40 transition-colors">
                                  <span className="text-[10px] font-bold text-white font-mono tracking-wider">КАСТРЮЛЬКА</span>
                              </div>
                          </div>
                      </div>
                </div>

                 <button onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-sm shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs mt-4 font-mono flex items-center justify-center gap-2">
                    <Crosshair className="w-4 h-4" />
                    ОБСУДИТЬ ПЛАН
                 </button>
            </div>
          </div>
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && (
            <AdminPanel 
                leads={leads}
                visitors={visitors} 
                onBack={() => setCurrentView('main')} 
                onClearLeads={() => setLeads([])}
                onUpdateLead={updateLead}
                onUpdateVisitor={updateVisitor}
            />
        )}
      </div>

      {/* Modals & Toasts stay EXACTLY the same */}
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

      {/* ADMIN AUTH MODAL */}
      {isAdminAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAdminAuthOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0A0A0A] border border-[#00FF9D]/50 p-6 rounded-sm shadow-[0_0_50px_rgba(0,255,157,0.1)]">
            <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-[#00FF9D] mx-auto mb-2 animate-pulse" />
                <h2 className="text-xl font-black text-[#00FF9D] font-mono tracking-widest">БЕЗОПАСНЫЙ ВХОД</h2>
            </div>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input type="password" placeholder="КОД ДОСТУПА" required className="w-full bg-black border border-zinc-700 p-3 text-center text-[#00FF9D] font-mono tracking-[0.5em] focus:border-[#00FF9D] outline-none" autoFocus />
              <button type="submit" className="w-full bg-[#00FF9D] text-black font-bold font-mono tracking-widest py-3 hover:bg-[#00FF9D]/80">ВОЙТИ</button>
            </form>
          </div>
        </div>
      )}

      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300" onClick={closeFaq} />
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,255,157,0.15)] flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 cursor-pointer" onClick={closeFaq} />
            <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-full bg-[#00FF9D]/10 text-[#00FF9D]">{activeFaq.icon}</div><h2 className="text-xl font-bold font-['Chakra_Petch'] leading-tight">{activeFaq.question}</h2></div>
            <div className="mb-4">{activeFaq.component}</div>
            {activeFaq.isCalc && !showCalculator && (<button onClick={() => setShowCalculator(true)} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse hover:scale-[1.02] transition-all text-xs">РАССЧИТАТЬ ПРИБЫЛЬ</button>)}
            {activeFaq.isCalc && showCalculator && (<div className="mt-6 border-t border-[#00FF9D]/20 pt-6"><ProfitCalculator data={calcData} setData={setCalcData} onAction={() => setCurrentView('strategy')} /></div>)}
            <button onClick={closeFaq} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
          <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <img src={previewImage} className="w-full h-full object-contain rounded-lg shadow-2xl" alt="Case Study Full" />
             <button 
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                onClick={() => setPreviewImage(null)}
             >
                <X className="w-6 h-6" />
             </button>
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
