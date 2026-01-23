import React, { useState, useEffect, useRef } from 'react';
// --- FIREBASE INTEGRATION ---
// Импортируем уже настроенную базу и авторизацию из твоего отдельного файла
import { db, auth } from './firebaseConfig'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

// --- CRM LOGGING FUNCTION (GLOBAL) ---
const logToTaipanCRM = async (topicId, status, details = "") => {
  const token = "8398712805:AAHFZXllsCQU0YNd8KIo9Rie5VZeyH91GMQ";
  const chatId = "-1003690228596"; // Твой ID группы
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  const userLink = user?.username 
    ? `https://t.me/${user.username}` 
    : `tg://user?id=${user?.id}`;

  const message = `
📊 **СТАТУС: ${status}**
--------------------------
👤 **Юзер:** ${user?.first_name || 'Incognito'} (@${user?.username || 'нет'})
🆔 **ID:** \`${user?.id || '---'}\`
🔹 **Детали:** ${details}

👉 [НАПИСАТЬ КЛИЕНТУ](${userLink})
--------------------------
  `;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_thread_id: topicId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })
    });
  } catch (e) {
    console.error("Ошибка CRM:", e);
  }
};

// --- AUTO-GREETING FUNCTION ---
const sendWelcomeToUser = async () => {
  const token = "8398712805:AAHFZXllsCQU0YNd8KIo9Rie5VZeyH91GMQ";
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  if (!user?.id || sessionStorage.getItem("taipan_welcome_sent")) return;

  const message = "Привет! Вижу, ты заглянул в Taipan Media. Я — бот-помощник Вадима. Если появятся вопросы по магазинам или обучению — просто пиши сюда, я сразу передам команде!";

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: user.id,
        text: message
      })
    });
    sessionStorage.setItem("taipan_welcome_sent", "true");
  } catch (e) {
    console.error("Ошибка авто-приветствия:", e);
  }
};

// --- STYLES ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; }
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }

    .glass-card {
        background: rgba(20, 20, 20, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 255, 157, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(0, 255, 157, 0.2);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .glass-card:hover {
        background: rgba(0, 255, 157, 0.05);
        border-color: rgba(0, 255, 157, 0.4);
        box-shadow: 0 0 15px rgba(0, 255, 157, 0.1);
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .tactical-grid {
        background-image: linear-gradient(rgba(0, 255, 157, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 157, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    @keyframes contourPulse {
      0% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
      50% { filter: drop-shadow(0 0 6px rgba(0, 255, 157, 0.6)); opacity: 1; }
      100% { filter: drop-shadow(0 0 1px rgba(0, 255, 157, 0.3)); opacity: 0.8; }
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

// --- ICON COMPONENTS ---
const GraduationCap = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>);
const ArrowRight = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>);
const ChevronLeft = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>);
const CheckCircle2 = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>);
const Lock = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const TrendingUp = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>);
const Wallet = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>);
const X = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>);
const Zap = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>);
const Search = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>);
const Users = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const Shield = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const Crosshair = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>);
const Code = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);

