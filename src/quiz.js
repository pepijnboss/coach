// Intake-check-in + persoonlijke spiegeling voor Ob-Audire.
//
// TOON (afgedwongen in de teksten hieronder):
//  - Geen medische claims, geen diagnose-taal.
//  - Warm, zacht, bevestigend. Nooit pusherig of alarmerend.
//  - De uitkomst legt mild uit hoe begeleiding kan helpen en nodigt (zonder
//    druk) uit tot een vrijblijvend kennismakingsgesprek.

import content from './content.js';

export const QUIZ = {
  id: 'ob-audire-checkin-v1',
  steps: [
    {
      id: 'intent',
      type: 'single',
      question: 'Wat brengt je hier?',
      help: 'Kies wat het dichtst bij komt. Er is geen goed of fout.',
      options: [
        { value: 'kruispunt', label: 'Ik sta op een kruispunt in mijn leven' },
        { value: 'loopbaan', label: 'Ik zoek richting in mijn loopbaan' },
        { value: 'rouw', label: 'Ik draag een verlies of rouw met me mee' },
        { value: 'verbinding', label: 'Ik verlang naar meer verbinding met mezelf' },
        { value: 'kanker', label: 'Ik leef met kanker, of mijn partner is ziek' },
        { value: 'anders', label: 'Iets anders' },
      ],
    },
    {
      id: 'recency',
      type: 'single',
      question: 'Hoe lang speelt dit al?',
      help: 'Er is geen juiste timing voor wat je voelt.',
      options: [
        { value: 'recent', label: 'Sinds kort' },
        { value: 'maanden', label: 'Een aantal maanden' },
        { value: 'jaar', label: 'Ongeveer een jaar' },
        { value: 'langer', label: 'Langer dan een jaar' },
        { value: 'wisselend', label: 'Het komt en gaat' },
      ],
    },
    {
      id: 'intensity',
      type: 'scale',
      question: 'Hoe zwaar weegt het op dit moment?',
      help: 'Schuif naar het getal dat het dichtst voelt. 1 is licht, 10 is overweldigend.',
      min: 1,
      max: 10,
      minLabel: 'Licht',
      maxLabel: 'Overweldigend',
    },
    {
      id: 'struggles',
      type: 'multi',
      question: 'Wat herken je het meest?',
      help: 'Kies zoveel als voor jou waar is.',
      options: [
        { value: 'vastlopen', label: 'Vastlopen of niet weten welke kant op' },
        { value: 'kwijt', label: 'Het gevoel mezelf kwijt te zijn' },
        { value: 'verdriet', label: 'Verdriet of gemis' },
        { value: 'onrust', label: 'Onrust of piekeren' },
        { value: 'lichaam', label: 'Spanning in mijn lichaam' },
        { value: 'stilte', label: 'Behoefte aan stilte en ruimte' },
        { value: 'stappen', label: 'Verlangen naar nieuwe stappen' },
        { value: 'keuzes', label: 'Moeite met keuzes maken' },
      ],
    },
    {
      id: 'talkedBefore',
      type: 'single',
      question: 'Heb je hier eerder met iemand over gesproken?',
      help: 'Welk antwoord je ook geeft, je bent hier welkom.',
      options: [
        { value: 'nee', label: 'Nee, niet echt' },
        { value: 'naasten', label: 'Een beetje, met naasten' },
        { value: 'professional', label: 'Ja, met een professional' },
      ],
    },
    {
      id: 'longing',
      type: 'single',
      question: 'Waar verlang je het meest naar?',
      help: 'Volg wat zich als eerste aandient.',
      options: [
        { value: 'gehoord', label: 'Gehoord worden' },
        { value: 'helderheid', label: 'Helderheid' },
        { value: 'rust', label: 'Rust' },
        { value: 'richting', label: 'Richting' },
        { value: 'stappen', label: 'Nieuwe stappen zetten' },
        { value: 'voelen', label: 'Ruimte om te voelen' },
      ],
    },
  ],
};

const INTENT_PHRASE = {
  kruispunt: 'dat je op een kruispunt staat in je leven',
  loopbaan: 'dat je richting zoekt in je loopbaan',
  rouw: 'dat je een verlies met je meedraagt',
  verbinding: 'dat je verlangt naar meer verbinding met jezelf',
  kanker: 'dat je leeft met kanker, of dat je partner ziek is',
  anders: 'dat er iets is dat je diep bezighoudt',
};

const STRUGGLE_LABEL = {
  vastlopen: 'het gevoel vast te lopen',
  kwijt: 'het gevoel jezelf kwijt te zijn',
  verdriet: 'verdriet of gemis',
  onrust: 'onrust of piekeren',
  lichaam: 'spanning in je lichaam',
  stilte: 'een behoefte aan stilte en ruimte',
  stappen: 'een verlangen naar nieuwe stappen',
  keuzes: 'moeite met keuzes maken',
};

