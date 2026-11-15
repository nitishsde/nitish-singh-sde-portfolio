/* ==========================================================
   Nitish Singh portfolio, app.js (all pages)
   Settings, theme, navbar, search, skeleton loader, data
   rendering, skills orbit, project previews, contact form
   and the portfolio chat assistant with voice.
   ========================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var body = document.body;
  var D = window.SITE_DATA || { skills: [], exp: [], edu: [], proj: [], custom: {}, site: {} };
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }

  /* ---------------- Settings ---------------- */
  var DEFAULTS = { theme: 'light', fs: 1, motion: true, orbit: true, progress: true, voice: false };
  var S = Object.assign({}, DEFAULTS, lsGet('np_settings', {}));
  function motionOK() { return S.motion !== false && !mq.matches; }

  function applySettings(save) {
    root.dataset.theme = S.theme === 'dark' ? 'dark' : 'light';
    if (S.motion === false) root.dataset.motion = 'off'; else root.removeAttribute('data-motion');
    root.dataset.orbit = S.orbit === false ? 'off' : 'on';
    root.dataset.progress = S.progress === false ? 'off' : 'on';
    root.style.setProperty('--fs', S.fs);
    var tb = $('#themeToggle');
    if (tb) tb.setAttribute('aria-label', S.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', S.theme === 'dark' ? '#08090B' : '#FFFFFF');
    $$('[data-theme-set]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-theme-set') === S.theme); });
    var fs = $('#setFs'); if (fs) { fs.value = Math.round(S.fs * 100); $('#setFsOut').textContent = Math.round(S.fs * 100) + '%'; }
    var m = $('#setMotion'); if (m) m.checked = S.motion !== false;
    var o = $('#setOrbit'); if (o) o.checked = S.orbit !== false;
    var p = $('#setProgress'); if (p) p.checked = S.progress !== false;
    var v = $('#setVoice'); if (v) v.checked = !!S.voice;
    if (save) lsSet('np_settings', S);
  }
  applySettings(false);

  var themeBtn = $('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applySettings(true); });
  $$('[data-theme-set]').forEach(function (b) { b.addEventListener('click', function () { S.theme = b.getAttribute('data-theme-set'); applySettings(true); }); });
  var fsEl = $('#setFs');
  if (fsEl) fsEl.addEventListener('input', function () { S.fs = fsEl.value / 100; applySettings(true); });
  [['#setMotion', 'motion'], ['#setOrbit', 'orbit'], ['#setProgress', 'progress'], ['#setVoice', 'voice']].forEach(function (p) {
    var el = $(p[0]); if (!el) return;
    el.addEventListener('change', function () { S[p[1]] = el.checked; applySettings(true); if (p[1] === 'voice' && !el.checked && window.speechSynthesis) speechSynthesis.cancel(); });
  });
  var resetBtn = $('#setReset');
  if (resetBtn) resetBtn.addEventListener('click', function () { S = Object.assign({}, DEFAULTS); applySettings(true); });

  /* ---------------- Skeleton loader: 1 second (home page) ---------------- */
  var loader = $('#loader');
  if (loader) {
    body.classList.add('is-loading');
    setTimeout(function () {
      loader.classList.add('done');
      body.classList.remove('is-loading');
      body.classList.add('ready');
      setTimeout(function () { loader.remove(); }, 450);
    }, 1000);
  } else {
    body.classList.add('ready');
  }

  /* ---------------- Panels: menu, dropdowns, search, settings ---------------- */
  var menuBtn = $('#menuBtn'), searchPanel = $('#search'), settingsPanel = $('#settings');
  var QUICK = $('#quickLinks') ? $('#quickLinks').innerHTML : '';
  var searchBtn = $('#searchBtn'), settingsBtn = $('#settingsBtn'), searchInput = $('#searchInput');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (!open) $$('.has-dd.open').forEach(function (li) { closeDD(li); });
  }
  function closeDD(li) { li.classList.remove('open'); var b = $('.dd-btn', li); if (b) b.setAttribute('aria-expanded', 'false'); }
  function closeDropdowns(except) { $$('.has-dd.open').forEach(function (li) { if (li !== except) closeDD(li); }); }
  function setSearch(open) {
    if (!searchPanel) return;
    searchPanel.hidden = !open; searchPanel.setAttribute('aria-hidden', String(!open));
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) { closeDropdowns(); setSettings(false); setTimeout(function () { searchInput.focus(); }, 30); } else { searchInput.value = ''; renderSearch(''); }
  }
  function setSettings(open) {
    if (!settingsPanel) return;
    settingsPanel.hidden = !open; settingsPanel.setAttribute('aria-hidden', String(!open));
    settingsBtn.setAttribute('aria-expanded', String(open));
    if (open) { closeDropdowns(); if (searchPanel && !searchPanel.hidden) setSearch(false); }
  }

  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  var scrim = $('#scrim'); if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
  $$('[data-close-menu]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  $$('[data-close-settings]').forEach(function (b) { b.addEventListener('click', function () { setSettings(false); settingsBtn.focus(); }); });
  if (searchBtn) searchBtn.addEventListener('click', function () { setSearch(searchPanel.hidden); });
  if (settingsBtn) settingsBtn.addEventListener('click', function () { setSettings(settingsPanel.hidden); });

  $$('.dd-btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = b.parentNode, open = !li.classList.contains('open');
      closeDropdowns(li);
      li.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  });
  $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); closeDropdowns(); }); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dd')) closeDropdowns();
    if (settingsPanel && !settingsPanel.hidden && !e.target.closest('#settings') && !e.target.closest('#settingsBtn')) setSettings(false);
    if (searchPanel && !searchPanel.hidden && !e.target.closest('.search-inner') && !e.target.closest('#searchBtn')) setSearch(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeDropdowns(); setMenu(false); setSettings(false); if (searchPanel && !searchPanel.hidden) setSearch(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  if (searchPanel) $$('a', searchPanel).forEach(function (a) { a.addEventListener('click', function () { setSearch(false); }); });
  document.addEventListener('keydown', function (e) {
    if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) {
      if (searchPanel) { e.preventDefault(); setSearch(true); }
    }
  });

  /* ---------------- Header, progress bar, back to top ---------------- */
  var header = $('.site-header'), progress = $('#progress'), toTop = $('#toTop'), ticking = false;
  function onScroll() {
    var y = window.scrollY || 0, max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (toTop) toTop.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: motionOK() ? 'smooth' : 'auto' }); });
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Data (published + items added in manage.html) ---------------- */
  function getCustom() {
    var c = lsGet('np_custom', {});
    return { skills: c.skills || [], exp: c.exp || [], edu: c.edu || [], proj: c.proj || [] };
  }
  function saveCustom(c) { lsSet('np_custom', c); }
  function merge(key) {
    var out = [], seen = {};
    [D[key] || [], (D.custom || {})[key] || [], getCustom()[key]].forEach(function (list) {
      list.forEach(function (it) {
        if (seen[it.id] != null) out[seen[it.id]] = it; else { seen[it.id] = out.length; out.push(it); }
      });
    });
    return out;
  }
  var CATS = { lang: 'Languages', backend: 'Backend', frontend: 'Frontend', data: 'Data', ai: 'AI tools', tool: 'Platforms and tools' };

  function logoBox(it, fallbackText) {
    var letter = esc((fallbackText || it.company || it.name || '?').charAt(0).toUpperCase());
    if (safeUrl(it.logo)) return '<span class="logo-box"><img src="' + esc(it.logo) + '" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=ph>' + letter + '</span>\'"></span>';
    return '<span class="logo-box"><span class="ph">' + letter + '</span></span>';
  }
  function tagsHtml(t) { return (t && t.length) ? '<ul class="tags">' + t.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; }

  function expCard(e) {
    var anchor = esc(String(e.id).replace(/^e-/, ''));
    var co = safeUrl(e.url) ? '<a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.company) + '</a>' : esc(e.company);
    var meta = [e.type, e.location].filter(Boolean).map(function (m) { return '<span class="pill plain">' + esc(m) + '</span>'; }).join('');
    return '<article class="exp-card" id="' + anchor + '">' + logoBox(e, e.company) +
      '<div><div class="exp-top"><h3>' + esc(e.role) + '</h3><span class="pill">' + esc(e.period) + '</span></div>' +
      '<p class="exp-co">' + co + '</p>' + (meta ? '<div class="exp-meta">' + meta + '</div>' : '') +
      '<p>' + esc(e.details) + '</p>' + tagsHtml(e.tags) + '</div></article>';
  }
  function eduItem(d) {
    return '<li><p class="when">' + esc(d.period || 'Completed') + '</p><div><h3>' + esc(d.title) + '</h3><p>' + esc(d.place) + (d.details ? '. ' + esc(d.details) : '') + '</p></div></li>';
  }
  function skillGroups() {
    var groups = {};
    merge('skills').forEach(function (s) { (groups[s.cat] = groups[s.cat] || []).push(s); });
    return Object.keys(CATS).filter(function (k) { return groups[k]; }).map(function (k) {
      return '<div class="skill-group"><h3>' + CATS[k] + '</h3><ul class="chip-logos">' + groups[k].map(function (s) {
        return '<li><img src="' + esc(safeUrl(s.logo) || '') + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' + esc(s.name) + '</li>';
      }).join('') + '</ul></div>';
    }).join('');
  }
  function siteCard(p, noFrame) {
    var host = ''; try { host = safeUrl(p.url) ? new URL(p.url).host : ''; } catch (e) { host = ''; }
    var frame = (host && !noFrame) ? '<iframe data-src="' + esc(p.url) + '" title="Preview of ' + esc(p.name) + '" loading="lazy" tabindex="-1" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin"></iframe>' : '';
    var actions = host
      ? '<a class="btn btn-solid btn-small" href="' + esc(p.url) + '" target="_blank" rel="noopener">Open live site</a>'
      : '<span class="url-note">Case study on request</span>';
    return '<article class="site-card" data-cat="' + esc(p.cats || '') + '"><div class="win"><div class="win-bar"><i></i><i></i><i></i><span class="win-url">' + esc(host || (p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.local')) + '</span></div>' +
      '<div class="win-view"><div class="mock"><strong>' + esc(p.name) + '</strong><span></span><span></span><span></span></div>' + frame + '</div></div>' +
      '<div class="site-body"><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' + tagsHtml(p.tags) + '<div class="site-actions">' + actions + '</div></div></article>';
  }

  function renderAll() {
    var el;
    if ((el = $('#expList'))) el.innerHTML = merge('exp').map(expCard).join('');
    if ((el = $('#eduList'))) el.innerHTML = merge('edu').map(eduItem).join('');
    if ((el = $('#skillGroups'))) el.innerHTML = skillGroups();
    if ((el = $('#featuredGrid'))) el.innerHTML = merge('proj').filter(function (p) { return p.featured; }).slice(0, 3).map(function (p) { return siteCard(p); }).join('');
    if ((el = $('#projectGrid'))) el.innerHTML = merge('proj').map(function (p) { return siteCard(p); }).join('');
    if ((el = $('#skillLegend'))) {
      var g = {}; merge('skills').forEach(function (s) { (g[s.cat] = g[s.cat] || []).push(s.name); });
      el.innerHTML = Object.keys(CATS).filter(function (k) { return g[k]; }).map(function (k) { return '<div><h3>' + CATS[k] + '</h3><p>' + esc(g[k].join(', ')) + '</p></div>'; }).join('');
    }
    buildOrbit(); previews(); initReveal(); applyHash();
  }

  /* previews: lazy load iframes and scale them to the card width */
  function previews() {
    var views = $$('.win-view');
    function fit(v) { v.style.setProperty('--s', (v.clientWidth / 1280).toFixed(4)); }
    views.forEach(fit);
    if (window.ResizeObserver) { var ro = new ResizeObserver(function (en) { en.forEach(function (x) { fit(x.target); }); }); views.forEach(function (v) { ro.observe(v); }); }
    var frames = $$('.win-view iframe[data-src]');
    function load(f) { f.addEventListener('load', function () { f.classList.add('loaded'); }); f.src = f.getAttribute('data-src'); f.removeAttribute('data-src'); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { load(x.target); io.unobserve(x.target); } }); }, { rootMargin: '200px' });
      frames.forEach(function (f) { io.observe(f); });
    } else frames.forEach(load);
  }

  /* scroll reveal for groups */
  var rv = null;
  function initReveal() {
    var els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (!rv) rv = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); rv.unobserve(x.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { rv.observe(e); });
  }
  function applyHash() {
    var h = location.hash.slice(1);
    var chip = h && $('.chip[data-filter="' + h + '"]');
    if (chip) chip.click();
    else if (h) { var t = document.getElementById(h); if (t) setTimeout(function () { t.scrollIntoView(); }, 60); }
  }

  /* project filter */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip[data-filter]'); if (!chip) return;
    var f = chip.getAttribute('data-filter');
    $$('.chip[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
    $$('#projectGrid .site-card').forEach(function (card) {
      var show = f === 'all' || card.getAttribute('data-cat').split(' ').indexOf(f) > -1;
      card.classList.toggle('is-hidden', !show); card.classList.remove('is-entering');
      if (show && motionOK()) { void card.offsetWidth; card.classList.add('is-entering'); }
    });
  });

  /* ---------------- Skills orbit ---------------- */
  var RINGS = [{ size: 50, dur: 34, rev: false }, { size: 72, dur: 54, rev: true }, { size: 94, dur: 78, rev: false }];
  function logoImg(name, url) {
    var img = document.createElement('img'); img.src = safeUrl(url) || ''; img.alt = name; img.loading = 'lazy'; img.decoding = 'async'; return img;
  }
  function buildOrbit() {
    var orbit = $('#orbit'); if (!orbit) return;
    orbit.innerHTML = '';
    var skills = merge('skills'), core = skills.filter(function (s) { return s.core; })[0] || { name: 'Java', logo: '' };
    var c = document.createElement('div'); c.className = 'core';
    var ci = logoImg(core.name, core.logo); ci.addEventListener('error', function () { ci.remove(); c.insertAdjacentHTML('afterbegin', '<b>' + esc(core.name) + '</b>'); });
    c.appendChild(ci); c.insertAdjacentHTML('beforeend', '<span>' + esc(core.name) + '</span>'); orbit.appendChild(c);
    var buckets = [[], [], []];
    skills.filter(function (s) { return !s.core; }).forEach(function (s) { buckets[(s.ring || 3) - 1].push(s); });
    RINGS.forEach(function (r, ri) {
      if (!buckets[ri].length) return;
      var ring = document.createElement('div'); ring.className = 'ring' + (r.rev ? ' rev' : '');
      ring.style.width = r.size + '%'; ring.style.height = r.size + '%'; ring.style.setProperty('--dur', r.dur + 's');
      buckets[ri].forEach(function (s, i) {
        var a = (i / buckets[ri].length) * Math.PI * 2 + ri * 0.6;
        var el = document.createElement('div'); el.className = 'item'; el.tabIndex = 0;
        el.setAttribute('data-name', s.name); el.setAttribute('role', 'img'); el.setAttribute('aria-label', s.name);
        el.style.left = (50 + 50 * Math.cos(a)) + '%'; el.style.top = (50 + 50 * Math.sin(a)) + '%';
        var img = logoImg(s.name, s.logo);
        img.addEventListener('error', function () { img.remove(); var f = document.createElement('span'); f.className = 'fallback'; f.textContent = s.name.slice(0, 2); el.appendChild(f); });
        el.appendChild(img); ring.appendChild(el);
      });
      orbit.appendChild(ring);
    });
  }

  /* star field behind the orbit */
  (function stars() {
    var cv = $('#stars'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dots = [], w = 0, h = 0, raf = 0, visible = false;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = []; for (var i = 0, n = Math.round(w * h / 9000); i < n; i++) dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + .2, p: Math.random() * 6.28, s: Math.random() * .02 + .004 });
      draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#d6e4ff';
      for (var i = 0; i < dots.length; i++) { var d = dots[i]; ctx.globalAlpha = .35 + .55 * Math.abs(Math.sin(d.p + t * d.s)); ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fill(); }
    }
    function loop(t) { draw(t / 16); if (visible && motionOK()) raf = requestAnimationFrame(loop); }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(loop); }).observe(cv);
  })();

  /* ---------------- Search ---------------- */
  function searchIndex() {
    var list = [
      { t: 'Page', title: 'Home', sub: 'Introduction and featured projects', href: 'index.html' },
      { t: 'Page', title: 'Projects', sub: 'All projects as website previews', href: 'projects.html' },
      { t: 'Page', title: 'Experience and education', sub: 'Internships, degrees, skills', href: 'experience.html' },
      { t: 'Page', title: 'Contact', sub: 'Email, phone, message form', href: 'index.html#contact' },
      { t: 'Page', title: 'Resume (PDF)', sub: 'Download the resume', href: 'assets/Nitish-Singh-Resume.pdf' },
      { t: 'Page', title: 'Ask the assistant', sub: 'Type or speak a question', href: 'index.html#assistant' }
    ];
    merge('proj').forEach(function (p) { list.push({ t: 'Project', title: p.name, sub: p.desc, href: safeUrl(p.url) || 'projects.html', ext: !!safeUrl(p.url), tags: (p.tags || []).join(' ') }); });
    merge('exp').forEach(function (e) { list.push({ t: 'Experience', title: e.role + ', ' + e.company, sub: e.period, href: 'experience.html#' + String(e.id).replace(/^e-/, ''), tags: (e.tags || []).join(' ') }); });
    merge('edu').forEach(function (d) { list.push({ t: 'Education', title: d.title, sub: d.place, href: 'experience.html#education' }); });
    merge('skills').forEach(function (s) { list.push({ t: 'Skill', title: s.name, sub: CATS[s.cat] || '', href: 'index.html#skills' }); });
    return list;
  }
  function renderSearch(q) {
    var bodyEl = $('#searchBody'); if (!bodyEl) return;
    q = q.trim().toLowerCase();
    if (!q) { bodyEl.innerHTML = '<p class="search-title">Quick links</p><ul class="quick" id="quickLinks">' + QUICK + '</ul>'; $$('a', bodyEl).forEach(function (a) { a.addEventListener('click', function () { setSearch(false); }); }); return; }
    var words = q.split(/\s+/);
    var hits = searchIndex().filter(function (x) { var h = (x.title + ' ' + x.sub + ' ' + (x.tags || '')).toLowerCase(); return words.every(function (w) { return h.indexOf(w) > -1; }); }).slice(0, 8);
    bodyEl.innerHTML = hits.length
      ? '<p class="search-title">Results</p><ul class="results">' + hits.map(function (x) { return '<li><a href="' + esc(x.href) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : '') + '><span class="r-type">' + x.t + '</span><span>' + esc(x.title) + '<small>' + esc(x.sub) + '</small></span></a></li>'; }).join('') + '</ul>'
      : '<p class="search-title no-results">No results for “' + esc(q) + '”. Try “Java”, “Claude” or “CodeSquadz”.</p>';
    $$('a', bodyEl).forEach(function (a) { a.addEventListener('click', function () { setSearch(false); }); });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
    searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = $('#searchBody .results a'); if (a) a.click(); } });
  }

  /* ---------------- Copy email ---------------- */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { var old = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, done); else done();
    });
  });

  /* ---------------- Contact form with visitor details ---------------- */
  function deviceInfo() {
    var ua = navigator.userAgent || '';
    var os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac OS X|Macintosh/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Unknown OS';
    var br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser';
    return br + ' on ' + os + (/Mobi|Android|iPhone/i.test(ua) ? ' (mobile)' : ' (desktop)');
  }
  function approxLocation() {
    return new Promise(function (resolve) {
      var done = false, t = setTimeout(function () { if (!done) { done = true; resolve(''); } }, 3500);
      fetch('https://ipwho.is/', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
        if (done) return; done = true; clearTimeout(t);
        resolve(j && j.success !== false ? [j.city, j.region, j.country].filter(Boolean).join(', ') : '');
      }).catch(function () { if (!done) { done = true; clearTimeout(t); resolve(''); } });
    });
  }
  var form = $('#contactForm');
  if (form) {
    var status = $('#formStatus'), btn = $('#formBtn');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required], textarea[required]', form).forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (!ok) { status.className = 'form-status err'; status.textContent = 'Please fill in your name, a valid email, a subject and a message.'; return; }
      if (form._gotcha && form._gotcha.value) return;
      btn.disabled = true; btn.textContent = 'Sending'; status.className = 'form-status'; status.textContent = '';
      var v = function (n) { return (form.elements[n] || {}).value ? form.elements[n].value.trim() : ''; };
      approxLocation().then(function (loc) {
        var fd = new FormData();
        var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e2) { tz = ''; }
        fd.append('_subject', 'Portfolio message: ' + v('Subject') + ' (from ' + v('Name') + ')');
        fd.append('Name', v('Name'));
        fd.append('email', v('email'));
        fd.append('Phone', v('Phone') || 'Not given');
        fd.append('Subject', v('Subject'));
        fd.append('Message', v('Message'));
        fd.append('Sender location (approx.)', loc || 'Not available');
        fd.append('Sender time zone', tz || 'Unknown');
        fd.append('Sender language', navigator.language || 'Unknown');
        fd.append('Sender device', deviceInfo());
        fd.append('Sender screen', window.screen.width + ' x ' + window.screen.height);
        fd.append('Sent from page', location.href.split('#')[0]);
        fd.append('Came from', document.referrer || 'Direct visit');
        fd.append('Received at (IST)', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' }));
        fd.append('Website', 'Nitish Singh Portfolio, contact form');
        return fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        form.reset(); status.className = 'form-status ok'; status.textContent = 'Message sent. Thank you, I will get back to you soon.';
      }).catch(function () {
        status.className = 'form-status err'; status.textContent = 'The message could not be sent. Please email mrnitishsingh15@gmail.com instead.';
      }).then(function () { btn.disabled = false; btn.textContent = 'Send message'; });
    });
  }

  /* ==========================================================
     Chat assistant: answers from this portfolio's own data.
     Runs in the browser, no server or API key needed.
     ========================================================== */
  var EMAIL = (D.site && D.site.email) || 'mrnitishsingh15@gmail.com';
  function names(cat) { return merge('skills').filter(function (s) { return s.cat === cat; }).map(function (s) { return s.name; }).join(', '); }

  var KB = [
    { id: 'greet', kw: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'good morning', 'good evening'],
      a: 'Hello! I can answer questions about Nitish: his **skills**, **projects**, **internships**, **education** and how to **contact** him. What would you like to know?',
      next: ['Who is Nitish Singh?', 'Show me his projects', 'What are his skills?'] },
    { id: 'about', kw: ['who is', 'about nitish', 'introduce', 'tell me about him', 'about him', 'kaun hai', 'parichay', 'summary', 'overview', 'yourself'],
      a: '**Nitish Singh** is a Java Developer and Software Engineer based in Noida, Uttar Pradesh.\n- Completed a 6 month **Java full stack internship at CodeSquadz**, Noida\n- Summer internship at SoftPro India\n- Core stack: Java, Spring Boot, REST APIs and MySQL, with React on the front end\n- Uses Claude, ChatGPT, Gemini and GitHub Copilot as AI assistants\n- Studying B.Tech in Computer Science and Engineering (2025 to 2028)',
      next: ['Tell me about the CodeSquadz internship', 'What are his skills?', 'Why should we hire Nitish?'] },
    { id: 'skills', kw: ['skill', 'tech stack', 'technology', 'technologies', 'expertise', 'tools', 'languages', 'kya aata', 'kya seekha', 'stack', 'good at'],
      a: function () { return 'Nitish works with:\n- **Languages:** ' + names('lang') + '\n- **Backend:** ' + names('backend') + '\n- **Frontend:** ' + names('frontend') + '\n- **Data:** ' + names('data') + '\n- **AI tools:** ' + names('ai') + '\n- **Platforms and tools:** ' + names('tool') + '\n\nSee them orbiting around Java in the [Skills section](index.html#skills).'; },
      next: ['Which AI tools does he use?', 'Which Java and Spring Boot work has he done?', 'Show me his projects'] },
    { id: 'ai', kw: ['claude', 'chatgpt', 'gemini', 'copilot', 'ai tool', 'ai tools', 'artificial', 'llm', 'prompt', 'ai'],
      a: function () { return 'Nitish uses **' + names('ai') + '** as everyday assistants for drafts, debugging, tests and learning. He reviews and understands every line before it goes into a project, so the AI speeds him up without replacing his judgement.'; },
      next: ['What are his skills?', 'Why should we hire Nitish?'] },
    { id: 'java', kw: ['java', 'spring', 'springboot', 'backend', 'back end', 'rest api', 'oop', 'hibernate', 'server side'],
      a: 'Java is Nitish’s main language.\n- Six months of **Java full stack** work at CodeSquadz\n- Built the **Nalanda Open University portal** with Spring Boot during his SoftPro India internship\n- Built the **UPPCL Bill Generator** in Java with MySQL, with tariff calculations and PDF export\n- Builds REST APIs and login flows with Spring Boot',
      next: ['Tell me about the CodeSquadz internship', 'What is the Nalanda Open University project?', 'Which database does he use?'] },
    { id: 'frontend', kw: ['react', 'frontend', 'front end', 'html', 'css', 'javascript', 'bootstrap', 'responsive', 'ui', 'node'],
      a: 'On the front end Nitish uses **React, JavaScript, HTML5, CSS3 and Bootstrap** to build responsive interfaces. Examples: **ResumGo** (resume builder) and the **GENFIDAI** platform. He also uses Node.js.',
      next: ['Tell me about ResumGo', 'What is GENFIDAI?', 'Show me his projects'] },
    { id: 'database', kw: ['database', 'mysql', 'mongodb', 'sql', 'data base', 'db', 'schema', 'query'],
      a: 'For data, Nitish uses **MySQL** in the UPPCL Bill Generator and Vezify Mart, and **MongoDB** in MERN stack work.',
      next: ['Show me his projects', 'Which Java and Spring Boot work has he done?'] },
    { id: 'android', kw: ['android', 'mobile app', 'mobile application', 'app development'],
      a: 'Yes. Nitish built an **Android e-commerce app** in Java and XML with sign in, a product catalogue and a cart.',
      next: ['Show me his projects', 'What are his skills?'] },
    { id: 'projects', kw: ['project', 'projects', 'portfolio work', 'built', 'kaam', 'work samples', 'dikhao'],
      a: 'Featured projects:\n- **ResumGo**: resume builder with ATS score and PDF or DOC download. [Open live site](https://autoresume.netlify.app/)\n- **GENFIDAI**: platform for developers. [Open live site](https://genfidai.netlify.app/)\n- **UPPCL Bill Generator**: Java and MySQL\n- **Nalanda Open University portal**: Spring Boot\n- **Vezify Mart**: PHP e-commerce site\n- **Android e-commerce app**\n\nSee all of them on the [Projects page](projects.html).',
      next: ['Tell me about ResumGo', 'What is GENFIDAI?', 'What is his GitHub?'] },
    { id: 'resumgo', kw: ['resumgo', 'autoresume', 'auto resume', 'resume builder', 'ats score', 'ats'],
      a: '**ResumGo** is a resume builder Nitish made. It has a multi-step form, a live **ATS score check** and one-click **PDF or DOC download**, built with HTML, CSS and JavaScript.\n\n[Open ResumGo](https://autoresume.netlify.app/)',
      next: ['What is GENFIDAI?', 'Show me his projects', 'How can I contact Nitish?'] },
    { id: 'genfidai', kw: ['genfidai', 'genfid', 'gen fid'],
      a: '**GENFIDAI** is a platform for developers with learning resources, career guidance and tools. Nitish designed, built and runs it with React JS, Bootstrap and JavaScript.\n\n[Open GENFIDAI](https://genfidai.netlify.app/)',
      next: ['Tell me about ResumGo', 'Show me his projects'] },
    { id: 'nou', kw: ['nalanda', 'nou', 'open university', 'iimm', 'ayodhya', 'ayothya'],
      a: 'During his SoftPro India summer internship (Jun to Aug 2024) Nitish worked on live projects including **IIMM Ayodhya** and the **Nalanda Open University portal**, a student portal built with Java Spring Boot and MySQL.',
      next: ['Tell me about the SoftPro internship', 'Which Java and Spring Boot work has he done?'] },
    { id: 'codesquadz', kw: ['codesquadz', 'codesquadz', 'code squadz', 'codesquad', 'noida internship'],
      a: '**Java Full Stack Intern at CodeSquadz, Noida** (6 months). Nitish worked across the stack with Java, Spring Boot, MySQL and a web front end in a team setting.\n\n[Visit CodeSquadz](https://www.codesquadz.com/) or see the [Experience page](experience.html#codesquadz).',
      next: ['Tell me about the SoftPro internship', 'What is his education?', 'Why should we hire Nitish?'] },
    { id: 'intern', kw: ['softpro', 'soft pro', 'summer internship', 'summer intern'],
      a: '**Java Development Summer Intern at SoftPro India Pvt Ltd** (Jun 2024 to Aug 2024). Nitish built full stack live projects with HTML, CSS, JavaScript, MySQL, Spring Boot and Python, including IIMM Ayodhya and the Nalanda Open University portal.',
      next: ['What is the Nalanda Open University project?', 'Tell me about the CodeSquadz internship'] },
    { id: 'experience', kw: ['experience', 'work experience', 'where does he work', 'currently work', 'company', 'employer', 'job', 'career', 'anubhav', 'naukri', 'working', 'internship', 'intern', 'kahan kaam', 'kaam karte', 'kahan job'],
      a: function () { return 'Experience:\n' + merge('exp').map(function (e) { return '- **' + e.role + ', ' + e.company + '** (' + e.period + ')'; }).join('\n') + '\n\nDetails are on the [Experience page](experience.html).'; },
      next: ['Tell me about the CodeSquadz internship', 'Tell me about the SoftPro internship', 'What is his education?'] },
    { id: 'education', kw: ['education', 'study', 'college', 'degree', 'btech', 'b.tech', 'diploma', 'qualification', 'university', 'padhai', 'studied', 'school', 'adca', 'mdeg'],
      a: function () { return 'Education:\n' + merge('edu').map(function (d) { return '- **' + d.title + '**' + (d.period ? ' (' + d.period + ')' : '') + ', ' + d.place; }).join('\n'); },
      next: ['Tell me about the CodeSquadz internship', 'What are his skills?'] },
    { id: 'contact', kw: ['contact', 'email', 'mail', 'phone', 'number', 'call', 'reach', 'mobile', 'whatsapp', 'sampark', 'message', 'get in touch'],
      a: 'You can reach Nitish here:\n- **Email:** [' + EMAIL + '](mailto:' + EMAIL + ')\n- **Phone:** [+91 90057 35437](tel:+919005735437)\n- **WhatsApp:** [Message on WhatsApp](https://wa.me/919005735437)\n- **LinkedIn:** [linkedin.com/in/nitishsde](https://www.linkedin.com/in/nitishsde)\n\nOr use the [contact form](index.html#contact).',
      next: ['Can I download his resume?', 'What is his GitHub?'] },
    { id: 'resume', kw: ['resume', 'cv', 'download', 'curriculum'],
      a: 'You can download Nitish’s resume here: [Download resume (PDF)](assets/Nitish-Singh-Resume.pdf)',
      next: ['How can I contact Nitish?', 'Tell me about the CodeSquadz internship'] },
    { id: 'location', kw: ['where is he', 'location', 'based', 'city', 'address', 'kahan', 'from where', 'relocate', 'noida'],
      a: 'Nitish is based in **Noida, Uttar Pradesh, India**. For relocation or remote work questions, please [contact him](index.html#contact) directly.',
      next: ['How can I contact Nitish?', 'Tell me about the CodeSquadz internship'] },
    { id: 'github', kw: ['github', 'git hub', 'repo', 'repository', 'source code', 'code samples'],
      a: 'Nitish’s code is on GitHub: [github.com/nitishsde](https://github.com/nitishsde)', next: ['What is his LinkedIn?', 'Show me his projects'] },
    { id: 'linkedin', kw: ['linkedin', 'linked in', 'social', 'profile link'],
      a: 'Connect with Nitish on LinkedIn: [linkedin.com/in/nitishsde](https://www.linkedin.com/in/nitishsde)', next: ['What is his GitHub?', 'How can I contact Nitish?'] },
    { id: 'hire', kw: ['hire', 'hiring', 'recruit', 'why should', 'strength', 'strengths', 'qualities', 'fit for', 'suitable', 'best at', 'weakness'],
      a: 'Why Nitish is a good fit for a Java team:\n- Six months of Java full stack work at CodeSquadz plus a summer internship at SoftPro India\n- Comfortable with the whole stack: Spring Boot, MySQL, REST APIs and React\n- Ships real products: ResumGo and GENFIDAI are live\n- Uses Claude and other AI tools to work faster, with careful review\n- Keeps learning: B.Tech CSE, Diploma and ADCA\n\n[Download his resume](assets/Nitish-Singh-Resume.pdf) or [contact him](index.html#contact).',
      next: ['Show me his projects', 'Can I download his resume?', 'Is he available for interviews?'] },
    { id: 'availability', kw: ['available', 'availability', 'interview', 'notice period', 'open to', 'opportunit', 'freelance', 'salary', 'ctc'],
      a: 'Availability and compensation are best discussed with Nitish directly. Email him at [' + EMAIL + '](mailto:' + EMAIL + ') or message him on [WhatsApp](https://wa.me/919005735437).',
      next: ['How can I contact Nitish?', 'Can I download his resume?'] },
    { id: 'settings', kw: ['setting', 'settings', 'dark mode', 'dark theme', 'light theme', 'text size', 'font size', 'theme'],
      a: 'Use the **sliders icon** in the top bar to open website settings: switch between light and dark theme, change text size, turn animations and the orbit movement on or off, and let the chat read answers aloud.',
      next: ['How do I use voice?', 'Show me his projects'] },
    { id: 'voice', kw: ['voice', 'mic', 'microphone', 'speak', 'talk to', 'bolo'],
      a: 'Tap the **microphone** button next to the chat box and speak your question. It works in Chrome, Edge and Safari. You can also turn on “Chat reads answers aloud” in the website settings.',
      next: ['What are his skills?', 'Show me his projects'] },
    { id: 'thanks', kw: ['thanks', 'thank you', 'thx', 'shukriya', 'dhanyavad'],
      a: 'You’re welcome! Ask me anything else about Nitish, or [contact him](index.html#contact) directly.', next: ['Show me his projects', 'How can I contact Nitish?'] },
    { id: 'bye', kw: ['bye', 'goodbye', 'see you', 'alvida'], a: 'Goodbye, and thanks for visiting Nitish’s portfolio!', next: [] }
  ];
  var START_CHIPS = ['Who is Nitish Singh?', 'What are his skills?', 'Show me his projects', 'Tell me about the CodeSquadz internship', 'How can I contact Nitish?'];
  var QUESTIONS = ['Who is Nitish Singh?', 'What are his skills?', 'Which AI tools does he use?', 'Show me his projects', 'Tell me about ResumGo', 'What is GENFIDAI?',
    'Tell me about the CodeSquadz internship', 'Tell me about the SoftPro internship', 'What is his experience?', 'What is his education?', 'How can I contact Nitish?',
    'Can I download his resume?', 'Where is he based?', 'Why should we hire Nitish?', 'What are his strengths?', 'Does he know React?', 'Which database does he use?',
    'Which Java and Spring Boot work has he done?', 'Has he built Android apps?', 'What is his GitHub?', 'What is his LinkedIn?', 'What is the Nalanda Open University project?',
    'Is he available for interviews?', 'What is his tech stack?', 'How do I use voice?', 'How do I change the theme?'];

  function norm(s) { return ' ' + s.toLowerCase().replace(/[^a-z0-9.+# ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
  function matchIntent(text) {
    var m = norm(text), best = null, bestScore = 0;
    KB.forEach(function (it) {
      var score = 0;
      it.kw.forEach(function (k) { if (k.length <= 3 ? m.indexOf(' ' + k + ' ') > -1 : m.indexOf(k) > -1) score += k.length; });
      if (score > bestScore) { bestScore = score; best = it; }
    });
    return best;
  }
  function inline(s) {
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) {
      var ext = /^https?:/.test(u), hash = u.indexOf('#') > -1 && u.indexOf('http') !== 0;
      return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : hash ? ' data-goto="1"' : '') + '>' + t + '</a>';
    });
  }
  function md(text) {
    var out = '', list = false;
    text.split('\n').forEach(function (line) {
      if (/^- /.test(line)) { if (!list) { out += '<ul>'; list = true; } out += '<li>' + inline(line.slice(2)) + '</li>'; }
      else { if (list) { out += '</ul>'; list = false; } if (line.trim()) out += '<p>' + inline(line) + '</p>'; }
    });
    return out + (list ? '</ul>' : '');
  }

  var fab = $('#chatFab'), panel = $('#chatPanel'), log = $('#chatLog'), input = $('#chatInput'), chatForm = $('#chatForm'), sug = $('#chatSuggest'), micBtn = $('#chatMic');
  if (fab && panel) {
    var stopStream = null, sugIndex = -1, built = false;
    var scrollLog = function () { log.scrollTop = log.scrollHeight; };

    function addUser(text) { var m = document.createElement('div'); m.className = 'msg user'; m.innerHTML = '<div class="bubble"></div>'; m.firstChild.textContent = text; log.appendChild(m); scrollLog(); }
    function addBot() {
      var m = document.createElement('div'); m.className = 'msg bot';
      m.innerHTML = '<span class="msg-avatar" aria-hidden="true">N</span><div class="msg-body"><div class="bubble"></div></div>'; log.appendChild(m);
      return { bubble: $('.bubble', m), body: $('.msg-body', m) };
    }
    function chipsFor(list) {
      var w = document.createElement('div'); w.className = 'chips';
      list.forEach(function (q) { var b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.addEventListener('click', function () { ask(q); }); w.appendChild(b); });
      return w;
    }
    function clearChips() { $$('.chips', log).forEach(function (c) { c.remove(); }); }

    function stream(target, html, done) {
      target.innerHTML = html;
      if (!motionOK()) { done(); return; }
      var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null), nodes = [], n;
      while ((n = walker.nextNode())) { nodes.push({ node: n, full: n.nodeValue }); n.nodeValue = ''; }
      var ni = 0, ci = 0, timer, ended = false;
      function finish() { if (ended) return; ended = true; clearInterval(timer); nodes.forEach(function (o) { o.node.nodeValue = o.full; }); stopStream = null; done(); }
      stopStream = finish;
      timer = setInterval(function () {
        var budget = 4;
        while (budget > 0 && ni < nodes.length) {
          var o = nodes[ni], take = Math.min(budget, o.full.length - ci); ci += take; budget -= take; o.node.nodeValue = o.full.slice(0, ci);
          if (ci >= o.full.length) { ni++; ci = 0; }
        }
        scrollLog(); if (ni >= nodes.length) finish();
      }, 16);
    }

    function speak(text) {
      if (!S.voice || !window.speechSynthesis) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ')); u.lang = 'en-IN'; u.rate = 1; speechSynthesis.speak(u);
    }

    function reply(text) {
      clearChips();
      var it = matchIntent(text), bot = addBot();
      bot.bubble.innerHTML = '<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>'; scrollLog();
      setTimeout(function () {
        var answer, next;
        if (it) { answer = typeof it.a === 'function' ? it.a() : it.a; next = it.next; }
        else { answer = 'I can only answer questions about Nitish’s skills, projects, experience, education and contact details. Try one of these:'; next = START_CHIPS.slice(0, 4); }
        stream(bot.bubble, md(answer), function () {
          var tools = document.createElement('div'); tools.className = 'msg-tools';
          var copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Copy';
          copy.addEventListener('click', function () {
            var ok = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1500); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bot.bubble.innerText).then(ok, ok); else ok();
          });
          tools.appendChild(copy); bot.body.appendChild(tools);
          if (next && next.length) bot.body.appendChild(chipsFor(next));
          scrollLog(); speak(bot.bubble.innerText);
        });
      }, motionOK() ? 550 : 0);
    }

    function ask(q) {
      q = (q || '').trim(); if (!q) return;
      if (panel.hidden) openChat();
      if (stopStream) stopStream();
      hideSuggest(); addUser(q); input.value = ''; reply(q);
    }
    function welcome() {
      log.innerHTML = '';
      var bot = addBot();
      bot.bubble.innerHTML = md('Hi, I’m the assistant for Nitish’s portfolio. Ask me about his **skills**, **projects**, **internships** or how to **contact** him. Hinglish works too, and you can tap the microphone to speak.');
      bot.body.appendChild(chipsFor(START_CHIPS));
    }

    function hideSuggest() { sug.hidden = true; sug.innerHTML = ''; sugIndex = -1; input.removeAttribute('aria-activedescendant'); }
    function showSuggest(val) {
      var words = norm(val).trim().split(' ').filter(Boolean);
      if (!words.length) { hideSuggest(); return; }
      var scored = [];
      QUESTIONS.forEach(function (q) { var ql = norm(q), s = 0; words.forEach(function (w) { if (ql.indexOf(' ' + w) > -1) s += 2; else if (ql.indexOf(w) > -1) s += 1; }); if (s > 0) scored.push({ q: q, s: s }); });
      scored.sort(function (a, b) { return b.s - a.s; });
      var top = scored.slice(0, 5); if (!top.length) { hideSuggest(); return; }
      sug.innerHTML = '';
      top.forEach(function (o, i) {
        var b = document.createElement('button'); b.type = 'button'; b.id = 'sg' + i; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', 'false');
        var html = esc(o.q);
        words.forEach(function (w) { if (w.length > 1) html = html.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
        b.innerHTML = html; b.addEventListener('mousedown', function (e) { e.preventDefault(); }); b.addEventListener('click', function () { ask(o.q); }); sug.appendChild(b);
      });
      sug.hidden = false; sugIndex = -1;
    }
    function moveSuggest(dir) {
      var items = $$('button', sug); if (!items.length || sug.hidden) return false;
      sugIndex = (sugIndex + dir + items.length) % items.length;
      items.forEach(function (b, i) { b.setAttribute('aria-selected', String(i === sugIndex)); });
      input.setAttribute('aria-activedescendant', items[sugIndex].id); items[sugIndex].scrollIntoView({ block: 'nearest' }); return true;
    }
    input.addEventListener('input', function () { showSuggest(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { if (moveSuggest(1)) e.preventDefault(); }
      else if (e.key === 'ArrowUp') { if (moveSuggest(-1)) e.preventDefault(); }
      else if (e.key === 'Enter' && sugIndex > -1) { var items = $$('button', sug); if (items[sugIndex]) { e.preventDefault(); ask(items[sugIndex].textContent); } }
      else if (e.key === 'Escape' && !sug.hidden) { hideSuggest(); e.stopPropagation(); }
    });
    chatForm.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });

    /* voice input */
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, listening = false;
    var assistMic = $('#assistMic'), assistNote = $('#assistNote');
    function stopListen() { listening = false; if (micBtn) { micBtn.classList.remove('listening'); micBtn.setAttribute('aria-pressed', 'false'); } if (assistMic) assistMic.classList.remove('listening'); }
    function startListen() {
      if (!SR) return;
      if (panel.hidden) openChat();
      if (listening && rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = 'en-IN'; rec.interimResults = true; rec.maxAlternatives = 1; var finalText = '';
      rec.onstart = function () { listening = true; micBtn.classList.add('listening'); micBtn.setAttribute('aria-pressed', 'true'); if (assistMic) assistMic.classList.add('listening'); input.placeholder = 'Listening…'; };
      rec.onresult = function (e) {
        var t = ''; for (var i = e.resultIndex; i < e.results.length; i++) { t += e.results[i][0].transcript; if (e.results[i].isFinal) finalText = t; }
        input.value = t; showSuggest(t);
      };
      rec.onerror = function (e) { stopListen(); input.placeholder = 'Ask anything about Nitish'; if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { if (assistNote) assistNote.textContent = 'Microphone access is blocked. Allow it in your browser settings to speak a question.'; } };
      rec.onend = function () { stopListen(); input.placeholder = 'Ask anything about Nitish'; if (finalText) ask(finalText); };
      try { rec.start(); } catch (err) { stopListen(); }
    }
    if (SR) { micBtn.hidden = false; micBtn.addEventListener('click', startListen); if (assistMic) { assistMic.hidden = false; assistMic.addEventListener('click', startListen); } }
    else if (assistNote) assistNote.textContent = 'Voice input needs Chrome, Edge or Safari. Typing works everywhere.';

    function openChat() {
      panel.hidden = false; panel.setAttribute('aria-hidden', 'false'); panel.classList.remove('open'); void panel.offsetWidth; panel.classList.add('open');
      fab.setAttribute('aria-expanded', 'true'); fab.setAttribute('aria-label', 'Close chat');
      if (!built) { welcome(); built = true; }
      setSettings(false); setTimeout(function () { input.focus({ preventScroll: true }); }, 60);
    }
    function closeChat() {
      if (rec && listening) rec.stop(); if (window.speechSynthesis) speechSynthesis.cancel();
      panel.hidden = true; panel.setAttribute('aria-hidden', 'true'); fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-label', 'Open chat about Nitish'); hideSuggest();
    }
    fab.addEventListener('click', function () { panel.hidden ? openChat() : closeChat(); });
    $('#chatClose').addEventListener('click', function () { closeChat(); fab.focus(); });
    $('#chatClear').addEventListener('click', function () { if (stopStream) stopStream(); welcome(); input.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden && sug.hidden && !(searchPanel && !searchPanel.hidden)) { closeChat(); fab.focus(); } });

    /* in-chat links to sections or pages */
    log.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-goto]'); if (!a) return;
      var href = a.getAttribute('href'), parts = href.split('#'), here = location.pathname.split('/').pop() || 'index.html';
      if (parts[0] && parts[0] !== here) return;   /* other page: normal navigation */
      var t = parts[1] && document.getElementById(parts[1]);
      if (t) { e.preventDefault(); if (window.innerWidth <= 640) closeChat(); t.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' }); }
    });

    /* assistant section on the home page */
    var aOpen = $('#assistOpen'); if (aOpen) aOpen.addEventListener('click', openChat);
    var aChips = $('#assistChips');
    if (aChips) ['Who is Nitish Singh?', 'Which AI tools does he use?', 'Tell me about the CodeSquadz internship', 'Show me his projects', 'Why should we hire Nitish?', 'How can I contact Nitish?'].forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.addEventListener('click', function () { ask(q); }); aChips.appendChild(b);
    });
  }

  /* shared helpers for manage.js */
  window.NP = { D: D, esc: esc, safeUrl: safeUrl, merge: merge, getCustom: getCustom, saveCustom: saveCustom, renderers: { expCard: expCard, eduItem: eduItem, skillGroups: skillGroups, siteCard: siteCard }, refresh: renderAll, CATS: CATS };

  renderAll();
})();
