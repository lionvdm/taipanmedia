import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- СТИЛИ ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; overflow-x: hidden; }
    /* Скрытие скроллбара */
    ::-webkit-scrollbar { display: none; }
    body { -ms-overflow-style: none; scrollbar-width: none; }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }

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
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* --- ROBOT ANIMATIONS --- */
    @keyframes robotFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes robotPatrol {
      0% { transform: translateX(0) scaleX(1); }
      45% { transform: translateX(-100px) scaleX(1); }
      50% { transform: translateX(-100px) scaleX(-1); } /* Turn around */
      95% { transform: translateX(0) scaleX(-1); }
      100% { transform: translateX(0) scaleX(1); } /* Turn back */
    }
    @keyframes robotBlink {
      0%, 90%, 100% { transform: scaleY(1); }
      95% { transform: scaleY(0.1); }
    }
    @keyframes robotHandWave {
      0%, 100% { transform: rotate(-10deg); }
      50% { transform: rotate(10deg); }
    }
    @keyframes robotSleep {
      0%, 100% { transform: translateY(5px) scale(0.95); opacity: 0.8; }
      50% { transform: translateY(8px) scale(0.97); opacity: 0.6; }
    }
    @keyframes robotHappyJump {
      0%, 100% { transform: translateY(0) scale(1); }
      30% { transform: translateY(-15px) scale(1.1); }
      50% { transform: translateY(0) scale(0.95); }
      70% { transform: translateY(-8px) scale(1.05); }
    }
    @keyframes robotGlitch {
      0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
      20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
      40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
      80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
      100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
    }
    @keyframes robotCleaning {
      0% { transform: translateX(0) rotate(0deg); }
      25% { transform: translateX(-10px) rotate(-5deg); }
      50% { transform: translateX(0) rotate(0deg); }
      75% { transform: translateX(10px) rotate(5deg); }
      100% { transform: translateX(0) rotate(0deg); }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
    }
    .robot-confetti span {
      position: absolute;
      width: 5px;
      height: 5px;
      background: #00FF9D;
      animation: confettiFall 2s linear infinite;
    }
    
    /* NEW ANIMATIONS FOR MODES */
    @keyframes capDrop {
      0% { transform: translateY(-40px) rotate(-10deg); opacity: 0; }
      60% { transform: translateY(5px) rotate(5deg); opacity: 1; }
      80% { transform: translateY(-2px) rotate(-2deg); }
      100% { transform: translateY(0) rotate(0deg); opacity: 1; }
    }
    @keyframes tasselSwing {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(15deg); }
    }
    @keyframes dollarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @keyframes slotEnter {
       0% { transform: translateY(-20px); opacity: 0; filter: blur(5px); }
       100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }

    /* Existing animations */
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
  `}} />
);

// --- MEMORY SERVICE ---
const RobotMemory = {
  save: (key, value) => {
    try {
      const data = JSON.parse(localStorage.getItem('taipan_robot_memory') || '{}');
      data[key] = value;
      localStorage.setItem('taipan_robot_memory', JSON.stringify(data));
    } catch (e) { console.error("Memory Error", e); }
  },
  get: (key) => {
    try {
      const data = JSON.parse(localStorage.getItem('taipan_robot_memory') || '{}');
      return data[key];
    } catch (e) { return null; }
  }
};

// --- DIALOGUE MATRIX ---
const ROBOT_PHRASES = {
  business: [
    "Цифры любят тишину и точность. Не подведи.",
    "Это твоя прибыль или сдача с магазина? Шучу, давай считать.",
    "Бизнес не прощает ошибок в расчетах. Сосредоточься.",
    "Эффективность на максимуме. Мне нравится этот темп.",
    "Каждая копейка должна работать. Иначе зачем это всё?",
    "Анализирую потенциал... Выглядит аппетитно."
  ],
  education: [
    "Смотри, всё проще, чем кажется. Просто двигай блоки!",
    "Код не кусается. Ну, почти. Но я рядом, бро.",
    "Ты справляешься лучше, чем мой разработчик в первый день!",
    "Главное — не сдаваться. Даже когда консоль красная.",
    "Бро, ты делаешь историю. Продолжай в том же духе!",
    "Шаг за шагом. Мы построим этот космолет."
  ],
  highProfit: [
    "Ого! С такими цифрами мы скоро купим сервер на Марсе! Работаем!",
    "Я чувствую запах денег... много денег!",
    "Это законно быть таким богатым? Шучу, работаем!"
  ],
  glitch: [
    "Эррор! Ты ввел что-то не то! Мои цепи плавятся!",
    "Отрицательная прибыль? Мы что, благотворительный фонд?",
    "Системный сбой! Логика покинула чат."
  ],
  poke: [
    "Ой! Хватит меня тыкать! Я же не сенсорная панель в Тесле!",
    "Эй, щекотно! Или больно... У меня нет нервов, но всё же!",
    "Еще раз ткнешь — уйду в спящий режим навсегда."
  ],
  night: [
    "Ночной кодинг? Или ночной обсчет прибыли? В любом случае — уважение от системы.",
    "Город спит, просыпается мафия и мы. Работаем.",
    "В это время сервера летают быстрее. Отличный выбор."
  ],
  return: [
    "Я уж думал, ты ушел на завод... Рад, что ты вернулся в игру!",
    "О, живой человек! Я начал скучать.",
    "Возвращение легенды! Продолжаем?"
  ],
  strategy: [
    "О, выбор чемпиона! Готовлю отчет, который перевернет твое представление о деньгах...",
    "Стратегия — это мост в будущее. Строим!",
    "Серьезный подход. Уважаю."
  ],
  fourthWall: [
    "Слушай, а этот дизайн интерфейса тебе нравится? Я сам выбирал этот оттенок зеленого.",
    "Ты тоже чувствуешь, что мы внутри симуляции? Или это только у меня пинг высокий?",
    "Надеюсь, ты не бот. А то было бы неловко разговаривать с коллегой."
  ],
  batteryLow: [
    "Бро, у тебя зарядка садится! Быстрее сохраняй токен, а то я погасну вместе с твоими мечтами!",
    "Энергия на исходе! Подключись к матрице, срочно!",
    "Я теряю мощность... найди розетку, человек!"
  ],
  taxCollector: [
    "Эй, я проверил счета, там пыль. Пошли что-нибудь посчитаем?",
    "Калькулятор скучает. Деньги сами себя не посчитают, бро.",
    "Давно не виделись в бухгалтерии. Зайдем?"
  ],
  educationCritic: [
    "Ты точно всё прочитал? Или просто хочешь кнопку 'Бабло'? Так не работает, вернись и вникни!",
    "Слишком быстро! Ты что, Нео, чтобы загружать знания прямо в мозг?",
    "Не скипай туториал, в жизни автосейвов нет!"
  ],
  cleaner: [
    "Подметаю лишние байты... У нас тут должно быть чисто, как в швейцарском банке.",
    "Оптимизирую пространство... Убираю цифровой мусор.",
    "Чистота — залог высокой конверсии. Протираю экран изнутри."
  ]
};

const getRandomPhrase = (category) => {
  const list = ROBOT_PHRASES[category] || ["Я тут."];
  return list[Math.floor(Math.random() * list.length)];
};

// --- COMPONENT: TAIPAN ROBOT (CUTE WHITE VERSION) ---
const TaipanRobot = ({ mood, message, showBubble, onRobotClick, currentView }) => {
  // Determine specialized modes based on view (FIXED TO INCLUDE SUB-PAGES)
  const isShopMode = ['shop', 'calculator', 'strategy', 'roi'].includes(currentView);
  const isEducationMode = ['education', 'faq', 'program'].includes(currentView);

  // Force style overrides based on module
  // If in Shop, ALWAYS GOLD. If Education, ALWAYS Scholar colors.
  const robotColor = isShopMode ? '#FFD700' : '#ffffff'; 
  const strokeColor = isShopMode ? '#B8860B' : '#ccc';
  
  // Confetti colors
  const confettiColor = isShopMode ? '#FFD700' : '#00FF9D';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end cursor-pointer" onClick={onRobotClick}>
      {/* Speech Bubble */}
      <div className={`
        bg-white border border-white/50 p-3 rounded-2xl rounded-tr-none mb-3 max-w-[200px] 
        shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 transform origin-bottom-right pointer-events-none
        ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'}
      `}>
        <p className="text-[10px] text-black font-bold leading-snug font-['Chakra_Petch']">
          {message}
        </p>
      </div>

      {/* Robot Container with Animations */}
      <div className={`
        w-24 h-24 relative flex items-center justify-center transition-all duration-700
        ${mood === 'sleeping' ? 'animate-[robotSleep_3s_infinite_ease-in-out]' : ''}
        ${mood === 'celebrating' ? 'animate-[robotHappyJump_1s_infinite]' : ''}
        ${mood === 'error' ? 'animate-[robotGlitch_0.3s_infinite]' : ''}
        ${mood === 'active' ? 'animate-[robotPatrol_10s_infinite_linear]' : ''}
        ${mood === 'cleaning' ? 'animate-[robotCleaning_2s_infinite]' : ''}
      `}>
        {/* Confetti */}
        {mood === 'celebrating' && (
          <div className="absolute inset-0 -top-10 robot-confetti">
            <span style={{left: '10%', animationDelay: '0s', background: confettiColor}}></span>
            <span style={{left: '30%', animationDelay: '0.2s', background: confettiColor}}></span>
            <span style={{left: '50%', animationDelay: '0.4s', background: confettiColor}}></span>
            <span style={{left: '70%', animationDelay: '0.6s', background: confettiColor}}></span>
            <span style={{left: '90%', animationDelay: '0.8s', background: confettiColor}}></span>
          </div>
        )}

        {/* Robot Body Group */}
        <div className={`relative transition-all duration-500 ${mood === 'bored' ? 'grayscale opacity-70' : ''}`}>
           {/* Soft Glow - Changes with Mode */}
           <div className={`
             absolute inset-0 blur-2xl opacity-30 rounded-full transition-colors duration-500
             ${isShopMode ? 'bg-[#FFD700] opacity-50' : ''}
             ${isEducationMode ? 'bg-blue-300 opacity-30' : ''}
             ${mood === 'error' ? 'bg-yellow-500 opacity-60' : ''}
           `}></div>
           
           {/* CUTE WHITE ROBOT SVG */}
           <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-2xl overflow-visible">
             <defs>
               <linearGradient id="whiteBody" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor={robotColor} />
                 <stop offset="100%" stopColor={isShopMode ? '#e6c200' : "#e0e0e0"} />
               </linearGradient>
               <filter id="cuteGlow">
                 <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>

             {/* HEAD (Rounded White) */}
             <rect x="25" y="20" width="50" height="40" rx="18" fill="url(#whiteBody)" stroke={strokeColor} strokeWidth="1" />
             
             {/* FACE SCREEN (Glossy Black) */}
             <rect x="30" y="28" width="40" height="24" rx="10" fill="#111" stroke="#333" strokeWidth="1" />
             
             {/* EYES Logic - STRICT Mode Enforcement */}
             <g className={mood === 'sleeping' ? '' : 'animate-[robotBlink_4s_infinite]'}>
                {/* Shop Mode: Dollar Eyes (ALWAYS unless Error) */}
                {isShopMode && mood !== 'error' ? (
                   <g className="animate-[slotEnter_0.5s_ease-out]">
                      <text x="36" y="45" fontSize="14" fill="#00FF9D" fontWeight="bold" fontFamily="monospace" className="animate-[dollarPulse_1.5s_infinite]">$</text>
                      <text x="58" y="45" fontSize="14" fill="#00FF9D" fontWeight="bold" fontFamily="monospace" className="animate-[dollarPulse_1.5s_infinite]">$</text>
                   </g>
                ) : mood === 'sleeping' ? (
                   <>
                     <path d="M38 40 Q42 42 46 40" stroke="#0088cc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                     <path d="M54 40 Q58 42 62 40" stroke="#0088cc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                     <text x="50" y="20" textAnchor="middle" fill="#0088cc" fontSize="10" fontFamily="monospace" className="animate-pulse">Zzz</text>
                   </>
                ) : mood === 'celebrating' ? (
                   <>
                     <path d="M36 42 L40 38 L44 42" stroke="#F7931A" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                     <path d="M56 42 L60 38 L64 42" stroke="#F7931A" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                     {/* Blush */}
                     <circle cx="34" cy="46" r="2" fill="#F7931A" opacity="0.5" />
                     <circle cx="66" cy="46" r="2" fill="#F7931A" opacity="0.5" />
                   </>
                ) : mood === 'error' ? (
                   <>
                      {/* X Eyes */}
                      <path d="M36 38 L44 46 M44 38 L36 46" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M56 38 L64 46 M64 38 L56 46" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
                   </>
                ) : (
                   /* Default / Education Eyes */
                   <>
                     <ellipse cx="40" cy="40" rx={isEducationMode ? "6" : "5"} ry={isEducationMode ? "8" : "7"} fill="#00FF9D" filter="url(#cuteGlow)" />
                     <ellipse cx="60" cy="40" rx={isEducationMode ? "6" : "5"} ry={isEducationMode ? "8" : "7"} fill="#00FF9D" filter="url(#cuteGlow)" />
                     <circle cx="42" cy="38" r={isEducationMode ? "2" : "1.5"} fill="white" opacity="0.8" />
                     <circle cx="62" cy="38" r={isEducationMode ? "2" : "1.5"} fill="white" opacity="0.8" />
                   </>
                )}
             </g>

             {/* BODY */}
             <path d="M35 60 L65 60 L60 75 Q50 80 40 75 Z" fill="url(#whiteBody)" stroke={strokeColor} strokeWidth="1" />
             
             {/* HANDS */}
             {mood === 'cleaning' ? (
                <>
                  <circle cx="28" cy="65" r="5" fill={robotColor} stroke={strokeColor} strokeWidth="1" className="animate-[robotHandWave_0.5s_infinite_ease-in-out]" />
                  <line x1="28" y1="65" x2="10" y2="90" stroke="#8B4513" strokeWidth="3" /> 
                  <path d="M5 90 L15 90 L18 100 L2 100 Z" fill="#F4A460" /> 
                  <circle cx="72" cy="65" r="5" fill={robotColor} stroke={strokeColor} strokeWidth="1" />
                </>
             ) : (
               <>
                  <circle cx="28" cy="65" r="5" fill={robotColor} stroke={strokeColor} strokeWidth="1" className="animate-[robotHandWave_2s_infinite_ease-in-out]" style={{transformOrigin: '28px 65px'}} />
                  <circle cx="72" cy="65" r="5" fill={robotColor} stroke={strokeColor} strokeWidth="1" className="animate-[robotHandWave_2s_infinite_ease-in-out_reverse]" style={{transformOrigin: '72px 65px'}} />
               </>
             )}

             {/* ANTENNA */}
             <line x1="50" y1="20" x2="50" y2="12" stroke="#ccc" strokeWidth="2" />
             <circle cx="50" cy="12" r="3" fill={mood === 'active' ? '#00FF9D' : (mood === 'error' ? '#FFD700' : '#999')} className={mood === 'active' || mood === 'error' ? 'animate-pulse' : ''} />

             {/* EDUCATION MODE: Graduation Cap (ALWAYS ON in Education) */}
             {isEducationMode && (
                <g className="animate-[capDrop_0.8s_ease-out_forwards]">
                   <path d="M30 15 L50 20 L70 15 L50 10 Z" fill="#222" stroke="#000" strokeWidth="1" />
                   <path d="M30 15 L50 20 L50 26 L30 20 Z" fill="#333" /> 
                   <path d="M50 20 L70 15 L70 21 L50 26 Z" fill="#111" />
                   <g className="animate-[tasselSwing_2s_infinite_ease-in-out]" style={{transformOrigin: '50px 15px'}}>
                      <line x1="50" y1="15" x2="65" y2="25" stroke="#00FF9D" strokeWidth="2" />
                      <circle cx="65" cy="25" r="2" fill="#00FF9D" />
                   </g>
                </g>
             )}

           </svg>
        </div>
      </div>
    </div>
  );
};

// --- ХУК ДЛЯ АНИМАЦИИ ЦИФР ---
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

// --- Компоненты Иконок ---
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
const TelegramLogoMain = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
);

// --- Новый компонент: SmartImage ---
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

// --- Компонент Поля Ввода ---
const InputField = ({ label, value, setValue, suffix = "", onFocus, onBlur }) => (
  <div className="mb-2">
    <label className="block text-[9px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        value={value === 0 ? '' : value} 
        onChange={(e) => setValue(Number(e.target.value))}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="0"
        className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl p-2.5 text-white focus:border-[#00FF9D]/50 outline-none transition-all font-['Chakra_Petch'] text-sm appearance-none placeholder-zinc-700"
      />
      {suffix && <span className="absolute right-4 top-2.5 text-zinc-500 text-xs font-bold pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

// --- Компонент Калькулятора Прибыли ---
const ProfitCalculator = ({ onAction, data, setData, onTrigger, onInputChange }) => {
  const sales = Math.floor(data.traffic * (data.conversion / 100));
  const revenue = sales * data.avgCheck;
  const profit = Math.floor(revenue * (data.margin / 100));
  
  const animatedProfit = useOdometer(profit);
  const animatedSales = useOdometer(sales);

  const hasCelebrated = useRef(false);

  // Validate Negative Inputs for Glitch
  useEffect(() => {
     if (data.traffic < 0 || data.conversion < 0 || data.avgCheck < 0 || data.margin < 0) {
         if (onTrigger) onTrigger(getRandomPhrase('glitch'), 'error');
     }
  }, [data, onTrigger]);

  useEffect(() => {
    if (profit > 1000000 && !hasCelebrated.current) {
      if (onTrigger) onTrigger(getRandomPhrase('highProfit'), 'celebrating');
      hasCelebrated.current = true;
    } else if (profit < 1000000) {
      hasCelebrated.current = false;
    }
  }, [profit, onTrigger]);

  const handleFocus = () => {
    if (onTrigger) onTrigger(getRandomPhrase('business'), 'active'); 
  };

  return (
    <div className="w-full animate-in slide-in-from-bottom duration-500">
      <InputField 
        label="Сколько людей в месяц?" 
        value={data.traffic} 
        setValue={(v) => setData({...data, traffic: v})} 
        onFocus={handleFocus}
      />
      <InputField 
        label="Какая конверсия?" 
        value={data.conversion} 
        setValue={(v) => setData({...data, conversion: v})} 
        suffix="%" 
        onFocus={handleFocus}
      />
      <InputField 
        label="Средний чек" 
        value={data.avgCheck} 
        setValue={(v) => setData({...data, avgCheck: v})} 
        suffix="₸" 
        onFocus={handleFocus}
      />
      <InputField 
        label="Средний % чистой прибыли" 
        value={data.margin} 
        setValue={(v) => setData({...data, margin: v})} 
        suffix="%" 
        onFocus={handleFocus}
      />

      <div className="relative overflow-hidden bg-[#00FF9D]/5 border border-[#00FF9D]/30 p-5 rounded-2xl text-center group mt-4 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
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

// --- HackerProof ---
const HackerProof = () => {
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
};

// --- ClientDemandProof ---
const ClientDemandProof = () => {
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
};

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
const SetupTimeline = ({ onTrigger }) => {
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
          <div key={i} className="relative pl-6 group" onClick={() => onTrigger && onTrigger(getRandomPhrase('education'))}>
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

// --- WordstatGraph ---
const WordstatGraph = () => {
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
};

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
    "https://i.ibb.co.com/3mKHz61B/Picsart-Background-Remover.png", "https://i.ibb.co.com/4g74sZT7/maxresdefault-Picsart-Background-Remover.png"
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
  const isNewPartner = currentLogo.includes("4g74sZT7");
  let specificStyle = { filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.15)) brightness(1.1) contrast(1.1) saturate(1.2)' };
  if (isYandex) specificStyle = { filter: 'invert(1) hue-rotate(180deg) saturate(3) brightness(1.2)' };
  else if (isRomantic) specificStyle = { filter: 'brightness(1.5) contrast(1.2)' };
  else if (isFood) specificStyle = { filter: 'brightness(1.1) contrast(1.1)' };
  else if (isPicsartLogo) specificStyle = { filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))' };
  else if (isNewPartner) specificStyle = { filter: 'brightness(1.1) contrast(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.2))' };
  const logoClasses = `h-24 w-auto object-contain max-w-[90%] transform ${isNewPartner ? 'scale-[2.5]' : 'scale-125'} ${isFood ? 'translate-y-6' : ''}`;
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
  const handleConsultation = () => { window.open('https://t.me/taipanmedia', '_blank'); };
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

const App = () => {
  useEffect(() => { console.log("Taipan Media App Initialized"); }, []);
  const [currentView, setCurrentView] = useState('main'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  
  // NEW: Track view entry time for Education Critic
  const [viewStartTime, setViewStartTime] = useState(Date.now());

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 16)); 
    const interval = setInterval(() => { setOnlineCount(Math.floor(Math.random() * 16)); }, 60000); 
    return () => clearInterval(interval);
  }, []);

  // --- ROBOT LOGIC ---
  const [robotState, setRobotState] = useState({ mood: 'idle', message: 'Я тут, чтобы помочь!', showBubble: false, lastActivity: Date.now() });
  
  // Ref to access latest state inside event listeners
  const robotStateRef = useRef(robotState);
  useEffect(() => {
    robotStateRef.current = robotState;
  }, [robotState]);

  // Trigger Robot Message with a specific mood
  const triggerRobotMsg = useCallback((text, mood = 'idle') => {
    setRobotState(prev => ({ ...prev, mood: mood, message: text, showBubble: true }));
    setTimeout(() => {
        setRobotState(prev => ({ ...prev, showBubble: false, mood: 'idle' })); 
    }, 4000);
  }, []);

  // Trigger Joy Animation
  const triggerRobotJoy = useCallback(() => {
    setRobotState(prev => {
        if(prev.mood === 'success') return prev;
        return { ...prev, mood: 'success', message: getRandomPhrase('highProfit'), showBubble: true }
    });
    setTimeout(() => {
        setRobotState(prev => {
            if(prev.mood === 'success') return { ...prev, mood: 'idle', showBubble: false };
            return prev;
        })
    }, 5000);
  }, []);

  // Easter Eggs: Night & Return & Battery
  useEffect(() => {
      // Battery Check
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
           if (battery.level < 0.2 && !battery.charging) {
             triggerRobotMsg("Бро, у тебя зарядка садится! Быстрее сохраняй токен, а то я погасну вместе с твоими мечтами!", 'warning');
           }
        });
      }

      // Night check
      const hours = new Date().getHours();
      if (hours >= 0 && hours < 6) {
          setTimeout(() => triggerRobotMsg("Ночной кодинг? Или ночной обсчет прибыли? В любом случае — уважение от системы.", 'idle'), 1000);
      }

      // Visibility check (User returns)
      const handleVisibilityChange = () => {
          if (!document.hidden) {
              triggerRobotMsg("Я уж думал, ты ушел на завод... Рад, что ты вернулся в игру!", 'idle');
          }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [triggerRobotMsg]);

  // Robot Interaction (Click)
  const handleRobotClick = () => {
      setClickCount(prev => {
          const newCount = prev + 1;
          if (newCount === 5) {
              triggerRobotMsg("Ой! Хватит меня тыкать! Я же не сенсорная панель в Тесле!", 'warning');
              return 0; // Reset
          }
          return newCount;
      });
  };

  // Idle Timer & Tasks
  useEffect(() => {
    const handleActivity = () => {
      // Just update last activity timestamp without forcing a re-render if mood is already correct
      setRobotState(prev => ({ ...prev, lastActivity: Date.now() })); 
    };
    
    let timeout;
    const throttledHandler = () => {
        if (!timeout) {
            timeout = setTimeout(() => {
                handleActivity();
                timeout = null;
            }, 1000);
        }
    }

    window.addEventListener('mousemove', throttledHandler);
    window.addEventListener('click', throttledHandler);
    window.addEventListener('touchstart', throttledHandler);
    
    const idleTimer = setInterval(() => {
      const now = Date.now();
      const current = robotStateRef.current;
      const inactiveTime = now - current.lastActivity;
      
      // Task: Tax Collector (If idle and NOT in calculator)
      if (inactiveTime > 30000 && inactiveTime < 32000 && currentView !== 'calculator') {
           triggerRobotMsg("Эй, я проверил счета, там пыль. Пошли что-нибудь посчитаем?", 'warning');
      }

      // Task: Fourth Wall (Random check)
      if (Math.random() > 0.98 && inactiveTime > 5000 && inactiveTime < 20000) {
           triggerRobotMsg("Слушай, а этот дизайн интерфейса тебе нравится? Я сам выбирал этот оттенок зеленого.", 'idle');
      }
      
      if (inactiveTime > 20000 && inactiveTime <= 120000 && current.mood !== 'warning') {
         if (!current.showBubble) setRobotState(prev => ({ ...prev, mood: 'warning' }));
      } 
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      window.removeEventListener('click', throttledHandler);
      window.removeEventListener('touchstart', throttledHandler);
      clearInterval(idleTimer);
      if (timeout) clearTimeout(timeout);
    };
  }, [currentView, triggerRobotMsg]); 
  
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
    const handleResize = () => { if (window.innerWidth !== width) initMatrix(); };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    closeModal(); 
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000); 
    e.target.reset(); 
    const formData = new FormData(e.target);
    const name = formData.get('name');
    if (name) RobotMemory.save('userName', name);
    triggerRobotMsg(`Приятно познакомиться, ${name || 'друг'}! Я запомнил тебя.`);
  };
  const handleFaqClick = (item) => { setActiveFaq(item); setShowCalculator(false); };
  const closeFaq = () => { setActiveFaq(null); setShowCalculator(false); };
  const handleShopClick = () => { setShopIntroFinished(false); setCurrentView('shop'); };
  
  const handleEducationClick = () => {
    setViewStartTime(Date.now()); // Start timer
    triggerRobotMsg(getRandomPhrase('education'), 'advice');
    setCurrentView('education');
  }

  const handleStrategyClick = () => {
     triggerRobotMsg("О, выбор чемпиона! Готовлю отчет, который перевернет твое представление о деньгах...", 'idle');
     setCurrentView('strategy');
  };

  const handleBackClick = (target) => {
    // Task: Education Critic
    if (currentView === 'education') {
        const timeSpent = Date.now() - viewStartTime;
        if (timeSpent < 10000) { // Less than 10 seconds
            triggerRobotMsg("Ты точно всё прочитал? Или просто хочешь кнопку 'Бабло'? Так не работает, вернись и вникни!", 'warning');
            setTimeout(() => setCurrentView(target), 2500); // Delay navigation to show message
            return;
        }
    }

    triggerRobotMsg("Страшно? Это нормально. Великие дела всегда начинаются с мурашек. Давай попробуем еще раз?", 'idle');
    setCurrentView(target);
  }

  const faqItems = [
    { id: 'stats', question: "Это вообще покупают?", icon: <TrendingUp className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><WordstatGraph /><h3 className="text-white font-bold mb-3 uppercase tracking-wide text-sm font-['Chakra_Petch'] leading-tight">6 650 человек ищут тебя. Как долго ты будешь их игнорировать?</h3><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4">Это официальная статистика Яндекса: <span className="text-[#00FF9D] font-bold">6 650</span> прямых запросов на ТГ-магазины в месяц.<br/><br/>Пока ты ищешь «подходящий момент», наши ученики уже забирают эти чеки по <span className="text-white font-bold">100 000₸</span>, просто потому что они оказались на связи.<br/><br/>Мы даем тебе все инструменты и доступ к этому потоку. Твой результат — это просто вопрос того, возьмешь ли ты готовую систему и начнешь ли по ней работать.<br/><br/><span className="text-[#00FF9D] italic font-medium">Рынок платит тем, кто действует, а не тем, кто наблюдает.</span></p></div>) },
    { id: 'proof', question: "А это реально работает?", icon: <Lock className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><HackerProof /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-2">Пока ты сомневаешься, <span className="text-[#00FF9D] font-bold">Карашаш</span> прошла наше обучение и уже забирает свои <span className="text-white font-bold">100 000₸</span>.<br/><br/>На скриншоте — результат её работы. Она просто взяла знания, которые мы даём, и закрыла одного из <span className="text-[#00FF9D] font-bold">6 650</span> горячих клиентов в Яндексе. Ей не нужен был «подходящий момент», ей нужна была рабочая система.<br/><br/><span className="text-white italic">Рынок пустой. Деньги на столе. Ты следующий или так и будешь смотреть на чужие чеки?</span></p></div>) },
    { id: 'difficulty', question: "А сложно это делать?", icon: <Zap className="w-5 h-5 text-[#00FF9D]" />, component: (<div className="w-full"><SkillScanner /> <SetupTimeline onTrigger={(msg) => triggerRobotMsg(msg, 'advice')} /><p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4"><span className="text-white font-bold">Программистом быть не нужно.</span><br/><br/>Собрать такой магазин проще, чем выложить пост в Инстаграм. Мы даем всё готовое: ты просто расставляешь блоки по местам за один вечер.<br/><br/><span className="text-[#00FF9D] font-bold">Работай с телефона:</span> Не нужен компьютер, всё настраивается прямо в смартфоне.<br/><br/><span className="text-[#00FF9D] font-bold">Для декрета или совмещения:</span> Занимайся этим, пока ребенок спит или после основной работы.<br/><br/><span className="text-[#00FF9D] font-bold">Просто и понятно:</span> Если умеешь переписываться в Telegram — ты справишься.<br/><br/><span className="text-white font-bold italic">Хватит смотреть на чужие чеки. Заходи и делай свои.</span></p></div>) },
    { id: 'calc', question: "Найду ли я клиентов?", icon: <Wallet className="w-5 h-5 text-[#00FF9D]" />, isCalc: true, component: (<div className="w-full"><ClientDemandProof /><div className="text-sm text-zinc-300 leading-relaxed border-l-2 border-[#00FF9D]/50 pl-4 mb-4"><p><span className="text-white font-bold">Ты не просто их найдешь — они тоже будут тебя искать.</span></p><br/><p>Статистика Яндекса не врет: каждый месяц <span className="text-[#00FF9D] font-bold">6 650</span> предпринимателей ищут, кто сделает им магазин в Telegram. Спрос огромный, а тех, кто умеет делать это качественно — единицы.</p><br/><p>На обучении мы даем не только технические навыки, но и <span className="text-white font-bold">полную систему продаж</span>:</p><br/><ul className="list-disc pl-4 space-y-2"><li><span className="text-[#00FF9D] font-bold">Где брать клиентов:</span> Покажем, как выйти на те самые тысячи заказов.</li><li><span className="text-[#00FF9D] font-bold">Как продавать:</span> Научим вести переговоры с бизнесменами и закрывать сделки на высокие чеки.</li><li><span className="text-[#00FF9D] font-bold">Готовые шаблоны предложений:</span> Тебе не нужно ничего придумывать — просто бери наше проверенное КП и отправляй клиенту.</li></ul><br/><p>Мы научим тебя делать результат «под ключ», чтобы ты мог уверенно забирать свои <span className="text-white font-bold">100 000₸</span> за проект.</p></div></div>) }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF9D]/30 relative overflow-hidden flex flex-col">
      <GlobalStyles />
      <TaipanRobot mood={robotState.mood} message={robotState.message} showBubble={robotState.showBubble} onRobotClick={handleRobotClick} currentView={currentView} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF9D]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 opacity-20 -z-10" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)' }} />
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-20">
        
        {currentView === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
            <div className="mb-14 w-full text-center">
              <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)', color: '#ffffff' }}>
                <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
              </h1>
              <div className="flex items-center justify-center gap-4 mt-3 w-full">
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-700"></div>
                <p className="text-[10px] uppercase tracking-[0.6em] mr-[-0.6em] text-zinc-500 font-bold whitespace-nowrap">DIGITAL MEDIA</p>
                <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>
              <p className="text-[10px] text-zinc-600 font-mono mt-2 tracking-widest flex items-center justify-center gap-2 opacity-80">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_5px_#00FF9D]"></span>
                 СЕЙЧАС ОНЛАЙН: <span className="text-zinc-400 font-bold">{onlineCount}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
              <div onClick={handleShopClick} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><TelegramLogoMain className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" /></div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2 leading-tight">Telegram<br/>Магазин</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2">Выведите свой бизнес на новый уровень, и заберите ту прибыль, которую вы упускаете</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">ЗАКАЗАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>
              <div onClick={handleEducationClick} className="group relative glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300"><GraduationCap className="w-12 h-12 animate-[contourPulse_3s_ease-in-out_infinite]" /></div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2 leading-tight">ОБУЧЕНИЕ</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2 text-zinc-500">Освой трендовый навык с большим спросом, и получи возможность зарабатывать из дома</p>
                <div className="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">УЗНАТЬ <ArrowRight className="w-3 h-3 ml-1" /></div>
              </div>
            </div>
            <div onClick={() => openModal('Mini App')} className="group relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center w-full">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Заказать персональный mini app</p>
            </div>
            <PartnersCredits />
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
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">E-commerce нового поколения</p>
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
                      <button onClick={() => setCurrentView('calculator')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs relative z-10 flex items-center justify-center gap-2 animate-pulse">РАССЧИТАТЬ УПУЩЕННУЮ ПРИБЫЛЬ</button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            <button onClick={() => handleBackClick('shop')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-2 animate-in slide-in-from-bottom duration-700">
                <div className="text-center px-4 w-full mb-2">
                    <Wallet className="w-12 h-12 mx-auto text-[#00FF9D] mb-2 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-[contourPulse_3s_ease-in-out_infinite]" />
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-1 font-['Chakra_Petch'] leading-none whitespace-nowrap">ВАША <span className="text-[#00FF9D]">ПРИБЫЛЬ</span></h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">Узнайте сколько вы теряете</p>
                </div>
                <div className="w-full glass-card p-4 rounded-3xl border border-[#00FF9D]/20 relative overflow-hidden">
                    <ProfitCalculator 
                      data={calcData} 
                      setData={setCalcData} 
                      onAction={handleStrategyClick} 
                      onTrigger={triggerRobotMsg} 
                      onHighProfit={triggerRobotJoy} 
                      onInputChange={triggerRobotMsg} 
                    />
                </div>
            </div>
          </div>
        )}

        {currentView === 'strategy' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
             <button onClick={() => handleBackClick('calculator')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-4 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
             <div className="flex-grow flex flex-col items-center w-full space-y-6 overflow-y-auto pb-20 no-scrollbar">
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
             </div>
          </div>
        )}

        {currentView === 'roi' && (
           <RoiView profit={calculateProfit()} onBack={() => handleBackClick('strategy')} onAction={() => openModal('Start Project')} />
        )}

        {currentView === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            <button onClick={() => handleBackClick('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
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
            <button onClick={() => setCurrentView('faq')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 text-xs">Стань тем кто успел</button>
          </div>
        )}

        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleBackClick('education')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
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

        {currentView === 'program' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => handleBackClick('faq')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
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
            <div className="mt-8 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20"><p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">Стоимость обучения</p><div className="text-2xl font-black text-white mb-4 font-['Chakra_Petch']">50 000 ₸ <span className="text-zinc-600 text-lg line-through decoration-red-600 decoration-2 ml-2">80 000 ₸</span></div><p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Длительность обучения (14 дней)</p><button onClick={() => window.open('https://t.me/taipanmedia', '_blank')} className="block w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">Получить подробную консультацию</button></div>
          </div>
        )}
      </div>

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

      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300" onClick={closeFaq} />
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,255,157,0.15)] flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 cursor-pointer" onClick={closeFaq} />
            <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-full bg-[#00FF9D]/10 text-[#00FF9D]">{activeFaq.icon}</div><h2 className="text-xl font-bold font-['Chakra_Petch'] leading-tight">{activeFaq.question}</h2></div>
            <div className="mb-4">{activeFaq.component}</div>
            {activeFaq.isCalc && !showCalculator && (<button onClick={() => setShowCalculator(true)} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse hover:scale-[1.02] transition-all text-xs">РАССЧИТАТЬ ПРИБЫЛЬ</button>)}
            {activeFaq.isCalc && showCalculator && (<div className="mt-6 border-t border-[#00FF9D]/20 pt-6"><ProfitCalculator data={calcData} setData={setCalcData} onAction={() => setCurrentView('strategy')} onHighProfit={triggerRobotJoy} onInputFocus={triggerRobotMsg} onTrigger={triggerRobotMsg} /></div>)}
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
