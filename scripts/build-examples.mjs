// Bouw een zelfstandige pagina met MEERDERE voorbeeld-spiegelingen, zodat
// zichtbaar is dat de spiegeling per antwoord verschilt.
// Gebruik: npm run preview:examples  →  preview/spiegeling-voorbeelden.html

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateResult, QUIZ } from '../src/quiz.js';
import content from '../src/content.js';
import { esc } from '../src/util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'preview');
const styles = fs.readFileSync(path.join(ROOT, 'public', 'styles.css'), 'utf8');

// Label-maps uit de quizdefinitie, om antwoorden leesbaar te tonen.
const labelMap = {};
for (const step of QUIZ.steps) {
  if (step.options) {
    labelMap[step.id] = Object.fromEntries(step.options.map((o) => [o.value, o.label]));
  }
}
function answerLine(answers) {
  const parts = [];
  for (const step of QUIZ.steps) {
    const v = answers[step.id];
    if (v === undefined) continue;
    if (step.type === 'scale') parts.push(`${step.question} <b>${v}/10</b>`);
    else if (step.type === 'multi') parts.push(`${step.question} <b>${v.map((x) => labelMap[step.id][x]).join(', ')}</b>`);
    else parts.push(`${step.question} <b>${labelMap[step.id][v]}</b>`);
  }
  return parts.join('<br>');
}

const examples = [
  { intent: 'rouw', intensity: 9, struggles: ['verdriet', 'lichaam', 'stilte'], talkedBefore: 'nee', longing: 'gehoord' },
  { intent: 'loopbaan', intensity: 3, struggles: ['keuzes', 'vastlopen'], talkedBefore: 'professional', longing: 'richting' },
  { intent: 'verbinding', intensity: 6, struggles: ['kwijt', 'onrust'], talkedBefore: 'naasten', longing: 'voelen' },
  { intent: 'kanker', intensity: 7, struggles: ['stilte', 'lichaam'], talkedBefore: 'nee', longing: 'rust' },
  { intent: 'kruispunt', intensity: 5, struggles: ['stappen'], talkedBefore: 'naasten', longing: 'stappen' },
];

const bandLabel = { licht: 'Een zacht moment', merkbaar: 'Iets dat merkbaar meeweegt', zwaar: 'Veel om te dragen' };

function card(answers) {
  const r = generateResult(answers);
  const paras = r.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  return `
  <article class="ex">
    <div class="ex-in">
      <span class="badge-pill" style="margin-bottom:8px;">Voorbeeld-antwoorden</span>
      <p class="muted" style="font-size:.9rem;margin:0;">${answerLine(answers)}</p>
    </div>
    <div class="result-head" style="margin-top:18px;">
      <span class="result-band">${esc(bandLabel[r.band] || 'Jouw spiegeling')}</span>
      <h2 style="margin:6px 0 0;">${esc(r.headline)}</h2>
    </div>
    <div class="result-body card">${paras}</div>
    <div class="result-invite">
      <p class="muted" style="margin:0 0 12px;">${esc(r.invitation)}</p>
      <span class="btn btn-primary" style="cursor:default;">${esc(r.ctaLabel)}</span>
    </div>
  </article>`;
}

const cards = examples.map(card).join('\n');

const doc = `<!doctype html><html lang="nl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Voorbeelden van spiegelingen · ${esc(content.brand.name)}</title>
<style>${styles}
.ex{max-width:640px;margin:0 auto 56px;padding-bottom:40px;border-bottom:1px solid var(--line);}
.ex:last-child{border-bottom:none;}
.ex-in{background:var(--beige-2);border:1px solid var(--line);border-radius:var(--radius-sm);padding:14px 16px;}
</style></head>
<body>
<div style="background:#7c8a5a;color:#fff;font-family:Arial;font-size:.85rem;text-align:center;padding:8px 14px;">Vijf verschillende antwoorden → vijf verschillende spiegelingen. Zo werkt het ook live op de site.</div>
<section class="section-pad"><div class="container">
  <div class="center" style="margin-bottom:30px;">
    <span class="eyebrow">Bewijs</span>
    <h1>De spiegeling verschilt per antwoord</h1>
    <p class="muted" style="max-width:54ch;margin:0 auto;">Hieronder dezelfde check-in met vijf verschillende sets antwoorden. Elke spiegeling is anders van kop, inhoud en toon.</p>
  </div>
  ${cards}
</div></section>
</body></html>`;

await fsp.mkdir(OUT, { recursive: true });
await fsp.writeFile(path.join(OUT, 'spiegeling-voorbeelden.html'), doc, 'utf8');
console.log('Geschreven: preview/spiegeling-voorbeelden.html (' + examples.length + ' voorbeelden)');
