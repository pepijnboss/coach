// Personalised result page, shown after lead capture.
// Server-rendered so it is shareable and reachable from the welcome email.

import config from '../config.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

export function resultPage({ lead }) {
  const result = lead.result || {};
  const firstName = (lead.name || '').split(' ')[0] || 'there';
  const paragraphs = (result.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('');
  const bookingUrl = `/booking?lead=${encodeURIComponent(lead.id)}`;

  const bandLabel = {
    tender: 'A gentle moment',
    heavy: 'Carrying something heavy',
    overwhelming: 'A lot to hold right now',
  }[result.band] || 'Your reflection';

  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:640px;">
        <div class="result-head">
          <span class="result-band">${esc(bandLabel)}</span>
          <h1>${esc(result.headline || `Thank you, ${firstName}.`)}</h1>
        </div>

        <div class="result-body card">
          ${paragraphs}
        </div>

        <div class="result-invite">
          <h2 style="margin-top:0;">${esc(result.invitation ? 'A gentle invitation' : 'Whenever you are ready')}</h2>
          <p class="muted">${esc(result.invitation || 'You are warmly invited to a free, no-obligation 30-minute conversation.')}</p>
          <a class="btn btn-primary" href="${esc(bookingUrl)}">${esc(result.ctaLabel || 'Book a free 30-minute conversation')}</a>
        </div>

        <p class="muted center" style="font-size:.9rem;">
          We have also sent a copy of this, with your booking link, to <strong>${esc(lead.email)}</strong>.
        </p>

        <div class="notice notice-info" style="margin-top:20px;">
          This reflection is supportive and non-medical. ${esc(config.siteName)} does not provide diagnosis or
          treatment. If you are in crisis, please contact a crisis line or emergency services.
        </div>

        <p class="center" style="margin-top:24px;">
          <a href="/about" class="muted" style="font-size:.92rem;">Read more about ${esc(config.coachName.split(' ')[0])} →</a>
        </p>
      </div>
    </section>
  `;

  return layout({ title: 'Your gentle reflection', body, minimal: true });
}
