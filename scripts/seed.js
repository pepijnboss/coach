// Voeg een paar voorbeeld-aanvragen toe zodat het dashboard niet leeg is.
// Gebruik: npm run seed

import { createLead, updateLead } from '../src/leads.js';
import { generateResult } from '../src/quiz.js';

const samples = [
  {
    name: 'Marieke Jansen',
    email: 'marieke@example.com',
    phone: '06 12345678',
    answers: { intent: 'rouw', recency: 'maanden', intensity: 8, struggles: ['verdriet', 'onrust', 'lichaam'], talkedBefore: 'nee', longing: 'gehoord' },
    status: 'new',
  },
  {
    name: 'Tom de Boer',
    email: 'tom@example.com',
    phone: '',
    answers: { intent: 'loopbaan', recency: 'jaar', intensity: 5, struggles: ['vastlopen', 'keuzes'], talkedBefore: 'naasten', longing: 'richting' },
    status: 'contacted',
  },
  {
    name: 'Sofie Willems',
    email: 'sofie@example.com',
    phone: '06 87654321',
    answers: { intent: 'kanker', recency: 'recent', intensity: 7, struggles: ['stilte', 'lichaam'], talkedBefore: 'professional', longing: 'rust' },
    status: 'booked',
  },
];

const run = async () => {
  for (const s of samples) {
    const result = generateResult(s.answers);
    const lead = await createLead({
      name: s.name,
      email: s.email,
      phone: s.phone || null,
      consent: true,
      answers: s.answers,
      result,
      source: 'seed',
    });
    const patch = { status: s.status };
    if (s.status === 'booked') {
      patch.booking = { type: 'internal-request', preference: 'doordeweeks-avond', requestedAt: new Date().toISOString() };
    }
    await updateLead(lead.id, patch);
    console.log(`seeded: ${s.name} (${s.status})`);
  }
  console.log('\nKlaar. Start de server en open /admin om ze te bekijken.');
};

run();
