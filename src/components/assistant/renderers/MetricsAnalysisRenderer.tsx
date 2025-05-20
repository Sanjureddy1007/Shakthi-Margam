import React, { useState } from 'react';

interface MetricsAnalysisRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface MetricsAnalysis {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyMetrics: KeyMetric[];
}

interface KeyMetric {
  name: string;
  description: string;
  target?: string;
}

const MetricsAnalysisRenderer: React.FC<MetricsAnalysisRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Parse the content to extract metrics analysis
  const parseAnalysis = (): MetricsAnalysis => {
    // If we have structured data, use it
    if (structuredData) {
      return structuredData;
    }
    
    // Otherwise, parse from the text content
    const analysis: MetricsAnalysis = {
      overview: '',
      strengths: [],
      weaknesses: [],
      recommendations: [],
      keyMetrics: []
    };
    
    let currentSection: string = 'overview';
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check for section headers
      if (line.toLowerCase().includes('analysis') || line.toLowerCase().includes('overview') || line.toLowerCase().includes('current performance')) {
        currentSection = 'overview';
        if (!analysis.overview) {
          analysis.overview = line.trim();
        }
      }
      else if (line.toLowerCase().includes('strength') || line.toLowerCase().includes('what\'s working')) {
        currentSection = 'strengths';
      }
      else if (line.toLowerCase().includes('weakness') || line.toLowerCase().includes('area') && line.toLowerCase().includes('improve') || line.toLowerCase().includes('what\'s not working')) {
        currentSection = 'weaknesses';
      }
      else if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('suggestion') || line.toLowerCase().includes('what to do')) {
        currentSection = 'recommendations';
      }
      else if (line.toLowerCase().includes('key metric') || line.toLowerCase().includes('metrics to track')) {
        currentSection = 'keyMetrics';
      }
      // Process line based on current section
      else {
        // Check if line is a bullet point or numbered item
        if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
          const item = line.replace(/^[-*]\s|\d+\.\s/, '').trim();
          if (item) {
            if (currentSection === 'strengths') {
              analysis.strengths.push(item);
            } else if (currentSection === 'weaknesses') {
              analysis.weaknesses.push(item);
            } else if (currentSection === 'recommendations') {
              analysis.recommendations.push(item);
            } else if (currentSection === 'keyMetrics') {
              // Try to extract metric name and description
              const parts = item.split(':');
              if (parts.length > 1) {
                analysis.keyMetrics.push({
                  name: parts[0].trim(),
                  description: parts.slice(1).join(':').trim()
                });
              } else {
                analysis.keyMetrics.push({
                  name: item,
                  description: ''
                });
              }
            }
          }
        } else if (currentSection === 'overview') {
          // Add to overview
          analysis.overview += ' ' + line.trim();
        }
      }
    }
    
    return analysis;
  };
  
  const analysis = parseAnalysis();
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Social Media Metrics Analysis</h3>
      
      {/* Tabs */}
      <div className="flex mb-4 border-b">
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
          onClick={() => setActiveTab('strengths')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'strengths'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Strengths
        </button>
        <button
          onClick={() => setActiveTab('weaknesses')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'weaknesses'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Areas to Improve
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recommendations
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
      <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p>{analysis.overview}</p>
        </div>
      </div>
      
      <div className={activeTab === 'strengths' ? 'block' : 'hidden'}>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-medium mb-2">What's Working Well:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'weaknesses' ? 'block' : 'hidden'}>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-medium mb-2">Areas to Improve:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'recommendations' ? 'block' : 'hidden'}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-medium mb-2">Recommendations:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={activeTab === 'keyMetrics' ? 'block' : 'hidden'}>
        <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
          <h4 className="font-medium mb-2">Key Metrics to Track:</h4>
          <div className="space-y-3">
            {analysis.keyMetrics.map((metric, index) => (
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

export default MetricsAnalysisRenderer;
