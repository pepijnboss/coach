// Build a STATIC preview of the site into /preview so it can be viewed by
// simply opening the .html files in a browser — no server required.
//
// It renders the real view functions, then rewrites server routes to local
// .html files and absolute asset paths to relative ones. The quiz's final
// submit needs the live server, but every page looks exactly as it will live.
//
// Usage: npm run preview:build   (or: node scripts/build-preview.mjs)

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { landingPage, quizPage, aboutPage, privacyPage } from '../src/views/pages.js';
import { bookingPage } from '../src/views/booking.js';
import { resultPage } from '../src/views/result.js';
import { adminLoginPage, adminDashboardPage } from '../src/views/admin.js';
import { generateResult } from '../src/quiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'preview');

// Map server routes -> static file names.
const routeMap = {
  '/': 'index.html',
  '/quiz': 'quiz.html',
  '/about': 'about.html',
  '/privacy': 'privacy.html',
  '/booking': 'booking.html',
};

const assetSet = new Set(['/styles.css', '/quiz.js', '/booking.js']);

function rewriteValue(val) {
  if (!val.startsWith('/')) return val; // external, mailto, data:, anchors handled below
  // split off query/hash
  const [pathPart, rest = ''] = val.split(/(?=[?#])/, 2).length === 2 ? [val.slice(0, val.search(/[?#]/)), val.slice(val.search(/[?#]/))] : [val, ''];
  if (assetSet.has(pathPart)) return pathPart.slice(1) + rest;
  if (pathPart.startsWith('/result/')) return 'result.html' + (rest.startsWith('#') ? rest : '');
  if (pathPart === '/booking') return 'booking.html';
  if (routeMap[pathPart]) {
    const file = routeMap[pathPart];
    return pathPart === '/' && rest.startsWith('#') ? 'index.html' + rest : file + (rest.startsWith('#') ? rest : '');
  }
  if (pathPart === '/') return 'index.html' + rest;
  // /#how style anchors
  if (val.startsWith('/#')) return 'index.html' + val.slice(1);
  // admin etc — leave pointing to a note
  return pathPart.slice(1) + rest;
}

function rewrite(html) {
  // Rewrite href="..." and src="..." attribute values.
  let out = html.replace(/\b(href|src)="([^"]*)"/g, (m, attr, val) => `${attr}="${rewriteValue(val)}"`);
  // Add a small banner so it's obvious this is a static preview.
  const banner = `<div style="background:#7c9885;color:#fff;font-family:Arial,sans-serif;font-size:.85rem;text-align:center;padding:8px 14px;">Static preview — the interactive quiz submit, emails and admin need the live server (run <code style="background:rgba(255,255,255,.2);padding:1px 5px;border-radius:4px;">node server.js</code>).</div>`;
  out = out.replace(/(<body[^>]*>)/, `$1${banner}`);
  return out;
}

async function main() {
  await fsp.rm(OUT, { recursive: true, force: true });
  await fsp.mkdir(OUT, { recursive: true });

  // Example lead for the result + admin previews.
  const answers = { recency: 'months', kind: 'death', intensity: 8, struggles: ['sleep', 'sadness', 'isolation'], talkedBefore: 'no', supported: 'no' };
  const exampleLead = {
    id: 'example',
    name: 'Marieke Jansen',
    email: 'marieke@example.com',
    phone: '+31 6 12345678',
    createdAt: new Date().toISOString(),
    status: 'new',
    assignedCoachId: 'coach-anna',
    booking: null,
    answers,
    result: generateResult(answers),
    emails: { welcomeSentAt: new Date().toISOString(), followupScheduledFor: new Date(Date.now() + 48 * 3600e3).toISOString(), followupSentAt: null },
  };

  const adminStats = { total: 3, new: 1, contacted: 1, booked: 1, last7Days: 3 };
  const adminLeads = [
    exampleLead,
    { ...exampleLead, id: 'b', name: 'Tom de Boer', email: 'tom@example.com', phone: null, status: 'contacted', result: generateResult({ recency: 'year', kind: 'divorce', intensity: 5, struggles: ['meaning', 'focus'], talkedBefore: 'friends', supported: 'somewhat' }) },
    { ...exampleLead, id: 'c', name: 'Sofie Willems', email: 'sofie@example.com', status: 'booked', booking: { type: 'internal-request', preference: 'weekday-evening' }, result: generateResult({ recency: 'recent', kind: 'trauma', intensity: 9, struggles: ['numbness', 'anger'], talkedBefore: 'professional', supported: 'yes' }) },
  ];

  const pages = {
    'index.html': landingPage(),
    'quiz.html': quizPage(),
    'about.html': aboutPage(),
    'privacy.html': privacyPage(),
    'booking.html': bookingPage({ lead: exampleLead }),
    'result.html': resultPage({ lead: exampleLead }),
    'admin-login.html': adminLoginPage({}),
    'admin-dashboard.html': adminDashboardPage({ leads: adminLeads, stats: adminStats }),
  };

  for (const [file, html] of Object.entries(pages)) {
    await fsp.writeFile(path.join(OUT, file), rewrite(html), 'utf8');
  }

  // Copy client assets so the preview is fully styled.
  for (const asset of ['styles.css', 'quiz.js', 'booking.js']) {
    await fsp.copyFile(path.join(ROOT, 'public', asset), path.join(OUT, asset));
  }

  // A tiny index of all preview pages.
  const list = Object.keys(pages)
    .map((f) => `<li><a href="${f}">${f}</a></li>`)
    .join('');
  const indexNote = `<!doctype html><meta charset="utf-8"><title>RouwKompas preview</title>
  <body style="font-family:Arial;max-width:640px;margin:40px auto;padding:0 20px;color:#3a3633;">
  <h1 style="font-family:Georgia;color:#5f7a69;">RouwKompas — preview pages</h1>
  <p>Open <a href="index.html"><b>index.html</b></a> to start, or jump to any page:</p>
  <ul style="line-height:2;">${list}</ul>
  <p style="color:#8a847c;font-size:.9rem;">These are static snapshots. For the working quiz, emails and live admin, run <code>node server.js</code>.</p></body>`;
  await fsp.writeFile(path.join(OUT, 'pages.html'), indexNote, 'utf8');

  console.log(`Preview built into ${OUT}`);
  console.log('Pages:', Object.keys(pages).join(', '), '+ pages.html');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
