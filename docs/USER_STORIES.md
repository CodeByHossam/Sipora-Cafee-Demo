# USER_STORIES.md - User Needs & Acceptance Criteria

> Template. In a live project this file is `ai-base/USER_STORIES.md`.
> Single source of user needs.

## Format

Each story has a stable ID (US-01, US-02, ...).

## Stories

| ID | Title | Role | Priority | Status | Plan tasks |
|---|---|---|---|---|---|
| US-01 | Browse home & discover featured drinks | Customer | High | DONE | FE-01, FE-14 |
| US-02 | Browse & filter the menu | Customer | High | DONE | FE-02, FE-13 |
| US-03 | View drink details | Customer | High | DONE | FE-03 |
| US-04 | Customize a drink | Customer | High | DONE | FE-04 |
| US-05 | Add items to cart | Customer | High | DONE | FE-05 |
| US-06 | Manage cart & checkout | Customer | High | DONE | FE-06, FE-09, FE-12 |
| US-07 | Apply a promo code | Customer | Medium | DONE | FE-07 |
| US-08 | Choose fulfillment (pickup/curbside) | Customer | Medium | DONE | FE-08 |
| US-09 | Save favorite drinks | Customer | Low | DONE | FE-10, FE-17 |
| US-10 | View profile | Customer | Low | DONE | FE-11 |
| US-11 | Earn & redeem loyalty points | Customer | Medium | DONE | FE-18 |
| US-12 | Dynamic hero banner & product discounts | Admin/Customer | Medium | DONE | FE-19 |
| US-13 | Guest & account (sign in / sign up) | Customer | Medium | DONE | FE-22 |
| US-14 | Backend & database integration | System | High | PENDING | — |

### US-01 - Browse home & discover featured drinks

- Role: Customer (guest)
- Story: As a customer, I want to see a personalized greeting, featured promotions, popular choices, and today's roaster pick on the home screen, so that I can quickly discover something to order.
- Acceptance criteria:
  - [ ] Home renders greeting, search, filter button, featured promo banner, category chips, popular choices list, and roaster pick card per reference.
  - [ ] Tapping a popular choice opens Drink Details; the "+" quick-add adds the item to cart.
  - [ ] Bottom navigation is visible with Home active.
- Priority: High
- Dependencies: FE-13, FE-14
- Status: DONE
- Plan tasks: FE-01, FE-14
- Skills / guidance: `frontend/react-component-patterns`

### US-02 - Browse & filter the menu

- Role: Customer (guest)
- Story: As a customer, I want to search and filter the menu by category, so that I can find drinks and pastries I want.
- Acceptance criteria:
  - [ ] Menu renders title, search, filter button, category tabs, featured card, and 2-column product grid per reference.
  - [ ] Category tabs and search filter the grid; quick-add shows a toast confirmation.
  - [ ] Bottom navigation is visible with Menu active.
- Priority: High
- Dependencies: FE-13
- Status: DONE
- Plan tasks: FE-02, FE-13
- Skills / guidance: `frontend/react-component-patterns`

### US-03 - View drink details

- Role: Customer (guest)
- Story: As a customer, I want to see a drink's photo, rating, flavor profile, and description, so that I can decide whether to order it.
- Acceptance criteria:
  - [ ] Drink Details renders hero image, utility bar, title, metrics, flavor chips, description, barista note per reference.
  - [ ] Favorite toggle switches filled/unfilled state.
  - [ ] Customization groups (size, milk, shots, sweetness) update total price; quantity stepper min 1.
  - [ ] Checkout bar shows price, quantity, and "Add to Cart" with added-to-order feedback.
- Priority: High
- Dependencies: FE-13
- Status: DONE
- Plan tasks: FE-03
- Skills / guidance: `frontend/react-component-patterns`


### US-04 - Customize a drink

- Role: Customer (guest)
- Story: As a customer, I want to choose size, milk, espresso shots, and sweetness, so that my drink is made the way I like.
- Acceptance criteria:
  - [ ] All four customization groups render with selectable options per reference.
  - [ ] Selected options update the displayed total price correctly.
  - [ ] Quantity stepper increases/decreases (min 1).
- Priority: High
- Dependencies: US-03
- Status: DONE
- Plan tasks: FE-04
- Skills / guidance: `frontend/react-hooks`

### US-05 - Add items to cart

- Role: Customer (guest)
- Story: As a customer, I want to add a customized or default drink to my cart, so that I can order multiple items.
- Acceptance criteria:
  - [ ] "Add to Cart" adds the item with selected options, quantity, and price.
  - [ ] Quick-add from Home/Menu adds a default item at base price.
  - [ ] Cart badge count updates.
- Priority: High
- Dependencies: US-04, FE-12
- Status: DONE
- Plan tasks: FE-05, FE-12
- Skills / guidance: `frontend/react-hooks`

### US-06 - Manage cart & checkout

- Role: Customer (guest)
- Story: As a customer, I want to review my cart, adjust quantities, remove items, and check out, so that I can place my order.
- Acceptance criteria:
  - [ ] Cart renders items with image, name, options, price, and quantity steppers per reference.
  - [ ] Quantity change and remove work; "Clear all" empties the cart.
  - [ ] Empty cart state renders.
  - [ ] Checkout button shows loading then success state.
  - [ ] Each cart item can be edited inline (size, milk, shots, sweetness) with small option chips.
  - [ ] Order remark text input is available near checkout.
