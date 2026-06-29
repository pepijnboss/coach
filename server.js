// Ob-Audire — application entry point.
//
// A single Node.js HTTP server (no framework, no dependencies) that serves the
// public funnel, the JSON API, and the coach admin dashboard, and runs the
// follow-up email scheduler in the background.

import http from 'node:http';
import config from './src/config.js';
import { serveStatic, sendHtml, sendJson, notFound, redirect } from './src/http.js';
import { layout } from './src/views/layout.js';
import { landingPage, quizPage, aboutPage, aanbodPage, privacyPage } from './src/views/pages.js';
import { bookingPage } from './src/views/booking.js';
import { resultPage } from './src/views/result.js';
import { handleCreateLead, handleBookingRequest } from './src/api.js';
import { getLead } from './src/leads.js';
import * as admin from './src/adminController.js';
import { startScheduler } from './src/automation.js';

// ── 404 page ──────────────────────────────────────────────────────────────
function render404() {
  return layout({
    title: 'Pagina niet gevonden',
    minimal: true,
    body: `<section class="section-pad"><div class="container center" style="max-width:520px;">
      <span class="eyebrow">Pagina niet gevonden</span>
      <h1>Deze pagina is verdwaald</h1>
      <p class="muted">De pagina die je zocht is hier niet. Laat ons je terugbrengen.</p>
      <a class="btn btn-primary" href="/">Naar de startpagina</a>
      <a class="btn btn-secondary" href="/check-in">Doe de check-in</a>
    </div></section>`,
  });
}

function render500() {
  return layout({
    title: 'Er ging iets mis',
    minimal: true,
    body: `<section class="section-pad"><div class="container center" style="max-width:520px;">
      <h1>Er ging iets mis aan onze kant</h1>
      <p class="muted">Probeer het zo nog eens. Blijft het misgaan, mail dan ${config.supportEmail}.</p>
      <a class="btn btn-primary" href="/">Naar de startpagina</a>
    </div></section>`,
  });
}

// ── Router ──────────────────────────────────────────────────────────────────
async function route(req, res, url) {
  const { pathname } = url;
  const method = req.method.toUpperCase();
  const m = (p) => method === p;

  // Static assets first (files that exist in /public)
  if (m('GET') && /\.[a-z0-9]+$/i.test(pathname)) {
    const served = await serveStatic(req, res, pathname);
    if (served) return;
  }

  // ── Publieke pagina's ──
  if (m('GET') && pathname === '/') return sendHtml(res, landingPage());
  if (m('GET') && pathname === '/check-in') return sendHtml(res, quizPage());
  if (m('GET') && pathname === '/wie-ben-ik') return sendHtml(res, aboutPage());
  if (m('GET') && pathname === '/aanbod') return sendHtml(res, aanbodPage());
  if (m('GET') && pathname === '/privacy') return sendHtml(res, privacyPage());

  if (m('GET') && pathname === '/afspraak') {
    const leadId = url.searchParams.get('lead');
    const lead = leadId ? await getLead(leadId) : null;
    return sendHtml(res, bookingPage({ lead }));
  }

  if (m('GET') && pathname.startsWith('/resultaat/')) {
    const id = decodeURIComponent(pathname.slice('/resultaat/'.length));
    const lead = await getLead(id);
    if (!lead) return notFound(res, render404());
    return sendHtml(res, resultPage({ lead }));
  }

  // Redirects van oude Engelse paden (voor het geval ze ergens gedeeld zijn)
  const legacy = { '/quiz': '/check-in', '/about': '/wie-ben-ik', '/booking': '/afspraak' };
  if (m('GET') && legacy[pathname]) return redirect(res, legacy[pathname], 301);
  if (m('GET') && pathname.startsWith('/result/')) return redirect(res, '/resultaat/' + pathname.slice('/result/'.length), 301);

  // ── SEO: robots.txt + sitemap.xml ──
  if (m('GET') && pathname === '/robots.txt') {
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /resultaat/\n\nSitemap: ${config.publicBaseUrl}/sitemap.xml\n`;
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(txt);
  }
  if (m('GET') && pathname === '/sitemap.xml') {
    const pages = ['/', '/check-in', '/wie-ben-ik', '/aanbod', '/afspraak', '/privacy'];
    const urls = pages
      .map((p) => `  <url><loc>${config.publicBaseUrl}${p}</loc><changefreq>monthly</changefreq></url>`)
      .join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    return res.end(xml);
  }

  // ── Public API ──
  if (m('POST') && pathname === '/api/lead') return handleCreateLead(req, res);
  if (m('POST') && pathname === '/api/booking-request') return handleBookingRequest(req, res);
  if (m('GET') && pathname === '/api/health') {
    return sendJson(res, {
      ok: true,
      service: 'ob-audire',
      time: new Date().toISOString(),
      email: config.email.resendApiKey ? 'resend' : 'outbox',
      booking: config.calendlyUrl ? 'calendly' : 'internal',
    });
  }

  // ── Admin ──
  if (m('GET') && pathname === '/admin/login') return admin.showLogin(req, res);
  if (m('POST') && pathname === '/admin/login') return admin.doLogin(req, res);
  if ((m('GET') || m('POST')) && pathname === '/admin/logout') return admin.doLogout(req, res);
  if (m('GET') && pathname === '/admin') return admin.showDashboard(req, res);
  if (m('GET') && pathname === '/admin/outbox') return admin.showOutbox(req, res);

  const statusMatch = pathname.match(/^\/admin\/leads\/([^/]+)\/status$/);
  if (m('POST') && statusMatch) return admin.updateStatus(req, res, decodeURIComponent(statusMatch[1]));

  const deleteMatch = pathname.match(/^\/admin\/leads\/([^/]+)\/delete$/);
  if (m('POST') && deleteMatch) return admin.removeLead(req, res, decodeURIComponent(deleteMatch[1]));

  // ── Fallback ──
  return notFound(res, render404());
}

const server = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, config.publicBaseUrl);
  } catch {
    return notFound(res, render404());
  }
  try {
    await route(req, res, url);
  } catch (err) {
    console.error('[server] unhandled error:', err);
    if (!res.headersSent) sendHtml(res, render500(), 500);
    else res.end();
  }
});

server.listen(config.port, () => {
  console.log(`\n  ${config.siteName} is running`);
  console.log(`  ▸ Site:      ${config.publicBaseUrl}`);
  console.log(`  ▸ Admin:     ${config.publicBaseUrl}/admin  (user: ${config.admin.user})`);
  console.log(`  ▸ Email:     ${config.email.resendApiKey ? 'Resend (live)' : 'Outbox (demo, data/outbox.json)'}`);
  console.log(`  ▸ Booking:   ${config.calendlyUrl ? 'Calendly embed' : 'Internal request form'}`);
  console.log(`  ▸ Follow-up: Email 2 after ${config.email.followupDelayHours}h\n`);

  // Start the background follow-up scheduler.
  startScheduler({ intervalMs: 60_000 });
});

export default server;
