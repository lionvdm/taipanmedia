import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// --- FIREBASE INTEGRATION ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';

// --- ICONS ---
import { 
  User, Wallet, Award, CheckCircle, Lock, Zap, 
  TrendingUp, Search, Activity, Edit2, Save, 
  Trash2, X, ChevronLeft, GraduationCap, Code, 
  Users, Crosshair, BarChart2, PieChart, Database, 
  Shield, Menu, Copy, ExternalLink, Play, ShoppingBag, Terminal
} from 'lucide-react';

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
const isFirebaseInitialized = true;

// Получаем ID приложения для формирования правильных путей (или используем дефолтный)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- КЛЮЧ PINATA (JWT) ---
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NTM5YTc4Ni00ODVhLTQ2ZWUtOTFmMi1iMWZjNDZjMzJhYjEiLCJlbWFpbCI6InRhaXBhbm1lZGlhc2NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJhNDcyNGMxODQyZjA1NTcyYjlhIiwic2NvcGVkS2V5U2VjcmV0IjoiYWY0ZDA4ZTg1N2Y3NWM2N2VmM2QzMjI0ZjVlNzBiMjc1NmEyZGQzMWQxMWE1MmY4YjFlYTZhZTU1YWMwNmE2ZSIsImV4cCI6MTgwMTAyNjg5M30.kACF0OpAMD5bQDftPrf9h5KkJyaX6_r_HAMkB4j9kt8";

// 1. Генерация картинки на Canvas
const generateSBTImage = (name, date, sbtId) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1200;
        canvas.height = 800;

        // Фон и дизайн
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 1200, 800);
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        for(let i=0; i<1200; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 800); ctx.stroke(); }

        // Текст
        ctx.fillStyle = '#00FF9D';
        ctx.font = 'bold 60px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TAIPAN ACADEMY', 600, 150);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px monospace';
        ctx.fillText(name.toUpperCase(), 600, 450);
        ctx.font = '20px monospace';
        ctx.fillStyle = 'gray';
        ctx.fillText(`ID: ${sbtId} | DATE: ${date}`, 600, 750);

        resolve(canvas.toDataURL('image/png'));
    });
};

// 2. Универсальная функция загрузки в Pinata
const pinToIPFS = async (data, isJson = false, fileName = "file") => {
    const url = isJson 
        ? "https://api.pinata.cloud/pinning/pinJSONToIPFS" 
        : "https://api.pinata.cloud/pinning/pinFileToIPFS";
    
    let body;
    if (isJson) {
        body = JSON.stringify(data);
    } else {
        const res = await fetch(data);
        const blob = await res.blob();
        body = new FormData();
        body.append('file', new File([blob], fileName));
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PINATA_JWT}`,
            ...(isJson && { 'Content-Type': 'application/json' })
        },
        body
    });

    const result = await response.json();
    return `ipfs://${result.IpfsHash}`;
};

// --- OPTIMIZED MATRIX BACKGROUND (Performance Friendly) ---
const MatrixBackground = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Отключаем прозрачность подложки для ускорения
    let animationFrameId;
    
    // Настройка разрешения
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = "TAIPAN0123456789XY"; // Укоротил строку, так быстрее выборка
    const fontSize = 14;
    const columns = Math.floor(width / 20); // Чуть шире шаг, меньше отрисовки
    const drops = Array(columns).fill(1);

    // Ограничиваем FPS до 24 (киношный вид + экономия батареи)
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      // Полупрозрачный черный слой для следа (Trail effect)
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00FF9D';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Рандомим, чтобы рисовать не каждый кадр каждый символ (оптимизация)
        if (Math.random() > 0.1) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * 20, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Запускаем
    draw(0);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // При ресайзе пересчитываем колонки, но не сбрасываем drops полностью чтобы не моргало жестко
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Добавил will-change для подсказки браузеру
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" style={{ willChange: 'contents' }} />;
});

