/* Ob-Audire — intern afspraakformulier.
   Used only when no Calendly URL is configured. Submits to /api/booking-request
   and shows a calm confirmation state. */

(function () {
  'use strict';
  var form = document.getElementById('bookingForm');
  if (!form) return;
  var done = document.getElementById('bookingDone');

  function clearErrors() {
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
  }
  function showError(name, msg) {
    var input = form.querySelector('[name=' + name + ']');
    if (!input) return;
    var field = input.closest('.field');
    if (field) {
      field.classList.add('invalid');
      var err = field.querySelector('.err');
      if (err && msg) err.textContent = msg;
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var data = {
      leadId: (form.querySelector('[name=leadId]') || {}).value || '',
      name: form.querySelector('[name=name]').value.trim(),
      email: form.querySelector('[name=email]').value.trim(),
      preference: form.querySelector('[name=preference]').value,
      note: form.querySelector('[name=note]').value.trim()
    };

    var bad = false;
    if (data.name.length < 2) { showError('name'); bad = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { showError('email'); bad = true; }
    if (bad) return;

    // Statische preview (GitHub Pages / los bestand): geen API beschikbaar —
    // toon direct de rustige bevestiging zodat de flow ervaarbaar is.
    if (window.RK_PREVIEW) {
      form.style.display = 'none';
      if (done) done.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    var btn = document.getElementById('bk-submit');
    btn.disabled = true;
    btn.textContent = 'Versturen…';

    fetch('/api/booking-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          if (done) done.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          btn.disabled = false;
          btn.textContent = 'Vraag mijn kennismakingsgesprek aan';
          showError('email', (res.data && res.data.errors && res.data.errors.form) || 'Controleer je gegevens.');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Vraag mijn kennismakingsgesprek aan';
        showError('email', 'We konden de server niet bereiken. Probeer het opnieuw.');
      });
  });
})();
