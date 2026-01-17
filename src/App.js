import React, { useState, useEffect, useRef } from 'react';

/**
 * Taipan Media - Elite React Application
 * FIX: Text Transition Timing & Styling.
 * * User Request: "White text lingers for half a second when switching, shouldn't happen."
 * * Issue: When phase switched to 'out', the `isDimmed/isGray` flag turned false, causing the text to transition back to full opacity/white color WHILE fading out container.
 * * Fix: Included `phase === 'out'` in the `isDimmed/isGray` conditions in all status components.
 * * Tweak: Accelerated fade-out duration (1s -> 0.8s) for snappier transitions.
 */

// --- Internal Icon Components ---

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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/>
  </svg>
);

// --- Matrix Ticker Component ---
const MatrixTicker = () => (
  <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-[#00FF9D]/20 py-3 overflow-hidden z-50 backdrop-blur-md">
    <div className="animate-marquee whitespace-nowrap flex gap-12">
      {[
        "[СИСТЕМА]: Алматы — бронь подтверждена",
        "[ОПЛАТА]: 150,000 ₸ (Разработка)",
        "[НОВОЕ]: Заказ TG Shop (Астана)",
        "[ОБУЧЕНИЕ]: +1 на поток PRO",
        "[ТРАНЗАКЦИЯ]: 45,000 ₸ успешно"
      ].map((text, i) => (
        <span key={i} className="text-[#00FF9D] font-mono text-[11px] uppercase tracking-wider opacity-90">
          {text}
        </span>
      ))}
       {[
        "[СИСТЕМА]: Алматы — бронь подтверждена",
        "[ОПЛАТА]: 150,000 ₸ (Разработка)",
        "[НОВОЕ]: Заказ TG Shop (Астана)",
        "[ОБУЧЕНИЕ]: +1 на поток PRO",
        "[ТРАНЗАКЦИЯ]: 45,000 ₸ успешно"
      ].map((text, i) => (
        <span key={`dup-${i}`} className="text-[#00FF9D] font-mono text-[11px] uppercase tracking-wider opacity-90">
          {text}
        </span>
      ))}
    </div>
  </div>
);

// --- Profit Calculator Component ---
const ProfitCalculator = () => {
  const [price, setPrice] = useState(50000);
  const [clients, setClients] = useState(2);
  const profit = price * clients;

  return (
    <div className="w-full mt-6 animate-in slide-in-from-bottom duration-500 border-t border-[#00FF9D]/20 pt-6">
      <div className="flex justify-between text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-bold">
        <span>Цена за магазин</span>
        <span className="text-[#00FF9D]">{price.toLocaleString()} ₸</span>
      </div>
      <input 
        type="range" 
        min="30000" 
        max="150000" 
        step="5000" 
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00FF9D] mb-6"
      />
      
      <div className="flex justify-between text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-bold">
        <span>Клиентов в месяц</span>
        <span className="text-[#00FF9D]">{clients}</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        step="1" 
        value={clients} 
        onChange={(e) => setClients(Number(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00FF9D] mb-6"
      />

      <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 p-4 rounded-2xl text-center">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Твоя упущенная выгода</p>
        <p className="text-2xl font-black text-white font-['Chakra_Petch'] animate-pulse">
          {profit.toLocaleString()} ₸ <span className="text-[12px] text-zinc-500 font-sans font-normal">/ мес</span>
        </p>
      </div>
    </div>
  );
};

// --- Hacker Proof Component (Zoomable) ---
const HackerProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => {
           e.stopPropagation();
           setIsExpanded(true);
        }}
      >
        <img 
          src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" 
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x200/000000/00FF9D?text=EVIDENCE+LOST"; }} 
          className="w-full object-cover opacity-90 filter grayscale contrast-[1.1] brightness-[0.8] sepia-[1] hue-rotate-[50deg] saturate-[2.5]" 
          alt="Encrypted Proof" 
        />
        {/* Zoom Hint */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30">
          <Search className="w-3 h-3 text-[#00FF9D]" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,157,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none"></div>
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
           <div>
              <p className="text-[#00FF9D] text-[10px] font-black font-mono bg-black/80 px-2 py-0.5 inline-block border-l-2 border-[#00FF9D]">VIRGINIA GOLD</p>
              <p className="text-white text-[9px] font-mono bg-black/80 px-2 py-0.5 mt-1 inline-block">ЧЕК: 100.000 Т</p>
           </div>
           <CheckCircle2 className="w-6 h-6 text-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
             e.stopPropagation();
             setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-2xl">
             <img 
               src="https://i.ibb.co.com/FdhqGvD/2025-11-09-113228-fotor-20251109143545.jpg" 
               className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]"
               alt="Proof Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </>
  );
};

