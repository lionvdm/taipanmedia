import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// --- FIREBASE INTEGRATION ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';

// --- CONFIGURATION & INIT ---
let app, auth, db;
let isFirebaseInitialized = false;

// Получаем ID приложения
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

try {
    let config;
    if (typeof __firebase_config !== 'undefined') {
        config = JSON.parse(__firebase_config);
    } else {
        config = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "ЗАМЕНИТЕ_НА_ВАШ_API_KEY",
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "taipan.firebaseapp.com",
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "taipan",
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "taipan.appspot.com",
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
            appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:..."
        };
    }

    if (config.apiKey && config.apiKey !== "ЗАМЕНИТЕ_НА_ВАШ_API_KEY") {
        app = initializeApp(config);
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseInitialized = true;
    } else {
        console.warn("⚠️ Firebase config is missing. Running in UI-only mode.");
    }
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

// --- TELEGRAM API HELPERS ---
const BOT_TOKEN = "8398712805:AAHFZXllsCQU0YNd8KIo9Rie5VZeyH91GMQ"; 

const sendTelegramMessage = async (chatId, text) => {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
        });
        return true;
    } catch (e) {
        console.error(`Failed to send to ${chatId}:`, e);
        return false;
    }
};

const logToTaipanCRM = async (topicId, status, details = "") => {
  const chatId = "-1003690228596"; 
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;
  const userLink = user?.username ? `https://t.me/${user.username}` : `tg://user?id=${user?.id}`;

  const message = `
📊 **СТАТУС: ${status}**
--------------------------
👤 **Юзер:** ${user?.first_name || 'Incognito'} (@${user?.username || 'нет'})
🆔 **ID:** \`${user?.id || '---'}\`
🔹 **Детали:** ${details}

👉 [НАПИСАТЬ КЛИЕНТУ](${userLink})
--------------------------`;

  try {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_thread_id: topicId, text: message, parse_mode: "Markdown", disable_web_page_preview: true })
    }).catch(console.error);
  } catch (e) { console.error("CRM Error:", e); }
};

// --- OPTIMIZED MATRIX BACKGROUND ---
const MatrixBackground = React.memo(() => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const columns = Math.floor(width / 25);
    const drops = Array(columns).fill(0).map(() => Math.random() * -100);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00FF9D';
      ctx.font = '14px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 25, drops[i] * 25);
        if (drops[i] * 25 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    let interval = setInterval(drawMatrix, 75);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" style={{willChange: 'contents'}} />;
});

// --- GLOBAL STYLES (Performance Tuned) ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
    input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }

    .glass-card {
        background: rgba(20, 20, 20, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 255, 157, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(0, 255, 157, 0.2);
        transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.2s ease;
        will-change: transform;
    }
    .glass-card:active { transform: scale(0.98); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .hw-accelerated { will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden; }

    /* Keyframes kept simple for perf */
    @keyframes contourPulse { 0% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; } 50% { filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.6)); opacity: 1; } 100% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; } }
    @keyframes scanLine { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }
    @keyframes widthGrow { from { width: 0; } }
    @keyframes voiceWave { 0%, 100% { height: 10%; } 50% { height: 100%; } }
    @keyframes smoke-fade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
  `}} />
);

// --- HOOKS & UTILS ---
const useOdometer = (targetValue, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let startValue = displayValue;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (targetValue - startValue) * ease);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(targetValue);
    };
    requestAnimationFrame(animate);
  }, [targetValue]);
  return displayValue;
};

// --- MEMOIZED ICONS ---
const GraduationCap = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>));
const ArrowRight = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>));
const ChevronLeft = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>));
const CheckCircle2 = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>));
const Lock = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>));
const TrendingUp = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>));
const Wallet = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>));
const X = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>));
const Zap = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>));
const Search = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>));
const Users = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>));
const Shield = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>));
const Crosshair = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>));
const Code = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>));
const Database = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>));
const Trash2 = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6"/><path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"/></svg>));
const Activity = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>));
const Edit2 = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>));
const Save = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>));
const Megaphone = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>));
const Send = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>));
const Filter = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>));
const BarChart2 = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>));
const PieChart = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>));
const TelegramLogoMain = React.memo(({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/></svg>));

// --- COMPONENT HELPERS ---
const SmartImage = React.memo(({ src, alt, className, style, wrapperClass = "", overflowHidden = true, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  return (
    <div className={`relative ${overflowHidden ? 'overflow-hidden' : ''} ${wrapperClass} ${className?.includes('rounded') ? '' : 'rounded-none'}`}>
      {!isLoaded && !hasError && <div className={`absolute inset-0 bg-zinc-900/50 animate-pulse z-0 ${className}`} style={style} />}
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" onLoad={() => setIsLoaded(true)} onError={(e) => { setHasError(true); if (e.target.src !== "https://via.placeholder.com/400x200?text=Error") e.target.style.display = 'none'; }} className={`${className} hw-accelerated transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ ...style, contentVisibility: 'auto' }} />
    </div>
  );
});

