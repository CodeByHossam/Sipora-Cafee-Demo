# BACKEND_PLAN.md — Express Backend Plan for Sipora Café

> Companion to `ai-base/PROJECT_PLAN.md` and `ai-base/USER_STORIES.md`.
> Status: **PENDING / DEFERRED** (out of MVP scope; frontend-only for now).
> Linked story: `US-14` · Linked plan task: `BE-01`.
> Skills applied: `backend/express-api-structure`, `backend/mongodb-schema-design`,
> `backend/jwt-auth-flow`, `backend/nodejs-production-patterns`,
> `architecture/api-design`, `architecture/data-and-systems-design`,
> `architecture/security-review`, `architecture/mern-architecture`.

## 1. Objective

Build a **Node.js / Express REST API + MongoDB** backend to replace the
frontend mock data (`src/data/products.json`, `src/data/users.json`,
`src/data/catalog.ts`) and add persistence for users, orders, loyalty points,
and favorites. The frontend (Expo/RN) will consume this API over HTTPS.

## 2. Tech stack (backend)

- Runtime: Node.js 20 LTS
- Framework: Express 4.x
- Database: MongoDB Atlas (Mongoose 8)
- Auth: JWT (access 15m) + rotating refresh (30d, httpOnly cookie) — jwt-auth-flow
- Validation: Zod (request schemas) — express-api-structure
- Security: helmet, cors (allow-list), express-mongo-sanitize, express-rate-limit,
  bcrypt (cost 12), compression
- Logging: pino (request id, structured)
- Testing: Jest + Supertest
- Hosting: Render / Railway / Fly.io (container)

## 3. Architecture (layered)

Per express-api-structure:

```
backend/
  src/
    app.js                 # configure express, no listen
    server.js              # connect DB then listen
    api/
      routes/              # one router per resource
      controllers/         # HTTP only
      validators/          # Zod schemas
      middlewares/         # authenticate, authorize, validate, errorHandler
    services/              # business logic, throws typed AppError
    repositories/          # Mongoose queries only
    models/                # Mongoose schemas
    config/                # env, database, constants
    utils/                 # errors, helpers
```

Middleware order (fixed): helmet → cors → express.json → urlencoded →
mongoSanitize → compression → requestId → requestLogger → rateLimit (/api) →
apiRouter (/api/v1) → health → errorHandler (last, 4 params).

## 4. Data model (MongoDB / Mongoose)

Mapped from frontend types (`src/types/product.ts`, `src/types/cart.ts`) and
the JSON mocks.

### User
- _id, email (unique, lowercase), passwordHash (select:false),
  displayName, role (user|admin|moderator, default user), avatarUrl,
  points (default 0), emailVerified, deletedAt (soft delete), timestamps.
- Indexes: email unique (partial, active only).

### Product
- _id, name, description, tastingNotes, basePrice (Number), currency (USD),
  category (hot|iced|pastries), rating, reviewCount, imageUrl,
  customizations { sizes[], milks[], shots[], sweetness[] } (embedded, bounded),
  isHero, discountPercentage, isPopular, isActive.
- Indexes: category, isHero, isPopular, text (name+description).

### Cart (server-side, optional; MVP keeps client cart)
- _id, userId (ref User), items [{ productId, options {size,milk,shot,sweet},
  qty, unitPrice, addedAt }], updatedAt.

### Order
- _id, userId (ref User, nullable for guest), items (snapshot of cart line),
  fulfillment (counter|curbside), promoCode, discount, freeDrinkRedeemed,
  pointsEarned, pointsRedeemed, subtotal, total, remark, status
  (placed|preparing|ready|picked_up|cancelled), createdAt.
- Indexes: userId+createdAt, status.

### Favorite
- _id, userId (ref User), productId (ref Product), createdAt.
- Unique compound index (userId, productId).

### Session (refresh tokens)
- _id, userId, tokenHash (SHA-256), expiresAt (TTL), createdAt, revokedAt.
- TTL index on expiresAt.

### PromoCode
- _id, code (unique), discount (Number), active, expiresAt.


## 5. API surface (REST, /api/v1)

Auth (public):
- POST /auth/register  { email, password, displayName } -> { accessToken, user }
- POST /auth/login     { email, password } -> { accessToken, user } + refresh cookie
- POST /auth/refresh   (cookie) -> { accessToken }
- POST /auth/logout    (cookie) -> 204
- GET  /auth/me        (auth) -> user

Products (public read):
- GET /products                ?category, search, popular, hero -> list + pagination
- GET /products/:id            -> product
- GET /products/hero           -> hero product
- (admin) POST/PATCH/DELETE /products

Cart (auth or guest session):
- GET    /cart
- POST   /cart/items           { productId, options, qty }
- PATCH  /cart/items/:key      { qty | options }
- DELETE /cart/items/:key
- DELETE /cart

Orders (auth):
- POST /orders/checkout        { fulfillment, promoCode, redeemFree, remark } -> order
- GET  /orders                 (user's history)
- GET  /orders/:id

Favorites (auth):
- GET    /favorites
- POST   /favorites/:productId
- DELETE /favorites/:productId

Loyalty / Points (auth):
- GET  /loyalty/balance        -> { points }
- POST /loyalty/redeem         { cost: 50 } -> { newBalance }
- (awarded automatically on checkout: +5 per drink)

Promo (public):
- POST /promo/validate         { code } -> { discount }

Admin (role=admin):
- CRUD products, view orders, manage promos.

Response envelope: { data }, { data, pagination }, 204 on delete,
{ error: { code, message, details?, requestId } }.

## 6. Auth flow (JWT)

Per jwt-auth-flow: bcrypt cost 12; access JWT 15m (audience 'api', issuer 'auth');
opaque refresh token 30d in httpOnly/secure/sameSite cookie scoped to /api/v1/auth;
refresh token stored hashed (SHA-256) in sessions collection with TTL; rotation on
refresh; revoke-all on reuse detection; client refreshes once on 401 and queues
concurrent 401s.

## 7. Frontend integration

- Replace `src/data/products.json` / `users.json` / `catalog.ts` with API calls.
- Add an API client (axios) with interceptors for silent refresh.
- Map existing screens: Home (hero + popular), Menu, Product details, Cart,
  Profile, Favorites, Signup/Login, Loyalty.
- Keep in-memory fallback for offline/dev.

## 8. Milestones

1. M1: Project scaffold + DB connection + health check.
2. M2: Auth (register/login/refresh/logout) + User model.
3. M3: Products CRUD + seed script (from products.json).
4. M4: Cart + Orders + checkout (points award).
5. M5: Favorites + Promo + Loyalty endpoints.
6. M6: Admin routes + role guards.
7. M7: Frontend integration + E2E tests.
8. M8: Hardening (rate limits, logs, graceful shutdown) + deploy.

## 9. Security checklist (architecture/security-review)

- No plaintext passwords; bcrypt cost 12.
- NoSQL injection: mongoSanitize + Zod validation.
- JWT audience/issuer verified; refresh hashed + rotated.
- CORS allow-list; helmet; rate limiting on /api.
- Never leak raw Mongo/JWT errors; typed AppError envelope.
- Soft delete users; never hard-delete orders.
- Secrets via env; .env gitignored.

## 10. Out of scope (MVP)

Payments, push notifications, real-time inventory, offline sync, admin UI.

## 11. Skills used

- backend/express-api-structure
- backend/mongodb-schema-design
- backend/jwt-auth-flow
- backend/nodejs-production-patterns
- architecture/api-design
- architecture/data-and-systems-design
- architecture/security-review
- architecture/mern-architecture
- frontend/axios-http-patterns
