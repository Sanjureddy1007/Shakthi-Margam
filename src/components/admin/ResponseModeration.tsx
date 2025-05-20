import React, { useState } from 'react';

interface ResponseItem {
  id: string;
  query: string;
  response: string;
  module: string;
  timestamp: string;
  userId: string;
  userName: string;
  quality: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  flagReason?: string;
  improvementSuggestion?: string;
}

// Mock response data
const mockResponses: ResponseItem[] = [
  {
    id: '1',
    query: 'What government schemes are available for women entrepreneurs in Telangana?',
    response: 'There are several government schemes available for women entrepreneurs in Telangana. The most notable ones include WE-HUB, which is India\'s first state-led incubator for women entrepreneurs, TSWDC (Telangana State Women\'s Development Corporation) loans, and Stree Nidhi credit cooperative. These programs offer financial assistance, mentorship, and business development support specifically designed for women-led businesses.',
    module: 'government-schemes',
    timestamp: '2023-06-07T14:32:21',
    userId: '2',
    userName: 'Lakshmi Reddy',
    quality: 'good',
    status: 'approved'
  },
  {
    id: '2',
    query: 'How can I create a social media strategy for my handloom business?',
    response: 'For your handloom business, I recommend focusing on visual platforms like Instagram and Pinterest. Create a content calendar that showcases your products, behind-the-scenes of your crafting process, and the cultural significance of Telangana handlooms. Use local festivals and events as opportunities for themed content. Engage with your audience by responding to comments and creating polls about design preferences.',
    module: 'social-media-strategy',
    timestamp: '2023-06-07T10:15:33',
    userId: '3',
    userName: 'Ananya Patel',
    quality: 'excellent',
    status: 'approved'
  },
  {
    id: '3',
    query: 'What are the best locations to open a beauty salon in Hyderabad?',
    response: 'The best locations for a beauty salon in Hyderabad depend on your target market and budget. High-end areas like Banjara Hills, Jubilee Hills, and Gachibowli have affluent customers but higher rents. Mid-range areas like Ameerpet, Himayatnagar, and Kukatpally offer good foot traffic with moderate rents. Consider proximity to residential areas, office complexes, or shopping centers for steady customer flow.',
    module: 'telangana-market-insights',
    timestamp: '2023-06-06T16:45:12',
    userId: '4',
    userName: 'Divya Krishnan',
    quality: 'needs_improvement',
    status: 'flagged',
    flagReason: 'Incomplete information, missing data about permits required'
  },
  {
    id: '4',
    query: 'How do I calculate my business cash flow?',
    response: 'To calculate your business cash flow, subtract your total expenses from your total income for a specific period. Start by listing all income sources (sales, investments, etc.) and all expenses (rent, salaries, supplies, etc.). The difference gives you your net cash flow. Positive means you\'re generating more cash than spending, negative means you\'re spending more than earning. Track this monthly to identify patterns and potential issues.',
    module: 'financial-analysis',
    timestamp: '2023-06-05T11:22:45',
    userId: '5',
    userName: 'Meera Joshi',
    quality: 'good',
    status: 'pending'
  },
  {
    id: '5',
    query: 'What permits do I need to start a food business in Telangana?',
    response: 'To start a food business in Telangana, you need: 1) FSSAI license from the Food Safety and Standards Authority of India, 2) GST registration, 3) Shop and Establishment license from the local municipal corporation, 4) Health Trade License, and 5) Fire Safety Certificate if your establishment is over a certain size. For home-based businesses, you may qualify for a simpler FSSAI registration rather than a full license.',
    module: 'initial-assessment',
    timestamp: '2023-06-04T09:30:18',
    userId: '1',
    userName: 'Priya Sharma',
    quality: 'excellent',
    status: 'pending'
  }
];

const ResponseModeration: React.FC = () => {
  const [responses, setResponses] = useState<ResponseItem[]>(mockResponses);
  const [selectedResponse, setSelectedResponse] = useState<ResponseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Filter responses based on filters and search term
  const filteredResponses = responses.filter(item => {
    const matchesSearch =
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesQuality = qualityFilter === 'all' || item.quality === qualityFilter;

    return matchesSearch && matchesModule && matchesStatus && matchesQuality;
  });

  // Handle opening the review modal
  const handleReviewResponse = (response: ResponseItem) => {
    setSelectedResponse(response);
    setFeedbackText(response.improvementSuggestion || '');
    setIsModalOpen(true);
  };

  // Handle updating response status
  const handleUpdateStatus = (id: string, status: ResponseItem['status'], feedback?: string) => {
    setResponses(responses.map(item =>
      item.id === id ? {
        ...item,
        status,
        improvementSuggestion: feedback || item.improvementSuggestion
      } : item
    ));
    setIsModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get quality badge color
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-indigo-100 text-indigo-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'needs_improvement':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format module name for display
  const formatModuleName = (module: string) => {
    return module.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Response Moderation</h2>
        <div className="text-sm text-gray-500">
          {filteredResponses.length} responses found
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="module-filter" className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <select
              id="module-filter"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              <option value="initial-assessment">Initial Assessment</option>
              <option value="social-media-strategy">Social Media Strategy</option>
              <option value="financial-analysis">Financial Analysis</option>
              <option value="telangana-market-insights">Telangana Market Insights</option>
              <option value="government-schemes">Government Schemes</option>
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status-filter"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label htmlFor="quality-filter" className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
            <select
              id="quality-filter"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
            >
              <option value="all">All Qualities</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
            placeholder="Search in queries or responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Responses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Query & Response
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResponses.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">{item.query}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{item.response}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatModuleName(item.module)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getQualityColor(item.quality)}`}>
                    {item.quality.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleReviewResponse(item)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedResponse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Response</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">User Query:</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm">{selectedResponse.query}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">AI Response:</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">{selectedResponse.response}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Module:</h4>
                  <div className="text-sm">{formatModuleName(selectedResponse.module)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">User:</h4>
                  <div className="text-sm">{selectedResponse.userName}</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback or Improvement Suggestion:</h4>
                <textarea
                  rows={3}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter feedback or suggestions for improvement..."
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Quality Assessment:</h4>
                <div className="flex space-x-2">
                  {['excellent', 'good', 'needs_improvement', 'poor'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setResponses(responses.map(item =>
                        item.id === selectedResponse.id ? { ...item, quality: quality as ResponseItem['quality'] } : item
                      ))}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedResponse.quality === quality
                          ? getQualityColor(quality) + ' ring-2 ring-offset-1 ring-gray-400'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {quality.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedResponse.id, 'rejected', feedbackText)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedResponse.id, 'flagged', feedbackText)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
              >
                Flag
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedResponse.id, 'approved', feedbackText)}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseModeration;
