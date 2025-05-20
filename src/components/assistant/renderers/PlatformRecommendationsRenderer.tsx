import React, { useState } from 'react';

interface PlatformRecommendationsRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface PlatformRecommendation {
  platform: string;
  suitability: string;
  features: string[];
  contentTypes: string[];
  frequency: string;
  culturalConsiderations: string;
}

const PlatformRecommendationsRenderer: React.FC<PlatformRecommendationsRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  
  // Parse the content to extract platform recommendations
  const parseRecommendations = (): PlatformRecommendation[] => {
    const recommendations: PlatformRecommendation[] = [];
    
    // If we have structured data, use it
    if (structuredData && structuredData.platforms) {
      return structuredData.platforms;
    }
    
    // Otherwise, parse from the text content
    // This is a simple parser that looks for platform names and sections
    const platformNames = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'WhatsApp'];
    let currentPlatform: PlatformRecommendation | null = null;
    let currentSection: string = '';
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check if line contains a platform name as a header
      const platformMatch = platformNames.find(platform => 
        line.includes(platform) && (line.includes('#') || line.startsWith(platform))
      );
      
      if (platformMatch) {
        // If we were building a platform, add it to our recommendations
        if (currentPlatform) {
          recommendations.push(currentPlatform);
        }
        
        // Start a new platform
        currentPlatform = {
          platform: platformMatch,
          suitability: '',
          features: [],
          contentTypes: [],
          frequency: '',
          culturalConsiderations: ''
        };
        currentSection = 'suitability';
      } 
      // Check for section headers
      else if (line.toLowerCase().includes('why it')) {
        currentSection = 'suitability';
      }
      else if (line.toLowerCase().includes('key features') || line.toLowerCase().includes('features to leverage')) {
        currentSection = 'features';
      }
      else if (line.toLowerCase().includes('content type') || line.toLowerCase().includes('content that would perform')) {
        currentSection = 'contentTypes';
      }
      else if (line.toLowerCase().includes('posting frequency') || line.toLowerCase().includes('how often')) {
        currentSection = 'frequency';
      }
      else if (line.toLowerCase().includes('cultural') || line.toLowerCase().includes('telangana')) {
        currentSection = 'culturalConsiderations';
      }
      // Process line based on current section
      else if (currentPlatform) {
        if (currentSection === 'features' || currentSection === 'contentTypes') {
          // Check if line is a bullet point or numbered item
          if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
            const item = line.replace(/^[-*]\s|\d+\.\s/, '').trim();
            if (item) {
              if (currentSection === 'features') {
                currentPlatform.features.push(item);
              } else {
                currentPlatform.contentTypes.push(item);
              }
            }
          }
        } else {
          // Add to current section content
          if (currentSection === 'suitability') {
            currentPlatform.suitability += ' ' + line.trim();
          } else if (currentSection === 'frequency') {
            currentPlatform.frequency += ' ' + line.trim();
          } else if (currentSection === 'culturalConsiderations') {
            currentPlatform.culturalConsiderations += ' ' + line.trim();
          }
        }
      }
    }
    
    // Add the last platform if we have one
    if (currentPlatform) {
      recommendations.push(currentPlatform);
    }
    
    return recommendations;
  };
  
  const recommendations = parseRecommendations();
  
  // Get color for each platform
  const getColorForPlatform = (platform: string): string => {
    const lowerPlatform = platform.toLowerCase();
    switch (lowerPlatform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'linkedin':
        return 'bg-blue-700';
      case 'twitter':
        return 'bg-blue-400';
      case 'youtube':
        return 'bg-red-600';
      case 'whatsapp':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Toggle platform expansion
  const togglePlatform = (platform: string) => {
    if (expandedPlatform === platform) {
      setExpandedPlatform(null);
    } else {
      setExpandedPlatform(platform);
    }
  };
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Platform Recommendations</h3>
      
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.platform} className="border rounded-lg overflow-hidden">
            {/* Platform header */}
            <div 
              className={`${getColorForPlatform(rec.platform)} text-white p-3 cursor-pointer`}
              onClick={() => togglePlatform(rec.platform)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{rec.platform}</h4>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${expandedPlatform === rec.platform ? 'transform rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Platform details */}
            {expandedPlatform === rec.platform && (
              <div className="p-4">
                <div className="mb-3">
                  <h5 className="font-medium text-sm text-gray-700 mb-1">Why it's suitable:</h5>
                  <p className="text-sm">{rec.suitability}</p>
                </div>
                
                <div className="mb-3">
                  <h5 className="font-medium text-sm text-gray-700 mb-1">Key features to leverage:</h5>
                  <ul className="list-disc pl-5 text-sm">
                    {rec.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-3">
                  <h5 className="font-medium text-sm text-gray-700 mb-1">Content types that perform well:</h5>
                  <ul className="list-disc pl-5 text-sm">
                    {rec.contentTypes.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-3">
                  <h5 className="font-medium text-sm text-gray-700 mb-1">Posting frequency:</h5>
                  <p className="text-sm">{rec.frequency}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-1">Telangana cultural considerations:</h5>
                  <p className="text-sm">{rec.culturalConsiderations}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformRecommendationsRenderer;