// --- STYLES ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    /* Hide scrollbar */
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }

    .glass-card {
        background-color: rgba(15, 15, 15, 0.4);
        /* Clean glass by default (no grid) */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 255, 157, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        position: relative;
        overflow: hidden;
    }
    
    /* Dedicated class for Grid Texture (Main Page Only) */
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

    /* Brighter grid on hover only if grid-bg is present */
    .grid-bg:hover {
        background-image: 
            linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px);
    }

    .glass-card:active { transform: scale(0.98); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Tactical Grid Background (Legacy support if used elsewhere) */
    .tactical-grid {
        background-image: linear-gradient(rgba(0, 255, 157, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 157, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
    }
    
    /* Hardware Acceleration Class for Images */
    .hw-accelerated {
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
    }

    /* Animations */
    @keyframes contourPulse {
      0% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
      50% { filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.6)); opacity: 1; }
      100% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
    }

    @keyframes goldPulse {
      0% { filter: drop-shadow(0 0 1px rgba(229, 192, 123, 0.2)); opacity: 0.9; }
      50% { filter: drop-shadow(0 0 8px rgba(229, 192, 123, 0.5)); opacity: 1; }
      100% { filter: drop-shadow(0 0 1px rgba(229, 192, 123, 0.2)); opacity: 0.9; }
    }

    @keyframes snakeFlow {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
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
    @keyframes textReveal {
      0% { opacity: 0; transform: translateY(10px); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes voiceWave {
      0%, 100% { height: 10%; }
      50% { height: 100%; }
    }
    /* OPTIMIZED INTRO ANIMATIONS */
    @keyframes aggressive-glitch-text {
      0% { opacity: 0; transform: scale(1.1); color: #333; }
      20% { opacity: 1; transform: scale(1); color: #fff; text-shadow: 2px 0 #00FF9D; }
      100% { color: #e0e0e0; letter-spacing: 0.15em; }
    }

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

// --- HOOK FOR ODOMETER ANIMATION ---
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

// --- ICON COMPONENTS (Memoized for perf) ---
const ArrowRight = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>));
// Removed redundant ChevronLeft definition since it's imported from lucide-react
// const ChevronLeft = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>));
const CheckCircle2 = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>));

// Custom Icon for Telegram Logo (Not in Lucide)
const TelegramLogoMain = React.memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
));

// --- OPTIMIZED COMPONENT: SmartImage ---
// Wrapped in memo to prevent re-renders on parent state changes
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
        // Added hw-accelerated class for better scrolling performance
        className={`${className} hw-accelerated transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ ...style, contentVisibility: 'auto' }} // CSS Content Visibility optimization
      />
    </div>
  );
});

// --- INPUT FIELD COMPONENT ---
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

// --- PROFIT CALCULATOR COMPONENT ---
const ProfitCalculator = ({ onAction, data, setData }) => {
  const sales = Math.floor(data.traffic * (data.conversion / 100));
  const revenue = sales * data.avgCheck;
  const profit = Math.floor(revenue * (data.margin / 100));
  
  const animatedProfit = useOdometer(profit);
  const animatedSales = useOdometer(sales);

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
      <button onClick={onAction} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse mt-4">ПОЛУЧИТЬ СТРАТЕГИЮ ОТ TAIPAN GROUP</button>
    </div>
  );
};

// --- Bane Intro Component ---
const BaneIntro = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // NOTE: Audio file needs to be present in public folder for this to work
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
                    {/* First Phrase */}
                    <div className={`transition-all duration-[1500ms] ease-out ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-xl sm:text-2xl font-black uppercase font-['Chakra_Petch'] tracking-[0.2em] text-zinc-500 animate-[smoke-fade_2s_ease-out_forwards]">
                            НЕВАЖНО КТО МЫ ТАКИЕ
                        </h2>
                    </div>
                    
                    {/* Second Phrase */}
                    <div className={`transition-all duration-[100ms] ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase font-['Chakra_Petch'] tracking-widest text-white animate-[aggressive-glitch-text_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_both]">
                            ВАЖНО ТО
                        </h2>
                    </div>

                    {/* Third Phrase - Main */}
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

// --- HackerProof (OPTIMIZED) ---
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

// --- ClientDemandProof (OPTIMIZED) ---
const ClientDemandProof = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full object-cover opacity-90 filter grayscale-[0.5] contrast-[1.1] brightness-[0.9]" alt="Client Demand" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10"><Search className="w-3 h-3 text-[#00FF9D]" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
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

// --- SkillScanner ---
const SkillScanner = () => (
  <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500 group">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
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

// --- SetupTimeline ---
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

// --- WordstatGraph (OPTIMIZED) ---
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

// --- BrandLogos (RESTORED) ---
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
              <img src={img} alt="Notification" className="max-w-full max-h-full object-contain rounded-[32px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]" />
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
    return () => clearTimeout(timer);
  }, []);
  const currentLogo = logos[currentIndex];
  const isYandex = currentLogo.includes("Yandex");
  const isRomantic = currentLogo.includes("janym");
  const isFood = currentLogo.includes("DfQywRwj");
  const isPicsartLogo = currentLogo.includes("PvND9HRh");
  // MoiSklad logic
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
    <div className="w-full mt-12 mb-8 relative px-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4 mb-6 opacity-100">
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#00FF9D]"></div>
        <p className="text-center text-[10px] text-[#00FF9D] uppercase tracking-[0.4em] mr-[-0.4em] font-bold shadow-green-glow animate-pulse">Наши партнёры</p>
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#00FF9D]"></div>
      </div>
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-white/5 rounded-xl border border-[#00FF9D]/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         <div key={currentIndex} className="relative z-10 animate-[cyberReveal_0.5s_cubic-bezier(0.215,0.61,0.355,1)_both] w-full flex justify-center">
            <SmartImage src={currentLogo} alt="Partner Logo" style={specificStyle} className={logoClasses} wrapperClass="relative z-10 flex justify-center w-full" />
         </div>
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite]"></div>
      </div>
      <div className="flex gap-1.5 mt-4">
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
  const handleConsultation = () => {
      window.open('https://t.me/taipanmedia', '_blank');
  };
  const animatedProfit = useOdometer(conservativeProfit);
  const animatedPercentage = useOdometer(returnPercentage);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
        <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
        <div className="flex-grow flex flex-col items-center w-full space-y-6">
            <div className="text-center px-4 w-full"><h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">РАСЧЁТ <span className="text-[#00FF9D]">ОКУПАЕМОСТИ</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Эффективность инвестиций</p></div>
            <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-zinc-800"><span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Стоимость разработки</span><span className="text-sm font-black text-white font-['Chakra_Petch']">100 000 ₸</span></div>
             <div className="w-full glass-card p-4 rounded-2xl flex justify-between items-center border border-[#00FF9D]/20 bg-[#00FF9D]/5"><span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Потенциальный возврат</span><span className="text-sm font-black text-[#00FF9D] font-['Chakra_Petch']">{animatedProfit.toLocaleString()} ₸/мес</span></div>
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-3xl text-center group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
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

    const handleEditClick = (item, collectionType) => {
        setEditingItem(item);
        setEditCollection(collectionType);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData.entries());

        if (editCollection === 'leads') {
            onUpdateLead(editingItem.id, updates);
        } else if (editCollection === 'visitors') {
            // Handle checkbox logic manually since formData might omit unchecked boxes or return 'on'
            if (e.target.elements.sbt_allowed) {
                updates.sbt_allowed = e.target.elements.sbt_allowed.checked;
            }
            onUpdateVisitor(editingItem.id, updates);
        }
        setEditingItem(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full relative">
            <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit">
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
                <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'stats' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>📊 Статистика</button>
                <button onClick={() => setActiveTab('leads')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'leads' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>Заявки ({leads.length})</button>
                <button onClick={() => setActiveTab('visitors')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'visitors' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>Посетители</button>
            </div>

            <div className="w-full flex-grow overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                        {activeTab === 'leads' ? 'ВХОДЯЩИЕ ЛИДЫ' : activeTab === 'visitors' ? 'АКТИВНЫЙ ТРАФИК' : activeTab === 'stats' ? 'ОТЧЕТЫ СИСТЕМЫ' : ''}
                    </p>
                    {(activeTab === 'leads' || activeTab === 'stats') && (
                        <button onClick={onClearLeads} className="text-[9px] text-red-500 uppercase font-bold hover:text-red-400 flex items-center gap-1">
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
                                            {user.sbt_allowed && <p className="text-[8px] text-black font-bold mt-1 bg-[#00FF9D] px-1 rounded inline-block">SBT APPROVED</p>}
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
                                    
                                    {/* --- Manual SBT Approval Checkbox --- */}
                                    <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800 mt-4">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Разрешить выдачу SBT</span>
                                        <input 
                                            type="checkbox" 
                                            name="sbt_allowed" 
                                            defaultChecked={editingItem.sbt_allowed}
                                            className="w-5 h-5 accent-[#00FF9D] cursor-pointer"
                                        />
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

// --- PROFILE VIEW COMPONENT ---
const ProfileView = ({ onBack, userName, userId }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [isClaiming, setIsClaiming] = useState(false);
    const [hasSBT, setHasSBT] = useState(false);
    
    // Manual Approval State (from Firestore)
    const [canClaim, setCanClaim] = useState(false);

    // Mock course progress
    const courseProgress = 100;
    const isCourseFinished = courseProgress === 100;

    // --- CHECK FIREBASE PERMISSION ---
    useEffect(() => {
        if (!userId) return;
        
        // Listen to the specific user document for changes in 'sbt_allowed'
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', userId.toString());
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check if admin has set sbt_allowed to true
                setCanClaim(data.sbt_allowed === true);
                
                // Also check if already claimed (optional, based on logic)
                if (data.sbt_status === 'archived_in_ipfs') {
                    setHasSBT(true);
                }
            }
        });
        
        return () => unsubscribe();
    }, [userId]);

    // Simulate TON Connect
    const handleConnectWallet = () => {
        // In real app: useTonConnectUI().openModal()
        // Here we simulate connection
        setTimeout(() => {
            setWalletAddress("EQD...a8F2");
        }, 1000);
    };

    const handleClaimSBT = async () => {
        if (!walletAddress) return;
        
        // Security check: double check permission before proceeding
        if (!canClaim) {
            alert("У вас нет разрешения на выпуск сертификата. Обратитесь к администратору.");
            return;
        }

        setIsClaiming(true);
        
        try {
            const sbtId = `TPN-${Date.now()}`;
            const dateStr = new Date().toLocaleDateString();

            // 1. Создаем картинку
            const imgData = await generateSBTImage(userName, dateStr, sbtId);

            // 2. Загружаем картинку в IPFS
            const imageIpfsUrl = await pinToIPFS(imgData, false, `cert_${sbtId}.png`);
            console.log("✅ Картинка загружена:", imageIpfsUrl);

            // 3. Создаем и загружаем JSON-паспорт (Metadata)
            const metadata = {
                name: `TAIPAN Graduate: ${userName}`,
                description: "Official SBT Certificate by TAIPAN Media Group",
                image: imageIpfsUrl,
                attributes: [{ trait_type: "Student", value: userName }]
            };
            const metadataIpfsUrl = await pinToIPFS(metadata, true);
            console.log("🔥 Официальный JSON готов:", metadataIpfsUrl);

            // 4. Сохраняем результат в Firebase
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', userId.toString()), {
                sbt_status: 'archived_in_ipfs',
                metadata_url: metadataIpfsUrl
            });

            setHasSBT(true);
            // Визуальное уведомление внутри интерфейса заменит alert

        } catch (e) {
            console.error("Ошибка процесса:", e);
            // В случае ошибки сбрасываем состояние загрузки
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full relative pb-20">
            <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit">
                <ChevronLeft className="w-4 h-4 mr-1" /> НАЗАД
            </button>

            {/* HEADER */}
            <div className="w-full flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full border-2 border-[#00FF9D] p-1 mb-4 relative group">
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                         <User className="w-10 h-10 text-zinc-500" />
                         {/* Scan line effect */}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF9D]/20 to-transparent animate-[scanLine_2s_linear_infinite]"></div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-black border border-[#00FF9D] text-[#00FF9D] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        STUDENT
                    </div>
                </div>
                <h2 className="text-2xl font-black text-white font-['Chakra_Petch'] uppercase tracking-widest mb-1">{userName}</h2>
                <p className="text-[10px] text-zinc-500 font-mono">ID: {userId || 'UNKNOWN'}</p>
            </div>

            {/* WALLET CONNECTION */}
            <div className="w-full glass-card p-4 rounded-xl border border-zinc-800 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#00FF9D]" />
                        TON Wallet
                    </h3>
                    {walletAddress ? (
                        <span className="text-[9px] text-[#00FF9D] bg-[#00FF9D]/10 px-2 py-1 rounded border border-[#00FF9D]/20 font-mono">CONNECTED</span>
                    ) : (
                        <span className="text-[9px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 font-mono">NOT CONNECTED</span>
                    )}
                </div>
                
                {walletAddress ? (
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                        <span className="text-[11px] font-mono text-zinc-300">{walletAddress}</span>
                        <button onClick={() => {navigator.clipboard.writeText(walletAddress)}} className="text-zinc-500 hover:text-white">
                            <Copy className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleConnectWallet}
                        className="w-full bg-[#0098EA] hover:bg-[#0098EA]/80 text-white font-bold uppercase text-[10px] py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,152,234,0.3)] flex items-center justify-center gap-2"
                    >
                        <Wallet className="w-4 h-4" /> Connect Wallet
                    </button>
                )}
            </div>

            {/* COURSE PROGRESS */}
            <div className="w-full glass-card p-4 rounded-xl border border-zinc-800 mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Прогресс обучения</span>
                    <span className="text-xs font-bold text-[#00FF9D] font-mono">{courseProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#00FF9D] w-full shadow-[0_0_10px_#00FF9D]"></div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <CheckCircle2 className={`w-3 h-3 ${isCourseFinished ? 'text-[#00FF9D]' : 'text-zinc-600'}`} />
                    {isCourseFinished ? 'Все модули пройдены' : 'Продолжите обучение'}
                </div>
            </div>

            {/* SBT CERTIFICATE SECTION */}
            <div className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF9D] via-purple-500 to-[#00FF9D] rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity animate-holograph bg-[length:200%_auto]"></div>
                <div className="glass-card p-6 rounded-xl border border-[#00FF9D]/30 relative bg-black/80">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Award className="w-16 h-16 text-[#00FF9D]" />
                    </div>

                    <h3 className="text-lg font-black text-white font-['Chakra_Petch'] uppercase tracking-widest mb-1">
                        SBT Certificate
                    </h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-6 max-w-[200px]">
                        Soulbound Token — Цифровое доказательство вашей квалификации в блокчейне TON.
                    </p>

                    {hasSBT ? (
                        <div className="animate-in zoom-in duration-500">
                             <div className="aspect-video w-full rounded-lg border border-[#00FF9D]/50 bg-[#00FF9D]/5 flex flex-col items-center justify-center relative overflow-hidden mb-4">
                                <div className="absolute inset-0 grid-bg opacity-30"></div>
                                <Award className="w-12 h-12 text-[#00FF9D] mb-2 drop-shadow-[0_0_15px_#00FF9D]" />
                                <span className="text-sm font-black text-white uppercase tracking-widest font-['Chakra_Petch']">TAIPAN ACADEMY</span>
                                <span className="text-[9px] text-[#00FF9D] font-mono mt-1">GRADUATE 2026</span>
                                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div>
                                    <span className="text-[7px] text-[#00FF9D] font-mono">VERIFIED ON CHAIN</span>
                                </div>
                             </div>
                             <div className="flex items-center justify-center gap-2 text-[#00FF9D] text-xs font-bold uppercase tracking-wider border border-[#00FF9D]/20 p-2 rounded bg-[#00FF9D]/5">
                                <CheckCircle2 className="w-4 h-4" /> Токен получен
                             </div>
                             <button className="w-full mt-3 text-[9px] text-zinc-500 hover:text-white flex items-center justify-center gap-1 transition-colors">
                                Посмотреть в Explorer <ExternalLink className="w-3 h-3" />
                             </button>
                        </div>
                    ) : (
                        <div>
                             {!walletAddress ? (
                                 <div className="text-center py-4 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700">
                                     <Lock className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                                     <p className="text-[10px] text-zinc-500 uppercase">Подключите кошелек для получения</p>
                                 </div>
                             ) : !isCourseFinished ? (
                                 <div className="text-center py-4 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700">
                                     <Lock className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                                     <p className="text-[10px] text-zinc-500 uppercase">Завершите курс для разблокировки</p>
                                 </div>
                             ) : (
                                 <button 
                                    onClick={handleClaimSBT}
                                    disabled={isClaiming || !canClaim} // Блокируем, если sbt_allowed !== true
                                    className={`w-full py-4 rounded-xl font-black uppercase transition-all text-xs flex items-center justify-center gap-2 ${
                                        !canClaim 
                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                                        : 'bg-gradient-to-r from-[#00FF9D] to-[#00CC7A] text-black shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02]'
                                    }`}
                                 >
                                    {isClaiming ? (
                                        <span className="animate-pulse">MINTING...</span>
                                    ) : !canClaim ? (
                                        <> <Lock className="w-4 h-4" /> Доступ закрыт админом </>
                                    ) : (
                                        <> <Zap className="w-4 h-4 fill-black" /> CLAIM CERTIFICATE </>
                                    )}
                                 </button>
                             )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
