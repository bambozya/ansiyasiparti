(function () {
  var backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg'];
  var storageKey = 'party95-bg-index';
  var index = 0;
  try {
    index = (parseInt(localStorage.getItem(storageKey), 10) || 0) % backgrounds.length;
    localStorage.setItem(storageKey, String((index + 1) % backgrounds.length));
  } catch (e) {}
  document.body.style.backgroundImage = 'url("' + backgrounds[index] + '")';
})();

(function () {
  var track = document.getElementById('tickerTrack');
  var toggle = document.getElementById('tickerToggle');

  function setPaused(paused) {
    track.style.animationPlayState = paused ? 'paused' : 'running';
    toggle.textContent = paused ? toggle.dataset.play : toggle.dataset.pause;
    toggle.setAttribute('aria-pressed', String(paused));
  }

  setPaused(true);

  toggle.addEventListener('click', function () {
    var isPaused = track.style.animationPlayState === 'paused';
    setPaused(!isPaused);
  });
})();

(function () {
  var img = document.getElementById('photoGif');
  var canvas = document.getElementById('photoCanvas');
  var toggle = document.getElementById('photoToggle');
  if (!img || !canvas || !toggle) return;

  var ctx = canvas.getContext('2d');
  var paused = false;

  function freeze() {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.style.display = 'none';
    canvas.style.display = 'inline-block';
    toggle.textContent = toggle.dataset.play;
    toggle.setAttribute('aria-pressed', 'true');
    paused = true;
  }

  function unfreeze() {
    canvas.style.display = 'none';
    img.style.display = '';
    toggle.textContent = toggle.dataset.pause;
    toggle.setAttribute('aria-pressed', 'false');
    paused = false;
  }

  toggle.addEventListener('click', function () {
    if (paused) { unfreeze(); } else { freeze(); }
  });

  if (img.complete) {
    freeze();
  } else {
    img.addEventListener('load', freeze, { once: true });
  }
})();

(function () {
  var btn = document.getElementById('radioBtn');
  var panel = document.getElementById('radioPlayer');
  var closeBtn = document.getElementById('radioCloseBtn');
  var toggle = document.getElementById('radioPlayToggle');
  var audio = document.getElementById('radioAudio');
  var nowPlaying = document.getElementById('radioNowPlaying');
  if (!btn || !panel || !toggle || !audio || !nowPlaying) return;

  var NOW_PLAYING_URL = 'https://ch2.radioalhara.net/api/now-playing';
  var pollTimer = null;

  function setPlayState(playing) {
    toggle.textContent = playing ? toggle.dataset.pause : toggle.dataset.play;
    toggle.setAttribute('aria-pressed', String(playing));
  }

  function play() {
    audio.play().then(function () { setPlayState(true); }).catch(function () {
      setPlayState(false);
    });
  }

  function updateNowPlaying() {
    fetch(NOW_PLAYING_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var text = data && (
          (data.artist && data.title ? data.artist + ' — ' + data.title : data.title)
        );
        nowPlaying.textContent = '♫ ' + (text || nowPlaying.dataset.live);
      })
      .catch(function () {});
  }

  function openPlayer() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    if (!pollTimer) {
      updateNowPlaying();
      pollTimer = setInterval(updateNowPlaying, 20000);
    }
    play();
  }

  function closePlayer() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    audio.pause();
    setPlayState(false);
  }

  btn.addEventListener('click', function () {
    if (panel.hidden) { openPlayer(); } else { closePlayer(); }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePlayer);
  }

  toggle.addEventListener('click', function () {
    if (audio.paused) { play(); } else { audio.pause(); setPlayState(false); }
  });

  audio.addEventListener('waiting', function () {
    nowPlaying.textContent = nowPlaying.dataset.buffering;
  });
  audio.addEventListener('error', function () {
    nowPlaying.textContent = nowPlaying.dataset.error;
    setPlayState(false);
  });

  var titleBar = panel.querySelector('.title-bar');
  var drag = null;

  function clamp(value, max) {
    return Math.min(Math.max(value, 0), Math.max(max, 0));
  }

  if (titleBar) {
    titleBar.addEventListener('pointerdown', function (e) {
      if (closeBtn && e.target.closest('#radioCloseBtn')) return;
      var rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      drag = { startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
      titleBar.setPointerCapture(e.pointerId);
    });

    titleBar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var left = drag.startLeft + (e.clientX - drag.startX);
      var top = drag.startTop + (e.clientY - drag.startY);
      panel.style.left = clamp(left, window.innerWidth - panel.offsetWidth) + 'px';
      panel.style.top = clamp(top, window.innerHeight - panel.offsetHeight) + 'px';
    });

    ['pointerup', 'pointercancel'].forEach(function (evt) {
      titleBar.addEventListener(evt, function () { drag = null; });
    });
  }
})();

(function () {
  var btn = document.getElementById('drummerBtn');
  var panel = document.getElementById('drummerPlayer');
  var closeBtn = document.getElementById('drummerCloseBtn');
  var toggle = document.getElementById('drummerPlayToggle');
  var audio = document.getElementById('drummerAudio');
  var nowPlaying = document.getElementById('drummerNowPlaying');
  if (!btn || !panel || !toggle || !audio || !nowPlaying) return;

  function setPlayState(playing) {
    toggle.textContent = playing ? toggle.dataset.pause : toggle.dataset.play;
    toggle.setAttribute('aria-pressed', String(playing));
  }

  function play() {
    audio.play().then(function () { setPlayState(true); }).catch(function () {
      setPlayState(false);
    });
  }

  function openPlayer() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    nowPlaying.textContent = '♫ ' + nowPlaying.dataset.live;
    play();
  }

  function closePlayer() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    audio.pause();
    setPlayState(false);
  }

  btn.addEventListener('click', function () {
    if (panel.hidden) { openPlayer(); } else { closePlayer(); }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePlayer);
  }

  toggle.addEventListener('click', function () {
    if (audio.paused) { play(); } else { audio.pause(); setPlayState(false); }
  });

  audio.addEventListener('waiting', function () {
    nowPlaying.textContent = nowPlaying.dataset.buffering;
  });
  audio.addEventListener('playing', function () {
    nowPlaying.textContent = '♫ ' + nowPlaying.dataset.live;
  });
  audio.addEventListener('error', function () {
    nowPlaying.textContent = nowPlaying.dataset.error;
    setPlayState(false);
  });

  var titleBar = panel.querySelector('.title-bar');
  var drag = null;

  function clamp(value, max) {
    return Math.min(Math.max(value, 0), Math.max(max, 0));
  }

  if (titleBar) {
    titleBar.addEventListener('pointerdown', function (e) {
      if (closeBtn && e.target.closest('#drummerCloseBtn')) return;
      var rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      drag = { startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
      titleBar.setPointerCapture(e.pointerId);
    });

    titleBar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var left = drag.startLeft + (e.clientX - drag.startX);
      var top = drag.startTop + (e.clientY - drag.startY);
      panel.style.left = clamp(left, window.innerWidth - panel.offsetWidth) + 'px';
      panel.style.top = clamp(top, window.innerHeight - panel.offsetHeight) + 'px';
    });

    ['pointerup', 'pointercancel'].forEach(function (evt) {
      titleBar.addEventListener(evt, function () { drag = null; });
    });
  }
})();

(function () {
  var btn = document.getElementById('punkBtn');
  var panel = document.getElementById('punkPlayer');
  var closeBtn = document.getElementById('punkCloseBtn');
  var toggle = document.getElementById('punkPlayToggle');
  var audio = document.getElementById('punkAudio');
  var nowPlaying = document.getElementById('punkNowPlaying');
  if (!btn || !panel || !toggle || !audio || !nowPlaying) return;

  function setPlayState(playing) {
    toggle.textContent = playing ? toggle.dataset.pause : toggle.dataset.play;
    toggle.setAttribute('aria-pressed', String(playing));
  }

  function play() {
    audio.play().then(function () { setPlayState(true); }).catch(function () {
      setPlayState(false);
    });
  }

  function openPlayer() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    nowPlaying.textContent = '♫ ' + nowPlaying.dataset.live;
    play();
  }

  function closePlayer() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    audio.pause();
    setPlayState(false);
  }

  btn.addEventListener('click', function () {
    if (panel.hidden) { openPlayer(); } else { closePlayer(); }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePlayer);
  }

  toggle.addEventListener('click', function () {
    if (audio.paused) { play(); } else { audio.pause(); setPlayState(false); }
  });

  audio.addEventListener('waiting', function () {
    nowPlaying.textContent = nowPlaying.dataset.buffering;
  });
  audio.addEventListener('playing', function () {
    nowPlaying.textContent = '♫ ' + nowPlaying.dataset.live;
  });
  audio.addEventListener('error', function () {
    nowPlaying.textContent = nowPlaying.dataset.error;
    setPlayState(false);
  });

  var titleBar = panel.querySelector('.title-bar');
  var drag = null;

  function clamp(value, max) {
    return Math.min(Math.max(value, 0), Math.max(max, 0));
  }

  if (titleBar) {
    titleBar.addEventListener('pointerdown', function (e) {
      if (closeBtn && e.target.closest('#punkCloseBtn')) return;
      var rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      drag = { startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
      titleBar.setPointerCapture(e.pointerId);
    });

    titleBar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var left = drag.startLeft + (e.clientX - drag.startX);
      var top = drag.startTop + (e.clientY - drag.startY);
      panel.style.left = clamp(left, window.innerWidth - panel.offsetWidth) + 'px';
      panel.style.top = clamp(top, window.innerHeight - panel.offsetHeight) + 'px';
    });

    ['pointerup', 'pointercancel'].forEach(function (evt) {
      titleBar.addEventListener(evt, function () { drag = null; });
    });
  }
})();

