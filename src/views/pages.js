// Publieke pagina's (server-gerenderde HTML), Ob-Audire — in het Nederlands.

import content from '../content.js';
import { layout } from './layout.js';
import { QUIZ } from '../quiz.js';
import { esc } from '../util.js';

const R = content.routes;
const C = content;
const coachInitial = C.brand.coach.charAt(0).toUpperCase();

// ── Landingspagina ──────────────────────────────────────────────────────────
export function landingPage() {
  const L = C.landing;
  const steps = L.steps
    .map(
      (s) => `
      <div class="feature">
        <div class="ico">${s.icon}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </div>`
    )
    .join('');

  const body = `
    <section class="hero">
      <div class="container">
        <span class="eyebrow">${esc(L.eyebrow)}</span>
        <h1>${esc(L.heroTitle)}</h1>
        <p class="lede">${esc(L.heroLede)}</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
          <a class="btn btn-secondary" href="${R.booking}">${esc(C.cta.secondary)}</a>
        </div>
        <p class="muted" style="margin-top:18px;font-size:.9rem;">${esc(L.heroNote)}</p>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="card center">
          <p style="font-family:var(--serif);font-size:1.25rem;color:var(--sage-dark);max-width:48ch;margin:0 auto 0;font-style:italic;">“${esc(C.brand.mole)}”</p>
        </div>
      </div>
    </section>

    <section class="section-pad" id="wat">
      <div class="container">
        <div class="card center">
          <h2 style="margin-top:0;">${esc(L.introTitle)}</h2>
          <p class="muted" style="max-width:58ch;margin:0 auto;">${esc(L.introBody)}</p>
        </div>
      </div>
    </section>

    <section class="section-pad" id="hoe">
      <div class="container">
        <h2 class="center">${esc(L.howTitle)}</h2>
        <div class="feature-grid">${steps}</div>
        <div class="center" style="margin-top:14px;">
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="card coach-card">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <h2 style="margin-top:0;">${esc(L.coachTeaserTitle)}</h2>
            <p class="muted">${esc(L.coachTeaserBody)}</p>
            <a href="${R.about}" class="btn btn-secondary" style="padding:10px 20px;">Maak kennis met ${esc(C.brand.coach.split(' ')[0])}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container center">
        <div class="result-invite" style="max-width:560px;margin:0 auto;">
          <h2 style="margin-top:0;">${esc(L.closingTitle)}</h2>
          <p class="muted">${esc(L.closingBody)}</p>
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: C.brand.tagline, body });
}

// ── Check-in (quiz) ─────────────────────────────────────────────────────────
export function quizPage() {
  const data = JSON.stringify(QUIZ);
  const Q = C.quizIntro;
  const body = `
    <section class="section-pad">
      <div class="container">
        <div class="quiz-wrap">
          <noscript>
            <div class="notice notice-warn">Voor deze check-in is JavaScript nodig. Je kunt ook direct
              <a href="${R.booking}">een kennismakingsgesprek plannen</a>.</div>
          </noscript>
          <div class="progress" aria-hidden="true"><span id="progressBar"></span></div>
          <div id="quizRoot" aria-live="polite">
            <div class="step center">
              <h1 class="q-title">${esc(Q.title)}</h1>
              <p class="q-help">${esc(Q.lede)}</p>
              <button class="btn btn-primary" id="startBtn">${esc(Q.start)}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <script id="quizData" type="application/json">${data}</script>
  `;
  return layout({ title: Q.title, body, minimal: true, scripts: ['/quiz.js'] });
}

// ── Wie ben ik (about) ──────────────────────────────────────────────────────
export function aboutPage() {
  const A = C.about;
  const intro = A.intro.map((p) => `<p${p === A.intro[1] ? ' class="muted"' : ''}>${esc(p)}</p>`).join('');
  const strengths = A.strengths
    .map((s) => `<div class="feature"><h3 style="margin-top:0;">${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`)
    .join('');
  const pillars = A.pillars
    .map((p) => `<li><strong>${esc(p.title)}</strong><br><span class="muted">${esc(p.body)}</span></li>`)
    .join('');
  const extra = A.extraTraining.map((t) => `<li class="muted">${esc(t)}</li>`).join('');
  const experience = A.experience.map((e) => `<li class="muted">${esc(e)}</li>`).join('');
  const expect = A.expect
    .map((e) => `<li><strong>${esc(e.title)}.</strong> ${esc(e.body)}</li>`)
    .join('');

  const body = `
    <section class="section-pad">
      <div class="container">
        <span class="eyebrow">${esc(A.eyebrow)}</span>
        <h1>${esc(A.title)}</h1>
        <div class="card coach-card" style="margin:18px 0 28px;">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <p style="margin:0;"><strong>${esc(A.title)}</strong><br><span class="muted">${esc(A.role)}</span></p>
          </div>
        </div>

        ${intro}

        <h2>${esc(A.strengthsTitle)}</h2>
        <div class="feature-grid" style="grid-template-columns:1fr;">${strengths}</div>

        <h2>${esc(A.pillarsTitle)}</h2>
        <ul class="steps-list" style="list-style:none;">${pillars}</ul>

        <h3>${esc(A.extraTrainingTitle)}</h3>
        <ul>${extra}</ul>

        <h2>${esc(A.experienceTitle)}</h2>
        <ul>${experience}</ul>

        <h2>${esc(A.expectTitle)}</h2>
        <ol class="steps-list">${expect}</ol>

        <div class="notice notice-info">
          Begeleiding bij Ob-Audire is ondersteunend en niet-medisch. Het vervangt geen therapie of medische
          behandeling. Heb je acuut hulp nodig, neem dan contact op met je huisarts of een hulplijn.
        </div>

        <div class="center" style="margin-top:26px;">
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
          <a class="btn btn-secondary" href="${R.booking}">${esc(C.cta.secondary)}</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Wie ben ik', body });
}

// ── Aanbod (services) ───────────────────────────────────────────────────────
export function aanbodPage() {
  const A = C.aanbod;
  const services = A.services
    .map(
      (s) => `<div class="feature"><div class="ico">${s.icon}</div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`
    )
    .join('');
  const atelierFor = A.atelier.forWho.map((w) => `<li>${esc(w)}</li>`).join('');

  const body = `
    <section class="section-pad">
      <div class="container">
        <span class="eyebrow">${esc(A.eyebrow)}</span>
        <h1>${esc(A.title)}</h1>
        <p class="muted" style="max-width:60ch;">${esc(A.intro)}</p>
        <div class="feature-grid">${services}</div>

        <hr class="divider">

        <div class="card">
          <span class="eyebrow" style="margin-bottom:14px;">${esc(A.atelier.subtitle)}</span>
          <h2 style="margin-top:0;">${esc(A.atelier.title)}</h2>
          <p>${esc(A.atelier.intro)}</p>
          <h3>Wat kun je verwachten?</h3>
          <p class="muted">${esc(A.atelier.expect)}</p>
          <h3>Voor wie?</h3>
          <ul>${atelierFor}</ul>
          <h3>Kosten</h3>
          <p class="muted">${esc(A.atelier.price)}</p>
          <div class="notice notice-info">${esc(A.atelier.signup)}</div>
          <a class="btn btn-primary" href="${R.booking}">${esc(C.cta.secondary)}</a>
        </div>

        <div class="center" style="margin-top:30px;">
          <a class="btn btn-secondary" href="${R.quiz}">${esc(C.cta.primary)}</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Aanbod', body });
}

// ── Privacy / AVG ───────────────────────────────────────────────────────────
export function privacyPage() {
  const P = C.privacy;
  const sections = P.sections
    .map((s) => `<h2>${esc(s.h)}</h2><p class="muted">${esc(s.p)}</p>`)
    .join('');
  const body = `
    <section class="section-pad">
      <div class="container">
        <span class="eyebrow">${esc(P.eyebrow)}</span>
        <h1>${esc(P.title)}</h1>
        <p class="muted">Laatst bijgewerkt: ${esc(new Date().toISOString().slice(0, 10))}</p>
        <p>${esc(P.intro)}</p>
        ${sections}
        <p class="muted">Vragen of een verzoek? Mail naar <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a>.</p>
        <div class="crisis-line">
          Ob-Audire is begeleiding, geen medische of crisisdienst. Bel in een noodsituatie 112 of de hulplijn 113.
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Privacy & AVG', body });
}
