// Small shared helpers — no dependencies.

import crypto from 'node:crypto';

export function uid(prefix = '') {
  // Short, URL-safe, sortable-ish id.
  const rand = crypto.randomBytes(8).toString('hex');
  const time = Date.now().toString(36);
  return `${prefix}${time}${rand}`;
}

export function now() {
  return new Date().toISOString();
}

const HTML_ESCAPE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a value for safe interpolation into HTML text/attributes. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPE[c]);
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  // Pragmatic, not RFC-perfect: one @, a dot in the domain, no spaces.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone) return true; // optional
  return /^[+()\d][\d\s().-]{5,20}$/.test(String(phone).trim());
}

/** Constant-time string comparison to avoid timing attacks on credentials. */
export function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) {
    // Still run a comparison to keep timing flat.
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

export function clampString(value, max = 2000) {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}

export function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
}
