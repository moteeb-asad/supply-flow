# SupplyFlow

A modern B2B Supplier Performance, Inventory, and Outlet Operations Dashboard built with Next.js 16.1+, TypeScript, React 19, and Tailwind CSS v4.

## Features

- 🔐 **Supabase Authentication** - Secure login with email/password
- 👥 **Role-Based Access Control** - Three user roles (Super Admin, Operations Manager, Store Keeper)
- 📊 **Dashboard Analytics** - Track supplier performance and inventory metrics
- 📦 **Inventory Management** - Manage stock inflow/outflow and outlet distributions
- 🏢 **Supplier Management** - Monitor supplier performance and deliveries
- 📈 **Reports & Analytics** - Data-driven operational insights

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: Strict mode
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Material Symbols Outlined
- **Font**: Inter

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/moteeb-asad/supply-flow.git
cd supply-flow
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Get your project URL and anon key from Settings > API

3. Create the users table (if using custom user profiles):

```sql
-- Users table is automatically created by Supabase Auth
-- You can extend it with custom fields if needed

-- Example: Add user roles
CREATE TYPE user_role AS ENUM ('super_admin', 'ops_manager', 'store_keeper');

ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'store_keeper';
```

4. Create your first user:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password
   - Optionally set role in SQL Editor:
   ```sql
   UPDATE auth.users SET role = 'super_admin' WHERE email = 'your-email@example.com';
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll be redirected to the login page.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── (auth)/           # Authentication routes (no sidebar/header)
│   └── login/
├── (main)/           # Main app routes
│   ├── (with-header)/    # Routes with header
│   │   └── dashboard/
│   └── (without-header)/ # Routes without header
│       ├── suppliers/
│       ├── inventory/
│       └── reports/
├── layout.tsx
└── globals.css

src/
├── actions/          # Server actions
│   └── auth.actions.ts
├── components/       # UI components
│   ├── auth/
│   ├── layout/
│   └── ...
├── db/              # Database clients
│   └── supabaseClient.ts
├── lib/             # Utilities
│   ├── validators/
│   └── route-permissions.ts
└── types/           # TypeScript types

middleware.ts         # Auth middleware
```

## User Roles

1. **Super Admin** (`super_admin`): Full system access and audits
2. **Operations Manager** (`ops_manager`): Suppliers, inventory, stock movements, analytics
3. **Store Keeper** (`store_keeper`): SKU receiving and stock execution only

## Environment Variables

| Variable                        | Description                 |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## License

MIT
