'use client';

import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  const handleStartOver = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-gray-800 p-8 rounded-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Insights Are Loading...
          </h1>
          
          <p className="text-lg text-gray-300 mb-6">
            We&apos;re analyzing your inputs and building a report designed for your startup. You&apos;ll get an email with your results in less than 24 hours. Stay tuned—it&apos;ll be worth the wait.
          </p>

          <div className="bg-blue-900/20 border border-blue-600 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-3">What happens next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <span className="text-blue-400 mr-3 mt-1">1.</span>
                <p className="text-gray-300">Our AI analyzes your startup idea using proven validation frameworks</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-3 mt-1">2.</span>
                <p className="text-gray-300">We generate a comprehensive report with actionable insights</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-400 mr-3 mt-1">3.</span>
                <p className="text-gray-300">You receive an email with your free summary and upgrade options</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleStartOver}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Another Report
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Questions? Contact us at <a href="mailto:support@growthpartnerai.com" className="text-blue-400 hover:text-blue-300">support@growthpartnerai.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
