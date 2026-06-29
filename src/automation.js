// Follow-up automation orchestrator.
//
// Responsibilities:
//   - When a new lead arrives: send the immediate welcome email, notify the
//     coach, and schedule the 48h follow-up.
//   - On a timer (and on startup): send any follow-ups that have come due.
//
// In a Next.js/serverless deployment this loop would be a cron job / queue;
// here it is a simple in-process interval, which is correct for a single node.

import config from './config.js';
import { hoursFromNow, now } from './util.js';
import { patchLeadEmails, findDueFollowups } from './leads.js';
import { sendWelcome, sendFollowup, sendCoachNotification } from './email.js';

/** Fire the immediate side-effects for a freshly created lead. */
export async function onNewLead(lead) {
  // 1. Immediate welcome email (Email 1)
  try {
    const rec = await sendWelcome(lead);
    if (rec?.status === 'sent') {
      await patchLeadEmails(lead.id, { welcomeSentAt: now() });
    }
  } catch (err) {
    console.error('[automation] welcome email failed:', err);
  }

  // 2. Schedule the 48h follow-up (Email 2)
  await patchLeadEmails(lead.id, {
    followupScheduledFor: hoursFromNow(config.email.followupDelayHours),
  });

  // 3. Notify the coach (lead routing -> single coach)
  try {
    const rec = await sendCoachNotification(lead);
    if (rec?.status === 'sent') {
      await patchLeadEmails(lead.id, { coachNotifiedAt: now() });
    }
  } catch (err) {
    console.error('[automation] coach notification failed:', err);
  }
}

/** Send all follow-up emails that are now due. Safe to call repeatedly. */
export async function processFollowups() {
  const due = await findDueFollowups();
  let sent = 0;
  for (const lead of due) {
    try {
      const rec = await sendFollowup(lead);
      if (rec?.status === 'sent') {
        await patchLeadEmails(lead.id, { followupSentAt: now() });
        sent += 1;
      }
    } catch (err) {
      console.error(`[automation] follow-up failed for ${lead.id}:`, err);
    }
  }
  if (sent) console.log(`[automation] sent ${sent} follow-up email(s)`);
  return sent;
}

let timer = null;

/** Start the background scheduler. Returns a stop function. */
export function startScheduler({ intervalMs = 60_000 } = {}) {
  // Run once shortly after boot to catch anything due during downtime.
  setTimeout(() => processFollowups().catch(() => {}), 3_000);
  timer = setInterval(() => processFollowups().catch(() => {}), intervalMs);
  if (timer.unref) timer.unref();
  return () => clearInterval(timer);
}
