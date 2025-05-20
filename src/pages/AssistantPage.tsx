import React, { useState } from 'react';
import EnhancedChatInterface from '../components/assistant/EnhancedChatInterface';
import ModuleSelector from '../components/assistant/ModuleSelector';
import TelanganaMarketInsightsPanel from '../components/assistant/TelanganaMarketInsightsPanel';
import FourCsStrategyBuilder from '../components/assistant/FourCsStrategyBuilder';
import SocialMediaMetricsDashboard from '../components/assistant/SocialMediaMetricsDashboard';
import AssessmentForm from '../components/assistant/AssessmentForm';
import { BusinessProfile } from '../models/BusinessProfile';
import MainLayout from '../layouts/MainLayout';
import { useAIAssistant } from '../context/AIAssistantProvider';

const AssistantPage: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState<boolean>(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { setActiveModule } = useAIAssistant();

  const handleAssessmentComplete = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setShowAssessment(false);
  };

  return (
    <MainLayout showFooter={true}>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ModuleSelector className="w-full" />

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Business Profile</h2>

              {businessProfile ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Your business profile helps us provide personalized guidance.
                  </p>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Business Name</p>
                      <p className="text-sm text-gray-900">{businessProfile.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Industry</p>
                      <p className="text-sm text-gray-900">{businessProfile.industry}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Stage</p>
                      <p className="text-sm text-gray-900">{businessProfile.stage}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAssessment(true)}
                    className="mt-4 w-full px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    Update Profile
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Complete a business assessment to get personalized guidance.
                  </p>

                  <button
                    onClick={() => setShowAssessment(true)}
                    className="w-full px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    Start Assessment
                  </button>
                </div>
              )}
            </div>

            {/* Tools & Resources Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium text-primary mb-4">Tools & Resources</h2>

              <div className="space-y-4">
                <div
                  className="p-3 rounded-lg bg-accent1-light border border-accent1 cursor-pointer hover:bg-accent1 transition-colors duration-300 feature-card group"
                  onClick={() => {
                    setActiveModule('telangana-market-insights');
                    setActiveTool('market-insights');
                  }}
                >
                  <div className="bg-accent1 bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:bg-opacity-20">
                    <svg className="h-5 w-5 text-accent1 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-accent1 mb-1 group-hover:text-white">Telangana Market Insights</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white">Access local market data and trends</p>
                </div>

                <div
                  className="p-3 rounded-lg bg-accent2-light border border-accent2 cursor-pointer hover:bg-accent2 transition-colors duration-300 feature-card group"
                  onClick={() => {
                    setActiveModule('social-media-strategy');
                    setActiveTool('social-strategy');
                  }}
                >
                  <div className="bg-accent2 bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:bg-opacity-20">
                    <svg className="h-5 w-5 text-accent2 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-accent2 mb-1 group-hover:text-white">4Cs Strategy Builder</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white">Create your marketing strategy</p>
                </div>

                <div
                  className="p-3 rounded-lg bg-accent3-light border border-accent3 cursor-pointer hover:bg-accent3 transition-colors duration-300 feature-card group"
                  onClick={() => {
                    setActiveModule('social-media-strategy');
                    setActiveTool('social-metrics');
                  }}
                >
                  <div className="bg-accent3 bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:bg-opacity-20">
                    <svg className="h-5 w-5 text-accent3 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-accent3 mb-1 group-hover:text-white">Social Media Metrics</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white">Track your social media performance</p>
                </div>

                <div
                  className="p-3 rounded-lg bg-accent4-light border border-accent4 cursor-pointer hover:bg-accent4 transition-colors duration-300 feature-card group"
                  onClick={() => {
                    setActiveModule('telangana-market-insights');
                    setActiveTool('government-schemes');
                  }}
                >
                  <div className="bg-accent4 bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:bg-opacity-20">
                    <svg className="h-5 w-5 text-accent4 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-accent4 mb-1 group-hover:text-white">Government Schemes</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white">Find schemes for women entrepreneurs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interface or Tool Interface */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex border-b">
                <div className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                  {activeTool ? 'Tools & Resources' : 'Chat Assistant'}
                </div>
              </div>

              {/* Content based on active tool */}
              {!activeTool ? (
                <div className="h-[600px]">
                  <EnhancedChatInterface className="h-full" />
                </div>
              ) : (
                <div className="p-4">
                  {activeTool === 'market-insights' && <TelanganaMarketInsightsPanel />}
                  {activeTool === 'social-strategy' && <FourCsStrategyBuilder />}
                  {activeTool === 'social-metrics' && <SocialMediaMetricsDashboard />}
                  {activeTool === 'government-schemes' && (
                    <div className="p-6 bg-accent4-light rounded-lg">
                      <h2 className="text-2xl font-bold text-accent4 mb-4">Government Schemes for Women Entrepreneurs</h2>
                      <p className="text-gray-700 mb-6">
                        Explore various government schemes and programs designed to support women entrepreneurs in Telangana.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-accent4 mb-2">WE-HUB Incubation Program</h3>
                          <p className="text-gray-600 mb-3">Provides mentorship, funding, and networking opportunities for women-led startups.</p>
                          <a href="#" className="text-accent4 font-medium hover:underline">Learn more →</a>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-accent4 mb-2">MUDRA Loan Scheme</h3>
                          <p className="text-gray-600 mb-3">Offers loans up to ₹10 lakhs for small businesses with special provisions for women.</p>
                          <a href="#" className="text-accent4 font-medium hover:underline">Learn more →</a>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-accent4 mb-2">Stand-Up India</h3>
                          <p className="text-gray-600 mb-3">Facilitates loans between ₹10 lakhs and ₹1 crore for women entrepreneurs.</p>
                          <a href="#" className="text-accent4 font-medium hover:underline">Learn more →</a>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-accent4 mb-2">TREAD Scheme</h3>
                          <p className="text-gray-600 mb-3">Provides training, assistance, and loans for women in rural areas.</p>
                          <a href="#" className="text-accent4 font-medium hover:underline">Learn more →</a>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTool(null)}
                        className="mt-6 px-5 py-2 bg-accent4 text-white font-medium rounded-lg hover:bg-accent4-dark transition-colors duration-300"
                      >
                        Return to Chat
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Assessment Modal */}
      {showAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Business Assessment</h2>
              <button
                onClick={() => setShowAssessment(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <AssessmentForm onComplete={handleAssessmentComplete} />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AssistantPage;
