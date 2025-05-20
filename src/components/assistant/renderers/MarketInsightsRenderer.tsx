import React, { useState } from 'react';

interface MarketInsightsRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface MarketInsights {
  overview: string;
  industryTrends: string[];
  consumerBehavior: string[];
  competitiveLandscape: {
    name: string;
    description: string;
    strengths?: string[];
  }[];
  regulatoryConsiderations: string[];
  culturalFactors: string[];
  opportunities: string[];
}

const MarketInsightsRenderer: React.FC<MarketInsightsRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Parse the content to extract market insights
  const parseInsights = (): MarketInsights => {
    // If we have structured data, use it
    if (structuredData) {
      return structuredData;
    }
    
    // Otherwise, parse from the text content
    const insights: MarketInsights = {
      overview: '',
      industryTrends: [],
      consumerBehavior: [],
      competitiveLandscape: [],
      regulatoryConsiderations: [],
      culturalFactors: [],
      opportunities: []
    };
    
    let currentSection: string = 'overview';
    let currentCompetitor: { name: string; description: string; strengths: string[] } | null = null;
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check for section headers
      if (line.toLowerCase().includes('overview') || line.toLowerCase().includes('introduction') || line.toLowerCase().includes('market summary')) {
        currentSection = 'overview';
      }
      else if (line.toLowerCase().includes('industry trend') || line.toLowerCase().includes('market trend')) {
        currentSection = 'industryTrends';
      }
      else if (line.toLowerCase().includes('consumer behavior') || line.toLowerCase().includes('customer preference')) {
        currentSection = 'consumerBehavior';
      }
      else if (line.toLowerCase().includes('competitive landscape') || line.toLowerCase().includes('competition')) {
        currentSection = 'competitiveLandscape';
        currentCompetitor = null;
      }
      else if (line.toLowerCase().includes('regulatory') || line.toLowerCase().includes('regulation') || line.toLowerCase().includes('compliance')) {
        currentSection = 'regulatoryConsiderations';
      }
      else if (line.toLowerCase().includes('cultural factor') || line.toLowerCase().includes('telangana culture')) {
        currentSection = 'culturalFactors';
      }
      else if (line.toLowerCase().includes('opportunit') || line.toLowerCase().includes('market gap')) {
        currentSection = 'opportunities';
      }
      // Check for competitor names in competitive landscape section
      else if (currentSection === 'competitiveLandscape' && line.trim() && (line.includes(':') || /^[A-Z]/.test(line.trim()[0])) && !line.trim().startsWith('-') && !line.trim().startsWith('*')) {
        // If we were building a competitor, add it to our landscape
        if (currentCompetitor) {
          insights.competitiveLandscape.push(currentCompetitor);
        }
        
        // Start a new competitor
        const parts = line.split(':');
        if (parts.length > 1) {
          currentCompetitor = {
            name: parts[0].trim(),
            description: parts.slice(1).join(':').trim(),
            strengths: []
          };
        } else {
          currentCompetitor = {
            name: line.trim(),
            description: '',
            strengths: []
          };
        }
      }
      // Process line based on current section
      else {
        // Check if line is a bullet point or numbered item
        if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
          const item = line.replace(/^[-*]\s|\d+\.\s/, '').trim();
          if (item) {
            if (currentSection === 'industryTrends') {
              insights.industryTrends.push(item);
            } else if (currentSection === 'consumerBehavior') {
              insights.consumerBehavior.push(item);
            } else if (currentSection === 'competitiveLandscape' && currentCompetitor) {
              currentCompetitor.strengths.push(item);
            } else if (currentSection === 'regulatoryConsiderations') {
              insights.regulatoryConsiderations.push(item);
            } else if (currentSection === 'culturalFactors') {
              insights.culturalFactors.push(item);
            } else if (currentSection === 'opportunities') {
              insights.opportunities.push(item);
            }
          }
        } else {
          // Add to current section content
          if (currentSection === 'overview') {
            insights.overview += ' ' + line.trim();
          } else if (currentSection === 'competitiveLandscape' && currentCompetitor) {
            currentCompetitor.description += ' ' + line.trim();
          }
        }
      }
    }
    
    // Add the last competitor if we have one
    if (currentCompetitor) {
      insights.competitiveLandscape.push(currentCompetitor);
    }
    
    return insights;
  };
  
  const insights = parseInsights();
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Telangana Market Insights</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('industryTrends')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'industryTrends'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Industry Trends
        </button>
        <button
          onClick={() => setActiveTab('consumerBehavior')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'consumerBehavior'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Consumer Behavior
        </button>
        <button
          onClick={() => setActiveTab('competitiveLandscape')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'competitiveLandscape'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Competition
        </button>
        <button
          onClick={() => setActiveTab('culturalFactors')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'culturalFactors'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cultural Factors
        </button>
      </div>
      
      {/* Tab content */}
      <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p>{insights.overview}</p>
        </div>
      </div>
      
      <div className={activeTab === 'industryTrends' ? 'block' : 'hidden'}>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-medium mb-2">Industry Trends in Telangana:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {insights.industryTrends.map((trend, index) => (
              <li key={index}>{trend}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'consumerBehavior' ? 'block' : 'hidden'}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-medium mb-2">Consumer Behavior Insights:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {insights.consumerBehavior.map((behavior, index) => (
              <li key={index}>{behavior}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'competitiveLandscape' ? 'block' : 'hidden'}>
        <div className="space-y-4">
          <h4 className="font-medium">Competitive Landscape:</h4>
          {insights.competitiveLandscape.map((competitor, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h5 className="font-medium text-primary">{competitor.name}</h5>
              <p className="text-sm text-gray-700 mb-2">{competitor.description}</p>
              
              {competitor.strengths && competitor.strengths.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-gray-700">Key Strengths:</h6>
                  <ul className="list-disc pl-5 text-sm">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className={activeTab === 'culturalFactors' ? 'block' : 'hidden'}>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-medium mb-2">Telangana Cultural Factors:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {insights.culturalFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
          
          {insights.regulatoryConsiderations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <h4 className="font-medium mb-2">Regulatory Considerations:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {insights.regulatoryConsiderations.map((regulation, index) => (
                  <li key={index}>{regulation}</li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.opportunities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <h4 className="font-medium mb-2">Market Opportunities:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {insights.opportunities.map((opportunity, index) => (
                  <li key={index}>{opportunity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketInsightsRenderer;
