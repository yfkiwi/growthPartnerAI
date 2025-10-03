'use client';

// import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Submission } from '@/types';
import PaymentSuccess from '@/app/components/PaymentSuccess';
import Image from 'next/image';

interface ReportByTokenClientProps {
  submission: Submission;
}

export default function ReportByTokenClient({ submission }: ReportByTokenClientProps) {
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
    } as const;
    return (titles as Record<string, string>)[type] || type;
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
    } as const;
    return (summaries as Record<string, readonly string[]>)[type] || [
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
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold">Growth Partner AI</span>
            </div>
            <button onClick={() => router.push('/')} className="text-blue-400 hover:text-blue-300">← Back to Home</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
          {/* Payment success banner */}
          <PaymentSuccess />

          {/* Free Summary Section */}
          <section className="mb-12">
            {isPending ? (
              <div className="bg-yellow-900/30 border border-yellow-700 p-6 md:p-8 rounded-lg text-yellow-200">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Report is being generated</h2>
                <p className="mb-2 text-base md:text-lg">Please check back in 24 hours. We will email you when it&apos;s ready.</p>
                {submission.bundle_id && (
                  <p className="text-sm opacity-80">This submission is part of your Founder Bundle.</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 p-6 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Free Summary</h2>
                
                {/* 如果有summary数据 */}
                {submission?.summary_key_insight && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-400">🔍 Key Insight</h3>
                      <p className="text-gray-300 whitespace-pre-wrap">{submission.summary_key_insight}</p>
                    </div>
                    
                    {/* Market Snapshot 和 Next Step 已隐藏 */}
                    {/* 
                    {submission?.summary_market_snapshot && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-400">📊 Market Snapshot</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{submission.summary_market_snapshot}</p>
                      </div>
                    )}
                    
                    {submission?.summary_next_step && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-400">🚀 Next Step</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{submission.summary_next_step}</p>
                      </div>
                    )}
                    */}
                  </div>
                )}
                
                {/* 如果没有summary数据 */}
                {!submission?.summary_key_insight && (
                  <div className="space-y-4">
                    {freeSummary.map((point: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-400 mr-3 mt-1">•</span>
                        <p className="text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Full Report Locked Section */}
          <section>
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg border-2 border-gray-700">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                🔒 Unlock My Full Report
              </h2>
              
              {isPending ? (
                <div className="text-center">
                  <div className="bg-gray-700 p-6 md:p-8 rounded-lg mb-8">
                    <h3 className="text-xl font-bold mb-4">⏳ Report In Progress</h3>
                    <p className="text-gray-300 mb-6">Your full report is being prepared. We&apos;ll email you when it&apos;s ready.</p>
                  </div>
                </div>
              ) : isPaid ? (
                <div>
                  <p className="text-gray-300 mb-6">Thank you for your purchase! Here&apos;s your complete analysis:</p>
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
                          <p className="text-gray-300">This comprehensive analysis provides detailed insights into your startup idea, including market validation, competitive landscape, and actionable recommendations for moving forward with your venture.</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-lg">
                          <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
                          <p className="text-gray-300">[Full report content would be generated here based on the specific report type and startup idea.]</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-lg">
                          <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                          <p className="text-gray-300">Based on our analysis, we recommend focusing on [specific recommendations based on the report type and findings].</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {/* 根据report_type动态显示不同的bullet points */}
                  {(() => {
                    const reportType = submission?.report_type || 'validation';
                    
                    const reportContent = {
                      validation: [
                        'Demand signals tied to your idea',
                        'Industry-specific red flags',
                        'Custom experiments to run now',
                        'A week-by-week validation plan'
                      ],
                      competitor: [
                        'Profiles of 5–10 closest competitors',
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

                    return (
                      <div className="my-6">
                        <div className="space-y-3 text-left max-w-md mx-auto">
                          {reportContent[reportType].map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">•</span>
                              <p className="text-gray-300">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 按钮区域 - 移动端垂直堆叠，桌面端水平排列 */}
                  <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                    <button 
                      onClick={() => handlePurchase('single')} 
                      className="w-full md:w-auto bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Unlock for $29
                    </button>
                    <button 
                      onClick={() => handlePurchase('bundle')} 
                      className="w-full md:w-auto bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Get All 5 Reports - $99
                    </button>
                  </div>

                  {/* Bundle推荐文案 */}
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                    <p className="text-sm text-gray-300">
                      💡 <span className="font-semibold">Best Deal 🚀</span> Get all 5 reports for just $99 (save $46!) — the smartest move for founders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
      </div>
    </main>
  );
}
