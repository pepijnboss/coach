// Bouw een STATISCHE preview van de site in /preview, zodat de pagina's in een
// browser te openen zijn zonder server. Routes worden herschreven naar lokale
// .html-bestanden en absolute asset-paden naar relatieve. De definitieve
// verzending van de check-in vereist de live server; alle pagina's zien er
// verder exact zo uit als live.
//
// Gebruik: npm run preview:build

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { landingPage, quizPage, aboutPage, aanbodPage, privacyPage, seoPage, seoPages } from '../src/views/pages.js';
import { bookingPage } from '../src/views/booking.js';
import { resultPage } from '../src/views/result.js';
import { adminLoginPage, adminDashboardPage } from '../src/views/admin.js';
import { generateResult } from '../src/quiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'preview');

// Route -> statisch bestand.
const routeMap = {
  '/': 'index.html',
  '/check-in': 'check-in.html',
  '/wie-ben-ik': 'wie-ben-ik.html',
  '/aanbod': 'aanbod.html',
  '/privacy': 'privacy.html',
  '/afspraak': 'afspraak.html',
};
const assetSet = new Set(['/styles.css', '/quiz.js', '/booking.js']);

function rewriteValue(val) {
  if (!val.startsWith('/')) return val; // extern, mailto, tel, data:, ankers
  const hashIdx = val.search(/[?#]/);
  const pathPart = hashIdx === -1 ? val : val.slice(0, hashIdx);
  const rest = hashIdx === -1 ? '' : val.slice(hashIdx);
  if (assetSet.has(pathPart)) return pathPart.slice(1) + rest;
  if (pathPart.startsWith('/resultaat/')) return 'resultaat.html' + (rest.startsWith('#') ? rest : '');
  if (routeMap[pathPart]) {
    const file = routeMap[pathPart];
    return (pathPart === '/' ? 'index.html' : file) + (rest.startsWith('#') ? rest : '');
  }
  if (pathPart === '/') return 'index.html' + rest;
  return pathPart.slice(1) + rest;
}

function rewrite(html) {
  let out = html.replace(/\b(href|src)="([^"]*)"/g, (m, attr, val) => `${attr}="${rewriteValue(val)}"`);
  const banner = `<div style="background:#7c8a5a;color:#fff;font-family:Arial,sans-serif;font-size:.85rem;text-align:center;padding:8px 14px;">Statische preview &mdash; klik door de check-in om de flow te ervaren. Echte e-mails, opslag en het live dashboard vragen de server (<code style="background:rgba(255,255,255,.2);padding:1px 5px;border-radius:4px;">node server.js</code>).</div>`;
  const flag = `<script>window.RK_PREVIEW=true;</script>`;
  out = out.replace(/(<body[^>]*>)/, `$1${flag}${banner}`);
  return out;
}

async function main() {
  await fsp.rm(OUT, { recursive: true, force: true });
  await fsp.mkdir(OUT, { recursive: true });

  const answers = { intent: 'rouw', recency: 'maanden', intensity: 8, struggles: ['verdriet', 'onrust', 'lichaam'], talkedBefore: 'nee', longing: 'gehoord' };
  const exampleLead = {
    id: 'example', name: 'Marieke Jansen', email: 'marieke@example.com', phone: '06 12345678',
    createdAt: new Date().toISOString(), status: 'new', assignedCoachId: 'coach-petra', booking: null,
    answers, result: generateResult(answers),
    emails: { welcomeSentAt: new Date().toISOString(), followupScheduledFor: new Date(Date.now() + 48 * 3600e3).toISOString(), followupSentAt: null },
  };

  const adminStats = { total: 3, new: 1, contacted: 1, booked: 1, last7Days: 3 };
  const adminLeads = [
    exampleLead,
    { ...exampleLead, id: 'b', name: 'Tom de Boer', email: 'tom@example.com', phone: null, status: 'contacted', result: generateResult({ intent: 'loopbaan', recency: 'jaar', intensity: 5, struggles: ['vastlopen', 'keuzes'], talkedBefore: 'naasten', longing: 'richting' }) },
    { ...exampleLead, id: 'c', name: 'Sofie Willems', email: 'sofie@example.com', status: 'booked', booking: { type: 'internal-request', preference: 'doordeweeks-avond' }, result: generateResult({ intent: 'kanker', recency: 'recent', intensity: 7, struggles: ['stilte', 'lichaam'], talkedBefore: 'professional', longing: 'rust' }) },
  ];

  const pages = {
    'index.html': landingPage(),
    'check-in.html': quizPage(),
    'wie-ben-ik.html': aboutPage(),
    'aanbod.html': aanbodPage(),
    'privacy.html': privacyPage(),
    'afspraak.html': bookingPage({ lead: exampleLead }),
    'resultaat.html': resultPage({ lead: exampleLead }),
    'admin-login.html': adminLoginPage({}),
    'admin-dashboard.html': adminDashboardPage({ leads: adminLeads, stats: adminStats }),
  };

  for (const [file, html] of Object.entries(pages)) {
    await fsp.writeFile(path.join(OUT, file), rewrite(html), 'utf8');
  }

  // Lokale SEO-pagina's als losse previewbestanden.
  for (const p of seoPages) {
    await fsp.writeFile(path.join(OUT, `${p.slug}.html`), rewrite(seoPage(p)), 'utf8');
    pages[`${p.slug}.html`] = true; // alleen voor de index-lijst hieronder
  }

  for (const asset of ['styles.css', 'quiz.js', 'booking.js']) {
    await fsp.copyFile(path.join(ROOT, 'public', asset), path.join(OUT, asset));
  }

  const list = Object.keys(pages).map((f) => `<li><a href="${f}">${f}</a></li>`).join('');
  const indexNote = `<!doctype html><meta charset="utf-8"><title>Ob-Audire preview</title>
  <body style="font-family:Arial;max-width:640px;margin:40px auto;padding:0 20px;color:#3a322a;">
  <h1 style="font-family:Georgia;color:#5d6a40;">Ob-Audire — previewpagina's</h1>
  <p>Open <a href="index.html"><b>index.html</b></a> om te starten, of spring naar een pagina:</p>
  <ul style="line-height:2;">${list}</ul>
  <p style="color:#938979;font-size:.9rem;">Dit zijn statische momentopnames. Voor de werkende check-in, e-mails en het live dashboard: <code>node server.js</code>.</p></body>`;
  await fsp.writeFile(path.join(OUT, 'pages.html'), indexNote, 'utf8');

  console.log(`Preview gebouwd in ${OUT}`);
  console.log('Pagina\'s:', Object.keys(pages).join(', '), '+ pages.html');
}

main().catch((e) => { console.error(e); process.exit(1); });