// --- Client Demand Proof Component (Zoomable) ---
const ClientDemandProof = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="relative rounded-xl overflow-hidden border border-[#00FF9D]/40 mb-6 group animate-in zoom-in duration-500 shadow-[0_0_20px_rgba(0,255,157,0.1)] cursor-zoom-in"
        onClick={(e) => {
           e.stopPropagation();
           setIsExpanded(true);
        }}
      >
        <img 
          src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" 
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x200/000000/00FF9D?text=DATA+LOST"; }} 
          className="w-full object-cover opacity-90 filter grayscale-[0.5] contrast-[1.1] brightness-[0.9]" 
          alt="Client Demand" 
        />
        {/* Zoom Hint */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-[#00FF9D]/30">
          <Search className="w-3 h-3 text-[#00FF9D]" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,157,0.05)_50%)] bg-[length:100%_3px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-3 left-3 bg-black/80 border border-[#00FF9D]/30 px-2 py-1 rounded">
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></div>
             <span className="text-[9px] font-mono text-[#00FF9D]">DEMAND_HIGH</span>
          </div>
        </div>
      </div>

       {/* Expanded View */}
       {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
             e.stopPropagation();
             setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-2xl">
             <img 
               src="https://i.ibb.co.com/h1mN3kL0/5427147012425059102.jpg" 
               className="w-full h-auto rounded-lg border border-[#00FF9D]/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]"
               alt="Demand Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </>
  );
};

// --- Skill Scanner Component ---
const SkillScanner = () => (
  <div className="w-full bg-[#0A0A0A] rounded-xl border border-[#00FF9D]/20 p-4 mb-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
    <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
       <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse"></div>
         <span className="text-[10px] font-mono text-[#00FF9D] tracking-widest">СИСТЕМНЫЙ_АНАЛИЗ</span>
       </div>
       <span className="text-[9px] text-zinc-600 font-mono">v.2.0.4</span>
    </div>

    <div className="space-y-4">
      {/* Metric 1 */}
      <div>
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-zinc-400">НАВЫКИ (КОДИНГ)</span>
          <span className="text-zinc-600">НЕ ТРЕБУЕТСЯ</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full">
           <div className="w-[0%] h-full bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Metric 2 */}
      <div>
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-zinc-400">ВРЕМЯ НАСТРОЙКИ</span>
          <span className="text-[#00FF9D]">~45 МИН</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full">
           <div className="w-[15%] h-full bg-[#00FF9D] rounded-full shadow-[0_0_8px_#00FF9D] animate-[widthGrow_1s_ease-out]"></div>
        </div>
      </div>

      {/* Metric 3 */}
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
    
    <div className="mt-4 p-2 bg-[#00FF9D]/5 rounded border border-[#00FF9D]/10 text-center">
       <p className="text-[9px] text-[#00FF9D] font-black tracking-widest uppercase">ВЕРДИКТ: ИДЕАЛЬНО ДЛЯ НОВИЧКОВ</p>
    </div>
  </div>
);

// --- Setup Timeline Component ---
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
             {/* Glowing Node */}
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
        
        {/* Final Block */}
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


// --- Authentic Yandex Wordstat Graph (Zoomable) ---
const WordstatGraph = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
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

        {/* Real Screenshot Container */}
        <div className="relative w-full h-auto">
          <img 
            src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" 
            alt="Real Wordstat Data"
            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src="https://via.placeholder.com/600x300/1c1c1e/00FF9D?text=WORDSTAT+DATA"; 
            }}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
           {/* Zoom Hint */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity border border-white/20">
             <Search className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

       {/* Expanded View */}
       {isExpanded && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
             e.stopPropagation();
             setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-4xl">
             <img 
               src="https://i.ibb.co.com/Y7WjS1Tc/2026-01-16-014054.png" 
               className="w-full h-auto rounded-lg border border-zinc-700 shadow-2xl"
               alt="Wordstat Full"
             />
             <p className="text-center text-zinc-500 font-mono text-[10px] mt-4 uppercase animate-pulse">Нажмите в любом месте, чтобы закрыть</p>
          </div>
        </div>
      )}
    </>
  );
};

