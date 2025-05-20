require('dotenv').config();
const { connectDB } = require('../config/database');
const { User, BusinessProfile } = require('../models/postgres');
const { VectorEntry } = require('../models/mongodb');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const openaiService = require('../services/openai.service');

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    logger.info('Connecting to databases...');
    await connectDB();
    
    logger.info('Seeding database...');
    
    // Create demo user
    const demoUser = await createDemoUser();
    
    // Create demo business profile
    const demoProfile = await createDemoBusinessProfile(demoUser.id);
    
    // Create vector entries
    await createVectorEntries();
    
    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Create a demo user
 */
async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await User.findOne({ where: { email: 'demo@shaktimargam.org' } });
    
    if (existingUser) {
      logger.info('Demo user already exists, skipping creation');
      return existingUser;
    }
    
    // Create demo user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@shaktimargam.org',
      password: hashedPassword,
      phoneNumber: '9876543210',
      district: 'Hyderabad',
      city: 'Hyderabad',
      role: 'user'
    });
    
    logger.info(`Demo user created with ID: ${demoUser.id}`);
    return demoUser;
  } catch (error) {
    logger.error(`Error creating demo user: ${error.message}`);
    throw error;
  }
}

/**
 * Create a demo business profile
 */
async function createDemoBusinessProfile(userId) {
  try {
    // Check if demo profile already exists
    const existingProfile = await BusinessProfile.findOne({
      where: { userId, name: 'Demo Handloom Business' }
    });
    
    if (existingProfile) {
      logger.info('Demo business profile already exists, skipping creation');
      return existingProfile;
    }
    
    // Create demo business profile
    const demoProfile = await BusinessProfile.create({
      userId,
      name: 'Demo Handloom Business',
      description: 'A small handloom business specializing in Pochampally sarees and textiles.',
      industry: 'Textiles & Handlooms',
      stage: 'growth',
      district: 'Hyderabad',
      city: 'Hyderabad',
      pincode: '500001',
      teamSize: 5,
      employmentType: 'full-time',
      hasCoFounders: false,
      fundingStatus: 'bootstrapped',
      revenue: {
        range: '5-10L',
        amount: 750000
      },
      socialMedia: {
        platforms: ['instagram', 'facebook'],
        contentFrequency: 'weekly'
      },
      offerings: {
        type: 'product',
        count: 3,
        priceRange: {
          min: 1500,
          max: 15000
        }
      },
      customers: {
        targetSegments: ['women', 'middle-class', 'upper-middle-class'],
        demographics: {
          ageRange: '25-55',
          gender: 'female',
          income: 'middle-high'
        },
        geographicFocus: 'state',
        acquisitionChannels: ['social-media', 'word-of-mouth', 'exhibitions']
      },
      challenges: [
        'scaling production',
        'online marketing',
        'competition from machine-made products'
      ],
      goals: {
        shortTerm: ['increase online sales', 'expand product range'],
        longTerm: ['export to international markets', 'open a flagship store']
      },
      telanganaSpecific: {
        useGovernmentSchemes: true,
        memberOfAssociations: true,
        localMarketFocus: true,
        exportFocus: false
      },
      completionPercentage: 100
    });
    
    logger.info(`Demo business profile created with ID: ${demoProfile.id}`);
    return demoProfile;
  } catch (error) {
    logger.error(`Error creating demo business profile: ${error.message}`);
    throw error;
  }
}

/**
 * Create vector entries
 */
async function createVectorEntries() {
  try {
    // Check if vector entries already exist
    const existingEntries = await VectorEntry.countDocuments();
    
    if (existingEntries > 0) {
      logger.info(`${existingEntries} vector entries already exist, skipping creation`);
      return;
    }
    
    // Sample entries for different sources
    const entries = [
      {
        content: 'The handloom sector in Telangana employs over 40,000 weavers, with Pochampally, Gadwal, and Narayanpet being the major centers. The state government offers subsidies through the Telangana Handloom Weavers Cooperative Society.',
        source: 'telangana-market-data',
        category: 'textiles',
        tags: ['handloom', 'weavers', 'pochampally', 'subsidies'],
        metadata: {
          industry: 'Textiles & Handlooms',
          district: 'Hyderabad',
          lastUpdated: '2023-06-15'
        }
      },
      {
        content: 'The WE-HUB incubation program provides women entrepreneurs with mentorship, funding up to ₹10 lakhs, workspace, and networking opportunities. The program runs for 12 months and accepts applications twice a year.',
        source: 'wehub-resources',
        category: 'incubation',
        tags: ['funding', 'mentorship', 'incubation', 'women-entrepreneurs'],
        metadata: {
          type: 'program',
          applicationDeadline: 'Biannual',
          fundingAmount: '₹10 lakhs',
          eligibility: 'Women-led startups in Telangana'
        }
      },
      {
        content: 'The Stand-Up India scheme provides loans from ₹10 lakhs to ₹1 crore to SC/ST and women entrepreneurs for setting up greenfield enterprises in manufacturing, services, or trading sectors.',
        source: 'government-schemes',
        category: 'funding',
        tags: ['loans', 'women-entrepreneurs', 'stand-up-india'],
        metadata: {
          scheme: 'Stand-Up India',
          fundingType: 'Loan',
          fundingAmount: '₹10 lakhs to ₹1 crore',
          eligibility: 'SC/ST and women entrepreneurs',
          applicationProcess: 'Apply through any Scheduled Commercial Bank'
        }
      },
      {
        content: 'Instagram marketing tips for handloom businesses: 1) Showcase the weaving process through reels, 2) Highlight the cultural significance of designs, 3) Partner with local influencers, 4) Use location-specific hashtags like #TelanganaHandlooms, 5) Run targeted ads for festival seasons.',
        source: 'social-media-guides',
        category: 'instagram',
        tags: ['social-media', 'marketing', 'handloom', 'instagram'],
        metadata: {
          industry: 'Textiles & Handlooms',
          platform: 'Instagram',
          contentType: 'Guide'
        }
      },
      {
        content: 'Business Plan Template for Handloom Business: Executive Summary, Business Description, Market Analysis, Organization Structure, Marketing Strategy, Financial Projections, Funding Requirements, Appendices.',
        source: 'business-templates',
        category: 'business-plan',
        tags: ['business-plan', 'template', 'handloom'],
        metadata: {
          industry: 'Textiles & Handlooms',
          documentType: 'Template',
          format: 'PDF'
        }
      }
    ];
    
    // Generate embeddings and create entries
    for (const entry of entries) {
      const embedding = await openaiService.generateEmbeddings(entry.content);
      
      await VectorEntry.create({
        ...entry,
        embedding,
        relevanceScore: 1.0,
        lastUpdated: new Date()
      });
    }
    
    logger.info(`Created ${entries.length} vector entries`);
  } catch (error) {
    logger.error(`Error creating vector entries: ${error.message}`);
    throw error;
  }
}

// Run the seed function
seedDatabase();
