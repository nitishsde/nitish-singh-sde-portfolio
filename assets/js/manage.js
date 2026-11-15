/* ==========================================================
   manage.html: sign in, then add, edit and delete skills,
   experience, education and projects.

   This is a convenience lock for a static site, not real
   server security. Anyone who reads the page source can see
   the check. It keeps casual visitors out, and it stores the
   password only as a salted SHA-256 hash.
   ========================================================== */
(function () {
  'use strict';
  var NP = window.NP; if (!NP) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = NP.esc;

  var USER = 'nitishsinghrajput';
  var HASH = '65f9172dd7b46bc095d6c81f1d452f1568642c280dbcf7795618890ae505d780';
  var SALT = 'np-portfolio-v1|';

  /* ---- SHA-256 (crypto.subtle when available, small fallback otherwise) ---- */
  function sha256Fallback(str) {
    var bytes = unescape(encodeURIComponent(str)).split('').map(function (c) { return c.charCodeAt(0); });
    var K = [], H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], i, j;
    var isPrime = function (n) { for (var k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
    for (var c = 2, n = 0; n < 64; c++) if (isPrime(c)) { K[n++] = (Math.pow(c, 1 / 3) % 1) * 4294967296 | 0; }
    var l = bytes.length * 8; bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
    for (i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
    var rotr = function (x, n2) { return (x >>> n2) | (x << (32 - n2)); };
    for (var off = 0; off < bytes.length; off += 64) {
      var w = [];
      for (i = 0; i < 16; i++) w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
      for (i = 16; i < 64; i++) { var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      var a = H.slice();
      for (i = 0; i < 64; i++) {
        var S1 = rotr(a[4], 6) ^ rotr(a[4], 11) ^ rotr(a[4], 25), ch = (a[4] & a[5]) ^ (~a[4] & a[6]), t1 = (a[7] + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rotr(a[0], 2) ^ rotr(a[0], 13) ^ rotr(a[0], 22), mj = (a[0] & a[1]) ^ (a[0] & a[2]) ^ (a[1] & a[2]), t2 = (S0 + mj) | 0;
        a = [(t1 + t2) | 0, a[0], a[1], a[2], (a[3] + t1) | 0, a[4], a[5], a[6]];
      }
      for (j = 0; j < 8; j++) H[j] = (H[j] + a[j]) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  function sha256(str) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      });
    }
    return Promise.resolve(sha256Fallback(str));
  }

  /* ---- Login with a short lockout after repeated failures ---- */
  var loginForm = $('#loginForm'), loginStatus = $('#loginStatus'), admin = $('#admin');
  function lockState() { try { return JSON.parse(localStorage.getItem('np_lock') || '{}'); } catch (e) { return {}; } }
  function setLock(o) { try { localStorage.setItem('np_lock', JSON.stringify(o)); } catch (e) { /* ignore */ } }
  function showAdmin() { loginForm.hidden = true; admin.hidden = false; switchTab(tab); }
  var authed = false; try { authed = sessionStorage.getItem('np_admin') === '1'; } catch (e) { authed = false; }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = lockState(), now = Date.now();
    if (st.until && st.until > now) { loginStatus.className = 'form-status err'; loginStatus.textContent = 'Too many attempts. Try again in ' + Math.ceil((st.until - now) / 1000) + ' seconds.'; return; }
    var u = $('#lu').value.trim().toLowerCase(), p = $('#lp').value;
    sha256(SALT + u + '|' + p).then(function (h) {
      if (u === USER && h === HASH) {
        try { sessionStorage.setItem('np_admin', '1'); } catch (e2) { /* ignore */ }
        setLock({}); loginStatus.textContent = ''; $('#lp').value = ''; showAdmin();
      } else {
        var n = (st.n || 0) + 1; setLock({ n: n >= 5 ? 0 : n, until: n >= 5 ? Date.now() + 60000 : 0 });
        loginStatus.className = 'form-status err'; loginStatus.textContent = n >= 5 ? 'Too many attempts. Locked for 60 seconds.' : 'Wrong username or password.';
      }
    });
  });
  $('#logoutBtn').addEventListener('click', function () { try { sessionStorage.removeItem('np_admin'); } catch (e) { /* ignore */ } admin.hidden = true; loginForm.hidden = false; });

  /* ---- Content types ---- */
  var GOOG = function (d) { return 'https://www.google.com/s2/favicons?domain=' + d + '&sz=128'; };
  var SCHEMA = {
    skills: { title: 'skill', fields: [
      { k: 'name', l: 'Skill name', req: 1 },
      { k: 'cat', l: 'Category', type: 'select', opts: [['lang', 'Language'], ['backend', 'Backend'], ['frontend', 'Frontend'], ['data', 'Data'], ['ai', 'AI tool'], ['tool', 'Platform or tool']] },
      { k: 'domain', l: 'Website domain for the Google logo', hint: 'Example: claude.ai. Used when no logo URL is given.' },
      { k: 'logo', l: 'Logo image URL (optional)', hint: 'A full https link to an image.' }
    ] },
    exp: { title: 'experience', fields: [
      { k: 'role', l: 'Role', req: 1 }, { k: 'company', l: 'Company', req: 1 },
      { k: 'type', l: 'Type', type: 'select', opts: [['Internship', 'Internship'], ['Summer internship', 'Summer internship'], ['Full time', 'Full time'], ['Part time', 'Part time'], ['Freelance', 'Freelance'], ['Training', 'Training']] },
      { k: 'period', l: 'Period', req: 1, hint: 'Example: 6 months, or Jan 2026 to Jun 2026' },
      { k: 'location', l: 'Location' }, { k: 'url', l: 'Company website' },
      { k: 'domain', l: 'Domain for the Google logo', hint: 'Example: codesquadz.com' },
      { k: 'details', l: 'Details', type: 'textarea', req: 1 }, { k: 'tags', l: 'Tags, separated by commas' }
    ] },
    edu: { title: 'education', fields: [
      { k: 'title', l: 'Course or degree', req: 1 }, { k: 'place', l: 'Institute', req: 1 }, { k: 'period', l: 'Years' }, { k: 'details', l: 'Details', type: 'textarea' }
    ] },
    proj: { title: 'project', fields: [
      { k: 'name', l: 'Project name', req: 1 }, { k: 'url', l: 'Live site URL (shows a desktop preview)' },
      { k: 'cats', l: 'Type', type: 'select', opts: [['web', 'Web'], ['java', 'Java'], ['java web', 'Java and web'], ['android java', 'Android'], ['web android', 'Web and Android']] },
      { k: 'desc', l: 'Description', type: 'textarea', req: 1 }, { k: 'tags', l: 'Tags, separated by commas' }
    ] }
  };
  var tab = 'skills', editing = null;

  function fieldHtml(f, val) {
    val = val == null ? '' : val;
    var id = 'af-' + f.k, input;
    if (f.type === 'select') input = '<select id="' + id + '" name="' + f.k + '">' + f.opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    else if (f.type === 'textarea') input = '<textarea id="' + id + '" name="' + f.k + '" rows="4"' + (f.req ? ' required' : '') + '>' + esc(val) + '</textarea>';
    else input = '<input id="' + id + '" name="' + f.k + '" type="text" value="' + esc(val) + '"' + (f.req ? ' required' : '') + '>';
    return '<div class="field"><label for="' + id + '">' + esc(f.l) + (f.req ? ' *' : '') + '</label>' + input + (f.hint ? '<p class="hint">' + esc(f.hint) + '</p>' : '') + '</div>';
  }

  function itemName(t, it) { return it.name || it.role || it.title || '(untitled)'; }
  function itemSub(t, it) { return t === 'exp' ? it.company + ', ' + it.period : t === 'edu' ? it.place : t === 'skills' ? (NP.CATS[it.cat] || '') : (it.cats || ''); }

  function renderForm() {
    var sc = SCHEMA[tab], cur = editing ? NP.getCustom()[tab].filter(function (x) { return x.id === editing; })[0] : null;
    var vals = cur ? Object.assign({}, cur, { tags: (cur.tags || []).join(', ') }) : {};
    $('#fields').innerHTML = sc.fields.map(function (f) { return fieldHtml(f, vals[f.k]); }).join('');
    $('#formTitle').textContent = (cur ? 'Edit ' : 'Add ') + sc.title;
    $('#saveBtn').textContent = cur ? 'Save changes' : 'Add ' + sc.title;
    $('#cancelEdit').hidden = !cur;
  }

  function renderPreview() {
    var r = NP.renderers, box = $('#preview'), all = NP.merge(tab);
    if (tab === 'skills') box.innerHTML = '<div class="skill-groups">' + r.skillGroups() + '</div>';
    else if (tab === 'exp') box.innerHTML = '<div class="exp-list">' + all.map(r.expCard).join('') + '</div>';
    else if (tab === 'edu') box.innerHTML = '<ol class="edu-list">' + all.map(r.eduItem).join('') + '</ol>';
    else box.innerHTML = '<div class="site-grid">' + all.map(function (p) { return r.siteCard(p, true); }).join('') + '</div>';
    $$('.reveal', box).forEach(function (e) { e.classList.add('in'); });
  }

  function renderList() {
    var mine = NP.getCustom()[tab], pub = (NP.D.custom || {})[tab] || [];
    $('#listNote').textContent = mine.length || pub.length
      ? 'Items you added are saved in this browser. Items already published in data.js are marked and cannot be edited here.'
      : 'Nothing added yet. Fill in the form to add your first ' + SCHEMA[tab].title + '. Built-in items are not listed here.';
    $('#savedList').innerHTML = pub.map(function (it) { return '<li><span>' + esc(itemName(tab, it)) + '<small>Published, ' + esc(itemSub(tab, it)) + '</small></span></li>'; }).join('') +
      mine.map(function (it) {
        return '<li><span>' + esc(itemName(tab, it)) + '<small>' + esc(itemSub(tab, it)) + '</small></span><span class="row-actions"><button class="link-btn" type="button" data-edit="' + esc(it.id) + '">Edit</button><button class="link-btn danger" type="button" data-del="' + esc(it.id) + '">Delete</button></span></li>';
      }).join('');
  }

  function refreshExport() {
    var c = NP.getCustom(), pub = NP.D.custom || {}, out = {};
    ['skills', 'exp', 'edu', 'proj'].forEach(function (k) {
      var seen = {}, list = [];
      (pub[k] || []).concat(c[k]).forEach(function (it) { if (seen[it.id] != null) list[seen[it.id]] = it; else { seen[it.id] = list.length; list.push(it); } });
      out[k] = list;
    });
    $('#exportText').value = JSON.stringify(out, null, 2);
  }

  function renderAll() { renderForm(); renderPreview(); renderList(); refreshExport(); }

  function switchTab(t) {
    tab = t; editing = null;
    $$('.tabs .chip').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-tab') === t); c.setAttribute('aria-selected', String(c.getAttribute('data-tab') === t)); });
    $('#adminStatus').textContent = '';
    renderAll();
  }
  $$('.tabs .chip').forEach(function (c) { c.addEventListener('click', function () { switchTab(c.getAttribute('data-tab')); }); });

  $('#itemForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var sc = SCHEMA[tab], st = $('#adminStatus'), data = {}, bad = false;
    sc.fields.forEach(function (f) {
      var el = $('#af-' + f.k), v = el.value.trim(); data[f.k] = v;
      var miss = f.req && !v; el.classList.toggle('invalid', miss); if (miss) bad = true;
    });
    ['url', 'logo'].forEach(function (k) { if (data[k] && !/^https?:\/\//i.test(data[k])) { var el = $('#af-' + k); if (el) { el.classList.add('invalid'); bad = true; } } });
    if (bad) { st.className = 'form-status err'; st.textContent = 'Please fill the required fields. Links must start with https://'; return; }
    if (data.tags != null) data.tags = data.tags.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    if (tab === 'skills') data.logo = data.logo || (data.domain ? GOOG(data.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')) : '');
    if (tab === 'exp') data.logo = data.domain ? GOOG(data.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')) : '';
    var c = NP.getCustom();
    if (editing) {
      c[tab] = c[tab].map(function (x) { return x.id === editing ? Object.assign({}, x, data) : x; });
    } else {
      data.id = 'c-' + tab + '-' + Date.now().toString(36);
      c[tab].push(data);
    }
    NP.saveCustom(c);
    var wasEditing = !!editing; editing = null;
    st.className = 'form-status ok'; st.textContent = wasEditing ? 'Saved. The changes are visible on the site in this browser.' : 'Added. It now shows on the site in this browser.';
    renderAll();
  });

  $('#cancelEdit').addEventListener('click', function () { editing = null; $('#adminStatus').textContent = ''; renderForm(); });
  $('#savedList').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
    if (ed) { editing = ed.getAttribute('data-edit'); renderForm(); $('#itemForm').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (del && window.confirm('Delete this item?')) {
      var c = NP.getCustom(); c[tab] = c[tab].filter(function (x) { return x.id !== del.getAttribute('data-del'); }); NP.saveCustom(c);
      if (editing === del.getAttribute('data-del')) editing = null;
      $('#adminStatus').className = 'form-status ok'; $('#adminStatus').textContent = 'Deleted.'; renderAll();
    }
  });

  /* ---- Export ---- */
  $('#exportBtn').addEventListener('click', function () { var d = $('#exportBox'); d.open = true; refreshExport(); d.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#copyExport').addEventListener('click', function () {
    var t = $('#exportText'), b = this, ok = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1500); };
    t.select(); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(ok, ok); else { document.execCommand('copy'); ok(); }
  });
  $('#downloadExport').addEventListener('click', function () {
    var blob = new Blob([$('#exportText').value], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'portfolio-custom.json'; document.body.appendChild(a); a.click(); a.remove();
  });

  if (authed) showAdmin();
})();
