import React, { useState } from 'react';

interface BusinessAnalyticsRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface BusinessAnalytics {
  summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketPosition: string;
  growthOpportunities: string[];
  keyMetrics: {
    name: string;
    description: string;
    target?: string;
  }[];
}

const BusinessAnalyticsRenderer: React.FC<BusinessAnalyticsRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  // Parse the content to extract business analytics
  const parseAnalytics = (): BusinessAnalytics => {
    // If we have structured data, use it
    if (structuredData) {
      return structuredData;
    }
    
    // Otherwise, parse from the text content
    const analytics: BusinessAnalytics = {
      summary: '',
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      },
      marketPosition: '',
      growthOpportunities: [],
      keyMetrics: []
    };
    
    let currentSection: string = 'summary';
    let currentSwotSection: string | null = null;
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check for section headers
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('overview') || line.toLowerCase().includes('introduction')) {
        currentSection = 'summary';
        currentSwotSection = null;
      }
      else if (line.toLowerCase().includes('swot')) {
        currentSection = 'swot';
        currentSwotSection = null;
      }
      else if (currentSection === 'swot' && line.toLowerCase().includes('strength')) {
        currentSwotSection = 'strengths';
      }
      else if (currentSection === 'swot' && line.toLowerCase().includes('weakness')) {
        currentSwotSection = 'weaknesses';
      }
      else if (currentSection === 'swot' && line.toLowerCase().includes('opportunit')) {
        currentSwotSection = 'opportunities';
      }
      else if (currentSection === 'swot' && line.toLowerCase().includes('threat')) {
        currentSwotSection = 'threats';
      }
      else if (line.toLowerCase().includes('market position') || line.toLowerCase().includes('market status')) {
        currentSection = 'marketPosition';
        currentSwotSection = null;
      }
      else if (line.toLowerCase().includes('growth opportunit') || line.toLowerCase().includes('growth potential')) {
        currentSection = 'growthOpportunities';
        currentSwotSection = null;
      }
      else if (line.toLowerCase().includes('key metric') || line.toLowerCase().includes('metrics to track')) {
        currentSection = 'keyMetrics';
        currentSwotSection = null;
      }
      // Process line based on current section
      else {
        // Check if line is a bullet point or numbered item
        if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
          const item = line.replace(/^[-*]\s|\d+\.\s/, '').trim();
          if (item) {
            if (currentSection === 'swot' && currentSwotSection) {
              analytics.swot[currentSwotSection].push(item);
            } else if (currentSection === 'growthOpportunities') {
              analytics.growthOpportunities.push(item);
            } else if (currentSection === 'keyMetrics') {
              // Try to extract metric name and description
              const parts = item.split(':');
              if (parts.length > 1) {
                analytics.keyMetrics.push({
                  name: parts[0].trim(),
                  description: parts.slice(1).join(':').trim()
                });
              } else {
                analytics.keyMetrics.push({
                  name: item,
                  description: ''
                });
              }
            }
          }
        } else {
          // Add to current section content
          if (currentSection === 'summary') {
            analytics.summary += ' ' + line.trim();
          } else if (currentSection === 'marketPosition') {
            analytics.marketPosition += ' ' + line.trim();
          }
        }
      }
    }
    
    return analytics;
  };
  
  const analytics = parseAnalytics();
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Business Analytics</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-4 border-b">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'summary'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('swot')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'swot'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          SWOT Analysis
        </button>
        <button
          onClick={() => setActiveTab('marketPosition')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'marketPosition'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Market Position
        </button>
        <button
          onClick={() => setActiveTab('growthOpportunities')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'growthOpportunities'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Growth Opportunities
        </button>
        <button
          onClick={() => setActiveTab('keyMetrics')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'keyMetrics'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Key Metrics
        </button>
      </div>
      
      {/* Tab content */}
      <div className={activeTab === 'summary' ? 'block' : 'hidden'}>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p>{analytics.summary}</p>
        </div>
      </div>
      
      <div className={activeTab === 'swot' ? 'block' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-medium mb-2">Strengths:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analytics.swot.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h4 className="font-medium mb-2">Weaknesses:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analytics.swot.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-medium mb-2">Opportunities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analytics.swot.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
            <h4 className="font-medium mb-2">Threats:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analytics.swot.threats.map((threat, index) => (
                <li key={index}>{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className={activeTab === 'marketPosition' ? 'block' : 'hidden'}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-medium mb-2">Market Position:</h4>
          <p>{analytics.marketPosition}</p>
        </div>
      </div>
      
      <div className={activeTab === 'growthOpportunities' ? 'block' : 'hidden'}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-medium mb-2">Growth Opportunities:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analytics.growthOpportunities.map((opportunity, index) => (
              <li key={index}>{opportunity}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'keyMetrics' ? 'block' : 'hidden'}>
        <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
          <h4 className="font-medium mb-2">Key Metrics to Track:</h4>
          <div className="space-y-3">
            {analytics.keyMetrics.map((metric, index) => (
              <div key={index} className="border rounded p-3">
                <h5 className="font-medium text-primary">{metric.name}</h5>
                <p className="text-sm text-gray-700">{metric.description}</p>
                {metric.target && (
                  <p className="text-sm text-gray-600 mt-1">Target: {metric.target}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalyticsRenderer;
