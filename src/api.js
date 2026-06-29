// JSON API handlers for the public funnel.

import { sendJson, readBody } from './http.js';
import { validateLeadInput, createLead, getLead, updateLead } from './leads.js';
import { generateResult, QUIZ } from './quiz.js';
import { onNewLead } from './automation.js';
import { clampString, isValidEmail, now } from './util.js';

const VALID_STEP_IDS = new Set(QUIZ.steps.map((s) => s.id));

/** Normalise/whitelist the answers object coming from the client. */
function sanitizeAnswers(input = {}) {
  const a = {};
  for (const step of QUIZ.steps) {
    const v = input[step.id];
    if (v === undefined || v === null) continue;
    if (step.type === 'multi') {
      const arr = Array.isArray(v) ? v : [v];
      a[step.id] = arr.map((x) => clampString(x, 40)).filter(Boolean).slice(0, 12);
    } else if (step.type === 'scale') {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n)) a[step.id] = Math.max(step.min, Math.min(step.max, n));
    } else {
      a[step.id] = clampString(v, 60);
    }
  }
  return a;
}

// POST /api/lead  — lead capture + result generation + automation
export async function handleCreateLead(req, res) {
  const body = await readBody(req);

  const validation = validateLeadInput(body);
  if (!validation.ok) {
    return sendJson(res, { ok: false, errors: validation.errors }, 422);
  }

  const answers = sanitizeAnswers(body.answers || {});
  const result = generateResult(answers);

  const lead = await createLead({
    ...validation.value,
    answers,
    result,
    source: clampString(body.source || 'intake-quiz', 40),
  });

  // Fire-and-forget automation (welcome email, coach notification, schedule
  // follow-up). We await so the welcome state is set before responding, but
  // wrap so a delivery hiccup never blocks the user's progress.
  try {
    await onNewLead(lead);
  } catch (err) {
    console.error('[api] automation error:', err);
  }

  return sendJson(res, { ok: true, leadId: lead.id, redirect: `/resultaat/${lead.id}` }, 201);
}

// POST /api/booking-request — internal booking fallback (no Calendly configured)
export async function handleBookingRequest(req, res) {
  const body = await readBody(req);
  const name = clampString(body.name, 120).trim();
  const email = clampString(body.email, 200).trim().toLowerCase();
  const preference = clampString(body.preference, 40);
  const note = clampString(body.note, 1000);

  if (name.length < 2 || !isValidEmail(email)) {
    return sendJson(res, { ok: false, errors: { form: 'Please provide your name and a valid email.' } }, 422);
  }

  const booking = {
    type: 'internal-request',
    preference: preference || null,
    note: note || null,
    requestedAt: now(),
  };

  let leadId = clampString(body.leadId, 60);
  if (leadId) {
    const existing = await getLead(leadId);
    if (existing) {
      await updateLead(leadId, { booking, status: 'booked' });
    } else {
      leadId = '';
    }
  }

  if (!leadId) {
    // Booking came in directly (e.g. via the secondary CTA) without a prior
    // quiz lead — still capture it as a lead so nothing is lost.
    const lead = await createLead({
      name,
      email,
      consent: true,
      source: 'direct-booking',
      answers: {},
      result: null,
    });
    await updateLead(lead.id, { booking, status: 'booked' });
    leadId = lead.id;
    try {
      await onNewLead(lead);
    } catch (err) {
      console.error('[api] automation error (direct booking):', err);
    }
  }

  return sendJson(res, { ok: true, leadId }, 201);
}

export { VALID_STEP_IDS };
