// Seed a few example leads so the admin dashboard is not empty in a demo.
// Usage: npm run seed

import { createLead, updateLead } from '../src/leads.js';
import { generateResult } from '../src/quiz.js';

const samples = [
  {
    name: 'Marieke Jansen',
    email: 'marieke@example.com',
    phone: '+31 6 12345678',
    answers: { recency: 'months', kind: 'death', intensity: 8, struggles: ['sleep', 'sadness', 'isolation'], talkedBefore: 'no', supported: 'no' },
    status: 'new',
  },
  {
    name: 'Tom de Boer',
    email: 'tom@example.com',
    phone: '',
    answers: { recency: 'year', kind: 'divorce', intensity: 5, struggles: ['meaning', 'focus'], talkedBefore: 'friends', supported: 'somewhat' },
    status: 'contacted',
  },
  {
    name: 'Sofie Willems',
    email: 'sofie@example.com',
    phone: '+32 470 00 00 00',
    answers: { recency: 'recent', kind: 'trauma', intensity: 9, struggles: ['numbness', 'anger', 'sleep'], talkedBefore: 'professional', supported: 'yes' },
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
      patch.booking = { type: 'internal-request', preference: 'weekday-evening', requestedAt: new Date().toISOString() };
    }
    await updateLead(lead.id, patch);
    console.log(`seeded: ${s.name} (${s.status})`);
  }
  console.log('\nDone. Start the server and open /admin to view them.');
};

run();
