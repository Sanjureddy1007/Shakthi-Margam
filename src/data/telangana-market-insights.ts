export interface IndustryInsight {
  id: string;
  industry: string;
  growthPotential: 'High' | 'Medium' | 'Low';
  summary: string;
  keyOpportunities: string[];
  challenges: string[];
  successStrategies: string[];
  relevantResources: string[];
}

export interface MarketTrend {
  id: string;
  trend: string;
  description: string;
  relevantIndustries: string[];
  impactLevel: 'High' | 'Medium' | 'Low';
  applicationTips: string[];
}

export interface RegionalRegulation {
  id: string;
  title: string;
  category: string;
  description: string;
  complianceRequirements: string[];
  relevantBusinessTypes: string[];
  contactDepartment: string;
  websiteLink: string;
}

export interface SuccessStoryDetailed {
  id: string;
  entrepreneurName: string;
  businessName: string;
  industry: string;
  location: string;
  foundingYear: string;
  challenge: string;
  solution: string;
  outcome: string;
  advice: string;
  contactInfo?: string;
}

export const telanganaIndustryInsights: IndustryInsight[] = [
  {
    id: "textiles",
    industry: "Textiles and Handlooms",
    growthPotential: "High",
    summary: "Telangana has a rich heritage in handlooms and textiles, particularly famous for Pochampally Ikat, Gadwal sarees, and Kalamkari. With increasing global interest in sustainable and handcrafted products, women entrepreneurs have significant opportunities in modernizing and marketing these traditional crafts.",
    keyOpportunities: [
      "E-commerce expansion for traditional textiles",
      "Export markets for handloom products",
      "Contemporary design fusion with traditional techniques",
      "Sustainable fashion using traditional crafts",
      "Direct-to-consumer business models"
    ],
    challenges: [
      "Competition from machine-made alternatives",
      "Pricing pressures and cost management",
      "Access to quality raw materials",
      "Finding skilled artisans and weavers",
      "Building effective digital marketing channels"
    ],
    successStrategies: [
      "Emphasize unique cultural heritage and storytelling",
      "Focus on product quality and authenticity",
      "Develop collaborations with contemporary designers",
      "Build strong digital presence with quality visuals",
      "Create community-based production models supporting artisans"
    ],
    relevantResources: [
      "Department of Handlooms and Textiles, Telangana",
      "National Handloom Development Corporation",
      "Textile Sector Skill Council",
      "WE-HUB Textile Innovation Program",
      "Export Promotion Council for Handicrafts"
    ]
  },
  {
    id: "food-processing",
    industry: "Food Processing",
    growthPotential: "High",
    summary: "Telangana's agricultural diversity provides excellent opportunities for food processing ventures. From pickles and spices to ready-to-eat meals and organic products, women entrepreneurs can tap into both local preferences and export markets.",
    keyOpportunities: [
      "Value-added agricultural products",
      "Traditional Telangana cuisine commercialization",
      "Organic and natural food products",
      "Ready-to-cook and ready-to-eat meals",
      "Specialized condiments and spice blends"
    ],
    challenges: [
      "Meeting food safety and quality standards",
      "Establishing consistent supply chains",
      "Shelf-life and packaging innovations",
      "Distribution and logistics constraints",
      "Building brand recognition"
    ],
    successStrategies: [
      "Ensure proper food safety certifications (FSSAI)",
      "Focus on unique regional flavors and recipes",
      "Build relationships with local farmers for quality inputs",
      "Invest in appropriate packaging technology",
      "Leverage e-commerce platforms for direct sales"
    ],
    relevantResources: [
      "MSME Food Processing Cluster, Telangana",
      "Food Processing Technology Upgradation Scheme",
      "National Institute of Food Technology, Entrepreneurship & Management (NIFTEM)",
      "Agricultural and Processed Food Products Export Development Authority (APEDA)",
      "Food Safety and Standards Authority of India (FSSAI)"
    ]
  },
  {
    id: "handicrafts",
    industry: "Handicrafts and Artisanal Products",
    growthPotential: "Medium",
    summary: "Telangana's diverse handicraft traditions including Nirmal paintings, Cheriyal scrolls, Pembarthi metal craft, and Bidriware offer women entrepreneurs opportunities to preserve cultural heritage while creating sustainable businesses.",
    keyOpportunities: [
      "Luxury and premium handicraft market",
      "Home decor and interior design products",
      "Corporate gifting solutions",
      "Tourist and souvenir markets",
      "Customized and personalized craft offerings"
    ],
    challenges: [
      "Limited awareness of Telangana crafts nationally",
      "Pricing products appropriately for sustainability",
      "Finding and training skilled artisans",
      "Product innovation while maintaining authenticity",
      "Logistics and packaging for fragile items"
    ],
    successStrategies: [
      "Create compelling stories around products and artisans",
      "Develop contemporary applications for traditional crafts",
      "Build direct relationships with interior designers and hospitality sector",
      "Use digital media to showcase craftsmanship process",
      "Form artisan cooperatives for production scaling"
    ],
    relevantResources: [
      "Telangana State Handicrafts Development Corporation",
      "Development Commissioner (Handicrafts)",
      "Export Promotion Council for Handicrafts",
      "National Center for Design and Product Development",
      "Craft Council of Telangana"
    ]
  },
  {
    id: "it-services",
    industry: "IT Services and Digital Solutions",
    growthPotential: "High",
    summary: "Hyderabad's position as a major IT hub creates numerous opportunities for women entrepreneurs in technology services, from software development to digital marketing, EdTech, HealthTech, and other specialized services.",
    keyOpportunities: [
      "B2B software and technology services",
      "EdTech solutions for local educational needs",
      "Digital marketing agencies",
      "HealthTech and medical technology",
      "Vernacular language technology solutions"
    ],
    challenges: [
      "High competition in the IT sector",
      "Keeping pace with technological changes",
      "Finding and retaining technical talent",
      "Access to early-stage technology funding",
      "Building credibility as a new tech venture"
    ],
    successStrategies: [
      "Focus on niche specializations rather than general IT services",
      "Leverage Hyderabad's tech ecosystem for partnerships",
      "Build proof-of-concept with early adopters",
      "Participate in tech incubator and accelerator programs",
      "Develop solutions addressing local/regional challenges"
    ],
    relevantResources: [
      "T-Hub, Hyderabad",
      "WE-HUB Technology Track",
      "Software Technology Parks of India (STPI), Hyderabad",
      "Telangana Academy for Skill and Knowledge (TASK)",
      "Nasscom 10,000 Startups Program"
    ]
  },
  {
    id: "beauty-wellness",
    industry: "Beauty and Wellness",
    growthPotential: "Medium",
    summary: "The beauty and wellness sector in Telangana is experiencing significant growth, with opportunities in natural and herbal products, salon services, spa facilities, and holistic wellness centers incorporating traditional practices.",
    keyOpportunities: [
      "Natural and herbal beauty products",
      "Traditional wellness and Ayurvedic centers",
      "Specialized salon services",
      "Beauty education and training institutes",
      "Men's grooming products and services"
    ],
    challenges: [
      "Regulatory compliance for cosmetic products",
      "Building trained staff for service businesses",
      "High competition in urban areas",
      "Maintaining quality control in production",
      "Educating consumers on product benefits"
    ],
    successStrategies: [
      "Incorporate traditional ingredients with scientific validation",
      "Develop signature treatments based on local traditions",
      "Create strong digital presence with before/after content",
      "Build subscription models for recurring revenue",
      "Focus on customer experience and retention"
    ],
    relevantResources: [
      "Beauty & Wellness Sector Skill Council",
      "Ministry of AYUSH support programs",
      "Central Drugs Standard Control Organization (CDSCO)",
      "Federation of Indian Chambers of Commerce & Industry (FICCI) Wellness Initiative",
      "Export Promotion Council for Cosmetics & Toiletries"
    ]
  }
];

