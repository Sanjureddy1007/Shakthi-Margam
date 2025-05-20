import React, { useState } from 'react';

interface FourCsStrategyRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface StrategySection {
  title: string;
  content: string;
  items: string[];
}

const FourCsStrategyRenderer: React.FC<FourCsStrategyRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [activeTab, setActiveTab] = useState<string>('captivate');
  
  // Parse the content to extract the 4Cs sections
  // This is a simple parser that looks for section headers and bullet points
  const parseContent = (): StrategySection[] => {
    const sections: StrategySection[] = [];
    const csSections = ['Captivate', 'Cultivate', 'Convince', 'Convert'];
    
    // If we have structured data, use it
    if (structuredData && structuredData.sections) {
      return structuredData.sections;
    }
    
    // Otherwise, parse from the text content
    let currentSection: StrategySection | null = null;
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check if line is a section header (one of the 4Cs)
      const sectionMatch = csSections.find(section => 
        line.includes(section) && (line.includes('#') || line.includes(':'))
      );
      
      if (sectionMatch) {
        // If we were building a section, add it to our sections array
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start a new section
        currentSection = {
          title: sectionMatch,
          content: line.replace(/[#:]/g, '').trim(),
          items: []
        };
      } 
      // Check if line is a bullet point or numbered item
      else if (currentSection && (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim()))) {
        const item = line.replace(/^[-*]\s|\d+\.\s/, '').trim();
        if (item) {
          currentSection.items.push(item);
        }
      }
      // Add to current section content
      else if (currentSection) {
        currentSection.content += ' ' + line.trim();
      }
    }
    
    // Add the last section if we have one
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };
  
  const sections = parseContent();
  
  // Get color for each C
  const getColorForSection = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    switch (lowerTitle) {
      case 'captivate':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'cultivate':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'convince':
        return 'bg-purple-100 border-purple-500 text-purple-700';
      case 'convert':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };
  
  // Get icon for each C
  const getIconForSection = (title: string): JSX.Element => {
    const lowerTitle = title.toLowerCase();
    switch (lowerTitle) {
      case 'captivate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case 'cultivate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      case 'convince':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'convert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">4Cs Social Media Strategy</h3>
      
      {/* Tabs for the 4Cs */}
      <div className="flex mb-4 border-b">
        {sections.map((section) => (
          <button
            key={section.title.toLowerCase()}
            onClick={() => setActiveTab(section.title.toLowerCase())}
            className={`px-4 py-2 mr-2 rounded-t-lg font-medium ${
              activeTab === section.title.toLowerCase()
                ? `${getColorForSection(section.title)} border-b-2`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              {getIconForSection(section.title)}
              <span className="ml-1">{section.title}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Content for the active tab */}
      {sections.map((section) => (
        <div
          key={section.title.toLowerCase()}
          className={`${
            activeTab === section.title.toLowerCase() ? 'block' : 'hidden'
          }`}
        >
          <div className={`p-4 rounded-lg border-l-4 ${getColorForSection(section.title)}`}>
            <p className="mb-3">{section.content}</p>
            
            <h4 className="font-medium mb-2">Key Tactics:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {section.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FourCsStrategyRenderer;
