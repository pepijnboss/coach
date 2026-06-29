// E-mailservice (Ob-Audire).
//
// Twee bezorgmodi:
//   1. Resend HTTP API  — automatisch gebruikt als RESEND_API_KEY is ingesteld.
//   2. Outbox (default) — schrijft gerenderde e-mails naar data/outbox.json en
//      logt ze, zodat de volledige automatiseringsflow offline te tonen is.
//
// Sjablonen zijn warm, rustig en niet-klinisch — in Petra's toon.

import config from './config.js';
import content from './content.js';
import { JsonCollection } from './db.js';
import { uid, now, esc } from './util.js';

const outbox = new JsonCollection('outbox', { items: [] });
const R = content.routes;

// ── Bezorging ────────────────────────────────────────────────────────────────
async function deliver({ to, subject, html, text, meta }) {
  const record = {
    id: uid('mail_'),
    to,
    from: config.email.from,
    subject,
    text,
    sentAt: now(),
    via: config.email.resendApiKey ? 'resend' : 'outbox',
    meta: meta || {},
    status: 'queued',
  };

  if (config.email.resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.email.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: config.email.from, to: [to], subject, html, text }),
      });
      record.status = res.ok ? 'sent' : 'error';
      if (!res.ok) record.error = `Resend antwoordde ${res.status}`;
    } catch (err) {
      record.status = 'error';
      record.error = String(err?.message || err);
    }
  } else {
    record.status = 'sent';
  }

  await outbox.update((doc) => {
    doc.items.push(record);
  });

  if (record.status !== 'sent') console.warn(`[email] bezorgprobleem naar ${to}: ${record.error}`);
  else console.log(`[email] ${record.via} -> ${to}: "${subject}"`);
  return record;
}

export async function listOutbox() {
  const doc = await outbox.read();
  return doc.items.slice().sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
}

