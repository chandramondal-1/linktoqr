// Chandra — app.js (Main State, Routing, Synthesized Sounds, Keyboard Shortcuts, Particles)
(() => {
    // Utility selectors
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // Global Chandra object
    window.Chandra = window.Chandra || {};

    // Application State
    const state = window.Chandra.state = {
        activeTab: "studio-tab",
        soundEnabled: true,
        isDarkMode: true,
        history: [],
        activePreset: "default",
        studioConfig: null, // holds currently customized options
        audioContext: null
    };

    // Synthesized Sound Effects using Web Audio API
    const sounds = {
        init() {
            if (state.audioContext) return;
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                state.audioContext = new AudioContextClass();
            } catch (e) {
                console.warn("Web Audio API not supported in this browser.");
            }
        },
        play(type) {
            if (!state.soundEnabled || !state.audioContext) return;
            
            // Resume context if suspended (browser security policy)
            if (state.audioContext.state === "suspended") {
                state.audioContext.resume();
            }

            const ctx = state.audioContext;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case "click":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                case "success":
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.setValueAtTime(0.08, now + 0.16);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                    break;
                case "error":
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.linearRampToValueAtTime(100, now + 0.35);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                    osc.start(now);
                    osc.stop(now + 0.38);
                    break;
                case "preset":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(329.63, now); // E4
                    osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.18); // D5
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
            }
        }
    };

    // Public expose for sounds
    window.Chandra.sounds = sounds;

    // Custom Toast Notifications
    function showToast(message, type = "info") {
        const container = $("#toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let icon = "fa-circle-info";
        if (type === "success") icon = "fa-circle-check";
        if (type === "error") icon = "fa-circle-exclamation";

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Slide out and remove
        setTimeout(() => {
            toast.style.animation = "slideOut 0.25s ease forwards";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
    window.Chandra.showToast = showToast;

    // Switch Tabs Routing logic
    function switchTab(tabId) {
        if (!tabId) return;
        sounds.init();
        
        const tabs = $$(".tab-content");
        const navButtons = $$(".tab-btn");

        tabs.forEach(tab => {
            tab.classList.remove("active-content");
        });
        navButtons.forEach(btn => {
            btn.classList.remove("active");
            if (btn.getAttribute("data-tab") === tabId) {
                btn.classList.add("active");
            }
        });

        const activePanel = document.getElementById(tabId);
        if (activePanel) {
            activePanel.classList.add("active-content");
            state.activeTab = tabId;
            sounds.play("click");
            
            // Trigger tab specific entry hooks
            if (tabId === "scanner-tab") {
                window.Chandra.scanner?.initScanner?.();
            } else {
                window.Chandra.scanner?.stopScanner?.();
            }

            if (tabId === "analytics-tab") {
                window.Chandra.customization?.initAnalyticsChart?.();
            }
        }
    }

    // Toggle Sound feedback state
    function toggleSound() {
        state.soundEnabled = !state.soundEnabled;
        const icon = $("#soundToggle i");
        if (icon) {
            icon.className = state.soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
        }
        localStorage.setItem("chandra_sound", state.soundEnabled ? "on" : "off");
        if (state.soundEnabled) {
            sounds.init();
            sounds.play("click");
        }
        showToast(state.soundEnabled ? "Sound enabled" : "Sound muted", "info");
    }

    // Toggle Dark / Light Theme
    function toggleTheme() {
        state.isDarkMode = !state.isDarkMode;
        document.body.classList.toggle("light-theme", !state.isDarkMode);
        
        const btnIcon = $("#themeToggle i");
        if (btnIcon) {
            btnIcon.className = state.isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun";
        }
        
        localStorage.setItem("chandra_theme", state.isDarkMode ? "dark" : "light");
        sounds.play("click");
        showToast(state.isDarkMode ? "Dark theme active" : "Light theme active", "info");
    }

    // Modal Helpers
    const modal = {
        show(modalId) {
            const el = $(`#${modalId}`);
            if (el) el.hidden = false;
        },
        hide(modalId) {
            const el = $(`#${modalId}`);
            if (el) el.hidden = true;
        }
    };

    // Keyboard Shortcuts
    function handleKeyboardShortcuts(e) {
        // Alt + key patterns
        if (e.altKey && !e.ctrlKey && !e.metaKey) {
            const key = e.key.toLowerCase();
            switch (key) {
                case "s":
                    e.preventDefault();
                    switchTab("studio-tab");
                    break;
                case "p":
                    e.preventDefault();
                    switchTab("presets-tab");
                    break;
                case "c":
                    e.preventDefault();
                    switchTab("scanner-tab");
                    break;
                case "b":
                    e.preventDefault();
                    switchTab("batch-tab");
                    break;
                case "k":
                    e.preventDefault();
                    toggleSound();
                    break;
                case "t":
                    e.preventDefault();
                    toggleTheme();
                    break;
                case "d":
                    e.preventDefault();
                    $("#btnDownloadPNG")?.click();
                    break;
                case "r":
                    e.preventDefault();
                    $("#btnResetAllStudio")?.click();
                    break;
            }
        }
    }

    // Local Storage History Manager
    const historyManager = {
        load() {
            try {
                const stored = localStorage.getItem("chandra_history");
                state.history = stored ? JSON.parse(stored) : [];
            } catch (err) {
                state.history = [];
            }
            this.render();
        },
        save(item) {
            // Check if item already exists to avoid duplicates
            state.history = state.history.filter(h => h.payload !== item.payload);
            state.history.unshift(item);
            if (state.history.length > 20) {
                state.history.pop();
            }
            localStorage.setItem("chandra_history", JSON.stringify(state.history));
            this.render();
        },
        clear() {
            state.history = [];
            localStorage.removeItem("chandra_history");
            this.render();
            sounds.play("error");
            showToast("History cleared successfully", "success");
        },
        render() {
            const studioHistoryList = $("#studioHistoryScroll");
            if (!studioHistoryList) return;

            studioHistoryList.innerHTML = "";
            if (state.history.length === 0) {
                studioHistoryList.innerHTML = `<div class="hint text-center" style="padding: 20px;">No saved history items. Generate QRs to save them.</div>`;
                return;
            }

            state.history.forEach(item => {
                const div = document.createElement("div");
                div.className = "history-card-item";
                
                const thumb = document.createElement("div");
                thumb.className = "history-card-item__thumb";
                if (item.thumbUrl) {
                    thumb.innerHTML = `<img src="${item.thumbUrl}" alt="QR Mini" />`;
                } else {
                    thumb.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size:24px; color:#cbd5e1;"></i>`;
                }

                const info = document.createElement("div");
                info.className = "history-card-item__info";
                
                const title = document.createElement("span");
                title.className = "history-card-item__title";
                title.textContent = item.payload;

                const date = document.createElement("span");
                date.className = "history-card-item__date";
                date.textContent = `${item.type.toUpperCase()} • ${new Date(item.timestamp).toLocaleDateString()}`;

                info.appendChild(title);
                info.appendChild(date);

                const actions = document.createElement("div");
                actions.className = "history-card-item__actions";
                
                const applyBtn = document.createElement("button");
                applyBtn.className = "btn small primary";
                applyBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Load`;
                applyBtn.addEventListener("click", () => {
                    window.Chandra?.qr?.loadFromSavedConfig?.(item);
                    switchTab("studio-tab");
                    showToast("Configuration restored", "success");
                });

                actions.appendChild(applyBtn);

                div.appendChild(thumb);
                div.appendChild(info);
                div.appendChild(actions);

                studioHistoryList.appendChild(div);
            });
        }
    };
    window.Chandra.history = historyManager;

    // Interactive Particles Background Canvas
    function initParticlesBackground() {
        const canvas = $("#particlesCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.alpha = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction push
                if (mouse.x && mouse.y) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = state.isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,114,255,0.4)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function init() {
            particles = [];
            const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animate();
    }

    // Accordion setup
    function setupCollapsibleSections() {
        $$(".collapsible-section").forEach(sec => {
            const header = sec.querySelector(".section-header");
            const btn = sec.querySelector(".collapse-btn");

            const toggle = (e) => {
                // Avoid triggers on input clicks inside headers
                if (e.target.closest("input, select, button") && e.target !== btn) return;
                sec.classList.toggle("section-collapsed");
                sounds.play("click");
            };

            header.addEventListener("click", toggle);
            if (btn) btn.addEventListener("click", toggle);
        });
    }

    // App Initialization entries
    function initApp() {
        // Tab buttons clicks
        $$(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-tab");
                switchTab(target);
            });
        });

        // Theme and sounds loaders
        $("#themeToggle")?.addEventListener("click", toggleTheme);
        $("#soundToggle")?.addEventListener("click", toggleSound);

        const savedTheme = localStorage.getItem("chandra_theme");
        if (savedTheme === "light") {
            state.isDarkMode = false;
            document.body.classList.add("light-theme");
            const icon = $("#themeToggle i");
            if (icon) icon.className = "fa-solid fa-sun";
        }

        const savedSound = localStorage.getItem("chandra_sound");
        if (savedSound === "off") {
            state.soundEnabled = false;
            const icon = $("#soundToggle i");
            if (icon) icon.className = "fa-solid fa-volume-xmark";
        }

        // Shortcuts modal bindings
        $("#keyboardShortcutsBtn")?.addEventListener("click", () => modal.show("shortcutsModal"));
        $("#closeShortcutsModalBtn")?.addEventListener("click", () => modal.hide("shortcutsModal"));
        $("#shortcutsModal")?.addEventListener("click", (e) => {
            if (e.target === $("#shortcutsModal")) modal.hide("shortcutsModal");
        });

        // Keydown keyboard binds
        window.addEventListener("keydown", handleKeyboardShortcuts);

        // Sound contextual trigger
        document.body.addEventListener("click", () => sounds.init(), { once: true });

        // History setups
        historyManager.load();
        $("#btnClearHistoryBtn")?.addEventListener("click", () => historyManager.clear());

        // Collapsible elements init
        setupCollapsibleSections();

        // Parallax ambient particle flows
        initParticlesBackground();

        // Reveal effect GSAP
        if (window.gsap) {
            window.gsap.from(".navbar", { 
                y: -50, 
                opacity: 0, 
                duration: 0.6, 
                ease: "power2.out",
                onComplete: () => {
                    window.gsap.set(".navbar", { clearProps: "transform" });
                }
            });
        }
    }

    document.addEventListener("DOMContentLoaded", initApp);
})();
