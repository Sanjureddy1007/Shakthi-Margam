import { KnowledgeBase } from './KnowledgeBase';
import { ModuleRegistry } from './ModuleRegistry';
import { VectorStore } from './VectorStore';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    type?: string;
    module?: string;
    sources?: Array<{
      id: string;
      source: string;
      category: string;
    }>;
    platform?: string;
    [key: string]: any;
  };
  structuredData?: any;
}

export interface ConversationContext {
  messages: Message[];
  businessProfileId?: string;
  activeModule?: string;
}

export class ShaktiMargamAIEngine {
  private knowledgeBase: KnowledgeBase;
  private moduleRegistry: ModuleRegistry;
  private vectorStore: VectorStore;

  constructor() {
    this.knowledgeBase = new KnowledgeBase();
    this.moduleRegistry = new ModuleRegistry();
    this.vectorStore = new VectorStore();
    this.initializeModules();
  }

  private initializeModules(): void {
    // Register all available modules
    this.moduleRegistry.registerModule('initial-assessment', {
      handleMessage: this.handleInitialAssessment.bind(this)
    });
    this.moduleRegistry.registerModule('social-media-strategy', {
      handleMessage: this.handleSocialMediaStrategy.bind(this)
    });
    this.moduleRegistry.registerModule('financial-analysis', {
      handleMessage: this.handleFinancialAnalysis.bind(this)
    });
    this.moduleRegistry.registerModule('telangana-market-insights', {
      handleMessage: this.handleMarketInsights.bind(this)
    });
    this.moduleRegistry.registerModule('customer-profiling', {
      handleMessage: this.handleCustomerProfiling.bind(this)
    });
  }

  public async processMessage(message: string, context: ConversationContext): Promise<string | {
    content: string;
    metadata?: any;
    structuredData?: any;
  }> {
    // 1. Determine appropriate module
    const moduleId = this.determineModuleForQuery(message, context);

    // 2. Retrieve relevant knowledge
    const knowledge = await this.retrieveKnowledge(message, moduleId);

    // 3. Generate response using module handler
    const moduleHandler = this.moduleRegistry.getModuleHandler(moduleId);
    const response = await moduleHandler.handleMessage(message, knowledge, context);

    // 4. Check if response is a string or structured object
    if (typeof response === 'string') {
      return response;
    } else {
      const structuredResponse = response as {
        content?: string;
        metadata?: any;
        structuredData?: any;
      };

      return {
        content: structuredResponse.content || '',
        metadata: {
          ...(structuredResponse.metadata || {}),
          module: moduleId
        },
        structuredData: structuredResponse.structuredData
      };
    }
  }

  private determineModuleForQuery(message: string, context: ConversationContext): string {
    // If there's an active module in the context, prioritize it
    if (context.activeModule) {
      return context.activeModule;
    }

    // Simple keyword-based module detection (to be enhanced with NLP)
    if (message.toLowerCase().includes('social media') ||
        message.toLowerCase().includes('instagram') ||
        message.toLowerCase().includes('facebook') ||
        message.toLowerCase().includes('content') ||
        message.toLowerCase().includes('followers')) {
      return 'social-media-strategy';
    } else if (message.toLowerCase().includes('cash flow') ||
               message.toLowerCase().includes('finance') ||
               message.toLowerCase().includes('money') ||
               message.toLowerCase().includes('revenue') ||
               message.toLowerCase().includes('expenses')) {
      return 'financial-analysis';
    } else if (message.toLowerCase().includes('telangana') ||
               message.toLowerCase().includes('market') ||
               message.toLowerCase().includes('local') ||
               message.toLowerCase().includes('hyderabad') ||
               message.toLowerCase().includes('funding')) {
      return 'telangana-market-insights';
    } else if (message.toLowerCase().includes('customer') ||
               message.toLowerCase().includes('audience') ||
               message.toLowerCase().includes('target') ||
               message.toLowerCase().includes('buyer') ||
               message.toLowerCase().includes('persona')) {
      return 'customer-profiling';
    }

    // Default to initial assessment if no specific domain is detected
    return 'initial-assessment';
  }

