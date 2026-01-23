import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, doc, setDoc, getDocs, collection, 
  query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// ==========================================
// ⚙️ CONFIG & SECURITY
// ==========================================
// Впиши сюда свой Telegram ID (можно узнать у @userinfobot)
const ADMIN_IDS = [5427147012]; 

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================
// 📡 CRM & UTILS
// ==========================================
const logToTaipanCRM = async (topicId, status, details = "") => {
  const token = "8398712805:AAHFZXllsCQU0YNd8KIo9Rie5VZeyH91GMQ";
  const chatId = "-1003690228596";
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;
  const userLink = user?.username ? `https://t.me/${user.username}` : `tg://user?id=${user?.id}`;

  const message = `📡 **TAIPAN MONITORING**\n\`\`\`\nСТАТУС : ${status.toUpperCase()}\nЮЗЕР   : ${user?.first_name || 'AGENT'}\nЭКШН   : ${details}\n\`\`\`\n👤 [ДИАЛОГ](${userLink})`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_thread_id: topicId, text: message, parse_mode: "Markdown", disable_web_page_preview: true })
    });
  } catch (e) { console.error("CRM Error:", e); }
};

// ==========================================
// 🎨 STYLES & ICONS
// ==========================================
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { margin: 0; background-color: #050505; color: white; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { display: none; }
    .glass-card { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(0, 255, 157, 0.1); transition: all 0.3s ease; }
    .glass-card:hover { border-color: rgba(0, 255, 157, 0.4); }
    @keyframes contourPulse { 0% { opacity: 0.8; } 50% { opacity: 1; filter: drop-shadow(0 0 5px rgba(0, 255, 157, 0.5)); } 100% { opacity: 0.8; } }
    @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  `}} />
);

const ChevronLeft = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>;
const CheckCircle = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
const TelegramLogo = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.293-.605.293l.214-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.942z"/></svg>;

// ==========================================
// 🛠 ADMIN COMPONENT
// ==========================================
const AdminView = ({ onBack }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const q = query(collection(db, "users"), orderBy("lastActive", "desc"));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-[#00FF9D]/20 pb-4">
        <h2 className="text-[#00FF9D] font-black tracking-widest text-sm uppercase">Taipan_Control_Panel</h2>
        <button onClick={onBack} className="text-[10px] bg-zinc-800 px-3 py-1 rounded-full">ВЫХОД</button>
      </div>
      
      <div className="space-y-4 overflow-y-auto no-scrollbar pb-20">
        {loading ? (
          <div className="text-zinc-600 text-[10px] animate-pulse">СКАНИРОВАНИЕ ЛИДОВ...</div>
        ) : leads.map(l => (
          <div key={l.id} className="glass-card p-4 rounded-xl flex justify-between items-center border-zinc-800">
            <div>
              <p className="text-white text-xs font-bold">{l.userName}</p>
              <p className="text-[9px] text-zinc-500">ID: {l.chatId}</p>
            </div>
            <button onClick={() => window.open(`tg://user?id=${l.chatId}`)} className="text-[#00FF9D]">
              <TelegramLogo className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN APPLICATION
// ==========================================
const App = () => {
  const [view, setView] = useState('main');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('AGENT');

  useEffect(() => {
    const init = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        const user = tg.initDataUnsafe?.user;
        if (user) {
          setUserName(user.first_name.toUpperCase());
          if (ADMIN_IDS.includes(user.id)) setIsAdmin(true);
          
          await signInAnonymously(auth);
          await setDoc(doc(db, "users", user.id.toString()), {
            chatId: user.id,
            userName: user.first_name,
            username: user.username || '',
            lastActive: serverTimestamp()
          }, { merge: true });
        }
      }
      logToTaipanCRM(2, "ВХОД", "Открыл Mini App");
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative flex flex-col items-center">
      <GlobalStyles />
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {view === 'main' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center mt-10 mb-16">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                Taipan <span className="text-[#00FF9D]">Media</span>
              </h1>
              <p className="text-[10px] text-[#00FF9D] font-bold tracking-[0.4em] mt-2 uppercase animate-pulse">
                Привет, {userName}
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              <div onClick={() => setView('shop')} className="glass-card p-6 rounded-2xl cursor-pointer group">
                <div className="flex justify-between items-center mb-4">
                  <TelegramLogo className="w-8 h-8 text-zinc-500 group-hover:text-[#00FF9D] transition-all duration-500" />
                  <span className="text-[9px] text-[#00FF9D] font-bold border border-[#00FF9D]/30 px-2 py-0.5 rounded">NEW</span>
                </div>
                <h3 className="text-lg font-black uppercase">Telegram Магазин</h3>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Продажи на автопилоте</p>
              </div>

              <div onClick={() => setView('education')} className="glass-card p-6 rounded-2xl cursor-pointer group">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-[#00FF9D]">★</div>
                </div>
                <h3 className="text-lg font-black uppercase">Обучение</h3>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Трендовый навык 2026</p>
              </div>
            </div>

            {/* Secret Admin Entry */}
            {isAdmin && (
              <div className="mt-20 text-center">
                <button onClick={() => setView('admin')} className="text-[8px] text-zinc-800 hover:text-[#00FF9D] transition-colors tracking-[0.5em] uppercase font-mono">
                  [ System_Access_Granted ]
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'admin' && <AdminView onBack={() => setView('main')} />}

        {/* Заглушки для других экранов */}
        {(view === 'shop' || view === 'education') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setView('main')} className="flex items-center text-[10px] text-[#00FF9D] font-bold mb-8 uppercase tracking-widest">
              <ChevronLeft /> Назад
            </button>
            <div className="glass-card p-8 rounded-3xl text-center border-[#00FF9D]/20">
              <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle />
              </div>
              <h2 className="text-xl font-black uppercase mb-2">Раздел в работе</h2>
              <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">Вадим уже допиливает этот функционал. Скоро здесь будет жарко.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
