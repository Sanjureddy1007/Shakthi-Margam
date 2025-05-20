import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/pochampally-patterns.css';

const AboutPage: React.FC = () => {
  // Partner data
  const partners = [
    {
      id: '1',
      name: 'WE-HUB',
      logo: 'building',
      link: 'https://wehub.telangana.gov.in/'
    },
    {
      id: '2',
      name: 'TSIIC',
      logo: 'office-building',
      link: 'https://www.tgiic.telangana.gov.in/'
    },
    {
      id: '3',
      name: 'TASK',
      logo: 'academic-cap',
      link: 'https://task.telangana.gov.in/'
    },
    {
      id: '4',
      name: 'ALEAP',
      logo: 'users',
      link: 'https://aleap.org/'
    }
  ];

  // Icon components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return (
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        );
      case 'office-building':
        return (
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        );
      case 'academic-cap':
        return (
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-primary-light py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Shakti Margam
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Learn about our mission to empower women entrepreneurs in Telangana
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* About Section with Image */}
          <div className="flex flex-col lg:flex-row items-center mb-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <img 
                src="/imgs\woman-enterpreneur.jpg" 
                alt="Woman entrepreneur in Telangana" 
                className="rounded-lg shadow-lg object-cover w-full h-auto"
                style={{ maxHeight: '500px' }}
              />
              <p className="text-sm text-gray-500 mt-2 italic text-center">Empowering women entrepreneurs across Telangana</p>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Shakti Margam was created with a single purpose: to empower women entrepreneurs in Telangana by providing accessible, culturally-relevant business guidance through artificial intelligence.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                We believe that when women entrepreneurs succeed, entire communities thrive. By combining technological innovation with deep cultural understanding, we're helping women overcome the unique challenges they face in building and growing businesses.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="text-accent1 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Empowerment</h3>
                    <p className="text-gray-700">
                      Providing women entrepreneurs with the tools, knowledge, and confidence to succeed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="text-accent1 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                    <p className="text-gray-700">
                      Leveraging cutting-edge AI technology to deliver personalized business insights
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="text-accent1 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cultural Relevance</h3>
                    <p className="text-gray-700">
                      Deeply rooted in Telangana's culture, language, and business landscape
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="text-accent1 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
                    <p className="text-gray-700">
                      Making expert business guidance available to all women entrepreneurs, regardless of their background or stage
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="text-accent1 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                    <p className="text-gray-700">
                      Fostering connections among women entrepreneurs and creating a supportive ecosystem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Our Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map(partner => (
                <a 
                  key={partner.id} 
                  href={partner.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center"
                >
                  {getIcon(partner.logo)}
                  <h3 className="text-xl font-semibold text-primary mt-4">{partner.name}</h3>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Link 
              to="/assistant" 
              className="inline-block px-8 py-4 bg-primary text-white font-medium rounded-lg shadow-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Get Started with Shakti Margam →
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
