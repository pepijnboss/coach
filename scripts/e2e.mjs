// End-to-end smoke test van de volledige funnel, in-process uitgevoerd.
// Start de echte server, bestuurt 'm met fetch, en controleert of de funnel werkt.

process.env.PORT = process.env.PORT || '3199';
process.env.PUBLIC_BASE_URL = `http://127.0.0.1:${process.env.PORT}`;
process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASSWORD = 'test-pass-123';
process.env.COACH_NOTIFICATION_EMAIL = 'info@ob-audire.nl';
process.env.FOLLOWUP_DELAY_HOURS = '0.0004'; // ~1.4s om opvolging te kunnen testen

const B = process.env.PUBLIC_BASE_URL;
let pass = 0, fail = 0;
function ok(name, cond, extra = '') {
  if (cond) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name} ${extra}`); }
}

const content = (await import('../src/content.js')).default;
const server = (await import('../server.js')).default;
await new Promise((r) => setTimeout(r, 600));

async function get(path, opts = {}) {
  const res = await fetch(B + path, { redirect: 'manual', ...opts });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

try {
  // 1. Publieke pagina's
  let r = await get('/');
  ok('Landing toont hero', r.status === 200 && r.text.includes(content.landing.heroTitle));
  ok('Landing heeft beide CTAs', r.text.includes(content.cta.primary) && r.text.includes(content.cta.secondary));
  ok('Landing toont mol-motief', r.text.includes('zoals de mol'));

  r = await get('/check-in');
  ok('Check-in levert quizdata', r.text.includes('ob-audire-checkin-v1') && r.text.includes('/quiz.js'));

  r = await get('/wie-ben-ik');
  ok('Wie ben ik toont Petra', r.text.includes('Petra Mollet') && r.text.includes('Wat je kunt verwachten'));
  ok('Wie ben ik toont opleidingen', r.text.includes('Land van Rouw') && r.text.includes('Fontys'));

  r = await get('/aanbod');
  ok('Aanbod toont (K)ankeratelier + prijs', r.text.includes('(K)ankeratelier') && r.text.includes('45'));

  r = await get('/privacy');
  ok('Privacy/AVG-pagina', r.text.includes('AVG') && r.text.includes('recht op inzage'));

  r = await get('/styles.css');
  ok('Statische CSS geserveerd', r.status === 200 && r.text.includes('--sage'));

  r = await get('/quiz.js');
  ok('Statische client-JS geserveerd', r.status === 200 && r.text.includes('submitLead'));

  r = await get('/nope');
  ok('Onbekende route geeft 404', r.status === 404 && r.text.includes('verdwaald'));

  r = await get('/quiz');
  ok('Oude /quiz redirect naar /check-in', r.status === 301 && r.headers.get('location') === '/check-in');

  // 2. Lead-capture API (de conversie)
  const leadPayload = {
    name: 'Test Persoon',
    email: 'test.persoon@example.com',
    phone: '06 11111111',
    consent: true,
    answers: { intent: 'rouw', recency: 'maanden', intensity: 8, struggles: ['verdriet', 'onrust', 'lichaam'], talkedBefore: 'nee', longing: 'gehoord' },
  };
  r = await get('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadPayload) });
  const lead = JSON.parse(r.text);
  ok('Lead aangemaakt (201 + redirect)', r.status === 201 && lead.ok && lead.leadId && lead.redirect.startsWith('/resultaat/'));
  const leadId = lead.leadId;

  // 3. Validatie weigert slechte invoer
  r = await get('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'x', email: 'fout', consent: false, answers: {} }) });
  const bad = JSON.parse(r.text);
  ok('Lead-validatie weigert slechte invoer', r.status === 422 && bad.errors && bad.errors.email && bad.errors.consent);

  // 4. Persoonlijke spiegeling
  r = await get(lead.redirect);
  ok('Resultaatpagina toont persoonlijke inhoud', r.status === 200 && r.text.includes('result-body') && /Veel om te dragen|Iets dat merkbaar meeweegt|Een zacht moment/.test(r.text));
  ok('Resultaat toont boek-CTA', r.text.includes(content.cta.book) && r.text.includes(`/afspraak?lead=${leadId}`));
  ok('Resultaat toont het e-mailadres', r.text.includes('test.persoon@example.com'));

  // 5. Welkomstmail + melding aan coach, opvolging gepland
  const { listOutbox } = await import('../src/email.js');
  let box = await listOutbox();
  const welcome = box.find((m) => m.meta?.kind === 'welcome' && m.meta?.leadId === leadId);
  const coachNote = box.find((m) => m.meta?.kind === 'coach-notification' && m.meta?.leadId === leadId);
  ok('Welkomstmail direct verstuurd', !!welcome && welcome.status === 'sent');
  ok('Melding aan Petra verstuurd', !!coachNote && coachNote.to === 'info@ob-audire.nl');

  const { getLead } = await import('../src/leads.js');
  let stored = await getLead(leadId);
  ok('Lead opgeslagen met antwoorden + resultaat + routing', !!stored.result && stored.assignedCoachId === 'coach-petra' && stored.emails.welcomeSentAt);
  ok('Opvolging gepland', !!stored.emails.followupScheduledFor && !stored.emails.followupSentAt);

  // 6. Wacht tot de scheduler de (versnelde) opvolgmail stuurt
  await new Promise((res) => setTimeout(res, 4500));
  box = await listOutbox();
  const followup = box.find((m) => m.meta?.kind === 'followup' && m.meta?.leadId === leadId);
  ok('Opvolgmail automatisch verstuurd', !!followup && followup.status === 'sent');
  stored = await getLead(leadId);
  ok('Lead gemarkeerd als opvolging verstuurd', !!stored.emails.followupSentAt);

  // 7. Interne afspraakaanvraag koppelt aan de lead
  r = await get('/api/booking-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId, name: 'Test Persoon', email: 'test.persoon@example.com', preference: 'doordeweeks-avond', note: 'Avonden komen het best uit.' }) });
  ok('Afspraakaanvraag geaccepteerd', r.status === 201);
  stored = await getLead(leadId);
  ok('Lead nu gepland met voorkeur', stored.status === 'booked' && stored.booking?.preference === 'doordeweeks-avond');

  // 8. Directe afspraak (zonder check-in) legt toch een lead vast
  r = await get('/api/booking-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Direct Boeker', email: 'direct@example.com', preference: 'weekend' }) });
  const direct = JSON.parse(r.text);
  ok('Directe afspraak maakt een lead', r.status === 201 && direct.leadId && direct.leadId !== leadId);

  // 9. Admin-auth
  r = await get('/admin');
  ok('Admin verwijst naar login indien niet ingelogd', r.status === 302 && r.headers.get('location') === '/admin/login');

  r = await get('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'username=admin&password=fout' });
  ok('Admin weigert fout wachtwoord', r.status === 401);

  r = await get('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'username=admin&password=test-pass-123' });
  const setCookie = r.headers.get('set-cookie') || '';
  const token = (setCookie.match(/rk_admin=([^;]+)/) || [])[1];
  ok('Admin login zet sessiecookie + redirect', r.status === 302 && !!token);

  r = await get('/admin', { headers: { Cookie: `rk_admin=${token}` } });
  ok('Dashboard laadt met leads', r.status === 200 && r.text.includes('Test Persoon') && r.text.includes('Direct Boeker'));
  ok('Dashboard toont statistieken', r.text.includes('Totaal'));

  r = await get('/admin/outbox', { headers: { Cookie: `rk_admin=${token}` } });
  ok('Admin outbox toont e-mails', r.status === 200 && r.text.includes('E-mail-outbox'));

  // 10. Status bijwerken + AVG-verwijdering
  r = await get(`/admin/leads/${direct.leadId}/status`, { method: 'POST', headers: { Cookie: `rk_admin=${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'status=contacted' });
  stored = await getLead(direct.leadId);
  ok('Status bijwerken werkt', stored.status === 'contacted');

  r = await get(`/admin/leads/${direct.leadId}/delete`, { method: 'POST', headers: { Cookie: `rk_admin=${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: '' });
  stored = await getLead(direct.leadId);
  ok('AVG-verwijdering wist de lead', stored === null);

} catch (err) {
  fail++;
  console.error('  \u2717 wierp fout:', err);
}

console.log(`\n  Resultaat: ${pass} geslaagd, ${fail} gefaald\n`);
server.close();
process.exit(fail ? 1 : 0);
