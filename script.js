// Simple kid-friendly typing game
(function () {
  const targetEl = document.getElementById("target");
  const celebrate = document.getElementById("celebrate");
  const incorrect = document.getElementById("incorrect");
  const balloonContainer = document.getElementById("balloons");
  const newBtn = document.getElementById("newBtn");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const settingsPanel = document.getElementById("settings-panel");
  const panelOverlay = document.getElementById("panel-overlay");
  const lettersCheck = document.getElementById("letters-check");
  const numbersCheck = document.getElementById("numbers-check");
  const specialCheck = document.getElementById("special-check");

  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const NUMBERS = "0123456789";
  const SPECIAL = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let current = "";
  // balloon and celebration timing (ms)
  const BALLOON_MIN = 3500; // balloons rise at least this long
  const BALLOON_MAX = 5000; // up to this long
  const CELEBRATION_MS = BALLOON_MAX + 800; // keep overlay visible until balloons finish

  function pick() {
    current = letters.charAt(Math.floor(Math.random() * letters.length));
    targetEl.textContent = current;
    // hide overlays
    celebrate.classList.remove("show");
    if (incorrect) incorrect.classList.remove("show");
    // keep focus behavior simple for kids: they can press any key
    // ensure New button is enabled
    if (newBtn) newBtn.disabled = false;
  }

  function celebrateNow() {
    celebrate.classList.add("show");
    // set a bold solid background color for the celebration
    const colors = ["#fffae6", "#fff0f6", "#e6f7ff", "#e8ffe6", "#fff3e0"];
    const bg = colors[Math.floor(Math.random() * colors.length)];
    celebrate.style.background = bg;
    // create balloons rising
    if (balloonContainer) {
      createBalloons(14);
    }
    // small beep using WebAudio
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
    // hide celebration after balloons finish (CELEBRATION_MS)
    setTimeout(() => {
      celebrate.classList.remove("show");
      // clear balloon children
      if (balloonContainer) balloonContainer.innerHTML = "";
      // reset background
      celebrate.style.background = "";
    }, CELEBRATION_MS);
  }

  function onInput(val) {
    if (!val) return;
    const v = val.trim().charAt(0).toUpperCase();
    if (v === current.toUpperCase()) {
      celebrateNow();
      // advance to the next character after the celebration finishes
      if (newBtn) newBtn.disabled = true;
      setTimeout(() => {
        pick();
      }, CELEBRATION_MS);
    } else {
      // show incorrect overlay
      if (incorrect) incorrect.classList.add("show");
      setTimeout(() => {
        if (incorrect) incorrect.classList.remove("show");
      }, 1200);
    }
  }

  // listen to keyboard anywhere (so kids can press keys). No input box used.
  window.addEventListener("keydown", (e) => {
    // ignore modifier-only keys like Shift, Control, Alt, etc.
    if (e.key && e.key.length === 1) {
      onInput(e.key);
    }
  });

  if (newBtn) {
    newBtn.addEventListener("click", () => {
      // prevent rapid clicks
      newBtn.disabled = true;
      pick();
    });
  } else {
    console.warn("New button not found");
  }

  // balloons helper
  function createBalloons(count) {
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF7AA2"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "balloon";
      const left = Math.random() * 90; // percent
      const size = 38 + Math.floor(Math.random() * 40); // 38-78px
      const color = colors[Math.floor(Math.random() * colors.length)];
      // make balloons rise more slowly so they reach the top nicely
      const duration = BALLOON_MIN + Math.floor(Math.random() * (BALLOON_MAX - BALLOON_MIN + 1));
      const delay = Math.floor(Math.random() * 400);
      el.style.left = left + "%";
      el.style.width = size + "px";
      el.style.height = Math.round(size * 1.25) + "px";
      // gradient to make balloon look round
      el.style.background = "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.0) 35%), " + color;
      // animate rise only (no rotation)
      el.style.animation = `balloon-rise ${duration}ms linear ${delay}ms forwards`;
      if (balloonContainer) balloonContainer.appendChild(el);
      // remove after animation
      setTimeout(() => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, duration + delay + 600);
    }
  }

  // initialize
  pick();

  // Settings panel and menu handlers
  function updateLetters() {
    letters = "";
    if (lettersCheck.checked) letters += LETTERS;
    if (numbersCheck.checked) letters += NUMBERS;
    if (specialCheck.checked) letters += SPECIAL;
    // if nothing selected, default to letters
    if (letters.length === 0) {
      letters = LETTERS;
      lettersCheck.checked = true;
    }
    // pick a new character with the updated set
    pick();
  }

  menuBtn.addEventListener("click", () => {
    settingsPanel.classList.add("show");
    panelOverlay.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("show");
    panelOverlay.classList.remove("show");
  });

  panelOverlay.addEventListener("click", () => {
    settingsPanel.classList.remove("show");
    panelOverlay.classList.remove("show");
  });

  lettersCheck.addEventListener("change", updateLetters);
  numbersCheck.addEventListener("change", updateLetters);
  specialCheck.addEventListener("change", updateLetters);
})();
