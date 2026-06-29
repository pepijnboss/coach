// Admin dashboard views: a login screen and the leads dashboard.

import config from '../config.js';
import { layout } from './layout.js';
import { esc } from '../util.js';

function adminLayout(inner) {
  const body = `
    <div class="admin-bar">
      <div class="container">
        <a href="/admin" style="font-family:var(--serif);font-size:1.1rem;text-decoration:none;color:#fff;">RouwKompas · Coach dashboard</a>
        <a href="/admin/logout" style="font-size:.9rem;">Sign out</a>
      </div>
    </div>
    <section class="section-pad"><div class="container" style="max-width:1000px;">${inner}</div></section>
  `;
  return layout({ title: 'Coach dashboard', body, minimal: true });
}

export function adminLoginPage({ error } = {}) {
  const body = `
    <section class="section-pad">
      <div class="container" style="max-width:420px;">
        <span class="eyebrow">Coach access</span>
        <h1>Sign in</h1>
        <p class="muted">This area is for ${esc(config.coachName)} to view incoming leads.</p>
        ${error ? `<div class="notice notice-warn">${esc(error)}</div>` : ''}
        <form method="POST" action="/admin/login" class="card">
          <div class="field">
            <label for="u">Username</label>
            <input type="text" id="u" name="username" autocomplete="username" required>
          </div>
          <div class="field">
            <label for="p">Password</label>
            <input type="password" id="p" name="password" autocomplete="current-password" required>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    </section>
  `;
  return layout({ title: 'Coach sign in', body, minimal: true });
}

function badge(status, hasBooking) {
  if (status === 'booked' || hasBooking) return `<span class="badge badge-booked">booked</span>`;
  if (status === 'contacted') return `<span class="badge badge-contacted">contacted</span>`;
  return `<span class="badge badge-new">new</span>`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function adminDashboardPage({ leads, stats }) {
  const rows = leads.length
    ? leads
        .map((l) => {
          const emails = l.emails || {};
          const emailFlags = [
            emails.welcomeSentAt ? 'welcome ✓' : 'welcome …',
            emails.followupSentAt
              ? 'follow-up ✓'
              : emails.followupScheduledFor
                ? `follow-up @ ${fmtDate(emails.followupScheduledFor)}`
                : 'follow-up —',
          ].join('<br>');
          const booking = l.booking
            ? `${esc(l.booking.type || 'request')}${l.booking.preference ? ' · ' + esc(l.booking.preference) : ''}`
            : '—';
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
                  <option value="new" ${l.status === 'new' ? 'selected' : ''}>new</option>
                  <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>contacted</option>
                  <option value="booked" ${l.status === 'booked' ? 'selected' : ''}>booked</option>
                  <option value="completed" ${l.status === 'completed' ? 'selected' : ''}>completed</option>
                  <option value="archived" ${l.status === 'archived' ? 'selected' : ''}>archived</option>
                </select>
              </form>
              <form method="POST" action="/admin/leads/${esc(l.id)}/delete" onsubmit="return confirm('Permanently delete this lead? This supports the person\\'s GDPR right to erasure.');" style="margin:0;">
                <button class="link-btn" style="color:var(--danger);padding:2px 0;font-size:.8rem;">Delete (GDPR)</button>
              </form>
            </td>
          </tr>`;
        })
        .join('')
    : `<tr><td colspan="7" class="center muted" style="padding:40px;">No leads yet. When someone completes the check-in, they will appear here.</td></tr>`;

  const inner = `
    <h1 style="margin-top:0;">Leads</h1>
    <p class="muted">All leads route to <strong>${esc(config.coachName)}</strong>. New people first appear as <em>new</em>; update their status as you reach out.</p>

    <div class="stat-grid">
      <div class="stat"><div class="num">${stats.total}</div><div class="lbl">Total leads</div></div>
      <div class="stat"><div class="num">${stats.new}</div><div class="lbl">New</div></div>
      <div class="stat"><div class="num">${stats.booked}</div><div class="lbl">Booked</div></div>
      <div class="stat"><div class="num">${stats.last7Days}</div><div class="lbl">Last 7 days</div></div>
    </div>

    <div class="table-scroll">
      <table class="leads">
        <thead>
          <tr><th>Person</th><th>Status</th><th>What they shared</th><th>Emails</th><th>Booking</th><th>Received</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <p class="muted" style="margin-top:24px;font-size:.85rem;">
      Email delivery mode: <strong>${config.email.resendApiKey ? 'Resend (live)' : 'Outbox (demo)'}</strong> ·
      Booking mode: <strong>${config.calendlyUrl ? 'Calendly' : 'Internal request form'}</strong>.
      ${config.email.resendApiKey ? '' : 'Set RESEND_API_KEY to send real emails. '}
      <a href="/admin/outbox" style="display:inline;">View email outbox →</a>
    </p>
  `;
  return adminLayout(inner);
}

export function adminOutboxPage({ emails }) {
  const rows = emails.length
    ? emails
        .map(
          (m) => `
        <tr>
          <td style="white-space:nowrap;font-size:.82rem;">${fmtDate(m.sentAt)}</td>
          <td><span class="badge ${m.status === 'sent' ? 'badge-booked' : 'badge-contacted'}">${esc(m.status)}</span></td>
          <td>${esc(m.meta?.kind || '—')}</td>
          <td>${esc(m.to)}</td>
          <td style="max-width:320px;"><span class="muted" style="font-size:.86rem;">${esc(m.subject)}</span></td>
          <td style="font-size:.8rem;">${esc(m.via)}</td>
        </tr>`
        )
        .join('')
    : `<tr><td colspan="6" class="center muted" style="padding:40px;">No emails have been sent yet.</td></tr>`;

  const inner = `
    <a href="/admin" class="muted" style="text-decoration:none;font-size:.9rem;">← Back to leads</a>
    <h1 style="margin-top:10px;">Email outbox</h1>
    <p class="muted">Every welcome, follow-up, and coach notification is logged here for transparency and auditing.</p>
    <div class="table-scroll">
      <table class="leads">
        <thead><tr><th>When</th><th>Status</th><th>Type</th><th>To</th><th>Subject</th><th>Via</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  return adminLayout(inner);
}
