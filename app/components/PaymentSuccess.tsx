'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get('session_id');
    if (!s) return;
    const verify = async () => {
      try {
        const res = await fetch(`/api/stripe/session/${s}`);
        const json = await res.json();
        if (res.ok && json && json.status === 'complete') {
          setMessage('Payment successful. Your access has been unlocked.');
        } else {
          setMessage('Payment processed. Finalizing... refresh if not unlocked.');
        }
      } catch {
        setMessage('Payment verified. If content is not unlocked, try refreshing.');
      }
    };
    verify();
  }, [searchParams]);

  if (!message) return null;

  return (
    <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-200 px-4 py-3 rounded mb-6">
      {message}
    </div>
  );
}


