import React, { useState } from 'react';
import { 
  telanganaIndustryInsights, 
  telanganaMarketTrends, 
  telanganaRegulations,
  telanganaSuccessStories 
} from '../../data/telangana-market-insights';
import { telanganaFundingOpportunities } from '../../data/telangana-funding';
import { 
  queryFundingOpportunities, 
  getIndustryInsights, 
  getRelevantMarketTrends, 
  getRelevantRegulations, 
  getSuccessStories 
} from '../../data/telangana-resources-integration';

// Types for component props and state
interface TelanganaMarketInsightsPanelProps {
  initialTab?: string;
}

const TelanganaMarketInsightsPanel: React.FC<TelanganaMarketInsightsPanelProps> = ({ initialTab = 'funding' }) => {
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState(initialTab);
  const [industryFilter, setIndustryFilter] = useState('');
  const [businessStageFilter, setBusinessStageFilter] = useState('');
  const [fundingTypeFilter, setFundingTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Get filtered data based on current filters
  const filteredFunding = queryFundingOpportunities({
    businessStage: businessStageFilter,
    fundingType: fundingTypeFilter as any,
    industry: industryFilter
  });

  const filteredIndustries = getIndustryInsights(industryFilter);
  const filteredTrends = getRelevantMarketTrends(industryFilter);
  const filteredRegulations = getRelevantRegulations(industryFilter);
  const filteredSuccessStories = getSuccessStories({ 
    industry: industryFilter,
    location: locationFilter
  });

  // Industry options for filter dropdown
  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'textiles', label: 'Textiles and Handlooms' },
    { value: 'food-processing', label: 'Food Processing' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'it-services', label: 'IT Services' },
    { value: 'beauty-wellness', label: 'Beauty and Wellness' }
  ];

  // Business stage options
  const businessStageOptions = [
    { value: '', label: 'All Stages' },
    { value: 'early', label: 'Early Stage/Startup' },
    { value: 'growth', label: 'Growth/Scaling' }
  ];

  // Funding type options
  const fundingTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Grant', label: 'Grants' },
    { value: 'Loan', label: 'Loans' },
    { value: 'Equity', label: 'Equity/Investment' },
    { value: 'Subsidy', label: 'Subsidies' },
    { value: 'Mixed', label: 'Mixed Funding' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'funding' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('funding')}
        >
          Funding Opportunities
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'industries' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('industries')}
        >
          Industry Insights
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'trends' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('trends')}
        >
          Market Trends
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'regulations' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('regulations')}
        >
          Regulations
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'success' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('success')}
        >
          Success Stories
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-t-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            {industryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        {activeTab === 'funding' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Stage</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={businessStageFilter}
              onChange={(e) => setBusinessStageFilter(e.target.value)}
            >
              {businessStageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
        
        {activeTab === 'funding' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Type</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={fundingTypeFilter}
              onChange={(e) => setFundingTypeFilter(e.target.value)}
            >
              {fundingTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
        
        {activeTab === 'success' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Enter location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Content based on active tab */}
      <div className="p-4">
        {/* Funding Opportunities Tab */}
        {activeTab === 'funding' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Funding Opportunities for Women Entrepreneurs in Telangana</h3>
            
            {filteredFunding.length === 0 ? (
              <p className="text-gray-500">No funding opportunities match your filters. Try adjusting your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredFunding.map(funding => (
                  <div key={funding.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">{funding.title}</h4>
                        <p className="text-sm text-gray-500">{funding.provider}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        funding.fundingType === 'Grant' ? 'bg-green-100 text-green-800' :
                        funding.fundingType === 'Loan' ? 'bg-blue-100 text-blue-800' :
                        funding.fundingType === 'Equity' ? 'bg-purple-100 text-purple-800' :
                        funding.fundingType === 'Subsidy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {funding.fundingType}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">{funding.description}</p>
                    
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Amount: </span>
                      <span className="text-sm text-gray-600">{funding.amount}</span>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Eligibility:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {funding.eligibility.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Application Process: </span>
                      <span className="text-sm text-gray-600">{funding.applicationProcess}</span>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Contact: </span>
                        <span className="text-sm text-gray-600">{funding.contactInfo}</span>
                      </div>
                      
                      <a 
                        href={funding.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary-dark font-medium"
                      >
                        Visit Website →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Industry Insights Tab */}
        {activeTab === 'industries' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Industry Insights for Telangana</h3>
            
            {filteredIndustries.length === 0 ? (
              <p className="text-gray-500">No industry insights match your filters. Try adjusting your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredIndustries.map(industry => (
                  <div key={industry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <h4 className="text-md font-semibold text-gray-900">{industry.industry}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        industry.growthPotential === 'High' ? 'bg-green-100 text-green-800' :
                        industry.growthPotential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {industry.growthPotential} Growth Potential
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">{industry.summary}</p>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Key Opportunities:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {industry.keyOpportunities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Challenges:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {industry.challenges.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Success Strategies:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {industry.successStrategies.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Market Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Market Trends in Telangana</h3>
            
            {filteredTrends.length === 0 ? (
              <p className="text-gray-500">No market trends match your filters. Try adjusting your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredTrends.map(trend => (
                  <div key={trend.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <h4 className="text-md font-semibold text-gray-900">{trend.trend}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trend.impactLevel === 'High' ? 'bg-green-100 text-green-800' :
                        trend.impactLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {trend.impactLevel} Impact
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">{trend.description}</p>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Relevant Industries:</h5>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {trend.relevantIndustries.map((industry, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Application Tips:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {trend.applicationTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regulations Tab */}
        {activeTab === 'regulations' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Business Regulations in Telangana</h3>
            
            {filteredRegulations.length === 0 ? (
              <p className="text-gray-500">No regulations match your filters. Try adjusting your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredRegulations.map(regulation => (
                  <div key={regulation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">{regulation.title}</h4>
                        <p className="text-sm text-accent1">{regulation.category}</p>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">{regulation.description}</p>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Compliance Requirements:</h5>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {regulation.complianceRequirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700">Relevant For:</h5>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {regulation.relevantBusinessTypes.map((type, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Contact: </span>
                        <span className="text-sm text-gray-600">{regulation.contactDepartment}</span>
                      </div>
                      
                      <a 
                        href={regulation.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary-dark font-medium"
                      >
                        Official Website →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'success' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Success Stories of Women Entrepreneurs in Telangana</h3>
            
            {filteredSuccessStories.length === 0 ? (
              <p className="text-gray-500">No success stories match your filters. Try adjusting your criteria.</p>
            ) : (
              <div className="space-y-6">
                {filteredSuccessStories.map(story => (
                  <div key={story.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">{story.entrepreneurName}</h4>
                        <p className="text-sm text-accent1">{story.businessName}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{story.industry} • {story.location} • Est. {story.foundingYear}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Challenge:</h5>
                        <p className="mt-1 text-sm text-gray-600">{story.challenge}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Solution:</h5>
                        <p className="mt-1 text-sm text-gray-600">{story.solution}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700">Outcome:</h5>
                      <p className="mt-1 text-sm text-gray-600">{story.outcome}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700">Advice for Entrepreneurs:</h5>
                      <p className="mt-1 text-sm text-gray-600 italic">"{story.advice}"</p>
                    </div>
                    
                    {story.contactInfo && (
                      <div className="mt-4 text-right">
                        <span className="text-sm text-gray-500">Contact: {story.contactInfo}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelanganaMarketInsightsPanel;