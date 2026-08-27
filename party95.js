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
  var colors = ['#ff0000', '#ff8800', '#ffdd00', '#33cc33', '#3399ff', '#9933ff'];
  var hearts = ['❤️', '💛', '💚', '💙', '💜', '💕'];

  function spawnRain(useHearts) {
    var count = 70;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    for (var i = 0; i < count; i++) {
      var el = document.createElement(useHearts ? 'span' : 'div');
      el.className = useHearts ? 'confetti-heart' : 'confetti-piece';
      if (useHearts) {
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      } else {
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      }
      var drift = Math.random() * 160 - 80;
      var duration = 2.5 + Math.random() * 2.5;
      var delay = Math.random() * 1.5;
      el.style.left = (Math.random() * vw) + 'px';
      el.style.top = '-20px';
      el.style.setProperty('--dx', drift + 'px');
      el.style.setProperty('--dy', (vh + 40) + 'px');
      el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      el.style.animationDuration = duration + 's';
      el.style.animationDelay = delay + 's';
      document.body.appendChild(el);
      (function (node, removeAfter) {
        node.addEventListener('animationend', function () { node.remove(); });
        setTimeout(function () { if (node.parentNode) node.remove(); }, removeAfter);
      })(el, (duration + delay + 0.3) * 1000);
    }
  }

  var partyBtn = document.getElementById('confettiPartyBtn');
  var heartBtn = document.getElementById('confettiHeartBtn');

  if (partyBtn) {
    partyBtn.addEventListener('click', function () {
      spawnRain(false);
    });
  }
  if (heartBtn) {
    heartBtn.addEventListener('click', function () {
      spawnRain(true);
    });
  }
})();
