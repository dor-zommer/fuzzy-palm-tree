(function () {
  "use strict";

  const MAX_SELECT = 4;
  const RECENT_GROUPS_LIMIT = 16;
  const BEST_LEVEL_KEY = "what-connection:best-level";

  const state = {
    level: 1,
    bestLevel: 0,
    puzzle: null,            // [{difficulty, category, words, _ref}, ...]
    tiles: [],               // [{word, group}, ...]
    solvedGroups: [],
    selected: new Set(),     // indices into tiles
    attemptsLeft: 0,
    maxAttempts: 0,
    gameOver: false,
    revealedHints: new Set(),// words
    recentGroupRefs: []      // queue of recently used group refs
  };

  const els = {
    board: document.getElementById("board"),
    solved: document.getElementById("solved"),
    message: document.getElementById("message"),
    metaAuthor: document.getElementById("meta-author"),
    metaDiff: document.getElementById("meta-diff"),
    attemptsDots: document.getElementById("attempts-dots"),
    submitBtn: document.getElementById("submit-btn"),
    clearBtn: document.getElementById("clear-btn"),
    shuffleBtn: document.getElementById("shuffle-btn"),
    hintBtn: document.getElementById("hint-btn"),
    helpBtn: document.getElementById("help-btn"),
    backBtn: document.getElementById("back-btn"),
    helpModal: document.getElementById("help-modal"),
    endModal: document.getElementById("end-modal"),
    endTitle: document.getElementById("end-title"),
    endMessage: document.getElementById("end-message"),
    endSummary: document.getElementById("end-summary"),
    playAgainBtn: document.getElementById("play-again-btn")
  };

  function loadBestLevel() {
    try {
      const raw = localStorage.getItem(BEST_LEVEL_KEY);
      const n = raw ? parseInt(raw, 10) : 0;
      state.bestLevel = Number.isFinite(n) && n > 0 ? n : 0;
    } catch (_) {
      state.bestLevel = 0;
    }
  }

  function saveBestLevel() {
    try {
      if (state.level > state.bestLevel) {
        state.bestLevel = state.level;
        localStorage.setItem(BEST_LEVEL_KEY, String(state.bestLevel));
      }
    } catch (_) { /* ignore */ }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function classifyLength(word) {
    const len = word.length;
    if (len >= 9) return "xlong";
    if (len >= 6) return "long";
    return "short";
  }

  function levelTierLabel(level) {
    if (level <= 2) return "קל";
    if (level <= 5) return "בינוני";
    if (level <= 9) return "קשה";
    return "מומחה";
  }

  function rememberGroups(groups) {
    groups.forEach(g => state.recentGroupRefs.push(g._ref));
    while (state.recentGroupRefs.length > RECENT_GROUPS_LIMIT) {
      state.recentGroupRefs.shift();
    }
  }

  function startLevel(level) {
    state.level = level;
    state.maxAttempts = attemptsForLevel(level);
    state.attemptsLeft = state.maxAttempts;
    state.solvedGroups = [];
    state.selected.clear();
    state.gameOver = false;
    state.revealedHints = new Set();

    const avoid = new Set(state.recentGroupRefs);
    state.puzzle = composePuzzle(avoid);
    rememberGroups(state.puzzle);

    const allWords = [];
    state.puzzle.forEach(g => {
      g.words.forEach(w => allWords.push({ word: w, group: g }));
    });
    state.tiles = shuffle(allWords);

    els.metaAuthor.textContent = `שלב ${state.level}`;
    els.metaDiff.textContent = levelTierLabel(state.level);
    els.message.textContent = "";

    renderSolved();
    renderBoard();
    renderAttempts();
    updateButtons();
  }

  function startNewRun() {
    state.recentGroupRefs = [];
    startLevel(1);
  }

  function renderSolved() {
    els.solved.innerHTML = "";
    state.solvedGroups.forEach(g => {
      const div = document.createElement("div");
      div.className = `solved-group diff-${g.difficulty}`;
      const cat = document.createElement("p");
      cat.className = "solved-category";
      cat.textContent = g.category;
      const words = document.createElement("p");
      words.className = "solved-words";
      words.textContent = g.words.join(", ");
      div.appendChild(cat);
      div.appendChild(words);
      els.solved.appendChild(div);
    });
  }

  function renderBoard() {
    els.board.innerHTML = "";
    state.tiles.forEach((tile, idx) => {
      const btn = document.createElement("button");
      btn.className = "tile";
      btn.textContent = tile.word;
      btn.dataset.idx = idx;
      btn.dataset.len = classifyLength(tile.word);
      if (state.selected.has(idx)) btn.classList.add("selected");
      if (state.revealedHints.has(tile.word)) btn.classList.add("hint");
      btn.addEventListener("click", () => onTileClick(idx));
      els.board.appendChild(btn);
    });
  }

  function renderAttempts() {
    els.attemptsDots.innerHTML = "";
    const used = state.maxAttempts - state.attemptsLeft;
    for (let i = 0; i < state.maxAttempts; i++) {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i < used) dot.classList.add("used");
      els.attemptsDots.appendChild(dot);
    }
  }

  function updateButtons() {
    const hasSelection = state.selected.size > 0;
    els.submitBtn.disabled = state.gameOver || state.selected.size !== MAX_SELECT;
    els.clearBtn.disabled = state.gameOver || !hasSelection;
    els.shuffleBtn.disabled = state.gameOver || state.tiles.length === 0;
    const hardestSolved = state.solvedGroups.some(g => g.difficulty === 4);
    els.hintBtn.disabled = state.gameOver || hardestSolved || state.revealedHints.size >= 2;
  }

  function onTileClick(idx) {
    if (state.gameOver) return;
    if (state.selected.has(idx)) {
      state.selected.delete(idx);
    } else {
      if (state.selected.size >= MAX_SELECT) return;
      state.selected.add(idx);
    }
    renderBoard();
    updateButtons();
  }

  function clearSelection() {
    if (state.gameOver) return;
    state.selected.clear();
    renderBoard();
    updateButtons();
  }

  function shuffleBoard() {
    if (state.gameOver) return;
    const selectedWords = new Set(
      [...state.selected].map(i => state.tiles[i].word)
    );
    state.tiles = shuffle(state.tiles);
    state.selected = new Set();
    state.tiles.forEach((tile, i) => {
      if (selectedWords.has(tile.word)) state.selected.add(i);
    });
    renderBoard();
    updateButtons();
  }

  function showMessage(text, duration = 1800) {
    els.message.textContent = text;
    if (duration > 0) {
      const current = text;
      setTimeout(() => {
        if (els.message.textContent === current) els.message.textContent = "";
      }, duration);
    }
  }

  function shakeSelected() {
    [...state.selected].forEach(i => {
      const node = els.board.children[i];
      if (!node) return;
      node.classList.remove("shake");
      void node.offsetWidth;
      node.classList.add("shake");
    });
  }

  function submitGuess() {
    if (state.gameOver) return;
    if (state.selected.size !== MAX_SELECT) return;

    const indices = [...state.selected];
    const groups = indices.map(i => state.tiles[i].group);
    const allSame = groups.every(g => g === groups[0]);

    if (allSame) {
      const group = groups[0];
      state.solvedGroups.push(group);
      state.solvedGroups.sort((a, b) => a.difficulty - b.difficulty);
      const wordsToRemove = new Set(group.words);
      state.tiles = state.tiles.filter(t => !wordsToRemove.has(t.word));
      state.selected.clear();
      group.words.forEach(w => state.revealedHints.delete(w));
      renderSolved();
      renderBoard();
      updateButtons();

      if (state.solvedGroups.length === 4) {
        completeLevel();
      } else {
        showMessage("יפה! קבוצה נכונה");
      }
    } else {
      const counts = {};
      groups.forEach(g => {
        counts[g.category] = (counts[g.category] || 0) + 1;
      });
      const oneAway = Math.max(...Object.values(counts)) === 3;

      shakeSelected();
      state.attemptsLeft--;
      renderAttempts();
      showMessage(oneAway ? "כמעט! חסרה מילה אחת" : "לא נכון");

      if (state.attemptsLeft <= 0) {
        endRun();
      }
      updateButtons();
    }
  }

  function showHint() {
    if (state.gameOver) return;
    const hardest = state.puzzle.find(g => g.difficulty === 4);
    if (!hardest) return;
    if (state.solvedGroups.includes(hardest)) return;

    const onBoard = hardest.words.filter(w =>
      state.tiles.some(t => t.word === w)
    );
    const notRevealed = onBoard.filter(w => !state.revealedHints.has(w));
    const need = Math.max(0, 2 - state.revealedHints.size);
    const toReveal = shuffle(notRevealed).slice(0, need);
    toReveal.forEach(w => state.revealedHints.add(w));
    renderBoard();
    updateButtons();
    if (toReveal.length > 0) {
      showMessage("נחשפו רמזים בקבוצה האדומה");
    }
  }

  function completeLevel() {
    saveBestLevel();
    showMessage(`שלב ${state.level} הושלם! עוברים לשלב ${state.level + 1}…`, 1400);
    const nextLevel = state.level + 1;
    setTimeout(() => startLevel(nextLevel), 1300);
  }

  function endRun() {
    state.gameOver = true;
    saveBestLevel();

    // Auto-reveal remaining groups
    const solvedSet = new Set(state.solvedGroups);
    state.puzzle
      .filter(g => !solvedSet.has(g))
      .sort((a, b) => a.difficulty - b.difficulty)
      .forEach(g => state.solvedGroups.push(g));
    state.tiles = [];
    renderSolved();
    renderBoard();
    updateButtons();

    els.endTitle.textContent = "סוף הריצה";
    const reachedTxt = `הגעת לשלב ${state.level}.`;
    const bestTxt = state.bestLevel > 0
      ? ` שיא אישי: שלב ${state.bestLevel}.`
      : "";
    els.endMessage.textContent = reachedTxt + bestTxt;

    els.endSummary.innerHTML = "";
    state.solvedGroups
      .sort((a, b) => a.difficulty - b.difficulty)
      .forEach(g => {
        const div = document.createElement("div");
        div.className = `solved-group diff-${g.difficulty}`;
        const cat = document.createElement("p");
        cat.className = "solved-category";
        cat.textContent = g.category;
        const words = document.createElement("p");
        words.className = "solved-words";
        words.textContent = g.words.join(", ");
        div.appendChild(cat);
        div.appendChild(words);
        els.endSummary.appendChild(div);
      });

    setTimeout(() => openModal(els.endModal), 600);
  }

  function openModal(modal) { modal.hidden = false; }
  function closeModal(modal) { modal.hidden = true; }

  // Wiring
  els.submitBtn.addEventListener("click", submitGuess);
  els.clearBtn.addEventListener("click", clearSelection);
  els.shuffleBtn.addEventListener("click", shuffleBoard);
  els.hintBtn.addEventListener("click", showHint);
  els.helpBtn.addEventListener("click", () => openModal(els.helpModal));
  els.backBtn.addEventListener("click", () => {
    if (confirm("להתחיל ריצה חדשה משלב 1?")) startNewRun();
  });
  els.playAgainBtn.addEventListener("click", () => {
    closeModal(els.endModal);
    startNewRun();
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(document.getElementById(btn.dataset.close));
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Boot
  loadBestLevel();
  startLevel(1);
})();
