// Email service.
//
// Sends transactional + follow-up emails. Two delivery modes:
//   1. Resend HTTP API  — used automatically when RESEND_API_KEY is set.
//   2. Outbox (default) — appends rendered emails to data/outbox.json and logs
//      them. This keeps the full automation flow demonstrable with no network
//      and no third-party account, while remaining trivially swappable.
//
// Templates are warm, calm, and non-clinical — matching the platform tone.

import config from './config.js';
import { JsonCollection } from './db.js';
import { uid, now, esc } from './util.js';

const outbox = new JsonCollection('outbox', { items: [] });

// ── Delivery ────────────────────────────────────────────────────────────────
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
        body: JSON.stringify({
          from: config.email.from,
          to: [to],
          subject,
          html,
          text,
        }),
      });
      record.status = res.ok ? 'sent' : 'error';
      if (!res.ok) record.error = `Resend responded ${res.status}`;
    } catch (err) {
      record.status = 'error';
      record.error = String(err?.message || err);
    }
  } else {
    record.status = 'sent';
  }

  // Always persist to the outbox for auditability (and as the only sink in
  // demo mode). Errors are recorded but never crash the request flow.
  await outbox.update((doc) => {
    doc.items.push(record);
  });

  if (record.status !== 'sent') {
    console.warn(`[email] delivery problem to ${to}: ${record.error}`);
  } else {
    console.log(`[email] ${record.via} -> ${to}: "${subject}"`);
  }
  return record;
}

export async function listOutbox() {
  const doc = await outbox.read();
  return doc.items.slice().sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
}

// ── Shared layout ─────────────────────────────────────────────────────────
function wrap(bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#f4efe7;padding:24px 0;font-family:Georgia,'Times New Roman',serif;color:#3a3633;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fbf8f2;border-radius:14px;overflow:hidden;border:1px solid #e7ded0;">
      <tr><td style="padding:28px 36px 8px;">
        <div style="font-size:18px;letter-spacing:.5px;color:#7c9885;font-weight:bold;">${esc(config.siteName)}</div>
      </td></tr>
      <tr><td style="padding:8px 36px 32px;font-size:16px;line-height:1.7;">
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:20px 36px;background:#f1eadd;border-top:1px solid #e7ded0;font-size:12px;line-height:1.6;color:#8a847c;font-family:Arial,sans-serif;">
        You receive this because you asked for support via ${esc(config.siteName)}.
        ${esc(config.siteName)} offers grief coaching, which is not medical or psychological treatment.
        If you are in crisis or thinking about harming yourself, please contact your local emergency number or a crisis line right away.
        <br><br>
        Your privacy matters. You can ask us to delete your data at any time by replying to this email.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr>
    <td style="background:#7c9885;border-radius:10px;">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${esc(label)}</a>
    </td></tr></table>`;
}

// ── Template: Email 1 — immediate welcome ───────────────────────────────────
export function renderWelcome(lead) {
  const bookingUrl = `${config.publicBaseUrl}/booking?lead=${encodeURIComponent(lead.id)}`;
  const firstName = (lead.name || '').split(' ')[0] || 'there';
  const summary = lead.result?.summary || '';

  const html = wrap(`
    <p style="margin-top:0;">Dear ${esc(firstName)},</p>
    <p>Thank you for taking a quiet moment to check in with yourself today. That is a gentle and brave thing to do.</p>
    ${summary ? `<p style="background:#f1eadd;border-left:3px solid #7c9885;padding:12px 16px;border-radius:8px;font-size:14px;color:#5b554d;"><em>What you shared with us:</em><br>${esc(summary)}</p>` : ''}
    <p>Whenever you feel ready, you are warmly invited to a free, 30-minute conversation with ${esc(config.coachName)}. There is nothing to prepare — just a calm space to be heard.</p>
    ${button(bookingUrl, 'Book your free conversation')}
    <p>There is no pressure and no obligation. We are simply here when you need us.</p>
    <p>Warmly,<br>${esc(config.coachName)}<br><span style="color:#8a847c;">${esc(config.siteName)}</span></p>
  `);

  const text = `Dear ${firstName},

Thank you for taking a quiet moment to check in with yourself today.

${summary ? `What you shared with us: ${summary}\n\n` : ''}Whenever you feel ready, you are warmly invited to a free 30-minute conversation with ${config.coachName}.

Book here: ${bookingUrl}

There is no pressure and no obligation.

Warmly,
${config.coachName}
${config.siteName}`;

  return { subject: `A gentle hello from ${config.siteName}`, html, text };
}

// ── Template: Email 2 — 48h follow-up ───────────────────────────────────────
export function renderFollowup(lead) {
  const bookingUrl = `${config.publicBaseUrl}/booking?lead=${encodeURIComponent(lead.id)}`;
  const firstName = (lead.name || '').split(' ')[0] || 'there';

  const html = wrap(`
    <p style="margin-top:0;">Dear ${esc(firstName)},</p>
    <p>I wanted to gently check in. Grief has its own rhythm, and there is no timeline you need to keep up with.</p>
    <p>If it would help to talk, a grief coaching conversation is simply space that belongs to you — to put feelings into words, to feel less alone, and to find small, manageable steps when you are ready for them. It is not therapy or treatment, and you stay in charge of the pace throughout.</p>
    <p>The first 30-minute conversation is always free.</p>
    ${button(bookingUrl, 'Find a time that suits you')}
    <p>And if now is not the right moment, that is completely okay. This invitation stays open.</p>
    <p>Take good care of yourself,<br>${esc(config.coachName)}<br><span style="color:#8a847c;">${esc(config.siteName)}</span></p>
  `);

  const text = `Dear ${firstName},

I wanted to gently check in. Grief has its own rhythm, and there is no timeline you need to keep up with.

If it would help to talk, a grief coaching conversation is space that belongs to you. It is not therapy or treatment, and you stay in charge of the pace.

The first 30-minute conversation is always free.

Find a time: ${bookingUrl}

And if now is not the right moment, that is completely okay. This invitation stays open.

Take good care of yourself,
${config.coachName}
${config.siteName}`;

  return { subject: 'Still here for you, whenever you are ready', html, text };
}

// ── Template: coach notification (internal) ─────────────────────────────────
export function renderCoachNotification(lead) {
  const adminUrl = `${config.publicBaseUrl}/admin`;
  const html = wrap(`
    <p style="margin-top:0;"><strong>New lead from the intake quiz.</strong></p>
    <p>
      <strong>Name:</strong> ${esc(lead.name)}<br>
      <strong>Email:</strong> ${esc(lead.email)}<br>
      <strong>Phone:</strong> ${esc(lead.phone || '—')}<br>
      <strong>Received:</strong> ${esc(lead.createdAt)}
    </p>
    <p style="background:#f1eadd;border-radius:8px;padding:12px 16px;font-size:14px;">${esc(lead.result?.summary || 'No summary')}</p>
    ${button(adminUrl, 'Open the leads dashboard')}
  `);
  const text = `New lead: ${lead.name} <${lead.email}> phone: ${lead.phone || '—'}
${lead.result?.summary || ''}
Dashboard: ${adminUrl}`;
  return { subject: `New RouwKompas lead: ${lead.name}`, html, text };
}

// ── High-level send helpers ─────────────────────────────────────────────────
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
