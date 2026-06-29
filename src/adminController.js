// Admin controller — authentication + dashboard actions.

import config from './config.js';
import {
  readBody,
  sendHtml,
  redirect,
  parseCookies,
  setCookie,
  createSession,
  destroySession,
  isValidSession,
} from './http.js';
import { listLeads, stats, updateLead, deleteLead } from './leads.js';
import { listOutbox } from './email.js';
import { safeEqual, clampString } from './util.js';
import { adminLoginPage, adminDashboardPage, adminOutboxPage } from './views/admin.js';

const COOKIE = 'rk_admin';

export function isAuthed(req) {
  const cookies = parseCookies(req);
  return isValidSession(cookies[COOKIE]);
}

export function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  redirect(res, '/admin/login');
  return false;
}

export async function showLogin(req, res) {
  if (isAuthed(req)) return redirect(res, '/admin');
  sendHtml(res, adminLoginPage({}));
}

export async function doLogin(req, res) {
  const body = await readBody(req);
  const user = clampString(body.username, 120);
  const pass = clampString(body.password, 200);

  const ok = safeEqual(user, config.admin.user) & safeEqual(pass, config.admin.password);
  if (!ok) {
    sendHtml(res, adminLoginPage({ error: 'Those details did not match. Please try again.' }), 401);
    return;
  }
  const token = createSession();
  setCookie(res, COOKIE, token, { maxAge: 60 * 60 * 8, secure: config.isProd });
  redirect(res, '/admin');
}

export async function doLogout(req, res) {
  const cookies = parseCookies(req);
  destroySession(cookies[COOKIE]);
  setCookie(res, COOKIE, '', { maxAge: 0 });
  redirect(res, '/admin/login');
}

export async function showDashboard(req, res) {
  if (!requireAuth(req, res)) return;
  const [leads, s] = await Promise.all([listLeads(), stats()]);
  sendHtml(res, adminDashboardPage({ leads, stats: s }));
}

export async function showOutbox(req, res) {
  if (!requireAuth(req, res)) return;
  const emails = await listOutbox();
  sendHtml(res, adminOutboxPage({ emails }));
}

const ALLOWED_STATUS = new Set(['new', 'contacted', 'booked', 'completed', 'archived']);

export async function updateStatus(req, res, leadId) {
  if (!requireAuth(req, res)) return;
  const body = await readBody(req);
  const status = clampString(body.status, 20);
  if (ALLOWED_STATUS.has(status)) {
    await updateLead(leadId, { status });
  }
  redirect(res, '/admin');
}

export async function removeLead(req, res, leadId) {
  if (!requireAuth(req, res)) return;
  await deleteLead(leadId);
  redirect(res, '/admin');
}