(function () {
  var btn = document.getElementById('minesweeperBtn');
  var panel = document.getElementById('minesweeperWindow');
  var closeBtn = document.getElementById('minesweeperCloseBtn');
  var faceBtn = document.getElementById('minesweeperFace');
  var grid = document.getElementById('minesweeperGrid');
  var mineCounter = document.getElementById('minesweeperMineCount');
  var timerEl = document.getElementById('minesweeperTimer');
  if (!btn || !panel || !closeBtn || !faceBtn || !grid || !mineCounter || !timerEl) return;

  var ROWS = 9, COLS = 9, MINES = 10;
  var cells = [];
  var firstClick = true;
  var gameOver = false;
  var revealedCount = 0;
  var flagCount = 0;
  var timer = 0;
  var timerHandle = null;

  function pad(n) {
    var sign = n < 0 ? '-' : '';
    var s = String(Math.abs(n));
    while (s.length < (sign ? 2 : 3)) s = '0' + s;
    return sign + s;
  }

  function updateMineCounter() {
    mineCounter.textContent = pad(MINES - flagCount);
  }

  function updateTimer() {
    timerEl.textContent = pad(Math.min(timer, 999));
  }

  function idx(r, c) { return r * COLS + c; }

  function neighbors(r, c) {
    var out = [];
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push(idx(nr, nc));
      }
    }
    return out;
  }

  function setFace(state) {
    var faces = { smile: '🙂', worried: '😮', dead: '😵', cool: '😎' };
    faceBtn.textContent = faces[state] || faces.smile;
  }

  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  function startTimer() {
    if (timerHandle) return;
    timerHandle = setInterval(function () {
      timer++;
      updateTimer();
    }, 1000);
  }

  function placeMines(safeIndex) {
    var placed = 0;
    while (placed < MINES) {
      var i = Math.floor(Math.random() * cells.length);
      if (i === safeIndex || cells[i].mine) continue;
      cells[i].mine = true;
      placed++;
    }
    cells.forEach(function (cell) {
      if (cell.mine) return;
      cell.count = neighbors(cell.r, cell.c).filter(function (n) { return cells[n].mine; }).length;
    });
  }

  function revealCell(i) {
    var cell = cells[i];
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    cell.el.classList.add('revealed');
    revealedCount++;
    if (cell.mine) {
      cell.el.classList.add('mine');
      cell.el.textContent = '💥';
      return;
    }
    if (cell.count > 0) {
      cell.el.textContent = String(cell.count);
      cell.el.dataset.n = String(cell.count);
    } else {
      neighbors(cell.r, cell.c).forEach(function (n) {
        if (!cells[n].revealed && !cells[n].flagged) revealCell(n);
      });
    }
  }

  function revealAllMines(explodedIndex) {
    cells.forEach(function (cell, i) {
      if (cell.mine && !cell.revealed) {
        cell.revealed = true;
        cell.el.classList.add('revealed', 'mine');
        cell.el.textContent = i === explodedIndex ? '💥' : '💣';
      } else if (!cell.mine && cell.flagged) {
        cell.el.textContent = '❌';
      }
    });
  }

  function loseGame(i) {
    gameOver = true;
    stopTimer();
    setFace('dead');
    revealAllMines(i);
  }

  function winGame() {
    gameOver = true;
    stopTimer();
    setFace('cool');
    cells.forEach(function (cell) {
      if (cell.mine && !cell.flagged) {
        cell.flagged = true;
        cell.el.textContent = '🚩';
      }
    });
    flagCount = MINES;
    updateMineCounter();
  }

  function checkWin() {
    if (revealedCount === ROWS * COLS - MINES) winGame();
  }

  function onCellClick(i) {
    if (gameOver) return;
    var cell = cells[i];
    if (cell.flagged || cell.revealed) return;
    if (firstClick) {
      placeMines(i);
      firstClick = false;
      startTimer();
    }
    revealCell(i);
    if (cell.mine) {
      loseGame(i);
      return;
    }
    setFace('smile');
    checkWin();
  }

  function toggleFlag(i) {
    if (gameOver) return;
    var cell = cells[i];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    cell.el.textContent = cell.flagged ? '🚩' : '';
    flagCount += cell.flagged ? 1 : -1;
    updateMineCounter();
  }

  function onCellContext(e, i, isTouch) {
    e.preventDefault();
    if (isTouch) return;
    toggleFlag(i);
  }

  function buildGrid() {
    grid.innerHTML = '';
    cells = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        (function (r, c) {
          var i = idx(r, c);
          var cell = { mine: false, revealed: false, flagged: false, count: 0, r: r, c: c };
          var cellBtn = document.createElement('button');
          cellBtn.type = 'button';
          cellBtn.className = 'ms-cell';
          cellBtn.setAttribute('role', 'gridcell');
          cellBtn.setAttribute('aria-label', 'Cell ' + (r + 1) + ', ' + (c + 1));
          cell.el = cellBtn;
          cells.push(cell);
          grid.appendChild(cellBtn);

          var touchActive = false;
          var longPressTimer = null;
          var longPressFired = false;
          var touchStartX = 0;
          var touchStartY = 0;

          cellBtn.addEventListener('click', function () { onCellClick(i); });
          cellBtn.addEventListener('contextmenu', function (e) { onCellContext(e, i, touchActive); });
          cellBtn.addEventListener('mousedown', function (e) {
            if (e.button === 0 && !gameOver && !cell.revealed && !cell.flagged) setFace('worried');
          });
          cellBtn.addEventListener('mouseup', function () {
            if (!gameOver) setFace('smile');
          });
          cellBtn.addEventListener('mouseleave', function () {
            if (!gameOver) setFace('smile');
          });

          cellBtn.addEventListener('touchstart', function (e) {
            if (gameOver || e.touches.length !== 1) return;
            touchActive = true;
            longPressFired = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            longPressTimer = setTimeout(function () {
              longPressFired = true;
              toggleFlag(i);
              if (navigator.vibrate) navigator.vibrate(15);
            }, 450);
          }, { passive: true });

          cellBtn.addEventListener('touchmove', function (e) {
            if (!longPressTimer) return;
            var t = e.touches[0];
            if (Math.abs(t.clientX - touchStartX) > 10 || Math.abs(t.clientY - touchStartY) > 10) {
              clearTimeout(longPressTimer);
              longPressTimer = null;
            }
          }, { passive: true });

          function endTouch(e) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
            if (longPressFired) {
              e.preventDefault();
            }
            touchActive = false;
          }
          cellBtn.addEventListener('touchend', endTouch);
          cellBtn.addEventListener('touchcancel', endTouch);
        })(r, c);
      }
    }
  }

  function newGame() {
    stopTimer();
    gameOver = false;
    firstClick = true;
    revealedCount = 0;
    flagCount = 0;
    timer = 0;
    setFace('smile');
    updateMineCounter();
    updateTimer();
    buildGrid();
  }

  function openWindow() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    if (!cells.length) newGame();
  }

  function closeWindow() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    if (panel.hidden) { openWindow(); } else { closeWindow(); }
  });
  closeBtn.addEventListener('click', closeWindow);
  faceBtn.addEventListener('click', newGame);

  var titleBar = panel.querySelector('.title-bar');
  var drag = null;

  function clamp(value, max) {
    return Math.min(Math.max(value, 0), Math.max(max, 0));
  }

  if (titleBar) {
    titleBar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('#minesweeperCloseBtn')) return;
      var rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      drag = { startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
      titleBar.setPointerCapture(e.pointerId);
    });

    titleBar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var left = drag.startLeft + (e.clientX - drag.startX);
      var top = drag.startTop + (e.clientY - drag.startY);
      panel.style.left = clamp(left, window.innerWidth - panel.offsetWidth) + 'px';
      panel.style.top = clamp(top, window.innerHeight - panel.offsetHeight) + 'px';
    });

    ['pointerup', 'pointercancel'].forEach(function (evt) {
      titleBar.addEventListener(evt, function () { drag = null; });
    });
  }
})();

(function () {
  var form = document.getElementById('rsvpForm');
  var status = document.getElementById('rsvpStatus');
  var submitBtn = document.getElementById('rsvpSubmit');
  if (!form || !status || !submitBtn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'rsvp-status';
    status.textContent = status.dataset.sending;
    submitBtn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        status.className = 'rsvp-status success';
        status.textContent = status.dataset.success;
        form.reset();
      } else {
        status.className = 'rsvp-status error';
        status.textContent = status.dataset.error;
      }
    }).catch(function () {
      status.className = 'rsvp-status error';
      status.textContent = status.dataset.error;
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });
})();
