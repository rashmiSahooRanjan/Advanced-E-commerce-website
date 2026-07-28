# Flint Admin Dashboard

> Administrative workspace for the Flint e-commerce platform — built with React 19, Redux Toolkit, and Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Application Shell](#application-shell)
- [State Management](#state-management)
- [Authentication Workflows](#authentication-workflows)
- [Workspace Modules](#workspace-modules)
  - [Dashboard](#dashboard)
  - [Orders](#orders)
  - [Products](#products)
  - [Users](#users)
  - [Profile](#profile)
- [Utilities](#utilities)
- [Installation](#installation)

---

## Overview

The Flint Admin Dashboard is a standalone React SPA that gives administrators full visibility and control over the Flint e-commerce platform. It connects to the same backend API as the customer storefront but operates exclusively through admin-scoped endpoints.

The workspace covers five functional areas: platform analytics, order lifecycle management, product catalogue CRUD, customer account management, and admin profile and credential settings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 6 |
| State Management | Redux Toolkit 2 + React Redux 9 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios 1.8 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Styling | Tailwind CSS 3 + tailwindcss-animate |
| Notifications | React Toastify 11 |

---

## Project Structure

```
admin/
├── public/
│   └── flint.png
├── src/
│   ├── App.jsx                          # Router, route protection, workspace shell
│   ├── main.jsx                         # React root, Redux Provider
│   ├── index.css                        # Global styles, CSS variables, design tokens
│   │
│   ├── pages/                           # Standalone auth pages (rendered outside shell)
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── components/                      # Workspace layout and module views
│   │   ├── Header.jsx                   # Sticky top bar with breadcrumb and admin avatar
│   │   ├── SideBar.jsx                  # Fixed sidebar with nav and logout
│   │   ├── Dashboard.jsx                # Dashboard module layout
│   │   ├── Orders.jsx                   # Orders module
│   │   ├── Products.jsx                 # Products module + modal orchestration
│   │   ├── Users.jsx                    # Users module
│   │   ├── Profile.jsx                  # Profile and password settings
│   │   └── dashboard-components/
│   │       ├── Stats.jsx                # KPI cards (today revenue, all-time, users)
│   │       ├── MonthlySalesChart.jsx    # Recharts LineChart — 4-month revenue trend
│   │       ├── OrdersChart.jsx          # Recharts PieChart — order status distribution
│   │       ├── TopProductsChart.jsx     # Recharts BarChart — top 5 products by units
│   │       ├── TopSellingProducts.jsx   # Table — top products with category and rating
│   │       └── MiniSummary.jsx          # 6-card monthly summary grid
│   │
│   ├── modals/
│   │   ├── CreateProductModal.jsx       # Multi-image upload, full product form
│   │   ├── UpdateProductModal.jsx       # Pre-populated edit form (no image replacement)
│   │   └── ViewProductModal.jsx         # Read-only product detail with image gallery
│   │
│   ├── store/
│   │   ├── store.js                     # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js             # Session, login, logout, profile, password
│   │       ├── adminSlice.js            # Dashboard stats, user listing and deletion
│   │       ├── productsSlice.js         # Product CRUD, pagination, search
│   │       ├── orderSlice.js            # Order listing and status updates
│   │       └── extraSlice.js            # UI state: active module, sidebar, modal flags
│   │
│   └── lib/
│       ├── axios.js                     # Axios instance with base URL and credentials
│       └── helper.js                    # formatNumber, getLastNMonths
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## Architecture

The admin dashboard is a single-route SPA. All workspace navigation is driven by Redux state (`extra.openedComponent`) rather than URL changes — the browser URL stays at `/` while the content area swaps between modules. Only the auth pages (`/login`, `/password/forgot`, `/password/reset/:token`) use distinct routes and render outside the workspace shell entirely.

**Navigation pattern.** `SideBar` dispatches `toggleComponent(moduleName)` on nav item click. `App.jsx` reads `openedComponent` and renders the corresponding module via a `switch` statement inside `renderDashboardContent()`.

**Route protection.** The root route `/` checks `isAuthenticated && user.role === "Admin"`. Any non-admin or unauthenticated session is redirected to `/login`. The auth pages additionally redirect to `/` if already authenticated as Admin, preventing logged-in admins from landing back on login.

**Bootstrap sequence.** On mount `App.jsx` dispatches `getUser()` to rehydrate session state from the server cookie. Once `isAuthenticated` becomes `true`, two further dispatches fire in parallel — `fetchAllProducts()` and `getDashboardStats()` — so product and stats data are ready before the user navigates to those modules.

```
App mounts
    │
    ▼
dispatch(getUser()) → GET /auth/me
    │
    ▼ isAuthenticated = true
    │
    ├── dispatch(fetchAllProducts())   → GET /product/all
    └── dispatch(getDashboardStats())  → GET /admin/dashboard/stats
```

**Workspace shell layout:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│  SideBar (fixed, 290px) │  Header (sticky h-20)                            │
│                         ├──────────────────────────────────────────────────┤
│  FLINT.  Administrative │                                                  │
│  Workspace              │  <active module>                                 │
│                         │                                                  │
│  ● Dashboard            │  Rendered by renderDashboardContent()            │
│  ● Orders               │  based on extra.openedComponent                  │
│  ● Products             │                                                  │
│  ● Users                │                                                  │
│  ● Profile              │                                                  │
│                         │                                                  │
│  [Logout]               │                                                  │
└──────────────────────── ┴──────────────────────────────────────────────────┘
```

On screens below `md` (768px) the sidebar is hidden by default. A floating `PanelLeftOpen` button fixed to the bottom-left of the screen opens it. When opened, a `bg-black/20 backdrop-blur-sm` overlay fills the screen; tapping it dispatches `toggleNavbar()` to close the sidebar. Clicking a nav item on mobile also auto-closes the sidebar (`if (window.innerWidth < 768) dispatch(toggleNavbar())`).

---

## Application Shell

### `SideBar.jsx`

Renders the fixed 290px left panel. Maintains a local `activeLink` integer that tracks the highlighted nav item. Each nav button dispatches `toggleComponent(item.title)` to update the active workspace module in Redux.

Nav items and their color themes:

| Module | Icon | Active Color |
|---|---|---|
| Dashboard | LayoutDashboard | Blue |
| Orders | ListOrdered | Emerald |
| Products | Package | Purple |
| Users | Users | Amber |
| Profile | User | Rose |

The logout button dispatches the `logout` thunk, which calls `GET /auth/logout`, clears `auth.user`, sets `isAuthenticated` to `false`, and shows a success toast.

If `isAuthenticated` is `false` when `SideBar` renders (e.g. after logout), it returns a `<Navigate to="/login" />` directly.

### `Header.jsx`

Sticky `h-20` top bar. Left side renders a breadcrumb — `Flint Admin › <openedComponent>` — where the module name is read from `extra.openedComponent`. On mobile it shows a hamburger `Menu` icon that dispatches `toggleNavbar()`.

Right side shows the admin's name and role (hidden on mobile) and a rounded avatar image sourced from `user.avatar.url`, falling back to a local `avatar.jpg` asset. An emerald dot on the avatar indicates the online status indicator.

---

## State Management

The Redux store composes five slices:

```javascript
// store.js
{
  extra: extraReducer,    // UI state
  auth: authReducer,      // Session and identity
  admin: adminReducer,    // Stats and user management
  product: productReducer, // Product catalogue
  order: orderReducer,    // Order management
}
```

### `extraSlice`

Manages all UI state with no API interactions.

**State:**
```javascript
{
  openedComponent: "Dashboard",          // Active workspace module
  isNavbarOpened: false,                 // Mobile sidebar toggle
  isViewProductModalOpened: false,
  isCreateProductModalOpened: false,
  isUpdateProductModalOpened: false,
}
```

**Exported actions:** `toggleComponent`, `toggleNavbar`, `toggleCreateProductModal`, `toggleViewProductModal`, `toggleUpdateProductModal`

---

### `authSlice`

Manages admin identity throughout the session lifecycle.

**State:**
```javascript
{
  loading: false,
  user: null,
  isAuthenticated: false,
}
```

**Thunks and their API calls:**

| Thunk | Method | Endpoint | Side Effect |
|---|---|---|---|
| `login(formData)` | POST | `/auth/login` | Validates `user.role === "Admin"` before dispatching success. Non-admin accounts receive an error toast and are redirected to `http://localhost:5173` |
| `getUser()` | GET | `/auth/me` | Session hydration on app mount |
| `logout()` | GET | `/auth/logout` | Clears `user`, sets `isAuthenticated = false` |
| `forgotPassword(email)` | POST | `/auth/password/forgot` | Triggers backend reset email |
| `resetPassword(data, token)` | PUT | `/auth/password/reset/:token` | Replaces password using URL token |
| `updateAdminProfile(formData)` | PUT | `/auth/profile/update` | Updates name, email, avatar via multipart |
| `updateAdminPassword(formData)` | PUT | `/auth/password/update` | Changes password with current-password verification |

---

### `adminSlice`

Manages dashboard analytics and the customer user list.

**State:**
```javascript
{
  loading: false,
  users: [],
  totalUsers: 0,
  // Analytics
  totalRevenueAllTime: 0,
  todayRevenue: 0,
  yesterdayRevenue: 0,
  totalUsersCount: 0,
  monthlySales: [],
  orderStatusCounts: {},
  topSellingProducts: [],
  lowStockProducts: 0,
  revenueGrowth: "",
  newUsersThisMonth: 0,
  currentMonthSales: 0,
}
```

**Thunks:**

`fetchAllUsers(page)` — `GET /admin/customer/all?page=<n>`. Populates `users[]` and `totalUsers` for the current page (10 per page).

`deleteUser(id, page)` — `DELETE /admin/customer/:id`. On success, removes the user from `users[]` locally, decrements `totalUsers` and `totalUsersCount`, recalculates the max page based on the updated total, clamps `page` to that max, and re-fetches the page:
```javascript
const updatedTotal = state.admin.totalUsers;
const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
const validPage = Math.min(page, updatedMaxPage);
dispatch(fetchAllUsers(validPage));
```

`getDashboardStats()` — `GET /admin/dashboard/stats`. Populates all analytics fields in a single response.

---

### `productsSlice`

Manages the product catalogue with two separate loading flags to distinguish between submit operations and list fetches.

**State:**
```javascript
{
  loading: false,          // Create / update / delete operations
  fetchingProducts: false, // List fetch (drives skeleton loader in Products)
  products: [],
  totalProducts: 0,
}
```

**Thunks:**

`fetchAllProducts({ page, search, category, availability, ratings, price })` — `GET /product/all` with URLSearchParams. All filter params are optional and only appended when non-empty.

`createNewProduct(formData)` — `POST /product/new` as multipart. On success, prepends the new product to `products[]`, increments `totalProducts`, and dispatches `toggleCreateProductModal()` to close the modal.

`updateProduct(data, id)` — `PUT /product/:id`. On success, maps over `products[]` and replaces the matching entry with the updated product from the response, then dispatches `toggleUpdateProductModal()`.

`deleteProduct(id, page)` — `DELETE /product/:id`. On success, filters the product out of `products[]`, decrements `totalProducts`, clamps the page (same pattern as `deleteUser`), and re-fetches.

---

### `orderSlice`

Uses `createAsyncThunk` for both operations (the only slice in the app that does so).

**State:**
```javascript
{
  loading: false,
  orders: [],
  error: null,
}
```

**Thunks:**

`fetchAllOrders()` — `GET /orders/all`. Loads the full platform order list.

`updateOrderStatus({ id, status })` — `PATCH /orders/:id/status` with `{ order_status: status }`. On fulfillment, finds the order in `orders[]` by `id` and merges the new `order_status` field in place:
```javascript
state.orders[index] = { ...state.orders[index], ...action.payload };
```

---

## Authentication Workflows

### Login (`/login`)

Email and password are submitted as `FormData` to `POST /auth/login`. The `login` thunk inspects the response before dispatching success:

```javascript
if (res.data.user.role === "Admin") {
  dispatch(loginSuccess(res.data.user));
} else {
  dispatch(loginFail());
  toast.error("You are not an admin.");
  window.location.href = "http://localhost:5173"; // redirect to storefront
}
```

The form includes a password visibility toggle (Eye / EyeOff) and a "Remember me" checkbox. The submit button shows a spinner with "Signing In..." text during `loading`.

If the user is already authenticated as Admin, the page renders `<Navigate to="/" />` immediately.

### Forgot Password (`/password/forgot`)

Collects an email address and dispatches `forgotPassword({ email })` to `POST /auth/password/forgot`. The email field is cleared after dispatch. A success toast confirms the reset link was sent. The form does not indicate whether the email address exists in the system.

### Reset Password (`/password/reset/:token`)

Reads the reset token from `useParams()`. Collects `password` and `confirmPassword`, each with an independent visibility toggle. Dispatches `resetPassword({ password, confirmPassword }, token)` to `PUT /auth/password/reset/:token`. A security tip card is shown below the inputs reminding the user to use a strong password.

---

## Workspace Modules

### Dashboard

The Dashboard module is a read-only analytics view assembled entirely from `admin` slice state. Data is fetched once on `isAuthenticated` and does not poll or auto-refresh.

**Layout:**

```
Dashboard Overview                        [System operational ●]
│
├── Stats row                             (Stats.jsx)
│     Today's Revenue  •  All-Time Revenue  •  Total Users
│
├── Charts row (xl: 2/3 + 1/3)
│     MonthlySalesChart (xl:col-span-2)   OrdersChart
│
├── Lower charts row (xl: 1/2 + 1/2)
│     TopProductsChart                    TopSellingProducts
│
└── MiniSummary
```

#### `Stats.jsx`

Three KPI cards displayed in a `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` grid:

- **Today's Revenue** — `₹{formatNumber(todayRevenue)}`. Includes a day-over-day change badge computed with `useEffect` whenever `todayRevenue` or `yesterdayRevenue` change. Formula: `((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100`. If `yesterdayRevenue` is `0`, change defaults to `+100%`. Badge shows `TrendingUp` (emerald) or `TrendingDown` (red) icon.
- **All-Time Revenue** — `₹{formatNumber(totalRevenueAllTime)}`. No change indicator.
- **Total Users** — `formatNumber(totalUsersCount)`. No change indicator.

#### `MonthlySalesChart.jsx`

Recharts `LineChart` showing revenue for the last 4 months. `getLastNMonths(4)` generates the month axis labels. The sales array from Redux is matched against these labels by month string; unmatched months are zero-filled so the chart always renders a complete 4-point series even if the backend returns fewer data points.

```javascript
const filled = months.map((month) => {
  const found = monthlySales?.find((item) => item.month === month);
  return { month, totalSales: found?.totalSales || 0 };
});
```

The line uses `stroke="#10b981"` (emerald) with `strokeWidth={3}` and hollow dots (`fill: "#ffffff"`).

#### `OrdersChart.jsx`

Recharts `PieChart` (donut variant: `innerRadius={55}`, `outerRadius={82}`) showing the distribution of `orderStatusCounts`. Status-to-color mapping:

| Status | Color |
|---|---|
| Processing | `#f59e0b` |
| Shipped | `#3b82f6` |
| Delivered | `#22c55e` |
| Cancelled | `#ef4444` |

A `grid-cols-2` legend below the chart shows each status label and its count.

#### `TopProductsChart.jsx`

Recharts `BarChart` with `layout="vertical"` showing the top 5 products by `total_sold`. The Y-axis uses a `CustomYAxisTick` that renders each product's thumbnail image inside a `<foreignObject>` element (32×32px, `border-radius: 10px`), placing the image where a text tick would normally go. A `CustomTooltip` renders the product name and units sold on hover.

#### `TopSellingProducts.jsx`

An `overflow-x-auto` scrollable table listing the top-selling products with four columns: Product (thumbnail + name), Category (badge), Sold (emerald text), Rating (amber star icon + value). Empty state renders a single `colSpan={4}` row with "No product analytics available."

#### `MiniSummary.jsx`

A `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` card grid with 6 operational metrics:

| Card | Value | Source |
|---|---|---|
| Monthly Sales | `₹{formatNumber(currentMonthSales)}` | `admin.currentMonthSales` |
| Orders Placed | Sum of all `orderStatusCounts` values | Computed client-side |
| Top Product | Units sold by `topSellingProducts[0]` | `admin.topSellingProducts` |
| Low Stock Alerts | Count of low-stock products | `admin.lowStockProducts` |
| Revenue Growth | % vs previous month | `admin.revenueGrowth` |
| New Customers | Signups this month | `admin.newUsersThisMonth` |

---

### Orders

Fetches all platform orders via `fetchAllOrders()` on mount. All filtering is client-side over the full loaded list.

**Filtering** is handled by a `useMemo` that chains two filters:

1. Status filter — a `<select>` with values: All, Processing, Shipped, Delivered, Cancelled. When "All" is selected no status filter is applied.
2. Search input — matches `order.id`, `order.buyer.name`, and `order.buyer.email` case-insensitively.

A counter badge shows `{filteredOrders.length} Orders` in the header.

**Order cards.** Each order renders as a full-width card with three sections:

- **Header section** — Order ID (first 8 characters of UUID), status badge, customer name, email, and placement date. On the right: total amount with `IndianRupee` icon and a status `<select>` dropdown.
- **Items section** — `bg-zinc-50` panel listing each `order_item` as a row with thumbnail, title, quantity, unit price, and line total.
- **Shipping section** — Grid showing full name, phone, and full address composed from `address`, `city`, `state`, `country`, and `pincode`.

**Status update.** Changing the `<select>` value calls `handleStatusChange(order.id, newStatus)` which dispatches `updateOrderStatus({ id, status })`. The dropdown is disabled while `loading` is `true` to prevent double-submit.

**Loading state.** If `loading && orders.length === 0` (initial load) the component renders three `h-64 animate-pulse rounded-2xl` skeleton blocks instead of the order list.

**Empty state.** When `filteredOrders.length === 0` a centred empty state card shows the `ShoppingBag` icon, a "No Orders Found" heading, descriptive text, and two info tags showing total order count and the active filter.

**Status badge styles:**

| Status | Style |
|---|---|
| Processing | `bg-amber-50 text-amber-700 border-amber-200` + Clock3 icon |
| Shipped | `bg-blue-50 text-blue-700 border-blue-200` + Truck icon |
| Delivered | `bg-emerald-50 text-emerald-700 border-emerald-200` + PackageCheck icon |
| Cancelled | `bg-red-50 text-red-700 border-red-200` + XCircle icon |

---

### Products

Server-side paginated product catalogue with search and full CRUD via three modals.

**Search and pagination.** Search input changes trigger a 400ms debounced `fetchAllProducts` dispatch:
```javascript
useEffect(() => {
  const timeout = setTimeout(() => {
    dispatch(fetchAllProducts({ page, search }));
  }, 400);
  return () => clearTimeout(timeout);
}, [dispatch, page, search]);
```

`maxPage` is derived from `Math.ceil(totalProducts / 10) || 1` and updated whenever `totalProducts` changes. Previous/Next buttons clamp to `[1, maxPage]`.

**Table columns:** Product (thumbnail + name + truncated ID), Category (purple badge), Price (₹ formatted), Stock (colour-coded: emerald `> 10`, amber `> 0`, red `= 0`), Rating, Actions.

**Action buttons per row:** View (grey border), Edit (blue), Delete (red). View and Edit store the row's product in `selectedProduct` local state before dispatching the modal toggle.

**Loading state.** When `fetchingProducts` is `true`, the table body is replaced with a centred `LoaderCircle animate-spin` spinner.

**Empty state.** When `products.length === 0` after a fetch completes, the table body is replaced with a centred `Package` icon and "No products found" with a prompt to create the first listing.

#### `CreateProductModal.jsx`

A `max-w-3xl max-h-[90vh]` fixed centred modal with a scrollable body.

**Fields:** Product Name (text, required), Category (select from 8 options), Price (number, required), Stock Quantity (number, required), Description (textarea 5 rows, required), Product Images (multi-file input with drag-target UI).

**Image handling.** Files from the multi-file input are stored in `formData.images` as an array via `Array.from(e.target.files)`. A 2–4 column preview grid renders `URL.createObjectURL(image)` thumbnails immediately. On submit, each image is appended to `FormData` individually:
```javascript
for (let i = 0; i < formData.images.length; i++) {
  data.append("images", formData.images[i]);
}
```

On success, `toggleCreateProductModal()` is dispatched from within the thunk and the new product is prepended to the Redux `products[]` array.

**Category options:** Electronics, Fashion, Home & Garden, Sports, Books, Beauty, Automotive, Kids & Baby.

#### `UpdateProductModal.jsx`

Receives `selectedProduct` as a prop. A `useEffect` pre-populates form state when `selectedProduct` changes. Shows a product preview card at the top with the existing thumbnail, name, ID, category badge, and stock availability badge.

**Fields:** Product Name, Category, Price, Stock Quantity, Description. Image update is not supported in this modal — existing images are preserved server-side.

Dispatches `updateProduct(data, selectedProduct.id)`. On success, the products array entry is replaced in place and `toggleUpdateProductModal()` is dispatched from the thunk.

#### `ViewProductModal.jsx`

Read-only. `max-w-5xl` two-column layout (left: images, right: info).

**Left column:** Main image at `h-[350px] object-cover`, then a `grid-cols-4` thumbnail strip of all product images.

**Right column:** Category and stock availability badges, product name, description, then a `grid-cols-2` stat card grid: Price (emerald), Rating (amber), Stock (blue), Product ID (purple). A metadata section below shows created date, category, and ratings in a key-value list.

---

### Users

Server-side paginated customer list. 10 users per page. Pagination triggers a new `fetchAllUsers(page)` dispatch via `useEffect([dispatch, page])`.

**Search.** A `useMemo`-filtered view of the current page's `users[]` array. Matches on `user.name` and `user.email` case-insensitively. Note: search only filters the currently loaded page, not the full dataset.

**Total Users widget.** A card in the page header displays `totalUsers` from Redux state with an orange `UsersIcon`.

**Table columns:** User (avatar or name initial fallback + name + truncated ID), Role (orange Admin badge with ShieldCheck icon, grey Customer badge with User icon), Email (with Mail icon), Joined (formatted date with CalendarDays icon), Actions.

**Avatar fallback.** If `user.avatar.url` is falsy, a `bg-zinc-900 text-white` div renders the first character of the user's name as the initial.

**Delete.** The delete button triggers `window.confirm("Delete this user?")` before dispatching `deleteUser(id, page)`. The thunk removes the user locally, decrements totals, recalculates max page, and re-fetches the clamped page.

**Empty state.** When `filteredUsers.length === 0` and not loading, renders a card with `UsersIcon` and "No Users Found".

**Pagination controls.** Previous / Next buttons with `disabled` state when at boundary pages. Styled with cursor-not-allowed when disabled.

---

### Profile

Two-column layout: a narrow left column with the profile card and access level indicators, and a wider right column with two editable forms.

**Left column:**

- Profile card — avatar (live-previewed via `URL.createObjectURL(avatar)` when a new file is staged, otherwise `user.avatar.url` or local fallback), name, email, role badge. An orange camera-button `<label>` overlays the avatar as a file input trigger.
- Access Level card — blue, shows "Administrator".
- Security card — emerald, shows "Protected Account".

**Right column:**

**Personal Information form** — Name (text) and Email (text) fields in a `md:grid-cols-2` grid. On submit, packages fields into `FormData` (including the staged avatar file if present) and dispatches `updateAdminProfile(formData)`. The submit button shows "Updating..." during `loading`.

**Password & Security form** — Three password inputs stacked vertically: Current Password, New Password, Confirm New Password. All submitted as `FormData` to `updateAdminPassword(formData)`. Client-side field equality is not validated before dispatch — that validation is handled by the backend. The submit button shows "Updating..." during `loading`.

Both forms share `auth.loading` as their loading state, so concurrent submission of both forms is not possible.

---

## Utilities

### `lib/axios.js`

```javascript
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/v1"
    : "/",
  withCredentials: true,
});
```

`withCredentials: true` ensures the JWT session cookie is included in every request, enabling cookie-based authentication without manual token handling. In production the base URL collapses to `/`, relying on a reverse proxy to forward API requests.

### `lib/helper.js`

**`getLastNMonths(n)`** — Returns an array of `n` month objects `{ month: "May 2025", key: <timestamp> }` counting back from the current month. Used by `MonthlySalesChart` to build a guaranteed-length month axis that zero-fills missing backend data.

**`formatNumber(num)`** — Abbreviates large numbers for display:
- `< 1000` → as-is
- `>= 1000` → `K` (e.g. `4500` → `4.5K`)
- `>= 1_000_000` → `M`
- `>= 1_000_000_000` → `B`

Trailing `.0` is stripped (e.g. `2.0K` → `2K`).

### Tailwind Configuration

The Tailwind config extends the default theme with CSS variable–based semantic color tokens (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `card`, `sidebar`, etc.) resolved from `hsl(var(--*))` values defined in `index.css`. This enables the `admin-card`, `input-primary`, and other utility classes used across the auth pages. `tailwindcss-animate` is registered as a plugin for the `accordion-down/up` keyframe animations.

---

## Installation

```bash
cd flint-ecommerce/admin
npm install
npm run dev          # http://localhost:5174
```

The dashboard expects the Flint backend running at `http://localhost:4000`. Update `src/lib/axios.js` if the backend is on a different port.

To build for production:

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

In production the `baseURL` resolves to `/` — configure your reverse proxy to forward `/api/v1/*` requests to the backend.