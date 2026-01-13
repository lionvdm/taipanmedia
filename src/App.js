<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Taipan Media | Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Fonts: Marcellus (Luxury Serif) and Outfit (Premium Sans) -->
    <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* Premium Neon Emerald */
            --taipan-emerald: #00FF9D; 
            --taipan-dark: #050505;
            --glass-border: rgba(255, 255, 255, 0.08);
            --glass-bg: rgba(10, 10, 10, 0.6);
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--taipan-dark);
            color: #ffffff;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        h1, h2, h3, .font-display {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.05em;
        }

        /* --- TECH BACKGROUND --- */
        .tech-bg {
            position: fixed;
            inset: 0;
            background-color: #020202;
            z-index: -2;
            overflow: hidden;
        }

        #matrixCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.08; 
            z-index: 0; 
            mix-blend-mode: screen;
        }

        /* Исправленный класс сетки (удалены дубликаты) */
        .tech-grid {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 100%);
            -webkit-mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 100%);
            pointer-events: none;
            z-index: 1; /* Сетка поверх матрицы */
        }

        .tech-glow {
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 400px;
            background: radial-gradient(ellipse at center, rgba(0, 255, 157, 0.15) 0%, transparent 70%);
            filter: blur(80px);
            pointer-events: none;
            z-index: 2;
        }

        .scanline {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, transparent 0%, rgba(0, 255, 157, 0.03) 50%, transparent 100%);
            background-size: 100% 200%;
            animation: scan 8s linear infinite;
            pointer-events: none;
            z-index: 3;
        }

        @keyframes scan {
            0% { background-position: 0% -100%; }
            100% { background-position: 0% 200%; }
        }

        /* Premium Glass Card */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
            overflow: hidden;
            z-index: 10;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.05), transparent);
            transition: 0.5s;
        }

        .glass-card:active::before, .glass-card:hover::before {
            left: 100%;
        }

        .glass-card:active {
            transform: scale(0.98);
        }

        /* Text Effects */
        .text-metallic {
            background: linear-gradient(180deg, #FFFFFF 0%, #D8D8D8 50%, #8E8E8E 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.8));
            position: relative;
            z-index: 10;
        }
        
        /* EMERALD GLOW BEHIND Text */
        .emerald-text {
            position: relative;
            display: inline-block;
        }
        
        .emerald-text::before {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            
            background: linear-gradient(
                90deg, 
                var(--taipan-emerald),
                #00C2CB, 
                #00FF88,
                var(--taipan-emerald)
            );
            background-size: 300% 100%;
            
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent; 
            
            filter: blur(12px); 
            opacity: 0.9;
            
            animation: emerald-flow 4s linear infinite;
        }

        @keyframes emerald-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        .taipan-accent {
            color: var(--taipan-emerald);
            text-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
        }

        /* Custom Scrollbar for Web */
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: #000;
        }
        ::-webkit-scrollbar-thumb {
            background: #222;
            border-radius: 2px;
        }

        /* Modal Animation */
        .modal-enter {
            animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes modalSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col relative">

    <!-- Tech Background -->
    <div class="tech-bg">
        <canvas id="matrixCanvas"></canvas>
        <div class="tech-grid"></div>
        <div class="tech-glow"></div>
        <div class="scanline"></div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow px-4 pb-8 z-10 flex flex-col justify-center max-w-lg mx-auto w-full">
        
        <!-- Hero Text -->
        <div class="mb-12 text-center">
            <div class="relative inline-block mb-3">
                <h1 class="text-3xl md:text-5xl font-bold leading-none text-metallic font-display tracking-widest emerald-text" data-text="TAIPAN MEDIA">
                    TAIPAN MEDIA
                </h1>
            </div>
            
            <p class="text-metallic text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium opacity-80 mt-1">
                Цифровые технологии
            </p>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-2 gap-3 mb-3">
            
            <!-- Card 1: Telegram Shop -->
            <div class="glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center h-64 cursor-pointer group relative overflow-hidden" onclick="openModal('Telegram Shop')">
                <div class="absolute inset-0 bg-gradient-to-b from-[var(--taipan-emerald)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="mb-6 p-4 rounded-full bg-white/5 border border-white/5 text-zinc-300 group-hover:text-[var(--taipan-emerald)] group-hover:border-[var(--taipan-emerald)]/30 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] group-hover:scale-110 transition-all duration-300 relative z-10">
                    <i data-lucide="shopping-bag" class="w-8 h-8"></i>
                </div>
                
                <div class="relative z-10">
                    <h3 class="text-lg font-display uppercase leading-tight mb-3 text-zinc-100 group-hover:text-white">Telegram<br>Магазин</h3>
                    <p class="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-semibold">Автоматизация<br>Продаж 24/7</p>
                    
                    <div class="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--taipan-emerald)] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Заказать <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                    </div>
                </div>
            </div>

            <!-- Card 2: Education -->
            <div class="glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center h-64 cursor-pointer group relative overflow-hidden" onclick="openModal('Education')">
                <div class="absolute inset-0 bg-gradient-to-b from-[var(--taipan-emerald)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="mb-6 p-4 rounded-full bg-white/5 border border-white/5 text-zinc-300 group-hover:text-[var(--taipan-emerald)] group-hover:border-[var(--taipan-emerald)]/30 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] group-hover:scale-110 transition-all duration-300 relative z-10">
                    <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                </div>
                
                <div class="relative z-10">
                    <h3 class="text-lg font-display uppercase leading-tight mb-3 text-zinc-100 group-hover:text-white">Обучение<br>Dev</h3>
                    <p class="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-semibold">Стань профи<br>Разработки</p>
                    
                     <div class="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--taipan-emerald)] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Начать <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                    </div>
                </div>
            </div>

        </div>

        <!-- Card 3: Mini App -->
        <div class="glass-card rounded-2xl p-4 relative cursor-pointer group flex items-center justify-center h-20" onclick="openModal('Mini App')">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--taipan-emerald)_0%,_transparent_100%)] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none"></div>
            
            <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--taipan-emerald)] shadow-[0_0_10px_rgba(0,255,157,0.05)]">
                    <i data-lucide="smartphone" class="w-5 h-5"></i>
                </div>
                
                <div class="flex flex-col items-center">
                   <h3 class="text-sm font-display font-bold uppercase tracking-wide text-white group-hover:text-[var(--taipan-emerald)] transition-colors">Mini App</h3>
                   <p class="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Разработка под ключ</p>
                </div>
            </div>
            
            <div class="absolute right-5 text-[var(--taipan-emerald)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="text-center py-6 text-zinc-700 text-[9px] uppercase tracking-[0.2em] z-10 font-bold">
        Taipan Media Corp &copy; 2024
    </footer>

    <!-- Bottom Sheet Modal -->
    <div id="orderModal" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity opacity-0" id="modalBackdrop" onclick="closeModal()"></div>
        
        <div class="absolute bottom-0 left-0 w-full bg-[#0F0F0F] rounded-t-[30px] border-t border-white/10 p-6 transform translate-y-full transition-transform duration-300 flex flex-col items-center text-center" id="modalContent">
            
            <div class="w-12 h-1 bg-zinc-800 rounded-full mb-8"></div>

            <h2 class="text-2xl font-bold font-display uppercase text-white mb-2">Оформить</h2>
            <p class="text-xs text-zinc-500 uppercase tracking-wider mb-8">Выбрано: <span id="modalType" class="text-[var(--taipan-emerald)]"></span></p>

            <form onsubmit="submitForm(event)" class="space-y-4 w-full">
                <div class="space-y-1">
                    <input type="text" required class="w-full bg-[#050505] border border-white/10 rounded-xl text-white p-4 text-sm text-center focus:outline-none focus:border-[var(--taipan-emerald)] focus:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all placeholder-zinc-700 font-medium font-sans" placeholder="Ваше Имя">
                </div>
                
                <div class="space-y-1">
                    <input type="text" required class="w-full bg-[#050505] border border-white/10 rounded-xl text-white p-4 text-sm text-center focus:outline-none focus:border-[var(--taipan-emerald)] focus:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all placeholder-zinc-700 font-medium font-sans" placeholder="@username">
                </div>

                <button type="submit" class="w-full bg-[var(--taipan-emerald)] text-black font-extrabold uppercase tracking-widest py-4 rounded-xl text-xs mt-6 hover:bg-[#00e08b] transition-colors shadow-[0_0_20px_rgba(0,255,157,0.4)] font-sans">
                    Отправить
                </button>
            </form>
            <div class="h-6"></div> 
        </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="fixed top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-[var(--taipan-emerald)]/30 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,0,0,0.5)] opacity-0 pointer-events-none flex items-center gap-2 z-[110] transition-all transform -translate-y-4">
        <span class="w-2 h-2 rounded-full bg-[var(--taipan-emerald)] shadow-[0_0_5px_var(--taipan-emerald)]"></span>
        Заявка принята
    </div>

    <script>
        lucide.createIcons();

        const modal = document.getElementById('orderModal');
        const modalBackdrop = document.getElementById('modalBackdrop');
        const modalContent = document.getElementById('modalContent');
        const modalTypeSpan = document.getElementById('modalType');
        const toast = document.getElementById('toast');

        function openModal(type) {
            modalTypeSpan.textContent = type;
            modal.classList.remove('hidden');
            
            setTimeout(() => {
                modalBackdrop.classList.remove('opacity-0');
                modalContent.classList.remove('translate-y-full');
            }, 10);
        }

        function closeModal() {
            modalBackdrop.classList.add('opacity-0');
            modalContent.classList.add('translate-y-full');
            
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        function submitForm(e) {
            e.preventDefault();
            closeModal();
            
            setTimeout(() => {
                toast.classList.remove('opacity-0', '-translate-y-4');
                toast.classList.add('translate-y-0');
                
                setTimeout(() => {
                    toast.classList.add('opacity-0', '-translate-y-4');
                    toast.classList.remove('translate-y-0');
                }, 3000);
            }, 300);

            e.target.reset();
        }

        // --- Matrix Animation Script ---
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let columns = Math.floor(width / 20); 
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        function drawMatrix() {
            // Уменьшил затемнение следа, чтобы хвосты были длиннее
            ctx.fillStyle = 'rgba(2, 2, 2, 0.03)'; 
            ctx.fillRect(0, 0, width, height);

            // Updated to Emerald Color
            ctx.fillStyle = '#00FF9D'; 
            ctx.font = '16px monospace'; // Немного увеличил шрифт

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > height && Math.random() > 0.98) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Handle resize properly
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            
            // Re-calculate columns
            const newColumns = Math.floor(width / 20);
            
            // If new columns are more, fill drops array
            if (newColumns > columns) {
                for (let i = columns; i < newColumns; i++) {
                    drops[i] = Math.random() * -100;
                }
            }
            columns = newColumns;
        });

        setInterval(drawMatrix, 50);

    </script>
</body>
</html>