const InputField = React.memo(({ label, value, setValue, suffix = "" }) => (
  <div className="mb-2">
    <label className="block text-[9px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">{label}</label>
    <div className="relative">
      <input type="number" value={value === 0 ? '' : value} onChange={(e) => setValue(Number(e.target.value))} placeholder="0" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl p-2.5 text-white focus:border-[#00FF9D]/50 outline-none transition-all font-['Chakra_Petch'] text-sm appearance-none placeholder-zinc-700" />
      {suffix && <span className="absolute right-4 top-2.5 text-zinc-500 text-xs font-bold pointer-events-none">{suffix}</span>}
    </div>
  </div>
));

// --- RESTORED MISSING COMPONENTS ---

// 1. PartnersCredits
const PartnersCredits = React.memo(() => {
  const logos = [
    "https://i.ibb.co.com/PvND9HRh/Picsart-Background-Remover.png", "https://i.ibb.co.com/YHbCZm2/Yandex-Metrika-hd-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/DfQywRwj/Picsart-Background-Remover.png", "https://i.ibb.co.com/QZpjR8B/salon-cvetov-janym-photo-place-Picsart-Background-Remover.png",
    "https://i.ibb.co.com/3mKHz61B/Picsart-Background-Remover.png", "https://i.ibb.co.com/4g74sZT7/maxresdefault-Picsart-Background-Remover.png"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % logos.length); }, 2500);
    return () => clearInterval(timer);
  }, [logos.length]);
  const currentLogo = logos[currentIndex];
  // Simple check for styles
  let specificStyle = { filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.15)) brightness(1.1) contrast(1.1) saturate(1.2)' };
  if (currentLogo.includes("Yandex")) specificStyle = { filter: 'invert(1) hue-rotate(180deg) saturate(3) brightness(1.2)' };
  else if (currentLogo.includes("janym")) specificStyle = { filter: 'brightness(1.5) contrast(1.2)' };
  else if (currentLogo.includes("DfQywRwj")) specificStyle = { filter: 'brightness(1.1) contrast(1.1)' };
  else if (currentLogo.includes("PvND9HRh")) specificStyle = { filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))' };
  
  return (
    <div className="w-full mt-12 mb-8 relative px-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4 mb-6 opacity-100">
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#00FF9D]"></div>
        <p className="text-center text-[10px] text-[#00FF9D] uppercase tracking-[0.4em] mr-[-0.4em] font-bold shadow-green-glow animate-pulse">Наши партнёры</p>
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#00FF9D]"></div>
      </div>
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-white/5 rounded-xl border border-[#00FF9D]/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
         <div className="relative z-10 animate-[cyberReveal_0.5s_cubic-bezier(0.215,0.61,0.355,1)_both] w-full flex justify-center">
            <SmartImage src={currentLogo} alt="Partner Logo" style={specificStyle} className="h-24 w-auto object-contain max-w-[90%] transform scale-125" wrapperClass="relative z-10 flex justify-center w-full" />
         </div>
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/10 to-transparent animate-[scanLine_2.5s_linear_infinite]"></div>
      </div>
      <div className="flex gap-1.5 mt-4">
        {logos.map((_, idx) => ( <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#00FF9D] shadow-[0_0_10px_#00FF9D]' : 'w-1.5 bg-zinc-800'}`} /> ))}
      </div>
    </div>
  );
});

// 2. ShopIntroSequence
const ShopIntroSequence = React.memo(({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);
    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-3xl font-black text-[#00FF9D] animate-pulse">ЗАГРУЗКА...</h2>
        </div>
    );
});

// 3. Carousel3D
const Carousel3D = React.memo(() => {
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
    <div className="relative w-full h-[280px] flex items-center justify-center border border-zinc-800 rounded-xl bg-black/50 overflow-hidden">
       {images.map((img, i) => {
         const total = images.length;
         const dist = (index - i + total) % total;
         let styleClass = "opacity-0 scale-50 z-0 translate-y-[100px]"; 
         if (dist === 0) styleClass = "opacity-100 scale-100 z-30 translate-y-[0px]";
         else if (dist === 1) styleClass = "opacity-60 scale-90 z-20 -translate-y-[40px]";
         return (
           <div key={i} className={`absolute transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) w-[280px] h-[160px] flex items-center justify-center ${styleClass}`}>
              <img src={img} alt="Slide" className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl" />
           </div>
         )
       })}
    </div>
  );
});

// 4. WordstatGraph
const WordstatGraph = React.memo(() => (
    <div className="w-full bg-[#1c1c1e] rounded-xl border border-zinc-700 overflow-hidden mb-6"><SmartImage src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" alt="Real Wordstat Data" className="w-full h-auto object-cover opacity-90" /></div>
));

// 5. HackerProof
const HackerProof = React.memo(() => (
    <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6"><SmartImage src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" className="w-full object-cover" alt="Encrypted Proof" /></div>
));

// 6. ClientDemandProof
const ClientDemandProof = React.memo(() => (
    <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6"><SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full object-cover opacity-90 grayscale-[0.5]" alt="Client Demand" /></div>
));

// 7. SkillScanner
const SkillScanner = React.memo(() => (
    <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden group"><div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00FF9D]/05 to-transparent animate-[scanLine_4s_linear_infinite]"></div><div className="relative z-10"><div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2"><span className="text-[10px] font-mono text-[#00FF9D] tracking-widest">СИСТЕМНЫЙ_АНАЛИЗ</span></div><div className="mt-4 p-2 bg-[#00FF9D]/5 rounded border border-[#00FF9D]/10 text-center"><p className="text-[9px] text-[#00FF9D] font-black tracking-widest uppercase relative z-10">ВЕРДИКТ: ИДЕАЛЬНО ДЛЯ НОВИЧКОВ</p></div></div></div>
));

// 8. SetupTimeline
const SetupTimeline = React.memo(() => (
    <div className="w-full pl-2 mb-4"><div className="flex items-center justify-between mb-6"><span className="text-[10px] text-[#00FF9D] font-mono tracking-widest border border-[#00FF9D]/30 px-2 py-1 rounded">ПРОТОКОЛ ЗАПУСКА</span></div></div>
));

// 9. BrandLogos
const BrandLogos = {
  Bitcoin: React.memo(({ isActive }) => (<div className={`flex flex-col items-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}><p className="text-[#F7931A] font-black text-xl">2009: BITCOIN</p><p className="text-zinc-500 text-[10px] uppercase">Упущено</p></div>)),
  Instagram: React.memo(({ isActive }) => (<div className={`flex flex-col items-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}><p className="text-[#E1306C] font-black text-xl">2012: INSTAGRAM</p><p className="text-zinc-500 text-[10px] uppercase">Упущено</p></div>)),
  Marketplaces: React.memo(({ isActive }) => (<div className={`flex flex-col items-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}><p className="text-white font-black text-xl">2019: МАРКЕТПЛЕЙСЫ</p><p className="text-zinc-500 text-[10px] uppercase">Упущено</p></div>)),
  Telegram: React.memo(({ isActive }) => (<div className={`flex flex-col items-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}><p className="text-[#00FF9D] font-black text-xl">2026: TELEGRAM</p><p className="text-white text-[10px] uppercase bg-[#00FF9D]/20 px-2 py-1 rounded mt-1">ТВОЙ ШАНС</p></div>))
};

// 10. BaneIntro
const BaneIntro = React.memo(({ onComplete }) => {
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
});

// 11. RoiView
const RoiView = React.memo(({ profit, onBack, onAction }) => {
  const investment = 100000;
  const conservativeProfit = Math.floor(profit * 0.2); 
  const returnPercentage = Math.round((conservativeProfit / investment) * 100);
  const daysToRecoup = conservativeProfit > 0 ? Math.ceil(investment / (conservativeProfit / 30)) : Infinity;
  const isProfitable = returnPercentage > 0;
  const handleConsultation = () => {
      logToTaipanCRM(6, "ЖДЕТ КОНСУЛЬТАЦИЮ ⚡️", "Кликнул по кнопке 'Получить консультацию'");
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
});

// --- COMPLEX COMPONENTS ---
const OnlineStatus = React.memo(({ initialCount }) => {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => Math.max(12, Math.min(48, prev + Math.floor(Math.random() * 5) - 2)));
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    return (
        <p className="text-[10px] text-zinc-600 font-mono mt-2 tracking-widest flex items-center justify-center gap-2 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_5px_#00FF9D]"></span>
            СЕЙЧАС ОНЛАЙН: <span className="text-zinc-400 font-bold">{count}</span>
        </p>
    );
});

const ProfitCalculator = React.memo(({ onAction, data, setData }) => {
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
});

// --- MAIN VIEWS ISOLATION (CRITICAL FOR PERFORMANCE) ---
const MainView = React.memo(({ onNavigate, openModal, setBaneIntroActive, userName, handleTitleClick }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
            <div className="mb-14 w-full text-center" onClick={handleTitleClick}>
                <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center select-none cursor-pointer active:scale-95 transition-transform" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)', color: '#ffffff' }}>
                    <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
                </h1>
                <div className="flex items-center justify-center gap-4 mt-3 w-full">
                    <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-700"></div>
                    <p className="text-[10px] uppercase tracking-[0.6em] mr-[-0.6em] text-[#00FF9D] font-bold whitespace-nowrap animate-pulse">ПРИВЕТ, {userName}</p>
                    <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-700"></div>
                </div>
                <OnlineStatus initialCount={17} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
                <div onClick={() => onNavigate('shop')} className="group relative glass-card rounded-3xl px-6 pt-10 pb-2 h-64 flex flex-col items-center text-center cursor-pointer">
                    <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><TelegramLogoMain className="w-12 h-12" /></div>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-2 leading-tight">Telegram<br />Магазин</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2">Выведите свой бизнес на новый уровень</p>
                    <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">ЗАКАЗАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
                </div>
                <div onClick={() => onNavigate('education')} className="group relative glass-card rounded-3xl px-6 pt-10 pb-2 h-64 flex flex-col items-center text-center cursor-pointer">
                    <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><GraduationCap className="w-12 h-12" /></div>
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-2 leading-tight">ОБУЧЕНИЕ</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2 text-zinc-500">Освой трендовый навык</p>
                    <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">УЗНАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <div onClick={() => openModal('Mini App')} className="group relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center w-full h-40">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors leading-tight">Заказать</p>
                </div>
                <div onClick={() => setBaneIntroActive(true)} className="group relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center w-full h-40">
                    <Users className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-[#00FF9D] transition-colors" />
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">КТО МЫ?</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors leading-tight">О команде</p>
                </div>
            </div>
            <PartnersCredits />
        </div>
    );
});

const ShopView = React.memo(({ onNavigate, onBack, shopIntroFinished, setShopIntroFinished }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            {!shopIntroFinished ? (
                <ShopIntroSequence onComplete={() => setShopIntroFinished(true)} />
            ) : (
                <React.Fragment>
                    <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
                    <div className="flex-grow flex flex-col items-center w-full space-y-6 animate-in slide-in-from-bottom duration-700">
                        <div className="text-center px-4 w-full mb-4">
                            <TelegramLogoMain className="w-20 h-20 mx-auto text-[#00FF9D] mb-4 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
                            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch'] leading-none">TELEGRAM<br /><span className="text-[#00FF9D]">STORE</span></h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">E-commerce нового поколения</p>
                        </div>
                        <div className="w-full space-y-3">
                            {[{ title: "Каталог и Корзина", desc: "Полноценный интернет-магазин внутри мессенджера." }, { title: "Оплата в 1 клик", desc: "Интеграция с Kaspi, картами и криптовалютой." }, { title: "CRM Система", desc: "Управление заказами и статусами прямо внутри Telegram." }, { title: "Авто-рассылки", desc: "Push-уведомления клиентам с открываемостью 90%." }].map((item, i) => (
                                <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition-all">
                                    <div className="mt-1 bg-[#00FF9D]/10 p-2 rounded-full text-[#00FF9D] border border-[#00FF9D]/20"><CheckCircle2 className="w-4 h-4" /></div>
                                    <div><h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h4><p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20 relative overflow-hidden group">
                            <button onClick={() => { logToTaipanCRM(3, "АКТИВНОСТЬ", "Считает прибыль"); onNavigate('calculator'); }} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs relative z-10 flex items-center justify-center gap-2">РАССЧИТАТЬ УПУЩЕННУЮ ПРИБЫЛЬ</button>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
});

// --- Analytics Chart, Admin Panel, etc. retained but optimized by not re-rendering App ---
const AnalyticsChart = React.memo(({ leads }) => {
    const stats = useMemo(() => {
        const counts = leads.reduce((acc, lead) => { const type = lead.type || 'Не указано'; acc[type] = (acc[type] || 0) + 1; return acc; }, {});
        const total = leads.length;
        return Object.keys(counts).map(key => ({ label: key, count: counts[key], percentage: total > 0 ? Math.round((counts[key] / total) * 100) : 0 })).sort((a, b) => b.count - a.count);
    }, [leads]);
    const maxCount = Math.max(...stats.map(s => s.count), 1);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
             <div className="grid grid-cols-2 gap-3">
                 <div className="glass-card p-4 rounded-xl border border-zinc-800"><p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">ВСЕГО ЛИДОВ</p><p className="text-3xl font-black text-white font-mono">{leads.length}</p></div>
                 <div className="glass-card p-4 rounded-xl border border-zinc-800"><p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">TOP ВЫБОР</p><p className="text-xl font-bold text-[#00FF9D] truncate">{stats[0]?.label || '---'}</p></div>
             </div>
             <div className="glass-card p-5 rounded-xl border border-zinc-800">
                 <div className="flex items-center justify-between mb-4"><h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"><BarChart2 className="w-4 h-4 text-[#00FF9D]" />Популярность услуг</h3></div>
                 <div className="space-y-4">
                     {stats.map((item, idx) => (
                         <div key={idx} className="relative">
                             <div className="flex justify-between items-end mb-1"><span className="text-[10px] font-bold text-zinc-300">{item.label}</span><span className="text-[10px] font-mono text-[#00FF9D]">{item.count} ({item.percentage}%)</span></div>
                             <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#00FF9D]/50 to-[#00FF9D] rounded-full transition-all duration-1000 ease-out" style={{ width: `${(item.count / maxCount) * 100}%` }}></div></div>
                         </div>
                     ))}
                     {stats.length === 0 && <p className="text-center text-[10px] text-zinc-600 py-4">Нет данных</p>}
                 </div>
             </div>
        </div>
    );
});

const AdminPanel = React.memo(({ leads, visitors, onBack, onClearLeads, onUpdateLead, onUpdateVisitor }) => {
    const [activeTab, setActiveTab] = useState('visitors');
    const [editingItem, setEditingItem] = useState(null); 
    const [editCollection, setEditCollection] = useState(''); 
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
    const [broadcastTarget, setBroadcastTarget] = useState('all'); 

    const handleEditClick = useCallback((item, collectionType) => { setEditingItem(item); setEditCollection(collectionType); }, []);
    const handleSave = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData.entries());
        if (editCollection === 'leads') onUpdateLead(editingItem.id, updates);
        else if (editCollection === 'visitors') onUpdateVisitor(editingItem.id, updates);
        setEditingItem(null);
    }, [editCollection, editingItem, onUpdateLead, onUpdateVisitor]);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastMessage.trim()) return;
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 3);
        const targets = visitors.filter(v => {
            if (!v.chatId) return false;
            if (broadcastTarget === 'all') return true;
            if (broadcastTarget === 'inactive') {
                if (!v.lastActive) return true; 
                const lastActiveDate = v.lastActive.toDate ? v.lastActive.toDate() : new Date(v.lastActive);
                return lastActiveDate < cutoff;
            }
            return false;
        });

        if (targets.length === 0) return alert("Нет доступных пользователей.");
        if (!confirm(`Отправить сообщение ${targets.length} пользователям?`)) return;

        setIsSending(true);
        setSendProgress({ current: 0, total: targets.length });
        let successCount = 0;
        for (let i = 0; i < targets.length; i++) {
            const success = await sendTelegramMessage(targets[i].chatId, broadcastMessage);
            if (success) successCount++;
            setSendProgress(prev => ({ ...prev, current: i + 1 }));
            await new Promise(r => setTimeout(r, 200)); 
        }
        setIsSending(false);
        setBroadcastMessage("");
        alert(`Рассылка завершена! Успешно: ${successCount} из ${targets.length}`);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full relative">
            <button onClick={onBack} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> ВЫХОД</button>
            <div className="w-full flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-zinc-900 border border-[#00FF9D]/30 rounded-full flex items-center justify-center mb-4 relative"><div className="absolute inset-0 rounded-full animate-ping bg-[#00FF9D]/10"></div><Shield className="w-8 h-8 text-[#00FF9D]" /></div>
                <h2 className="text-2xl font-black font-['Chakra_Petch'] uppercase tracking-widest">ПАНЕЛЬ УПРАВЛЕНИЯ</h2>
            </div>
            <div className="flex w-full mb-4 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 gap-1 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'stats' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>📊 Статистика</button>
                <button onClick={() => setActiveTab('leads')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'leads' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>Заявки ({leads.length})</button>
                <button onClick={() => setActiveTab('visitors')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'visitors' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}>Посетители</button>
                <button onClick={() => setActiveTab('broadcast')} className={`flex-1 py-2 px-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'broadcast' ? 'bg-[#00FF9D] text-black shadow-lg shadow-[#00FF9D]/20' : 'text-zinc-500 hover:text-white'}`}><Megaphone className="w-3 h-3" /> Рассылка</button>
            </div>
            <div className="w-full flex-grow overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1"><p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{activeTab === 'leads' ? 'ВХОДЯЩИЕ ЛИДЫ' : activeTab === 'visitors' ? 'АКТИВНЫЙ ТРАФИК' : activeTab === 'stats' ? 'ОТЧЕТЫ СИСТЕМЫ' : 'МАССОВАЯ ОТПРАВКА'}</p>{(activeTab === 'leads' || activeTab === 'stats') && (<button onClick={onClearLeads} className="text-[9px] text-red-500 uppercase font-bold hover:text-red-400 flex items-center gap-1"><Trash2 className="w-3 h-3" /> {activeTab === 'stats' ? 'СБРОСИТЬ ВСЁ' : 'ОЧИСТИТЬ'}</button>)}</div>
                <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 pb-20">
                    {activeTab === 'stats' && <AnalyticsChart leads={leads} />}
                    {activeTab === 'leads' && (leads.length === 0 ? (<div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl"><Database className="w-8 h-8 text-zinc-700 mx-auto mb-2" /><p className="text-[10px] text-zinc-600 uppercase tracking-wider">Нет новых заявок</p></div>) : (leads.map((lead) => (<div key={lead.id} className="glass-card p-3 rounded-lg border border-zinc-800 flex items-center justify-between group hover:border-[#00FF9D]/30 transition-all"><div className="flex-grow"><div className="flex items-center gap-2 mb-1"><div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div><p className="text-xs font-bold text-white font-mono">{lead.name}</p></div><p className="text-[10px] text-zinc-400 font-mono">{lead.contact}</p><p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-wider">{lead.type}</p></div><div className="flex items-center gap-3"><div className="text-right"><p className="text-[9px] text-zinc-500 font-mono">{lead.time}</p><a href={`https://t.me/${lead.contact.replace('@', '')}`} target="_blank" rel="noreferrer" className="mt-2 inline-block bg-[#00FF9D]/10 text-[#00FF9D] text-[8px] font-bold px-2 py-1 rounded border border-[#00FF9D]/20 hover:bg-[#00FF9D]/20">НАПИСАТЬ</a></div><button onClick={() => handleEditClick(lead, 'leads')} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><Edit2 className="w-3 h-3" /></button></div></div>))))}
                    {activeTab === 'visitors' && (visitors.length === 0 ? (<div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl"><Activity className="w-8 h-8 text-zinc-700 mx-auto mb-2" /><p className="text-[10px] text-zinc-600 uppercase tracking-wider">Загрузка трафика...</p></div>) : (visitors.map((user) => (<div key={user.id} className="glass-card p-3 rounded-lg border border-zinc-800 flex items-center justify-between group hover:bg-[#00FF9D]/5 transition-all"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#00FF9D] border border-zinc-700">{user.userName?.charAt(0)}</div><div><p className="text-xs font-bold text-white font-mono">{user.userName}</p><p className="text-[9px] text-zinc-500 font-mono">ID: {user.chatId}</p>{user.notes && <p className="text-[8px] text-[#00FF9D] mt-1 bg-[#00FF9D]/10 px-1 rounded inline-block">{user.notes}</p>}</div></div><div className="flex items-center gap-3"><div className="text-right"><div className="flex items-center justify-end gap-1.5 mb-1"><div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse shadow-[0_0_5px_#00FF9D]"></div><span className="text-[9px] text-[#00FF9D] font-bold uppercase">ONLINE</span></div><p className="text-[8px] text-zinc-600 font-mono">{user.lastActive?.toDate ? user.lastActive.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Сейчас'}</p></div><button onClick={() => handleEditClick(user, 'visitors')} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><Edit2 className="w-3 h-3" /></button></div></div>))))}
                    {activeTab === 'broadcast' && ( <div className="w-full flex flex-col h-full"><div className="glass-card p-4 rounded-xl border border-zinc-800 mb-4 bg-zinc-900/40"><div className="flex bg-black p-1 rounded-lg border border-zinc-800 mb-4"><button onClick={() => setBroadcastTarget('all')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${broadcastTarget === 'all' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30' : 'text-zinc-500 hover:text-white'}`}>ВСЕ</button><button onClick={() => setBroadcastTarget('inactive')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${broadcastTarget === 'inactive' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30' : 'text-zinc-500 hover:text-white'}`}><Filter className="w-3 h-3" /> СПЯЩИЕ {'>'} 3 ДНЕЙ</button></div><div className="flex justify-between items-center mb-4"><p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">СООБЩЕНИЕ</p><p className="text-xs font-bold text-[#00FF9D] font-mono">TARGET: {visitors.filter(v => { if (!v.chatId) return false; if (broadcastTarget === 'all') return true; if (broadcastTarget === 'inactive') { const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 3); if (!v.lastActive) return true; const lastActiveDate = v.lastActive.toDate ? v.lastActive.toDate() : new Date(v.lastActive); return lastActiveDate < cutoff; } return false; }).length}</p></div><form onSubmit={handleBroadcast} className="flex flex-col gap-3"><textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Введите сообщение..." className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-xs text-white focus:border-[#00FF9D] outline-none h-32 resize-none placeholder-zinc-700 font-mono" disabled={isSending} />{isSending ? (<div className="w-full bg-zinc-800 rounded-xl h-10 flex items-center justify-center relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 bg-[#00FF9D]/20 transition-all duration-300" style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}></div><span className="relative z-10 text-[10px] font-bold text-white font-mono animate-pulse">ОТПРАВКА... {sendProgress.current} / {sendProgress.total}</span></div>) : (<button type="submit" className="w-full bg-[#00FF9D] hover:bg-[#00FF9D]/90 text-black font-bold uppercase text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"><Send className="w-4 h-4" /> ОТПРАВИТЬ</button>)}</form></div></div> )}
                </div>
            </div>
            {editingItem && ( <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"><div className="w-full max-w-sm bg-[#0F0F0F] border border-[#00FF9D]/30 p-6 rounded-2xl shadow-2xl relative"><button onClick={() => setEditingItem(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button><h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2"><Edit2 className="w-4 h-4 text-[#00FF9D]" /> Редактирование</h3><form onSubmit={handleSave} className="space-y-3">{editCollection === 'leads' ? (<><div><label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Имя</label><input name="name" defaultValue={editingItem.name} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" /></div><div><label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Контакт</label><input name="contact" defaultValue={editingItem.contact} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" /></div><div><label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Услуга</label><input name="type" defaultValue={editingItem.type} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none" /></div></>) : (<><div className="mb-2"><p className="text-[10px] text-zinc-400">ID: {editingItem.chatId}</p><p className="text-[10px] text-zinc-400">Name: {editingItem.userName}</p></div><div><label className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">Заметки о клиенте</label><textarea name="notes" defaultValue={editingItem.notes || ''} placeholder="Например: интересовался обучением..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white focus:border-[#00FF9D] outline-none h-20 resize-none" /></div></>)}<button type="submit" className="w-full bg-[#00FF9D] hover:bg-[#00FF9D]/90 text-black font-bold uppercase text-xs py-3 rounded-xl mt-4 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Сохранить</button></form></div></div> )}
        </div>
    );
});

const App = () => {
  useEffect(() => { console.log("Taipan Media App Initialized"); }, []);
  const [currentView, setCurrentView] = useState('main'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Admin & Leads State
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [leads, setLeads] = useState([
      { id: 1, name: 'Алибек', contact: '@alibek_kz', type: 'Обучение', time: '10:42' },
      { id: 2, name: 'Мария', contact: '@maria_shop', type: 'Магазин', time: '09:15' },
      { id: 3, name: 'Тест', contact: '@test', type: 'Mini App', time: '11:00' }, 
  ]); 
  
  const [visitors, setVisitors] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [baneIntroActive, setBaneIntroActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [userName, setUserName] = useState('AGENT');
  const [spotsLeft, setSpotsLeft] = useState(4);
  const [calcData, setCalcData] = useState({ traffic: 0, conversion: 0, avgCheck: 0, margin: 0 });
  const [shopIntroFinished, setShopIntroFinished] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // AUTH
  useEffect(() => { if (auth) { const u = onAuthStateChanged(auth, setFirebaseUser); return () => u(); } }, []);

  // INIT
  useEffect(() => {
    const initApp = async () => {
        logToTaipanCRM(2, "ВХОД", "Открыл Mini App");
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            const user = tg.initDataUnsafe?.user;
            if (user?.first_name) setUserName(user.first_name.toUpperCase());
            if (user?.id && isFirebaseInitialized) {
                try {
                    await signInAnonymously(auth);
                    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', user.id.toString());
                    await setDoc(userRef, { chatId: user.id, userName: user.first_name || 'Агент', lastActive: serverTimestamp(), notified: false }, { merge: true });
                } catch (e) { console.error("Sync Error:", e); }
            }
        }
    };
    initApp();
    const t = setTimeout(() => setSpotsLeft(prev => prev > 2 ? prev - 1 : prev), 15000); 
    return () => clearTimeout(t);
  }, []);

  // ADMIN FETCH
  useEffect(() => {
      if (currentView === 'admin' && firebaseUser && isFirebaseInitialized) {
          const unsubscribe = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'app_visitors'), (snapshot) => {
              const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              usersData.sort((a, b) => (b.lastActive?.toMillis ? b.lastActive.toMillis() : 0) - (a.lastActive?.toMillis ? a.lastActive.toMillis() : 0));
              setVisitors(usersData.slice(0, 50)); 
          }, (e) => console.error("Admin fetch error:", e));
          return () => unsubscribe();
      }
  }, [currentView, firebaseUser]);

  const updateLead = useCallback((id, newData) => setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...newData } : lead)), []);
  const updateVisitor = useCallback(async (id, newData) => {
      if (!isFirebaseInitialized) return;
      try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'app_visitors', id), newData); } catch (e) { console.error("Error updating visitor:", e); }
  }, []);

  const openModal = useCallback((type) => { setModalType(type); setIsModalOpen(true); }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const handleNavigate = useCallback((view) => {
     if (view === 'shop') logToTaipanCRM(3, "ИНТЕРЕС", "Раздел: Магазин");
     if (view === 'education') logToTaipanCRM(3, "ИНТЕРЕС", "Раздел: Обучение");
     setCurrentView(view);
  }, []);

  const handleTitleClick = useCallback(() => {
      setTapCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) { setIsAdminAuthOpen(true); return 0; }
          return newCount;
      });
  }, []);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const name = e.target[0].value;
    const contact = e.target[1].value;
    const newLead = { id: Date.now(), name: name, contact: contact, type: modalType, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setLeads(prev => [newLead, ...prev]);
    logToTaipanCRM(6, "ГОРЯЧИЙ ЛИД 🔥", `Имя: ${name}\n🔹 Контакт: ${contact}\n🔹 Услуга: ${modalType}`);
    closeModal(); 
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000); 
    e.target.reset(); 
  };

  const handleAdminAuth = (e) => {
      e.preventDefault();
      if (e.target[0].value === 'admin') { setIsAdminAuthOpen(false); setCurrentView('admin'); logToTaipanCRM(2, "ADMIN", "Вход в админ панель"); } else { alert("ACCESS DENIED"); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      <GlobalStyles />
      {baneIntroActive && <BaneIntro onComplete={() => { setBaneIntroActive(false); setCurrentView('about'); }} />}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF9D]/5 rounded-full blur-[120px] animate-pulse"></div>
        <MatrixBackground />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-20">
        {currentView === 'main' && <MainView onNavigate={handleNavigate} openModal={openModal} setBaneIntroActive={setBaneIntroActive} userName={userName} handleTitleClick={handleTitleClick} />}
        {currentView === 'shop' && <ShopView onNavigate={handleNavigate} onBack={() => handleNavigate('main')} shopIntroFinished={shopIntroFinished} setShopIntroFinished={setShopIntroFinished} />}
        {currentView === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            <button onClick={() => handleNavigate('shop')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-2 animate-in slide-in-from-bottom duration-700">
                <div className="text-center px-4 w-full mb-2"><Wallet className="w-12 h-12 mx-auto text-[#00FF9D] mb-2 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)]" /><h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none">ВАША <span className="text-[#00FF9D]">ПРИБЫЛЬ</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Узнайте сколько вы теряете</p></div>
                <div className="w-full glass-card p-4 rounded-3xl border border-[#00FF9D]/20 relative overflow-hidden"><ProfitCalculator data={calcData} setData={setCalcData} onAction={() => handleNavigate('strategy')} /></div>
            </div>
          </div>
        )}
        {currentView === 'strategy' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
             <button onClick={() => handleNavigate('calculator')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
             <div className="flex-grow flex flex-col items-center w-full space-y-6 overflow-y-auto pb-20 no-scrollbar">
                <div className="text-center px-4 w-full"><h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none">КЕЙСЫ <span className="text-[#00FF9D]">ПАРТНЕРОВ</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Реальные магазины</p></div>
                <div className="w-full mb-4 flex flex-col items-center"><div className="w-2/3 max-w-[200px]" onClick={() => setPreviewImage("https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg")}><SmartImage src="https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg" className="rounded-[20px] w-full h-auto object-contain cursor-pointer" alt="Fashion Store Case" /></div></div>
                <div className="w-full mb-4 flex flex-col items-center"><div className="w-2/3 max-w-[200px]" onClick={() => setPreviewImage("https://i.ibb.co.com/ks9Sz9zz/5438294939344244554.jpg")}><SmartImage src="https://i.ibb.co.com/ks9Sz9zz/5438294939344244554.jpg" className="rounded-[20px] w-full h-auto object-contain cursor-pointer" alt="Romantic Store Case" /></div></div>
                <div className="w-full pt-4 pb-8"><button onClick={() => handleNavigate('roi')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 animate-pulse">УЗНАТЬ СТОИМОСТЬ И СРОКИ</button></div>
             </div>
          </div>
        )}
        {currentView === 'roi' && <RoiView profit={calculateProfit()} onBack={() => handleNavigate('strategy')} onAction={() => openModal('Start Project')} />}
        {currentView === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            <button onClick={() => handleNavigate('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center justify-center space-y-10 w-full">
              <div className="text-center px-4 w-full mb-10"><h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch']">Упущенные<br/><span className="text-[#00FF9D]">Возможности</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">История твоих сомнений</p></div>
              <div className="relative w-full h-[280px] flex items-center justify-center"><div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden">{slides.map((SlideComponent, idx) => (<div key={idx} className={`absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out transform ${activeSlide === idx ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-3xl'}`}><div className="relative w-full text-center"><div className="absolute inset-0 bg-white/5 blur-3xl rounded-full transform scale-150 left-1/2 -translate-x-1/2" /><div className="relative z-10"><SlideComponent isActive={activeSlide === idx} /></div></div></div>))}</div></div>
              <div className="text-center w-full px-6 flex justify-center mb-8"><p className="text-zinc-500 text-[12px] font-bold uppercase tracking-widest mr-[-0.1em] animate-pulse whitespace-nowrap">Не стань историей упущенных шансов</p></div>
            </div>
            <button onClick={() => handleNavigate('faq')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 text-xs">Стань тем кто успел</button>
          </div>
        )}
        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleNavigate('education')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              <div className="w-full mb-6"><Carousel3D /></div>
              <div className="w-full space-y-4">
                {faqItems.map((item) => (
                  <div key={item.id} onClick={() => { setActiveFaq(item); setShowCalculator(false); }} className="glass-card rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 hover:border-[#00FF9D]/30 transition-all">
                    <div className="flex items-center gap-4"><div className="bg-[#00FF9D]/10 p-2 rounded-full border border-[#00FF9D]/20">{item.icon}</div><h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors">{item.question}</h4></div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00FF9D] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => handleNavigate('program')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 text-xs">Смотреть программу</button>
          </div>
        )}
        {currentView === 'program' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleNavigate('faq')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              <div className="flex flex-col items-center text-center px-4 w-full mb-6 mx-auto max-w-sm"><h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase mb-2 font-['Chakra_Petch'] leading-tight">Модули обучения<br/><span className="text-[#00FF9D]">TAIPAN ACADEMY</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Система доминирования</p></div>
              <div className="w-full space-y-3">
                {[{ title: "Модуль 1: Быстрый старт", subtitle: "Запуск системы", desc: "Регистрируем бота и получаем API ключ." }, { title: "Модуль 2: Красивая витрина", subtitle: "Наполнение", desc: "Загружаем товары." }, { title: "Модуль 3: Автопилот", subtitle: "Платежи", desc: "Подключаем оплату и доставку." }].map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-start gap-3 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center justify-between w-full"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00FF9D]/10 text-[#00FF9D]"><CheckCircle2 className="w-5 h-5" /></div><div className="text-left"><h4 className="text-sm font-bold uppercase tracking-wider text-white">{item.title}</h4><p className="text-[10px] text-[#00FF9D] font-bold uppercase tracking-wider">{item.subtitle}</p></div></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20">
                <div className="mb-4 bg-red-500/10 border border-red-500/30 p-2 rounded-lg animate-pulse"><p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">🔥 Осталось мест: {spotsLeft} из 10</p><p className="text-[8px] text-zinc-500 mt-1">Следующая цена: 80 000 ₸</p></div>
                <div className="text-2xl font-black text-white mb-4 font-['Chakra_Petch']">50 000 ₸ <span className="text-zinc-600 text-lg line-through decoration-red-600 decoration-2 ml-2">80 000 ₸</span></div>
                <button onClick={() => { logToTaipanCRM(6, "ЖДЕТ КОНСУЛЬТАЦИЮ ⚡️", "Обучение"); window.open('https://t.me/taipanmedia', '_blank'); }} className="block w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">Получить подробную консультацию</button>
            </div>
          </div>
        )}
        {currentView === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            <button onClick={() => handleNavigate('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
                <div className="text-center px-4 w-full mb-4"><h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch'] whitespace-nowrap">КТО <span className="text-[#00FF9D]">МЫ</span></h2><p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">И КАКОЙ У НАС ПЛАН</p></div>
                <div className="relative w-full glass-card p-6 rounded-sm border border-[#00FF9D]/30 overflow-hidden bg-black/40 tactical-grid"><div className="absolute top-0 right-0 p-2 opacity-30"><Code className="w-16 h-16 text-[#00FF9D]" /></div><div className="absolute bottom-0 left-0 p-1 opacity-50 text-[8px] font-mono text-[#00FF9D]">SYS.INIT_SEQ_2026</div><p className="text-sm font-bold text-white mb-4 relative z-10 leading-relaxed font-mono uppercase border-l-2 border-[#00FF9D] pl-3">«Наш план: позволить таргету доводить каждого лида до товара, без молчания и тишины».</p></div>
                 <button onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-sm shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs mt-4 font-mono flex items-center justify-center gap-2"><Crosshair className="w-4 h-4" /> ОБСУДИТЬ ПЛАН</button>
            </div>
          </div>
        )}
        {currentView === 'admin' && <AdminPanel leads={leads} visitors={visitors} onBack={() => handleNavigate('main')} onClearLeads={() => setLeads([])} onUpdateLead={updateLead} onUpdateVisitor={updateVisitor} />}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,0,0,1)]">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8 cursor-pointer" onClick={closeModal} />
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Начать сейчас</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Ваше Имя" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all" />
              <input type="text" placeholder="@username" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all" />
              <button type="submit" className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl mt-4 text-xs">Связаться со мной</button>
            </form>
          </div>
        </div>
      )}
      {isAdminAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAdminAuthOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0A0A0A] border border-[#00FF9D]/50 p-6 rounded-sm shadow-[0_0_50px_rgba(0,255,157,0.1)]">
            <div className="text-center mb-6"><Shield className="w-12 h-12 text-[#00FF9D] mx-auto mb-2 animate-pulse" /><h2 className="text-xl font-black text-[#00FF9D] font-mono tracking-widest">SECURE LOGIN</h2></div>
            <form onSubmit={handleAdminAuth} className="space-y-4"><input type="password" placeholder="ACCESS CODE" required className="w-full bg-black border border-zinc-700 p-3 text-center text-[#00FF9D] font-mono tracking-[0.5em] focus:border-[#00FF9D] outline-none" autoFocus /><button type="submit" className="w-full bg-[#00FF9D] text-black font-bold font-mono tracking-widest py-3 hover:bg-[#00FF9D]/80">AUTHENTICATE</button></form>
          </div>
        </div>
      )}
      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300" onClick={() => setActiveFaq(null)} />
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setActiveFaq(null)} />
            <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-full bg-[#00FF9D]/10 text-[#00FF9D]">{activeFaq.icon}</div><h2 className="text-xl font-bold font-['Chakra_Petch'] leading-tight">{activeFaq.question}</h2></div>
            <div className="mb-4">{activeFaq.component}</div>
            {activeFaq.isCalc && !showCalculator && (<button onClick={() => setShowCalculator(true)} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse hover:scale-[1.02] transition-all text-xs">РАССЧИТАТЬ ПРИБЫЛЬ</button>)}
            {activeFaq.isCalc && showCalculator && (<div className="mt-6 border-t border-[#00FF9D]/20 pt-6"><ProfitCalculator data={calcData} setData={setCalcData} onAction={() => handleNavigate('strategy')} /></div>)}
            <button onClick={() => setActiveFaq(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}
      {previewImage && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
          <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <img src={previewImage} className="w-full h-full object-contain rounded-lg shadow-2xl" alt="Case Study Full" />
             <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors" onClick={() => setPreviewImage(null)}><X className="w-6 h-6" /></button>
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
