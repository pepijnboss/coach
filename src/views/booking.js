// Booking page.
//
// If CALENDLY_URL is configured, embed the Calendly scheduler (prefilled with
// the lead's name/email when we know them). Otherwise, present a calm internal
// "request a time" form that records a booking request on the lead and is
// surfaced to the coach in the dashboard.

import config from '../config.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

export function bookingPage({ lead } = {}) {
  const firstName = lead?.name ? lead.name.split(' ')[0] : null;
  const intro = firstName
    ? `<p class="muted">Whenever you feel ready, ${esc(firstName)}, choose a time that suits you. There is no obligation, and you can change it later.</p>`
    : `<p class="muted">Choose a time that suits you for a free, 30-minute conversation. There is no obligation, and you can reschedule any time.</p>`;

  let bookingBlock;

  if (config.calendlyUrl) {
    // Build a prefilled Calendly URL.
    const url = new URL(config.calendlyUrl);
    url.searchParams.set('hide_gdpr_banner', '1');
    if (lead?.name) url.searchParams.set('name', lead.name);
    if (lead?.email) url.searchParams.set('email', lead.email);
    bookingBlock = `
      <div class="calendly-inline-widget" data-url="${esc(url.toString())}" style="min-width:320px;height:680px;"></div>
      <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
      <noscript><p class="muted">Please enable JavaScript, or email <a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a> to arrange a time.</p></noscript>
    `;
  } else {
    // Internal fallback form -> POST /api/booking-request
    bookingBlock = `
      <form id="bookingForm" class="card" novalidate>
        ${lead?.id ? `<input type="hidden" name="leadId" value="${esc(lead.id)}">` : ''}
        <div class="field">
          <label for="bk-name">Your name</label>
          <input type="text" id="bk-name" name="name" value="${esc(lead?.name || '')}" autocomplete="name" required>
          <div class="err">Please let us know your name.</div>
        </div>
        <div class="field">
          <label for="bk-email">Email</label>
          <input type="email" id="bk-email" name="email" value="${esc(lead?.email || '')}" autocomplete="email" required>
          <div class="err">Please enter a valid email.</div>
        </div>
        <div class="field">
          <label for="bk-pref">Which times tend to suit you best? <span class="hint">(optional)</span></label>
          <select id="bk-pref" name="preference">
            <option value="">No preference</option>
            <option value="weekday-morning">Weekday mornings</option>
            <option value="weekday-afternoon">Weekday afternoons</option>
            <option value="weekday-evening">Weekday evenings</option>
            <option value="weekend">Weekends</option>
          </select>
        </div>
        <div class="field">
          <label for="bk-note">Anything you would like ${esc(config.coachName.split(' ')[0])} to know beforehand? <span class="hint">(optional)</span></label>
          <textarea id="bk-note" name="note" rows="3" placeholder="Only if you feel like sharing."></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block" id="bk-submit">Request my free conversation</button>
        <p class="muted" style="font-size:.85rem;margin:14px 0 0;text-align:center;">
          ${esc(config.coachName.split(' ')[0])} will personally reply to confirm a time. No payment, no obligation.
        </p>
      </form>
      <div id="bookingDone" class="card center" style="display:none;">
        <div style="font-size:2.4rem;">🌿</div>
        <h2 style="margin-top:8px;">Thank you — your request is in.</h2>
        <p class="muted">${esc(config.coachName)} will reply personally to your email very soon to confirm a time that works for you. There is nothing more you need to do right now.</p>
        <a class="btn btn-secondary" href="/">Return home</a>
      </div>
    `;
  }

  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:680px;">
        <span class="eyebrow">A free 30-minute conversation</span>
        <h1>Schedule your free consultation</h1>
        ${intro}
        <div class="notice notice-info">This conversation is free and confidential. It is supportive grief coaching, not medical treatment.</div>
        ${bookingBlock}
      </div>
    </section>
  `;

  return layout({
    title: 'Book a free conversation',
    body,
    scripts: config.calendlyUrl ? [] : ['/booking.js'],
  });
}
