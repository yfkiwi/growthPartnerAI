'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function HomePageContent() {
  const [idea, setIdea] = useState('');
  const router = useRouter();
  const [bundleId, setBundleId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('bundle_id');
    if (id) setBundleId(id);
  }, [searchParams]);

  const handleSubmit = () => {
    if (idea.trim()) {
      localStorage.setItem('startup_idea', idea);
      if (bundleId) {
        router.push(`/feature-selection?bundle_id=${bundleId}`);
      } else {
        router.push('/feature-selection');
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Validate, Compare, and Build your Startup Idea in Minutes 🚀
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Turn your startup idea into investor-ready insights in 24h.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full rounded-lg bg-white/20 px-4 py-4 pr-32 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-600"
                placeholder="Uber for dog walking — an app that connects pet owners with trusted walkers nearby."
              />
              {/* bundle id helper for deep links */}
              <input type="hidden" value={bundleId || ''} />
              <button
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Generate My Report
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">100% Private</h3>
              <p className="text-gray-400">Your ideas are never shared or stored publicly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Proven Methods</h3>
              <p className="text-gray-400">Used by 500+ successful startups</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Founder-Focused</h3>
              <p className="text-gray-400">Built by founders, for founders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get 5 Types of Investor-Ready Reports
            </h2>
            <p className="text-lg text-gray-300">
              Everything you need to validate and grow your startup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Validation Report</h3>
              <p className="text-gray-400">Do real customers actually want this?</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold mb-2">Competitor Report</h3>
              <p className="text-gray-400">How do I stand out from competitors?</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">MVP Roadmap</h3>
              <p className="text-gray-400">What&apos;s the right first version to build?</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Investor Report</h3>
              <p className="text-gray-400">How do I convince investors?</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Go-to-Market Plan</h3>
              <p className="text-gray-400">How do I get my first 100 customers?</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border-2 border-blue-600">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Founder Bundle</h3>
              <p className="text-gray-400">Get all 5 reports for maximum value</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Validate Your Startup Idea?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 500+ founders who&apos;ve already validated their ideas
          </p>
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) input.focus();
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Validation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Growth Partner AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}