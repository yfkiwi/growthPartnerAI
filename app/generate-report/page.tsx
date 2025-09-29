'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const TYPE_TITLES: Record<string,string> = {
  validation: 'Validation Report',
  competitor: 'Competitor Report',
  mvp: 'MVP Roadmap',
  investor: 'Investor Report',
  gtm: 'Go-to-Market Plan',
};

function GenerateReportPageContent() {
  const search = useSearchParams();
  const router = useRouter();

  const bundleId = search.get('bundle_id') || '';
  const suggest = search.get('suggest') || '';
  const [idea, setIdea] = useState('');
  const [completedTypes, setCompletedTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preset = search.get('idea');
    if (preset) setIdea(preset);
  }, [search]);

  // Fetch bundle submissions to disable completed types
  useEffect(() => {
    if (!bundleId) return;
    (async () => {
      const res = await fetch(`/api/bundles/${bundleId}`);
      if (!res.ok) return;
      const json = await res.json();
      const set = new Set<string>((json.submissions || []).map((s: { report_type: string }) => s.report_type));
      setCompletedTypes(new Set(set));
      // default suggestion: first available
      if (!suggest) {
        const order = ['validation','competitor','mvp','investor','gtm'];
        const next = order.find(t => !set.has(t));
        if (next) {
          const url = new URL(window.location.href);
          url.searchParams.set('suggest', next);
          window.history.replaceState({}, '', url.toString());
        }
      }
    })();
  }, [bundleId, suggest]);

  const go = (type: string) => {
    if (!idea.trim()) {
      alert('Please enter your idea');
      return;
    }
    localStorage.setItem('startup_idea', idea);
    localStorage.setItem('report_type', type);
    const suffix = bundleId ? `?bundle_id=${bundleId}` : '';
    router.push(`/email-collection${suffix}`);
  };

  const disabled = (t: string) => completedTypes.has(t);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">Generate Report</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <label className="block text-sm mb-2">Your Idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-3 min-h-[120px]"
            placeholder="Describe your startup idea..."
          />

          <h2 className="text-2xl font-bold mt-8 mb-4">Select Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(TYPE_TITLES).map((t) => (
              <button
                key={t}
                onClick={() => !disabled(t) && go(t)}
                disabled={disabled(t)}
                className={`text-left p-4 rounded border ${disabled(t) ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'}`}
              >
                <div className="font-semibold">{TYPE_TITLES[t]}</div>
                <div className="text-sm text-gray-400 mt-1">{disabled(t) ? 'Completed' : 'Available'}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={() => router.back()} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">Back</button>
            {bundleId && (
              <a href={`/dashboard/${bundleId}`} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Back to Bundle</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateReportPageContent />
    </Suspense>
  );
}


