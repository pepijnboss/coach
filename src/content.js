// ─────────────────────────────────────────────────────────────────────────
// Central content configuration.
//
// CoachKompas is the LEAD SITE (your own brand). It guides visitors through a
// short check-in and refers them to the practice of Petra Mollet (Ob-Audire).
// Single source of truth for all copy/branding. Edit here only.
//
//   brand     = the lead site (CoachKompas)
//   practice  = the coach it refers to (Ob-Audire / Petra Mollet)
// ─────────────────────────────────────────────────────────────────────────

export const content = {
  // ── De LEAD-SITE = jouw eigen merk ─────────────────────────────────────────
  brand: {
    name: 'CoachKompas',
    tagline: 'Jouw kompas naar de juiste begeleiding',
    essence:
      'Doe de korte check-in en ontdek welke begeleiding bij je past. Een zachte eerste stap — CoachKompas verbindt je met Petra Mollet van Ob-Audire.',
    // Jouw eigen afzender-/contactadres (placeholder — later invullen).
    email: 'info@coachkompas.nl',
  },

  // ── De PRAKTIJK waar CoachKompas naar doorverwijst ─────────────────────────
  practice: {
    name: 'Ob-Audire',
    coach: 'Petra Mollet',
    coachFirst: 'Petra',
    // Het kenmerkende mol-motief van Petra's praktijk.
    mole:
      'Net zoals de mol voorzichtig haar hol verlaat, mag jij hier tevoorschijn komen met jouw verhaal. Niet alles hoeft al uitgesproken te zijn.',
  },

  // NOTE: dit zijn de contactgegevens van de PRAKTIJK (Petra) — nu nog voorbeeldwaarden.
  contact: {
    email: 'info@ob-audire.nl',
    phone: '06 - 12 34 56 78',
    // WhatsApp is een laagdrempelig leadkanaal in NL. Vul het nummer in
    // internationaal formaat in (bijv. 31612345678) om de knop te tonen; leeg = verborgen.
    whatsapp: '',
    region: 'Regio Gemert-Bakel, Laarbeek & Helmond (Noord-Brabant)',
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
      'Contact opnemen over wat je bezighoudt vraagt vertrouwen. CoachKompas gaat zorgvuldig met je gegevens om, volgens de Algemene Verordening Gegevensbescherming (AVG).',
    sections: [
      { h: 'Wat we verzamelen', p: 'Alleen wat jij deelt: je naam, e-mailadres, een optioneel telefoonnummer en de antwoorden uit de check-in, zodat we je een passend en zorgzaam antwoord kunnen geven.' },
      { h: 'Waarom (grondslag)', p: 'We verwerken je gegevens op basis van jouw toestemming, gegeven bij het versturen van de check-in, uitsluitend om je in contact te brengen met Petra Mollet, een kennismakingsgesprek aan te bieden en een zachte herinnering te sturen. We verkopen je gegevens niet en gebruiken ze niet voor advertenties.' },
      { h: 'Wie het ziet', p: 'CoachKompas deelt je gegevens uitsluitend met Petra Mollet (Ob-Audire), de begeleider waarmee we je in contact brengen. Ze worden nooit gedeeld met andere derden voor marketing.' },
      { h: 'Hoe lang', p: 'We bewaren je gegevens niet langer dan nodig om je te kunnen helpen, en verwijderen ze daarna. Je kunt altijd vragen om verwijdering.' },
      { h: 'Jouw rechten', p: 'Je hebt recht op inzage, correctie en verwijdering van je gegevens, en je mag je toestemming intrekken. Mail daarvoor naar het adres hieronder; we handelen je verzoek snel af.' },
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
      { q: 'Is dit therapie of een medische behandeling?', a: 'Nee. Petra Mollet (Ob-Audire) biedt begeleiding: een veilige, ondersteunende ruimte. Het is geen therapie of medische behandeling, en vervangt die ook niet.' },
      { q: 'Wat kost het kennismakingsgesprek?', a: 'Het eerste kennismakingsgesprek van ongeveer 30 minuten is gratis en vrijblijvend. Je zit nergens aan vast.' },
      { q: 'Is mijn informatie vertrouwelijk?', a: 'Ja. Wat je deelt is vertrouwelijk en wordt alleen door Petra gezien. Je gegevens worden verwerkt volgens de AVG en je kunt altijd om verwijdering vragen.' },
      { q: 'Hoe verloopt een gesprek?', a: 'Rustig en zonder druk. Je hoeft niets voor te bereiden. We gaan in jouw tempo, met jouw verhaal als kompas.' },
      { q: 'Online of op locatie?', a: 'Allebei kan. Petra werkt online en op locatie in de regio Gemert-Bakel & Laarbeek.' },
    ],
  },


  emails: {
    // Email 1 — direct
    welcomeSubject: 'Welkom bij CoachKompas — fijn dat je er bent',
    // Email 2 — na 48 uur
    followupSubject: 'We blijven luisteren, wanneer jij er klaar voor bent',
  },

  // ── Quiz intro (vragen staan in quiz.js) ──────────────────────────────────
  quizIntro: {
    title: 'Een zachte check-in',
    lede: 'Zes korte vragen. Ongeveer twee minuten. Wat je ook voelt, het mag er zijn.',
    start: 'Begin',
  },

  // ── Lokale SEO-pagina's ────────────────────────────────────────────────────
  // Elke pagina richt zich op één zoekwoord + plaats, met unieke tekst (geen
  // duplicaat), en stuurt naar de check-in + kennismakingsgesprek met Petra.
  // Voeg gerust meer plaatsen/onderwerpen toe — de routes ontstaan vanzelf.
  seo: {
    footerTitle: 'Begeleiding in jouw regio',
    pages: [
      {
        slug: 'rouwbegeleiding-gemert-bakel',
        topic: 'Rouwbegeleiding',
        location: 'Gemert-Bakel',
        eyebrow: 'Gemert-Bakel e.o.',
        h1: 'Rouwbegeleiding in Gemert-Bakel',
        metaTitle: 'Rouwbegeleiding in Gemert-Bakel | CoachKompas',
        metaDescription:
          'Zoek je rouwbegeleiding in Gemert-Bakel? Doe de korte check-in en plan een gratis kennismakingsgesprek met Petra Mollet van Ob-Audire. Online of op locatie.',
        intro: [
          'Het verlies van iemand of iets dat je dierbaar is, kan je wereld op zijn kop zetten. Zoek je in Gemert-Bakel een warme, niet-medische plek om je verdriet te delen en er woorden aan te geven? Bij Ob-Audire, de praktijk van rouw- en verliesbegeleider Petra Mollet, vind je een veilige ruimte — in jouw tempo.',
          'Via CoachKompas zet je een zachte eerste stap: doe de korte check-in en ontvang een persoonlijke spiegeling. Daarna verbinden we je met Petra voor een vrijblijvend kennismakingsgesprek, online of op locatie in de regio.',
        ],
        bullets: [
          'Begeleiding bij verlies, gemis en afscheid',
          'Geen wachtlijst en geen medische verwijzing nodig',
          'Online of op locatie in Gemert-Bakel en omgeving',
          'Eerste kennismakingsgesprek (30 min) gratis en vrijblijvend',
        ],
      },
      {
        slug: 'rouwbegeleiding-helmond',
        topic: 'Rouwbegeleiding',
        location: 'Helmond',
        eyebrow: 'Helmond e.o.',
        h1: 'Rouwbegeleiding in Helmond',
        metaTitle: 'Rouwbegeleiding in Helmond | CoachKompas',
        metaDescription:
          'Rouwbegeleiding in Helmond en omgeving. Een warme, niet-klinische plek voor je verdriet. Doe de check-in en plan een gratis kennismakingsgesprek met Petra Mollet.',
        intro: [
          'Rouw kent geen vast tijdpad. Of het verlies nu net gebeurde of al langer geleden is — soms helpt het om je verhaal te delen met iemand die echt luistert. In Helmond en omgeving begeleidt Petra Mollet (Ob-Audire) je daarbij, zacht en zonder oordeel.',
          'CoachKompas helpt je op weg met een korte check-in en een persoonlijke spiegeling. Voelt het goed, dan breng je een vrijblijvend kennismakingsgesprek met Petra in gang.',
        ],
        bullets: [
          'Voor verlies van een dierbare, scheiding of ingrijpende verandering',
          'Ruimte om te vertragen, te voelen en gehoord te worden',
          'Online of op locatie, goed bereikbaar vanuit Helmond',
          'Vrijblijvend eerste gesprek van 30 minuten',
        ],
      },
      {
        slug: 'loopbaancoach-laarbeek',
        topic: 'Loopbaancoaching',
        location: 'Laarbeek',
        eyebrow: 'Laarbeek e.o.',
        h1: 'Loopbaancoach in Laarbeek',
        metaTitle: 'Loopbaancoach in Laarbeek | CoachKompas',
        metaDescription:
          'Vastgelopen in je werk of toe aan een nieuwe richting? Loopbaancoaching in Laarbeek met Petra Mollet, registerloopbaancoach. Doe de check-in, gesprek is gratis.',
        intro: [
          'Sta je op een kruispunt in je loopbaan, twijfel je over een volgende stap, of voel je dat je werk niet meer past bij wie je bent? In Laarbeek begeleidt Petra Mollet je bij keuzes, verandering en richting. Met haar achtergrond als HR-adviseur én registerloopbaancoach kijkt ze verder dan je cv.',
          'Begin met de korte check-in van CoachKompas. Je ontvangt een persoonlijke spiegeling en, als het past, een vrijblijvend kennismakingsgesprek met Petra.',
        ],
        bullets: [
          'Bij twijfel, keuzes of een nieuwe stap in je werk',
          'Inzicht in patronen, drijfveren en wat écht bij je past',
          'Combinatie van HR-ervaring en loopbaancoaching',
          'Gratis kennismakingsgesprek, online of in Laarbeek',
        ],
      },
      {
        slug: 'loopbaancoach-helmond',
        topic: 'Loopbaancoaching',
        location: 'Helmond',
        eyebrow: 'Helmond e.o.',
        h1: 'Loopbaancoach in Helmond',
        metaTitle: 'Loopbaancoach in Helmond | CoachKompas',
        metaDescription:
          'Loopbaancoaching in Helmond met Petra Mollet, registerloopbaancoach. Vind richting bij een kruispunt in je werk. Doe de check-in; eerste gesprek gratis.',
        intro: [
          'Een nieuwe richting in je werk vinden vraagt rust en aandacht. In Helmond helpt Petra Mollet je om te ontdekken wat bij je past — niet met standaardtests, maar met een afgestemde, persoonlijke aanpak waarin jouw verhaal het kompas is.',
          'Doe de korte check-in van CoachKompas voor een eerste spiegeling, en plan daarna desgewenst een gratis kennismakingsgesprek met Petra.',
        ],
        bullets: [
          'Voor loopbaanvragen, heroriëntatie en werkstress',
          'Persoonlijk en verdiepend, geen afvinklijstjes',
          'Goed bereikbaar vanuit Helmond en omgeving',
          'Vrijblijvend eerste gesprek van 30 minuten',
        ],
      },
      {
        slug: 'hulp-bij-verlies-en-verdriet',
        topic: 'Hulp bij verlies en verdriet',
        location: 'Gemert-Bakel, Laarbeek & Helmond',
        eyebrow: 'Regio Zuidoost-Brabant',
        h1: 'Hulp bij verlies en verdriet in de regio',
        metaTitle: 'Hulp bij verlies en verdriet — Gemert-Bakel, Laarbeek, Helmond | CoachKompas',
        metaDescription:
          'Warme begeleiding bij verlies en verdriet in Gemert-Bakel, Laarbeek en Helmond. Niet-medisch, in jouw tempo. Doe de check-in en plan een gratis gesprek.',
        intro: [
          'Verdriet mag er zijn — en je hoeft het niet alleen te dragen. Of je nu een dierbare verloor, een relatie eindigde of je leven ingrijpend veranderde: in de regio Gemert-Bakel, Laarbeek en Helmond biedt Petra Mollet een veilige plek om te rouwen, te voelen en langzaam weer adem te vinden.',
          'CoachKompas is je zachte eerste stap. Met een korte check-in ontdek je wat je nodig hebt, en we verbinden je met Petra voor een vrijblijvend kennismakingsgesprek.',
        ],
        bullets: [
          'Bij rouw, gemis, scheiding of een ingrijpende verandering',
          'Niet-medisch, zonder oordeel, in jouw tempo',
          'Online of op locatie in Zuidoost-Brabant',
          'Eerste gesprek (30 min) gratis en vrijblijvend',
        ],
      },
      {
        slug: 'kankeratelier-helmond-eo',
        topic: '(K)ankeratelier',
        location: 'Helmond e.o.',
        eyebrow: 'Voor mensen met kanker & hun naasten',
        h1: 'Het (K)ankeratelier — creatieve ochtend in de regio Helmond',
        metaTitle: '(K)ankeratelier — creatieve ochtend bij kanker, regio Helmond | CoachKompas',
        metaDescription:
          'Het (K)ankeratelier van Ob-Audire: een rustige, creatieve ochtend voor mensen met kanker en hun partners. Regio Gemert-Bakel, Laarbeek en Helmond. Maak kennis.',
        intro: [
          'Leven met kanker — als patiënt of als partner — vraagt veel. Het (K)ankeratelier van Ob-Audire is een kleine, creatieve ochtend waar je even uit de stroom van het dagelijks leven mag stappen. In rust iets met je handen doen, zonder dat er iets moet. Niets hoeft, alles mag.',
          'Wil je sfeer proeven of vragen stellen? Doe de korte check-in van CoachKompas of neem direct contact op voor een kennismaking met Petra.',
        ],
        bullets: [
          'Voor volwassenen met kanker en hun partners',
          'Kleine groep (max. 4), laatste vrijdag van de maand',
          'Tekenen, collage, drukken, vilten en meer — op jouw tempo',
          'In de regio Gemert-Bakel, Laarbeek en Helmond',
        ],
      },
    ],
  },
};

export default content;
