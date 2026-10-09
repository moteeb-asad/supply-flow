# SupplyFlow - Copilot Instructions

## Scope

This file defines SupplyFlow-specific engineering rules and architecture guidance.
For Next.js framework behavior, use the root AGENTS.md guidance.

## Next.js Reference Policy

For Next.js APIs, conventions, and version-sensitive behavior, follow the root AGENTS.md and consult the documentation bundled with the installed Next.js version. Do not rely on outdated Next.js knowledge or introduce APIs from a newer version unless explicitly requested.

## Product Context

SupplyFlow is an internal B2B operations platform for:

- Supplier performance tracking
- Inventory inflow and outflow management
- SKU receiving and warehouse execution workflows
- Outlet-level inventory/cost visibility and billing support
- Operational analytics and decision support

## Architecture Principles

1. Server-first by default: prefer Server Components in the App Router.
2. Client Components are opt-in for interactivity only (forms, dialogs, dropdowns, charts, local UI state).
3. Keep strict boundaries between layout structure, UI rendering, business logic, and authorization.
4. Prefer declarative configuration files over ad-hoc conditional logic.
5. Avoid prop drilling, route-based layout hacks, and hard-coded role/permission behavior in UI components.
6. Optimize for readability, maintainability, and scalable feature growth.

## Project Structure and Ownership

- app/: routing, route groups, page composition, and layout shells.
- src/components/: presentational and interaction UI only.
- src/features/: feature-scoped screens, form layers, and feature orchestration.
- src/services/: business logic, data operations, and workflow rules.
- src/lib/: shared utilities and routing/permission configuration.
- src/db/: Supabase client factories for server, browser, and admin contexts.
- supabase/migrations/: schema evolution and policy changes, incrementally versioned.

Keep business logic out of reusable UI components. Pages and server actions should orchestrate services/components, not embed data-access rules directly in component markup.

## App Router and Layout Conventions

- Use route groups to separate authentication flow and authenticated application surfaces.
- Auth routes must not render dashboard chrome.
- Main application routes use persistent layout shells with nested layouts.
- Layout files own structure only (shell, regions, composition). No role-specific rendering branches inside layout components.
- Do not implement pathname-based conditional layout toggles in shared layout components.

## Server and Client Boundaries

- Prefer server-side data loading and mutations where possible.
- Use client-side state only for local interactivity and UX controls.
- Do not import server-only Supabase helpers into client components.
- Keep cache/query UI mechanics separate from domain rules.

## RBAC and Authorization

- Security is enforced server-side; UI visibility is never the security boundary.
- Maintain role permissions declaratively via route/menu configuration.
- Current role model: super_admin, operations_manager, store_keeper.
- Route protection must be applied in middleware/server layers before rendering protected data.
- Database-level access control (RLS and policies) is required for sensitive tables and workflows.

## Supabase and Database Conventions

- Use the server Supabase client for Server Components, Route Handlers, and server actions.
- Use the browser Supabase client only in client components.
- Use the admin client only for privileged operations that require service-role context.
- Keep service-role usage isolated and minimal.
- Preserve and extend RLS policies through migrations; do not bypass policy design with client-only checks.
- Add schema and policy changes through ordered migration files in supabase/migrations.
- Favor id-based relationships and explicit foreign keys over name-based coupling.

## Services and Business Logic Boundaries

- Place domain logic in services and feature modules, not in shared UI primitives.
- Keep data fetch/mutation logic out of generic table, form, and layout components.
- Compose pages/screens from service outputs plus typed UI contracts.
- Keep feature behavior explicit and testable.

## Component Organization

- src/components/layout: shell-level UI primitives (sidebar, header, wrappers) without business rules.
- src/components/ui and shared components: reusable visual building blocks.
- src/features/<feature>: feature-specific screens, tables, filters, forms, and action wiring.
- Use declarative config files (for example menu and header/page-title mappings) for navigation and structure metadata.

## TypeScript and Styling Standards

- TypeScript strict mode must pass without weakening compiler guarantees.
- Favor clear domain types and explicit function contracts.
- Avoid any except where technically unavoidable and isolated.
- Tailwind CSS v4 conventions apply, including v4 import/theme patterns used by this codebase.
- Keep styling tokens and patterns consistent with existing globals and layout primitives.

## Coding Quality and Maintainability

- Prefer clear, predictable code over clever shortcuts.
- Keep modules focused and composable.
- Minimize hidden side effects.
- Add targeted comments only where logic is non-obvious.
- Preserve existing architecture boundaries when extending features.

## Development Workflow

### Commit Convention

- Subject format: <type>(<scope>): <summary>
- Keep each commit focused on one logical change.
- Include a compact, action-oriented bullet list in the commit body when relevant.

### Common Commands

- npm run dev
- npm run build
- npm run start
- npm run lint

### Delivery Expectations

- Validate behavior and architecture fit before finishing.
- Maintain backward-compatible routing and permission behavior unless explicitly changing it.
- Keep documentation aligned with architectural decisions and migrations.
