'use client';

// import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Submission } from '@/types';
import PaymentSuccess from '@/app/components/PaymentSuccess';
import Image from 'next/image';

interface ReportClientProps {
  submission: Submission;
}

export default function ReportClient({ submission }: ReportClientProps) {
  const router = useRouter();

  const handlePurchase = async (priceType: 'single' | 'bundle') => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submission.id, price_type: priceType })
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const getReportTypeTitle = (type: string) => {
    const titles = {
      validation: 'Validation Report',
      competitor: 'Competitor Report',
      mvp: 'MVP Roadmap',
      investor: 'Investor Report',
      gtm: 'Go-to-Market Plan'
    };
    return titles[type as keyof typeof titles] || type;
  };

  const getFreeSummary = (type: string) => {
    const summaries = {
      validation: [
        'Your idea shows strong market potential based on current trends',
        'Target audience validation suggests high demand in this space',
        'Initial market research indicates competitive landscape opportunities'
      ],
      competitor: [
        '3-5 direct competitors identified in your market space',
        'Key differentiation opportunities found in underserved segments',
        'Competitive advantages can be built around user experience'
      ],
      mvp: [
        'Core features identified for minimum viable product launch',
        'Recommended development timeline of 3-6 months',
        'Essential user flows mapped for initial product version'
      ],
      investor: [
        'Market size analysis shows $X billion addressable market',
        'Revenue model validation with multiple monetization streams',
        'Key metrics and KPIs identified for investor presentations'
      ],
      gtm: [
        'Primary customer acquisition channels identified',
        'Launch strategy optimized for first 100 customers',
        'Marketing budget allocation recommendations provided'
      ]
    };
    return summaries[type as keyof typeof summaries] || [
      'Comprehensive analysis completed',
      'Key insights identified',
      'Actionable recommendations provided'
    ];
  };

  const getFullReportContent = (type: string) => {
    const content = {
      validation: [
        'Demand signals tied to your idea',
        'Industry-specific red flags',
        'Custom experiments to run now',
        'A week-by-week validation plan'
      ],
      competitor: [
        'Profiles of 5-10 closest competitors',
        'Feature & pricing comparisons',
        'Market gaps ready to exploit',
        'Differentiation strategy for your startup'
      ],
      mvp: [
        'Must-have vs. distractions',
        'MVP traps in your space',
        'Lean launch plan with stack options',
        'Timeline to validate cheaply'
      ],
      investor: [
        'TAM, CAC, LTV, churn tailored to your model',
        '10 must-answer investor questions',
        'Proof points mapped to your traction',
        'Pitch deck outline built for your concept'
      ],
      gtm: [
        'Personas tailored to your target users',
        'Acquisition channels ranked by ROI',
        'Campaign templates to adapt',
        'KPIs for 100 → 1,000 users'
      ]
    };
    return content[type as keyof typeof content] || [
      'Comprehensive analysis completed',
      'Key insights identified',
      'Actionable recommendations provided'
    ];
  };

  const isPaid = submission.payment_status !== 'free';
  const isPending = submission.status !== 'completed';
  const adminSummary = [
    submission.summary_key_insight,
    submission.summary_market_snapshot,
    submission.summary_next_step,
  ].filter(Boolean) as string[];
  const freeSummary = adminSummary.length > 0 ? adminSummary : getFreeSummary(submission.report_type);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold">Growth Partner AI</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Report Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              {getReportTypeTitle(submission.report_type)}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span>📧 {submission.email}</span>
              <span>📅 {new Date(submission.created_at).toLocaleDateString('en-CA')}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                submission.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {submission.status}
              </span>
            </div>
          </div>

          {/* Payment success banner */}
          <PaymentSuccess />

          {/* Free Summary or Pending Banner */}
          {isPending ? (
            <div className="bg-yellow-900/30 border border-yellow-700 p-8 rounded-lg mb-8 text-yellow-200">
              <h2 className="text-2xl font-bold mb-2">Report is being generated</h2>
              <p className="mb-2">Please check back in 24 hours. We will email you when it&apos;s ready.</p>
              {submission.bundle_id && (
                <p className="text-sm opacity-80">This submission is part of your Founder Bundle.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Free Summary</h2>
              <div className="space-y-4">
                {freeSummary.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">•</span>
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Report Section */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Full Report</h2>
            
            {isPending ? (
              <div className="text-center">
                <div className="bg-gray-700 p-8 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">⏳ Report In Progress</h3>
                  <p className="text-gray-300 mb-6">
                    Your full report is being prepared. We&apos;ll email you when it&apos;s ready.
                  </p>
                </div>
              </div>
            ) : isPaid ? (
              <div>
                <p className="text-gray-300 mb-6">
                  Thank you for your purchase! Here&apos;s your complete analysis:
                </p>
                <div className="space-y-6">
                  {submission.full_report_url && (
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">Full Report File</h3>
                      <a
                        href={submission.full_report_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        View Full Report
                      </a>
                    </div>
                  )}
                  {!submission.full_report_url && (
                    <>
                      <div className="bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
                        <p className="text-gray-300">
                          This comprehensive analysis provides detailed insights into your startup idea, 
                          including market validation, competitive landscape, and actionable recommendations 
                          for moving forward with your venture.
                        </p>
                      </div>
                      <div className="bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
                        <p className="text-gray-300">
                          [Full report content would be generated here based on the specific report type 
                          and startup idea. This would include detailed market research, competitor analysis, 
                          financial projections, and strategic recommendations.]
                        </p>
                      </div>
                      <div className="bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                        <p className="text-gray-300">
                          Based on our analysis, we recommend focusing on [specific recommendations 
                          based on the report type and findings].
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-700 p-8 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">🔒 Unlock My Full Report</h3>
                  <p className="text-gray-300 mb-6">
                    Unlock the complete analysis with detailed insights, market research, 
                    competitive analysis, and actionable recommendations.
                  </p>
                  
                  {/* Customized content based on report type */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-3">Your full report includes:</h4>
                    <div className="space-y-2">
                      {getFullReportContent(submission.report_type).map((item, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-blue-400 mr-3 mt-1">•</span>
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => handlePurchase('single')}
                      className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Unlock for $29
                    </button>
                    
                    <button
                      onClick={() => handlePurchase('bundle')}
                      className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Get All 5 Reports - $99
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>🚀 <strong>Best Deal:</strong> Get all 5 reports for just $99 (save $46!) — the smartest move for founders.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
