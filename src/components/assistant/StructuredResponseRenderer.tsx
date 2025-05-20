import React from 'react';
import FourCsStrategyRenderer from './renderers/FourCsStrategyRenderer';
import PlatformRecommendationsRenderer from './renderers/PlatformRecommendationsRenderer';
import ContentCalendarRenderer from './renderers/ContentCalendarRenderer';
import MetricsAnalysisRenderer from './renderers/MetricsAnalysisRenderer';
import BusinessAnalyticsRenderer from './renderers/BusinessAnalyticsRenderer';
import MarketInsightsRenderer from './renderers/MarketInsightsRenderer';

interface StructuredResponseRendererProps {
  content: string;
  metadata?: {
    type?: string;
    module?: string;
    platform?: string;
    [key: string]: any;
  };
  structuredData?: any;
  module?: string;
}

const StructuredResponseRenderer: React.FC<StructuredResponseRendererProps> = ({
  content,
  metadata,
  structuredData,
  module = 'general'
}) => {
  // Determine the type of response to render
  const responseType = metadata?.type || 'text';
  
  // Render based on response type
  switch (responseType) {
    case 'platform_recommendations':
      return (
        <PlatformRecommendationsRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    case '4cs_strategy':
      return (
        <FourCsStrategyRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    case 'content_calendar':
      return (
        <ContentCalendarRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    case 'metrics_analysis':
      return (
        <MetricsAnalysisRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    case 'business_analytics':
      return (
        <BusinessAnalyticsRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    case 'market_insights':
      return (
        <MarketInsightsRenderer 
          content={content} 
          metadata={metadata} 
          structuredData={structuredData} 
        />
      );
      
    // Default text renderer
    default:
      return renderTextResponse(content, module);
  }
};

// Helper function to render text responses with formatting
const renderTextResponse = (content: string, module: string) => {
  // Apply module-specific styling or formatting if needed
  let formattedContent = content;
  
  // Simple markdown-like formatting
  // Convert headers
  formattedContent = formattedContent.replace(/^# (.*$)/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>');
  formattedContent = formattedContent.replace(/^## (.*$)/gm, '<h4 class="text-md font-bold mt-2 mb-1">$1</h4>');
  
  // Convert lists
  formattedContent = formattedContent.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
  formattedContent = formattedContent.replace(/^\d\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
  
  // Convert bold and italic
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks
  formattedContent = formattedContent.replace(/\n/g, '<br />');
  
  return (
    <div 
      className="text-sm whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default StructuredResponseRenderer;
