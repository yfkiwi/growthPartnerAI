'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReportType, ReportTypeOption } from '@/types';

const reportTypes: ReportTypeOption[] = [
  {
    id: 'validation',
    title: 'Validation Report',
    description: 'Do real customers actually want this?',
    icon: '🎯'
  },
  {
    id: 'competitor', 
    title: 'Competitor Report',
    description: 'How do I stand out from competitors?',
    icon: '⚔️'
  },
  {
    id: 'mvp',
    title: 'MVP Roadmap', 
    description: "What's the right first version to build?",
    icon: '🚀'
  },
  {
    id: 'investor',
    title: 'Investor Report',
    description: 'How do I convince investors?',
    icon: '💰'
  },
  {
    id: 'gtm',
    title: 'Go-to-Market Plan',
    description: 'How do I get my first 100 customers?',
    icon: '📈'
  }
];

export default function FeatureSelection() {
  const [selectedType, setSelectedType] = useState<ReportType>('validation');
  const [idea, setIdea] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedIdea = localStorage.getItem('startup_idea');
    if (savedIdea) {
      setIdea(savedIdea);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleContinue = () => {
    localStorage.setItem('report_type', selectedType);
    router.push('/email-collection');
  };

  const handleBack = () => {
    router.push('/');
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
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              What&apos;s your biggest question right now?
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Select one option to help us understand your startup&apos;s current needs.
            </p>
            
            {/* Show the user's idea */}
            <div className="bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-sm text-gray-400 mb-2">Your startup idea:</p>
              <p className="text-gray-200 italic">&quot;{idea}&quot;</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {reportTypes.map((type) => (
              <label
                key={type.id}
                className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-blue-500 hover:bg-gray-800/50 ${
                  selectedType === type.id 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-600 bg-gray-800/30'
                }`}
              >
                <input
                  type="radio"
                  name="report_type"
                  value={type.id}
                  checked={selectedType === type.id}
                  onChange={(e) => setSelectedType(e.target.value as ReportType)}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className="text-3xl mr-4">{type.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-white">{type.title}</p>
                    <p className="text-gray-300">{type.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedType === type.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-400'
                  }`}>
                    {selectedType === type.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white font-bold py-4 px-12 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Continue to Email Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
