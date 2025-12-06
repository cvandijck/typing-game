// Global variable to store translations from window object
let globalTranslations = window.translations || {};

// Simple kid-friendly typing game with multilingual support using Alpine.js
function typingGame() {
  return {
    // Translations from window object
    translations: globalTranslations,

    // State
    language: localStorage.getItem("selectedLanguage") || "en",
    current: "",
    showSettings: false,
    showCelebrate: false,
    showIncorrect: false,
    skipDisabled: false,
    useLetters: localStorage.getItem("useLetters") !== "false",
    useNumbers: localStorage.getItem("useNumbers") !== "false",
    useSpecial: localStorage.getItem("useSpecial") === "true",
    letters: "",

    // Constants
    LETTERS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    NUMBERS: "0123456789",
    SPECIAL: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    BALLOON_MIN: 3500,
    BALLOON_MAX: 5000,
    get CELEBRATION_MS() {
      return this.BALLOON_MAX + 800;
    },

    // Translation function
    t(key) {
      return this.translations[this.language]?.[key] || this.translations["en"]?.[key] || key;
    },

    // Set language
    setLanguage(lang) {
      this.language = lang;
      localStorage.setItem("selectedLanguage", lang);
    },

    // Update character set
    updateLetters() {
      this.letters = "";
      if (this.useLetters) this.letters += this.LETTERS;
      if (this.useNumbers) this.letters += this.NUMBERS;
      if (this.useSpecial) this.letters += this.SPECIAL;

      if (this.letters.length === 0) {
        this.letters = this.LETTERS;
        this.useLetters = true;
      }

      localStorage.setItem("useLetters", this.useLetters);
      localStorage.setItem("useNumbers", this.useNumbers);
      localStorage.setItem("useSpecial", this.useSpecial);

      this.pick();
    },

    // Pick random character
    pick() {
      if (this.letters.length === 0) {
        this.updateLetters();
        return;
      }
      this.current = this.letters.charAt(Math.floor(Math.random() * this.letters.length));
      this.showCelebrate = false;
      this.showIncorrect = false;
      this.skipDisabled = false;
    },

    // Create balloons
    createBalloons(count) {
      const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF7AA2"];
      const balloonContainer = document.getElementById("balloons");

      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.className = "balloon";
        const left = Math.random() * 90;
        const size = 38 + Math.floor(Math.random() * 40);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = this.BALLOON_MIN + Math.floor(Math.random() * (this.BALLOON_MAX - this.BALLOON_MIN + 1));
        const delay = Math.floor(Math.random() * 400);

        el.style.left = left + "%";
        el.style.width = size + "px";
        el.style.height = Math.round(size * 1.25) + "px";
        el.style.background = "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.0) 35%), " + color;
        el.style.animation = `balloon-rise ${duration}ms linear ${delay}ms forwards`;

        balloonContainer.appendChild(el);

        setTimeout(() => {
          el.remove();
        }, duration + delay + 600);
      }
    },

    // Celebrate
    celebrateNow() {
      this.showCelebrate = true;

      const celebrateEl = document.querySelector(".celebrate");
      if (celebrateEl) {
        celebrateEl.style.display = "flex";
        celebrateEl.style.opacity = "1";
        celebrateEl.style.pointerEvents = "auto";
        celebrateEl.style.transition = "opacity 0.25s ease";
      }

      const colors = ["#fffae6", "#fff0f6", "#e6f7ff", "#e8ffe6", "#fff3e0"];
      const bg = colors[Math.floor(Math.random() * colors.length)];
      if (celebrateEl) {
        celebrateEl.style.background = bg;
      }

      this.createBalloons(14);

      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.02;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
          ctx.close();
        }, 220);
      } catch (e) {
        /* ignore */
      }

      setTimeout(() => {
        this.showCelebrate = false;

        if (celebrateEl) {
          celebrateEl.style.opacity = "0";
          celebrateEl.style.pointerEvents = "none";
        }

        const balloonContainer = document.getElementById("balloons");
        if (balloonContainer) {
          balloonContainer.innerHTML = "";
        }

        if (celebrateEl) {
          celebrateEl.style.background = "";
        }
      }, this.CELEBRATION_MS);
    },

    // Handle input
    onInput(val) {
      if (!val) return;
      const v = val.trim().charAt(0).toUpperCase();

      if (v === this.current.toUpperCase()) {
        this.celebrateNow();
        this.skipDisabled = true;
        setTimeout(() => {
          this.pick();
        }, this.CELEBRATION_MS);
      } else {
        const incorrectEl = document.querySelector(".incorrect-overlay");
        if (incorrectEl) {
          incorrectEl.style.display = "flex";
          incorrectEl.style.opacity = "1";
          incorrectEl.style.pointerEvents = "auto";
        }

        setTimeout(() => {
          if (incorrectEl) {
            incorrectEl.style.opacity = "0";
            incorrectEl.style.pointerEvents = "none";
          }
        }, 1200);
      }
    },

    // Initialize
    init() {
      this.updateLetters();

      const menuBtn = document.querySelector(".menu-btn");
      if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
          this.showSettings = true;
          this.openSettingsPanel();
        });
      }

      const closeBtn = document.querySelector(".close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          this.showSettings = false;
          this.closeSettingsPanel();
        });
      }

      const panelOverlay = document.querySelector(".panel-overlay");
      if (panelOverlay) {
        panelOverlay.addEventListener("click", (e) => {
          this.showSettings = false;
          this.closeSettingsPanel();
        });
      }

      const boundOnInput = this.onInput.bind(this);

      document.addEventListener("keydown", (e) => {
        if (e.key && e.key.length === 1) {
          boundOnInput(e.key);
        }
      });
    },

    // Open settings panel
    openSettingsPanel() {
      const settingsPanel = document.querySelector(".settings-panel");
      const panelOverlay = document.querySelector(".panel-overlay");

      if (settingsPanel) {
        settingsPanel.classList.add("show");
        settingsPanel.style.display = "block";
      }
      if (panelOverlay) {
        panelOverlay.classList.add("show");
        panelOverlay.style.display = "block";
      }
    },

    // Close settings panel
    closeSettingsPanel() {
      const settingsPanel = document.querySelector(".settings-panel");
      const panelOverlay = document.querySelector(".panel-overlay");

      if (settingsPanel) {
        settingsPanel.classList.remove("show");
        settingsPanel.style.display = "none";
      }
      if (panelOverlay) {
        panelOverlay.classList.remove("show");
        panelOverlay.style.display = "none";
      }
    },
  };
}

// Initialize when DOM is ready and Alpine is loaded
document.addEventListener("DOMContentLoaded", () => {
  const checkInit = setInterval(() => {
    const element = document.querySelector("[x-data]");
    if (element?.__x?.$data) {
      clearInterval(checkInit);
      element.__x.$data.init();
    }
  }, 50);

  setTimeout(() => {
    const element = document.querySelector("[x-data]");
    if (element?.__x?.$data && element.__x.$data.current === "") {
      element.__x.$data.init();
    }
  }, 1000);
});