// --- Brand Logos components ---
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
      <p className="text-[#00FF9D] text-[12px] uppercase tracking-[0.3em] pl-[0.3em] mt-3 font-bold bg-[#00FF9D]/10 border border-[#00FF9D]/30 pl-7 pr-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.2)]">Твой шанс войти в историю</p>
    </div>
  )
};

// --- NEW 3D CAROUSEL COMPONENT ---
const Carousel3D = () => {
  const images = [
    "https://i.ibb.co.com/Fp52kXy/666.png",
    "https://i.ibb.co.com/9H5ZxPfy/555.png",
    "https://i.ibb.co.com/bjV5YtR2/444.png",
    "https://i.ibb.co.com/Q3k778bd/333.png",
    "https://i.ibb.co.com/M5tCqhDs/222.png",
    "https://i.ibb.co.com/BV1gXyf7/111.png"
  ];

  // Logic: 6 items, circle. 360/6 = 60deg per item.
  // CSS transform: rotateY(i * 60deg) translateZ(r)
  // r ~= width / (2 * tan(30deg))
  // Assuming width ~ 200px (smaller horizontal card), r ~ 180px

  return (
    <div className="w-full h-[200px] flex items-center justify-center perspective-container overflow-visible">
      <div className="spinner">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="carousel-item flex items-center justify-center"
            style={{ 
              '--i': i,
              '--total': images.length 
            }}
          >
            {/* CLEAN IMAGE - Rounded corners + Neon Glow */}
            <img 
              src={img} 
              alt={`Result ${i+1}`} 
              className="max-w-full max-h-full object-contain pointer-events-none rounded-[24px] shadow-[0_0_15px_rgba(0,255,157,0.6)]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
      <style>{`
        .perspective-container {
          perspective: 800px; /* Stronger 3D */
        }
        .spinner {
          position: relative;
          width: 220px; /* Reduced width */
          height: 125px; /* Reduced height */
          transform-style: preserve-3d;
          animation: spin 20s infinite linear;
          /* Add a slight X tilt to show the ring structure better */
          transform: rotateX(-10deg); 
        }
        .spinner:hover {
          animation-play-state: paused;
        }
        @keyframes spin {
          from { transform: rotateX(-10deg) rotateY(0deg); }
          to { transform: rotateX(-10deg) rotateY(-360deg); }
        }
        .carousel-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 220px; 
          height: 125px;
          /* Calculate rotation: index * (360 / total) */
          /* TranslateZ: reduced to match smaller width */
          transform: rotateY(calc(var(--i) * 60deg)) translateZ(220px);
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden;
          /* ALL STYLES REMOVED per user request */
          background: transparent;
          border: none;
          box-shadow: none;
        }
        /* Add reflection to items */
        .carousel-item img {
          -webkit-box-reflect: below 5px linear-gradient(transparent, transparent, rgba(0,0,0,0.3));
        }
      `}</style>
    </div>
  );
};

