'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handlePurchase = async (priceType: 'single' | 'bundle') => {
    setLoading(priceType);
    
    try {
      // For now, we'll just redirect to a success page
      // In a real implementation, this would integrate with Stripe
      setTimeout(() => {
        setLoading(null);
        router.push('/success');
      }, 2000);
    } catch (error) {
      console.error('Purchase failed:', error);
      setLoading(null);
    }
  };

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

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Choose Your Report Package
            </h1>
            <p className="text-xl text-gray-300">
              Get investor-ready insights for your startup idea
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Single Report */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Single Report</h2>
                <div className="text-4xl font-extrabold mb-2">
                  $29
                  <span className="text-lg font-normal text-gray-400">/report</span>
                </div>
                <p className="text-gray-400">Perfect for focused validation</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Comprehensive analysis of your startup idea</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Market validation insights</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Competitor analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Actionable recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>24-hour delivery</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('single')}
                disabled={loading === 'single'}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'single' ? 'Processing...' : 'Purchase Single Report'}
              </button>
            </div>

            {/* Bundle Package */}
            <div className="bg-gray-800 p-8 rounded-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Founder Bundle</h2>
                <div className="text-4xl font-extrabold mb-2">
                  $99
                  <span className="text-lg font-normal text-gray-400">/bundle</span>
                </div>
                <p className="text-gray-400">Complete startup validation suite</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>All 5 report types included</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Validation Report</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Competitor Analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>MVP Roadmap</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Investor Pitch Deck</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Go-to-Market Strategy</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>24-hour delivery</span>
                </li>
              </ul>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">
                  <span className="line-through">$145</span> - Save $46!
                </p>
              </div>

              <button
                onClick={() => handlePurchase('bundle')}
                disabled={loading === 'bundle'}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'bundle' ? 'Processing...' : 'Purchase Bundle'}
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">How long does it take to receive my report?</h3>
                <p className="text-gray-300">
                  All reports are delivered within 24 hours via email. You&apos;ll receive a notification when your report is ready.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">What if I&apos;m not satisfied with my report?</h3>
                <p className="text-gray-300">
                  We offer a 30-day money-back guarantee. If you&apos;re not completely satisfied, we&apos;ll refund your purchase.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Can I upgrade from a single report to the bundle later?</h3>
                <p className="text-gray-300">
                  Yes! Contact us at support@growthpartnerai.com and we&apos;ll help you upgrade with a prorated discount.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Is my startup idea kept confidential?</h3>
                <p className="text-gray-300">
                  Absolutely. Your ideas are never shared publicly and are protected by our privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
