# CertiVerify - Digital Certificate Generation and Verification System

A modern, responsive frontend for issuing and verifying digital certificates. Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Public Features
- **Landing Page**: Professional marketing page with features overview and how-it-works section
- **Public Verification**: Anyone can verify certificate authenticity using unique verification tokens or QR codes
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop

### Admin Features
- **Authentication**: Secure login with JWT token-based authentication
- **Dashboard**: Overview with statistics and quick actions
- **Recipient Management**: Add, view, edit, and search certificate recipients
- **Certificate Management**: Issue certificates, view details, download PDFs, and manage verification links
- **Responsive Sidebar**: Collapsible desktop sidebar with mobile navigation drawer

## Technology Stack

- **Framework**: Next.js 16.4.3 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod
- **Tables**: TanStack Table
- **Notifications**: Sonner
- **API Client**: Native fetch with centralized client

## Project Structure

```
certiverify/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication route group
│   │   │   └── page.tsx         # Login page
│   │   ├── (admin)/             # Admin route group (protected)
│   │   │   ├── layout.tsx       # Admin layout with sidebar
│   │   │   ├── dashboard/       # Dashboard page
│   │   │   ├── recipients/      # Recipient management
│   │   │   └── certificates/    # Certificate management
│   │   ├── verify/              # Public verification
│   │   │   └── [token]/         # Dynamic verification page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (sidebar, header, mobile nav)
│   │   ├── shared/             # Shared components (status badge, toaster)
│   │   └── providers.tsx       # App providers
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication API, schemas, types
│   │   ├── dashboard/          # Dashboard API
│   │   ├── recipients/         # Recipient API, schemas, types
│   │   ├── certificates/       # Certificates API, schemas, types
│   │   └── verification/       # Verification API, types
│   ├── lib/                    # Utilities
│   │   ├── api-client.ts       # Centralized API client
│   │   ├── auth.ts             # Authentication utilities
│   │   └── utils.ts            # General utilities
│   └── types/                  # TypeScript types
│       ├── api.ts
│       ├── auth.ts
│       ├── recipient.ts
│       └── certificate.ts
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to your backend API base URL. The default is `http://localhost:5000/api`.


### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Backend API Integration

The frontend is designed to work with an Express.js + MySQL backend. The following API endpoints are expected:

### Authentication
- `POST /api/auth/login` - Admin login

### Dashboard
- `GET /api/dashboard` - Dashboard totals and recent certificates. Return `stats` with `total_recipients`, `total_certificates`, `valid_certificates`, and `revoked_certificates`, plus `recent_certificates` with `id`, `certificate_number`, `title`, `recipient_name`, `issue_date`, and `status`.

### Recipients
- `GET /api/recipients` - List recipients (supports `?search=`, `?page=`, and `?limit=` queries)
- `GET /api/recipients/:id` - Get recipient details
- `POST /api/recipients` - Create recipient
- `PUT /api/recipients/:id` - Update recipient

### Certificates
- `GET /api/certificates` - List certificates (supports `?search=`, `?status=`, `?page=`, and `?limit=` queries)
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/certificates` - Issue certificate
- `GET /api/certificates/:id/pdf` - Download certificate PDF

### Verification
- `GET /api/verify/:token` - Verify certificate (public endpoint)

List endpoints return `{ items, total, page, limit }` using the resource-specific `recipients` or `certificates` array key. All admin endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

## Design System

### Brand Colors
- Primary: near-black in light mode and white in dark mode
- Accent: `#087FBD`
- Main Text: `#172033`
- Secondary Text: `#667085`
- Background: `#F7F9FC`
- Card Background: `#FFFFFF`
- Border: `#E5EAF0`
- Success: Green
- Warning: Amber
- Error: Red

### Components

All UI components use shadcn/ui primitives. Custom components are in:
- `src/components/layout/` - Application layout components
- `src/components/shared/` - Reusable shared components

## Authentication

The application uses JWT token-based authentication:

1. Login via `/login` with email and password
2. Token is stored in localStorage
3. Token is sent in the `Authorization` header for all admin API requests
4. Logout clears the token and redirects to home

**Note**: The current implementation uses localStorage for token storage. For production, consider using HttpOnly cookies or a more secure session management approach.

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Admin login
- `/verify/[token]` - Public certificate verification

### Protected Admin Routes
- `/dashboard` - Dashboard overview
- `/recipients` - Recipients list
- `/recipients/new` - Add recipient
- `/recipients/[id]` - Recipient details
- `/certificates` - Certificates list
- `/certificates/issue` - Issue certificate
- `/certificates/[id]` - Certificate details

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2024 CertiVerify. All rights reserved.