- Priority: High
- Dependencies: US-05
- Status: DONE
- Plan tasks: FE-06, FE-09, FE-12, FE-15
- Skills / guidance: `frontend/react-component-patterns`

### US-07 - Apply a promo code

- Role: Customer (guest)
- Story: As a customer, I want to apply a promo code, so that I can receive a discount on my order.
- Acceptance criteria:
  - [ ] Apply toggles to "Applied" and shows -$2.00 discount in the breakdown.
  - [ ] Removing/re-applying updates the total.
- Priority: Medium
- Dependencies: US-06
- Status: DONE
- Plan tasks: FE-07
- Skills / guidance: `frontend/react-hooks`

### US-08 - Choose fulfillment (pickup/curbside)

- Role: Customer (guest)
- Story: As a customer, I want to choose pickup at counter or curbside, so that my order is prepared the way I prefer.
- Acceptance criteria:
  - [ ] Toggle switches active state between the two options per reference.
  - [ ] Location card and instructions reflect the selection.
- Priority: Medium
- Dependencies: US-06
- Status: DONE
- Plan tasks: FE-08
- Skills / guidance: `frontend/react-component-patterns`

### US-09 - Save favorite drinks

- Role: Customer (guest)
- Story: As a customer, I want to mark drinks as favorites, so that I can find them again later.
- Acceptance criteria:
  - [ ] Favorite toggle persists within the session.
  - [ ] Favorites accessible from Profile via "My Favorites".
  - [ ] Favorites list shows saved drinks; removing a drink updates the list and count.
- Priority: Low
- Dependencies: US-03
- Status: DONE
- Plan tasks: FE-10
- Skills / guidance: `frontend/react-hooks`

### US-10 - View profile

- Role: Customer (guest)
- Story: As a customer, I want to view my profile, so that I can access favorites and order history.
- Acceptance criteria:
  - [ ] Profile screen renders.
- Priority: Low
- Dependencies: none
- Status: DONE
### US-11 - Earn & redeem loyalty points

- Role: Customer (guest)
- Story: As a customer, I want to earn 5 points for every drink I buy and redeem 50 points for a free drink, so that I am rewarded for repeat purchases.
- Acceptance criteria:
  - [ ] Each successfully checked-out drink awards 5 points.
  - [ ] Points balance is visible in the cart and on the profile.
  - [ ] When balance reaches 50, a "Use 50 points for a free drink" option appears in the cart.
  - [ ] Redeeming applies a free drink and deducts 50 points; balance updates.
- Priority: Medium
- Dependencies: US-06
- Status: DONE
- Plan tasks: FE-18
- Skills / guidance: `frontend/react-hooks`
### US-12 - Dynamic hero banner & product discounts

- Role: Admin / Customer
- Story: As an admin, I want to flag a product as the hero and assign a discount percentage via JSON so the home banner updates dynamically. As a customer, I want to see the featured product with its discount and image.
- Acceptance criteria:
  - [ ] Hero banner reads the product where isHero === true from products.json.
  - [ ] Discount badge shows only when discountPercentage > 0.
  - [ ] Product cards show discounted price and discount tag when discountPercentage > 0.
- Priority: Medium
- Dependencies: FE-13
- Status: DONE
- Plan tasks: FE-19
- Skills / guidance: `frontend/react-component-patterns`
- Plan tasks: FE-11
- Skills / guidance: `frontend/react-component-patterns`

### US-13 - Guest & account (sign in / sign up)

- Role: Customer (guest/registered)
- Story: As a guest, I see a welcoming "Hello, coffee lover" greeting and a CTA to join the rewards program. As a new user, I can sign up; as a returning user, I can log in with demo credentials.
- Acceptance criteria:
  - [ ] Home greeting shows "Hello, coffee lover" for guests and "Good morning, [name]" for logged-in users.
  - [ ] Guest CTA navigates to signup; login link navigates to login.
  - [ ] Signup page shows "We are happy to have you!" and loyalty program info (5 pts/drink, 50 pts = free drink).
  - [ ] Login validates against users.json demo accounts and sets user state.
  - [ ] Profile tab shows "Sign in" for guests and "Profile" for logged-in users.
- Priority: Medium
- Dependencies: US-10
- Status: DONE

### US-14 - Backend & database integration (PENDING)

- Role: System / Platform
- Story: As the platform, we need a real backend and database to replace the local JSON/mock data, persist users, orders, points, and favorites, and support authentication.
- Acceptance criteria:
  - [ ] REST/GraphQL API for products, users, orders.
  - [ ] Database schema for users, orders, points, favorites.
  - [ ] Authentication (login/signup) backed by server.
  - [ ] Cart and favorites persisted per user.
- Priority: High
- Dependencies: none (deferred)
- Status: PENDING (out of MVP scope; frontend-only for now)
- Plan tasks: —
- Skills / guidance: `engineering/web-project-planning`
- Plan tasks: FE-22
- Skills / guidance: `frontend/react-hooks`
