// HTML shell shared by every public page.

import config from '../config.js';
import { esc } from '../util.js';

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.body      inner HTML
 * @param {string} [opts.description]
 * @param {string} [opts.bodyClass]
 * @param {string[]} [opts.scripts]  paths to client scripts
 * @param {boolean} [opts.minimal]   hide nav (used for focused quiz flow)
 */
export function layout({ title, body, description, bodyClass = '', scripts = [], minimal = false }) {
  const fullTitle = `${title} · ${config.siteName}`;
  const desc = description || 'Warm, calm support after loss. A free, no-obligation conversation with a certified grief coach.';
  const year = new Date().getFullYear();

  const header = minimal
    ? `<header class="site-header"><div class="container"><a class="brand" href="/">Rouw<span>Kompas</span></a><a href="/" class="nav-link muted" style="text-decoration:none;font-size:.9rem;">Save &amp; exit</a></div></header>`
    : `<header class="site-header">
        <div class="container">
          <a class="brand" href="/">Rouw<span>Kompas</span></a>
          <nav class="nav">
            <a href="/#how">How it works</a>
            <a href="/about">About ${esc(config.coachName.split(' ')[0])}</a>
            <a href="/privacy">Privacy</a>
            <a class="btn btn-primary nav-cta" href="/quiz">Start check-in</a>
          </nav>
        </div>
      </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="cols">
          <div>
            <a class="brand" href="/" style="font-size:1.1rem;">Rouw<span>Kompas</span></a>
            <p class="muted" style="margin-top:10px;font-size:.92rem;max-width:34ch;">A calm, supportive space for anyone living with grief or loss. Coaching, not medical treatment.</p>
          </div>
          <div>
            <strong style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Explore</strong>
            <a href="/quiz">Start the check-in</a>
            <a href="/booking">Book a conversation</a>
            <a href="/about">About the coach</a>
          </div>
          <div>
            <strong style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Trust</strong>
            <a href="/privacy">Privacy &amp; GDPR</a>
            <a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a>
          </div>
        </div>
        <div class="crisis-line">
          If you are in immediate crisis or thinking about harming yourself, please contact your local emergency number or a crisis helpline now. RouwKompas is grief coaching and is not a crisis or emergency service.
        </div>
        <p class="legal">© ${year} ${esc(config.siteName)}. Grief coaching is not medical, psychological, or psychiatric treatment. Your data is handled in line with the GDPR — see our <a href="/privacy" style="display:inline;">privacy statement</a>.</p>
      </div>
    </footer>`;

  const scriptTags = scripts.map((s) => `<script src="${esc(s)}" defer></script>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%237c9885'/><text x='50' y='66' font-size='52' text-anchor='middle' fill='white' font-family='Georgia'>R</text></svg>">
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="${esc(bodyClass)}">
  ${header}
  <main>${body}</main>
  ${footer}
  ${scriptTags}
</body>
</html>`;
}
