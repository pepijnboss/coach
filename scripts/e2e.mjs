// End-to-end smoke test of the full funnel, run in-process.
// Starts the real server, drives it with fetch, asserts the funnel works.

process.env.PORT = process.env.PORT || '3199';
process.env.PUBLIC_BASE_URL = `http://127.0.0.1:${process.env.PORT}`;
process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASSWORD = 'test-pass-123';
process.env.COACH_NOTIFICATION_EMAIL = 'anna@rouwkompas.nl';
process.env.FOLLOWUP_DELAY_HOURS = '0.0004'; // ~1.4s so we can verify follow-up

const B = process.env.PUBLIC_BASE_URL;
let pass = 0, fail = 0;
function ok(name, cond, extra = '') {
  if (cond) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name} ${extra}`); }
}

const server = (await import('../server.js')).default;
await new Promise((r) => setTimeout(r, 600)); // let it bind

async function get(path, opts = {}) {
  const res = await fetch(B + path, { redirect: 'manual', ...opts });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

try {
  // 1. Public pages
  let r = await get('/');
  ok('Landing renders hero', r.status === 200 && r.text.includes('Find support after loss'));
  ok('Landing has both CTAs', r.text.includes('Start the short check-in') && r.text.includes('Book a free conversation'));

  r = await get('/quiz');
  ok('Quiz page ships quiz data', r.text.includes('rouwkompas-intake-v1') && r.text.includes('/quiz.js'));

  r = await get('/about');
  ok('About page renders coach', r.text.includes('Meet Anna de Vries') && r.text.includes('What to expect'));

  r = await get('/privacy');
  ok('Privacy/GDPR page renders', r.text.includes('GDPR') && r.text.includes('right to access'));

  r = await get('/styles.css');
  ok('Static CSS served', r.status === 200 && r.text.includes('--sage'));

  r = await get('/quiz.js');
  ok('Static client JS served', r.status === 200 && r.text.includes('submitLead'));

  r = await get('/nope');
  ok('Unknown route returns 404', r.status === 404 && r.text.includes('wandered off'));

  // 2. Lead capture API (the conversion event)
  const leadPayload = {
    name: 'Test Persoon',
    email: 'test.persoon@example.com',
    phone: '+31 6 11111111',
    consent: true,
    answers: { recency: 'months', kind: 'death', intensity: 8, struggles: ['sleep', 'isolation', 'guilt'], talkedBefore: 'no', supported: 'no' },
  };
  r = await get('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadPayload) });
  const lead = JSON.parse(r.text);
  ok('Lead created (201 + redirect)', r.status === 201 && lead.ok && lead.leadId && lead.redirect.startsWith('/result/'));
  const leadId = lead.leadId;

  // 3. Validation rejects bad input
  r = await get('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'x', email: 'bad', consent: false, answers: {} }) });
  const bad = JSON.parse(r.text);
  ok('Lead validation rejects bad input', r.status === 422 && bad.errors && bad.errors.email && bad.errors.consent);

  // 4. Personalized result page
  r = await get(lead.redirect);
  ok('Result page renders personalized content', r.status === 200 && r.text.includes('result-body') && /Carrying something heavy|A lot to hold right now|A gentle moment/.test(r.text));
  ok('Result shows booking CTA', r.text.includes('Book a free 30-minute conversation') && r.text.includes(`/booking?lead=${leadId}`));
  ok('Result echoes the lead email', r.text.includes('test.persoon@example.com'));

  // 5. Welcome email + coach notification happened, follow-up scheduled
  const { listOutbox } = await import('../src/email.js');
  let box = await listOutbox();
  const welcome = box.find((m) => m.meta?.kind === 'welcome' && m.meta?.leadId === leadId);
  const coachNote = box.find((m) => m.meta?.kind === 'coach-notification' && m.meta?.leadId === leadId);
  ok('Welcome email sent immediately', !!welcome && welcome.status === 'sent');
  ok('Coach notification sent', !!coachNote && coachNote.to === 'anna@rouwkompas.nl');

  const { getLead } = await import('../src/leads.js');
  let stored = await getLead(leadId);
  ok('Lead stored with answers + result + routing', !!stored.result && stored.assignedCoachId === 'coach-anna' && stored.emails.welcomeSentAt);
  ok('Follow-up scheduled', !!stored.emails.followupScheduledFor && !stored.emails.followupSentAt);

  // 6. Wait for the scheduler to send the 48h (compressed) follow-up
  await new Promise((res) => setTimeout(res, 4500));
  box = await listOutbox();
  const followup = box.find((m) => m.meta?.kind === 'followup' && m.meta?.leadId === leadId);
  ok('Follow-up email auto-sent by scheduler', !!followup && followup.status === 'sent');
  stored = await getLead(leadId);
  ok('Lead marked follow-up sent', !!stored.emails.followupSentAt);

  // 7. Internal booking request links to the lead
  r = await get('/api/booking-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId, name: 'Test Persoon', email: 'test.persoon@example.com', preference: 'weekday-evening', note: 'Evenings work best.' }) });
  ok('Booking request accepted', r.status === 201);
  stored = await getLead(leadId);
  ok('Lead now booked with preference', stored.status === 'booked' && stored.booking?.preference === 'weekday-evening');

  // 8. Direct booking (no prior quiz) still captures a lead
  r = await get('/api/booking-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Direct Booker', email: 'direct@example.com', preference: 'weekend' }) });
  const direct = JSON.parse(r.text);
  ok('Direct booking creates a lead', r.status === 201 && direct.leadId && direct.leadId !== leadId);

  // 9. Admin auth
  r = await get('/admin');
  ok('Admin redirects to login when unauthenticated', r.status === 302 && r.headers.get('location') === '/admin/login');

  r = await get('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'username=admin&password=wrong' });
  ok('Admin rejects wrong password', r.status === 401);

  r = await get('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'username=admin&password=test-pass-123' });
  const setCookie = r.headers.get('set-cookie') || '';
  const token = (setCookie.match(/rk_admin=([^;]+)/) || [])[1];
  ok('Admin login sets session cookie + redirects', r.status === 302 && !!token);

  r = await get('/admin', { headers: { Cookie: `rk_admin=${token}` } });
  ok('Admin dashboard loads with leads', r.status === 200 && r.text.includes('Test Persoon') && r.text.includes('Direct Booker'));
  ok('Dashboard shows stats', r.text.includes('Total leads'));

  r = await get('/admin/outbox', { headers: { Cookie: `rk_admin=${token}` } });
  ok('Admin outbox lists emails', r.status === 200 && r.text.includes('Email outbox'));

  // 10. Status update + GDPR delete
  r = await get(`/admin/leads/${direct.leadId}/status`, { method: 'POST', headers: { Cookie: `rk_admin=${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'status=contacted' });
  stored = await getLead(direct.leadId);
  ok('Status update works', stored.status === 'contacted');

  r = await get(`/admin/leads/${direct.leadId}/delete`, { method: 'POST', headers: { Cookie: `rk_admin=${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: '' });
  stored = await getLead(direct.leadId);
  ok('GDPR delete removes the lead', stored === null);

} catch (err) {
  fail++;
  console.error('  \u2717 threw:', err);
}

console.log(`\n  Results: ${pass} passed, ${fail} failed\n`);
server.close();
process.exit(fail ? 1 : 0);
