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
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #050505;
            color: #ffffff;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        .font-display {
            font-family: 'Marcellus', serif;
        }

        /* --- НОВЫЙ ЭФФЕКТ: ПУЛЬСАЦИЯ ЗА ТЕКСТОМ --- */
        .poison-text {
            position: relative;
            z-index: 10;
            color: #ffffff; /* Сам текст белый и четкий */
            /* Легкая тень, чтобы отделить текст от свечения */
            text-shadow: 0 2px 10px rgba(0,0,0,0.8); 
        }

        .poison-text::before {
            content: attr(data-text); /* Дублируем текст позади */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; /* Убираем назад */
            
            /* Ядовитый градиент */
            background: linear-gradient(90deg, #00FF9D, #ccff00, #00FF9D);
            background-size: 200% auto;
            
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            
            /* Анимация пульсации */
            animation: toxicBackGlow 3s ease-in-out infinite;
        }

        @keyframes toxicBackGlow {
            0% {
                filter: blur(15px);
                opacity: 0.4;
                transform: scale(1);
            }
            50% {
                filter: blur(25px); /* Сильное размытие (свечение) */
                opacity: 1;         /* Яркая вспышка */
                transform: scale(1.05); /* Легкое расширение облака */
            }
            100% {
                filter: blur(15px);
                opacity: 0.4;
                transform: scale(1);
            }
        }

        /* Анимации UI */
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        .slide-in-bottom {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes bounceIn {
            0% { transform: translate(-50%, -20px); opacity: 0; }
            50% { transform: translate(-50%, 5px); opacity: 1; }
            100% { transform: translate(-50%, 0); opacity: 1; }
        }

        .toast-enter {
            animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col relative selection:bg-[#00FF9D]/30 text-white">

    <!-- --- ТЕХНО-ФОН --- -->
    <div class="fixed inset-0 z-0 bg-[#020202]">
        <!-- Matrix Canvas -->
        <canvas id="matrixCanvas" class="absolute inset-0 opacity-20 z-10 pointer-events-none"></canvas>
        
        <!-- Grid Overlay -->
        <div class="absolute inset-0 z-0 opacity-20" 
             style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        
        <!-- Top Blur Blob -->
        <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF9D]/10 blur-[100px] rounded-full pointer-events-none"></div>
    </div>

    <!-- --- КОНТЕНТ --- -->
    <main class="flex-grow px-4 pb-8 z-20 flex flex-col justify-center max-w-lg mx-auto w-full pt-10">
        
        <!-- Hero Section -->
        <div class="mb-12 text-center">
            <!-- Добавлен data-text для эффекта -->
            <h1 class="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-2 font-display poison-text" data-text="TAIPAN MEDIA">
                TAIPAN MEDIA
            </h1>
            <p class="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-semibold">Цифровые технологии</p>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            
            <!-- Card 1: Telegram Shop -->
            <div onclick="openModal('Telegram Shop')" 
                 class="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
                
                <div class="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-[#00FF9D]/10 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                    <i data-lucide="shopping-bag" class="w-8 h-8"></i>
                </div>
                
                <h3 class="text-lg font-bold uppercase tracking-wide mb-2">Telegram<br>Магазин</h3>
                <p class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Автоматизация продаж</p>
                
                <div class="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 font-bold tracking-wider">
                    ЗАКАЗАТЬ <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                </div>
            </div>

            <!-- Card 2: Education -->
            <div onclick="openModal('Education')" 
                 class="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
                
                <div class="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-[#00FF9D]/10 text-zinc-400 group-hover:text-[#00FF9D] transition-all duration-300">
                    <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                </div>
                
                <h3 class="text-lg font-bold uppercase tracking-wide mb-2">Обучение<br>DEV</h3>
                <p class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Мастерство разработки</p>
                
                <div class="flex items-center text-[10px] text-[#00FF9D] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 font-bold tracking-wider">
                    НАЧАТЬ <i data-lucide="arrow-right" class="w-3 h-3 ml-1"></i>
                </div>
            </div>

        </div>

        <!-- Card Long: Mini App -->
        <div onclick="openModal('Mini App')" 
             class="group relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:border-[#00FF9D]/30 transition-all duration-500">
            
            <div class="flex items-center gap-4">
                <div class="p-3 rounded-2xl bg-[#00FF9D]/10 text-[#00FF9D]">
                    <i data-lucide="smartphone" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold uppercase tracking-wider">Mini App</h3>
                    <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Разработка под ключ</p>
                </div>
            </div>
            
            <i data-lucide="chevron-right" class="text-zinc-600 group-hover:text-[#00FF9D] group-hover:translate-x-1 transition-all"></i>
        </div>

    </main>

    <!-- Footer -->
    <footer class="text-center py-8 text-zinc-700 text-[10px] tracking-[0.3em] font-bold z-20">
        TAIPAN MEDIA CORP &copy; 2024
    </footer>

    <!-- --- MODAL (BOTTOM SHEET) --- -->
    <div id="modalOverlay" class="fixed inset-0 z-[100] hidden flex items-end justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onclick="closeModal()"></div>
        
        <!-- Sheet -->
        <div id="modalContent" class="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[40px] border-t border-white/10 p-8 transform translate-y-full transition-transform">
            <div class="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>
            
            <h2 class="text-2xl font-bold text-center mb-2 tracking-tight">Оформить заявку</h2>
            <p class="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">Услуга: <span id="modalType" class="text-[#00FF9D]"></span></p>
            
            <form onsubmit="handleSubmit(event)" class="space-y-4">
                <input type="text" placeholder="Ваше Имя" required class="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700">
                <input type="text" placeholder="@username" required class="w-full bg-black border border-white/5 rounded-2xl p-4 text-center text-white focus:border-[#00FF9D]/50 outline-none transition-all placeholder-zinc-700">
                
                <button type="submit" class="w-full bg-[#00FF9D] text-black font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_10px_30px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 text-xs">
                    Отправить
                </button>
            </form>
        </div>
    </div>

    <!-- --- TOAST --- -->
    <div id="toast" class="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-[#00FF9D]/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl hidden">
        <div class="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse"></div>
        <span class="text-xs font-bold uppercase tracking-wider">Заявка отправлена</span>
    </div>

    <script>
        // Init Icons
        lucide.createIcons();

        // --- MATRIX ANIMATION ---
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        
        let width, height, columns;
        const drops = [];
        const chars = "TAIPAN0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        function initMatrix() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 20);
            
            // Reset drops
            drops.length = 0;
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(2, 2, 2, 0.05)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#00FF9D';
            ctx.font = '16px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        initMatrix();
        setInterval(drawMatrix, 50);
        window.addEventListener('resize', initMatrix);


        // --- UI LOGIC ---
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        const modalTypeSpan = document.getElementById('modalType');
        const toast = document.getElementById('toast');

        function openModal(type) {
            modalTypeSpan.textContent = type;
            modalOverlay.classList.remove('hidden');
            // Animation class matching React's "animate-in slide-in-from-bottom"
            modalContent.classList.add('slide-in-bottom'); 
        }

        function closeModal() {
            modalOverlay.classList.add('hidden');
            modalContent.classList.remove('slide-in-bottom');
        }
        
        // Close on click outside (backdrop handled by onclick in HTML)

        function handleSubmit(e) {
            e.preventDefault();
            closeModal();
            
            // Show Toast
            toast.classList.remove('hidden');
            toast.classList.add('toast-enter');
            
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('toast-enter');
            }, 3000);
            
            e.target.reset();
        }
    </script>
</body>
</html>
