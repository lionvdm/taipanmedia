<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Taipan Media | Elite</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --taipan-emerald: #00FF9D; 
            --taipan-dark: #050505;
            --glass-bg: rgba(10, 10, 10, 0.6);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: #050505;
            color: #ffffff;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        .font-display { font-family: 'Marcellus', serif; }

        /* --- ФОНОВЫЕ СЛОИ --- */
        .tech-bg {
            position: fixed;
            inset: 0;
            background-color: #020202;
            z-index: -2;
            overflow: hidden;
        }

        .tech-grid {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.2; 
            mask-image: radial-gradient(circle at 50% 30%, black 40%, transparent 100%);
            -webkit-mask-image: radial-gradient(circle at 50% 30%, black 40%, transparent 100%);
            pointer-events: none;
            z-index: 0; 
        }

        #matrixCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
            mix-blend-mode: screen; 
            z-index: 1; 
            pointer-events: none;
        }

        .tech-glow {
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 400px;
            background: radial-gradient(ellipse at center, rgba(0, 255, 157, 0.1) 0%, transparent 70%);
            filter: blur(80px);
            pointer-events: none;
            z-index: 2;
        }

        /* --- ЯДОВИТЫЙ ТЕКСТ --- */
        .poison-text {
            position: relative;
            z-index: 10;
            color: #ffffff;
            text-shadow: 0 2px 5px rgba(0,0,0,0.5); 
        }

        .poison-text::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(90deg, #00FF9D, #ccff00, #00FF9D);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: toxicBackGlow 3s ease-in-out infinite;
        }

        @keyframes toxicBackGlow {
            0% { filter: blur(10px); opacity: 0.5; }
            50% { filter: blur(20px); opacity: 1; }
            100% { filter: blur(10px); opacity: 0.5; }
        }

        /* --- СТЕКЛЯННЫЕ КАРТОЧКИ --- */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 255, 157, 0.08); 
            box-shadow: 0 0 4px rgba(0, 255, 157, 0.05), 0 4px 30px rgba(0, 0, 0, 0.5);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
            overflow: hidden;
            z-index: 10;
        }

        .glass-card:active { transform: scale(0.98); }

        .glass-card:hover {
             border-color: rgba(0, 255, 157, 0.3);
             box-shadow: 0 0 8px rgba(0, 255, 157, 0.15);
        }

        /* --- ПУЛЬСАЦИЯ КОНТУРА --- */
        @keyframes contourPulse {
            0% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
            50% { filter: drop-shadow(0 0 8px rgba(0, 255, 157, 0.8)); opacity: 1; }
            100% { filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.4)); opacity: 0.8; }
        }

        .pulsing-icon { animation: contourPulse 3s ease-in-out infinite; }

        /* --- АНИМАЦИИ ПЕРЕХОДА --- */
        .view-fade-in {
            animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hidden { display: none; }
    </style>
</head>
<body class="min-h-screen flex flex-col relative selection:bg-[#00FF9D]/30 text-white">

    <div class="tech-bg">
        <div class="tech-grid"></div> 
        <canvas id="matrixCanvas"></canvas> 
        <div class="tech-glow"></div>
    </div>

    <!-- --- ГЛАВНЫЙ ЭКРАН --- -->
    <main id="mainView" class="view-fade-in flex-grow px-4 pb-8 z-20 flex flex-col justify-center max-w-lg mx-auto w-full pt-10">
        
        <div class="mb-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-2 font-display poison-text" data-text="TAIPAN MEDIA">
                TAIPAN MEDIA
            </h1>
            <p class="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-semibold">Цифровые технологии</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div onclick="openModal('Telegram Shop')" class="group glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div class="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                    <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 pulsing-icon">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.014.093.03.3.023.48z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-bold uppercase tracking-wide mb-2">Telegram<br>Магазин</h3>
                <p class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Создадим ваш магазин с продажами 24/7</p>
                <div class="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">
                    ЗАКАЗАТЬ <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                </div>
            </div>

            <!-- ПЕРЕХОД НА ЭТАП ОБУЧЕНИЯ -->
            <div onclick="switchView('education')" class="group glass-card rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer">
                <div class="mb-6 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                    <i data-lucide="graduation-cap" class="w-12 h-12 pulsing-icon"></i>
                </div>
                <h3 class="text-lg font-bold uppercase tracking-widest mb-2 leading-tight text-white group-hover:text-[#00FF9D] transition-colors">ОБУЧЕНИЕ</h3>
                <p class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4 leading-relaxed px-2 text-balance">Обучим создавать и продавать телеграм-магазины даже с телефона. Без кода, под ключ</p>
                <div class="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-wider">
                    ПЕРЕЙТИ <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                </div>
            </div>
        </div>

        <div onclick="openModal('Mini App')" class="group glass-card rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer text-center">
            <h3 class="text-lg font-bold uppercase tracking-widest mb-2 group-hover:text-[#00FF9D] transition-colors">MINI APP</h3>
            <p class="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Заказать для своего бизнеса</p>
        </div>
    </main>

    <!-- --- ЭКРАН ОБУЧЕНИЯ (СЛЕДУЮЩИЙ ЭТАП) --- -->
    <main id="educationView" class="hidden view-fade-in flex-grow px-4 pb-8 z-20 flex flex-col max-w-lg mx-auto w-full pt-10">
        <button onclick="switchView('main')" class="flex items-center text-[10px] text-[#00FF9D] uppercase tracking-widest font-bold mb-8 hover:opacity-70 transition-all">
            <i data-lucide="chevron-left" class="w-4 h-4 mr-1"></i> Назад
        </button>

        <div class="mb-10">
            <h2 class="text-3xl font-bold tracking-tighter mb-2">ПРОГРАММА<br><span class="text-[#00FF9D]">ОБУЧЕНИЯ</span></h2>
            <div class="h-1 w-12 bg-[#00FF9D]"></div>
        </div>

        <div class="space-y-4">
            <!-- Этап 1 -->
            <div class="glass-card rounded-2xl p-6 flex gap-4 items-start">
                <div class="text-2xl font-black text-[#00FF9D]/20">01</div>
                <div>
                    <h4 class="font-bold uppercase tracking-wide text-sm mb-1">Основы без кода</h4>
                    <p class="text-xs text-zinc-400">Учимся создавать структуру магазина без единой строчки кода. Только логика и инструменты.</p>
                </div>
            </div>

            <!-- Этап 2 -->
            <div class="glass-card rounded-2xl p-6 flex gap-4 items-start border-l-2 border-l-[#00FF9D]/30">
                <div class="text-2xl font-black text-[#00FF9D]/40">02</div>
                <div>
                    <h4 class="font-bold uppercase tracking-wide text-sm mb-1">Дизайн и UX</h4>
                    <p class="text-xs text-zinc-400">Делаем интерфейс, в котором хочется покупать. Работа с визуалом прямо с телефона.</p>
                </div>
            </div>

            <!-- Этап 3 -->
            <div class="glass-card rounded-2xl p-6 flex gap-4 items-start">
                <div class="text-2xl font-black text-[#00FF9D]/60">03</div>
                <div>
                    <h4 class="font-bold uppercase tracking-wide text-sm mb-1">Монетизация</h4>
                    <p class="text-xs text-zinc-400">Как найти первого клиента и продать готовый магазин за высокий чек.</p>
                </div>
            </div>
        </div>

        <button onclick="openModal('Enroll Training')" class="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_5px_20px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-10 text-xs">
            ЗАПИСАТЬСЯ НА КУРС
        </button>
    </main>

    <footer class="text-center py-8 text-zinc-700 text-[9px] uppercase tracking-[0.15em] font-bold z-20">
        Данный mini app был создан <span class="text-zinc-500">TAIPAN MEDIA GROUP</span>
    </footer>

    <!-- Модальное окно -->
    <div id="modalOverlay" class="fixed inset-0 z-[100] hidden flex items-end justify-center">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onclick="closeModal()"></div>
        <div id="modalContent" class="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 transform translate-y-full transition-transform">
            <div class="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>
            <h2 class="text-2xl font-bold text-center mb-2 tracking-tight">Оформить заявку</h2>
            <p class="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">Тема: <span id="modalType" class="text-[#00FF9D]"></span></p>
            <form onsubmit="handleSubmit(event)" class="space-y-4">
                <input type="text" placeholder="Ваше Имя" required class="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700">
                <input type="text" placeholder="@username" required class="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700">
                <button type="submit" class="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl mt-4 text-xs">Отправить</button>
            </form>
        </div>
    </div>

    <div id="toast" class="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl hidden">
        <div class="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse"></div>
        <span class="text-xs font-bold uppercase tracking-wider">Заявка отправлена</span>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            initMatrix();
            setInterval(drawMatrix, 50);
            window.addEventListener('resize', initMatrix);
        });

        // Матрица
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        let width, height, columns, drops = [];
        const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        function initMatrix() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 20);
            drops = Array(columns).fill(0).map(() => Math.random() * -100);
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#00FF9D';
            ctx.font = '16px monospace';
            drops.forEach((drop, i) => {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 20, drop * 20);
                if (drop * 20 > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }

        // Переключение экранов
        function switchView(view) {
            const main = document.getElementById('mainView');
            const edu = document.getElementById('educationView');
            
            if (view === 'education') {
                main.classList.add('hidden');
                edu.classList.remove('hidden');
                window.scrollTo(0, 0);
            } else {
                edu.classList.add('hidden');
                main.classList.remove('hidden');
            }
        }

        function openModal(type) {
            document.getElementById('modalType').textContent = type;
            document.getElementById('modalOverlay').classList.remove('hidden');
            document.getElementById('modalContent').style.transform = "translateY(0)";
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.add('hidden');
            document.getElementById('modalContent').style.transform = "translateY(100%)";
        }

        function handleSubmit(e) {
            e.preventDefault();
            closeModal();
            const toast = document.getElementById('toast');
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
            e.target.reset();
        }
    </script>
</body>
</html>
