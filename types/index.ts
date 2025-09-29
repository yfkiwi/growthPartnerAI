export interface Submission {
  id: string;
  email: string;
  idea: string;
  report_type: ReportType;
  payment_status: PaymentStatus;
  status: SubmissionStatus;
  stripe_payment_intent_id?: string;
  admin_notes?: string;
  access_token?: string;
  summary_key_insight?: string;
  summary_market_snapshot?: string;
  summary_next_step?: string;
  full_report_url?: string;
  bundle_id?: string;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export type ReportType = 'validation' | 'competitor' | 'mvp' | 'investor' | 'gtm';

export type PaymentStatus = 'free' | 'paid_single' | 'paid_bundle';

export type SubmissionStatus = 'pending' | 'completed';

export interface ReportTypeOption {
  id: ReportType;
  title: string;
  description: string;
  icon?: string;
}

export interface CreateSubmissionRequest {
  email: string;
  idea: string;
  reportType: ReportType;
}

export interface UpdateSubmissionRequest {
  id: string;
  status?: SubmissionStatus;
  payment_status?: PaymentStatus;
  admin_notes?: string;
  summary_key_insight?: string;
  summary_market_snapshot?: string;
  summary_next_step?: string;
  full_report_url?: string;
}

export interface Bundle {
  id: string;
  created_at: string;
  updated_at: string;
  payment_status: 'pending' | 'paid';
  stripe_payment_intent?: string | null;
  user_email?: string | null;
}

export interface StripePaymentRequest {
  submissionId: string;
  priceType: 'single' | 'bundle';
}

export interface StripePaymentResponse {
  clientSecret: string;
}
