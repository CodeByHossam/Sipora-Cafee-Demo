# Sipora Café — Mobile Ordering App

A mobile-first café ordering application built with **Expo** and **React Native**.
Customers can browse the menu, customize drinks, manage a cart, apply promo codes,
and check out for pickup or curbside — all from their phone.

> Frontend-only MVP: no backend, database, or authentication. Product catalog and
> cart state are local to the device.

---

## Features

- **Home** — personalized greeting, featured seasonal promo, category chips, popular choices, and "Today's Roaster Pick".
- **Menu** — search + category tabs, 2-column product grid, quick-add with toast confirmation.
- **Drink Details** — hero image, rating, flavor profile chips, full customization (size, milk, shots, sweetness) with live price calculation, quantity stepper, favorite toggle.
- **Cart** — item review with quantity steppers, remove/clear, promo code, fulfillment switcher (pickup/curbside), cost breakdown, checkout with loading/success states.
- **Empty states** for empty cart and no search results.
- **Safe-area aware** layout (Android nav bar / iOS home indicator) and mobile-first responsive design.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.88 + Expo SDK 58 (React 19.3) |
| Routing | Expo Router (file-based, typed routes) |
| Language | TypeScript (strict) |
| Styling | StyleSheet + design tokens (Artisanal Warmth) |
| State | React `useState` / `useContext` + custom hooks |
| Images | `expo-image` (cached, performant) |
| Icons | `@expo/vector-icons` (MaterialIcons) |
| Build / Deploy | Metro + EAS (cloud builds, OTA updates) |
| Fonts | Epilogue + Plus Jakarta Sans (via `expo-font`) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or bun)
- Expo Go app on your phone (for device testing) **or** an Android/iOS emulator

### Install

```bash
npm install
```

### Run

```bash
# Start the dev server
npx expo start

# Run on a specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

Scan the QR code with Expo Go, or press `a` / `i` / `w` in the terminal.

### Environment variables

Copy the example file and fill in values:

```bash
cp .env.example .env
```

Only `EXPO_PUBLIC_*` variables are inlined into the client bundle and are
visible to end users — never put secrets there. See `src/config/env.ts` for the
validated config module. `.env*` is gitignored (except `.env.example`).

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_APP_ENV` | Yes | `development` / `staging` / `production` |
| `EXPO_PUBLIC_APP_NAME` | No | Display name (default: "Sipora Café") |
| `EXPO_PUBLIC_API_URL` | No | Optional backend URL (unused in MVP) |

## Project Structure

```
src/
  app/                  Expo Router routes & layouts
    (tabs)/             Tab screens (Home, Menu, Cart, Profile)
    product/[id].tsx    Drink details
  components/
    features/           Feature components (ProductCard, FeaturedBanner, ...)
    ui/                 Shared UI primitives
  constants/theme.ts    Design tokens (Artisanal Warmth)
  data/catalog.ts       Static product catalog (mock)
  hooks/                useCart, useCatalog
  types/                Domain types (Product, Cart)
  config/env.ts         Validated environment config
assets/
  images/               Icons, splash, product photos, backgrounds
  stitch_.../           UI reference (design system + screens)
```

## Design System — "Artisanal Warmth"

Warm, tactile, artisanal aesthetic: cream surfaces, deep espresso primary, caramel
accent, pebble/ceramic radii, brown-tinted ambient shadows. Typography uses
Epilogue (headlines) and Plus Jakarta Sans (body). Full token set lives in
`src/constants/theme.ts` and the reference in
`assets/stitch_sipora_caf_mobile_app_UI_REF/artisanal_warmth/DESIGN.md`.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run web` | Start on web |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Typecheck |

## Quality

- TypeScript strict mode.
- ESLint via `eslint-config-expo`.
- Accessibility: ARIA labels on icon buttons, >=44px touch targets, visible focus, color not used as the only signal.

## Deployment

Builds and submissions are done with EAS in the cloud:

```bash
npx eas-cli build --platform all
npx eas-cli submit
```

OTA updates:

```bash
npx eas-cli update
```

## Planning & Memory

This project follows the Master AI Protocol. Planning artifacts live in
`assets/ai-helper/static-web/`:

- `PROJECT_MAP.md` — technical state (single live map).
- `PROJECT_PLAN.md` — task board, acceptance criteria, evidence, skills used.
- `USER_STORIES.md` — user needs and acceptance criteria.
- `SKILL_ROUTER.md` — skill sub-flow index.

## License

See [LICENSE](./LICENSE).
