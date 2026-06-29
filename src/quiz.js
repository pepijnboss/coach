// Intake questionnaire definition + personalised result generation.
//
// IMPORTANT TONE RULES (enforced by the copy below):
//  - No medical claims, no diagnosis language.
//  - Warm, calm, validating. Never salesy or alarmist.
//  - The result gently explains how grief coaching *may* help and invites
//    (never pressures) the person to book a free conversation.

export const QUIZ = {
  id: 'rouwkompas-intake-v1',
  steps: [
    {
      id: 'recency',
      type: 'single',
      question: 'When did your loss happen?',
      help: 'There is no right or wrong timing for grief.',
      options: [
        { value: 'recent', label: 'Within the last few weeks' },
        { value: 'months', label: 'A few months ago' },
        { value: 'year', label: 'About a year ago' },
        { value: 'long', label: 'More than a year ago' },
        { value: 'ongoing', label: 'It is ongoing / hard to say' },
      ],
    },
    {
      id: 'kind',
      type: 'single',
      question: 'What kind of loss are you carrying?',
      help: 'Loss takes many forms. Choose what fits best.',
      options: [
        { value: 'death', label: 'The death of someone I love' },
        { value: 'divorce', label: 'A divorce or the end of a relationship' },
        { value: 'trauma', label: 'A trauma or sudden life change' },
        { value: 'health', label: 'A loss of health or independence' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      id: 'intensity',
      type: 'scale',
      question: 'How intense does your emotional distress feel right now?',
      help: 'Drag to the number that feels closest. 1 is gentle, 10 is overwhelming.',
      min: 1,
      max: 10,
      minLabel: 'Gentle',
      maxLabel: 'Overwhelming',
    },
    {
      id: 'struggles',
      type: 'multi',
      question: 'What do you struggle with most at the moment?',
      help: 'Choose as many as feel true for you.',
      options: [
        { value: 'sleep', label: 'Sleep' },
        { value: 'sadness', label: 'Waves of sadness' },
        { value: 'isolation', label: 'Feeling alone or isolated' },
        { value: 'guilt', label: 'Guilt or regret' },
        { value: 'anger', label: 'Anger or frustration' },
        { value: 'meaning', label: 'Finding meaning again' },
        { value: 'focus', label: 'Concentration or daily tasks' },
        { value: 'numbness', label: 'Feeling numb or disconnected' },
      ],
    },
    {
      id: 'talkedBefore',
      type: 'single',
      question: 'Have you talked to someone about it before?',
      help: 'There is no wrong answer here.',
      options: [
        { value: 'no', label: 'No, not really' },
        { value: 'friends', label: 'A little, with friends or family' },
        { value: 'professional', label: 'Yes, with a professional' },
      ],
    },
    {
      id: 'supported',
      type: 'single',
      question: 'Do you feel supported right now?',
      help: 'However you answer, you are welcome here.',
      options: [
        { value: 'yes', label: 'Mostly, yes' },
        { value: 'somewhat', label: 'Somewhat' },
        { value: 'no', label: 'Not really' },
      ],
    },
  ],
};

const KIND_LABEL = {
  death: 'the death of someone you love',
  divorce: 'the end of a relationship',
  trauma: 'a sudden and difficult change',
  health: 'a loss of health or independence',
  other: 'a loss that matters deeply to you',
};

const STRUGGLE_LABEL = {
  sleep: 'rest and sleep',
  sadness: 'waves of sadness',
  isolation: 'feeling alone',
  guilt: 'guilt or regret',
  anger: 'anger or frustration',
  meaning: 'finding meaning again',
  focus: 'focus in daily life',
  numbness: 'feeling numb',
};

function listToSentence(items) {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Generate a warm, personalised, non-clinical result from quiz answers.
 * Returns a structured object so the UI can render it consistently.
 *
 * @param {object} answers  { recency, kind, intensity, struggles[], talkedBefore, supported }
 */
export function generateResult(answers = {}) {
  const intensity = Math.max(1, Math.min(10, parseInt(answers.intensity, 10) || 5));
  const struggles = Array.isArray(answers.struggles) ? answers.struggles : [];
  const kind = answers.kind || 'other';
  const supported = answers.supported || 'somewhat';
  const talked = answers.talkedBefore || 'no';

  // A gentle "band" — never framed as a clinical severity score.
  let band;
  if (intensity <= 3) band = 'tender';
  else if (intensity <= 6) band = 'heavy';
  else band = 'overwhelming';

  const kindPhrase = KIND_LABEL[kind] || KIND_LABEL.other;
  const struggleNames = struggles.map((s) => STRUGGLE_LABEL[s]).filter(Boolean);

  // ── Headline ──
  const headline = {
    tender: 'Thank you for pausing to check in with yourself.',
    heavy: 'What you are carrying sounds genuinely heavy.',
    overwhelming: 'It takes real courage to reach out when things feel this much.',
  }[band];

  // ── Opening paragraph (acknowledgement) ──
  const opening =
    `You shared that you are living with ${kindPhrase}. ` +
    (band === 'overwhelming'
      ? 'Right now it sounds like the feelings are close to the surface and hard to hold alone. That is an understandable response to loss — not a weakness.'
      : band === 'heavy'
        ? 'Grief like this rarely moves in a straight line, and it makes sense that some days feel much harder than others.'
        : 'Even when grief feels quieter, it deserves care and attention — including yours.');

  // ── Struggles paragraph ──
  let strugglePara = '';
  if (struggleNames.length) {
    strugglePara =
      `You mentioned that ${listToSentence(struggleNames)} ${struggleNames.length === 1 ? 'is' : 'are'} weighing on you most. ` +
      'These are some of the most common ways grief shows up in the body and mind, and you are far from alone in feeling them.';
  }

  // ── Support paragraph ──
  let supportPara = '';
  if (supported === 'no') {
    supportPara =
      'You also said you do not feel very supported right now. Having even one steady, understanding person to talk to can make a real difference — and that is exactly what a free conversation is for.';
  } else if (supported === 'somewhat') {
    supportPara =
      'You have some support around you, which is good. Sometimes, though, it helps to talk with someone outside your circle who can simply listen without needing anything from you.';
  } else {
    supportPara =
      'It is good that you feel some support around you. A conversation with a grief coach can sit alongside that, offering space that is just for you.';
  }

  // ── How coaching may help (NO medical claims) ──
  const coachingPara =
    talked === 'professional'
      ? 'You have spoken with a professional before. Grief coaching is a little different — it is not therapy or treatment, but a supportive, practical companionship through loss, at your own pace.'
      : 'Grief coaching is not therapy or medical treatment. It is a calm, supportive space to be heard, to make sense of what you feel, and to find small, gentle steps forward — entirely at your own pace.';

  // ── Invitation (gentle CTA copy) ──
  const invitation =
    'If it feels right, you are warmly invited to a free, no-obligation 30-minute conversation. ' +
    'There is nothing to prepare and nothing to prove — just a chance to talk and see if it helps.';

  // A short, scannable summary for the lead record + admin view.
  const summary =
    `Loss: ${kindPhrase}. Distress ${intensity}/10 (${band}). ` +
    `Struggles: ${struggleNames.join(', ') || 'not specified'}. ` +
    `Talked before: ${talked}. Feels supported: ${supported}.`;

  return {
    band,
    intensity,
    headline,
    paragraphs: [opening, strugglePara, supportPara, coachingPara].filter(Boolean),
    invitation,
    summary,
    ctaLabel: 'Book a free 30-minute conversation',
  };
}