export const telanganaMarketTrends: MarketTrend[] = [
  {
    id: "digital-adoption",
    trend: "Accelerated Digital Adoption",
    description: "Telangana consumers across all demographic segments are rapidly adopting digital technologies, online shopping, and digital payment methods, creating opportunities for businesses with strong digital presence.",
    relevantIndustries: ["Retail", "Services", "Education", "Food & Beverage", "Healthcare"],
    impactLevel: "High",
    applicationTips: [
      "Develop user-friendly mobile apps and websites",
      "Implement seamless digital payment options including UPI",
      "Create engaging content in both English and Telugu",
      "Build omnichannel customer service capabilities",
      "Leverage local digital marketplaces and delivery networks"
    ]
  },
  {
    id: "sustainable-products",
    trend: "Demand for Sustainable and Eco-friendly Products",
    description: "Growing environmental awareness among Telangana consumers is driving demand for sustainable, eco-friendly products and services, especially in urban centers like Hyderabad.",
    relevantIndustries: ["Fashion", "Home Products", "Food", "Packaging", "Personal Care"],
    impactLevel: "Medium",
    applicationTips: [
      "Emphasize natural, local, and eco-friendly materials",
      "Develop transparent supply chains with ethical sourcing",
      "Incorporate traditional eco-friendly practices in modern products",
      "Create educational content about sustainability benefits",
      "Consider plastic-free packaging alternatives"
    ]
  },
  {
    id: "hyper-local",
    trend: "Preference for Hyper-local Products and Services",
    description: "Telangana consumers are showing increased preference for local products, services, and experiences that reflect regional culture, ingredients, and traditions.",
    relevantIndustries: ["Food & Beverage", "Handicrafts", "Tourism", "Fashion", "Content"],
    impactLevel: "High",
    applicationTips: [
      "Highlight Telangana heritage in product design and marketing",
      "Incorporate local ingredients, materials, and production methods",
      "Tell authentic stories connecting products to regional identity",
      "Collaborate with local artists, producers, and cultural figures",
      "Develop products that celebrate regional festivals and traditions"
    ]
  },
  {
    id: "premiumization",
    trend: "Premiumization across Categories",
    description: "Growing middle and upper-middle class in Telangana cities are driving demand for premium products and experiences, with willingness to pay more for quality, uniqueness, and status.",
    relevantIndustries: ["Fashion", "Food & Beverage", "Home Decor", "Personal Care", "Gifting"],
    impactLevel: "Medium",
    applicationTips: [
      "Focus on quality craftsmanship and materials",
      "Create limited edition or signature product lines",
      "Develop premium packaging and presentation",
      "Build experiential elements around product purchase and use",
      "Consider membership or loyalty programs for premium customers"
    ]
  },
  {
    id: "convenience-services",
    trend: "Rise in Convenience-oriented Services",
    description: "Urban consumers in Telangana are increasingly valuing time-saving, convenience-oriented services, especially in dual-income households.",
    relevantIndustries: ["Food Delivery", "Home Services", "Education", "Health & Wellness", "Retail"],
    impactLevel: "High",
    applicationTips: [
      "Develop subscription models for recurring needs",
      "Create mobile-first service booking platforms",
      "Offer flexible scheduling including evenings and weekends",
      "Implement transparent pricing and service guarantees",
      "Build trust through consistent quality and reliability"
    ]
  }
];

