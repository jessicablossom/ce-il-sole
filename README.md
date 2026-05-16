# C'è il sole?

Una micro-app meteo minimalista e sarcastica per rispondere all'unica domanda che conta davvero: c'è il sole oggi?

Created with the help of a Cursor agent.

## Italiano

### Idea

`C'è il sole?` non vuole essere un'app meteo completa. Vuole solo dire, con una certa stanchezza climatica, se oggi c'è il sole in una città italiana.

L'app permette di scegliere una città, leggere un verdetto essenziale (`Sì.`, `No.`, `Purtroppo no.`), vedere una micro-frase ironica e consultare statistiche annuali volutamente drammatiche, come quanti giorni di sole ci sono stati nell'anno e l'ultimo giorno veramente felice.

Il tono è minimale, asciutto, un po' passivo-aggressivo.

Durante il giorno è possibile salvare una card verticale per Instagram Story con città, icona meteo e frase del giorno.

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
  layout.tsx        Shell globale, font e metadata.
  page.tsx          Pagina principale, fetch meteo e composizione UI.
  loading.tsx       Skeleton UI durante il cambio di città.
  not-found.tsx     404 ironica.
  globals.css       Palette, variabili CSS e stili globali.

components/
  AnnualStats.tsx       Statistiche annuali.
  CitySelector.tsx      Selettore ricercabile delle città.
  Layout.tsx            Layout e tema cromatico per condizione meteo.
  LieCta.tsx            CTA per "mentire" sul sole.
  NightDisplay.tsx      Stato notturno.
  WeatherDisplay.tsx    Verdetto principale.
  WeatherFavicon.tsx    Favicon dinamica.
  WeatherUnavailable.tsx Fallback quando il meteo non arriva.

lib/
  cities.ts          Capitali di provincia italiane.
  citySearch.ts      Utility per ricerca e navigazione nel selector.
  dayPeriod.ts       Logica giorno/notte.
  utils.ts           Utility di data.
  weather.ts         Client Axios e parsing Open-Meteo.
  weatherCodes.ts    Mapping codici WMO.
  weatherCopy.ts     Microcopy ironica.
  weatherIcons.ts    Icone per condizione.
  weatherPreview.ts  Preview/lie mode.

tests/
  *.test.ts          Test unitari per utility e logica meteo.

types/
  *.ts               Tipi condivisi.
```

### Possibili estensioni

- Microcopy più specifica per nebbia, neve, pioggia e temporali.
- Timeout e fallback più granulari per Open-Meteo.
- Cache server-side più intelligente per ridurre chiamate ripetute.
- Storico mensile o stagionale, sempre con tono inutilmente drammatico.
- Selector futuro per altri paesi, senza trasformarla in un'app meteo seria.
- GitHub Actions per test, lint e build automatici.

## English

### Concept

`C'è il sole?` is not trying to be a full weather app. It answers one question only: is there sun today?

The app lets users choose an Italian city, read a minimal verdict (`Sì.`, `No.`, `Purtroppo no.`), get a dry ironic aside, and see deliberately dramatic yearly stats, such as how many sunny days the city has had this year and the last truly happy day.

The tone is editorial, minimal, slightly passive-aggressive, and shaped by northern Italian weather frustration. Southern sunny cities get a more openly envious treatment.

During daytime, users can save a vertical Instagram Story card with the city, weather icon and daily phrase.

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
  layout.tsx        Global shell, fonts and metadata.
  page.tsx          Main page, weather fetching and UI composition.
  loading.tsx       Skeleton UI while changing city.
  not-found.tsx     Sarcastic 404 page.
  globals.css       Palette, CSS variables and global styles.

components/
  AnnualStats.tsx       Yearly statistics.
  CitySelector.tsx      Searchable city selector.
  Layout.tsx            Layout and weather-based visual theme.
  LieCta.tsx            CTA for the fake sunny preview.
  NightDisplay.tsx      Night state.
  WeatherDisplay.tsx    Main verdict.
  WeatherFavicon.tsx    Dynamic favicon.
  WeatherUnavailable.tsx Weather fallback.

lib/
  cities.ts          Italian provincial capitals.
  citySearch.ts      City selector search/navigation utilities.
  dayPeriod.ts       Day/night logic.
  utils.ts           Date utilities.
  weather.ts         Open-Meteo Axios client and parsing logic.
  weatherCodes.ts    WMO code mapping.
  weatherCopy.ts     Ironic weather copy.
  weatherIcons.ts    Weather condition icons.
  weatherPreview.ts  Preview/lie mode.

tests/
  *.test.ts          Unit tests for utilities and weather logic.

types/
  *.ts               Shared types.
```

### Possible Extensions

- More condition-specific copy for fog, snow, rain and storms.
- More granular timeout and fallback handling for Open-Meteo.
- Smarter server-side caching to reduce repeated calls.
- Monthly or seasonal stats, ideally still unnecessarily dramatic.
- Future country selector, without turning this into a serious weather app.
- GitHub Actions for automated test, lint and build checks.
