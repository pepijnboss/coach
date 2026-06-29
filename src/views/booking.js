// Afspraak-pagina (Ob-Audire).
//
// Met CALENDLY_URL ingesteld: embed de Calendly-planner (voorgevuld met naam/
// e-mail als we die kennen). Anders: een rustig intern "vraag een gesprek aan"-
// formulier dat het verzoek vastlegt op de lead en zichtbaar wordt in het
// dashboard. Daarnaast altijd de directe contactgegevens van Petra.

import config from '../config.js';
import content from '../content.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

const C = content;
const R = content.routes;
const coachFirst = C.brand.coach.split(' ')[0];

export function bookingPage({ lead } = {}) {
  const firstName = lead?.name ? lead.name.split(' ')[0] : null;
  const intro = firstName
    ? `<p class="muted">Wanneer je er klaar voor bent, ${esc(firstName)}, kies je een moment dat jou past. Vrijblijvend, en je kunt het altijd wijzigen.</p>`
    : `<p class="muted">Kies een moment dat jou past voor een vrijblijvend kennismakingsgesprek. Geen verplichting, en je kunt het altijd verzetten.</p>`;

  const contactBlock = `
    <div class="card" style="margin-bottom:18px;">
      <h3 style="margin-top:0;">Liever direct contact?</h3>
      <p class="muted" style="margin-bottom:8px;">Je bent van harte welkom om te bellen of te mailen.</p>
      <p style="margin:0;">
        📞 <a href="tel:${esc(C.contact.phone.replace(/\s|-/g, ''))}">${esc(C.contact.phone)}</a><br>
        ✉️ <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a><br>
        <span class="muted" style="font-size:.9rem;">${esc(C.contact.region)} · ${esc(C.contact.workArea)}</span>
      </p>
    </div>`;

  let bookingBlock;

  if (config.calendlyUrl) {
    const url = new URL(config.calendlyUrl);
    url.searchParams.set('hide_gdpr_banner', '1');
    if (lead?.name) url.searchParams.set('name', lead.name);
    if (lead?.email) url.searchParams.set('email', lead.email);
    bookingBlock = `
      <div class="calendly-inline-widget" data-url="${esc(url.toString())}" style="min-width:320px;height:680px;"></div>
      <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
      <noscript><p class="muted">Zet JavaScript aan, of mail naar <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a> om een moment af te spreken.</p></noscript>
    `;
  } else {
    bookingBlock = `
      <form id="bookingForm" class="card" novalidate>
        ${lead?.id ? `<input type="hidden" name="leadId" value="${esc(lead.id)}">` : ''}
        <div class="field">
          <label for="bk-name">Je naam</label>
          <input type="text" id="bk-name" name="name" value="${esc(lead?.name || '')}" autocomplete="name" required>
          <div class="err">Laat ons weten hoe we je mogen noemen.</div>
        </div>
        <div class="field">
          <label for="bk-email">E-mailadres</label>
          <input type="email" id="bk-email" name="email" value="${esc(lead?.email || '')}" autocomplete="email" required>
          <div class="err">Vul een geldig e-mailadres in.</div>
        </div>
        <div class="field">
          <label for="bk-pref">Welke momenten passen je meestal het best? <span class="hint">(optioneel)</span></label>
          <select id="bk-pref" name="preference">
            <option value="">Geen voorkeur</option>
            <option value="doordeweeks-ochtend">Doordeweeks, ochtend</option>
            <option value="doordeweeks-middag">Doordeweeks, middag</option>
            <option value="doordeweeks-avond">Doordeweeks, avond</option>
            <option value="weekend">In het weekend</option>
          </select>
        </div>
        <div class="field">
          <label for="bk-note">Iets dat je ${esc(coachFirst)} vooraf wilt laten weten? <span class="hint">(optioneel)</span></label>
          <textarea id="bk-note" name="note" rows="3" placeholder="Alleen als je daar behoefte aan hebt."></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block" id="bk-submit">Vraag mijn kennismakingsgesprek aan</button>
        <p class="muted" style="font-size:.85rem;margin:14px 0 0;text-align:center;">
          ${esc(coachFirst)} reageert persoonlijk om een moment af te stemmen. Geen betaling, geen verplichting.
        </p>
      </form>
      <div id="bookingDone" class="card center" style="display:none;">
        <div style="font-size:2.4rem;">🌿</div>
        <h2 style="margin-top:8px;">Dankjewel — je aanvraag is binnen.</h2>
        <p class="muted">${esc(C.brand.coach)} reageert persoonlijk op je e-mail om snel een moment af te stemmen dat bij jou past. Je hoeft nu verder niets te doen.</p>
        <a class="btn btn-secondary" href="${R.home}">Terug naar de startpagina</a>
      </div>
    `;
  }

  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:680px;">
        <span class="eyebrow">Een vrijblijvend kennismakingsgesprek</span>
        <h1>Plan je kennismaking</h1>
        ${intro}
        <div class="notice notice-info">Dit gesprek is vrijblijvend en vertrouwelijk. Het is ondersteunende begeleiding, geen medische behandeling.</div>
        ${contactBlock}
        ${bookingBlock}
      </div>
    </section>
  `;

  return layout({
    title: 'Plan een kennismakingsgesprek',
    body,
    scripts: config.calendlyUrl ? [] : ['/booking.js'],
  });
}
