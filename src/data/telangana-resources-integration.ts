import { telanganaFundingOpportunities } from './telangana-funding';
import { 
  telanganaIndustryInsights, 
  telanganaMarketTrends, 
  telanganaRegulations,
  telanganaSuccessStories 
} from './telangana-market-insights';

// This is the main module for integrating Telangana-specific market insights and funding resources
// into the Shakti Margam AI assistant. It provides structured interfaces for the assistant
// to query and present this information to users.

export interface TelanganaMarketQuery {
  industry?: string;
  businessType?: string;
  businessStage?: string;
  fundingType?: string;
  fundingAmount?: string;
  location?: string;
}

// Main function to query funding opportunities based on user criteria
export function queryFundingOpportunities(query: TelanganaMarketQuery) {
  let results = [...telanganaFundingOpportunities];
  
  // Filter by funding type if specified
  if (query.fundingType) {
    results = results.filter(opportunity => 
      opportunity.fundingType.toLowerCase() === query.fundingType?.toLowerCase()
    );
  }
  
  // Filter by business stage
  if (query.businessStage) {
    if (query.businessStage.toLowerCase() === 'early' || query.businessStage.toLowerCase() === 'startup') {
      results = results.filter(opportunity => 
        opportunity.title.toLowerCase().includes('pre-incubation') ||
        opportunity.title.toLowerCase().includes('early') ||
        opportunity.description.toLowerCase().includes('early stage') ||
        opportunity.description.toLowerCase().includes('starting') ||
        opportunity.amount.includes('5 lakhs')
      );
    } else if (query.businessStage.toLowerCase() === 'growth' || query.businessStage.toLowerCase() === 'scaling') {
      results = results.filter(opportunity => 
        opportunity.title.toLowerCase().includes('incubation') ||
        opportunity.title.toLowerCase().includes('acceleration') ||
        opportunity.description.toLowerCase().includes('scaling') ||
        opportunity.description.toLowerCase().includes('growth')
      );
    }
  }
  
  return results;
}

// Get industry insights based on specific industry or related keywords
export function getIndustryInsights(industry?: string) {
  if (!industry) {
    return telanganaIndustryInsights;
  }
  
  const industryLower = industry.toLowerCase();
  
  // Direct match first
  const directMatch = telanganaIndustryInsights.find(insight => 
    insight.industry.toLowerCase().includes(industryLower)
  );
  
  if (directMatch) {
    return [directMatch];
  }
  
  // Keyword matching for related industries
  return telanganaIndustryInsights.filter(insight => {
    const keywords = [
      ...insight.keyOpportunities.join(' ').toLowerCase().split(' '),
      ...insight.industry.toLowerCase().split(' ')
    ];
    
    return keywords.some(keyword => industryLower.includes(keyword) || keyword.includes(industryLower));
  });
}

// Get relevant market trends for a specific industry
export function getRelevantMarketTrends(industry?: string) {
  if (!industry) {
    return telanganaMarketTrends;
  }
  
  const industryLower = industry.toLowerCase();
  
  return telanganaMarketTrends.filter(trend => 
    trend.relevantIndustries.some(relevantIndustry => 
      relevantIndustry.toLowerCase().includes(industryLower) ||
      industryLower.includes(relevantIndustry.toLowerCase())
    )
  );
}

// Get relevant regulations for a business type
export function getRelevantRegulations(businessType?: string) {
  if (!businessType) {
    return telanganaRegulations;
  }
  
  const businessTypeLower = businessType.toLowerCase();
  
  return telanganaRegulations.filter(regulation => 
    regulation.relevantBusinessTypes.some(type => 
      type.toLowerCase() === 'all businesses' ||
      type.toLowerCase().includes(businessTypeLower) ||
      businessTypeLower.includes(type.toLowerCase())
    )
  );
}

// Get success stories based on industry or location
export function getSuccessStories(query: { industry?: string, location?: string }) {
  let results = [...telanganaSuccessStories];
  
  if (query.industry) {
    const industryLower = query.industry.toLowerCase();
    results = results.filter(story => 
      story.industry.toLowerCase().includes(industryLower)
    );
  }
  
  if (query.location) {
    const locationLower = query.location.toLowerCase();
    results = results.filter(story => 
      story.location.toLowerCase().includes(locationLower)
    );
  }
  
  return results;
}

