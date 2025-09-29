import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ReportByTokenClient from './ReportByTokenClient';

interface ReportByTokenPageProps {
  params: Promise<{ token: string }>;
}

export default async function ReportByTokenPage({ params }: ReportByTokenPageProps) {
  const { token } = await params;
  
  const supabase = createClient();
  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('access_token', token)
    .single();

  if (error || !submission) {
    notFound();
  }

  return <ReportByTokenClient submission={submission} />;
}
