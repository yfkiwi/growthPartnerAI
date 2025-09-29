import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ bundleId: string }>;
}

export default async function BundleDashboardPage({ params }: PageProps) {
  const { bundleId } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bundles/${bundleId}`, { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }
  const { bundle, submissions, used, limit } = await res.json();

  const typeOrder = ['validation','competitor','mvp','investor','gtm'] as const;
  const typeTitle: Record<string,string> = {
    validation: 'Validation Report',
    competitor: 'Competitor Report',
    mvp: 'MVP Roadmap',
    investor: 'Investor Report',
    gtm: 'Go-to-Market Plan',
  };
  const firstIdea = submissions?.[submissions.length - 1]?.idea || submissions?.[0]?.idea || '';
  const completedTypes = new Set((submissions || []).map((s: { report_type: string }) => s.report_type));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">Founder Bundle Dashboard</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="bg-gray-800 p-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Bundle Status: <span className="capitalize">{bundle.payment_status}</span></div>
              <div className="text-gray-300">Reports used: {used}/{limit}</div>
              {bundle.user_email && <div className="text-gray-400 text-sm">Email: {bundle.user_email}</div>}
            </div>
            {used >= limit ? (
              <span className="px-4 py-2 rounded bg-gray-600 cursor-not-allowed opacity-70">
                Generate Another Report
              </span>
            ) : (
              <a
                href={`/?bundle_id=${bundleId}`}
                className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700`}
              >
                Generate Another Report
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-3">📊 Deep Dive Analysis</h2>
            {firstIdea ? (
              <p className="text-gray-300 mb-4">Original Idea: <span className="italic">&ldquo;{firstIdea}&rdquo;</span></p>
            ) : (
              <p className="text-gray-400 mb-4">No idea yet. Start your first analysis.</p>
            )}
            <div className="space-y-2">
              {typeOrder.map((t) => {
                const done = completedTypes.has(t as string);
                const submission = (submissions || []).find((s: { report_type: string }) => s.report_type === t);
                return (
                  <div key={t} className={`flex items-center justify-between px-3 py-2 rounded ${done ? 'bg-green-900/30' : 'bg-gray-700'}`}>
                    <div>
                      <span className="mr-2">{done ? '✅' : '⭕'}</span>
                      <span>{typeTitle[t as string]}</span>
                    </div>
                    {done ? (
                      submission.status === 'completed' ? (
                        <a href={`/report/${submission.id}`} className="text-blue-400 hover:text-blue-300 underline">View</a>
                      ) : (
                        <span className="text-yellow-400">In Progress</span>
                      )
                    ) : (
                      <a href={`/generate-report?bundle_id=${bundleId}&idea=${encodeURIComponent(firstIdea)}&suggest=${t}`} className="text-gray-200 underline">Generate</a>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <a
                href={`/generate-report?bundle_id=${bundleId}&idea=${encodeURIComponent(firstIdea)}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Continue This Analysis
              </a>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-3">🔄 Explore Mode</h2>
            <p className="text-gray-300 mb-4">Want to analyze a different idea?</p>
            <a
              href={`/generate-report?bundle_id=${bundleId}`}
              className="inline-block bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Start New Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


