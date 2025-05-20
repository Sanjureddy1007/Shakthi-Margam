export interface AssistantModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  previewImage?: string;
}

export const assistantModules: AssistantModule[] = [
  {
    id: "initial-assessment",
    title: "Initial Assessment",
    description: "Analyze your business idea, current performance, and identify opportunities for growth.",
    icon: "clipboard-check",
    color: "primary",
    features: [
      "Business idea validation",
      "Current business health check",
      "SWOT analysis",
      "Personalized business roadmap",
      "Competition analysis"
    ],
    previewImage: "/images/digital_business_interface.png"
  },
  {
    id: "social-media-strategy",
    title: "Social Media Strategy",
    description: "Develop an effective social media presence using the 4Cs framework: Captivate, Cultivate, Convince, and Convert.",
    icon: "share",
    color: "accent1",
    features: [
      "4Cs strategy framework",
      "Platform-specific recommendations",
      "Content calendar creation",
      "Metrics tracking & analysis",
      "Success templates from top women entrepreneurs"
    ],
    previewImage: "/images/social_media_strategy.png"
  },
  {
    id: "financial-analysis",
    title: "Financial Analysis",
    description: "Manage your business finances effectively and identify opportunities for growth.",
    icon: "banknotes",
    color: "accent2",
    features: [
      "Cash flow management",
      "Expense tracking",
      "Revenue forecasting",
      "Funding opportunity identification",
      "Financial health monitoring"
    ],
    previewImage: "/images/financial_dashboard.png"
  },
  {
    id: "telangana-market-insights",
    title: "Telangana Market Insights",
    description: "Access Telangana-specific market information, funding opportunities, and success stories to grow your business locally.",
    icon: "map",
    color: "accent4",
    features: [
      "Local funding opportunities database",
      "Industry-specific growth insights",
      "Market trends and consumer behavior",
      "Local regulations and compliance guidance",
      "Success stories from Telangana women entrepreneurs"
    ],
    previewImage: "/images/telangana_marketplace.jpg"
  },
  {
    id: "customer-profiling",
    title: "Customer Profiling",
    description: "Understand your customers better to tailor your products and marketing strategies.",
    icon: "users",
    color: "accent3",
    features: [
      "Customer persona creation",
      "Target audience analysis",
      "Customer journey mapping",
      "Preference identification",
      "Market segmentation"
    ],
    previewImage: "/images/customer_persona.png"
  }
];