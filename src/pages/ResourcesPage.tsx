import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/pochampally-patterns.css';

// Resource type definition
interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  link: string;
}

const ResourcesPage: React.FC = () => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'WE-HUB',
      category: 'Government Initiatives',
      description: "India's first state-led incubator for women entrepreneurs. Initiated by the Government of Telangana.",
      icon: 'building',
      link: 'https://wehub.telangana.gov.in/'
    },
    {
      id: '2',
      title: 'Telangana State Women\'s Development Corporation',
      category: 'Government Initiatives',
      description: 'Provides financial assistance and training programs for women entrepreneurs.',
      icon: 'money',
      link: '#'
    },
    {
      id: '3',
      title: 'Startup Telangana',
      category: 'Startup Support',
      description: 'Supports innovative startups with mentorship, funding, and networking opportunities.',
      icon: 'lightbulb',
      link: '#'
    },
    {
      id: '4',
      title: 'Stree Nidhi Credit Cooperative Federation',
      category: 'Financial Resources',
      description: 'Provides timely and affordable credit to women self-help groups in Telangana.',
      icon: 'money',
      link: '#'
    },
    {
      id: '5',
      title: 'Telangana Academy for Skill and Knowledge (TASK)',
      category: 'Skill Development',
      description: 'Offers skill development programs to enhance employability and entrepreneurship.',
      icon: 'academic-cap',
      link: '#'
    },
    {
      id: '6',
      title: 'Telangana State Industrial Development Corporation',
      category: 'Infrastructure Support',
      description: 'Facilitates industrial development and provides infrastructure support for businesses.',
      icon: 'building',
      link: '#'
    },
    {
      id: '7',
      title: 'Association of Lady Entrepreneurs of India (ALEAP)',
      category: 'Women Entrepreneur Networks',
      description: 'Promotes women entrepreneurship through training, counseling, and mentorship.',
      icon: 'users',
      link: '#'
    },
    {
      id: '8',
      title: 'FICCI Ladies Organization (FLO) Hyderabad',
      category: 'Women Entrepreneur Networks',
      description: 'Platform for women entrepreneurs to network and access business opportunities.',
      icon: 'users',
      link: '#'
    }
  ];

  // Filter resources based on search query and selected category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for the filter dropdown
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  // Icon components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return (
          <svg className="h-8 w-8 text-accent2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        );
      case 'money':
        return (
          <svg className="h-8 w-8 text-accent1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      case 'lightbulb':
        return (
          <svg className="h-8 w-8 text-accent3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        );
      case 'academic-cap':
        return (
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="h-8 w-8 text-accent4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-accent2-light py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 bg-accent2 bg-opacity-10 text-accent2 rounded-full text-sm font-medium mb-4">
              Business Resources
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Telangana Resources for Women Entrepreneurs
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore government initiatives, funding opportunities, and business resources specifically for
              women entrepreneurs in Telangana.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="bg-accent2-light p-3 rounded-lg mr-4">
                    {getIcon(resource.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <div className="text-sm text-accent2 font-medium mb-2">{resource.category}</div>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-accent2 hover:text-accent2-dark font-medium"
                    >
                      Visit Resource
                      <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
