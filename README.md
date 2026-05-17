# C'è il sole?

Una micro-app meteo minimalista e sarcastica per rispondere all'unica domanda che conta davvero: c'è il sole oggi?

Created with the help of a Cursor agent.

## Italiano

### Idea

`C'è il sole?` non vuole essere un'app meteo completa. Vuole solo dire, con una certa stanchezza climatica, se oggi c'è il sole in una città italiana.

L'app permette di scegliere una città, leggere un verdetto essenziale (`Sì.`, `No.`, `Purtroppo no.`), vedere una micro-frase ironica e consultare statistiche annuali volutamente drammatiche, come quanti giorni di sole ci sono stati nell'anno e l'ultimo giorno veramente felice.

Il tono è minimale, asciutto, un po' passivo-aggressivo.

Durante il giorno è possibile salvare una card verticale per Instagram Story con città, icona meteo e frase del giorno.

### URL condivisibili e SEO

Ogni città ha una pagina sul path **`/[slug]`** (lo slug coincide con l'`id` in `lib/cities.ts`, es. `/roma`, `/milano`). La città predefinita (Bologna) resta sulla **home `/`** senza slug nel canonical.

La vecchia query **`/?city=slug`** viene reindirizzata **308** allo slug corrispondente (proxy Next.js); parametri **`preview`** e **`meteoSegreto`** restano nella query quando servono.

### Frasi giornaliere

Le righe ironiche sotto il verdetto ruotano con più varianti; quando è disponibile la data civile nel fuso della città, il seed include **giorno + città + codice meteo**, così la stessa condizione può cambiare tono da un giorno all’altro.

### PWA leggera

È presente un **`site.webmanifest`** in `public/` (nome corto, colori tema, icona `/icon`) per installazione “standalone” dove il browser lo supporta.

### Git hooks

Dopo **`npm install`**, Husky configura il **pre-commit** con **`npm run lint`**, **`npm run test`** e **`npm run build`**. Per saltarlo una volta: `HUSKY=0 git commit …`.

### Avvio locale

Installa le dipendenze:

```bash
npm install
```

Avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

Altri comandi utili: `npm run build`, `npm run start`, `npm run lint`, `npm run test`.

### Tech Stack

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios per le richieste HTTP
- Vitest per unit test
- Vercel per deploy
- Open-Meteo come API meteo

### API

Usiamo [Open-Meteo](https://open-meteo.com/), senza autenticazione.

Endpoint principali:

- `https://api.open-meteo.com/v1/forecast` per il meteo corrente/giornaliero.
- `https://archive-api.open-meteo.com/v1/archive` per dati storici annuali.

Dati richiesti:

- `latitude` e `longitude` della città selezionata.
- `daily=weather_code` per ottenere il codice WMO giornaliero.
- `timezone=auto` per rispettare il fuso orario locale.
- `forecast_days=1` per la previsione del giorno.
- `start_date` e `end_date` per lo storico annuale.

L'app usa i codici WMO per decidere se il giorno è soleggiato, nuvoloso, nebbioso, piovoso, nevoso o temporalesco. Lo storico annuale viene limitato a dati già disponibili nell'archivio, evitando richieste troppo recenti.

### Struttura del progetto

```txt
app/
  layout.tsx           Shell globale, font, metadata e manifest PWA.
  page.tsx             Home `/`; delega a HomePage.
  [citySlug]/page.tsx  Route dinamica per slug città + redirect Bologna → `/`.
  loading.tsx          Skeleton UI durante il cambio di città.
  not-found.tsx        404 ironica.
  globals.css          Palette, variabili CSS e stili globali.

components/
  HomePage.tsx          Pagina principale server-side (meteo + UI).
  AnnualStats.tsx       Statistiche annuali.
  CitySelector.tsx      Selettore ricercabile delle città.
  Layout.tsx            Layout e tema cromatico per condizione meteo.
  LieCta.tsx            CTA per preview finta di sole.
  NightDisplay.tsx      Stato notturno.
  ShareCardButton.tsx   Card verticale condivisibile.
  WeatherDisplay.tsx    Verdetto principale.
  WeatherFavicon.tsx    Favicon dinamica.
  WeatherUnavailable.tsx Fallback quando il meteo non arriva.

lib/
  cities.ts               Capitali di provincia italiane.
  citySearch.ts           Utility per ricerca e navigazione nel selector.
  buildCanonicalHomeUrl.ts URL canonico assoluto (slug + query preview).
  buildHomeHref.ts        Path relativi per navigazione client.
  homeUrlRecord.ts        Serializzazione path/query home.
  resolveHomeCityId.ts    Risoluzione città da slug vs query.
  isRegisteredCityId.ts   Validazione slug città.
  generateHomeMetadata.ts Metadata canonical/Open Graph home.
  dayPeriod.ts            Logica giorno/notte.
  utils.ts                Utility di data.
  weather.ts              Client Axios e parsing Open-Meteo.
  weatherCodes.ts         Mapping codici WMO.
  weatherCopy.ts          Microcopy ironica (varianti giornaliere).
  weatherIcons.ts         Icone per condizione.
  weatherPreview.ts       Preview/lie mode non condivisibile.

proxy.ts               Redirect `/?city=` → `/slug` (308).

public/
  site.webmanifest     Manifest PWA leggero.

.husky/pre-commit      Lint, test e build (`next build`) prima di ogni commit.

tests/
  *.test.ts            Test unitari per utility e logica meteo.

types/
  *.ts                 Tipi condivisi.
```

### Possibili estensioni

- Microcopy più specifica per nebbia, neve, pioggia e temporali.
- Timeout e fallback più granulari per Open-Meteo.
- Cache server-side più intelligente per ridurre chiamate ripetute.
- Storico mensile o stagionale, sempre con tono inutilmente drammatico.
- Selector futuro per altri paesi, senza trasformarla in un'app meteo seria.
- GitHub Actions per CI remota (lint/test/build); in locale Husky già blocca commit rotti.

## English

### Concept

`C'è il sole?` is not trying to be a full weather app. It answers one question only: is there sun today?

The app lets users choose an Italian city, read a minimal verdict (`Sì.`, `No.`, `Purtroppo no.`), get a dry ironic aside, and see deliberately dramatic yearly stats, such as how many sunny days the city has had this year and the last truly happy day.

The tone is editorial, minimal, slightly passive-aggressive, and shaped by northern Italian weather frustration. Southern sunny cities get a more openly envious treatment.

During daytime, users can save a vertical Instagram Story card with the city, weather icon and daily phrase.

### Shareable URLs & SEO

Each city has a page at **`/[slug]`** (same as the city `id` in `lib/cities.ts`, e.g. `/roma`, `/milano`). The default city (Bologna) keeps the canonical URL at **`/`** without a slug segment.

Legacy **`/?city=slug`** requests are **308** redirected to the slug path (Next.js proxy); **`preview`** and **`meteoSegreto`** query params are preserved when needed.

### Daily copy rotation

Verdict asides pull from larger pools of lines; when the city’s calendar date is known, the seed uses **local calendar day + city + weather code**, so tone can shift day to day for the same condition.

### Lightweight PWA

`public/site.webmanifest` declares name, theme colours and `/icon` so browsers may offer install-to-home-screen where supported.

### Git hooks

After **`npm install`**, Husky wires **pre-commit** to **`npm run lint`**, **`npm run test`**, then **`npm run build`**. To skip once: `HUSKY=0 git commit …`.

### Run locally / Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other useful scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run test`.

### Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios for HTTP requests
- Vitest for unit tests
- Vercel for deployment
- Open-Meteo for weather data

### API

The app uses [Open-Meteo](https://open-meteo.com/), with no API key required.

Main endpoints:

- `https://api.open-meteo.com/v1/forecast` for daily forecast data.
- `https://archive-api.open-meteo.com/v1/archive` for historical yearly data.

Requested data:

- `latitude` and `longitude` for the selected city.
- `daily=weather_code` to retrieve the daily WMO weather code.
- `timezone=auto` to respect the local timezone.
- `forecast_days=1` for today's forecast.
- `start_date` and `end_date` for yearly archive queries.

The app maps WMO weather codes into internal conditions such as sunny, cloudy, foggy, rainy, snowy and stormy. Yearly archive queries are capped to dates that should already be available in Open-Meteo's archive, avoiding invalid requests for very recent historical data.

### Project Structure

```txt
app/
  layout.tsx             Global shell, fonts, metadata and PWA manifest.
  page.tsx               `/` home; delegates to HomePage.
  [citySlug]/page.tsx    Dynamic city slug route + Bologna redirect to `/`.
  loading.tsx            Skeleton UI while changing city.
  not-found.tsx          Sarcastic 404 page.
  globals.css            Palette, CSS variables and global styles.

components/
  HomePage.tsx           Main server page (weather fetch + UI).
  AnnualStats.tsx        Yearly statistics.
  CitySelector.tsx       Searchable city selector.
  Layout.tsx             Layout and weather-based visual theme.
  LieCta.tsx             CTA for the fake sunny preview.
  NightDisplay.tsx       Night state.
  ShareCardButton.tsx    Shareable vertical card.
  WeatherDisplay.tsx     Main verdict.
  WeatherFavicon.tsx     Dynamic favicon.
  WeatherUnavailable.tsx Weather fallback.

lib/
  cities.ts                  Italian provincial capitals.
  citySearch.ts              City selector search/navigation utilities.
  buildCanonicalHomeUrl.ts   Absolute canonical URLs (slug + preview query).
  buildHomeHref.ts           Relative paths for client navigation.
  homeUrlRecord.ts           Home path/query serialization helpers.
  resolveHomeCityId.ts       Resolve city from slug vs query param.
  isRegisteredCityId.ts    Validate city slug IDs.
  generateHomeMetadata.ts    Canonical / OG metadata for home routes.
  dayPeriod.ts               Day/night logic.
  utils.ts                   Date utilities.
  weather.ts                 Open-Meteo Axios client and parsing logic.
  weatherCodes.ts            WMO code mapping.
  weatherCopy.ts             Ironic weather copy (daily rotation pools).
  weatherIcons.ts            Weather condition icons.
  weatherPreview.ts          Non-shareable preview/lie mode.

proxy.ts                 Redirect `/?city=` → `/slug` (308).

public/
  site.webmanifest       Lightweight PWA manifest.

.husky/pre-commit      Lint, tests, then production build (`next build`) before each commit.

tests/
  *.test.ts              Unit tests for utilities and weather logic.

types/
  *.ts                   Shared types.
```

### Possible Extensions

- More condition-specific copy for fog, snow, rain and storms.
- More granular timeout and fallback handling for Open-Meteo.
- Smarter server-side caching to reduce repeated calls.
- Monthly or seasonal stats, ideally still unnecessarily dramatic.
- Future country selector, without turning this into a serious weather app.
- GitHub Actions for remote CI (lint/test/build); Husky already guards broken commits locally.
