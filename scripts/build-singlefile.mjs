// Bouw ÉÉN zelfstandig HTML-bestand (preview/ob-audire-preview.html) dat je
// kunt downloaden en direct in een browser opent — geen server, geen internet,
// geen losse CSS/JS. Alle pagina's zitten erin en wisselen via een tabbalk; de
// check-in en het afspraakformulier werken in preview-modus.
//
// Gebruik: npm run preview:single

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { landingPage, quizPage, aboutPage, aanbodPage, privacyPage } from '../src/views/pages.js';
import { bookingPage } from '../src/views/booking.js';
import { resultPage } from '../src/views/result.js';
import { adminDashboardPage } from '../src/views/admin.js';
import { generateResult } from '../src/quiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'preview');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function mainInner(html) {
  const m = html.match(/<main>([\s\S]*?)<\/main>/);
  return m ? m[1] : html;
}
function between(html, tag) {
  const m = html.match(new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`));
  return m ? m[0] : '';
}

async function main() {
  await fsp.mkdir(OUT, { recursive: true });

  const styles = read('public/styles.css');
  const quizJs = read('public/quiz.js');
  const bookingJs = read('public/booking.js');

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

  const landing = landingPage();
  const header = between(landing, 'header');
  const footer = between(landing, 'footer');

  const pages = [
    { id: 'home', label: 'Home', html: mainInner(landing) },
    { id: 'checkin', label: 'Check-in', html: mainInner(quizPage()) },
    { id: 'resultaat', label: 'Spiegeling', html: mainInner(resultPage({ lead: exampleLead })) },
    { id: 'afspraak', label: 'Afspraak', html: mainInner(bookingPage({ lead: exampleLead })) },
    { id: 'wie', label: 'Wie ben ik', html: mainInner(aboutPage()) },
    { id: 'aanbod', label: 'Aanbod', html: mainInner(aanbodPage()) },
    { id: 'privacy', label: 'Privacy', html: mainInner(privacyPage()) },
    { id: 'admin', label: 'Dashboard', html: mainInner(adminDashboardPage({ leads: adminLeads, stats: adminStats })) },
  ];

  const tabs = pages.map((p) => `<button class="rk-tab" data-go="${p.id}">${p.label}</button>`).join('');
  const sections = pages
    .map((p) => `<div class="rk-page" data-page="${p.id}" ${p.id === 'home' ? '' : 'hidden'}>${p.html}</div>`)
    .join('\n');

  const extraCss = `
    .rk-banner{background:#7c8a5a;color:#fff;font-family:Arial,sans-serif;font-size:.85rem;text-align:center;padding:8px 14px;}
    .rk-banner code{background:rgba(255,255,255,.2);padding:1px 5px;border-radius:4px;}
    .rk-tabbar{position:sticky;top:64px;z-index:15;background:#ece3d3;border-bottom:1px solid #e6dcc9;display:flex;gap:4px;overflow-x:auto;padding:8px 12px;}
    .rk-tab{font-family:var(--sans);font-size:.9rem;border:1px solid transparent;background:transparent;color:#6e645a;padding:8px 14px;border-radius:999px;cursor:pointer;white-space:nowrap;}
    .rk-tab:hover{background:#e8ebda;color:#3a322a;}
    .rk-tab.active{background:#7c8a5a;color:#fff;}
  `;

  // Link-mapping naar tab-id's voor in-app navigatie.
  const switcher = `
  <script>
    (function(){
      window.RK_PREVIEW = true;
      function showPage(id){
        document.querySelectorAll('.rk-page').forEach(function(el){ el.hidden = el.getAttribute('data-page') !== id; });
        document.querySelectorAll('.rk-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-go') === id); });
        window.scrollTo({top:0,behavior:'smooth'});
      }
      window.RK_showPage = showPage;
      window.RK_onComplete = function(){ showPage('resultaat'); };
      document.querySelectorAll('.rk-tab').forEach(function(b){ b.addEventListener('click', function(){ showPage(b.getAttribute('data-go')); }); });
      var map = { '/':'home', '/check-in':'checkin', '/wie-ben-ik':'wie', '/aanbod':'aanbod', '/privacy':'privacy', '/afspraak':'afspraak' };
      document.addEventListener('click', function(e){
        var a = e.target.closest && e.target.closest('a');
        if(!a) return;
        var href = a.getAttribute('href') || '';
        if(href.indexOf('mailto:')===0 || href.indexOf('tel:')===0 || href.indexOf('http')===0) return;
        var base = href.split(/[?#]/)[0];
        var target = null;
        if(map[base]!==undefined) target = map[base];
        else if(base.indexOf('/resultaat/')===0) target = 'resultaat';
        else if(base.indexOf('/#')===0 || base==='/') target = 'home';
        if(target){ e.preventDefault(); showPage(target); }
      });
      var first = document.querySelector('.rk-tab'); if(first) first.classList.add('active');
    })();
  </script>`;

  const doc = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ob-Audire — preview</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%237c8a5a'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='Georgia'>Ob</text></svg>">
<style>
${styles}
${extraCss}
</style>
</head>
<body>
<div class="rk-banner">Offline preview &mdash; klik de tabs en doorloop de check-in. Echte e-mails, opslag en het live dashboard vragen de server (<code>node server.js</code>).</div>
${header}
<div class="rk-tabbar">${tabs}</div>
<main>
${sections}
</main>
${footer}
<script>${quizJs}</script>
<script>${bookingJs}</script>
${switcher}
</body>
</html>`;

  const outFile = path.join(OUT, 'ob-audire-preview.html');
  await fsp.writeFile(outFile, doc, 'utf8');
  const kb = (Buffer.byteLength(doc, 'utf8') / 1024).toFixed(0);
  console.log(`Eén-bestand preview geschreven: ${outFile} (${kb} KB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
