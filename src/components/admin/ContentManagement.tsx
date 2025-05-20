import React, { useState } from 'react';

// Mock content data
const mockContent = [
  {
    id: '1',
    title: 'Telangana Handicrafts Market Overview',
    category: 'market-insights',
    tags: ['handicrafts', 'market-data', 'telangana'],
    status: 'published',
    lastUpdated: '2023-05-15T10:30:00',
    author: 'Priya Sharma',
    excerpt: 'Comprehensive overview of the handicrafts market in Telangana, including key trends, consumer preferences, and growth opportunities.'
  },
  {
    id: '2',
    title: 'Social Media Strategy for Food Businesses',
    category: 'social-media',
    tags: ['food-business', '4cs-framework', 'instagram'],
    status: 'published',
    lastUpdated: '2023-06-01T14:45:00',
    author: 'Divya Krishnan',
    excerpt: 'Specialized social media strategy guide for food businesses in Telangana, with platform-specific recommendations and content ideas.'
  },
  {
    id: '3',
    title: 'Government Schemes for Women Entrepreneurs',
    category: 'government-schemes',
    tags: ['funding', 'women-entrepreneurs', 'telangana'],
    status: 'published',
    lastUpdated: '2023-04-22T09:15:00',
    author: 'Lakshmi Reddy',
    excerpt: 'Detailed guide to government schemes and programs available for women entrepreneurs in Telangana, including eligibility criteria and application processes.'
  },
  {
    id: '4',
    title: 'Financial Planning for Small Businesses',
    category: 'financial-analysis',
    tags: ['cash-flow', 'small-business', 'financial-planning'],
    status: 'draft',
    lastUpdated: '2023-06-05T16:20:00',
    author: 'Ananya Patel',
    excerpt: 'Comprehensive financial planning guide for small businesses, covering cash flow management, expense optimization, and growth strategies.'
  },
  {
    id: '5',
    title: 'Customer Segmentation for Retail Businesses',
    category: 'customer-profiling',
    tags: ['retail', 'customer-segments', 'marketing'],
    status: 'review',
    lastUpdated: '2023-06-03T11:10:00',
    author: 'Meera Joshi',
    excerpt: 'Guide to effective customer segmentation for retail businesses in Telangana, with actionable strategies for targeting different customer groups.'
  }
];

interface ContentItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  status: string;
  lastUpdated: string;
  author: string;
  excerpt: string;
}

const ContentManagement: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<ContentItem>>({});

  // Filter content based on search term and filters
  const filteredContent = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle opening the edit modal
  const handleEditContent = (contentItem: ContentItem) => {
    setSelectedContent(contentItem);
    setEditForm(contentItem);
    setIsEditModalOpen(true);
  };

  // Handle opening the add modal
  const handleAddContent = () => {
    setEditForm({
      title: '',
      category: 'market-insights',
      tags: [],
      status: 'draft',
      excerpt: '',
      author: 'Admin User', // Default author
      lastUpdated: new Date().toISOString()
    });
    setIsAddModalOpen(true);
  };

  // Handle saving content edits
  const handleSaveContent = () => {
    if (selectedContent && editForm) {
      setContent(content.map(item =>
        item.id === selectedContent.id ? { ...item, ...editForm } : item
      ));
      setIsEditModalOpen(false);
      setSelectedContent(null);
    }
  };

  // Handle saving new content
  const handleSaveNewContent = () => {
    if (editForm && editForm.title && editForm.category) {
      const newContent = {
        ...editForm,
        id: Date.now().toString(), // Generate a unique ID
        lastUpdated: new Date().toISOString(),
        tags: editForm.tags || []
      } as ContentItem;

      setContent([...content, newContent]);
      setIsAddModalOpen(false);
    }
  };

  // Handle deleting content
  const handleDeleteContent = (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setContent(content.filter(item => item.id !== contentId));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
        <button
          onClick={handleAddContent}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
        >
          Add New Content
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category-filter"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="market-insights">Market Insights</option>
              <option value="social-media">Social Media</option>
              <option value="government-schemes">Government Schemes</option>
              <option value="financial-analysis">Financial Analysis</option>
              <option value="customer-profiling">Customer Profiling</option>
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
            placeholder="Search by title, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContent.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.category.replace(/-/g, ' ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.lastUpdated)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditContent(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteContent(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Content Modal */}
      {isEditModalOpen && selectedContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Content</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="market-insights">Market Insights</option>
                  <option value="social-media">Social Media</option>
                  <option value="government-schemes">Government Schemes</option>
                  <option value="financial-analysis">Financial Analysis</option>
                  <option value="customer-profiling">Customer Profiling</option>
                </select>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.tags?.join(', ') || ''}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  })}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                </select>
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  id="excerpt"
                  rows={3}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.excerpt || ''}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Content</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  id="new-title"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="new-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="new-category"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.category || 'market-insights'}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="market-insights">Market Insights</option>
                  <option value="social-media">Social Media</option>
                  <option value="government-schemes">Government Schemes</option>
                  <option value="financial-analysis">Financial Analysis</option>
                  <option value="customer-profiling">Customer Profiling</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  id="new-tags"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.tags?.join(', ') || ''}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                />
              </div>
              <div>
                <label htmlFor="new-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="new-status"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.status || 'draft'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  id="new-excerpt"
                  rows={3}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={editForm.excerpt || ''}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewContent}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
