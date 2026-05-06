# SupplyFlow - Copilot Instructions

## Project Overview

SupplyFlow is a modern B2B Supplier Performance, Inventory, and Outlet Operations Dashboard built with Next.js 16.1+, TypeScript, React 19, and Tailwind CSS v4. It's an internal operations platform for tracking supplier performance, managing inventory inflow/outflow, issuing stock to outlets, and generating data-driven operational insights.

## Core Capabilities

- Track supplier performance (delivery punctuality, quantity accuracy, price consistency)
- Manage inventory inflow and outflow
- Issue stock from warehouse to outlets
- Track outlet-level inventory and costs
- Generate outlet bills (sales or internal consumption)
- Enable data-driven supplier and operational decisions

## Architecture Principles (CRITICAL)

1. **Server-First**: Use Next.js App Router with Server Components by default
2. **Client Components**: Opt into Client Components only for interactivity (forms, modals, dropdowns, charts)
3. **Clean Architecture**: Keep layout, UI, business logic, and permissions strictly separated
4. **Avoid Anti-Patterns**: No prop drilling, no conditional layout hacks, no hard-coded logic
5. **Declarative Configuration**: Prefer configuration over imperative code
6. **2026 Best Practices**: Write code optimized for readability, maintainability, and scalability

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **React**: v19.2.3 with server/client components
- **Styling**: Tailwind CSS v4 with inline theme configuration
- **TypeScript**: Strict mode enabled, path alias `@/*` maps to project root

## Directory Structure

```
app/                    # Next.js App Router
  (auth)/              # Route group: login, no sidebar/header
  (dashboard)/         # Route group: main app with persistent layout
  layout.tsx           # Root layout with Geist fonts
  globals.css          # Tailwind v4 imports
src/
  components/          # UI components only
    layout/            # Layout structure (sidebar, header)
      sidebar/
        menu.config.ts # Declarative role-based menu
  services/            # Business logic
  lib/
    permissions.ts     # Server-side permission checks
```

## User Roles & Access Control

Three roles with distinct permissions (UI visibility differs, but **security must always be enforced server-side**):

1. **Super Admin** (`super_admin`): Full system access and audits
2. **Operations Manager** (`operations_manager`): Suppliers, inventory, stock movements, analytics
3. **Store Keeper** (`store_keeper`): SKU receiving and stock execution only

**RBAC Implementation:**

- Declarative menu config in [src/components/layout/sidebar/menu.config.ts](src/components/layout/sidebar/menu.config.ts)
- Server-side permission checks in `lib/permissions.ts`
- Menu structure: `{ label, path, roles[] }`

```typescript
// Example from menu.config.ts
{
  label: "SKU Receiving",
  path: "/inventory/receive",
  roles: ["store_keeper"]
}
```

## Routing & Layout Strategy

### Route Groups Pattern

- `(auth)` group: Login, signup - **NO sidebar/header**
- `(dashboard)` group: Main app with **persistent sidebar and header**
- Only the main content area changes per route

### Layout Rules (CRITICAL)

- **Use nested layouts** instead of conditional rendering
- Layouts handle structure only (sidebar, header, main container)
- No route-specific or role-specific conditionals inside layout components
- Pages remain thin and declarative

### Sidebar & Header Guidelines

- Sidebar items are role-filtered but contain **no business logic**
- Header displays user info and global actions only
- Avoid prop drilling between layout components
- Configuration over conditional rendering

## Code Organization Boundaries

**Strict separation of concerns:**

- `app/` - Routes and page composition
- `src/components/` - UI components only
- `src/services/` - Business logic (data fetching, mutations)
- `lib/permissions.ts` - Authorization logic
- `*.config.ts` - Declarative configuration files

**Example:**

```typescript
// ❌ BAD: Business logic in component
export default function SupplierList() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/api/suppliers')... }, []);
  return <Table data={data} />;
}

// ✅ GOOD: Separation of concerns
// page.tsx (Server Component)
export default async function SupplierList() {
  const suppliers = await getSuppliers(); // service
  return <SupplierTable suppliers={suppliers} />; // component
}
```

