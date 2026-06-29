// Dashboard-weergaven: inloggen en het leads-overzicht (Ob-Audire).

import config from '../config.js';
import content from '../content.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

const C = content;

const STATUS_LABEL = {
  new: 'nieuw',
  contacted: 'benaderd',
  booked: 'gepland',
  completed: 'afgerond',
  archived: 'gearchiveerd',
};

function adminLayout(inner) {
  const body = `
    <div class="admin-bar">
      <div class="container">
        <a href="/admin" style="font-family:var(--serif);font-size:1.1rem;text-decoration:none;color:#fff;">Ob-Audire · Dashboard</a>
        <a href="/admin/logout" style="font-size:.9rem;">Uitloggen</a>
      </div>
    </div>
    <section class="section-pad"><div class="container" style="max-width:1000px;">${inner}</div></section>
  `;
  return layout({ title: 'Dashboard', body, minimal: true, noindex: true });
}

export function adminLoginPage({ error } = {}) {
  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:420px;">
        <span class="eyebrow">Toegang</span>
        <h1>Inloggen</h1>
        <p class="muted">Dit gedeelte is voor ${esc(C.brand.coach)} om binnengekomen aanvragen te bekijken.</p>
        ${error ? `<div class="notice notice-warn">${esc(error)}</div>` : ''}
        <form method="POST" action="/admin/login" class="card">
          <div class="field">
            <label for="u">Gebruikersnaam</label>
            <input type="text" id="u" name="username" autocomplete="username" required>
          </div>
          <div class="field">
            <label for="p">Wachtwoord</label>
            <input type="password" id="p" name="password" autocomplete="current-password" required>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Inloggen</button>
        </form>
      </div>
    </section>
  `;
  return layout({ title: 'Inloggen', body, minimal: true, noindex: true });
}

function badge(status, hasBooking) {
  if (status === 'booked' || hasBooking) return `<span class="badge badge-booked">gepland</span>`;
  if (status === 'contacted') return `<span class="badge badge-contacted">benaderd</span>`;
  return `<span class="badge badge-new">nieuw</span>`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('nl-NL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function adminDashboardPage({ leads, stats }) {
  const rows = leads.length
    ? leads
        .map((l) => {
          const emails = l.emails || {};
          const emailFlags = [
            emails.welcomeSentAt ? 'welkom ✓' : 'welkom …',
            emails.followupSentAt
              ? 'opvolging ✓'
              : emails.followupScheduledFor
                ? `opvolging @ ${fmtDate(emails.followupScheduledFor)}`
                : 'opvolging —',
          ].join('<br>');
          const booking = l.booking
            ? `${esc(l.booking.type === 'internal-request' ? 'aanvraag' : l.booking.type || 'aanvraag')}${l.booking.preference ? ' · ' + esc(l.booking.preference) : ''}`
            : '—';
          const statusOptions = Object.entries(STATUS_LABEL)
            .map(([v, lab]) => `<option value="${v}" ${l.status === v ? 'selected' : ''}>${lab}</option>`)
            .join('');
          return `
          <tr>
            <td>
              <strong>${esc(l.name)}</strong><br>
              <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>
              ${l.phone ? `<br><span class="muted">${esc(l.phone)}</span>` : ''}
            </td>
            <td>${badge(l.status, !!l.booking)}</td>
            <td style="max-width:280px;"><span class="muted" style="font-size:.86rem;">${esc(l.result?.summary || '—')}</span></td>
            <td style="font-size:.82rem;">${emailFlags}</td>
            <td style="font-size:.86rem;">${booking}</td>
            <td style="white-space:nowrap;font-size:.84rem;">${fmtDate(l.createdAt)}</td>
            <td>
              <form method="POST" action="/admin/leads/${esc(l.id)}/status" style="margin:0 0 6px;">
                <select name="status" onchange="this.form.submit()" style="font-size:.82rem;padding:6px 8px;">
                  ${statusOptions}
                </select>
              </form>
              <form method="POST" action="/admin/leads/${esc(l.id)}/delete" onsubmit="return confirm('Deze lead definitief verwijderen? Dit ondersteunt het AVG-recht op verwijdering.');" style="margin:0;">
                <button class="link-btn" style="color:var(--danger);padding:2px 0;font-size:.8rem;">Verwijderen (AVG)</button>
              </form>
            </td>
          </tr>`;
        })
        .join('')
    : `<tr><td colspan="7" class="center muted" style="padding:40px;">Nog geen aanvragen. Zodra iemand de check-in invult, verschijnt diegene hier.</td></tr>`;

  const inner = `
    <h1 style="margin-top:0;">Aanvragen</h1>
    <p class="muted">Alle aanvragen komen bij <strong>${esc(C.brand.coach)}</strong> terecht. Nieuwe mensen verschijnen als <em>nieuw</em>; werk de status bij naarmate je contact opneemt.</p>

    <div class="stat-grid">
      <div class="stat"><div class="num">${stats.total}</div><div class="lbl">Totaal</div></div>
      <div class="stat"><div class="num">${stats.new}</div><div class="lbl">Nieuw</div></div>
      <div class="stat"><div class="num">${stats.booked}</div><div class="lbl">Gepland</div></div>
      <div class="stat"><div class="num">${stats.last7Days}</div><div class="lbl">Laatste 7 dagen</div></div>
    </div>

    <div class="table-scroll">
      <table class="leads">
        <thead>
          <tr><th>Persoon</th><th>Status</th><th>Wat diegene deelde</th><th>E-mails</th><th>Afspraak</th><th>Binnengekomen</th><th>Acties</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <p class="muted" style="margin-top:24px;font-size:.85rem;">
      E-mailmodus: <strong>${config.email.resendApiKey ? 'Resend (live)' : 'Outbox (demo)'}</strong> ·
      Afsprakenmodus: <strong>${config.calendlyUrl ? 'Calendly' : 'Intern aanvraagformulier'}</strong>.
      ${config.email.resendApiKey ? '' : 'Stel RESEND_API_KEY in om echte e-mails te versturen. '}
      <a href="/admin/outbox" style="display:inline;">Bekijk de e-mail-outbox →</a>
    </p>
  `;
  return adminLayout(inner);
}

export function adminOutboxPage({ emails }) {
  const KIND = { welcome: 'welkom', followup: 'opvolging', 'coach-notification': 'melding aan coach' };
  const rows = emails.length
    ? emails
        .map(
          (m) => `
        <tr>
          <td style="white-space:nowrap;font-size:.82rem;">${fmtDate(m.sentAt)}</td>
          <td><span class="badge ${m.status === 'sent' ? 'badge-booked' : 'badge-contacted'}">${esc(m.status === 'sent' ? 'verstuurd' : m.status)}</span></td>
          <td>${esc(KIND[m.meta?.kind] || m.meta?.kind || '—')}</td>
          <td>${esc(m.to)}</td>
          <td style="max-width:320px;"><span class="muted" style="font-size:.86rem;">${esc(m.subject)}</span></td>
          <td style="font-size:.8rem;">${esc(m.via)}</td>
        </tr>`
        )
        .join('')
    : `<tr><td colspan="6" class="center muted" style="padding:40px;">Er zijn nog geen e-mails verstuurd.</td></tr>`;

  const inner = `
    <a href="/admin" class="muted" style="text-decoration:none;font-size:.9rem;">← Terug naar aanvragen</a>
    <h1 style="margin-top:10px;">E-mail-outbox</h1>
    <p class="muted">Elke welkomst-, opvolg- en meldingsmail wordt hier gelogd voor transparantie en controle.</p>
    <div class="table-scroll">
      <table class="leads">
        <thead><tr><th>Wanneer</th><th>Status</th><th>Soort</th><th>Aan</th><th>Onderwerp</th><th>Via</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  return adminLayout(inner);
}
