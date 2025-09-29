import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ReportClient from './ReportClient';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  
  const supabase = createClient();
  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !submission) {
    notFound();
  }

  return <ReportClient submission={submission} />;
}