## Key Patterns & Conventions

### Font Configuration

- Uses Geist Sans and Geist Mono via next/font/google
- CSS variables: `--font-geist-sans`, `--font-geist-mono`
- Applied in [app/layout.tsx](app/layout.tsx) root layout

### Styling Approach

- **Tailwind v4** with `@import "tailwindcss"` in [app/globals.css](app/globals.css)
- Inline theme using `@theme inline` block for CSS variables
- Dark mode via `prefers-color-scheme` media query
- Custom properties: `--background`, `--foreground` with dark mode support

### Role-Based Access Control

See [src/components/layout/sidebar/menu.config.ts](src/components/layout/sidebar/menu.config.ts):

- Menu items filtered by user roles
- Three roles: `super_admin`, `operations_manager`, `store_keeper`
- Menu structure: `{ label, path, roles[] }`

**Example menu item:**

```typescript
{
  label: "SKU Receiving",
  path: "/inventory/receive",
  roles: ["store_keeper"]
}
```

### Component Organization

- Layout components in `src/components/layout/`
- Separate directories for logical groupings (header, sidebar)
- Configuration files use `.config.ts` suffix (e.g., `menu.config.ts`)

## TypeScript & Code Quality

- **Strict mode enabled** - All code must satisfy strict type checking
- **Prefer composition** over inheritance
- **Avoid global state** unless clearly justified
- **Prefer server actions** for mutations (Next.js 15+ pattern)
- **Write clear, predictable, maintainable code**

## Development Workflow

### Commit Message Format

- Use a conventional commit subject: `<type>(<scope>): <summary>`.
- Use a compact bullet list in the commit body with no blank lines between bullets.
- Keep bullets action-oriented and specific to changed areas.
- Prefer one logical change per commit.

Example:

```text
feat(purchase-orders): align create and edit drawer flow
- Refactor create PO action to parse FormData and validate with shared schema
- Refactor update PO action to use useActionState-compatible signature
- Sync edit drawer behavior with create drawer for cache invalidation and close-on-success
- Replace supplier selection wiring with SupplierAssignmentSection and single supplier error source
```

### Commands

```bash
npm run dev     # Start dev server on localhost:3000
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Path Aliases

- `@/*` imports resolve to project root (configured in [tsconfig.json](tsconfig.json))
- Example: `import { Header } from '@/src/components/layout/header/Header'`

### ESLint Configuration

- Uses flat config format ([eslint.config.mjs](eslint.config.mjs))
- Next.js TypeScript and Core Web Vitals presets enabled
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Important Constraints

1. **Empty Component Files**: Many layout component files (DashboardLayout, Header, Sidebar, etc.) are currently empty placeholders. Implement these following the route group and nested layout patterns described above.

2. **Tailwind v4 Syntax**: Use `@import "tailwindcss"` instead of v3's `@tailwind` directives. Theme configuration uses inline `@theme` blocks.

3. **TypeScript Strict Mode**: All code must satisfy strict type checking.

4. **React 19**: Leverage new React 19 features where appropriate (server/client components).

5. **No Conditional Layouts**: Never check `pathname` or `role` to conditionally render sidebar/header. Use route groups and nested layouts.

## Engineering Mindset

Think like a senior frontend engineer in 2026:

- **Clean boundaries** between layers
- **Server-first decisions** (default to Server Components)
- **Scalable patterns** that grow with the codebase
- Code that is easy to reason about, test, and explain in interviews

## Next Steps for Development

When implementing dashboard features:

- Create `(auth)` and `(dashboard)` route groups in `app/`
- Build `(dashboard)/layout.tsx` with sidebar + header structure
- Implement empty layout components based on nested layout pattern
- Add server-side permission middleware for route protection
- Keep pages thin - delegate to services and components