  private async retrieveKnowledge(query: string, moduleId: string): Promise<any> {
    // 1. Get module-specific knowledge
    const moduleKnowledge = this.knowledgeBase.getModuleKnowledge(moduleId);

    // 2. Perform vector search for relevant information
    const vectorResults = await this.vectorStore.search(query, 5);

    // 3. Combine and return knowledge
    return {
      moduleKnowledge,
      vectorResults
    };
  }

  // Module handler implementations
  private async handleInitialAssessment(message: string, knowledge: any, context: ConversationContext): Promise<string> {
    // Implementation for initial assessment module
    return "I'll help you assess your business. Let's start by understanding your current situation. Could you tell me about your business idea or current business status?";
  }

  private async handleSocialMediaStrategy(message: string, knowledge: any, context: ConversationContext): Promise<string | {
    content: string;
    metadata?: any;
    structuredData?: any;
  }> {
    // Implementation for social media strategy using 4Cs framework
    const lowerMessage = message.toLowerCase();

    // Check for platform recommendations request
    if (lowerMessage.includes('platform') || lowerMessage.includes('which social media')) {
      return {
        content: "Based on your business profile, here are my recommendations for social media platforms:\n\n" +
                "Instagram: Ideal for visually showcasing your products with strong appeal to women aged 18-45. Use Instagram Stories for behind-the-scenes content and Instagram Shopping for direct sales.\n\n" +
                "Facebook: Great for community building and reaching a broader audience in Telangana. Local groups and targeted ads can help you connect with potential customers in specific districts.\n\n" +
                "LinkedIn: Excellent for B2B connections, networking with other entrepreneurs, and establishing professional credibility in your industry.\n\n" +
                "Which platform are you most interested in developing a strategy for?",
        metadata: {
          type: 'platform_recommendations',
          module: 'social-media-strategy'
        },
        structuredData: {
          platforms: [
            {
              platform: 'Instagram',
              suitability: 'Ideal for visually showcasing your products with strong appeal to women aged 18-45.',
              features: [
                'Instagram Stories for behind-the-scenes content',
                'Instagram Shopping for direct sales',
                'Reels for trending content',
                'Hashtags for discoverability'
              ],
              contentTypes: [
                'Product photos and videos',
                'Customer testimonials',
                'How-to tutorials',
                'Behind-the-scenes content'
              ],
              frequency: 'Post 3-4 times per week, with daily Stories',
              culturalConsiderations: 'Incorporate Telangana festivals and cultural events into your content calendar'
            },
            {
              platform: 'Facebook',
              suitability: 'Great for community building and reaching a broader audience in Telangana.',
              features: [
                'Local groups for community engagement',
                'Targeted ads for specific districts',
                'Facebook Marketplace for local sales',
                'Events for workshops or product launches'
              ],
              contentTypes: [
                'Longer-form content and articles',
                'Community discussions',
                'Event announcements',
                'Customer success stories'
              ],
              frequency: 'Post 2-3 times per week',
              culturalConsiderations: 'Use local language options and highlight community involvement'
            },
            {
              platform: 'LinkedIn',
              suitability: 'Excellent for B2B connections, networking with other entrepreneurs, and establishing professional credibility.',
              features: [
                'Professional networking',
                'Industry groups',
                'Thought leadership articles',
                'Business page for company updates'
              ],
              contentTypes: [
                'Industry insights',
                'Professional achievements',
                'Business milestones',
                'Educational content about your field'
              ],
              frequency: 'Post 1-2 times per week',
              culturalConsiderations: 'Highlight connections to Telangana business initiatives and government programs'
            }
          ]
        }
      };
    }
    // Check for 4Cs strategy request
    else if (lowerMessage.includes('strategy') || lowerMessage.includes('framework') || lowerMessage.includes('4c')) {
      return {
        content: "Here's your customized 4Cs social media strategy framework:\n\n" +
                "Captivate: Create attention-grabbing content that showcases your unique value proposition. Use vibrant visuals, compelling stories, and content that addresses your audience's specific needs.\n\n" +
                "Cultivate: Build relationships through consistent engagement. Respond to comments, create interactive polls, and maintain a regular posting schedule to keep your audience engaged.\n\n" +
                "Convince: Establish trust and credibility by sharing testimonials, case studies, behind-the-scenes content, and educational material that demonstrates your expertise.\n\n" +
                "Convert: Turn followers into customers with clear calls-to-action, limited-time offers, and content that addresses potential objections to purchasing.\n\n" +
                "Which aspect of this framework would you like to explore further?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Captivate',
              content: 'Create attention-grabbing content that showcases your unique value proposition.',
              items: [
                'Use vibrant visuals that align with your brand identity',
                'Create compelling stories that resonate with your audience',
                'Address specific pain points your audience experiences',
                'Leverage trending topics with a unique perspective',
                'Use Telangana cultural elements to create local relevance'
              ]
            },
            {
              title: 'Cultivate',
              content: 'Build relationships through consistent engagement and community building.',
              items: [
                'Respond promptly to all comments and messages',
                'Create interactive content like polls and questions',
                'Maintain a consistent posting schedule',
                'Share user-generated content to build community',
                'Collaborate with complementary local businesses'
              ]
            },
            {
              title: 'Convince',
              content: 'Establish trust and credibility to overcome objections.',
              items: [
                'Share authentic customer testimonials and reviews',
                'Create case studies highlighting customer success',
                'Provide educational content that demonstrates expertise',
                'Show behind-the-scenes content to build authenticity',
                'Address common concerns or objections directly'
              ]
            },
            {
              title: 'Convert',
              content: 'Turn followers into customers with strategic calls-to-action.',
              items: [
                'Create clear, compelling calls-to-action',
                'Offer limited-time promotions to create urgency',
                'Simplify the purchasing process',
                'Provide social proof at the point of conversion',
                'Follow up with customers to encourage repeat business'
              ]
            }
          ]
        }
      };
    }
    // Check for content calendar request
    else if (lowerMessage.includes('calendar') || lowerMessage.includes('schedule') || lowerMessage.includes('post')) {
      return {
        content: "Here's a 4-week content calendar for your social media strategy:\n\n" +
                "Week 1 - Brand Awareness: Focus on introducing your brand values, story, and unique selling points.\n" +
                "Monday: Share your founder's story\n" +
                "Wednesday: Highlight your best-selling product\n" +
                "Friday: Post about your brand values and mission\n\n" +
                "Week 2 - Educational Content: Establish expertise in your field.\n" +
                "Monday: Share a how-to tutorial\n" +
                "Wednesday: Post industry insights or trends\n" +
                "Friday: Create a myth-busting post about your industry\n\n" +
                "Week 3 - Community Engagement: Build relationships with your audience.\n" +
                "Monday: Feature a customer success story\n" +
                "Wednesday: Run a poll or question to encourage interaction\n" +
                "Friday: Highlight a local Telangana event or tradition\n\n" +
                "Week 4 - Conversion Focus: Drive sales and conversions.\n" +
                "Monday: Share a limited-time offer\n" +
                "Wednesday: Post a product demonstration\n" +
                "Friday: Create a testimonial highlight\n\n" +
                "Would you like me to customize this calendar further for your specific business?",
        metadata: {
          type: 'content_calendar',
          module: 'social-media-strategy',
          platform: 'instagram'
        },
        structuredData: {
          weeks: [
            {
              weekNumber: 1,
              theme: 'Brand Awareness: Focus on introducing your brand values, story, and unique selling points',
              posts: [
                {
                  day: 'Monday',
                  contentType: 'Story + Post',
                  description: 'Share your founder\'s story and journey',
                  time: '12:00 PM',
                  hashtags: ['#WomenEntrepreneurs', '#TelanganaBusinesses', '#FounderStory']
                },
                {
                  day: 'Wednesday',
                  contentType: 'Product Feature',
                  description: 'Highlight your best-selling product with professional photos',
                  time: '5:30 PM',
                  hashtags: ['#MadeInTelangana', '#QualityCrafts', '#ShopLocal']
                },
                {
                  day: 'Friday',
                  contentType: 'Carousel',
                  description: 'Post about your brand values and mission with impactful visuals',
                  time: '6:00 PM',
                  hashtags: ['#BrandValues', '#SustainableBusiness', '#WomenEmpowerment']
                }
              ]
            },
            {
              weekNumber: 2,
              theme: 'Educational Content: Establish expertise in your field',
              posts: [
                {
                  day: 'Monday',
                  contentType: 'Tutorial Video',
                  description: 'Share a how-to tutorial related to your products',
                  time: '1:00 PM',
                  hashtags: ['#HowTo', '#DIYTips', '#LearnWithUs']
                },
                {
                  day: 'Wednesday',
                  contentType: 'Infographic',
                  description: 'Post industry insights or trends in an easy-to-digest format',
                  time: '4:00 PM',
                  hashtags: ['#IndustryInsights', '#BusinessTips', '#KnowYourMarket']
                },
                {
                  day: 'Friday',
                  contentType: 'Myth-busting Post',
                  description: 'Create a myth-busting post about common misconceptions in your industry',
                  time: '7:00 PM',
                  hashtags: ['#MythBusters', '#FactCheck', '#IndustryTruths']
                }
              ]
            },
            {
              weekNumber: 3,
              theme: 'Community Engagement: Build relationships with your audience',
              posts: [
                {
                  day: 'Monday',
                  contentType: 'Customer Story',
                  description: 'Feature a customer success story or testimonial',
                  time: '11:00 AM',
                  hashtags: ['#CustomerStories', '#HappyCustomers', '#Testimonial']
                },
                {
                  day: 'Wednesday',
                  contentType: 'Poll or Question',
                  description: 'Run a poll or question in Stories to encourage interaction',
                  time: '3:00 PM',
                  hashtags: ['#JoinTheConversation', '#HaveYourSay', '#CommunityPoll']
                },
                {
                  day: 'Friday',
                  contentType: 'Cultural Post',
                  description: 'Highlight a local Telangana event, tradition, or festival',
                  time: '5:00 PM',
                  hashtags: ['#TelanganaCulture', '#LocalTraditions', '#CelebrateTelangana']
                }
              ]
            },
            {
              weekNumber: 4,
              theme: 'Conversion Focus: Drive sales and conversions',
              posts: [
                {
                  day: 'Monday',
                  contentType: 'Promotion',
                  description: 'Share a limited-time offer or discount code',
                  time: '10:00 AM',
                  hashtags: ['#SpecialOffer', '#LimitedTime', '#ExclusiveDeal']
                },
                {
                  day: 'Wednesday',
                  contentType: 'Demo Video',
                  description: 'Post a product demonstration showing features and benefits',
                  time: '2:00 PM',
                  hashtags: ['#ProductDemo', '#HowItWorks', '#SeeItInAction']
                },
                {
                  day: 'Friday',
                  contentType: 'Testimonial Highlight',
                  description: 'Create a visually appealing testimonial highlight',
                  time: '6:30 PM',
                  hashtags: ['#CustomerReviews', '#RealResults', '#WhyChooseUs']
                }
              ]
            }
          ]
        }
      };
    }
    // Check for specific 4Cs components
    else if (lowerMessage.includes('captivate') || lowerMessage.includes('attention')) {
      return {
        content: "For the Captivate phase of the 4Cs framework, focus on creating attention-grabbing content that resonates with your target audience. This includes eye-catching visuals, compelling headlines, and content that addresses your audience's pain points directly. What type of content has worked best for capturing your audience's attention so far?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Captivate',
              content: 'Focus on creating attention-grabbing content that resonates with your target audience.',
              items: [
                'Use eye-catching visuals with bold colors and clear focal points',
                'Craft compelling headlines that spark curiosity or emotion',
                'Address your audience\'s pain points directly in your content',
                'Leverage trending formats like Reels or Stories for increased reach',
                'Incorporate Telangana cultural elements that resonate locally'
              ]
            }
          ]
        }
      };
    } else if (lowerMessage.includes('cultivate') || lowerMessage.includes('relationship')) {
      return {
        content: "The Cultivate phase of the 4Cs framework is about building relationships with your audience through consistent engagement. This includes responding to comments, creating interactive content, and maintaining a regular posting schedule. How are you currently engaging with your followers?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Cultivate',
              content: 'Build relationships with your audience through consistent engagement.',
              items: [
                'Respond to all comments and messages within 24 hours',
                'Create interactive content like polls, quizzes, and questions',
                'Maintain a regular posting schedule for predictability',
                'Show appreciation for user-generated content and shares',
                'Join relevant local conversations and community discussions'
              ]
            }
          ]
        }
      };
    } else if (lowerMessage.includes('convince') || lowerMessage.includes('trust')) {
      return {
        content: "For the Convince phase, focus on building trust and showcasing your expertise. Share testimonials, case studies, behind-the-scenes content, and educational material that demonstrates your knowledge. What evidence of your expertise or success could you share with your audience?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Convince',
              content: 'Build trust and showcase your expertise to overcome objections.',
              items: [
                'Share authentic customer testimonials with permission',
                'Create detailed case studies of successful customer outcomes',
                'Provide educational content that demonstrates your knowledge',
                'Show behind-the-scenes content of your process and quality controls',
                'Address common objections before they become barriers to purchase'
              ]
            }
          ]
        }
      };
    } else if (lowerMessage.includes('convert') || lowerMessage.includes('sale')) {
      return {
        content: "The Convert phase is about turning followers into customers. This includes clear calls-to-action, limited-time offers, and addressing objections. What specific products or services would you like to promote, and what objections might your audience have?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Convert',
              content: 'Turn followers into customers with strategic calls-to-action.',
              items: [
                'Create clear, compelling calls-to-action in every promotional post',
                'Offer limited-time promotions to create urgency',
                'Use social proof at the point of conversion',
                'Make the purchasing process as simple as possible',
                'Follow up with new customers to ensure satisfaction and encourage reviews'
              ]
            }
          ]
        }
      };
    } else {
      return {
        content: "Let's develop your social media strategy using the 4Cs framework: Captivate, Cultivate, Convince, and Convert. This approach will help you build an effective social media presence that not only attracts followers but converts them into customers. Which aspect would you like to focus on first?",
        metadata: {
          type: '4cs_strategy',
          module: 'social-media-strategy'
        },
        structuredData: {
          sections: [
            {
              title: 'Captivate',
              content: 'Create attention-grabbing content that showcases your unique value proposition.',
              items: [
                'Use vibrant visuals that align with your brand identity',
                'Create compelling stories that resonate with your audience',
                'Address specific pain points your audience experiences'
              ]
            },
            {
              title: 'Cultivate',
              content: 'Build relationships through consistent engagement and community building.',
              items: [
                'Respond promptly to all comments and messages',
                'Create interactive content like polls and questions',
                'Maintain a consistent posting schedule'
              ]
            },
            {
              title: 'Convince',
              content: 'Establish trust and credibility to overcome objections.',
              items: [
                'Share authentic customer testimonials and reviews',
                'Create case studies highlighting customer success',
                'Provide educational content that demonstrates expertise'
              ]
            },
            {
              title: 'Convert',
              content: 'Turn followers into customers with strategic calls-to-action.',
              items: [
                'Create clear, compelling calls-to-action',
                'Offer limited-time promotions to create urgency',
                'Simplify the purchasing process'
              ]
            }
          ]
        }
      };
    }
  }

  private async handleFinancialAnalysis(message: string, knowledge: any, context: ConversationContext): Promise<string> {
    // Implementation for financial analysis using SHAKTI framework
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('secure') || lowerMessage.includes('revenue')) {
      return "For Securing Revenue Streams in the SHAKTI framework, consider diversifying your income sources, implementing customer retention strategies, and exploring subscription or recurring revenue models. What are your current revenue sources, and how stable are they?";
    } else if (lowerMessage.includes('handle') || lowerMessage.includes('expenses')) {
      return "Handling Expenses Wisely involves categorizing and prioritizing your costs, negotiating with vendors, and optimizing resource usage. What are your major expense categories, and which ones do you think could be reduced?";
    } else if (lowerMessage.includes('anticipate') || lowerMessage.includes('forecast')) {
      return "Anticipating Cash Flow Gaps requires regular forecasting, planning for seasonal variations, and establishing emergency funds. How far ahead do you currently plan your cash flow, and have you identified any potential gaps?";
    } else if (lowerMessage.includes('keep') || lowerMessage.includes('records')) {
      return "Keeping Accurate Records is essential for financial health. This includes digital bookkeeping, organized invoice management, and regular financial statement preparation. What system do you currently use to track your finances?";
    } else if (lowerMessage.includes('track') || lowerMessage.includes('metrics')) {
      return "Tracking Key Metrics helps you understand your financial performance. Focus on cash flow KPIs, profitability analysis, and customer acquisition costs. Which financial metrics do you currently monitor regularly?";
    } else if (lowerMessage.includes('implement') || lowerMessage.includes('growth')) {
      return "Implementing Growth Strategies involves reinvestment planning, understanding sustainable growth rates, and identifying appropriate funding sources. What are your growth goals, and how do you plan to finance them?";
    } else {
      return "I'll help you manage your finances using the SHAKTI framework for effective cash flow management. This includes: Securing revenue streams, Handling expenses wisely, Anticipating cash flow gaps, Keeping accurate records, Tracking key metrics, and Implementing growth strategies. Which aspect of your financial management would you like to focus on first?";
    }
  }

  private async handleMarketInsights(message: string, knowledge: any, context: ConversationContext): Promise<string> {
    // Implementation for Telangana market insights
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('funding') || lowerMessage.includes('grants') || lowerMessage.includes('loans')) {
      return "Telangana offers several funding opportunities for women entrepreneurs, including programs from WE-HUB, Telangana State Women's Development Corporation, and Stree Nidhi. These range from grants to low-interest loans. What stage is your business at, and what type of funding are you looking for?";
    } else if (lowerMessage.includes('industry') || lowerMessage.includes('sector')) {
      return "Telangana has several thriving industries for women entrepreneurs, including textiles, food processing, handicrafts, IT services, and beauty & wellness. Each has unique opportunities and challenges. Which industry are you operating in or interested in exploring?";
    } else if (lowerMessage.includes('regulations') || lowerMessage.includes('compliance')) {
      return "Understanding Telangana's business regulations is important for smooth operations. These include registration requirements, tax compliance, and industry-specific regulations. What specific regulatory information would be most helpful for your business?";
    } else if (lowerMessage.includes('success') || lowerMessage.includes('stories')) {
      return "Telangana has many successful women entrepreneurs who have overcome challenges similar to what you might be facing. Their stories can provide valuable insights and inspiration. Would you like to hear about entrepreneurs in a specific industry or location?";
    } else {
      return "Here are some insights about the Telangana market that can help your business grow. Telangana offers a supportive ecosystem for women entrepreneurs with government initiatives like WE-HUB, funding opportunities, and growing markets in several sectors. Would you like specific information about funding, industry insights, regulations, or success stories?";
    }
  }

  private async handleCustomerProfiling(message: string, knowledge: any, context: ConversationContext): Promise<string> {
    // Implementation for customer profiling
    return "Let's create detailed customer personas to better understand your target audience. This will help you tailor your products, marketing, and overall business strategy. Could you describe who you believe your ideal customer is, including their demographics, interests, pain points, and buying behaviors?";
  }
}
