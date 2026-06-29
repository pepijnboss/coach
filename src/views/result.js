// Persoonlijke spiegeling, getoond na het achterlaten van contactgegevens.
// Server-gerenderd, zodat de pagina deelbaar is en bereikbaar vanuit de e-mail.

import content from '../content.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

const C = content;
const R = content.routes;

export function resultPage({ lead }) {
  const result = lead.result || {};
  const firstName = (lead.name || '').split(' ')[0] || 'jij';
  const paragraphs = (result.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('');
  const bookingUrl = `${R.booking}?lead=${encodeURIComponent(lead.id)}`;

  const bandLabel =
    {
      licht: 'Een zacht moment',
      merkbaar: 'Iets dat merkbaar meeweegt',
      zwaar: 'Veel om te dragen',
    }[result.band] || 'Jouw spiegeling';

  const atelierBlock = result.isAtelier
    ? `<div class="notice notice-info" style="margin-top:18px;">Meer weten over het (K)ankeratelier? <a href="${R.aanbod}#atelier">Lees hier wat je kunt verwachten →</a></div>`
    : '';

  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:640px;">
        <div class="result-head">
          <span class="result-band">${esc(bandLabel)}</span>
          <h1>${esc(result.headline || `Dankjewel, ${firstName}.`)}</h1>
        </div>

        <div class="result-body card">
          ${paragraphs}
        </div>

        <div class="result-invite">
          <h2 style="margin-top:0;">Een zachte uitnodiging</h2>
          <p class="muted">${esc(result.invitation || 'Je bent van harte welkom voor een vrijblijvend kennismakingsgesprek.')}</p>
          <a class="btn btn-primary" href="${esc(bookingUrl)}">${esc(result.ctaLabel || C.cta.book)}</a>
          <div style="margin-top:12px;">
            <a class="btn btn-secondary" href="${esc(C.externalSite.url)}" target="_blank" rel="noopener">${esc(C.cta.toSite)} ↗</a>
          </div>
        </div>

        ${atelierBlock}

        <p class="muted center" style="font-size:.9rem;">
          We hebben hiervan ook een kopie, met de link om te plannen, gestuurd naar <strong>${esc(lead.email)}</strong>.
        </p>

        <div class="notice notice-info" style="margin-top:20px;">
          Deze spiegeling is ondersteunend en niet-medisch. Ob-Audire stelt geen diagnose en biedt geen
          behandeling. Verkeer je in nood, neem dan contact op met je huisarts of een hulplijn.
        </div>

        <p class="center" style="margin-top:24px;">
          <a href="${R.about}" class="muted" style="font-size:.92rem;">Lees meer over ${esc(C.brand.coach.split(' ')[0])} →</a>
        </p>
      </div>
    </section>
  `;

  return layout({ title: 'Jouw persoonlijke spiegeling', body, minimal: true });
}