// ── Gedeelde lay-out ─────────────────────────────────────────────────────────
function wrap(bodyHtml) {
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#f4efe4;padding:24px 0;font-family:Georgia,'Times New Roman',serif;color:#3a322a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fcf8f1;border-radius:14px;overflow:hidden;border:1px solid #e6dcc9;">
      <tr><td style="padding:28px 36px 8px;">
        <div style="font-size:18px;letter-spacing:.5px;color:#5d6a40;font-weight:bold;">${esc(content.brand.name)}</div>
        <div style="font-size:13px;color:#938979;font-style:italic;">${esc(content.brand.tagline)}</div>
      </td></tr>
      <tr><td style="padding:8px 36px 32px;font-size:16px;line-height:1.7;">
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:20px 36px;background:#f1eadd;border-top:1px solid #e6dcc9;font-size:12px;line-height:1.6;color:#938979;font-family:Arial,sans-serif;">
        Je ontvangt deze e-mail omdat je via ${esc(content.brand.name)} om begeleiding hebt gevraagd.
        ${esc(content.brand.name)} biedt begeleiding, geen medische of psychologische behandeling.
        Verkeer je in acute nood of denk je aan zelfdoding? Bel dan direct 112 of de hulplijn 113 (0800-0113).
        <br><br>
        Je privacy telt. Je kunt altijd om verwijdering van je gegevens vragen door op deze e-mail te antwoorden.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr>
    <td style="background:#7c8a5a;border-radius:10px;">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${esc(label)}</a>
    </td></tr></table>`;
}

function bookingUrl(lead) {
  return `${config.publicBaseUrl}${R.booking}?lead=${encodeURIComponent(lead.id)}`;
}

// ── Sjabloon: e-mail 1 — direct welkom ──────────────────────────────────────
export function renderWelcome(lead) {
  const url = bookingUrl(lead);
  const firstName = (lead.name || '').split(' ')[0] || 'jij';
  const summary = lead.result?.summary || '';

  const html = wrap(`
    <p style="margin-top:0;">Lieve ${esc(firstName)},</p>
    <p>Dank je wel dat je vandaag even stil hebt gestaan bij jezelf. Dat is een zachte en moedige stap.</p>
    ${summary ? `<p style="background:#f1eadd;border-left:3px solid #7c8a5a;padding:12px 16px;border-radius:8px;font-size:14px;color:#6e645a;"><em>Wat je met ons deelde:</em><br>${esc(summary)}</p>` : ''}
    <p>Wanneer je er klaar voor bent, ben je van harte welkom voor een vrijblijvend kennismakingsgesprek met ${esc(content.brand.coach)}. Er is niets om voor te bereiden — gewoon een rustige plek om gehoord te worden.</p>
    ${button(url, 'Plan je kennismakingsgesprek')}
    <p>Geen druk en geen verplichting. Ik ben er, wanneer jij wilt.</p>
    <p>Warme groet,<br>${esc(content.brand.coach)}<br><span style="color:#938979;">${esc(content.brand.name)}</span></p>
  `);

  const text = `Lieve ${firstName},

Dank je wel dat je vandaag even stil hebt gestaan bij jezelf.

${summary ? `Wat je met ons deelde: ${summary}\n\n` : ''}Wanneer je er klaar voor bent, ben je welkom voor een vrijblijvend kennismakingsgesprek met ${content.brand.coach}.

Plan hier: ${url}

Geen druk en geen verplichting.

Warme groet,
${content.brand.coach}
${content.brand.name}`;

  return { subject: content.emails.welcomeSubject, html, text };
}

// ── Sjabloon: e-mail 2 — opvolging na 48 uur ────────────────────────────────
export function renderFollowup(lead) {
  const url = bookingUrl(lead);
  const firstName = (lead.name || '').split(' ')[0] || 'jij';

  const html = wrap(`
    <p style="margin-top:0;">Lieve ${esc(firstName)},</p>
    <p>Ik wilde even zacht bij je inchecken. Innerlijke processen hebben hun eigen ritme; er is geen tijdpad waar je je aan hoeft te houden.</p>
    <p>Als het zou helpen om te praten: een gesprek is simpelweg ruimte die van jou is — om gevoelens woorden te geven, je minder alleen te voelen, en kleine, haalbare stappen te vinden wanneer jij daar klaar voor bent. Het is geen therapie of behandeling, en jij houdt de regie over het tempo.</p>
    <p>Het eerste kennismakingsgesprek is altijd vrijblijvend.</p>
    ${button(url, 'Vind een moment dat jou past')}
    <p>En is het nu niet het juiste moment, dan is dat helemaal goed. Deze uitnodiging blijft staan.</p>
    <p>Zorg goed voor jezelf,<br>${esc(content.brand.coach)}<br><span style="color:#938979;">${esc(content.brand.name)}</span></p>
  `);

  const text = `Lieve ${firstName},

Ik wilde even zacht bij je inchecken. Innerlijke processen hebben hun eigen ritme.

Een gesprek is ruimte die van jou is. Het is geen therapie of behandeling, en jij houdt de regie over het tempo.

Het eerste kennismakingsgesprek is altijd vrijblijvend.

Vind een moment: ${url}

Is het nu niet het juiste moment, dan is dat helemaal goed. Deze uitnodiging blijft staan.

Zorg goed voor jezelf,
${content.brand.coach}
${content.brand.name}`;

  return { subject: content.emails.followupSubject, html, text };
}

// ── Sjabloon: melding aan de begeleider (intern) ────────────────────────────
export function renderCoachNotification(lead) {
  const adminUrl = `${config.publicBaseUrl}/admin`;
  const html = wrap(`
    <p style="margin-top:0;"><strong>Nieuwe aanvraag via de check-in.</strong></p>
    <p>
      <strong>Naam:</strong> ${esc(lead.name)}<br>
      <strong>E-mail:</strong> ${esc(lead.email)}<br>
      <strong>Telefoon:</strong> ${esc(lead.phone || '—')}<br>
      <strong>Binnengekomen:</strong> ${esc(lead.createdAt)}
    </p>
    <p style="background:#f1eadd;border-radius:8px;padding:12px 16px;font-size:14px;">${esc(lead.result?.summary || 'Geen samenvatting')}</p>
    ${button(adminUrl, 'Open het dashboard')}
  `);
  const text = `Nieuwe aanvraag: ${lead.name} <${lead.email}> tel: ${lead.phone || '—'}
${lead.result?.summary || ''}
Dashboard: ${adminUrl}`;
  return { subject: `Nieuwe aanvraag bij Ob-Audire: ${lead.name}`, html, text };
}

// ── High-level verzenders ────────────────────────────────────────────────────
export async function sendWelcome(lead) {
  const { subject, html, text } = renderWelcome(lead);
  return deliver({ to: lead.email, subject, html, text, meta: { kind: 'welcome', leadId: lead.id } });
}

export async function sendFollowup(lead) {
  const { subject, html, text } = renderFollowup(lead);
  return deliver({ to: lead.email, subject, html, text, meta: { kind: 'followup', leadId: lead.id } });
}

export async function sendCoachNotification(lead) {
  if (!config.email.coachNotification) return null;
  const { subject, html, text } = renderCoachNotification(lead);
  return deliver({
    to: config.email.coachNotification,
    subject,
    html,
    text,
    meta: { kind: 'coach-notification', leadId: lead.id },
  });
}
