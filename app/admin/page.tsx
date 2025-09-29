'use client';

import { useState, useEffect } from 'react';
import { Submission, UpdateSubmissionRequest } from '@/types';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const updateData: UpdateSubmissionRequest = { id, status: newStatus as 'pending' | 'completed' };
      
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        fetchSubmissions(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update status');
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid_single':
      case 'paid_bundle':
        return 'bg-green-100 text-green-800';
      case 'free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage startup idea submissions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={fetchSubmissions}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-900">{submissions.length}</h3>
            <p className="text-gray-600">Total Submissions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => s.status === 'pending').length}
            </h3>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'completed').length}
            </h3>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-blue-600">
              {submissions.filter(s => s.payment_status !== 'free').length}
            </h3>
            <p className="text-gray-600">Paid Reports</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idea
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {submission.idea}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {submission.report_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(submission.payment_status)}`}>
                        {submission.payment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => updateStatus(submission.id, 
                          submission.status === 'pending' ? 'completed' : 'pending'
                        )}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          submission.status === 'pending'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        {submission.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchEmail ? 'No submissions found matching your search.' : 'No submissions yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