export const telanganaRegulations: RegionalRegulation[] = [
  {
    id: "business-registration",
    title: "Business Registration and Licensing",
    category: "General Compliance",
    description: "Requirements for registering different types of businesses in Telangana and obtaining necessary operational licenses.",
    complianceRequirements: [
      "Business registration (Sole Proprietorship, Partnership, LLP, or Private Limited)",
      "GST registration for businesses with turnover above threshold",
      "Shop and Establishment Act registration",
      "Trade license from local municipal authority",
      "Professional Tax registration"
    ],
    relevantBusinessTypes: ["All Businesses"],
    contactDepartment: "Department of Industries & Commerce, Telangana",
    websiteLink: "https://industries.telangana.gov.in/"
  },
  {
    id: "ts-ipass",
    title: "TS-iPASS (Telangana State Industrial Project Approval and Self-Certification System)",
    category: "Industrial Policy",
    description: "Single window clearance system for industrial approvals in Telangana, designed to simplify and expedite business approvals.",
    complianceRequirements: [
      "Online application through TS-iPASS portal",
      "Self-certification for various approvals",
      "Documentation as per specific industry requirements",
      "Timeline-bound approvals with deemed approval provision",
      "Compliance with post-approval conditions"
    ],
    relevantBusinessTypes: ["Manufacturing", "Food Processing", "Textiles", "Industrial Units"],
    contactDepartment: "Commissioner of Industries, Telangana",
    websiteLink: "https://ipass.telangana.gov.in/"
  },
  {
    id: "food-safety",
    title: "Food Safety and Standards Regulations",
    category: "Industry-Specific",
    description: "Compliance requirements for food businesses operating in Telangana under the Food Safety and Standards Act.",
    complianceRequirements: [
      "FSSAI registration or license based on business size",
      "Adherence to food safety standards and hygiene practices",
      "Proper labeling and packaging requirements",
      "Regular testing of food products",
      "Maintenance of necessary records and documentation"
    ],
    relevantBusinessTypes: ["Food Processing", "Restaurants", "Catering", "Food Retail", "Packaged Foods"],
    contactDepartment: "Food Safety Department, Telangana",
    websiteLink: "https://food.telangana.gov.in/"
  },
  {
    id: "msme-registration",
    title: "MSME Registration and Benefits",
    category: "Business Development",
    description: "Registration process and associated benefits for Micro, Small, and Medium Enterprises in Telangana.",
    complianceRequirements: [
      "Udyam Registration through online portal",
      "Classification based on investment and turnover criteria",
      "Documentation of business details and bank information",
      "Annual return filing requirements",
      "Compliance with sector-specific regulations"
    ],
    relevantBusinessTypes: ["Small Businesses", "Manufacturing", "Service Sector", "Retail", "Handicrafts"],
    contactDepartment: "District Industries Centre, Telangana",
    websiteLink: "https://industries.telangana.gov.in/"
  },
  {
    id: "gst-compliance",
    title: "GST Compliance in Telangana",
    category: "Taxation",
    description: "Goods and Services Tax registration, filing, and compliance requirements specific to Telangana state.",
    complianceRequirements: [
      "GST registration for businesses with turnover above threshold",
      "Regular filing of returns (monthly/quarterly)",
      "Maintenance of proper invoicing and documentation",
      "Input tax credit reconciliation",
      "E-way bill compliance for goods transportation"
    ],
    relevantBusinessTypes: ["All Businesses with taxable supplies"],
    contactDepartment: "Commercial Taxes Department, Telangana",
    websiteLink: "https://www.tgct.gov.in/"
  }
];

