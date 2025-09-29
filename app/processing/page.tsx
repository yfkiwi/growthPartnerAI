'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ProcessingPageContent() {
  const search = useSearchParams();
  const router = useRouter();
  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    const bundleId = search.get('bundle_id');
    if (!bundleId) return;
    (async () => {
      const res = await fetch(`/api/bundles/${bundleId}`);
      if (res.ok) {
        const json = await res.json();
        setUsed(json.used);
        setLimit(json.limit);
      }
    })();
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-4">Report Being Generated 🚀</h1>
        <p className="text-gray-300 mb-6">
          Your report is being prepared. You&apos;ll receive an email within 24 hours with a link to your report.
        </p>
        {used !== null && (
          <p className="text-gray-400 mb-6">Bundle Status: {used}/{limit} reports used</p>
        )}
        <div className="flex gap-3">
          {search.get('bundle_id') && (
            <a href={`/dashboard/${search.get('bundle_id')}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">View Bundle Dashboard</a>
          )}
          {search.get('bundle_id') && (
            <a href={`/generate-report?bundle_id=${search.get('bundle_id')}`} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Generate Another Report</a>
          )}
          {!search.get('bundle_id') && (
            <button onClick={() => router.push('/')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Back to Home</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProcessingPageContent />
    </Suspense>
  );
}


