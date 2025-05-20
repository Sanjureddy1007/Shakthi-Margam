import React from 'react';
import MainLayout from '../layouts/MainLayout';
import TelanganaMarketInsightsPanel from '../components/assistant/TelanganaMarketInsightsPanel';

const TelanganaMarketInsightsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Telangana Market Insights</h1>
            <p className="text-lg text-gray-600">
              Discover opportunities, funding resources, and success stories specific to women entrepreneurs in Telangana.
            </p>
          </header>

          <div className="mb-8 p-6 bg-accent4/10 rounded-lg border border-accent4/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Resource</h2>
            <p className="text-gray-700 mb-4">
              This specialized module provides Telangana-specific information to help women entrepreneurs succeed in the local market. 
              Use the tabs below to explore funding opportunities, industry insights, market trends, regulations, and success stories 
              from women entrepreneurs in Telangana.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">How to Use This Tool</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Select different tabs to explore various categories of information</li>
                  <li>Use filters to narrow down results relevant to your business</li>
                  <li>Click on external links to access official websites</li>
                  <li>Bookmark opportunities that interest you for future reference</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">Why Telangana-Specific?</h3>
                <p className="text-sm text-gray-700">
                  Telangana offers unique opportunities and resources for women entrepreneurs that aren't available elsewhere. 
                  This tool helps you navigate local programs, understand regional market trends, and connect with 
                  resources designed specifically for women business owners in Telangana.
                </p>
              </div>
            </div>
          </div>

          <TelanganaMarketInsightsPanel />
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Need More Assistance?</h2>
            <p className="text-gray-700 mb-4">
              If you need personalized guidance on finding the right funding opportunities or understanding market insights 
              for your specific business, our AI assistant can help you navigate these resources more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/assistant" 
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Chat with Shakti Margam Assistant
              </a>
              <a 
                href="/resources" 
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View All Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TelanganaMarketInsightsPage;