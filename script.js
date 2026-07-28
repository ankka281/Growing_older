document.addEventListener("DOMContentLoaded", () => {
  // Nav
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 16);
  });

  navToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  // Waveform
  const waveform = document.getElementById("waveform");
  if (waveform) {
    for (let i = 0; i < 16; i++) {
      const bar = document.createElement("span");
      bar.style.animationDelay = `${(i % 5) * 0.12}s`;
      waveform.appendChild(bar);
    }
  }

  // Audio player
  const audio = new Audio();
  // audio.src = "podcast.mp3"; // uncomment when file is ready

  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
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
      alert("Audio not added yet.\n\nPut podcast.mp3 in the repo root and uncomment audio.src in script.js");
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
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });

  document.getElementById("rewindBtn")?.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  });
  document.getElementById("forwardBtn")?.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
  });

  // Voices panels
  const panels = {
    1: {
      title: "Rites & Recognition",
      cells: [
        { label: "Armenia", text: "Family gatherings, respect in daily speech, church & community roles." },
        { label: "USA", text: "Retirement parties, milestone birthdays, senior programs & discounts." },
        { label: "Morocco", text: "Intergenerational homes, religious status, oral storytelling." },
      ],
      note: "In many places the shift is gradual and relational — not one official moment. Replace this with your own findings.",
    },
    2: {
      title: "What Gets Passed Down",
      cells: [
        { label: "Armenia", text: "Recipes, family history, moral stories, land & names." },
        { label: "USA", text: "Advice about independence & career — sometimes silence about hardship." },
        { label: "Morocco", text: "Proverbs, religious knowledge, practical skills, hospitality." },
      ],
      note: "Some knowledge travels easily (food, jokes). Regret, fear, unfinished dreams often stay unspoken.",
    },
    3: {
      title: "Growing Older vs Growing Up",
      cells: [
        { label: "Armenia", text: "Strong expectation of care for parents; identity tied to family role." },
        { label: "USA", text: "Emphasis on autonomy; “age is just a number” vs ageism at work." },
        { label: "Morocco", text: "Collective identity; elders as living libraries of the community." },
      ],
      note: "We’re already deciding what kind of adults we want to become — and what we’ll carry forward. That’s the UWC bridge.",
    },
  };

  const voicePanel = document.getElementById("voicePanel");
  const panelContent = document.getElementById("panelContent");

  document.querySelectorAll(".voice-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.voice;
      const data = panels[id];
      if (!data) return;
      panelContent.innerHTML = `
        <h3 style="font-family:var(--display);font-size:1.4rem;margin-bottom:4px">${data.title}</h3>
        <div class="panel-grid">
          ${data.cells
            .map(
              (c) => `<div class="panel-cell"><strong>${c.label}</strong>${c.text}</div>`
            )
            .join("")}
        </div>
        <p class="panel-note">${data.note}</p>
      `;
      voicePanel.hidden = false;
      voicePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.getElementById("panelClose")?.addEventListener("click", () => {
    voicePanel.hidden = true;
  });

  // Capsule chips
  const toInput = document.getElementById("capsuleTo");
  document.querySelectorAll("#toChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#toChips .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      toInput.value = chip.dataset.value;
    });
  });

  // Capsule form
  const form = document.getElementById("capsuleForm");
  const messagesList = document.getElementById("messagesList");
  const charCount = document.getElementById("charCount");
  const messageInput = document.getElementById("capsuleMessage");
  const STORAGE_KEY = "echoes-horizons-capsule-v2";

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveMessages(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function labelFor(val) {
    return (
      {
        "future-self": "Future self",
        younger: "Someone younger",
        older: "Someone older",
        community: "Our community",
      }[val] || val
    );
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function renderMessages() {
    const messages = loadMessages();
    if (!messages.length) {
      messagesList.innerHTML = `<p class="empty">No messages yet. Be the first.</p>`;
      return;
    }
    messagesList.innerHTML = messages
      .map(
        (m) => `
      <div class="msg">
        <div class="meta">${m.name || "Anonymous"} · to ${labelFor(m.to)} · ${m.date}</div>
        <div>${escapeHtml(m.text)}</div>
      </div>`
      )
      .join("");
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
      to: toInput.value,
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
    document.querySelectorAll("#toChips .chip").forEach((c) => c.classList.remove("active"));
    document.querySelector('#toChips .chip[data-value="future-self"]')?.classList.add("active");
    toInput.value = "future-self";
    renderMessages();
  });

  document.getElementById("clearCapsule")?.addEventListener("click", () => {
    if (confirm("Clear all messages in this browser?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderMessages();
    }
  });

  renderMessages();

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".story-card, .voice-card, .highlight-card, .player-card, .capsule-wrap, .guest-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
});
