// ==UserScript==
// @name             Stork Client v9.3
// @namespace        stork-client-v93
// @version          9.3.0
// @description      Krunker.io - Aimbot, ESP | INSERT
// @author           Stork
// @match            *://krunker.io/*
// @match            *://browserfps.com/*
// @match            *://*.browserfps.com/*
// @exclude          *://krunker.io/social*
// @exclude          *://krunker.io/editor*
// @exclude          *://krunker.io/viewer*
// @grant            unsafeWindow
// @run-at           document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;

  var pw = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;

  var S = {
    espEnabled: false, espBox: true,
    espHeadDot: true, espHealth: true, espNames: true,
    espTeamFilter: true, espShowBots: true, espDistanceLimit: 0,
    espColorEnemy: '#ff2d2d', espColorBot: '#ffb700', espColorTeam: '#44ff88',
    espColorAimtgt: '#ffffff', espColorBox: '#ff2d2d',

    aimbotEnabled: false, aimbotButton: 'right', aimbotBone: 'head', aimbotPriority: 'fov',
    aimbotPredict: false, aimbotFov: 25, aimbotSmooth: 1,
    aimbotAutoScope: false, aimbotTeam: true, aimbotBots: true, aimbotVisCheck: false,
    aimbotHitScale: 1.0, fovCircle: false,

    noRecoil: false, noSpread: false, autoReload: false, noReload: false,
    shootWalls: false, fastReload: false, noSwitchDelay: false,

    spinbot: false, spinbotSpeed: 0.6, thirdPerson: false, thirdPersonDist: 8,
    wireframeMode: false, fakeAdmin: true, bhop: false, autoStrafe: false, fastFall: false,

    killSound: false, antiAFK: false, longNeck: false, longNeckHeight: 2.0,
    quickSwitch: false, showKillCounter: false, hitMarker: false,

    streamMode: false,
    fakeLag: false, fakeLagMs: 100
  };

  var menuOpen = false, menuEl = null, pillBtn = null;

  function getSafeContainer() { return document.body || document.documentElement; }

  function injectStyles() {
    if (document.getElementById('stork-styles')) return;
    var css = document.createElement('style');
    css.id = 'stork-styles';
    css.textContent =
      ':root{--sk-red:#ff2d2d;--sk-red-d:#b80000;--sk-red-l:#ff6b6b;--sk-bg:#0a0a0a;--sk-bg2:#141414;--sk-brd:rgba(255,45,45,0.35);--sk-txt:#f0f0f0;--sk-txt-d:#9a9a9a;}' +
      '#stork-menu{position:fixed;top:55px;left:18px;width:680px;height:460px;background:var(--sk-bg);' +
      'border:1px solid var(--sk-brd);border-radius:12px;font-family:"Inter","Segoe UI",Roboto,-apple-system,BlinkMacSystemFont,sans-serif;' +
      'font-size:13px;line-height:1.4;color:var(--sk-txt);z-index:2147483647;user-select:none;' +
      'box-shadow:0 12px 50px rgba(255,45,45,.28),0 0 0 1px rgba(255,255,255,.02) inset;' +
      'display:none;flex-direction:column;overflow:hidden;' +
      '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;letter-spacing:0.15px;}' +
      '#stork-menu.show{display:flex;}' +
      '#stork-hdr{background:linear-gradient(90deg,#1a0000,#2a0505 40%,#1a0000);border-bottom:1px solid var(--sk-brd);' +
      'padding:10px 16px;display:flex;justify-content:space-between;align-items:center;cursor:move;flex-shrink:0;}' +
      '#stork-hdr .sk-brand{display:flex;align-items:center;gap:9px;}' +
      '#stork-hdr .sk-logo{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,var(--sk-red),var(--sk-red-d));' +
      'display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:15px;' +
      'box-shadow:0 0 12px rgba(255,45,45,.6);}' +
      '#stork-hdr .sk-title{font-weight:800;font-size:15.5px;letter-spacing:.6px;color:#fff;}' +
      '#stork-hdr .sk-ver{font-size:9.5px;background:var(--sk-red);color:#fff;padding:1px 6px;border-radius:3px;' +
      'font-weight:700;letter-spacing:.5px;margin-left:4px;vertical-align:middle;}' +
      '#stork-hdr .sk-hbtns{display:flex;gap:6px;}' +
      '#stork-hdr .sk-hbtn{width:22px;height:22px;border-radius:5px;background:rgba(255,45,45,.1);border:1px solid rgba(255,45,45,.25);' +
      'color:var(--sk-red-l);cursor:pointer;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;' +
      'transition:all .15s;font-family:inherit;}' +
      '#stork-hdr .sk-hbtn:hover{background:rgba(255,45,45,.25);color:#fff;}' +
      '#stork-main{display:flex;flex:1;overflow:hidden;}' +
      '#stork-tabs{width:150px;background:var(--sk-bg2);border-right:1px solid rgba(255,45,45,.15);' +
      'padding:8px 0;overflow-y:auto;flex-shrink:0;scrollbar-width:thin;scrollbar-color:rgba(255,45,45,.4) transparent;}' +
      '#stork-tabs::-webkit-scrollbar{width:4px;}' +
      '#stork-tabs::-webkit-scrollbar-thumb{background:rgba(255,45,45,.35);border-radius:2px;}' +
      '.sk-tab{padding:10px 14px;font-size:12px;font-weight:600;cursor:pointer;color:var(--sk-txt-d);' +
      'transition:all .15s;display:flex;align-items:center;gap:9px;border-left:3px solid transparent;' +
      'white-space:nowrap;letter-spacing:0.2px;}' +
      '.sk-tab:hover{color:var(--sk-txt);background:rgba(255,45,45,.06);}' +
      '.sk-tab.on{color:#fff;background:rgba(255,45,45,.12);border-left-color:var(--sk-red);}' +
      '.sk-tab .sk-ico{font-size:15px;width:18px;text-align:center;}' +
      '#stork-body{flex:1;overflow-y:auto;padding:12px 16px;scrollbar-width:thin;scrollbar-color:rgba(255,45,45,.4) transparent;}' +
      '#stork-body::-webkit-scrollbar{width:6px;}' +
      '#stork-body::-webkit-scrollbar-thumb{background:rgba(255,45,45,.35);border-radius:3px;}' +
      '.sk-page{display:none;}' +
      '.sk-page.on{display:block;}' +
      '.sk-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;}' +
      '.sk-sec{font-size:10.5px;font-weight:800;color:var(--sk-red-l);text-transform:uppercase;' +
      'letter-spacing:1.6px;margin:14px 0 7px;padding-bottom:5px;border-bottom:1px solid rgba(255,45,45,.2);' +
      'grid-column:1/-1;display:flex;align-items:center;gap:6px;}' +
      '.sk-sec::before{content:"";width:3px;height:11px;background:var(--sk-red);border-radius:2px;}' +
      '.sk-sec:first-child{margin-top:0;}' +
      '.sk-row{display:flex;justify-content:space-between;align-items:center;padding:7px 6px;border-radius:4px;transition:background .12s;}' +
      '.sk-row:hover{background:rgba(255,45,45,.06);}' +
      '.sk-lbl{font-size:12.5px;color:var(--sk-txt);font-weight:500;letter-spacing:0.15px;}' +
      '.sk-tog{width:36px;height:18px;border-radius:9px;background:#2a2a2a;position:relative;cursor:pointer;' +
      'transition:background .2s;border:1px solid #3a3a3a;flex-shrink:0;}' +
      '.sk-tog.on{background:linear-gradient(90deg,var(--sk-red-d),var(--sk-red));border-color:var(--sk-red);' +
      'box-shadow:0 0 8px rgba(255,45,45,.5);}' +
      '.sk-tog::after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:#ddd;' +
      'top:2px;left:2px;transition:left .2s;}' +
      '.sk-tog.on::after{left:20px;background:#fff;}' +
      '.sk-sw{display:flex;align-items:center;gap:6px;}' +
      '.sk-sl{-webkit-appearance:none;width:90px;height:3px;border-radius:2px;background:#333;outline:none;cursor:pointer;}' +
      '.sk-sl::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;' +
      'background:var(--sk-red);cursor:pointer;box-shadow:0 0 6px rgba(255,45,45,.7);}' +
      '.sk-val{min-width:32px;text-align:right;font-size:11.5px;color:var(--sk-red-l);' +
      'font-variant-numeric:tabular-nums;font-weight:600;}' +
      '.sk-sel{background:#000;border:1px solid #3a3a3a;color:var(--sk-txt);border-radius:4px;padding:4px 7px;' +
      'font-size:11.5px;cursor:pointer;outline:none;font-family:inherit;font-weight:500;}' +
      '.sk-sel:focus{border-color:var(--sk-red);}' +
      '.sk-clr{width:28px;height:20px;border:1px solid #3a3a3a;border-radius:4px;cursor:pointer;padding:0;background:none;}' +
      '#stork-pill{position:fixed;top:10px;left:10px;background:linear-gradient(135deg,var(--sk-red),var(--sk-red-d));' +
      'color:#fff;font-weight:800;font-size:11.5px;padding:6px 14px;border-radius:6px;cursor:pointer;' +
      'z-index:2147483647;box-shadow:0 2px 15px rgba(255,45,45,.6);border:1px solid rgba(255,255,255,.15);' +
      'font-family:"Inter","Segoe UI",sans-serif;user-select:none;display:flex;align-items:center;gap:7px;letter-spacing:.6px;' +
      'transition:transform .15s;}' +
      '#stork-pill:hover{transform:scale(1.05);}';
    (document.head || document.documentElement).appendChild(css);
  }

  function createMenuDOM() {
    var c = getSafeContainer();
    if (!c) return;
    if (menuEl) { if (!menuEl.parentNode) c.appendChild(menuEl); return; }
    injectStyles();

    menuEl = document.createElement('div');
    menuEl.id = 'stork-menu';

    var hdr = document.createElement('div');
    hdr.id = 'stork-hdr';
    hdr.innerHTML =
      '<div class="sk-brand">' +
      '<div class="sk-logo">S</div>' +
      '<div><span class="sk-title">STORK</span><span class="sk-ver">v9.3</span></div>' +
      '</div>' +
      '<div class="sk-hbtns">' +
      '<button class="sk-hbtn" id="stork-min-btn" title="Küçült">_</button>' +
      '<button class="sk-hbtn" id="stork-close-btn" title="Kapat">×</button>' +
      '</div>';
    menuEl.appendChild(hdr);

    var main = document.createElement('div');
    main.id = 'stork-main';

    var tabsEl = document.createElement('div');
    tabsEl.id = 'stork-tabs';
    var bodyEl = document.createElement('div');
    bodyEl.id = 'stork-body';

    var tabs = [
      { n: 'ESP', icon: '👁', fn: buildESP },
      { n: 'AIMBOT', icon: '🎯', fn: buildAim },
      { n: 'SİLAH', icon: '🔫', fn: buildWeapon },
      { n: 'MODLAR', icon: '⚙', fn: buildMods },
      { n: 'HAREKET', icon: '🏃', fn: buildMove }
    ];

    tabs.forEach(function (t, i) {
      var btn = document.createElement('div');
      btn.className = 'sk-tab' + (i === 0 ? ' on' : '');
      btn.innerHTML = '<span class="sk-ico">' + t.icon + '</span><span>' + t.n + '</span>';

      var page = document.createElement('div');
      page.className = 'sk-page' + (i === 0 ? ' on' : '');
      t.fn(page);

      btn.addEventListener('click', function () {
        tabsEl.querySelectorAll('.sk-tab').forEach(function (x) { x.classList.remove('on'); });
        bodyEl.querySelectorAll('.sk-page').forEach(function (x) { x.classList.remove('on'); });
        btn.classList.add('on');
        page.classList.add('on');
      });

      tabsEl.appendChild(btn);
      bodyEl.appendChild(page);
    });

    main.appendChild(tabsEl);
    main.appendChild(bodyEl);
    menuEl.appendChild(main);

    c.appendChild(menuEl);
    makeDraggable(menuEl, hdr);

    setTimeout(function () {
      var cb = document.getElementById('stork-close-btn');
      if (cb) cb.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
      var mb = document.getElementById('stork-min-btn');
      if (mb) mb.addEventListener('click', function (e) {
        e.stopPropagation();
        var min = menuEl.style.height === '52px';
        menuEl.style.height = min ? '460px' : '52px';
        mb.textContent = min ? '_' : '□';
      });
    }, 50);
  }

  function createPill() {
    var c = getSafeContainer();
    if (!c || pillBtn) { if (pillBtn && !pillBtn.parentNode) c && c.appendChild(pillBtn); return; }
    pillBtn = document.createElement('div');
    pillBtn.id = 'stork-pill';
    pillBtn.innerHTML = '<span style="font-size:14px">🦅</span>STORK [INS]';
    pillBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleMenu(); });
    c.appendChild(pillBtn);
  }

  function toggleMenu() {
    if (!menuEl || !menuEl.parentNode) createMenuDOM();
    if (!menuEl) return;
    menuOpen = !menuOpen;
    if (menuOpen) {
      menuEl.classList.add('show');
      try {
        if (document.exitPointerLock) document.exitPointerLock();
        if (pw.document && pw.document.exitPointerLock) pw.document.exitPointerLock();
      } catch (e) {}
      if (!pw.__storkPLBlocked) {
        pw.__storkPLBlocked = true;
        var origPL = Element.prototype.requestPointerLock;
        Element.prototype.requestPointerLock = function () {
          if (menuOpen) return;
          return origPL.apply(this, arguments);
        };
      }
    } else {
      menuEl.classList.remove('show');
    }
  }
  pw.__storkToggleMenu = toggleMenu;
  window.__storkToggleMenu = toggleMenu;

  function buildESP(p) {
    var g = document.createElement('div'); g.className = 'sk-grid';
    g.appendChild(sec('GÖRÜNÜRLÜK'));
    g.appendChild(tog('ESP Aktif', 'espEnabled'));
    g.appendChild(tog('Kutu', 'espBox'));
    g.appendChild(tog('Kafa Noktası', 'espHeadDot'));
    g.appendChild(tog('Can Barı', 'espHealth'));
    g.appendChild(tog('İsim & Mesafe', 'espNames'));
    g.appendChild(sec('FİLTRE'));
    g.appendChild(tog('Takım Gizle', 'espTeamFilter'));
    g.appendChild(tog('Botları Göster', 'espShowBots'));
    g.appendChild(sld('Mesafe Limiti', 'espDistanceLimit', 0, 300, 10));
    g.appendChild(sec('RENKLER'));
    g.appendChild(clr('Düşman', 'espColorEnemy'));
    g.appendChild(clr('Kutu', 'espColorBox'));
    g.appendChild(clr('Bot', 'espColorBot'));
    g.appendChild(clr('Takım', 'espColorTeam'));
    g.appendChild(clr('Aim Hedef', 'espColorAimtgt'));
    p.appendChild(g);
  }

  function buildAim(p) {
    var g = document.createElement('div'); g.className = 'sk-grid';
    g.appendChild(sec('AIMBOT'));
    g.appendChild(tog('Aimbot Aktif', 'aimbotEnabled'));
    g.appendChild(sel('Tuş', 'aimbotButton', ['right', 'left', 'always']));
    g.appendChild(sel('Bölge', 'aimbotBone', ['head', 'neck', 'chest']));
    g.appendChild(sel('Öncelik', 'aimbotPriority', ['fov', 'dist', 'hp']));
    g.appendChild(sld('FOV', 'aimbotFov', 5, 90, 1));
    g.appendChild(sld('Yumuşatma', 'aimbotSmooth', 1, 15, 1));
    g.appendChild(sld('Hitbox Ölçek', 'aimbotHitScale', 0.5, 2.0, 0.1));
    g.appendChild(tog('Hız Tahmini', 'aimbotPredict'));
    g.appendChild(tog('Görüş Kontrolü', 'aimbotVisCheck'));
    g.appendChild(tog('FOV Çemberi', 'fovCircle'));
    g.appendChild(sec('OTOMASYON'));
    g.appendChild(tog('Auto-Scope', 'aimbotAutoScope'));
    g.appendChild(tog('Takım Pas Geç', 'aimbotTeam'));
    g.appendChild(tog('Botları Hedefle', 'aimbotBots'));
    p.appendChild(g);
  }

  function buildWeapon(p) {
    var g = document.createElement('div'); g.className = 'sk-grid';
    g.appendChild(sec('SİLAH'));
    g.appendChild(tog('No-Recoil', 'noRecoil'));
    g.appendChild(tog('No-Spread', 'noSpread'));
    g.appendChild(tog('Auto-Reload', 'autoReload'));
    g.appendChild(tog('No Reload', 'noReload'));
    g.appendChild(tog('Fast Reload', 'fastReload'));
    g.appendChild(tog('No Switch Delay', 'noSwitchDelay'));
    g.appendChild(sec('MERMİ'));
    g.appendChild(tog('Shoot Through Walls', 'shootWalls'));
    p.appendChild(g);
  }

  function buildMods(p) {
    var g = document.createElement('div'); g.className = 'sk-grid';
    g.appendChild(sec('SPINBOT'));
    g.appendChild(tog('Spinbot', 'spinbot'));
    g.appendChild(sld('Dönüş Hızı', 'spinbotSpeed', 0.2, 2.0, 0.1));
    g.appendChild(sec('ADMIN'));
    g.appendChild(tog('Fake Admin Rozeti', 'fakeAdmin'));
    g.appendChild(sec('KAMERA'));
    g.appendChild(tog('Third Person', 'thirdPerson'));
    g.appendChild(sld('Kamera Mesafesi', 'thirdPersonDist', 4, 20, 1));
    g.appendChild(tog('Long Neck', 'longNeck'));
    g.appendChild(sld('Long Neck Yüksekliği', 'longNeckHeight', 0.5, 6.0, 0.1));
    g.appendChild(tog('Wireframe', 'wireframeMode', function (v) {
      if (esp && esp.game && esp.game.scene) {
        esp.game.scene.traverse(function (obj) {
          if (obj.material && !obj.isSkinnedMesh) obj.material.wireframe = v;
        });
      }
    }));
    g.appendChild(sec('SİLAH HİLE'));
    g.appendChild(tog('Quick Switch', 'quickSwitch'));
    g.appendChild(sec('NETWORK'));
    g.appendChild(tog('Fake Lag', 'fakeLag'));
    g.appendChild(sld('Gecikme (ms)', 'fakeLagMs', 50, 500, 10));
    g.appendChild(sec('STREAM'));
    g.appendChild(tog('Stream Mode', 'streamMode', function (v) { applyStreamMode(v); }));
    g.appendChild(sec('HUD'));
    g.appendChild(tog('Hit Marker', 'hitMarker'));
    g.appendChild(tog('Kill Counter', 'showKillCounter'));
    g.appendChild(tog('Kill Sound', 'killSound'));
    p.appendChild(g);
  }

  function buildMove(p) {
    var g = document.createElement('div'); g.className = 'sk-grid';
    g.appendChild(sec('HAREKET'));
    g.appendChild(tog('Otomatik Bhop', 'bhop'));
    g.appendChild(tog('Auto Strafe', 'autoStrafe'));
    g.appendChild(tog('Fast Fall', 'fastFall'));
    g.appendChild(sec('AFK'));
    g.appendChild(tog('Anti-AFK', 'antiAFK'));
    p.appendChild(g);
  }

  var featureCleanup = {
    bhop: function () {
      if (esp && esp.controls) {
        if (esp.controls.keys) { esp.controls.keys[32] = 0; esp.controls.keys[16] = 0; }
        esp.controls.jump = false; esp.controls.crouch = false; esp.controls.jumpQueued = false;
      }
    },
    spinbot: function () { if (esp) esp.spinYaw = 0; },
    thirdPerson: function () { if (esp) esp.tpCamOverride = false; },
    noRecoil: function () { if (esp) { esp._prevPitch = null; esp._prevYaw = null; } }
  };

  function sec(t) { var d = document.createElement('div'); d.className = 'sk-sec'; d.textContent = t; return d; }

  function tog(label, key, onChange) {
    var r = document.createElement('div'); r.className = 'sk-row';
    var l = document.createElement('div'); l.className = 'sk-lbl'; l.textContent = label;
    var b = document.createElement('div');
    b.className = 'sk-tog' + (S[key] ? ' on' : '');
    b.setAttribute('data-key', key);
    b.addEventListener('click', function () {
      S[key] = !S[key];
      b.classList.toggle('on', S[key]);
      if (!S[key] && featureCleanup[key]) { try { featureCleanup[key](); } catch (e) {} }
      if (onChange) onChange(S[key]);
    });
    r.appendChild(l); r.appendChild(b); return r;
  }

  function sld(label, key, min, max, step, onChange) {
    var r = document.createElement('div'); r.className = 'sk-row';
    var l = document.createElement('div'); l.className = 'sk-lbl'; l.textContent = label;
    var w = document.createElement('div'); w.className = 'sk-sw';
    var s = document.createElement('input'); s.type = 'range'; s.className = 'sk-sl';
    s.min = min; s.max = max; s.step = step; s.value = S[key];
    var v = document.createElement('div'); v.className = 'sk-val';
    v.textContent = step < 1 ? Number(S[key]).toFixed(2) : S[key];
    s.addEventListener('input', function () {
      var val = parseFloat(s.value); S[key] = val;
      v.textContent = step < 1 ? val.toFixed(2) : val;
      if (onChange) onChange(val);
    });
    w.appendChild(s); w.appendChild(v); r.appendChild(l); r.appendChild(w); return r;
  }

  function sel(label, key, opts) {
    var r = document.createElement('div'); r.className = 'sk-row';
    var l = document.createElement('div'); l.className = 'sk-lbl'; l.textContent = label;
    var s = document.createElement('select'); s.className = 'sk-sel';
    opts.forEach(function (o) {
      var opt = document.createElement('option'); opt.value = o; opt.textContent = o;
      if (S[key] === o) opt.selected = true; s.appendChild(opt);
    });
    s.addEventListener('change', function () { S[key] = s.value; });
    r.appendChild(l); r.appendChild(s); return r;
  }

  function clr(label, key) {
    var r = document.createElement('div'); r.className = 'sk-row';
    var l = document.createElement('div'); l.className = 'sk-lbl'; l.textContent = label;
    var c = document.createElement('input'); c.type = 'color'; c.className = 'sk-clr'; c.value = S[key];
    c.addEventListener('input', function () { S[key] = c.value; });
    r.appendChild(l); r.appendChild(c); return r;
  }

  function makeDraggable(box, handle) {
    var ox = 0, oy = 0;
    handle.addEventListener('mousedown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      ox = e.clientX - box.getBoundingClientRect().left;
      oy = e.clientY - box.getBoundingClientRect().top;
      function onMove(me) {
        box.style.left = (me.clientX - ox) + 'px';
        box.style.top = (me.clientY - oy) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function setupKeys() {
    function isToggleKey(e) {
      return e.code === 'Insert' || e.key === 'Insert' || e.keyCode === 45 ||
             e.code === 'F1' || e.key === 'F1' || e.keyCode === 112;
    }
    function handler(e) {
      if (isToggleKey(e) && e.type === 'keydown') {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        toggleMenu();
      }
    }
    var targets = [window, document, document.documentElement, pw];
    if (pw.document) targets.push(pw.document);
    targets.forEach(function (t) {
      if (!t || !t.addEventListener) return;
      try { t.addEventListener('keydown', handler, true); } catch (e) {}
    });
    setInterval(function () {
      document.querySelectorAll('canvas').forEach(function (cv) {
        if (!cv.__storkKey) { cv.__storkKey = true; try { cv.addEventListener('keydown', handler, true); } catch (e) {} }
      });
    }, 1000);
  }
  setupKeys();

  setInterval(function () {
    var c = getSafeContainer();
    if (!c) return;
    if (!menuEl || !menuEl.parentNode) createMenuDOM();
    if (!pillBtn || !pillBtn.parentNode) createPill();
  }, 600);

  function updateAdminBadge() {
    if (!S.fakeAdmin) {
      document.querySelectorAll('.stork-admin').forEach(function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      return;
    }
    if (!document.getElementById('stork-admin-css')) {
      var st = document.createElement('style'); st.id = 'stork-admin-css';
      st.textContent =
        '@keyframes storkAdminGlow{0%,100%{box-shadow:0 0 4px #ff2d2d,0 0 8px #ff2d2d}50%{box-shadow:0 0 12px #ff5c5c,0 0 20px #ff2d2d}}' +
        '.stork-admin{color:#ff2d2d;font-weight:900;font-size:11px;margin-left:5px;background:rgba(180,0,0,.22);' +
        'padding:1px 6px;border-radius:4px;border:1px solid #ff2d2d;letter-spacing:1px;display:inline-block;' +
        'vertical-align:middle;animation:storkAdminGlow 1.8s ease-in-out infinite;}';
      (document.head || document.documentElement).appendChild(st);
    }
    var lobbyIds = ['menuAccountUsername', 'signedInHeaderBar', 'menuUsernameHolder', 'clientAccountPill'];
    lobbyIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.querySelector('.stork-admin')) {
        var b = document.createElement('span'); b.className = 'stork-admin'; b.textContent = 'ADMIN';
        el.appendChild(b);
      }
    });
    var inGameIds = ['playerName', 'playerNameSpan', 'gamePlayerName', 'hudPlayerName'];
    inGameIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.querySelector('.stork-admin')) {
        var b = document.createElement('span'); b.className = 'stork-admin'; b.textContent = 'ADMIN';
        el.appendChild(b);
      }
    });
    var scoreCells = document.querySelectorAll('.ownRow td:first-child, .yourRow td:first-child, [data-isyou] .playerName');
    scoreCells.forEach(function (el) {
      if (el && !el.querySelector('.stork-admin')) {
        var b = document.createElement('span'); b.className = 'stork-admin'; b.textContent = 'ADMIN';
        el.appendChild(b);
      }
    });
  }
  setInterval(updateAdminBadge, 1000);

  function applyStreamMode(v) {
    if (pillBtn) pillBtn.style.visibility = v ? 'hidden' : 'visible';
    if (v && menuOpen) toggleMenu();
  }

  var fromPage = function (o) { return (o && o.wrappedJSObject != null ? o.wrappedJSObject : o); };
  var toPageFn = function (fn) { return (typeof exportFunction === 'function') ? exportFunction(fn, pw) : fn; };

  function CheatEngine() {
    this.game = null; this.me = null; this.renderer = null; this.controls = null; this.ctx = null;
    this.three = null; this.tempVec = null; this.hooked = false;
    this.frames = 0; this.fpsCount = 0; this.fpsTimer = performance.now(); this.aimTarget = null;
    this.rMouseDown = false; this.lMouseDown = false; this.skelCache = new WeakMap(); this.spinYaw = 0;

    this.tpCamOverride = false;
    this._origCamSet = null;
    this._origCamCopy = null;

    this._prevPitch = null;
    this._prevYaw = null;
    this._recoilDeltaPitch = 0;
    this._recoilDeltaYaw = 0;

    var self = this;
    var dn = function (e) { if (e.button === 2) self.rMouseDown = true; if (e.button === 0) self.lMouseDown = true; };
    var up = function (e) { if (e.button === 2) self.rMouseDown = false; if (e.button === 0) self.lMouseDown = false; };
    window.addEventListener('mousedown', dn, true); window.addEventListener('mouseup', up, true);
    if (pw && pw !== window) { pw.addEventListener('mousedown', dn, true); pw.addEventListener('mouseup', up, true); }
  }

  CheatEngine.prototype.run = function (name, fn) {
    try { return fn(); } catch (e) {
      if (!this._ec) this._ec = {};
      this._ec[name] = (this._ec[name] || 0) + 1;
      if (this._ec[name] <= 2) console.warn('[STORK] ' + name, e);
    }
  };

  CheatEngine.prototype.isTeam = function (ent) {
    return !!(this.me && this.me.team != null && this.me.team === ent.team);
  };

  CheatEngine.prototype.isAlive = function () {
    var m = this.me;
    if (!m || !m.active) return false;
    if (this.game && this.game.roundOver) return false;
    if (Number.isFinite(m.health) && m.health <= 0) return false;
    return true;
  };

  CheatEngine.prototype.initHooks = function () {
    if (this.hooked) return;
    var doc = pw.document || document;
    var cvs = doc.getElementById('game-overlay');
    var ctx = fromPage(cvs && cvs.getContext('2d'));
    if (!ctx || typeof ctx.clearRect !== 'function') throw new Error('game-overlay yok');
    var origFn = ctx.clearRect;
    var self = this;
    var observeFn = toPageFn(function (args) {
      self.run('capture', function () { self.onFrame(fromPage(args)); });
    });
    var bridgeFn = pw.Function('nativeFn', 'obs',
      'var d={clears:0};' +
      'function storkClearRect(){' +
      '  var r=Reflect.apply(nativeFn,this,arguments);d.clears++;' +
      '  try{var c=storkClearRect.caller;obs(c&&c.arguments);}catch(e){}' +
      '  return r;' +
      '}storkClearRect.d=d;return storkClearRect;'
    );
    var bridge = bridgeFn(origFn, observeFn);
    Object.defineProperty(ctx, 'clearRect', { value: bridge, writable: true, configurable: true, enumerable: false });
    this.ctx = ctx; this.hooked = true;
  };

  CheatEngine.prototype.installCameraHook = function () {
    var cam = this.renderer && this.renderer.camera;
    if (!cam || !cam.position) return;
    if (cam.__storkCamHooked) return;
    cam.__storkCamHooked = true;
    var self = this;
    var pos = cam.position;

    if (pos.set && !pos.__storkSetOrig) {
      pos.__storkSetOrig = pos.set;
      pos.set = function (x, y, z) {
        if (self.tpCamOverride && S.thirdPerson && z !== undefined && z !== null) {
          var dist = S.thirdPersonDist || 8;
          var nz = (Math.abs(z) < 0.01) ? dist : (z + dist);
          return pos.__storkSetOrig.call(this, x, y, nz);
        }
        return pos.__storkSetOrig.apply(this, arguments);
      };
    }
    if (pos.copy && !pos.__storkCopyOrig) {
      pos.__storkCopyOrig = pos.copy;
      pos.copy = function (v) {
        if (self.tpCamOverride && S.thirdPerson && v && typeof v.z === 'number') {
          var dist = S.thirdPersonDist || 8;
          var nz = (Math.abs(v.z) < 0.01) ? dist : (v.z + dist);
          return pos.__storkCopyOrig.call(this, { x: v.x, y: v.y, z: nz });
        }
        return pos.__storkCopyOrig.apply(this, arguments);
      };
    }
  };

  CheatEngine.prototype.onFrame = function (args) {
    if (!args) return;
    var g = args[1];
    if (!Number.isFinite(args[0]) || !g || !g.players || !Array.isArray(g.players.list)) return;
    this.game = fromPage(g);
    this.controls = fromPage(args[2]);
    this.renderer = fromPage(args[3]);
    var directMe = fromPage(args[4]);
    if (directMe) this.me = directMe;
    else {
      var found = null; var list = this.game.players.list;
      for (var i = 0; i < list.length; i++) {
        var p = fromPage(list[i]);
        if (p && p.isYou && !p.isBot) { found = p; break; }
      }
      this.me = found;
    }
    this.frames++; this.fpsCount++;
    if (!this.three) {
      var T = fromPage(this.game.THREE || (this.renderer && this.renderer.THREE) || pw.THREE);
      if (!T || typeof T.Vector3 !== 'function') return;
      this.three = T; this.tempVec = new T.Vector3();
    }
    if (this.renderer) this.installCameraHook();
    if (!this.me) return;
    var self = this;
    queueMicrotask(function () { self.run('tick', function () { self.tick(); }); });
  };

  CheatEngine.prototype.tick = function () {
    if (!this.isAlive()) return;
    var cam = this.renderer && this.renderer.camera;
    if (!this.three || !cam || !this.me) return;
    if (S.noRecoil) this.doNoRecoil();
    if (S.noSpread) this.doNoSpread();
    if (S.autoReload) this.doAutoReload();
    if (S.noReload) this.doNoReload();
    if (S.fastReload) this.doFastReload();
    if (S.noSwitchDelay) this.doNoSwitchDelay();
    if (S.shootWalls) this.doShootWalls();
    if (S.bhop) this.doBhop();
    if (S.autoStrafe) this.doAutoStrafe();
    if (S.fastFall) this.doFastFall();
    if (S.longNeck) this.doLongNeck();
    if (S.quickSwitch) this.doQuickSwitch();
    if (S.antiAFK) this.doAntiAFK();
    if (S.fakeLag) this.doFakeLag();
    this.doThirdPerson();
    var hasAim = false;
    if (S.aimbotEnabled) hasAim = this.doAimbot();
    if (S.spinbot && !hasAim) this.doSpinbot();
    if (S.espEnabled) this.run('esp', this.drawESP.bind(this));
    if (S.showKillCounter) this.run('kc', this.drawKillCounter.bind(this));
    this.detectKills();
  };

  CheatEngine.prototype.doAimbot = function () {
    var trigger = false;
    if (S.aimbotButton === 'right') trigger = this.rMouseDown;
    else if (S.aimbotButton === 'left') trigger = this.lMouseDown;
    else if (S.aimbotButton === 'always') trigger = true;
    if (!trigger) { this.aimTarget = null; return false; }
    var me = this.me; var controls = this.controls;
    if (!controls || !this.game || !this.game.players || !Array.isArray(this.game.players.list)) return false;
    var curYaw = controls.object ? controls.object.rotation.y : 0;
    var curPitch = controls.pchObjc ? controls.pchObjc.rotation.x : 0;
    var myX = me.x || 0;
    var myEyeY = (me.y || 0) + 9.5 - (3 * (me.crouchVal || 0));
    var myZ = me.z || 0;
    var candidates = [];
    var list = this.game.players.list;
    for (var i = 0; i < list.length; i++) {
      var p = fromPage(list[i]);
      if (!p || p.isYou || p.active === false) continue;
      if (typeof p.health === 'number' && p.health <= 0) continue;
      if (S.aimbotTeam && this.isTeam(p)) continue;
      candidates.push(p);
    }
    if (S.aimbotBots && this.game.AI && this.game.AI.ais) {
      var ais = this.game.AI.ais;
      for (var j = 0; j < ais.length; j++) {
        var b = fromPage(ais[j]);
        if (b && b.health > 0) candidates.push(b);
      }
    }
    var best = null, bestScore = Infinity, bestYaw = 0, bestPitch = 0, bestAngle = 0;
    var maxFov = (S.aimbotFov || 25) * Math.PI / 180;
    var scale = S.aimbotHitScale || 1.0;
    for (var k = 0; k < candidates.length; k++) {
      var ent = candidates[k];
      if (S.aimbotVisCheck && !this.hasLineOfSight(ent)) continue;
      var ex = ent.x || 0; var ey = ent.y || 0; var ez = ent.z || 0;
      if (S.aimbotPredict) {
        var pc = 0.015;
        if (Number.isFinite(ent.xVel)) ex += ent.xVel * pc * 10;
        if (Number.isFinite(ent.zVel)) ez += ent.zVel * pc * 10;
      }
      var boneY = 9.2 * scale;
      if (S.aimbotBone === 'chest') boneY = 6.5 * scale;
      else if (S.aimbotBone === 'neck') boneY = 8.0 * scale;
      var crouchAdj = 3.0 * (ent.crouchVal || 0);
      var targetY = ey + boneY - crouchAdj;
      var dx = myX - ex; var dy = targetY - myEyeY; var dz = myZ - ez;
      var dist3D = Math.hypot(dx, dy, dz);
      if (dist3D < 0.5) continue;
      var tYaw = Math.atan2(dx, dz);
      var tPitch = Math.asin(Math.max(-1, Math.min(1, dy / dist3D)));
      var dYaw = tYaw - curYaw;
      while (dYaw > Math.PI) dYaw -= Math.PI * 2;
      while (dYaw < -Math.PI) dYaw += Math.PI * 2;
      var dPitch = tPitch - curPitch;
      var angleDiff = Math.hypot(dYaw, dPitch);
      if (angleDiff > maxFov) continue;
      var score = angleDiff;
      if (S.aimbotPriority === 'dist') score = dist3D;
      else if (S.aimbotPriority === 'hp') score = (ent.health || 100) + angleDiff * 30;
      if (score < bestScore) {
        bestScore = score; best = ent;
        bestYaw = tYaw; bestPitch = tPitch; bestAngle = angleDiff;
      }
    }
    this.aimTarget = best;
    if (!best) return false;
    var fYaw = bestYaw - curYaw;
    while (fYaw > Math.PI) fYaw -= Math.PI * 2;
    while (fYaw < -Math.PI) fYaw += Math.PI * 2;
    var fPitch = bestPitch - curPitch;
    var smooth = Math.max(1, S.aimbotSmooth || 1);
    if (controls.object) controls.object.rotation.y = curYaw + (fYaw / smooth);
    if (controls.pchObjc) controls.pchObjc.rotation.x = curPitch + (fPitch / smooth);
    if (typeof controls.ydir !== 'undefined') controls.ydir = controls.object ? controls.object.rotation.y : 0;
    if (typeof controls.xdir !== 'undefined') controls.xdir = controls.pchObjc ? controls.pchObjc.rotation.x : 0;
    if (controls.inputs && Array.isArray(controls.inputs) && controls.inputs.length > 3) {
      controls.inputs[3] = Math.round((controls.object ? controls.object.rotation.y : 0) * 1000);
      controls.inputs[2] = Math.round((controls.pchObjc ? controls.pchObjc.rotation.x : 0) * 1000);
    }
    if (S.aimbotAutoScope) {
      if (typeof controls.scope !== 'undefined') controls.scope = true;
      if (controls.keys) { controls.keys[4] = 1; controls.keys[controls.aimKey || controls.scopeKey || 67] = 1; }
    }
    return true;
  };

  CheatEngine.prototype.hasLineOfSight = function (ent) {
    try {
      var scene = this.game && this.game.scene;
      if (!scene || !this.three || !ent) return true;
      var raycaster = new this.three.Raycaster();
      var cam = this.renderer && this.renderer.camera;
      if (!cam) return true;
      var origin = cam.getWorldPosition ? cam.getWorldPosition(this.tempVec.clone()) : new this.three.Vector3();
      var target = new this.three.Vector3(ent.x || 0, (ent.y || 0) + 9.2, ent.z || 0);
      var dir = target.clone().sub(origin);
      var dist = dir.length();
      dir.normalize();
      raycaster.set(origin, dir);
      raycaster.far = dist;
      var hits = raycaster.intersectObjects(scene.children, true);
      return !hits || hits.length === 0;
    } catch (e) { return true; }
  };

  CheatEngine.prototype.doSpinbot = function () {
    var c = this.controls;
    if (!c) return;
    this.spinYaw = (this.spinYaw + (S.spinbotSpeed || 0.6)) % (Math.PI * 2);
    var sy = Math.round(this.spinYaw * 1000);
    var sp = Math.round(Math.sin(Date.now() / 80) * 500);
    if (c.inputs && Array.isArray(c.inputs) && c.inputs.length > 3) {
      c.inputs[3] = sy;
      c.inputs[2] = sp;
    }
    if (c.object) { try { c.object.rotation.y = this.spinYaw; } catch (e) {} }
    if (c.pchObjc) { try { c.pchObjc.rotation.x = Math.sin(Date.now() / 80) * 0.5; } catch (e) {} }
    if (this.me) {
      if (this.me.mesh) { try { this.me.mesh.rotation.y = this.spinYaw; } catch (e) {} }
      if (this.me.objInstances) {
        try {
          var self = this;
          Object.values(fromPage(this.me.objInstances) || {}).forEach(function (o) {
            var oo = fromPage(o);
            if (oo) { try { oo.rotation.y = self.spinYaw; } catch (e) {} }
          });
        } catch (e) {}
      }
    }
  };

  CheatEngine.prototype.doNoRecoil = function () {
    var c = this.controls;
    var me = this.me;
    if (!c) return;
    var pitchObj = c.pchObjc;
    var yawObj = c.object;
    try {
      if (pitchObj && pitchObj.rotation) {
        var curP = pitchObj.rotation.x;
        if (this._prevPitch !== null) {
          var delta = curP - this._prevPitch;
          if (Math.abs(delta) > 0.0001 && !this.aimTarget) {
            var mouseDelta = (typeof c.xdir === 'number') ? c.xdir : null;
            if (mouseDelta === null || Math.abs(delta) > Math.abs(mouseDelta) * 0.5 + 0.02) {
              pitchObj.rotation.x = this._prevPitch;
              curP = this._prevPitch;
            }
          }
        }
        this._prevPitch = pitchObj.rotation.x;
      }
      if (yawObj && yawObj.rotation) {
        var curY = yawObj.rotation.y;
        if (this._prevYaw !== null) {
          var dY = curY - this._prevYaw;
          while (dY > Math.PI) dY -= Math.PI * 2;
          while (dY < -Math.PI) dY += Math.PI * 2;
          if (Math.abs(dY) > 0.0001 && !this.aimTarget) {
            var mdx = (typeof c.ydir === 'number') ? c.ydir : null;
            if (mdx === null || Math.abs(dY) > Math.abs(mdx) * 0.5 + 0.02) {
              yawObj.rotation.y = this._prevYaw;
              curY = this._prevYaw;
            }
          }
        }
        this._prevYaw = yawObj.rotation.y;
      }
    } catch (e) {}
    try {
      c.camShakeX = 0; c.camShakeY = 0;
      c.recoilX = 0; c.recoilY = 0;
      c.recoilForce = 0; c.recoilWait = 0;
      c.recoilAnim = 0; c.recoilAnim2 = 0;
      c.aimRecoilX = 0; c.aimRecoilY = 0;
      c.xRecoil = 0; c.yRecoil = 0;
      c.recoil = 0; c.camShake = 0;
      c.recoilMod = 0; c.recoilMult = 0;
    } catch (e) {}
    if (me) {
      try {
        me.recoil = 0; me.recoilX = 0; me.recoilY = 0;
        me.camShake = 0; me.camShakeX = 0; me.camShakeY = 0;
        if (me.weapon) {
          me.weapon.recoil = 0;
          me.weapon.recoilX = 0; me.weapon.recoilY = 0;
          me.weapon.recoilForce = 0;
          me.weapon.recoilAnim = 0; me.weapon.recoilAnim2 = 0;
          me.weapon.camShake = 0; me.weapon.camShakeX = 0; me.weapon.camShakeY = 0;
          if (typeof me.weapon.kickback !== 'undefined') me.weapon.kickback = 0;
          if (typeof me.weapon.kick !== 'undefined') me.weapon.kick = 0;
          if (typeof me.weapon.recoilMult !== 'undefined') me.weapon.recoilMult = 0;
          if (typeof me.weapon.recoilMod !== 'undefined') me.weapon.recoilMod = 0;
          if (typeof me.weapon.recoilSide !== 'undefined') me.weapon.recoilSide = 0;
          if (typeof me.weapon.recoilUp !== 'undefined') me.weapon.recoilUp = 0;
        }
      } catch (e) {}
    }
  };

  CheatEngine.prototype.doNoSpread = function () {
    var c = this.controls;
    if (c && typeof c.spread !== 'undefined') c.spread = 0;
    var me = this.me;
    if (me && me.weapon) {
      if (typeof me.weapon.spread !== 'undefined') me.weapon.spread = 0;
      if (typeof me.weapon.spreadVal !== 'undefined') me.weapon.spreadVal = 0;
    }
  };

  CheatEngine.prototype.doAutoReload = function () {
    var me = this.me; var c = this.controls;
    if (!me || !c) return;
    if (typeof me.ammos !== 'undefined' && me.ammos <= 1) {
      if (typeof c.reload !== 'undefined') c.reload = true;
      if (c.keys) { c.keys[8] = 1; c.keys[c.reloadKey || 82] = 1; }
    }
  };

  CheatEngine.prototype.doFastReload = function () {
    var me = this.me;
    if (!me || !me.weapon) return;
    if (me.weapon.reloadTime) me.weapon.reloadTime = me.weapon.reloadTime * 0.1;
  };

  CheatEngine.prototype.doNoSwitchDelay = function () {
    var me = this.me; var c = this.controls;
    if (!me) return;
    if (typeof me.switchDelay !== 'undefined') me.switchDelay = 0;
    if (c && typeof c.switchDelay !== 'undefined') c.switchDelay = 0;
    if (me.weapon && typeof me.weapon.switchDelay !== 'undefined') me.weapon.switchDelay = 0;
  };

  CheatEngine.prototype.doBhop = function () {
    var c = this.controls; var me = this.me;
    if (!c || !me) return;
    var jk = c.jumpKey || 32; var ck = c.crouchKey || 16;
    if (me.onGround || Math.abs(me.yVel || 0) < 0.001) {
      if (c.keys) { c.keys[jk] = 1; c.keys[ck] = 0; }
      c.jump = true; c.crouch = false; c.jumpQueued = true; me.canJump = true;
    } else {
      if (c.keys) { c.keys[jk] = 0; c.keys[ck] = 1; }
      c.jump = false; c.crouch = true;
    }
  };

  CheatEngine.prototype.doAutoStrafe = function () {
    var c = this.controls;
    if (!c || !c.object) return;
    var t = Date.now() / 120;
    if (c.keys) { c.keys[68] = Math.sin(t) > 0 ? 1 : 0; c.keys[65] = Math.sin(t) > 0 ? 0 : 1; }
  };

  CheatEngine.prototype.doFastFall = function () {
    var me = this.me;
    if (me && me.onGround === false && typeof me.yVel !== 'undefined') me.yVel = Math.min(me.yVel, -30);
  };

  CheatEngine.prototype.doNoReload = function () {
    var me = this.me; var c = this.controls;
    if (!me || !c) return;
    if (me.weapon) {
      if (me.weapon.reloading) me.weapon.reloading = false;
      if (me.weapon.reloadTime) me.weapon.reloadTime = 0;
      if (me.weapon.reloadTimer) me.weapon.reloadTimer = 0;
      if (typeof me.weapon.ammo !== 'undefined' && me.weapon.ammo <= 0) me.weapon.ammo = me.weapon.maxAmmo || me.weapon.clipSize || 30;
    }
    if (typeof c.reload !== 'undefined') c.reload = false;
    if (typeof c.reloading !== 'undefined') c.reloading = false;
  };

  CheatEngine.prototype.doShootWalls = function () {
    var me = this.me;
    if (!me || !me.weapon) return;
    try {
      if (typeof me.weapon.pierce !== 'undefined') me.weapon.pierce = 99;
      if (typeof me.weapon.penetration !== 'undefined') me.weapon.penetration = 99;
      if (typeof me.weapon.wallPenetration !== 'undefined') me.weapon.wallPenetration = 99;
      if (typeof me.weapon.range !== 'undefined' && me.weapon.range < 9999) me.weapon.range = 9999;
    } catch (e) {}
  };

  CheatEngine.prototype.doFakeLag = function () {
    var c = this.controls;
    if (!c) return;
    if (!this.__lagTimer) this.__lagTimer = Date.now();
    if (!this.__lagBuffer) this.__lagBuffer = null;
    var now = Date.now(); var interval = S.fakeLagMs || 100;
    if (c.inputs && Array.isArray(c.inputs)) {
      if (!this.__lagBuffer) this.__lagBuffer = c.inputs.slice();
      if (now - this.__lagTimer >= interval) {
        this.__lagTimer = now;
        if (this.__lagBuffer) {
          for (var i = 0; i < Math.min(this.__lagBuffer.length, c.inputs.length); i++) c.inputs[i] = this.__lagBuffer[i];
          this.__lagBuffer = null;
        }
      } else {
        if (this.__lagBuffer) { c.inputs[0] = this.__lagBuffer[0] || 0; c.inputs[1] = this.__lagBuffer[1] || 0; }
      }
    }
  };

  CheatEngine.prototype.doLongNeck = function () {
    var me = this.me;
    if (!me) return;
    var c = this.controls;
    var extra = S.longNeckHeight || 2.0;
    if (c) {
      if (typeof c.camHeight !== 'undefined') c.camHeight = 11 + extra;
      if (typeof c.eyeHeight !== 'undefined') c.eyeHeight = 11 + extra;
    }
    if (typeof me.camHeight !== 'undefined') me.camHeight = 11 + extra;
  };

  CheatEngine.prototype.doQuickSwitch = function () {
    var me = this.me; var c = this.controls;
    if (!me || !c) return;
    if (me.weapon && me.weapon.isBolt && me.weapon.reloading) {
      if (c.keys) c.keys[49] = 1;
      setTimeout(function () {
        try { if (c.keys) { c.keys[49] = 0; c.keys[50] = 1; } } catch (e) {}
      }, 50);
    }
  };

  CheatEngine.prototype.doAntiAFK = function () {
    if (!this.__afkTimer) this.__afkTimer = Date.now();
    var now = Date.now();
    if (now - this.__afkTimer > 20000) {
      this.__afkTimer = now;
      var c = this.controls;
      if (c && c.object) {
        c.object.rotation.y += 0.001;
        setTimeout(function () { try { c.object.rotation.y -= 0.001; } catch (e) {} }, 100);
      }
    }
  };

  CheatEngine.prototype.doThirdPerson = function () {
    var me = this.me;
    if (!me) return;
    if (S.thirdPerson) {
      this.tpCamOverride = true;
      if (me.mesh) { try { me.mesh.visible = true; } catch (e) {} }
      if (me.objInstances) {
        try {
          Object.values(fromPage(me.objInstances) || {}).forEach(function (o) {
            var oo = fromPage(o); if (oo) { try { oo.visible = true; } catch (e) {} }
          });
        } catch (e) {}
      }
      var c = this.controls;
      if (c) {
        try {
          if (c.arms) c.arms.visible = true;
          if (c.headMesh) c.headMesh.visible = true;
          if (c.bodyMesh) c.bodyMesh.visible = true;
        } catch (e) {}
      }
    } else {
      if (this.tpCamOverride) this.tpCamOverride = false;
    }
  };

  CheatEngine.prototype.drawKillCounter = function () {
    if (!this.__kills) this.__kills = 0;
    var ctx = this.ctx; var cvs = ctx.canvas;
    var x = cvs.width - 120, y = 40;
    ctx.save();
    ctx.fillStyle = 'rgba(10,10,10,0.75)'; ctx.fillRect(x - 8, y - 20, 115, 30);
    ctx.strokeStyle = '#ff2d2d'; ctx.lineWidth = 1; ctx.strokeRect(x - 8, y - 20, 115, 30);
    ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left';
    ctx.fillStyle = '#ff2d2d'; ctx.fillText('Kills: ' + this.__kills, x, y);
    ctx.restore();
  };

  CheatEngine.prototype.detectKills = function () {
    if (!this.game || !this.game.players || !Array.isArray(this.game.players.list)) return;
    if (!this.__kills) this.__kills = 0;
    if (!this.__prevHP) this.__prevHP = new Map();
    var list = this.game.players.list;
    for (var i = 0; i < list.length; i++) {
      var p = fromPage(list[i]);
      if (!p || p.isYou) continue;
      var pid = p.netId || p.clientId || i;
      var curHP = typeof p.health === 'number' ? p.health : 100;
      var prevHP = this.__prevHP.get(pid);
      if (prevHP !== undefined && prevHP > 0 && curHP <= 0) {
        var wasTarget = (p === this.aimTarget);
        var me = this.me;
        var dist = me ? Math.hypot((p.x || 0) - (me.x || 0), (p.z || 0) - (me.z || 0)) : 999;
        if (wasTarget || dist < 30) {
          this.__kills++;
          if (S.killSound) this.playKillSound();
          if (S.hitMarker) this.showHitMarker();
        }
      }
      this.__prevHP.set(pid, curHP);
    }
  };

  CheatEngine.prototype.showHitMarker = function () {
    if (!this.ctx) return;
    var cvs = this.ctx.canvas; var cx = cvs.width / 2; var cy = cvs.height / 2;
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff2d2d'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 8); ctx.lineTo(cx - 3, cy - 3);
    ctx.moveTo(cx + 8, cy - 8); ctx.lineTo(cx + 3, cy - 3);
    ctx.moveTo(cx - 8, cy + 8); ctx.lineTo(cx - 3, cy + 3);
    ctx.moveTo(cx + 8, cy + 8); ctx.lineTo(cx + 3, cy + 3);
    ctx.stroke();
    ctx.restore();
    setTimeout(function () {
      try {
        ctx.save();
        ctx.clearRect(cx - 10, cy - 10, 20, 20);
        ctx.restore();
      } catch (e) {}
    }, 120);
  };

  CheatEngine.prototype.playKillSound = function () {
    try {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ac.createOscillator(); var gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.18);
    } catch (e) {}
  };

  CheatEngine.prototype.worldToScreen = function (wx, wy, wz) {
    var cam = this.renderer && this.renderer.camera;
    if (!cam || !this.three || !this.tempVec) return null;
    if (!Number.isFinite(wx) || !Number.isFinite(wy) || !Number.isFinite(wz)) return null;
    var cvs = this.ctx ? this.ctx.canvas : null;
    if (!cvs || !cvs.width || !cvs.height) return null;
    this.tempVec.set(wx, wy, wz); this.tempVec.project(cam);
    if (this.tempVec.z >= 1.0) return null;
    var sx = (this.tempVec.x * 0.5 + 0.5) * cvs.width;
    var sy = (-this.tempVec.y * 0.5 + 0.5) * cvs.height;
    return { x: sx, y: sy };
  };

  CheatEngine.prototype.drawESP = function () {
    if (!this.game || !this.ctx || !this.game.players || !Array.isArray(this.game.players.list)) return;
    this.ctx.save();
    try {
      var list = this.game.players.list;
      for (var i = 0; i < list.length; i++) {
        try {
          var p = fromPage(list[i]);
          if (!p || p.isYou || p.active === false) continue;
          if (typeof p.health === 'number' && p.health <= 0) continue;
          if (S.espTeamFilter && this.isTeam(p)) continue;
          if (S.espDistanceLimit > 0 && this.me) {
            var dx = (p.x || 0) - (this.me.x || 0); var dz = (p.z || 0) - (this.me.z || 0);
            if (Math.hypot(dx, dz) > S.espDistanceLimit) continue;
          }
          this.drawEntity(p, false);
        } catch (e) {}
      }
      if (S.espShowBots && this.game.AI && this.game.AI.ais) {
        var ais = this.game.AI.ais;
        for (var j = 0; j < ais.length; j++) {
          try {
            var bot = fromPage(ais[j]);
            if (!bot || bot.health <= 0) continue;
            this.drawEntity(bot, true);
          } catch (e) {}
        }
      }
    } finally { this.ctx.restore(); }
  };

  CheatEngine.prototype.drawEntity = function (ent, isBot) {
    var ctx = this.ctx;
    var isAim = (ent === this.aimTarget);
    var col = isAim ? S.espColorAimtgt : (isBot ? S.espColorBot : S.espColorEnemy);
    var ex = ent.x || 0; var ey = ent.y || 0; var ez = ent.z || 0;
    var crouchVal = ent.crouchVal || 0;
    var entHeight = isBot ? 5.5 : (crouchVal > 0.5 ? 7.5 : 11);
    var footSp = this.worldToScreen(ex, ey, ez);
    var headSp = this.worldToScreen(ex, ey + entHeight, ez);
    var visibleSp = footSp || headSp;
    if (!visibleSp) return;
    var cvs = ctx.canvas; var W = cvs.width, H = cvs.height;
    var bx, by, bw, bh;
    if (footSp && headSp) {
      bh = Math.abs(footSp.y - headSp.y);
      if (bh < 4) bh = 4;
      bw = Math.max(bh * 0.45, 12);
      bx = Math.min(footSp.x, headSp.x) - bw / 2;
      by = Math.min(headSp.y, footSp.y);
    } else {
      var myX2 = this.me ? (this.me.x || 0) : 0;
      var myZ2 = this.me ? (this.me.z || 0) : 0;
      var dist2 = Math.max(1, Math.hypot(ex - myX2, ez - myZ2));
      bh = Math.max(18, Math.min(H * 0.9, (W * 0.55) / dist2));
      bw = bh * 0.45;
      bx = visibleSp.x - bw / 2;
      by = footSp ? (visibleSp.y - bh) : visibleSp.y;
    }
    if (bx + bw < 0 || bx > W || by + bh < 0 || by > H) return;
    ctx.save();
    try {
      if (S.espBox) {
        ctx.strokeStyle = isAim ? S.espColorAimtgt : S.espColorBox;
        ctx.shadowColor = isAim ? S.espColorAimtgt : S.espColorBox;
        ctx.shadowBlur = isAim ? 12 : 4;
        ctx.lineWidth = isAim ? 2.5 : 1.8;
        ctx.strokeRect(bx, by, bw, bh); ctx.shadowBlur = 0;
      }
      if (S.espHeadDot && headSp) {
        var dotR = Math.max(2.5, bw * 0.07);
        ctx.fillStyle = col; ctx.shadowColor = col;
        ctx.shadowBlur = isAim ? 8 : 3;
        ctx.beginPath(); ctx.arc(headSp.x, headSp.y, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.arc(headSp.x, headSp.y, dotR + 1.5, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      if (S.espHealth) {
        var hp = ent.health; var mhp = ent.maxHealth || 100;
        if (Number.isFinite(hp) && mhp > 0) {
          var pct = Math.max(0, Math.min(1, hp / mhp));
          var barW = 4; var barX = bx - 6 - barW;
          ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(barX, by, barW, bh);
          var hcol = pct > 0.65 ? '#43a047' : (pct > 0.35 ? '#fdd835' : '#e53935');
          ctx.fillStyle = hcol; ctx.fillRect(barX, by + bh * (1 - pct), barW, bh * pct);
          ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
          ctx.fillText(Math.round(hp), barX + barW / 2, by + bh + 9);
        }
      }
      if (S.espNames) {
        var myX3 = this.me ? (this.me.x || 0) : 0;
        var myY3 = this.me ? (this.me.y || 0) : 0;
        var myZ3 = this.me ? (this.me.z || 0) : 0;
        var dist3 = Math.round(Math.hypot(ex - myX3, ey - myY3, ez - myZ3));
        var name = ent.alias || ent.name || (isBot ? 'Bot' : 'Player');
        var label = name + ' ' + dist3 + 'm';
        var tx = bx + bw / 2; var ty = by - 4;
        ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        var tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(tx - tw / 2 - 3, ty - 12, tw + 6, 14);
        ctx.fillStyle = col; ctx.fillText(label, tx, ty);
      }
    } finally { ctx.restore(); }
  };

  CheatEngine.prototype.drawFovCircle = function () {
    var cam = this.renderer && this.renderer.camera;
    if (!cam || !cam.projectionMatrix || !cam.projectionMatrix.elements) return;
    var cvs = this.ctx.canvas;
    var tan = Math.tan((S.aimbotFov || 25) * Math.PI / 180);
    var fl = Math.abs(cam.projectionMatrix.elements[5]);
    var r = (tan * fl * cvs.height) / 2;
    this.ctx.strokeStyle = 'rgba(255,45,45,0.65)'; this.ctx.lineWidth = 1.4;
    this.ctx.beginPath(); this.ctx.arc(cvs.width / 2, cvs.height / 2, r, 0, Math.PI * 2); this.ctx.stroke();
  };

  CheatEngine.prototype.boot = function () {
    var self = this;
    var maxTime = Date.now() + 30000;
    var loop = function () {
      try {
        self.initHooks();
        console.log('[STORK] Hook v9.3');
      } catch (e) {
        if (Date.now() < maxTime) setTimeout(loop, 250);
        else { console.warn('[STORK] Hook fail:', e); }
      }
    };
    loop();
  };

  var esp = new CheatEngine();
  esp.boot();
  pw.__storkESP = esp;

  console.log('[STORK] Stork Client v9.3 loaded - INSERT');

})();