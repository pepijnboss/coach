// Tiny HTTP helper layer built on node:http — request parsing, cookies,
// response helpers, static file serving, and an in-memory admin session store.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT_DIR } from './config.js';

const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export function sendHtml(res, html, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS });
  res.end(html);
}

export function sendJson(res, obj, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS });
  res.end(JSON.stringify(obj));
}

export function redirect(res, location, status = 302, headers = {}) {
  res.writeHead(status, { Location: location, ...headers });
  res.end();
}

export function notFound(res, html) {
  sendHtml(res, html, 404);
}

/** Read and parse a request body (json or urlencoded). Caps size at 1MB. */
export function readBody(req) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 1_000_000) {
        req.destroy();
        resolve({});
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      const type = (req.headers['content-type'] || '').toLowerCase();
      try {
        if (type.includes('application/json')) {
          resolve(raw ? JSON.parse(raw) : {});
        } else if (type.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(raw);
          resolve(Object.fromEntries(params.entries()));
        } else {
          resolve(raw ? safeJson(raw) : {});
        }
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function safeJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function setCookie(res, name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts.path || '/'}`);
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push('HttpOnly');
  parts.push('SameSite=Lax');
  if (opts.secure) parts.push('Secure');
  const existing = res.getHeader('Set-Cookie');
  const cookie = parts.join('; ');
  res.setHeader('Set-Cookie', existing ? [].concat(existing, cookie) : cookie);
}

// ── Static file serving ─────────────────────────────────────────────────────
export async function serveStatic(req, res, pathname) {
  // Prevent path traversal.
  const safe = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safe);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return true;
  }
  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) return false;
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
      ...SECURITY_HEADERS,
    });
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

// ── In-memory admin session store ───────────────────────────────────────────
const sessions = new Map(); // token -> { createdAt }
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8 hours

export function createSession() {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

export function isValidSession(token) {
  if (!token) return false;
  const s = sessions.get(token);
  if (!s) return false;
  if (Date.now() - s.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token) {
  if (token) sessions.delete(token);
}