// Get personalized recommendations based on user profile
export function getPersonalizedRecommendations(profile: {
  industry: string;
  businessStage: string;
  location: string;
  challenges: string[];
}) {
  const recommendations = {
    fundingOpportunities: queryFundingOpportunities({
      industry: profile.industry,
      businessStage: profile.businessStage
    }).slice(0, 3),
    
    industryInsights: getIndustryInsights(profile.industry)[0],
    
    marketTrends: getRelevantMarketTrends(profile.industry).slice(0, 2),
    
    regulations: getRelevantRegulations(profile.industry).slice(0, 2),
    
    successStories: getSuccessStories({
      industry: profile.industry,
      location: profile.location
    }).slice(0, 1)
  };
  
  return recommendations;
}

// Function to generate text responses for the AI assistant based on the data
export function generateTelanganaMarketResponse(query: string) {
  // This function would parse the user query and generate appropriate responses
  // based on the telangana-specific data
  
  // Example implementation (would be more sophisticated in production)
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('funding') || lowerQuery.includes('financial') || lowerQuery.includes('loan') || lowerQuery.includes('grant')) {
    // Funding-related query
    let businessStage = undefined;
    
    if (lowerQuery.includes('start') || lowerQuery.includes('early') || lowerQuery.includes('new')) {
      businessStage = 'early';
    } else if (lowerQuery.includes('grow') || lowerQuery.includes('scale') || lowerQuery.includes('expand')) {
      businessStage = 'growth';
    }
    
    let fundingType = undefined;
    
    if (lowerQuery.includes('grant')) {
      fundingType = 'Grant';
    } else if (lowerQuery.includes('loan')) {
      fundingType = 'Loan';
    } else if (lowerQuery.includes('equity') || lowerQuery.includes('investment')) {
      fundingType = 'Equity';
    }
    
    const opportunities = queryFundingOpportunities({
      businessStage,
      fundingType
    });
    
    return {
      type: 'funding',
      data: opportunities.slice(0, 5),
      message: `Here are some ${fundingType || ''} funding opportunities for ${businessStage || ''} stage businesses in Telangana`
    };
  }
  
  if (lowerQuery.includes('industry') || lowerQuery.includes('sector') || lowerQuery.includes('market')) {
    // Industry-related query
    let industry = undefined;
    
    const industries = [
      'textile', 'handloom', 'food', 'handicraft', 'it', 'technology', 
      'beauty', 'wellness', 'agriculture'
    ];
    
    for (const ind of industries) {
      if (lowerQuery.includes(ind)) {
        industry = ind;
        break;
      }
    }
    
    const insights = getIndustryInsights(industry);
    
    return {
      type: 'industry',
      data: insights,
      message: `Here are insights about the ${industry || 'various'} sectors in Telangana`
    };
  }
  
  if (lowerQuery.includes('regulation') || lowerQuery.includes('compliance') || lowerQuery.includes('legal')) {
    // Regulation-related query
    let businessType = undefined;
    
    const businessTypes = [
      'food', 'manufacturing', 'service', 'retail', 'textile', 'handicraft'
    ];
    
    for (const type of businessTypes) {
      if (lowerQuery.includes(type)) {
        businessType = type;
        break;
      }
    }
    
    const regulations = getRelevantRegulations(businessType);
    
    return {
      type: 'regulations',
      data: regulations,
      message: `Here are relevant regulations for ${businessType || 'businesses'} in Telangana`
    };
  }
  
  if (lowerQuery.includes('success') || lowerQuery.includes('story') || lowerQuery.includes('example')) {
    // Success story query
    let industry = undefined;
    
    const industries = [
      'textile', 'handloom', 'food', 'handicraft', 'it', 'technology', 
      'beauty', 'wellness', 'agriculture'
    ];
    
    for (const ind of industries) {
      if (lowerQuery.includes(ind)) {
        industry = ind;
        break;
      }
    }
    
    const stories = getSuccessStories({ industry });
    
    return {
      type: 'success-stories',
      data: stories,
      message: `Here are success stories of women entrepreneurs in ${industry || 'various sectors'} in Telangana`
    };
  }
  
  // Default response for unmatched queries
  return {
    type: 'general',
    data: {
      fundingOpportunities: telanganaFundingOpportunities.slice(0, 3),
      industryInsights: telanganaIndustryInsights.slice(0, 2),
      marketTrends: telanganaMarketTrends.slice(0, 2),
      regulations: telanganaRegulations.slice(0, 2),
      successStories: telanganaSuccessStories.slice(0, 2)
    },
    message: "Here's some information about market opportunities and resources in Telangana"
  };
}