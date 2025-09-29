# Vercel Deployment Checklist

## 1. Environment Variables Audit

### Required Environment Variables for Production

#### Stripe Configuration
- [ ] `STRIPE_SECRET_KEY` - Add to Vercel dashboard (secret)
- [ ] `STRIPE_WEBHOOK_SECRET` - Add to Vercel dashboard (secret) 
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Add to Vercel dashboard (public)
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_SINGLE` - Add to Vercel dashboard (public)
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_BUNDLE` - Add to Vercel dashboard (public)

#### Supabase Configuration
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Add to Vercel dashboard (public)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Add to Vercel dashboard (public)

#### Email Service
- [ ] `RESEND_API_KEY` - Add to Vercel dashboard (secret)

#### Application URL
- [ ] `NEXT_PUBLIC_APP_URL` - Set to your Vercel domain (e.g., https://your-app.vercel.app)

### Environment Variables in .env.local (DO NOT COMMIT)
- All the above variables should be in .env.local for local development
- .env.local is already in .gitignore

## 2. Post-Deployment Tasks

### Stripe Webhook Configuration
- [ ] After deploying, update Stripe webhook endpoint:
  - Old: `http://localhost:3000/api/stripe/webhook`
  - New: `https://your-app.vercel.app/api/stripe/webhook`
- [ ] Get new `STRIPE_WEBHOOK_SECRET` from Stripe Dashboard
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel dashboard

### Database Verification
- [ ] Ensure Supabase has all required tables:
  - [ ] `submissions` table with all columns
  - [ ] `bundles` table
  - [ ] All indexes created
- [ ] Run database schema verification

## 3. Security Checklist
- [ ] No API keys in committed code
- [ ] .env.local in .gitignore
- [ ] Admin routes need authentication (future enhancement)

## 4. Testing Checklist
- [ ] All pages load correctly
- [ ] API routes respond properly
- [ ] Stripe checkout works
- [ ] Email sending works
- [ ] Bundle workflow functions
- [ ] Admin interface accessible

## 5. Performance Checklist
- [ ] Build completes without errors
- [ ] No console.log statements in production
- [ ] Images optimized
- [ ] Bundle size reasonable
