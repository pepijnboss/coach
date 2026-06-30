// Gedeelde HTML-schil voor elke publieke pagina (Ob-Audire).

import config from '../config.js';
import content from '../content.js';
import { esc } from '../util.js';

const R = content.routes;

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.body      inner HTML
 * @param {string} [opts.description]
 * @param {string} [opts.bodyClass]
 * @param {string[]} [opts.scripts]
 * @param {boolean} [opts.minimal]  verberg nav (gefocuste check-in-flow)
 * @param {boolean} [opts.noindex]  zet robots op noindex (admin/resultaat)
 * @param {string} [opts.head]      extra <head>-HTML (bijv. JSON-LD)
 */
export function layout({ title, body, description, bodyClass = '', scripts = [], minimal = false, noindex = false, head = '' }) {
  const fullTitle = `${title} · ${content.brand.name}`;
  const desc = description || content.brand.essence;
  const year = new Date().getFullYear();
  const robots = noindex ? 'noindex,nofollow' : 'index,follow';
  const analytics = config.plausibleDomain
    ? `<script defer data-domain="${esc(config.plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`
    : '';

  const header = minimal
    ? `<header class="site-header"><div class="container"><a class="brand" href="${R.home}">Coach<span>Kompas</span></a><a href="${R.home}" class="muted" style="text-decoration:none;font-size:.9rem;">Sluiten</a></div></header>`
    : `<header class="site-header">
        <div class="container">
          <a class="brand" href="${R.home}">Coach<span>Kompas</span></a>
          <nav class="nav">
            <a href="${R.home}#hoe">Hoe het werkt</a>
            <a href="${R.about}">Over Petra</a>
            <a href="${content.externalSite.url}" target="_blank" rel="noopener">${esc(content.externalSite.label)} ↗</a>
            <a class="btn btn-primary nav-cta" href="${R.quiz}">${esc(content.cta.primary)}</a>
          </nav>
        </div>
      </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="cols">
          <div>
            <a class="brand" href="${R.home}" style="font-size:1.1rem;">Coach<span>Kompas</span></a>
            <p class="muted" style="margin-top:10px;font-size:.92rem;max-width:36ch;">${esc(content.brand.tagline)}. CoachKompas verbindt je met begeleiding van ${esc(content.practice.coach)} (${esc(content.practice.name)}) — geen medische of psychologische behandeling.</p>
          </div>
          <div>
            <strong style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Ontdek</strong>
            <a href="${R.quiz}">Doe de check-in</a>
            <a href="${R.booking}">Plan een gesprek</a>
            <a href="${R.about}">Over Petra</a>
            <a href="${content.externalSite.url}" target="_blank" rel="noopener">Website Ob-Audire ↗</a>
          </div>
          <div>
            <strong style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Contact</strong>
            <a href="mailto:${esc(content.contact.email)}">${esc(content.contact.email)}</a>
            <a href="tel:${esc(content.contact.phone.replace(/\s|-/g, ''))}">${esc(content.contact.phone)}</a>
            <a href="${R.privacy}">Privacy &amp; AVG</a>
          </div>
        </div>
        <div class="crisis-line">
          CoachKompas is een aanmeldpunt en is geen crisis- of hulpdienst. Verkeer je in acute nood of denk je aan zelfdoding? Bel dan 112, of de hulplijn 113 (113.nl, ook telefonisch via 0800-0113).
        </div>
        <p class="legal">© ${year} ${esc(content.brand.name)} · verbindt je met ${esc(content.practice.coach)} (${esc(content.practice.name)}). ${esc(content.contact.region)}. Begeleiding is geen medische, psychologische of psychiatrische behandeling. Je gegevens worden verwerkt volgens de AVG — zie de <a href="${R.privacy}" style="display:inline;">privacyverklaring</a>.</p>
      </div>
    </footer>`;

  const scriptTags = scripts.map((s) => `<script src="${esc(s)}" defer></script>`).join('\n');

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="${robots}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="nl_NL">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%237c8a5a'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='Georgia'>CK</text></svg>">
  <link rel="stylesheet" href="/styles.css">
  ${analytics}
  ${head}
</head>
<body class="${esc(bodyClass)}">
  ${header}
  <main>${body}</main>
  ${footer}
  ${scriptTags}
</body>
</html>`;
}
