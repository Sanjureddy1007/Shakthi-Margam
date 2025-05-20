export interface BusinessProfile {
  id: string;
  // Basic business details
  name: string;
  description: string;
  industry: string;
  stage: 'idea' | 'startup' | 'growth' | 'established';
  foundingYear?: number;
  
  // Location information
  location: {
    district: string;
    city: string;
    pincode?: string;
  };
  
  // Team information
  team: {
    size: number;
    employmentType: 'full-time' | 'part-time' | 'mixed' | 'none';
    hasCoFounders: boolean;
  };
  
  // Financial details
  financials: {
    monthlyRevenue?: number;
    monthlyExpenses?: number;
    profitMargin?: number;
    fundingStatus: 'bootstrapped' | 'friends-family' | 'angel' | 'venture' | 'grant' | 'loan' | 'mixed';
    fundingAmount?: number;
  };
  
  // Social media presence
  socialMedia: {
    platforms: {
      name: 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'twitter' | 'whatsapp' | 'other';
      handle?: string;
      followers?: number;
      engagement?: number;
      active: boolean;
    }[];
    contentFrequency?: 'daily' | 'weekly' | 'monthly' | 'irregular' | 'none';
    primaryPlatform?: string;
  };
  
  // Products and services
  offerings: {
    type: 'product' | 'service' | 'both';
    count: number;
    priceRange: {
      min: number;
      max: number;
    };
    productionType?: 'handmade' | 'manufactured' | 'digital' | 'mixed' | 'not-applicable';
    deliveryMethod?: 'in-person' | 'shipping' | 'digital' | 'mixed';
  };
  
  // Customer information
  customers: {
    targetSegments: string[];
    demographics: {
      ageRange?: {
        min: number;
        max: number;
      };
      primaryGender?: 'male' | 'female' | 'mixed';
      incomeLevel?: 'low' | 'middle' | 'high' | 'mixed';
      education?: 'school' | 'undergraduate' | 'graduate' | 'mixed';
    };
    geographicFocus: 'local' | 'state' | 'national' | 'international' | 'mixed';
    acquisitionChannels: string[];
  };
  
  // Business challenges and goals
  challenges: string[];
  goals: {
    shortTerm: string[];
    longTerm: string[];
  };
  
  // Telangana-specific information
  telanganaSpecific: {
    useGovernmentSchemes: boolean;
    schemesUsed?: string[];
    memberOfAssociations: boolean;
    associationNames?: string[];
    localMarketFocus: boolean;
    exportFocus: boolean;
  };
  
  // Assessment results
  assessments?: {
    date: string;
    type: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }[];
  
  // Created and updated timestamps
  createdAt: string;
  updatedAt: string;
}