const TelegramLogoMain = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
);

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
             e.target.style.display = 'none';
           }
        }}
        className={`${className} transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
      />
    </div>
  );
};

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

const BaneIntro = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const audio = new Audio('/VID_20260122_010534_539 (online-audio-converter.com).mp3');
        audio.volume = 1.0;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio autoplay prevented:", error);
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

const HackerProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <SmartImage src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" className="w-full object-cover" alt="Encrypted Proof" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10"><Search className="w-3 h-3 text-[#00FF9D]" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10"></div>
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
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const ClientDemandProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full object-cover opacity-90 filter grayscale-[0.5] contrast-[1.1] brightness-[0.9]" alt="Client Demand" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30 z-10"><Search className="w-3 h-3 text-[#00FF9D]" /></div>
        <div className="absolute bottom-3 left-3 bg-black/80 border border-[#00FF9D]/30 px-2 py-1 rounded z-20">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div><span className="text-[9px] font-mono text-[#00FF9D]">DEMAND_HIGH</span></div>
        </div>
      </div>
       {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
          <div className="relative w-full max-w-2xl">
             <SmartImage src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]" alt="Demand Full" />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const SkillScanner = () => (
  <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500 group">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
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
        <div className="mt-4 p-2 bg-[#00FF9D]/5 rounded border border-[#00FF9D]/10 text-center relative overflow-hidden"><p className="text-[9px] text-[#00FF9D] font-black tracking-widest uppercase relative z-10">ВЕРДИКТ: ИДЕАЛЬНО ДЛЯ НОВИЧКОВ</p></div>
    </div>
  </div>
);

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
      </div>
    </div>
  );
};

const WordstatGraph = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <React.Fragment>
      <div className="w-full bg-[#1c1c1e] rounded-xl border border-zinc-700 overflow-hidden mb-6 font-sans shadow-xl cursor-zoom-in relative group" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
        <div className="bg-[#242426] px-4 py-3 border-b border-zinc-700 flex justify-between items-center">
          <div><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="text-[11px] text-zinc-300 font-bold">История запросов (Яндекс Вордстат)</span></div><p className="text-[13px] text-white mt-0.5 font-medium">«телеграм магазин»</p></div>
          <div className="text-right"><p className="text-[16px] font-bold text-white">6 650</p></div>
        </div>
        <div className="relative w-full h-auto">
          <SmartImage src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" alt="Real Wordstat Data" className="w-full h-auto object-cover opacity-90 transition-opacity duration-300" />
        </div>
      </div>
       {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
          <div className="relative w-full max-w-4xl"><SmartImage src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" className="w-full h-auto rounded-lg border border-zinc-700 shadow-2xl" alt="Wordstat Full" /></div>
        </div>
      )}
    </React.Fragment>
  );
};

const BrandLogos = {
  Bitcoin: ({ isActive }) => {
    const [isMissed, setIsMissed] = useState(false);
    useEffect(() => {
      if (isActive) {
        setIsMissed(false);
        const timer = setTimeout(() => {
          setIsMissed(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <svg viewBox="0 0 24 24" fill="#F7931A" className={`w-16 h-16 mb-4 transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80 drop-shadow-[0_0_15px_rgba(247,147,26,0.5)]'}`}><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.695 8.47-1.216 14.9-.388c6.426 1.602 10.34 8.09 8.738 15.292zM18.106 10.12c.264-1.765-1.08-2.71-2.914-3.344l.596-2.39-1.454-.362-.58 2.33c-.382-.096-.776-.186-1.166-.273l.586-2.355-1.454-.362-.596 2.39c-.316-.072-.625-.144-.925-.218l.002-.008-2.007-.502-.388 1.55s1.08.247 1.057.263c.59.147.696.537.678.847l-.68 2.73c.04.01.094.026.152.05-.054-.014-.112-.03-.17-.044l-1.103 4.426c-.072.178-.254.445-.664.343.014.02-1.057-.263-1.057-.263l-.723 1.67 1.894.474c.35.088.694.18 1.034.266l-.604 2.43 1.452.362.598-2.396c.396.108.783.21 1.16.307l-.592 2.38 1.454.363.604-2.43c2.482.47 4.35.28 5.136-1.965.634-1.808-.032-2.852-1.336-3.535 1.03-.238 1.81-.916 2.02-2.31zM14.47 14.524c-.45 1.81-3.5 0.83-4.484.588l.8-3.212c.983.244 4.14.726 3.684 2.624zm.45-4.44c-.41 1.644-2.96.81-3.774.606l.724-2.912c.814.204 3.468.583 3.05 2.306z"/></svg>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-[#F7931A]'}`}>2009: BITCOIN</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
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
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-16 h-16 mb-4 transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80 drop-shadow-[0_0_15px_rgba(225,48,108,0.5)]'}`}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-[#E1306C]'}`}>2012: INSTAGRAM</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
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
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isActive]);
    return (
      <div className={`flex flex-col items-center animate-in fade-in zoom-in duration-1000 relative ${isMissed ? 'animate-[glitch_0.6s_linear]' : ''}`}>
        <div className={`flex gap-3 mb-4 items-center transition-all duration-1000 ${isMissed ? 'opacity-30 grayscale' : 'opacity-80'}`}><span className="text-4xl font-black italic text-purple-500">WB</span><span className="text-3xl font-bold text-red-600">Kaspi</span></div>
        <div className="relative">
          <p className={`font-['Chakra_Petch'] font-black text-xl tracking-tighter transition-all duration-700 ${isMissed ? 'text-zinc-600 line-through decoration-red-600/80 decoration-[3px]' : 'text-white'}`}>2019: МАРКЕТПЛЕЙСЫ</p>
          <div className={`absolute -top-3 -right-8 rotate-[15deg] border-2 border-red-600/60 text-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-sm bg-red-900/10 transition-all duration-500 transform ${isMissed ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>УПУЩЕНО</div>
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
         return (
           <div key={i} className={`absolute transition-all duration-700 w-[320px] h-[180px] flex items-center justify-center ${styleClass}`}>
              <img src={img} alt="Notification" className="max-w-full max-h-full object-contain rounded-[32px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]" />
           </div>
         )
       })}
    </div>
  );
};

const ShopIntroSequence = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => { onComplete(); }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] px-4 cursor-pointer" onClick={onComplete}>
       <div className="w-full text-center max-w-3xl animate-in fade-in duration-1000">
         <h2 className="text-lg sm:text-2xl font-light uppercase tracking-[0.2em] font-['Outfit'] text-zinc-300">МЕНЬШЕ ДИАЛОГОВ — БОЛЬШЕ ДЕНЕГ.</h2>
         <div className="relative inline-block mt-6">
             <h2 className="text-3xl sm:text-5xl font-black uppercase font-['Chakra_Petch'] text-transparent bg-clip-text bg-gradient-to-r from-[#444] via-[#00FF9D] to-[#444] bg-[length:200%_auto] animate-[snakeFlow_3s_linear_infinite] tracking-widest">СПАСАЕМ ОТ 20% УПУЩЕННОЙ ПРИБЫЛИ</h2>
         </div>
       </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('main'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [baneIntroActive, setBaneIntroActive] = useState(false);
  const [userName, setUserName] = useState('AGENT');
  const [spotsLeft, setSpotsLeft] = useState(4);

  useEffect(() => {
    const initApp = async () => {
        logToTaipanCRM(2, "ВХОД", "Открыл Mini App");
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            const user = tg.initDataUnsafe?.user;
            if (user?.first_name) {
                setUserName(user.first_name.toUpperCase());
            }

            if (user?.id) {
                try {
                    await signInAnonymously(auth);
                    const userRef = doc(db, "users", user.id.toString());
                    await setDoc(userRef, {
                        chatId: user.id,
                        userName: user.first_name || 'Агент',
                        lastActive: serverTimestamp(),
                        notified: false
                    }, { merge: true });
                } catch (e) {
                    console.error("Firebase Error:", e);
                }
            }
        }
    };
    initApp();
  }, []);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 16)); 
    const interval = setInterval(() => { setOnlineCount(Math.floor(Math.random() * 16)); }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const [calcData, setCalcData] = useState({ traffic: 0, conversion: 0, avgCheck: 0, margin: 0 });
  const calculateProfit = () => {
      const sales = Math.floor(calcData.traffic * (calcData.conversion / 100));
      const revenue = sales * calcData.avgCheck;
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
        ctx.fillText(text, i * 25, drops[i] * 25);
        if (drops[i] * 25 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    initMatrix();
    const interval = setInterval(drawMatrix, 75);
    return () => clearInterval(interval);
  }, []);

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const name = e.target[0].value;
    const contact = e.target[1].value;
    logToTaipanCRM(6, "ГОРЯЧИЙ ЛИД 🔥", `Имя: ${name}\n🔹 Контакт: ${contact}\n🔹 Услуга: ${modalType}`);
    closeModal(); 
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000); 
  };

  const handleFaqClick = (item) => { setActiveFaq(item); setShowCalculator(false); };
  const closeFaq = () => { setActiveFaq(null); setShowCalculator(false); };

  const faqItems = [
    { id: 'stats', question: "Это вообще покупают?", icon: <TrendingUp className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><WordstatGraph /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4">Это официальная статистика Яндекса: 6 650 прямых запросов в месяц.</p></div>) },
    { id: 'proof', question: "А это реально работает?", icon: <Lock className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><HackerProof /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4">Пока ты сомневаешься, Карашаш прошла наше обучение и уже забирает свои 100 000₸.</p></div>) },
    { id: 'difficulty', question: "А сложно это делать?", icon: <Zap className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><SkillScanner /> <SetupTimeline /></div>) },
    { id: 'calc', question: "Найду ли я клиентов?", icon: <Wallet className="w-5 h-5 text-[#00FF9D]" />, isCalc: true, component: (<div className="w-full"><ClientDemandProof /></div>) }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden flex flex-col">
      <GlobalStyles />
      {baneIntroActive && <BaneIntro onComplete={() => { setBaneIntroActive(false); setCurrentView('about'); }} />}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-20">
        {currentView === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
            <div className="mb-14 w-full text-center">
              <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] text-center w-full" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)' }}>TAIPAN MEDIA</h1>
              <div className="flex items-center justify-center gap-4 mt-3 w-full">
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-700"></div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-[#00FF9D] font-bold animate-pulse">ПРИВЕТ, {userName}</p>
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
              <div onClick={() => { setShopIntroFinished(false); setCurrentView('shop'); }} className="group glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <TelegramLogoMain className="w-12 h-12 mb-6 animate-[contourPulse_3s_ease-in-out_infinite]" />
                <h3 className="text-lg font-bold uppercase tracking-wide">Telegram Store</h3>
              </div>
              <div onClick={() => setCurrentView('education')} className="group glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <GraduationCap className="w-12 h-12 mb-6 animate-[contourPulse_3s_ease-in-out_infinite]" />
                <h3 className="text-lg font-bold uppercase tracking-widest">ОБУЧЕНИЕ</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <div onClick={() => openModal('Mini App')} className="glass-card rounded-3xl p-6 h-40 flex flex-col items-center justify-center cursor-pointer">
                    <h3 className="text-lg font-bold uppercase tracking-widest">MINI APP</h3>
                </div>
                 <div onClick={() => setBaneIntroActive(true)} className="glass-card rounded-3xl p-6 h-40 flex flex-col items-center justify-center cursor-pointer">
                    <Users className="w-8 h-8 mb-3 text-zinc-500" />
                    <h3 className="text-lg font-bold uppercase tracking-widest">КТО МЫ?</h3>
                </div>
            </div>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {!shopIntroFinished ? <ShopIntroSequence onComplete={() => setShopIntroFinished(true)} /> : (
              <React.Fragment>
                <button onClick={() => setCurrentView('main')} className="flex items-center text-[10px] text-[#00FF9D] uppercase font-bold mb-6"><ChevronLeft className="w-4 h-4" /> Назад</button>
                <div className="text-center mb-10"><h2 className="text-3xl font-black font-['Chakra_Petch']">TELEGRAM <span className="text-[#00FF9D]">STORE</span></h2></div>
                <button onClick={() => setCurrentView('calculator')} className="w-full bg-[#00FF9D] text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] animate-pulse text-xs">РАССЧИТАТЬ УПУЩЕННУЮ ПРИБЫЛЬ</button>
              </React.Fragment>
            )}
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <button onClick={() => setCurrentView('shop')} className="flex items-center text-[10px] text-[#00FF9D] uppercase font-bold mb-4"><ChevronLeft className="w-4 h-4" /> Назад</button>
            <ProfitCalculator data={calcData} setData={setCalcData} onAction={() => setCurrentView('strategy')} />
          </div>
        )}

        {currentView === 'strategy' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col space-y-6">
             <button onClick={() => setCurrentView('calculator')} className="flex items-center text-[10px] text-[#00FF9D] uppercase font-bold mb-4"><ChevronLeft className="w-4 h-4" /> Назад</button>
             <h2 className="text-2xl font-black font-['Chakra_Petch'] text-center">КЕЙСЫ <span className="text-[#00FF9D]">ПАРТНЕРОВ</span></h2>
             <div className="w-full flex flex-col items-center">
                <SmartImage src="https://i.ibb.co.com/gMTG4QXt/5438294939344244553.jpg" className="rounded-2xl w-2/3" alt="Case" />
                <p className="text-[10px] text-zinc-400 mt-4 text-center">КЕЙС «КАСТРЮЛЬКА ЕДЫ»: +43% к чекам за счет пуш-уведомлений в 18:00.</p>
             </div>
             <button onClick={() => setCurrentView('roi')} className="w-full bg-[#00FF9D] text-black font-black py-4 rounded-xl text-xs">УЗНАТЬ СТОИМОСТЬ</button>
          </div>
        )}

        {currentView === 'roi' && (
           <RoiView profit={calculateProfit()} onBack={() => setCurrentView('strategy')} onAction={() => openModal('Start Project')} />
        )}

        {currentView === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col items-center">
            <button onClick={() => setCurrentView('main')} className="self-start text-[10px] text-[#00FF9D] uppercase font-bold mb-6"><ChevronLeft className="w-4 h-4" /> Назад</button>
            <div className="h-[280px] w-full flex items-center justify-center">
                {slides.map((Slide, idx) => activeSlide === idx && <Slide key={idx} isActive={true} />)}
            </div>
            <button onClick={() => setCurrentView('faq')} className="w-full bg-[#00FF9D] text-black font-black py-6 rounded-3xl text-xs mt-10">Стань тем кто успел</button>
          </div>
        )}

        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-4">
            <button onClick={() => setCurrentView('education')} className="text-[10px] text-[#00FF9D] uppercase font-bold mb-6"><ChevronLeft className="w-4 h-4" /> Назад</button>
            <Carousel3D />
            {faqItems.map((item) => (
              <div key={item.id} onClick={() => handleFaqClick(item)} className="glass-card rounded-2xl p-5 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">{item.icon}<h4 className="text-sm font-bold">{item.question}</h4></div>
                <ArrowRight className="w-4 h-4 text-[#00FF9D]" />
              </div>
            ))}
            <button onClick={() => setCurrentView('program')} className="w-full bg-[#00FF9D] text-black font-black py-6 rounded-3xl text-xs">Смотреть программу</button>
          </div>
        )}

        {currentView === 'program' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-6">
            <button onClick={() => setCurrentView('faq')} className="text-[10px] text-[#00FF9D] uppercase font-bold mb-6"><ChevronLeft className="w-4 h-4" /> Назад</button>
            <h2 className="text-center text-2xl font-black font-['Chakra_Petch'] uppercase">Модули обучения</h2>
            <div className="space-y-3">
                {["Быстрый старт", "Красивая витрина", "Автопилот", "Карта прибыли"].map((title, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                    <CheckCircle2 className="text-[#00FF9D]" />
                    <span className="font-bold text-sm">Модуль {i+1}: {title}</span>
                  </div>
                ))}
            </div>
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">🔥 Осталось мест: {spotsLeft} из 10</p>
            </div>
            <button onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="w-full bg-[#00FF9D] text-black font-black py-4 rounded-xl text-xs">Получить консультацию</button>
          </div>
        )}

        {currentView === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-6">
            <button onClick={() => setCurrentView('main')} className="text-[10px] text-[#00FF9D] uppercase font-bold mb-6"><ChevronLeft className="w-4 h-4" /> Назад</button>
            <div className="glass-card p-6 rounded-sm border border-[#00FF9D]/30 tactical-grid">
                <p className="text-sm font-bold font-mono border-l-2 border-[#00FF9D] pl-3">«Наш план: доводить каждого лида до товара без молчания».</p>
            </div>
            <button onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="w-full bg-[#00FF9D] text-black font-black py-4 rounded-sm text-xs font-mono">ОБСУДИТЬ ПЛАН</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 shadow-[0_-10px_50px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold text-center mb-6">Начать сейчас</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Ваше Имя" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#00FF9D]/50 outline-none" />
              <input type="text" placeholder="@username" required className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-[#00FF9D]/50 outline-none" />
              <button type="submit" className="w-full bg-[#00FF9D] text-black font-black py-5 rounded-2xl text-xs">Связаться со мной</button>
            </form>
          </div>
        </div>
      )}

      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" onClick={closeFaq} />
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">{activeFaq.icon}<h2 className="text-xl font-bold font-['Chakra_Petch']">{activeFaq.question}</h2></div>
            {activeFaq.component}
            <button onClick={closeFaq} className="absolute top-6 right-6 text-zinc-500"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in zoom-in">
          <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          <span className="text-xs font-bold uppercase">Запрос принят</span>
        </div>
      )}
    </div>
  );
};

export default App;
