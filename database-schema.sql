-- Growth Partner AI Database Schema
-- Run this SQL in your Supabase SQL editor

-- Create submissions table
create table submissions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  idea text not null,
  report_type text not null check (report_type in ('validation', 'competitor', 'mvp', 'investor', 'gtm')),
  payment_status text default 'free' check (payment_status in ('free', 'paid_single', 'paid_bundle')),
  status text default 'pending' check (status in ('pending', 'completed')),
  stripe_payment_intent_id text,
  access_token text unique,
  summary_key_insights text,
  summary_market_snapshot text,
  summary_next_step text,
  full_report_url text,
  admin_notes text,
  email_sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table submissions enable row level security;

-- Create policy for admin access
-- Note: In production, you should implement proper authentication
-- For now, this allows all operations (adjust based on your auth setup)
create policy "Admin can do everything" on submissions for all using (true);

-- Create indexes for better performance
create index idx_submissions_email on submissions(email);
create index idx_submissions_status on submissions(status);
create index idx_submissions_payment_status on submissions(payment_status);
create index idx_submissions_created_at on submissions(created_at);
create index idx_submissions_access_token on submissions(access_token);

-- Bundles table and relation
create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  payment_status text default 'pending' not null,
  stripe_payment_intent text,
  user_email text
);

create index if not exists idx_bundles_payment_status on bundles(payment_status);
create index if not exists idx_bundles_user_email on bundles(user_email);

alter table submissions 
  add column if not exists bundle_id uuid references bundles(id);

create index if not exists idx_submissions_bundle_id on submissions(bundle_id);

-- Add email_sent_at column to existing submissions table
alter table submissions add column if not exists email_sent_at timestamp with time zone;
create index if not exists idx_submissions_email_sent_at on submissions(email_sent_at);

-- Insert some sample data for testing (optional)
insert into submissions (email, idea, report_type, status, payment_status) values
('test@example.com', 'AI-powered fitness app that creates personalized workout plans', 'validation', 'completed', 'free'),
('demo@example.com', 'Sustainable packaging solution for e-commerce', 'competitor', 'pending', 'paid_single'),
('sample@example.com', 'Voice-controlled smart home automation system', 'mvp', 'completed', 'paid_bundle');
