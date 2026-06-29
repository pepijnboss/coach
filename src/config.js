// Centralised configuration.
// Loads a local .env file (if present) without any third-party dependency,
// then exposes a typed, defaulted config object used across the app.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');

// ── Minimal .env loader ────────────────────────────────────────────────────
function loadDotEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

const env = process.env;

function bool(v, fallback = false) {
  if (v === undefined) return fallback;
  return /^(1|true|yes|on)$/i.test(String(v));
}

export const config = {
  port: parseInt(env.PORT || '3000', 10),
  nodeEnv: env.NODE_ENV || 'development',
  publicBaseUrl: (env.PUBLIC_BASE_URL || `http://localhost:${env.PORT || 3000}`).replace(/\/$/, ''),

  siteName: env.SITE_NAME || 'Ob-Audire',
  coachName: env.COACH_NAME || 'Petra Mollet',
  supportEmail: env.SUPPORT_EMAIL || 'info@ob-audire.nl',

  admin: {
    user: env.ADMIN_USER || 'admin',
    password: env.ADMIN_PASSWORD || 'change-me-please',
  },

  calendlyUrl: (env.CALENDLY_URL || '').trim(),

  email: {
    resendApiKey: (env.RESEND_API_KEY || '').trim(),
    from: env.EMAIL_FROM || 'Ob-Audire <noreply@ob-audire.nl>',
    coachNotification: (env.COACH_NOTIFICATION_EMAIL || '').trim(),
    followupDelayHours: parseFloat(env.FOLLOWUP_DELAY_HOURS || '48'),
  },

  supabase: {
    url: (env.SUPABASE_URL || '').trim(),
    serviceRoleKey: (env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
  },

  isProd: bool(env.NODE_ENV === 'production', false),
};

export default config;
