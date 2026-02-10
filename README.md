# SupplyFlow

## Overview

SupplyFlow is a modern B2B internal operations platform designed to streamline warehouse and outlet management workflows. It addresses the critical challenge of managing supplier relationships, inventory flows, and multi-outlet operations in one centralized system.

**Problem It Solves:**

- Eliminates manual tracking of supplier performance metrics
- Provides real-time visibility into inventory inflow/outflow across multiple locations
- Enables data-driven supplier decisions based on delivery punctuality, quantity accuracy, and price consistency
- Simplifies stock distribution to outlets and internal consumption tracking
- Reduces operational overhead through role-based access control and automated workflows

## Features

- 🔐 **Secure Authentication** - Login with email/password via Supabase Auth
- 👥 **Role-Based Access Control** - Three permission levels (Super Admin, Operations Manager, Store Keeper)
- 📊 **Supplier Performance Tracking** - Monitor delivery punctuality, quantity accuracy, and price consistency
- 📦 **Inventory Management** - Track stock inflow/outflow and warehouse-to-outlet distributions
- 🏪 **Outlet Operations** - Issue stock to outlets and track outlet-level inventory
- 📈 **Analytics & Reports** - Generate operational insights and performance metrics
- 🎨 **Modern UI** - Clean, responsive interface with Material Design icons

## Tech Stack

- **Framework:** Next.js 16.1.6 with App Router
- **React:** 19.2.3 (Server & Client Components)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Icons:** Material Symbols Outlined
- **Font:** Geist Sans & Geist Mono

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

| Variable                        | Description                 | Required |
| ------------------------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      |

## Authentication & Access Control

### User Roles

**1. Super Admin** (`super_admin`)

- Full system access
- User management and permissions
- System configuration and audits

**2. Operations Manager** (`ops_manager`)

- Supplier management and performance tracking
- Inventory inflow/outflow management
- Stock movement and outlet distributions
- Analytics and reports

**3. Store Keeper** (`store_keeper`)

- SKU receiving operations
- Stock execution and physical inventory tasks

### Route Permissions

Routes are protected based on user roles:

- `/dashboard` - All authenticated users
- `/suppliers` - Operations Manager, Super Admin
- `/inventory` - Operations Manager, Super Admin, Store Keeper (limited)
- `/settings` - Super Admin only

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/moteeb-asad/supply-flow.git
cd supply-flow
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Supabase:**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Get your project credentials from Settings > API

   c. Create `.env.local` and add your credentials:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Configure database (optional - for role management):**

```sql
-- Add user roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'ops_manager', 'store_keeper');

-- Extend auth.users with role
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'store_keeper';
```

5. **Create your first admin user:**

   a. Go to Authentication > Users in Supabase Dashboard

   b. Click "Add user" and enter credentials

   c. Set role via SQL Editor:

   ```sql
   UPDATE auth.users SET role = 'super_admin' WHERE email = 'your-email@example.com';
   ```

6. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the login page.

### Build for Production

```bash
npm run build
npm start
```

## Roadmap

SupplyFlow is actively under development with a focus on building core supplier and inventory management features. The immediate priorities include implementing CRUD operations for suppliers, tracking performance metrics (delivery punctuality, quantity accuracy, price consistency), and building inventory inflow/outflow workflows. Future development will expand into outlet management with stock distribution capabilities, advanced analytics dashboards, real-time notifications, and mobile optimization. Long-term goals include multi-warehouse support, barcode scanning, predictive analytics, and third-party integrations for seamless workflow automation across the supply chain.
