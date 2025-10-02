'use client';

import { useEffect, useState } from 'react';
import { Submission } from '@/types';

export default function AdminTestPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/submissions');
        const json = await res.json();
        if (res.ok) {
          setSubmissions(json.submissions || []);
        } else {
          setError(json.error || 'Failed to load submissions');
        }
      } catch {
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sendEmail = async (submissionId: string) => {
    setSendingId(submissionId);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Failed to send: ${j.error || res.statusText}`);
      } else {
        const j = await res.json();
        alert('Email sent. Link: ' + j.reportUrl);
        // Refresh the submissions list to get updated email_sent_at status
        const refreshed = await fetch('/api/submissions').then(r => r.json());
        setSubmissions(refreshed.submissions || []);
      }
    } finally {
      setSendingId(null);
    }
  };

  const handleUpdate = async (
    submissionId: string,
    form: { summary_key_insight: string; summary_market_snapshot: string; summary_next_step: string; full_report_url: string; status: string }
  ) => {
    setSavingId(submissionId);
    setMessage('');
    try {
      const res = await fetch('/api/admin/update-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          summary_key_insight: form.summary_key_insight,
          summary_market_snapshot: form.summary_market_snapshot,
          summary_next_step: form.summary_next_step,
          full_report_url: form.full_report_url || undefined,
          status: form.status,
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || 'Failed to update');
      } else {
        setMessage('Updated successfully');
        // refresh list
        const refreshed = await fetch('/api/submissions').then(r => r.json());
        setSubmissions(refreshed.submissions || []);
      }
    } catch {
      setMessage('Failed to update');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Test - Submissions</h1>
      {error && <div className="bg-red-800 text-red-100 p-4 rounded mb-4">{error}</div>}
      {message && <div className="bg-emerald-800 text-emerald-100 p-4 rounded mb-4">{message}</div>}
      <div className="space-y-4">
        {submissions.map((s) => (
          <div key={s.id} className="bg-gray-800 p-4 rounded">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.email}</div>
                <div className="text-gray-300 text-sm mb-2">{s.report_type} • {new Date(s.created_at).toLocaleString()}</div>
                <div className="text-gray-400 text-sm mb-2">
                  <strong>Idea:</strong> {s.idea}
                </div>
                {s.full_report_url && (
                  <a href={s.full_report_url} target="_blank" rel="noreferrer" className="text-blue-400 text-sm underline mt-1 inline-block">Open full report</a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => sendEmail(s.id)}
                  className={`transition-colors text-white px-4 py-2 rounded ${
                    s.email_sent_at 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={sendingId === s.id}
                >
                  {sendingId === s.id ? 'Sending...' : s.email_sent_at ? 'Email Sent ✓' : 'Send Email'}
                </button>
              </div>
            </div>

            {/* Update form */}
            <form
              className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const summary_key_insight = String(fd.get('summary_key_insight') || '');
                const summary_market_snapshot = String(fd.get('summary_market_snapshot') || '');
                const summary_next_step = String(fd.get('summary_next_step') || '');
                const full_report_url = String(fd.get('full_report_url') || '');
                const status = String(fd.get('status') || 'pending');
                handleUpdate(s.id, { summary_key_insight, summary_market_snapshot, summary_next_step, full_report_url, status });
              }}
            >
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm mb-2">Key Insight</label>
                  <textarea
                    name="summary_key_insight"
                    defaultValue={s.summary_key_insight || ''}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white min-h-[80px] resize-y"
                    placeholder="e.g., Strong market pull from SMBs"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Market Snapshot</label>
                  <textarea
                    name="summary_market_snapshot"
                    defaultValue={s.summary_market_snapshot || ''}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white min-h-[80px]"
                    placeholder="e.g., 3-5 direct competitors; TAM $Xbn; whitespace in onboarding UX"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Next Step</label>
                  <textarea
                    name="summary_next_step"
                    defaultValue={s.summary_next_step || ''}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white min-h-[80px] resize-y"
                    placeholder="e.g., Launch landing page test with 3 value props"
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2">Full Report URL</label>
                  <input
                    type="url"
                    name="full_report_url"
                    defaultValue={s.full_report_url || ''}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={s.status}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white"
                  >
                    <option value="pending">pending</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white px-4 py-2 rounded"
                    disabled={savingId === s.id}
                  >
                    {savingId === s.id ? 'Updating...' : 'Update Report'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}


