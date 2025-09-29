'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateSubmissionRequest, ReportType } from '@/types';

function EmailCollectionContent() {
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [reportType, setReportType] = useState<ReportType>('validation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const savedIdea = localStorage.getItem('startup_idea');
    const savedReportType = localStorage.getItem('report_type') as ReportType;
    const urlIdea = search.get('idea');
    
    if (urlIdea) {
      setIdea(urlIdea);
    } else if (savedIdea) {
      setIdea(savedIdea);
    } else {
      router.push('/');
    }
    
    if (savedReportType) {
      setReportType(savedReportType);
    }
  }, [router, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submissionData: CreateSubmissionRequest & { bundle_id?: string } = {
        email,
        idea,
        reportType
      };

      const bundleId = search.get('bundle_id');
      if (bundleId) {
        (submissionData as { bundle_id?: string }).bundle_id = bundleId;
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your request');
      }

      await response.json();
      
      // Clear localStorage
      localStorage.removeItem('startup_idea');
      localStorage.removeItem('report_type');
      
      // Redirect
      if (bundleId) {
        router.push(`/processing?bundle_id=${bundleId}`);
      } else {
        router.push('/success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/feature-selection');
  };

  const getReportTypeTitle = (type: ReportType) => {
    const titles = {
      validation: 'Validation Report',
      competitor: 'Competitor Report',
      mvp: 'MVP Roadmap',
      investor: 'Investor Report',
      gtm: 'Go-to-Market Plan'
    };
    return titles[type];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Growth Partner AI</h1>
            <button
              onClick={handleBack}
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Almost there! Just need your email
            </h2>
            <p className="text-lg text-gray-300">
              We&apos;ll send your personalized report within 24 hours
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-bold mb-3">Your Request Summary</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Idea:</span>
                <p className="text-gray-200 italic">&quot;{idea}&quot;</p>
              </div>
              <div>
                <span className="text-gray-400">Report Type:</span>
                <p className="text-gray-200">{getReportTypeTitle(reportType)}</p>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Generate My Report'}
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>100% Private</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⚡</span>
                <span>24h Delivery</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Free Summary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailCollection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailCollectionContent />
    </Suspense>
  );
}
