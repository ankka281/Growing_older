/* Echoes & Horizons — interactive behaviours
   Fully static / GitHub Pages friendly
*/

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Nav scroll + mobile toggle ----------
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  navToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  // ---------- Waveform bars (decorative) ----------
  const waveform = document.getElementById("waveform");
  if (waveform) {
    for (let i = 0; i < 18; i++) {
      const bar = document.createElement("span");
      bar.style.animationDelay = `${(i % 6) * 0.12}s`;
      waveform.appendChild(bar);
    }
  }

  // ---------- Simple audio player (placeholder-ready) ----------
  // When you have the file: put podcast.mp3 in assets/ and set the src below.
  const audio = new Audio();
  // audio.src = "assets/podcast.mp3";  // ← uncomment & add file when ready

  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const playerArtwork = document.getElementById("playerArtwork");

  let isPlaying = false;

  function formatTime(sec) {
    if (!isFinite(sec)) return "—:—";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    if (!audio.src) {
      // Demo mode — no real file yet
      alert(
        "Audio file not added yet.\n\nWhen ready:\n1. Put podcast.mp3 in the assets/ folder\n2. Uncomment the audio.src line in js/script.js\n3. Push to GitHub Pages"
      );
      return;
    }
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = "Play";
      playIcon.textContent = "▶";
    } else {
      audio.play();
      playBtn.textContent = "Pause";
      playIcon.textContent = "❚❚";
    }
    isPlaying = !isPlaying;
  }

  playBtn?.addEventListener("click", togglePlay);
  playerArtwork?.addEventListener("click", togglePlay);

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    progressFill.style.width = `${pct}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    isPlaying = false;
    playBtn.textContent = "Play";
    playIcon.textContent = "▶";
    progressFill.style.width = "0%";
  });

  progressBar?.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  rewindBtn?.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  });

  forwardBtn?.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
  });

  // ---------- Expandable Voices rows ----------
  document.querySelectorAll(".voices-row[data-expandable]").forEach((row) => {
    row.addEventListener("click", () => {
      const next = row.nextElementSibling;
      if (next && next.classList.contains("detail")) {
        const isHidden = next.hasAttribute("hidden");
        // close others
        document.querySelectorAll(".voices-row.detail").forEach((d) => {
          d.setAttribute("hidden", "");
        });
        document.querySelectorAll(".voices-row[data-expandable]").forEach((r) => {
          r.classList.remove("open");
        });
        if (isHidden) {
          next.removeAttribute("hidden");
          row.classList.add("open");
        }
      }
    });
  });

  // ---------- Time Capsule (localStorage) ----------
  const form = document.getElementById("capsuleForm");
  const messagesList = document.getElementById("messagesList");
  const charCount = document.getElementById("charCount");
  const messageInput = document.getElementById("capsuleMessage");
  const clearBtn = document.getElementById("clearCapsule");

  const STORAGE_KEY = "echoes-horizons-capsule";

  function loadMessages() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveMessages(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function renderMessages() {
    const messages = loadMessages();
    if (!messages.length) {
      messagesList.innerHTML = `<p class="empty-state">No messages yet. Be the first.</p>`;
      return;
    }
    messagesList.innerHTML = messages
      .map(
        (m) => `
      <div class="message-item">
        <div class="meta">${m.name || "Anonymous"} · to ${labelFor(m.to)} · ${m.date}</div>
        <div class="body">${escapeHtml(m.text)}</div>
      </div>`
      )
      .join("");
  }

  function labelFor(val) {
    const map = {
      "future-self": "Future self",
      younger: "Someone younger",
      older: "Someone older",
      community: "Our community",
    };
    return map[val] || val;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  messageInput?.addEventListener("input", () => {
    charCount.textContent = messageInput.value.length;
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const messages = loadMessages();
    messages.unshift({
      name: document.getElementById("capsuleName").value.trim(),
      to: document.getElementById("capsuleTo").value,
      text,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
    saveMessages(messages);
    form.reset();
    charCount.textContent = "0";
    renderMessages();
  });

  clearBtn?.addEventListener("click", () => {
    if (confirm("Clear all messages stored in this browser?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderMessages();
    }
  });

  renderMessages();

  // ---------- Subtle reveal on scroll ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(
      ".reflection-card, .team-card, .highlight, .player-card, .capsule-box, .guest-card"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
      observer.observe(el);
    });
});
