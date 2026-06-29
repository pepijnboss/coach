# Ob-Audire — leadgeneratie voor Petra Mollet

Een warme, rustige website + intake-funnel voor **Ob-Audire**, de praktijk van **Petra Mollet** (begeleiding bij persoonlijke ontwikkeling, loopbaan, rouw en transitie). Geen standaard website, maar een vriendelijke funnel die bezoekers begeleidt naar een **vrijblijvend kennismakingsgesprek**.

> *"Een plek waar woorden nog geboren mogen worden."* — De toon is zacht, niet-klinisch, zonder druk of verkooptrucs. Begeleiding is geen medische behandeling. Gegevens worden volgens de AVG verwerkt.

---

## Wat het is

Een zelfstandige Node.js-applicatie (alleen de standaardbibliotheek, **geen `npm install` nodig**). Draait overal met Node 20+, en is opgebouwd zodat hij eenvoudig naar Next.js/Supabase/Resend/Calendly migreert.

| Pagina | Route | Inhoud |
|--------|-------|--------|
| Startpagina | `/` | Hero, het mol-motief, uitleg, hoe-het-werkt, CTA's |
| Check-in | `/check-in` | Zachte zes-stappen vragenlijst (de conversiemotor) |
| Spiegeling | `/resultaat/:id` | Persoonlijke, niet-klinische weerspiegeling + boek-CTA |
| Afspraak | `/afspraak` | Calendly-embed óf intern aanvraagformulier + direct contact |
| Wie ben ik | `/wie-ben-ik` | Petra's verhaal, 5 krachten, opleidingen, werkervaring |
| Aanbod | `/aanbod` | Begeleidingsvormen + het (K)ankeratelier |
| Privacy | `/privacy` | AVG-verklaring |
| Dashboard | `/admin` | Beveiligd: aanvragen, statistieken, status, AVG-verwijdering |

**Funnel:** startpagina → check-in → contactgegevens (met AVG-toestemming) → persoonlijke spiegeling → kennismakingsgesprek. Daarna: automatische **welkomstmail (direct)** + **opvolgmail (na 48 uur)**, en een melding aan Petra. Alle leads gaan naar één begeleider (Petra), maar het datamodel is al klaar voor meerdere begeleiders.

---

## Snel starten

```bash
# Node 20+ vereist. Geen dependencies te installeren.
node server.js          # of: npm start
```

- Site: <http://localhost:3000>
- Dashboard: <http://localhost:3000/admin> (login `petra` / `wijzig-mij-aub` — pas dit aan!)

Voorbeeld-aanvragen toevoegen: `npm run seed` · Testsuite: `node scripts/e2e.mjs` (34 checks).

### Snel even kijken zonder server
- `npm run preview:build` → losse HTML-pagina's in `/preview/`
- `npm run preview:single` → één bestand `preview/ob-audire-preview.html` dat je kunt downloaden en openen

---

## Aanpassen

**Alle teksten staan op één plek: [`src/content.js`](src/content.js).** Naam, tagline, contactgegevens, paginateksten, het aanbod, de prijzen en de e-mailonderwerpen — alles bewerk je daar. De vragen van de check-in en de spiegeling staan in [`src/quiz.js`](src/quiz.js). Kleuren staan boven in [`public/styles.css`](public/styles.css).

### Nog in te vullen (nu voorbeeldwaarden)
- **E-mailadres en telefoonnummer** van Petra → in `src/content.js` onder `contact`.
- Eventueel haar **echte merkkleuren** → `public/styles.css` (`:root`).

### Live zetten via omgevingsvariabelen (zie `.env.example`)
- `RESEND_API_KEY` → echte e-mails versturen (anders gaan ze naar `data/outbox.json`)
- `CALENDLY_URL` → Calendly-agenda inbedden (anders het interne aanvraagformulier)
- `ADMIN_USER` / `ADMIN_PASSWORD` → **wijzig dit voor productie**

---

## Projectstructuur

```
server.js              # HTTP-server + router + scheduler
src/
  content.js           # ⭐ ALLE teksten & branding (begin hier)
  config.js            # Omgeving + configuratie
  quiz.js              # Vragenlijst + spiegeling
  leads.js             # Lead-model + opslag (klaar voor meerdere begeleiders)
  email.js             # Sjablonen + Resend/outbox
  automation.js        # Welkom + opvolging (48u) + scheduler
  api.js, http.js, adminController.js, db.js, util.js
  views/               # layout, pages, booking, result, admin
public/                # styles.css, quiz.js, booking.js
scripts/               # seed, e2e, build-preview, build-singlefile
```

## Privacy (AVG)

Toestemming wordt expliciet gevraagd; alleen noodzakelijke gegevens worden bewaard; bezoekers kunnen verwijdering vragen (dashboard heeft één-klik-verwijdering); runtime-data (`data/*.json`) staat in `.gitignore`. Site-breed staat een verwijzing naar hulplijnen (112 / 113) — Ob-Audire is nadrukkelijk geen crisis- of medische dienst.

## Licentie

MIT
