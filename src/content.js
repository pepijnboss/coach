// ─────────────────────────────────────────────────────────────────────────
// Central content configuration for Ob-Audire (Petra Mollet).
//
// This is the SINGLE SOURCE OF TRUTH for all site copy, branding and contact
// details. Everything the visitor reads lives here, in Dutch, in Petra's tone.
// To tweak wording, prices, contact details or links: edit this file only.
//
// Brand essence: "Ob-Audire" — audire = luisteren. A safe, gentle place where
// "woorden nog geboren mogen worden". The recurring image is de mol (the mole)
// that carefully leaves her burrow — you may come out with your story too.
// ─────────────────────────────────────────────────────────────────────────

export const content = {
  // ── Brand & contact ──────────────────────────────────────────────────────
  brand: {
    name: 'Ob-Audire',
    coach: 'Petra Mollet',
    // Shown under the logo / in the hero
    tagline: 'Een plek waar woorden nog geboren mogen worden',
    // One-line essence used in meta descriptions
    essence:
      'Begeleiding bij persoonlijke ontwikkeling, loopbaan, rouw en transitie — met aandachtig luisteren als kompas.',
    // The signature metaphor
    mole:
      'Net zoals de mol voorzichtig haar hol verlaat, mag jij hier tevoorschijn komen met jouw verhaal. Niet alles hoeft al uitgesproken te zijn.',
  },

  // NOTE: vul de echte gegevens hieronder in (nu nog voorbeeldwaarden).
  contact: {
    email: 'info@ob-audire.nl',
    phone: '06 - 12 34 56 78',
    // WhatsApp is een laagdrempelig leadkanaal in NL. Vul het nummer in
    // internationaal formaat in (bijv. 31612345678) om de knop te tonen; leeg = verborgen.
    whatsapp: '',
    region: 'Regio Gemert-Bakel & Laarbeek (Noord-Brabant)',
    workArea: 'Online en op locatie',
    website: 'https://ob-audire.nl',
  },

  // De externe site van Petra waar we leads naartoe doorverwijzen.
  externalSite: {
    url: 'https://ob-audire.nl',
    label: 'ob-audire.nl',
  },

  // The single goal of the funnel.
  cta: {
    primary: 'Doe de korte check-in',
    secondary: 'Plan een kennismakingsgesprek',
    book: 'Plan een vrijblijvend kennismakingsgesprek',
    bookShort: 'Kennismaken',
    visitSite: 'Bekijk de praktijk van Petra',
    toSite: 'Ga naar ob-audire.nl',
  },

  // ── Navigation (route paths are Dutch) ────────────────────────────────────
  routes: {
    home: '/',
    quiz: '/check-in',
    about: '/wie-ben-ik',
    aanbod: '/aanbod',
    privacy: '/privacy',
    booking: '/afspraak',
    result: '/resultaat', // + /:id
  },

  // ── Landing page (lead-funnel die doorverwijst naar Ob-Audire) ─────────────
  landing: {
    eyebrow: 'Een zachte eerste stap',
    heroTitle: 'Een luisterend oor, wanneer jij er klaar voor bent',
    heroLede:
      'Sta je op een kruispunt, draag je een verlies, of verlang je naar meer verbinding met jezelf? Doe de korte check-in. Je ontvangt een persoonlijke spiegeling — en we brengen je in contact met Petra Mollet van Ob-Audire.',
    heroNote: 'Vrijblijvend · Vertrouwelijk · In jouw tempo · Ongeveer 2 minuten',
    freeOffer: 'Het kennismakingsgesprek van 30 minuten is gratis en vrijblijvend.',

    // Maakt expliciet dat dit een opstap is naar Petra's praktijk.
    referralTitle: 'Wat is deze pagina?',
    referralBody:
      'Dit is een warme eerste stap naar Ob-Audire, de praktijk van Petra Mollet. In twee minuten help je jezelf op weg met een korte check-in. Daarna verbinden we je met Petra — voor een vrijblijvend kennismakingsgesprek of om rustig verder te lezen op haar website.',

    introTitle: 'Over Ob-Audire',
    introBody:
      'Ob-Audire — van het Latijnse audire, luisteren — is de praktijk van Petra Mollet. Geen standaardtraject, maar een afgestemde reis met jouw verhaal als kompas. Petra combineert haar ervaring als HR-adviseur en loopbaancoach met opleiding tot rouw- en verliesbegeleider.',

    howTitle: 'Hoe het werkt',
    steps: [
      {
        icon: '🧭',
        title: '1. Een korte check-in',
        body: 'Beantwoord een paar zachte vragen over wat er bij je speelt. Er zijn geen goede of foute antwoorden.',
      },
      {
        icon: '🌱',
        title: '2. Een persoonlijke spiegeling',
        body: 'Je ontvangt een warme, persoonlijke weerspiegeling van wat je deelde — en hoe begeleiding je kan helpen.',
      },
      {
        icon: '🤝',
        title: '3. Een kennismakingsgesprek',
        body: 'Als het goed voelt, plan je een vrijblijvend kennismakingsgesprek met Petra. Geen druk, nooit.',
      },
    ],

    coachTeaserTitle: 'Je spreekt met een echt mens',
    coachTeaserBody:
      'Petra Mollet biedt een veilige ruimte waarin het dagelijkse "moeten" even mag wegvallen. Je mag landen, vertragen en ruimte maken voor wat er in jou leeft — ook als dat nog niet in woorden te vangen is.',

    closingTitle: 'Wanneer jij er klaar voor bent',
    closingBody: 'Er is geen tijdpad waar je je aan hoeft te houden. Deze ruimte blijft open voor jou.',
  },

  // ── Wie ben ik / About ─────────────────────────────────────────────────────
  about: {
    eyebrow: 'Over Petra',
    title: 'Petra Mollet',
    role: 'HR-adviseur & begeleider van persoonlijke ontwikkelingsprocessen',
    // Korte teaser voor de lead-pagina; het volledige verhaal staat op ob-audire.nl.
    teaser: [
      'Petra Mollet begeleidt mensen die op een kruispunt staan in hun leven of loopbaan, en die verlangen naar meer verbinding met zichzelf. Haar werkwijze is intuïtief, verdiepend en creatief.',
      'Ze combineert haar ervaring als HR-adviseur en loopbaancoach met haar opleiding tot rouw- en verliesbegeleider. Geen standaardtraject, maar een afgestemde reis — met jouw verhaal als kompas.',
    ],
    teaserFocus: [
      'Persoonlijke ontwikkeling & verbinding met jezelf',
      'Loopbaanbegeleiding bij keuzes en verandering',
      'Rouw, verlies en ondersteuning bij transitie',
    ],
    intro: [
      'Ik ben Petra Mollet, HR-adviseur en begeleider van persoonlijke ontwikkelingsprocessen. Vanuit mijn eigen innerlijke reis heb ik geleerd hoe belangrijk het is om ruimte te maken voor de binnenwereld — voor de vragen, emoties en beelden die ons richting geven, ook als ze niet direct zichtbaar zijn.',
      'Mijn werkwijze is intuïtief, verdiepend en creatief. Ik werk met mensen die op een kruispunt staan in hun leven of loopbaan, en die verlangen naar meer verbinding met zichzelf. Daarbij combineer ik mijn professionele ervaring in HR met mijn vermogen om te luisteren naar wat onder de oppervlakte speelt. Ik help je om patronen te herkennen, betekenis te geven aan wat je ervaart, en keuzes te maken die passen bij wie je werkelijk bent.',
      'Wat mij onderscheidt is mijn vermogen om complexe processen te begeleiden met betrokkenheid, helderheid en diepgang. Ik werk met symboliek, verbeelding en lichaamsbewustzijn als ingang tot inzicht en verandering. Mijn begeleiding is geen standaardtraject, maar een afgestemde reis — met jouw verhaal als kompas.',
      'Of je nu op zoek bent naar persoonlijke groei, loopbaanbegeleiding, of ondersteuning bij een transitie — ik bied een veilige ruimte waarin je mag onderzoeken, voelen en groeien. Samen maken we de vertaalslag van innerlijke beweging naar concrete stappen.',
    ],

    strengthsTitle: 'Mijn kracht in jouw ontwikkeling',
    strengths: [
      {
        title: 'Fladderen — van overzicht naar detail en weer terug',
        body: 'Ik beweeg moeiteloos tussen het grote geheel en de kleine details. Als een helikopter die opstijgt om het landschap te overzien, en vervolgens landt om met aandacht te kijken wat er speelt. Zo doorgrond ik situaties snel, leg ik verbanden en analyseer ik scherp — zonder het menselijke verhaal uit het oog te verliezen.',
      },
      {
        title: 'Binnen en buiten de lijnen kleuren — creatief perspectief',
        body: 'Ik kijk met andere ogen. Soms is het nodig om buiten de gebaande paden te denken, om net dat andere perspectief aan te reiken dat beweging brengt. Creatieve werkvormen zet ik in als ze helpen — niet als doel, maar als middel om tot de kern te komen.',
      },
      {
        title: 'In en met vragen leven — het niet-weten omarmen',
        body: 'Niet alles hoeft meteen opgelost of begrepen te worden. Ik durf te dwalen, met een knapzak vol vragen. In het niet-weten schuilt vaak de grootste wijsheid. Ik begeleid mensen in het vertragen, het toelaten van verwarring, en het vinden van richting vanuit het hier en nu.',
      },
      {
        title: 'Hoofd en hart in gesprek — luisteren naar het lichaam',
        body: 'Ik geloof in de kracht van het hele mens-zijn: ruimte geven aan alles wat zich aandient — en aan wat zich nog niet laat zien. Analyse en gevoel mogen naast elkaar bestaan. Via ervaringsgerichte opdrachten ontstaat ruimte voor inzicht en beweging.',
      },
      {
        title: 'Veerkracht — licht vinden in het donker',
        body: 'Het leven heeft me geleerd hoe je in het donker het licht kunt blijven zien. Veerkracht betekent voor mij niet dat alles goed gaat, maar dat je telkens weer opstaat met betrokkenheid, moed en vertrouwen. Ik ben aanwezig, ook als het schuurt of stil wordt.',
      },
    ],

    pillarsTitle: 'Drie pijlers in mijn ontwikkeling',
    pillars: [
      {
        title: 'Personeel en Arbeid — Fontys Hogeschool (2001–2005)',
        body: 'Mijn stevige basis in HR, organisatie en mensgericht beleid. Hier begon mijn professionele pad.',
      },
      {
        title: 'Registeropleiding Loopbaancoach — Annet Brinkhuis Opleidingen (2015–2017)',
        body: 'De kunst van het begeleiden bij keuzes, verandering en groei — met oog voor wie iemand werkelijk is.',
      },
      {
        title: 'Opleiding tot rouw- en verliesbegeleider — Land van Rouw',
        body: 'Rouw als bron van wijsheid. Hier leerde ik luisteren naar wat verloren ging én wat zich opnieuw wil tonen.',
      },
    ],

    extraTrainingTitle: 'Andere betekenisvolle opleidingen',
    extraTraining: [
      'Een symfonie van ritmes — Systemisch werken met lichaam en stilte (2024)',
      'Dansen met demonen — Werken met schaduw en het ongeziene (2023–2024)',
      'Opnieuw leren reizen langs regenbogen — Visionair en breekbaar leiderschap (2023)',
      'In levenden lijve — Taal, transitie en het lijf als kompas (2022)',
      'Je levensreis met de paarden — Werken voorbij woorden (2021–2022)',
      'Magie over de drempel — Systemisch begeleiden in de diepte (2021)',
      'Morsen met het licht — Zin geven en betekenis vinden (2020–2021)',
      'En vele inspiratiedagen en masterclasses over verlies, loyaliteit, trauma en transitie.',
    ],

    experienceTitle: 'Werkervaring',
    experience: [
      'Begeleider persoonlijke ontwikkelingsprocessen — Ob-Audire (2021–heden)',
      'HR-adviseur — Gemeenten Gemert-Bakel & Laarbeek (2001–heden)',
      'Coördinator secretariaat — GGzE Eindhoven (1998–2001)',
    ],

    expectTitle: 'Wat je kunt verwachten',
    expect: [
      { title: 'Een warm welkom', body: 'We beginnen rustig. Je hoeft niets voor te bereiden en niets te bewijzen.' },
      { title: 'Ruimte om gehoord te worden', body: 'Je deelt zoveel of zo weinig als je wilt. Ik luister, volledig.' },
      { title: 'Zachte spiegeling', body: 'Samen geven we betekenis aan wat je ervaart — zonder labels, zonder oordeel.' },
      { title: 'Een passende stap', body: 'Als het helpt, vinden we één concrete, haalbare stap die bij jou past.' },
    ],
  },

  // ── Aanbod / Services ──────────────────────────────────────────────────────
  aanbod: {
    eyebrow: 'Aanbod',
    title: 'Begeleiding die zich voegt naar jouw verhaal',
    intro:
      'Mijn begeleiding is geen standaardtraject, maar een afgestemde reis. Hieronder de vormen waarin we kunnen werken. Twijfel je wat past? Begin met de korte check-in of plan een vrijblijvend kennismakingsgesprek.',
    services: [
      {
        icon: '🧭',
        title: 'Persoonlijke ontwikkeling',
        body: 'Voor wie verlangt naar meer verbinding met zichzelf. We onderzoeken patronen, geven betekenis aan wat je ervaart, en maken keuzes die passen bij wie je werkelijk bent.',
      },
      {
        icon: '💼',
        title: 'Loopbaanbegeleiding',
        body: 'Sta je op een kruispunt in je werk? Met mijn achtergrond als HR-adviseur en registerloopbaancoach begeleid ik je bij keuzes, verandering en richting.',
      },
      {
        icon: '🕯️',
        title: 'Rouw- en verliesbegeleiding',
        body: 'Bij verlies, gemis of afscheid. Als opgeleid rouw- en verliesbegeleider luister ik naar wat verloren ging én naar wat zich opnieuw wil tonen.',
      },
      {
        icon: '🌗',
        title: 'Ondersteuning bij transitie',
        body: 'Grote veranderingen vragen tijd en ruimte. Ik begeleid je in het vertragen, het toelaten van verwarring en het vinden van richting vanuit het hier en nu.',
      },
    ],

    atelier: {
      title: 'Het (K)ankeratelier',
      subtitle: 'Een plek om te ademen, te voelen en te creëren',
      intro:
        'Zoek je een plek waar je even uit de stroom van het dagelijks leven kunt stappen? Waar je in rust en stilte iets met je handen kunt doen, zonder dat er iets hoeft? Dan ben je welkom in het (K)ankeratelier van Ob-Audire.',
      expect:
        'Een kleinschalige ochtendbesteding op de laatste vrijdag van de maand, van 9.00 tot 12.30 uur. In een kleine groep (max. 4 personen) werk je aan creatieve activiteiten: tekenen, collage, mono printen met een gelplaat, graveren, hout bewerken, breien, haken, vilten en meer. Een vaste structuur biedt rust en houvast — ruimte voor stilte, gesprek, een gedicht en samen kijken naar beelden. Niets hoeft, alles mag.',
      forWho: ['Volwassenen met kanker', 'Partners van iemand met kanker'],
      price: '€ 45 per ochtend — inclusief eenvoudige materialen, koffie/thee en iets lekkers.',
      signup:
        'Heb je vragen of wil je eerst kennismaken? Neem gerust contact op via telefoon of e-mail, of plan een moment om binnen te lopen en de sfeer te proeven.',
    },
  },

  // ── Privacy / AVG ──────────────────────────────────────────────────────────
  privacy: {
    eyebrow: 'Jouw privacy telt',
    title: 'Privacy & AVG',
    intro:
      'Contact opnemen over wat je bezighoudt vraagt vertrouwen. Bij Ob-Audire ga ik zorgvuldig met je gegevens om, volgens de Algemene Verordening Gegevensbescherming (AVG).',
    sections: [
      { h: 'Wat ik verzamel', p: 'Alleen wat jij deelt: je naam, e-mailadres, een optioneel telefoonnummer en de antwoorden uit de check-in, zodat ik je een passend en zorgzaam antwoord kan geven.' },
      { h: 'Waarom (grondslag)', p: 'Ik verwerk je gegevens op basis van jouw toestemming, gegeven bij het versturen van de check-in, uitsluitend om contact met je op te nemen, een kennismakingsgesprek aan te bieden en een zachte herinnering te sturen. Ik verkoop je gegevens niet en gebruik ze niet voor advertenties.' },
      { h: 'Wie het ziet', p: 'Je gegevens worden alleen gezien door Petra Mollet. Ze worden nooit gedeeld met derden voor marketing.' },
      { h: 'Hoe lang', p: 'Ik bewaar je gegevens niet langer dan nodig om je te kunnen begeleiden, en verwijder ze daarna. Je kunt altijd vragen om verwijdering.' },
      { h: 'Jouw rechten', p: 'Je hebt recht op inzage, correctie en verwijdering van je gegevens, en je mag je toestemming intrekken. Mail daarvoor naar het adres hieronder; ik handel je verzoek snel af.' },
    ],
  },

  // ── Vertrouwen: kwalificaties (feitelijk, uit Petra's achtergrond) ──────────
  credentials: [
    'Opgeleid rouw- en verliesbegeleider (Land van Rouw)',
    'Registeropleiding Loopbaancoach',
    '20+ jaar ervaring in HR & mensgericht werk',
    'Werkt online en op locatie · regio Gemert-Bakel & Laarbeek',
  ],

  // ── Sociale bewijskracht ───────────────────────────────────────────────────
  // BELANGRIJK: vervang deze door ECHTE ervaringen van cliënten, mét hun
  // toestemming. Verzonnen reviews zijn niet toegestaan (en niet eerlijk).
  testimonials: {
    title: 'Wat mensen ervaren',
    note: 'Voorbeeldcitaten — vervang door echte ervaringen (met toestemming).',
    items: [
      { quote: 'Eindelijk iemand die echt luistert, zonder te oordelen of te haasten. Ik voelde me gezien.', name: 'Cliënt, persoonlijke begeleiding' },
      { quote: 'Petra hielp me rust en richting te vinden op een moment dat alles onduidelijk was.', name: 'Cliënt, loopbaanvraag' },
      { quote: 'Een veilige plek om mijn verdriet er te laten zijn. Dat heeft me enorm geholpen.', name: 'Cliënt, rouwbegeleiding' },
    ],
  },

  // ── Veelgestelde vragen (neemt drempels weg) ───────────────────────────────
  faq: {
    title: 'Veelgestelde vragen',
    items: [
      { q: 'Is dit therapie of een medische behandeling?', a: 'Nee. Ob-Audire biedt begeleiding: een veilige, ondersteunende ruimte. Het is geen therapie of medische behandeling, en vervangt die ook niet.' },
      { q: 'Wat kost het kennismakingsgesprek?', a: 'Het eerste kennismakingsgesprek van ongeveer 30 minuten is gratis en vrijblijvend. Je zit nergens aan vast.' },
      { q: 'Is mijn informatie vertrouwelijk?', a: 'Ja. Wat je deelt is vertrouwelijk en wordt alleen door Petra gezien. Je gegevens worden verwerkt volgens de AVG en je kunt altijd om verwijdering vragen.' },
      { q: 'Hoe verloopt een gesprek?', a: 'Rustig en zonder druk. Je hoeft niets voor te bereiden. We gaan in jouw tempo, met jouw verhaal als kompas.' },
      { q: 'Online of op locatie?', a: 'Allebei kan. Petra werkt online en op locatie in de regio Gemert-Bakel & Laarbeek.' },
    ],
  },


  emails: {
    // Email 1 — direct
    welcomeSubject: 'Welkom bij Ob-Audire — fijn dat je er bent',
    // Email 2 — na 48 uur
    followupSubject: 'Ik blijf luisteren, wanneer jij er klaar voor bent',
  },

  // ── Quiz intro (vragen staan in quiz.js) ──────────────────────────────────
  quizIntro: {
    title: 'Een zachte check-in',
    lede: 'Zes korte vragen. Ongeveer twee minuten. Wat je ook voelt, het mag er zijn.',
    start: 'Begin',
  },
};

export default content;
