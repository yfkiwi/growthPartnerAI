# Growth Partner AI - Startup Validation Platform

A Next.js 14 web application for startup idea validation that generates investor-ready reports through AI-powered analysis.

## Features

- **User Flow**: Submit startup ideas, select report types, and receive AI-generated insights
- **Admin Dashboard**: Manage submissions and update statuses
- **Payment Integration**: Stripe integration for premium reports ($29 single / $99 bundle)
- **Report Display**: Free summary + paid full version system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Payment**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd startup-validator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup (Supabase)

1. Create a new Supabase project
2. Run the following SQL to create the submissions table:

```sql
-- Create submissions table
create table submissions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  idea text not null,
  report_type text not null check (report_type in ('validation', 'competitor', 'mvp', 'investor', 'gtm')),
  payment_status text default 'free' check (payment_status in ('free', 'paid_single', 'paid_bundle')),
  status text default 'pending' check (status in ('pending', 'completed')),
  stripe_payment_intent_id text,
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table submissions enable row level security;

-- Create policy for admin access (adjust based on your auth setup)
create policy "Admin can do everything" on submissions for all using (true);
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
startup-validator/
├── app/
│   ├── api/
│   │   ├── submissions/route.ts
│   │   ├── stripe/route.ts
│   │   └── admin/
│   │       └── submissions/route.ts
│   ├── admin/
│   │   └── page.tsx
│   ├── feature-selection/
│   │   └── page.tsx
│   ├── email-collection/
│   │   └── page.tsx
│   ├── success/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── report/
│   │   └── [id]/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   ├── supabase.ts
│   └── stripe.ts
├── types/
│   └── index.ts
└── README.md
```

## Key Pages

### 1. Landing Page (`/`)
- Hero section with startup idea input
- Trust indicators
- Feature showcase
- CTA buttons

### 2. Feature Selection (`/feature-selection`)
- Radio button selection for 5 report types
- Shows user's submitted idea
- Navigation back to landing page

### 3. Email Collection (`/email-collection`)
- Email input form
- Submission summary
- API integration to create submission record

### 4. Success Page (`/success`)
- Confirmation message
- Next steps information
- Links to generate another report or view pricing

### 5. Admin Dashboard (`/admin`)
- Table showing all submissions
- Search functionality
- Status update buttons
- Statistics cards

### 6. Pricing Page (`/pricing`)
- Two pricing tiers: $29 single / $99 bundle
- Feature comparison
- Stripe checkout integration (placeholder)

### 7. Report Page (`/report/[id]`)
- Free summary section
- Locked full report section
- Purchase buttons for premium content

## API Routes

- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get all submissions (admin)
- `GET /api/submissions/[id]` - Get specific submission
- `PATCH /api/admin/submissions` - Update submission status
- `POST /api/stripe` - Create Stripe payment intent

## Report Types

1. **Validation Report** - Market validation and customer demand analysis
2. **Competitor Report** - Competitive landscape and differentiation opportunities
3. **MVP Roadmap** - Minimum viable product development plan
4. **Investor Report** - Investor-ready pitch and financial projections
5. **Go-to-Market Plan** - Customer acquisition and launch strategy

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- Supabase URL and keys
- Stripe publishable and secret keys
- App URL (production domain)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@growthpartnerai.com or create an issue in the repository.