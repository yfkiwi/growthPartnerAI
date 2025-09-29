# Deployment Guide - Growth Partner AI

## Quick Deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account
- Supabase account
- Stripe account

### 2. Setup Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database-schema.sql` into the SQL editor
4. Run the SQL to create the table and policies
5. Go to Settings > API to get your project URL and anon key

### 3. Setup Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable key from Developers > API keys
3. Get your secret key from Developers > API keys
4. For webhooks, go to Developers > Webhooks and create a new endpoint

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

6. Click Deploy

### 5. Post-Deployment Setup

1. Update your Stripe webhook URL to point to your Vercel domain
2. Test the application by:
   - Submitting a startup idea
   - Checking the admin dashboard
   - Testing the payment flow

## Environment Variables Reference

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key (keep this secure!)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook endpoint secret

### App
- `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., https://your-app.vercel.app)

## Security Considerations

1. **Row Level Security**: Make sure RLS is properly configured in Supabase
2. **API Keys**: Never expose secret keys in client-side code
3. **Environment Variables**: Use Vercel's environment variable system
4. **CORS**: Configure CORS settings in Supabase if needed

## Monitoring

1. **Vercel Analytics**: Enable Vercel Analytics for performance monitoring
2. **Supabase Dashboard**: Monitor database usage and performance
3. **Stripe Dashboard**: Monitor payments and webhook events

## Troubleshooting

### Common Issues

1. **Database Connection**: Check Supabase URL and keys
2. **Payment Issues**: Verify Stripe keys and webhook configuration
3. **Build Errors**: Check for TypeScript errors and missing dependencies

### Support

- Check the main README.md for detailed setup instructions
- Review the API routes in `/app/api/` for endpoint documentation
- Check Supabase logs for database-related issues
- Check Stripe logs for payment-related issues