// --- NEW SHOP INTRO SEQUENCE COMPONENT ---
const ShopIntroSequence = ({ onComplete }) => {
  const messages = [
    { 
      part1: "Пока другие обещают лиды", 
      part2: "МЫ ПОКАЗЫВАЕМ ДЕНЬГИ" 
    },
    { 
      part1: "МЫ НЕ ИЩЕМ НОВЫХ КЛИЕНТОВ", 
      part2: "Мы даем твоим старым клиентам возможность купить мгновенно" 
    },
    { 
      part1: "МЫ УБИРАЕМ ОЖИДАНИЕ", 
      part2: "ВЫ ПОЛУЧАЕТЕ ДЕНЬГИ" 
    },
    { 
      part1: "Спасаем от 20% чистой прибыли", 
      part2: "И ЗАСТАВЛЯЕМ ТАРГЕТ РАБОТАТЬ НА 100%" 
    }
  ];

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('part1In');

  useEffect(() => {
    let isMounted = true;
    let timeout;
    
    const runSequence = () => {
      if (phase === 'part1In') {
        timeout = setTimeout(() => { if(isMounted) setPhase('part1Wait'); }, 1000);
      } else if (phase === 'part1Wait') {
        timeout = setTimeout(() => { if(isMounted) setPhase('part1Dim'); }, 1000);
      } else if (phase === 'part1Dim') {
        timeout = setTimeout(() => { if(isMounted) setPhase('part2In'); }, 500);
      } else if (phase === 'part2In') {
        timeout = setTimeout(() => { if(isMounted) setPhase('fullWait'); }, 1000);
      } else if (phase === 'fullWait') {
        timeout = setTimeout(() => { if(isMounted) setPhase('out'); }, 2000); // Read time
      } else if (phase === 'out') {
        timeout = setTimeout(() => {
          if (isMounted) {
            if (index < messages.length - 1) {
              setIndex(prev => prev + 1);
              setPhase('part1In');
            } else {
              onComplete();
            }
          }
        }, 800); // Accelerated exit (0.8s match)
      }
    };
    
    runSequence();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, [phase, index, messages.length, onComplete]);

  const current = messages[index];
  // LUXURY LOGIC: Keep gray/dimmed state during 'out' phase to prevent flashing back to white
  const isDimmed = phase === 'part1Dim' || phase === 'part2In' || phase === 'fullWait' || phase === 'out';
  const showPart2 = phase === 'part2In' || phase === 'fullWait' || phase === 'out'; // Keep part 2 visible during out so they fade together

  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] px-4 cursor-pointer bg-black/40 backdrop-blur-sm" onClick={onComplete}>
       <div 
         key={index}
         className={`
           w-full text-center max-w-2xl transition-all duration-300
           ${phase === 'out' ? 'animate-[smokeOut_0.8s_ease-in_forwards]' : ''} 
         `}
       >
         {/* Part 1 - Platinum/Silver Text */}
         <h2 className={`
           text-xl sm:text-3xl font-bold uppercase leading-relaxed tracking-wide font-['Chakra_Petch'] 
           bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400
           drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] transition-all duration-700
           ${phase === 'part1In' ? 'animate-[smokeIn_1s_ease-out_forwards]' : ''}
           ${isDimmed ? 'opacity-50 blur-[1px]' : 'opacity-100'}
         `}>
           {current.part1}
         </h2>

         {/* Part 2 - Gold/Amber Text with Shine */}
         {showPart2 && (
            <div className="relative inline-block mt-4">
              <h2 className={`
                text-2xl sm:text-4xl font-black uppercase leading-relaxed tracking-wider font-['Chakra_Petch']
                bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F7EF8A] to-[#D4AF37]
                drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]
                animate-[smokeIn_1s_ease-out_forwards]
              `}>
                {current.part2}
              </h2>
              {/* Shimmer Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
            </div>
         )}
       </div>
       <div className="absolute bottom-10 text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">
         Нажмите, чтобы пропустить
       </div>
    </div>
  );
};

// --- NEW SHOP SMOKE FEATURES COMPONENT (WITH SPLIT LOGIC - Unused in render but kept for ref) ---
const ShopSmokeFeatures = () => {
  const messages = [
    { 
      part1: "Пока другие обещают лиды", 
      part2: "мы показываем деньги" 
    },
    { 
      part1: "МЫ НЕ ИЩЕМ НОВЫХ КЛИЕНТОВ", 
      part2: "Мы даем твоим старым клиентам возможность купить мгновенно" 
    },
    { 
      part1: "МЫ УБИРАЕМ ОЖИДАНИЕ", 
      part2: "Вы получаете деньги" 
    },
    { 
      part1: "Спасаем от 20% чистой прибыли", 
      part2: "и заставляем таргет работать на 100%" 
    }
  ];

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('part1In');

  useEffect(() => {
    let isMounted = true;
    let timeout;
    const runSequence = () => {
      if (phase === 'part1In') timeout = setTimeout(() => { if(isMounted) setPhase('part1Wait'); }, 1000);
      else if (phase === 'part1Wait') timeout = setTimeout(() => { if(isMounted) setPhase('part1Dim'); }, 1000);
      else if (phase === 'part1Dim') timeout = setTimeout(() => { if(isMounted) setPhase('part2In'); }, 500);
      else if (phase === 'part2In') timeout = setTimeout(() => { if(isMounted) setPhase('fullWait'); }, 1000);
      else if (phase === 'fullWait') timeout = setTimeout(() => { if(isMounted) setPhase('out'); }, 2500);
      else if (phase === 'out') timeout = setTimeout(() => { if(isMounted) { setIndex(prev => (prev + 1) % messages.length); setPhase('part1In'); } }, 800);
    };
    runSequence();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, [phase, index, messages.length]);

  const current = messages[index];
  const isGray = phase === 'part1Dim' || phase === 'part2In' || phase === 'fullWait' || phase === 'out';
  const showPart2 = phase === 'part2In' || phase === 'fullWait' || phase === 'out';

  return (
    <div className="w-full min-h-[180px] flex items-center justify-center py-6">
       <div 
         className={`
           w-full text-center max-w-md transition-all duration-300
           ${phase === 'out' ? 'animate-[smokeOut_0.8s_ease-in_forwards]' : ''}
         `}
       >
         {/* Part 1 */}
         <p className={`
           text-sm sm:text-base font-bold uppercase leading-relaxed tracking-wide font-['Chakra_Petch'] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-700
           ${phase === 'part1In' ? 'animate-[smokeIn_1s_ease-out_forwards]' : ''}
           ${isGray ? 'text-zinc-600 blur-[0.5px] animate-[glitchText_3s_infinite]' : 'text-white'}
         `}>
           {current.part1}
         </p>
         
         {/* Part 2 */}
         {showPart2 && (
            <p className={`
              mt-3 text-base sm:text-lg font-black text-[#00FF9D] uppercase leading-relaxed tracking-wide font-['Chakra_Petch'] drop-shadow-[0_0_15px_rgba(255,255,157,0.4)]
              animate-[smokeIn_1s_ease-out_forwards]
            `}>
              {current.part2}
            </p>
         )}
       </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'education', 'faq', 'program', 'shop'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // State for Shop Intro
  const [shopIntroFinished, setShopIntroFinished] = useState(false);
  
  // State for FAQ Modal
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
  
  // Reset Intro when opening Shop
  useEffect(() => {
    if (currentView === 'shop') {
       // Handled in click handler for better control.
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
    return () => { clearInterval(interval); window.removeEventListener('resize', initMatrix); };
  }, []);

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e) => { e.preventDefault(); closeModal(); setShowToast(true); setTimeout(() => setShowToast(false), 3000); e.target.reset(); };

  // FAQ Items Data
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
          {/* New Screenshot Integration */}
          <ClientDemandProof />
          
          {/* Updated Text Copy */}
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
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Outfit:wght@400;700&family=Chakra+Petch:wght@700&display=swap" rel="stylesheet" />
        
      {/* Background - Aurora Effect Added Here */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020202] -z-20" />
        {/* Aurora Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF9D]/5 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-20 -z-10" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 100%)' }} />
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col max-w-lg mx-auto w-full px-4 pt-10 pb-20"> {/* pb-20 for ticker space */}
        
        {currentView === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
            <div className="mb-14 w-full text-center">
              <h1 className="font-['Chakra_Petch'] font-[700] uppercase tracking-[0.15em] whitespace-nowrap overflow-visible relative block w-full text-center" style={{ fontSize: 'clamp(1.5rem, 8.5vw, 3.5rem)', textShadow: '0 0 20px rgba(0,255,157,0.3)', color: '#ffffff' }}>
                <span className="relative inline-block mr-[-0.15em]">TAIPAN MEDIA<span className="absolute inset-0 -z-10 opacity-40 blur-[12px] animate-pulse text-[#00FF9D]">TAIPAN MEDIA</span></span>
              </h1>
              
              {/* REPLACED DYNAMIC SMOKE STATUS WITH STATIC "DIGITAL MEDIA" SUBTITLE */}
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
          </div>
        )}

        {currentView === 'shop' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center w-full">
            {!shopIntroFinished ? (
               <ShopIntroSequence onComplete={() => setShopIntroFinished(true)} />
            ) : (
              <>
                <button onClick={() => setCurrentView('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
                <div className="flex-grow flex flex-col items-center w-full space-y-6 animate-in slide-in-from-bottom duration-700">
                  
                  {/* Shop Header */}
                  <div className="text-center px-4 w-full mb-4">
                      <TelegramLogoMain className="w-20 h-20 mx-auto text-[#00FF9D] mb-4 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-[contourPulse_3s_ease-in-out_infinite]" />
                      <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch'] leading-none">
                        TELEGRAM<br/><span className="text-[#00FF9D]">STORE</span>
                      </h2>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">E-commerce нового поколения</p>
                  </div>

                  {/* Features List (Restored) */}
                  <div className="w-full space-y-3">
                     {[
                       { title: "Каталог и Корзина", desc: "Полноценный интернет-магазин внутри мессенджера. Удобный выбор товаров без лишних переходов." },
                       { title: "Оплата в 1 клик", desc: "Интеграция с Kaspi, картами и криптовалютой. Мгновенные транзакции." },
                       { title: "CRM Система", desc: "Управление заказами, статусами и клиентами прямо внутри Telegram." },
                       { title: "Авто-рассылки", desc: "Push-уведомления клиентам о новинках и акциях с открываемостью 90%." }
                     ].map((item, i) => (
                       <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition-all">
                          <div className="mt-1 bg-[#00FF9D]/10 p-2 rounded-full text-[#00FF9D] border border-[#00FF9D]/20"><CheckCircle2 className="w-4 h-4" /></div>
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h4>
                            <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-4 w-full glass-card p-6 rounded-3xl text-center border border-[#00FF9D]/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00FF9D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 relative z-10">Разработка под ключ</p>
                      <div className="text-2xl font-black text-white mb-4 font-['Chakra_Petch'] relative z-10">от 150 000 ₸</div>
                      <button 
                        onClick={() => openModal('Order Shop')} 
                        className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs relative z-10 flex items-center justify-center gap-2"
                      >
                        Обсудить проект <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full items-center">
            <button onClick={() => setCurrentView('main')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center justify-center space-y-10 w-full">
              <div className="text-center px-4 w-full">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 font-['Chakra_Petch']">Упущенные<br/><span className="text-[#00FF9D]">Возможности</span></h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mr-[-0.3em] font-bold">История твоих сомнений</p>
              </div>
              <div className="relative w-full h-[380px] flex items-center justify-center overflow-hidden rounded-[40px] bg-white/5 border border-white/5 shadow-2xl">
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-[smokeDrift_10s_infinite]" />
                   <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[60px] animate-[smokeDrift_12s_infinite]" />
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00FF9D]/10 rounded-full blur-[60px] animate-[smokeDrift_8s_infinite_reverse]" />
                 </div>
                 {slides.map((SlideComponent, idx) => (
                   <div key={idx} className={`absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out transform ${activeSlide === idx ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-3xl'}`}>
                     <div className="relative w-full text-center">
                        <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full transform scale-150 left-1/2 -translate-x-1/2" />
                        <div className="relative z-10"><SlideComponent isActive={activeSlide === idx} /></div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="text-center w-full px-6 flex justify-center">
                <p className="text-zinc-500 text-[12px] font-bold uppercase tracking-widest mr-[-0.1em] animate-pulse whitespace-nowrap">Не стань историей упущенных шансов</p>
              </div>
            </div>
            <button onClick={() => setCurrentView('faq')} className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-6 rounded-3xl shadow-[0_5px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 text-xs">Стань тем кто успел</button>
          </div>
        )}

        {/* REFACTORED FAQ SECTION: Minimal List + Fullscreen Modal */}
        {currentView === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col h-full">
            <button onClick={() => setCurrentView('education')} className="self-start flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-6 hover:opacity-70 transition-all w-fit"><ChevronLeft className="w-4 h-4 mr-1" /> Назад</button>
            <div className="flex-grow flex flex-col items-center w-full space-y-6">
              
              {/* --- CHANGED: REPLACED HEADER TEXT WITH 3D CAROUSEL --- */}
              <div className="w-full mb-6">
                <Carousel3D />
                <div className="text-center mt-2">
                   {/* REMOVED "RESULTS" TEXT */}
                </div>
              </div>
              
              {/* Preserved FAQ List */}
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
              
              {/* --- CENTERED TITLE FIX --- */}
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
                    locked: false // UNLOCKED per request
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
                      {!item.locked && <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00FF9D] transition-colors" />}
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
              <div className="text-2xl font-black text-white mb-4 font-['Chakra_Petch']">50 000 ₸ <span className="text-zinc-600 text-lg line-through decoration-red-600 decoration-2 ml-2">80 000 ₸</span></div>
              <a 
                href="https://qpay-payform.qiwi.kz/form/invoice?invoiceUid=2bb2b799-2112-4f53-bcd7-c4587581392d"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-xs mb-3"
              >
                Приобрести обучение
              </a>
              <a 
                href="https://t.me/taipan_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-transparent border border-[#00FF9D]/50 text-[#00FF9D] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#00FF9D]/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
              >
                Переключиться на менеджера
              </a>
            </div>
          </div>
        )}
      </div>

      {/* MATRIX TICKER - Visible everywhere */}
      <MatrixTicker />

      <footer className="relative z-10 text-center py-8 text-zinc-700 text-[9px] uppercase tracking-[0.15em] mr-[-0.15em] font-bold mb-8">Данный mini app был создан <span className="text-zinc-500">TAIPAN MEDIA GROUP</span></footer>

      {/* LEAD GEN MODAL */}
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

      {/* FAQ CONTENT MODAL (NEW) */}
      {activeFaq && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300" onClick={closeFaq} />
          {/* Content Card */}
          <div className="relative w-full max-w-lg bg-[#050505] rounded-t-[30px] border-t border-[#00FF9D]/30 p-8 transform translate-y-0 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_50px_rgba(0,255,157,0.15)] flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 cursor-pointer" onClick={closeFaq} />
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 rounded-full bg-[#00FF9D]/10 text-[#00FF9D]">{activeFaq.icon}</div>
               <h2 className="text-xl font-bold font-['Chakra_Petch'] leading-tight">{activeFaq.question}</h2>
            </div>
            
            {/* Dynamic Content */}
            <div className="mb-4">{activeFaq.component}</div>

            {/* Special Calculator Logic */}
            {activeFaq.isCalc && !showCalculator && (
               <button 
                 onClick={() => setShowCalculator(true)}
                 className="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse hover:scale-[1.02] transition-all text-xs"
               >
                 РАССЧИТАТЬ ПРИБЫЛЬ
               </button>
            )}
            
            {/* Show Calculator if activated */}
            {activeFaq.isCalc && showCalculator && <ProfitCalculator />}

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

      <style>{`
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
            background: rgba(0, 255, 157, 0.03);
            border-color: rgba(0, 255, 157, 0.4);
            box-shadow: 0 0 30px rgba(0, 255, 157, 0.15);
        }
        @keyframes contourPulse {
          0% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.8)); opacity: 1; }
          100% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
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
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        @keyframes widthGrow {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
