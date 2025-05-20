/**
 * Knowledge Base Populator
 * 
 * This utility helps populate the vector database with Telangana-specific content
 * for the Shakti Margam platform. It processes structured content and uploads
 * it to the vector store with appropriate metadata.
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const { PineconeClient } = require('@pinecone-database/pinecone');

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Pinecone client
const pinecone = new PineconeClient();

// Knowledge base categories
const CATEGORIES = {
  MARKET_DATA: 'market-data',
  GOVERNMENT_SCHEMES: 'government-schemes',
  BUSINESS_GUIDES: 'business-guides',
  CULTURAL_CONTEXT: 'cultural-context',
  SUCCESS_STORIES: 'success-stories'
};

// Telangana districts
const TELANGANA_DISTRICTS = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
  'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
  'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
  'Medak', 'Medchal–Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
  'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
  'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
  'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
];

// Industry sectors
const INDUSTRY_SECTORS = [
  'Textiles and Handicrafts', 'Food Processing', 'Beauty and Wellness',
  'Education and Training', 'Healthcare', 'Information Technology',
  'Retail', 'Agriculture', 'Tourism and Hospitality', 'Manufacturing'
];

/**
 * Main function to populate the knowledge base
 */
async function populateKnowledgeBase() {
  try {
    console.log('Initializing Pinecone...');
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    console.log('Starting knowledge base population...');

    // Process each category of content
    await processMarketData(index);
    await processGovernmentSchemes(index);
    await processBusinessGuides(index);
    await processCulturalContext(index);
    await processSuccessStories(index);

    console.log('Knowledge base population completed successfully!');
  } catch (error) {
    console.error('Error populating knowledge base:', error);
  }
}

/**
 * Process market data content
 */
async function processMarketData(index) {
  console.log('Processing market data...');
  
  const marketDataDir = path.join(__dirname, '../data/market-data');
  const files = fs.readdirSync(marketDataDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(marketDataDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (const entry of content.entries) {
        // Generate embeddings for the entry
        const embedding = await generateEmbeddings(entry.text);
        
        // Prepare metadata
        const metadata = {
          title: entry.title,
          source: content.source,
          category: CATEGORIES.MARKET_DATA,
          industry: entry.industry || null,
          district: entry.district || null,
          year: entry.year || null,
          text: entry.text
        };
        
        // Upload to vector store
        await uploadToVectorStore(index, embedding, metadata);
        
        console.log(`Uploaded market data: ${entry.title}`);
      }
    }
  }
}

/**
 * Process government schemes content
 */
async function processGovernmentSchemes(index) {
  console.log('Processing government schemes...');
  
  const schemesDir = path.join(__dirname, '../data/government-schemes');
  const files = fs.readdirSync(schemesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(schemesDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (const scheme of content.schemes) {
        // Generate embeddings for each section of the scheme
        const sections = [
          { title: 'Overview', text: scheme.overview },
          { title: 'Eligibility', text: scheme.eligibility },
          { title: 'Benefits', text: scheme.benefits },
          { title: 'Application Process', text: scheme.applicationProcess }
        ];
        
        for (const section of sections) {
          const embedding = await generateEmbeddings(section.text);
          
          // Prepare metadata
          const metadata = {
            title: `${scheme.name} - ${section.title}`,
            source: content.source,
            category: CATEGORIES.GOVERNMENT_SCHEMES,
            schemeType: scheme.type,
            implementingAgency: scheme.implementingAgency,
            text: section.text
          };
          
          // Upload to vector store
          await uploadToVectorStore(index, embedding, metadata);
          
          console.log(`Uploaded government scheme: ${metadata.title}`);
        }
      }
    }
  }
}

/**
 * Process business guides content
 */
async function processBusinessGuides(index) {
  console.log('Processing business guides...');
  
  const guidesDir = path.join(__dirname, '../data/business-guides');
  const files = fs.readdirSync(guidesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(guidesDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (const guide of content.guides) {
        for (const section of guide.sections) {
          // Generate embeddings for the section
          const embedding = await generateEmbeddings(section.content);
          
          // Prepare metadata
          const metadata = {
            title: `${guide.title} - ${section.title}`,
            source: content.source,
            category: CATEGORIES.BUSINESS_GUIDES,
            topic: guide.topic,
            industry: guide.industry || null,
            text: section.content
          };
          
          // Upload to vector store
          await uploadToVectorStore(index, embedding, metadata);
          
          console.log(`Uploaded business guide: ${metadata.title}`);
        }
      }
    }
  }
}

/**
 * Process cultural context content
 */
async function processCulturalContext(index) {
  console.log('Processing cultural context...');
  
  const culturalDir = path.join(__dirname, '../data/cultural-context');
  const files = fs.readdirSync(culturalDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(culturalDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (const entry of content.entries) {
        // Generate embeddings for the entry
        const embedding = await generateEmbeddings(entry.text);
        
        // Prepare metadata
        const metadata = {
          title: entry.title,
          source: content.source,
          category: CATEGORIES.CULTURAL_CONTEXT,
          culturalType: entry.type,
          district: entry.district || null,
          season: entry.season || null,
          text: entry.text
        };
        
        // Upload to vector store
        await uploadToVectorStore(index, embedding, metadata);
        
        console.log(`Uploaded cultural context: ${entry.title}`);
      }
    }
  }
}

/**
 * Process success stories content
 */
async function processSuccessStories(index) {
  console.log('Processing success stories...');
  
  const storiesDir = path.join(__dirname, '../data/success-stories');
  const files = fs.readdirSync(storiesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(storiesDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (const story of content.stories) {
        // Generate embeddings for each section of the story
        const sections = [
          { title: 'Background', text: story.background },
          { title: 'Challenges', text: story.challenges },
          { title: 'Solutions', text: story.solutions },
          { title: 'Results', text: story.results }
        ];
        
        for (const section of sections) {
          const embedding = await generateEmbeddings(section.text);
          
          // Prepare metadata
          const metadata = {
            title: `${story.entrepreneurName} - ${section.title}`,
            source: content.source,
            category: CATEGORIES.SUCCESS_STORIES,
            industry: story.industry,
            district: story.district,
            year: story.year,
            text: section.text
          };
          
          // Upload to vector store
          await uploadToVectorStore(index, embedding, metadata);
          
          console.log(`Uploaded success story: ${metadata.title}`);
        }
      }
    }
  }
}

/**
 * Generate embeddings for text using OpenAI
 */
async function generateEmbeddings(text) {
  const response = await openai.embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });
  
  return response.data[0].embedding;
}

/**
 * Upload data to vector store
 */
async function uploadToVectorStore(index, embedding, metadata) {
  const id = `${metadata.category}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  await index.upsert({
    upsertRequest: {
      vectors: [
        {
          id,
          values: embedding,
          metadata
        }
      ]
    }
  });
}

// Export the main function
module.exports = {
  populateKnowledgeBase,
  CATEGORIES,
  TELANGANA_DISTRICTS,
  INDUSTRY_SECTORS
};
