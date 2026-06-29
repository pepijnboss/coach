// Publieke pagina's (server-gerenderde HTML), Ob-Audire lead-funnel.
//
// Dit is GEEN kopie van de site van Petra. Het is een gerichte lead-pagina die
// bezoekers warm maakt via een korte check-in, hun gegevens vastlegt, en ze
// daarna doorverwijst naar de praktijk van Petra (ob-audire.nl) + een gesprek.

import content from '../content.js';
import { layout } from './layout.js';
import { QUIZ } from '../quiz.js';
import { esc } from '../util.js';

const R = content.routes;
const C = content;
const SITE = C.externalSite;
const coachInitial = C.brand.coach.charAt(0).toUpperCase();

function extLink(label, opts = {}) {
  const cls = opts.btn ? `class="btn ${opts.btn}"` : 'class="muted"';
  return `<a ${cls} href="${esc(SITE.url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
}

// ── Landingspagina ──────────────────────────────────────────────────────────
export function landingPage() {
  const L = C.landing;
  const steps = L.steps
    .map((s) => `
      <div class="feature">
        <div class="ico">${s.icon}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </div>`)
    .join('');
  const focus = C.about.teaserFocus.map((f) => `<li>${esc(f)}</li>`).join('');
  const badges = C.credentials.map((c) => `<span class="badge-pill">${esc(c)}</span>`).join('');
  const testimonials = C.testimonials.items
    .map((t) => `<figure class="testimonial"><blockquote>“${esc(t.quote)}”</blockquote><figcaption>— ${esc(t.name)}</figcaption></figure>`)
    .join('');
  const faq = C.faq.items
    .map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`)
    .join('');

  // Structured data voor lokale vindbaarheid (Google).
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: C.brand.name,
    description: C.brand.essence,
    founder: { '@type': 'Person', name: C.brand.coach },
    url: C.externalSite.url,
    email: C.contact.email,
    telephone: C.contact.phone,
    areaServed: C.contact.region,
    knowsAbout: ['rouwbegeleiding', 'verliesbegeleiding', 'loopbaanbegeleiding', 'persoonlijke ontwikkeling'],
  })}</script>`;

  const body = `
    <section class="hero">
      <div class="container">
        <span class="eyebrow">${esc(L.eyebrow)}</span>
        <h1>${esc(L.heroTitle)}</h1>
        <p class="lede">${esc(L.heroLede)}</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
          ${extLink(C.cta.visitSite, { btn: 'btn-secondary' })}
        </div>
        <p class="free-offer">✓ ${esc(L.freeOffer)}</p>
        <p class="muted" style="margin-top:6px;font-size:.9rem;">${esc(L.heroNote)}</p>
      </div>
    </section>

    <section class="badges-bar">
      <div class="container"><div class="badges">${badges}</div></div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="card center">
          <span class="eyebrow" style="margin-bottom:12px;">${esc(L.referralTitle)}</span>
          <p class="muted" style="max-width:58ch;margin:0 auto 18px;">${esc(L.referralBody)}</p>
          ${extLink(C.cta.visitSite, { btn: 'btn-secondary' })}
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
        <div class="card center">
          <p style="font-family:var(--serif);font-size:1.25rem;color:var(--sage-dark);max-width:48ch;margin:0 auto;font-style:italic;">“${esc(C.brand.mole)}”</p>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <h2 class="center">${esc(C.testimonials.title)}</h2>
        <div class="testimonials">${testimonials}</div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="card coach-card">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <h2 style="margin-top:0;">Je wordt verbonden met Petra Mollet</h2>
            <p class="muted">${esc(C.about.teaser[0])}</p>
            <ul class="muted" style="margin:0 0 16px;">${focus}</ul>
            <a href="${R.about}" class="btn btn-secondary" style="padding:10px 20px;">Over Petra</a>
            ${extLink(SITE.label, {})}
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container" style="max-width:640px;">
        <h2 class="center">${esc(C.faq.title)}</h2>
        <div class="faq">${faq}</div>
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
  return layout({ title: C.brand.tagline, body, head: jsonLd });
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

// ── Over Petra (teaser die doorlinkt naar ob-audire.nl) ─────────────────────
export function aboutPage() {
  const A = C.about;
  const teaser = A.teaser.map((p) => `<p${p === A.teaser[1] ? ' class="muted"' : ''}>${esc(p)}</p>`).join('');
  const focus = A.teaserFocus.map((f) => `<li>${esc(f)}</li>`).join('');

  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:680px;">
        <span class="eyebrow">${esc(A.eyebrow)}</span>
        <h1>${esc(A.title)}</h1>
        <div class="card coach-card" style="margin:18px 0 28px;">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <p style="margin:0;"><strong>${esc(A.title)}</strong><br><span class="muted">${esc(A.role)}</span></p>
          </div>
        </div>

        ${teaser}

        <h2>Waar Petra je bij begeleidt</h2>
        <ul>${focus}</ul>

        <div class="result-invite">
          <h2 style="margin-top:0;">Het volledige verhaal lees je bij Petra zelf</h2>
          <p class="muted">Haar werkwijze, de vijf krachten waarmee ze werkt, haar opleidingen en het volledige aanbod (waaronder het (K)ankeratelier) vind je op haar eigen website.</p>
          ${extLink('Bezoek ' + SITE.label, { btn: 'btn-primary' })}
        </div>

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
  return layout({ title: 'Over Petra', body });
}

// ── Aanbod (korte teaser; details op ob-audire.nl) ──────────────────────────
export function aanbodPage() {
  const A = C.aanbod;
  const services = A.services
    .map((s) => `<div class="feature"><div class="ico">${s.icon}</div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`)
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

        <div class="card" id="atelier">
          <span class="eyebrow" style="margin-bottom:14px;">${esc(A.atelier.subtitle)}</span>
          <h2 style="margin-top:0;">${esc(A.atelier.title)}</h2>
          <p>${esc(A.atelier.intro)}</p>
          <h3>Voor wie?</h3>
          <ul>${atelierFor}</ul>
          <p class="muted">${esc(A.atelier.price)}</p>
          <p>${extLink('Lees meer over het atelier op ' + SITE.label, {})}</p>
        </div>

        <div class="center" style="margin-top:30px;">
          <a class="btn btn-primary" href="${R.quiz}">${esc(C.cta.primary)}</a>
          <a class="btn btn-secondary" href="${R.booking}">${esc(C.cta.secondary)}</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Aanbod', body });
}

// ── Privacy / AVG ───────────────────────────────────────────────────────────
export function privacyPage() {
  const P = C.privacy;
  const sections = P.sections.map((s) => `<h2>${esc(s.h)}</h2><p class="muted">${esc(s.p)}</p>`).join('');
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
