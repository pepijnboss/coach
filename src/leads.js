// Lead service — the heart of the funnel.
//
// A "lead" represents a person who completed the intake and shared their
// contact details. It carries their quiz answers, the generated result, and
// the lifecycle of follow-up communication + booking status.
//
// Designed for a SINGLE coach now, but every lead stores `assignedCoachId`
// so routing to multiple coaches later is a data change, not a rewrite.

import { JsonCollection } from './db.js';
import { uid, now, clampString, isValidEmail, isValidPhone } from './util.js';

const collection = new JsonCollection('leads', { items: [] });

// The single coach all leads are routed to initially.
export const DEFAULT_COACH = {
  id: 'coach-anna',
  name: 'Anna de Vries',
};

/**
 * Validate + normalise the lead capture payload.
 * @returns {{ok: true, value: object} | {ok: false, errors: object}}
 */
export function validateLeadInput(input = {}) {
  const errors = {};
  const name = clampString(input.name, 120).trim();
  const email = clampString(input.email, 200).trim().toLowerCase();
  const phone = clampString(input.phone, 40).trim();
  const consent = input.consent === true || input.consent === 'true' || input.consent === 'on';

  if (name.length < 2) errors.name = 'Please share the name we can address you by.';
  if (!isValidEmail(email)) errors.email = 'Please enter an email address we can reach you at.';
  if (phone && !isValidPhone(phone)) errors.phone = 'That phone number does not look right.';
  if (!consent) errors.consent = 'We need your permission to store your details and contact you.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, phone: phone || null, consent } };
}

/**
 * Create and persist a new lead.
 * @param {object} payload  { name, email, phone, consent, answers, result, source }
 */
export async function createLead(payload) {
  const lead = {
    id: uid('lead_'),
    createdAt: now(),
    updatedAt: now(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    consent: !!payload.consent,
    source: payload.source || 'intake-quiz',

    // Quiz data
    answers: payload.answers || {},
    result: payload.result || null,

    // Routing — single coach today, multi-coach ready.
    assignedCoachId: DEFAULT_COACH.id,
    assignedCoachName: DEFAULT_COACH.name,

    // Funnel lifecycle
    status: 'new', // new -> contacted -> booked -> completed -> archived
    booking: null, // { type, when, calendlyEvent, requestedAt }

    // Email automation lifecycle
    emails: {
      welcomeSentAt: null,
      followupScheduledFor: null,
      followupSentAt: null,
      coachNotifiedAt: null,
    },
  };

  await collection.update((doc) => {
    doc.items.push(lead);
  });

  return lead;
}

export async function listLeads({ status } = {}) {
  const doc = await collection.read();
  let items = doc.items.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (status) items = items.filter((l) => l.status === status);
  return items;
}

export async function getLead(id) {
  const doc = await collection.read();
  return doc.items.find((l) => l.id === id) || null;
}

export async function updateLead(id, patch) {
  return collection.update((doc) => {
    const lead = doc.items.find((l) => l.id === id);
    if (!lead) return null;
    Object.assign(lead, patch, { updatedAt: now() });
    return lead;
  });
}

/** Deep-merge helper for the nested email lifecycle object. */
export async function patchLeadEmails(id, emailPatch) {
  return collection.update((doc) => {
    const lead = doc.items.find((l) => l.id === id);
    if (!lead) return null;
    lead.emails = { ...lead.emails, ...emailPatch };
    lead.updatedAt = now();
    return lead;
  });
}

/** Find leads whose follow-up email is due and not yet sent. */
export async function findDueFollowups(atIso = now()) {
  const doc = await collection.read();
  return doc.items.filter(
    (l) =>
      l.emails?.followupScheduledFor &&
      !l.emails?.followupSentAt &&
      l.emails.followupScheduledFor <= atIso &&
      l.status !== 'archived'
  );
}

export async function stats() {
  const doc = await collection.read();
  const items = doc.items;
  const by = (pred) => items.filter(pred).length;
  return {
    total: items.length,
    new: by((l) => l.status === 'new'),
    contacted: by((l) => l.status === 'contacted'),
    booked: by((l) => l.status === 'booked' || !!l.booking),
    last7Days: by((l) => Date.now() - new Date(l.createdAt).getTime() < 7 * 864e5),
  };
}

export async function deleteLead(id) {
  // GDPR: support full erasure of a person's record.
  return collection.update((doc) => {
    const before = doc.items.length;
    doc.items = doc.items.filter((l) => l.id !== id);
    return before !== doc.items.length;
  });
}
