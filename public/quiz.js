/* RouwKompas — client-side intake quiz engine.
   Renders the multi-step questionnaire, captures the lead, and submits to the
   API. Vanilla JS, no dependencies. Progressive: the page works as a calm
   single-question-at-a-time flow. */

(function () {
  'use strict';

  var QUIZ = JSON.parse(document.getElementById('quizData').textContent);
  var root = document.getElementById('quizRoot');
  var progressBar = document.getElementById('progressBar');

  var state = { index: -1, answers: {} }; // -1 = intro
  var totalSteps = QUIZ.steps.length;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function setProgress() {
    var pct;
    if (state.index < 0) pct = 0;
    else if (state.index >= totalSteps) pct = 100;
    else pct = Math.round((state.index / totalSteps) * 100);
    progressBar.style.width = pct + '%';
  }

  function canAdvance(step) {
    var v = state.answers[step.id];
    if (step.type === 'multi') return Array.isArray(v) && v.length > 0;
    if (step.type === 'scale') return typeof v === 'number';
    return !!v;
  }

  function renderStep() {
    setProgress();
    var step = QUIZ.steps[state.index];
    var html = '<div class="step">';
    html += '<div class="step-count">Question ' + (state.index + 1) + ' of ' + totalSteps + '</div>';
    html += '<h1 class="q-title">' + esc(step.question) + '</h1>';
    if (step.help) html += '<p class="q-help">' + esc(step.help) + '</p>';

    if (step.type === 'single' || step.type === 'multi') {
      html += '<div class="options" role="group">';
      var selected = state.answers[step.id];
      step.options.forEach(function (opt) {
        var isSel =
          step.type === 'multi'
            ? Array.isArray(selected) && selected.indexOf(opt.value) !== -1
            : selected === opt.value;
        html +=
          '<button type="button" class="option ' +
          (step.type === 'multi' ? 'multi ' : '') +
          (isSel ? 'selected' : '') +
          '" data-value="' + esc(opt.value) + '">' +
          '<span class="dot"></span><span>' + esc(opt.label) + '</span></button>';
      });
      html += '</div>';
    } else if (step.type === 'scale') {
      var val = typeof state.answers[step.id] === 'number' ? state.answers[step.id] : Math.round((step.min + step.max) / 2);
      html +=
        '<div class="scale"><output id="scaleOut">' + val + '</output>' +
        '<input type="range" id="scaleInput" min="' + step.min + '" max="' + step.max + '" value="' + val + '">' +
        '<div class="scale-labels"><span>' + esc(step.minLabel || step.min) + '</span><span>' + esc(step.maxLabel || step.max) + '</span></div></div>';
      // ensure default recorded
      state.answers[step.id] = val;
    }

    html += '<div class="quiz-nav">';
    html += '<button type="button" class="link-btn" data-action="back">' + (state.index === 0 ? 'Cancel' : '← Back') + '</button>';
    var lastQuestion = state.index === totalSteps - 1;
    html += '<button type="button" class="btn btn-primary" data-action="next" id="nextBtn">' + (lastQuestion ? 'See my reflection' : 'Continue') + '</button>';
    html += '</div></div>';

    root.innerHTML = html;
    bindStep(step);
    updateNextState(step);
  }

  function updateNextState(step) {
    var next = document.getElementById('nextBtn');
    if (!next) return;
    if (step.type === 'single' || step.type === 'multi') {
      next.disabled = !canAdvance(step);
    } else {
      next.disabled = false;
    }
  }

  function bindStep(step) {
    root.querySelectorAll('.option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-value');
        if (step.type === 'multi') {
          var arr = Array.isArray(state.answers[step.id]) ? state.answers[step.id].slice() : [];
          var i = arr.indexOf(value);
          if (i === -1) arr.push(value); else arr.splice(i, 1);
          state.answers[step.id] = arr;
          btn.classList.toggle('selected');
          updateNextState(step);
        } else {
          state.answers[step.id] = value;
          root.querySelectorAll('.option').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          updateNextState(step);
          // gentle auto-advance for single-choice
          setTimeout(next, 220);
        }
      });
    });

    var range = document.getElementById('scaleInput');
    if (range) {
      var out = document.getElementById('scaleOut');
      range.addEventListener('input', function () {
        out.textContent = range.value;
        state.answers[step.id] = parseInt(range.value, 10);
      });
    }

    root.querySelectorAll('[data-action=back]').forEach(function (b) { b.addEventListener('click', back); });
    root.querySelectorAll('[data-action=next]').forEach(function (b) { b.addEventListener('click', next); });
  }

  function next() {
    if (state.index >= 0) {
      var step = QUIZ.steps[state.index];
      if (!canAdvance(step)) return;
    }
    if (state.index < totalSteps - 1) {
      state.index += 1;
      renderStep();
    } else {
      renderCapture();
    }
  }

  function back() {
    if (state.index <= 0) {
      window.location.href = '/';
      return;
    }
    state.index -= 1;
    renderStep();
  }

  // ── Lead capture ──
  function renderCapture() {
    state.index = totalSteps;
    setProgress();
    root.innerHTML =
      '<div class="step">' +
      '<div class="step-count">Almost there</div>' +
      '<h1 class="q-title">Where can we send your reflection?</h1>' +
      '<p class="q-help">We will show your personal reflection and email you a copy with a booking link. Your details stay private and are only seen by your coach.</p>' +
      '<form id="captureForm" novalidate>' +
      field('name', 'Your name', 'text', 'name', true) +
      field('email', 'Email', 'email', 'email', true) +
      field('phone', 'Phone number <span class="hint">(optional)</span>', 'tel', 'tel', false) +
      '<div class="field"><label class="checkbox"><input type="checkbox" id="consent" name="consent">' +
      '<span>I agree that ' + esc((window.RK_SITE || 'RouwKompas')) + ' may store these details and contact me about a free conversation. I can ask for them to be deleted at any time. <a href="/privacy" target="_blank">Privacy</a>.</span></label>' +
      '<div class="err" id="err-consent">Please tick the box so we may contact you.</div></div>' +
      '<div class="notice notice-warn" id="formError" style="display:none;"></div>' +
      '<button type="submit" class="btn btn-primary btn-block" id="submitBtn">Show my reflection</button>' +
      '<button type="button" class="link-btn" data-action="back" style="display:block;margin:10px auto 0;">← Back</button>' +
      '</form></div>';

    document.querySelector('[data-action=back]').addEventListener('click', function () {
      state.index = totalSteps - 1;
      renderStep();
    });
    document.getElementById('captureForm').addEventListener('submit', submitLead);
  }

  function field(id, label, type, autocomplete, required) {
    return (
      '<div class="field" id="field-' + id + '">' +
      '<label for="in-' + id + '">' + label + '</label>' +
      '<input type="' + type + '" id="in-' + id + '" name="' + id + '" autocomplete="' + autocomplete + '"' + (required ? ' required' : '') + '>' +
      '<div class="err" id="err-' + id + '"></div></div>'
    );
  }

  function showFieldError(id, msg) {
    var f = document.getElementById('field-' + id);
    var e = document.getElementById('err-' + id);
    if (f) f.classList.add('invalid');
    if (e) { e.textContent = msg; e.style.display = 'block'; }
  }
  function clearErrors() {
    ['name', 'email', 'phone', 'consent'].forEach(function (id) {
      var f = document.getElementById('field-' + id);
      if (f) f.classList.remove('invalid');
    });
    var ce = document.getElementById('err-consent');
    if (ce) ce.style.display = 'none';
    var fe = document.getElementById('formError');
    if (fe) fe.style.display = 'none';
  }

  function submitLead(e) {
    e.preventDefault();
    clearErrors();
    var name = document.getElementById('in-name').value.trim();
    var email = document.getElementById('in-email').value.trim();
    var phone = document.getElementById('in-phone').value.trim();
    var consent = document.getElementById('consent').checked;

    var bad = false;
    if (name.length < 2) { showFieldError('name', 'Please share the name we can address you by.'); bad = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('email', 'Please enter a valid email address.'); bad = true; }
    if (!consent) { document.getElementById('err-consent').style.display = 'block'; document.getElementById('field-consent') && null; bad = true; }
    if (bad) return;

    // In the static preview (GitHub Pages) there is no server/API — simply
    // glide to the example result so the flow can be experienced end to end.
    if (window.RK_PREVIEW) {
      if (typeof window.RK_onComplete === 'function') { window.RK_onComplete(); return; }
      window.location.href = 'result.html';
      return;
    }

    var btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'One moment…';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, phone: phone, consent: consent, answers: state.answers })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (res.ok && res.data.redirect) {
          window.location.href = res.data.redirect;
          return;
        }
        btn.disabled = false;
        btn.textContent = 'Show my reflection';
        if (res.data && res.data.errors) {
          Object.keys(res.data.errors).forEach(function (k) {
            if (k === 'consent') { document.getElementById('err-consent').style.display = 'block'; }
            else showFieldError(k, res.data.errors[k]);
          });
        } else {
          var fe = document.getElementById('formError');
          fe.textContent = 'Something went wrong sending your details. Please try again.';
          fe.style.display = 'block';
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Show my reflection';
        var fe = document.getElementById('formError');
        fe.textContent = 'We could not reach the server. Please check your connection and try again.';
        fe.style.display = 'block';
      });
  }

  // ── Start ──
  var startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.addEventListener('click', next);
  setProgress();
})();