const LONGING_PARA = {
  gehoord:
    'Je gaf aan dat je vooral verlangt om gehoord te worden. Dat is precies waar Ob-Audire voor staat: aandachtig luisteren, zodat er ruimte ontstaat voor wat er werkelijk in je leeft.',
  helderheid:
    'Je verlangt naar helderheid. Samen kunnen we patronen herkennen en betekenis geven aan wat je ervaart, zodat het beeld langzaam scherper wordt.',
  rust:
    'Je verlangt naar rust. In een veilige ruimte mag het dagelijkse "moeten" even wegvallen — je mag landen en vertragen.',
  richting:
    'Je verlangt naar richting. Met jouw verhaal als kompas zoeken we naar keuzes die passen bij wie je werkelijk bent.',
  stappen:
    'Je verlangt naar nieuwe stappen. We maken samen de vertaalslag van innerlijke beweging naar concrete, haalbare stappen.',
  voelen:
    'Je verlangt naar ruimte om te voelen. Via aandacht voor het lichaam en wat zich aandient, ontstaat ruimte voor inzicht en beweging.',
};

/**
 * Genereer een warme, persoonlijke, niet-klinische spiegeling uit de antwoorden.
 * @param {object} answers  { intent, recency, intensity, struggles[], talkedBefore, longing }
 */
export function generateResult(answers = {}) {
  const intensity = Math.max(1, Math.min(10, parseInt(answers.intensity, 10) || 5));
  const struggles = Array.isArray(answers.struggles) ? answers.struggles : [];
  const intent = answers.intent || 'anders';
  const longing = answers.longing || 'gehoord';
  const talked = answers.talkedBefore || 'nee';

  let band;
  if (intensity <= 3) band = 'licht';
  else if (intensity <= 6) band = 'merkbaar';
  else band = 'zwaar';

  const intentPhrase = INTENT_PHRASE[intent] || INTENT_PHRASE.anders;
  const struggleNames = struggles.map((s) => STRUGGLE_LABEL[s]).filter(Boolean);

  const headline = {
    licht: 'Fijn dat je even hebt stilgestaan bij jezelf.',
    merkbaar: 'Wat je met je meedraagt, mag er zijn.',
    zwaar: 'Het vraagt moed om stil te staan bij wat zo zwaar weegt.',
  }[band];

  // ── Opening ──
  const opening =
    `Je deelde ${intentPhrase}. ` +
    (band === 'zwaar'
      ? 'Op dit moment lijken de gevoelens dicht aan de oppervlakte te liggen en moeilijk alleen te dragen. Dat is een begrijpelijke reactie — geen teken van zwakte.'
      : band === 'merkbaar'
        ? 'Zulke processen verlopen zelden in een rechte lijn; het is logisch dat sommige dagen zwaarder voelen dan andere.'
        : 'Ook als iets zachter aanwezig is, verdient het aandacht en zorg — ook die van jou.');

  // ── Worstelingen ──
  let strugglePara = '';
  if (struggleNames.length) {
    const list =
      struggleNames.length === 1
        ? struggleNames[0]
        : `${struggleNames.slice(0, -1).join(', ')} en ${struggleNames[struggleNames.length - 1]}`;
    strugglePara =
      `Je herkent vooral ${list}. ` +
      'Dit zijn veelvoorkomende manieren waarop innerlijke beweging zich laat voelen — in het hoofd én in het lichaam. Je bent hierin niet alleen.';
  }

  // ── Verlangen ──
  const longingPara = LONGING_PARA[longing] || LONGING_PARA.gehoord;

  // ── Aanpak (geen medische claims) ──
  const approachPara =
    talked === 'professional'
      ? 'Je hebt eerder met een professional gesproken. De begeleiding van Petra is net iets anders: geen behandeling, maar een afgestemde, betrokken reis — intuïtief, verdiepend en creatief, in jouw tempo.'
      : 'De begeleiding van Petra is geen behandeling of standaardtraject, maar een afgestemde reis: een veilige ruimte om te onderzoeken, te voelen en te groeien — intuïtief, verdiepend en creatief, in jouw tempo.';

  // ── Eventuele atelier-routing ──
  let atelierPara = '';
  if (intent === 'kanker') {
    atelierPara =
      'Omdat je leeft met kanker of partner bent van iemand die ziek is, mag je ook weten dat er het (K)ankeratelier is: een kleine, creatieve ochtend waar je in rust iets met je handen kunt doen. Niets hoeft, alles mag.';
  }

  const invitation =
    'Als het goed voelt, ben je van harte welkom voor een vrijblijvend kennismakingsgesprek. ' +
    'Er is niets om voor te bereiden en niets om te bewijzen — gewoon een eerste kennismaking, om te voelen of het klikt.';

  const summary =
    `Aanleiding: ${intentPhrase}. Zwaarte ${intensity}/10 (${band}). ` +
    `Herkent: ${struggleNames.join(', ') || 'niet gespecificeerd'}. ` +
    `Eerder gesproken: ${talked}. Verlangt naar: ${longing}.`;

  return {
    band,
    intensity,
    headline,
    paragraphs: [opening, strugglePara, longingPara, approachPara, atelierPara].filter(Boolean),
    invitation,
    summary,
    ctaLabel: content.cta.book,
    isAtelier: intent === 'kanker',
  };
}