export const telanganaSuccessStories: SuccessStoryDetailed[] = [
  {
    id: "siddipet-pickles",
    entrepreneurName: "Women's Collective of Irkode Village",
    businessName: "Siddipet Non-Veg. Pickles",
    industry: "Food Processing",
    location: "Irkode Village, Siddipet District",
    foundingYear: "2018",
    challenge: "Unemployment and limited economic opportunities for rural women in Irkode Village, with untapped market potential for traditional non-vegetarian pickles and value-added meat products.",
    solution: "A group of unemployed rural women received training under the 'Mera Gaon Mera Gaurav' program conducted by ICAR-National Research Centre on Meat, with financial support and equipment from the government to establish a pickle-making unit.",
    outcome: "The business is now thriving, with products sold through a mobile vehicle called 'Meat on Wheels'. The brand has gained recognition for quality and hygiene, with growing demand in local markets and surrounding areas.",
    advice: "Identify unique local food traditions that can be commercialized with proper training and hygiene standards. Government programs can provide both skills and initial financial support to transform traditional knowledge into viable businesses."
  },
  {
    id: "kheyti-greenhouses",
    entrepreneurName: "Kausalya Devi",
    businessName: "Kheyti Small-Scale Greenhouse Solutions",
    industry: "Agricultural Technology",
    location: "Vikarabad, Telangana",
    foundingYear: "2019",
    challenge: "Small farmers in Telangana faced inconsistent yields and climate vulnerability, while traditional farming methods weren't providing sufficient income for women farmers.",
    solution: "Kausalya partnered with Kheyti to implement affordable greenhouse technology specifically designed for small farmers, providing training and support for growing high-value vegetables in controlled environments.",
    outcome: "Starting with 2 women farmers, Kausalya's initiative now supports over 40 women greenhouse farmers in Vikarabad district, increasing their incomes by 300% while reducing water usage by 90% compared to open field farming.",
    advice: "Technology adaptation needs to be appropriate for local conditions. Focus on solutions that significantly improve income while reducing resource use. Create networks of women farmers who can learn from and support each other.",
    contactInfo: "info@kheyti.com"
  },
  {
    id: "oorja-textiles",
    entrepreneurName: "Padma Raj",
    businessName: "Oorja Sustainable Textiles",
    industry: "Textiles and Handlooms",
    location: "Pochampally, Telangana",
    foundingYear: "2016",
    challenge: "Traditional Pochampally ikat weavers were facing declining incomes and young women were leaving the craft. Market connection was poor and designs weren't evolving to meet contemporary tastes.",
    solution: "Padma created a social enterprise connecting master weavers with modern designers, implementing natural dyeing processes, and creating contemporary products beyond traditional sarees, including home textiles and fashion accessories.",
    outcome: "Oorja now works with 120 women artisans across 4 villages, has increased their average income by 40%, and exports products to 8 countries. They've successfully positioned Pochampally ikat as a premium sustainable textile internationally.",
    advice: "Preserve the essence of traditional crafts while innovating for contemporary markets. Focus on sustainability as a key selling point. Invest in telling the story of your artisans and processes to build brand value.",
    contactInfo: "connect@oorjatextiles.com"
  },
  {
    id: "nutrifoods-millet",
    entrepreneurName: "Sudha Reddy",
    businessName: "NutriFoods Millet Products",
    industry: "Food Processing",
    location: "Mahabubnagar, Telangana",
    foundingYear: "2017",
    challenge: "Traditional millet cultivation was declining despite its nutritional benefits and climate resilience. Women farmers growing millets weren't receiving fair prices, and urban consumers lacked convenient millet-based food options.",
    solution: "Sudha established a processing unit for creating ready-to-cook and ready-to-eat millet products, working directly with women farmers and guaranteeing purchase at premium prices for quality millets.",
    outcome: "The business now supports 200+ women millet farmers, has created employment for 30 women in processing, and offers 24 different millet products distributed in major retail chains across Telangana and neighboring states.",
    advice: "Create products that make traditional ingredients convenient for modern lifestyles. Build direct relationships with farmers to ensure quality and fair pricing. Focus on health benefits in marketing to urban consumers.",
    contactInfo: "info@nutrifoods.in"
  }
];