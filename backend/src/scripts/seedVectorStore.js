require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { connectDB } = require('../config/database');
const { VectorEntry } = require('../models/mongodb');
const openaiService = require('../services/openai.service');
const pineconeService = require('../services/pinecone.service');
const logger = require('../utils/logger');

// Define the directory where the markdown files are stored
const DOCS_DIR = path.join(__dirname, '../../../docs');
const CASE_STUDIES_DIR = path.join(__dirname, '../../../case_studies');

// Define the categories and sources
const CATEGORIES = {
  'telangana-market-data': [
    'telangana_major_industries.md',
    'telangana_business_regulations.md',
    'telangana_textiles_sector.md',
    'telangana_women_entrepreneurship_info.md',
    'telangana_women_funding.md'
  ],
  'government-schemes': [
    'telangana_specific_resources_implementation.md',
    'wehub_info.md',
    'wehub_programs_impact.md',
    'funding_opportunities_women_entrepreneurs.md'
  ],
  'business-templates': [
    'implementation_framework.md',
    'shakti_margam_launch_guide.md',
    'shakti_margam_deployment_guide.md'
  ],
  'financial-resources': [
    'cash_flow_challenges_and_management_report.md',
    'cash_flow_challenges_growth.md',
    'cash_flow_management_strategies.md',
    'cash_flow_red_flags.md',
    'cash_flow_statistics.md',
    'warning_signs_cash_flow_issues.md',
    'warning_signs_mitigation_strategies.md',
    'balancing_growth_cash_flow.md',
    'financial_management_women.md',
    'financial_habits_women_entrepreneurs.md',
    'financial_habits_women_owners.md',
    'financial_tips_women_entrepreneurs.md',
    'financial_tools_women_entrepreneurs.md'
  ],
  'social-media-guides': [
    'social_media_business_statistics.md',
    'social_media_conversion_report.md',
    'social_media_guide_women_owned.md',
    'social_media_marketing_female_entrepreneurs.md',
    'social_media_metrics.md',
    'conversion_rate_metrics.md',
    'top_women_entrepreneurs_social_media.md'
  ],
  'customer-insights': [
    'platform_effectiveness_guide.md',
    'key_metrics_tracking_guide.md'
  ],
  'success-stories': [
    'telangana_women_success_story.md',
    'advice_successful_women_entrepreneurs.md',
    'spanx_case_study.md',
    'glossier_emily_weiss_case_study.md',
    'huda_kattan_case_study.md'
  ]
};

// Function to read a markdown file
const readMarkdownFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logger.error(`Error reading file ${filePath}: ${error.message}`);
    return null;
  }
};

// Function to chunk text into smaller pieces
const chunkText = (text, maxChunkSize = 1000) => {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

// Function to process a file and create embeddings
const processFile = async (filePath, source, category) => {
  try {
    const content = readMarkdownFile(filePath);
    if (!content) return;
    
    const fileName = path.basename(filePath);
    logger.info(`Processing ${fileName} for ${source}/${category}`);
    
    // Extract metadata from the file name
    const metadata = {
      fileName,
      source,
      category
    };
    
    // Add industry and district metadata if available
    if (fileName.includes('telangana')) {
      metadata.district = 'Telangana';
    }
    
    if (fileName.includes('textiles')) {
      metadata.industry = 'Textiles';
    } else if (fileName.includes('financial') || fileName.includes('cash_flow')) {
      metadata.industry = 'Finance';
    } else if (fileName.includes('social_media')) {
      metadata.industry = 'Digital Marketing';
    }
    
    // Chunk the content
    const chunks = chunkText(content);
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = `${source}-${fileName.replace('.md', '')}-${i}`;
      
      // Generate embedding
      const embedding = await openaiService.generateEmbeddings(chunk);
      
      // Create vector entry in MongoDB (as backup)
      await VectorEntry.create({
        content: chunk,
        embedding,
        metadata: {
          ...metadata,
          chunkIndex: i,
          totalChunks: chunks.length
        },
        source,
        category,
        relevanceScore: 1.0
      });
      
      // Upsert to Pinecone
      await pineconeService.upsertVectors([{
        id: chunkId,
        embedding,
        metadata: {
          ...metadata,
          text: chunk,
          chunkIndex: i,
          totalChunks: chunks.length
        }
      }]);
      
      logger.info(`Processed chunk ${i+1}/${chunks.length} for ${fileName}`);
    }
    
    return chunks.length;
  } catch (error) {
    logger.error(`Error processing file ${filePath}: ${error.message}`);
    return 0;
  }
};

// Main function to seed the vector store
const seedVectorStore = async () => {
  try {
    // Connect to databases
    await connectDB();
    
    // Clear existing entries
    await VectorEntry.deleteMany({});
    
    // Process each category
    let totalChunks = 0;
    
    for (const [source, files] of Object.entries(CATEGORIES)) {
      for (const file of files) {
        const filePath = path.join(DOCS_DIR, file);
        if (fs.existsSync(filePath)) {
          const chunks = await processFile(filePath, source, source);
          totalChunks += chunks || 0;
        } else {
          logger.warn(`File not found: ${filePath}`);
        }
      }
    }
    
    // Process case studies
    if (fs.existsSync(CASE_STUDIES_DIR)) {
      const caseStudyFiles = fs.readdirSync(CASE_STUDIES_DIR);
      for (const file of caseStudyFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(CASE_STUDIES_DIR, file);
          const chunks = await processFile(filePath, 'success-stories', 'case-study');
          totalChunks += chunks || 0;
        }
      }
    }
    
    logger.info(`Vector store seeding complete. Processed ${totalChunks} chunks.`);
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding vector store: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeding function
seedVectorStore();
