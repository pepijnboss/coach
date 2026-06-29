// Public-facing page views (server-rendered HTML strings).

import config from '../config.js';
import { layout } from './layout.js';
import { QUIZ } from '../quiz.js';
import { esc } from '../util.js';

const coachFirst = config.coachName.split(' ')[0];
const coachInitial = config.coachName.charAt(0).toUpperCase();

// ── Landing page ────────────────────────────────────────────────────────────
export function landingPage() {
  const body = `
    <section class="hero">
      <div class="container">
        <span class="eyebrow">A gentle place to begin</span>
        <h1>Find support after loss</h1>
        <p class="lede">
          Grief can feel heavy and lonely. RouwKompas is a calm, private space to understand
          what you are feeling — and to take one small, supported step forward, at your own pace.
        </p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="/quiz">Start the short check-in</a>
          <a class="btn btn-secondary" href="/booking">Book a free conversation</a>
        </div>
        <p class="muted" style="margin-top:18px;font-size:.9rem;">Free · Private · No obligation · Takes about 2 minutes</p>
      </div>
    </section>

    <section class="section-pad" id="what">
      <div class="container">
        <div class="card center">
          <h2 style="margin-top:0;">What RouwKompas is</h2>
          <p class="muted" style="max-width:56ch;margin:0 auto;">
            RouwKompas pairs a short, gentle self check-in with the warmth of a real, certified grief coach.
            It is not therapy and not medical treatment — it is human support: someone to listen, to help you
            make sense of your feelings, and to walk beside you for a while.
          </p>
        </div>
      </div>
    </section>

    <section class="section-pad" id="how">
      <div class="container">
        <h2 class="center">How it works</h2>
        <div class="feature-grid">
          <div class="feature">
            <div class="ico">🧭</div>
            <h3>1. A short check-in</h3>
            <p>Answer a few gentle questions about how you are feeling. There are no right or wrong answers.</p>
          </div>
          <div class="feature">
            <div class="ico">💬</div>
            <h3>2. A personal reflection</h3>
            <p>Receive a warm, personal summary of what you shared — and how grief coaching may help.</p>
          </div>
          <div class="feature">
            <div class="ico">🤝</div>
            <h3>3. A free conversation</h3>
            <p>If it feels right, book a free 30-minute conversation with ${esc(coachFirst)}. No pressure, ever.</p>
          </div>
        </div>
        <div class="center" style="margin-top:14px;">
          <a class="btn btn-primary" href="/quiz">Start the short check-in</a>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="card coach-card">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <h2 style="margin-top:0;">You will be talking to a real person</h2>
            <p class="muted">
              ${esc(config.coachName)} is a certified grief coach who has supported many people through
              loss, separation, and difficult change. Warm, patient, and never clinical.
            </p>
            <a href="/about" class="btn btn-secondary" style="padding:10px 20px;">Meet ${esc(coachFirst)}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container center">
        <div class="result-invite" style="max-width:560px;margin:0 auto;">
          <h2 style="margin-top:0;">Whenever you are ready</h2>
          <p class="muted">There is no timeline for grief. This space stays open for you.</p>
          <a class="btn btn-primary" href="/quiz">Begin the check-in</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Find support after loss', body });
}

// ── Quiz page ────────────────────────────────────────────────────────────────
export function quizPage() {
  // The quiz definition is injected for the client renderer.
  const data = JSON.stringify(QUIZ);
  const body = `
    <section class="section-pad">
      <div class="container">
        <div class="quiz-wrap">
          <noscript>
            <div class="notice notice-warn">This check-in needs JavaScript. You can still
              <a href="/booking">book a free conversation</a> directly.</div>
          </noscript>
          <div class="progress" aria-hidden="true"><span id="progressBar"></span></div>
          <div id="quizRoot" aria-live="polite">
            <div class="step center">
              <h1 class="q-title">A gentle check-in</h1>
              <p class="q-help">Six short questions. Around two minutes. Whatever you feel is okay here.</p>
              <button class="btn btn-primary" id="startBtn">Begin</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <script id="quizData" type="application/json">${data}</script>
  `;
  return layout({ title: 'A gentle check-in', body, minimal: true, scripts: ['/quiz.js'] });
}

// ── About / trust page ───────────────────────────────────────────────────────
export function aboutPage() {
  const body = `
    <section class="section-pad">
      <div class="container">
        <span class="eyebrow">About</span>
        <h1>Meet ${esc(config.coachName)}</h1>
        <div class="card coach-card" style="margin:18px 0 28px;">
          <div class="coach-photo">${esc(coachInitial)}</div>
          <div style="flex:1;min-width:240px;">
            <p style="margin:0;"><strong>${esc(config.coachName)}</strong><br><span class="muted">Certified grief coach</span></p>
          </div>
        </div>

        <p>
          I came to this work the way many people do — through my own experience of loss. I learned how
          isolating grief can feel, and how much difference it makes to have one steady person who simply
          listens, without rushing you or trying to fix you.
        </p>
        <p class="muted">
          For the past several years I have walked alongside people facing the death of a loved one, the end
          of a relationship, and other life-changing losses. My approach is gentle and human. We move at
          your pace, in your words.
        </p>

        <h2>My approach</h2>
        <p class="muted">
          Grief is not a problem to be solved or an illness to be cured — it is love with nowhere to go.
          My role is not to diagnose or treat, but to offer a warm, steady presence: space to feel heard,
          to make sense of what you are carrying, and to find small, kind steps forward when you are ready.
        </p>

        <h2>What to expect in a session</h2>
        <ol class="steps-list">
          <li><strong>A warm welcome.</strong> We start gently. There is nothing you need to prepare or prove.</li>
          <li><strong>Space to be heard.</strong> You share as much or as little as you wish. I listen, fully.</li>
          <li><strong>Gentle reflection.</strong> Together we make sense of what you are feeling — no labels, no judgement.</li>
          <li><strong>A small next step.</strong> If it helps, we find one kind, manageable thing to carry you forward.</li>
        </ol>

        <div class="notice notice-info">
          Grief coaching is supportive, non-medical care. It does not replace therapy, medical, or psychiatric
          treatment. If you ever need urgent help, please reach out to a crisis line or emergency services.
        </div>

        <div class="center" style="margin-top:26px;">
          <a class="btn btn-primary" href="/quiz">Start the short check-in</a>
          <a class="btn btn-secondary" href="/booking">Book a free conversation</a>
        </div>
      </div>
    </section>
  `;
  return layout({ title: `About ${coachFirst}`, body });
}

// ── Privacy / GDPR page ──────────────────────────────────────────────────────
export function privacyPage() {
  const body = `
    <section class="section-pad">
      <div class="container">
        <span class="eyebrow">Your privacy matters</span>
        <h1>Privacy &amp; GDPR statement</h1>
        <p class="muted">Last updated: ${esc(new Date().toISOString().slice(0, 10))}</p>

        <p>
          We know that reaching out about grief means trusting us with something tender. We treat your
          information with care and in line with the EU General Data Protection Regulation (GDPR).
        </p>

        <h2>What we collect</h2>
        <p class="muted">Only what you choose to share: your name, email address, an optional phone number,
          and the answers you give in the check-in so we can offer you a relevant, caring response.</p>

        <h2>Why we collect it (lawful basis)</h2>
        <p class="muted">We process your details on the basis of your <strong>consent</strong>, given when you
          submit the check-in, solely to respond to you, offer a free conversation, and send a gentle follow-up.
          We do not sell your data or use it for advertising.</p>

        <h2>Who can see it</h2>
        <p class="muted">Your information is shared only with ${esc(config.coachName)}, your grief coach.
          It is never passed to third parties for marketing.</p>

        <h2>How long we keep it</h2>
        <p class="muted">We keep your details only as long as needed to support you, and then remove them.
          You can ask us to delete everything at any time.</p>

        <h2>Your rights</h2>
        <p class="muted">You have the right to access, correct, or erase your data, to withdraw consent, and
          to object to processing. To exercise any of these, simply email
          <a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a> and we will act promptly.</p>

        <div class="crisis-line">
          RouwKompas is grief coaching, not a medical or crisis service. In an emergency, contact your local
          emergency number or a crisis helpline.
        </div>
      </div>
    </section>
  `;
  return layout({ title: 'Privacy & GDPR', body });
}
