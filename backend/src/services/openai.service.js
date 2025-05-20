const { OpenAI } = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate embeddings for text
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} - The embeddings
 */
exports.generateEmbeddings = async (text) => {
  try {
    logger.info(`Generating embeddings for text: ${text.substring(0, 50)}...`);

    // Truncate text if it's too long (OpenAI has token limits)
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) : text;

    // Call OpenAI API to generate embeddings
    const response = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
      input: truncatedText
    });

    // Return the embedding vector
    return response.data[0].embedding;
  } catch (error) {
    logger.error(`Error generating embeddings: ${error.message}`);
    throw error;
  }
};

/**
 * Generate a response from the LLM
 * @param {Object} prompt - The prompt object
 * @returns {Promise<Object>} - The response
 */
exports.generateResponse = async (prompt) => {
  try {
    logger.info('Generating response from LLM');

    // Call OpenAI API to generate response
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_COMPLETION_MODEL || 'gpt-4-turbo-preview',
      messages: prompt.messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // Return the response
    return {
      content: response.choices[0].message.content,
      model: response.model,
      usage: response.usage
    };
  } catch (error) {
    logger.error(`Error generating response: ${error.message}`);

    // Provide a fallback response in case of API errors
    let fallbackResponse = "I'm sorry, I encountered an error processing your request. Please try again later.";

    // Extract the user's message for fallback logic
    const userMessage = prompt.messages.find(msg => msg.role === 'user')?.content || '';

    // Generate a fallback response based on the user's message
    if (userMessage.toLowerCase().includes('business plan')) {
      fallbackResponse = "Creating a business plan is crucial for your success. Here's a step-by-step guide tailored for women entrepreneurs in Telangana:\n\n1. **Executive Summary**: Briefly describe your business, mission, and goals.\n2. **Business Description**: Detail your products/services and what makes them unique.\n3. **Market Analysis**: Research the Telangana market, focusing on your target audience and competitors.\n4. **Organization Structure**: Outline your team and their roles.\n5. **Marketing Strategy**: Describe how you'll reach customers in Telangana.\n6. **Financial Projections**: Include startup costs, revenue forecasts, and break-even analysis.\n\nWE-HUB in Telangana offers free business plan templates and mentoring. Would you like me to help with a specific section of your business plan?";
    } else if (userMessage.toLowerCase().includes('funding') || userMessage.toLowerCase().includes('loan')) {
      fallbackResponse = "There are several funding options available for women entrepreneurs in Telangana:\n\n1. **WE-HUB Grants**: Up to ₹10 lakhs for innovative startups.\n2. **MUDRA Loans**: Under the Shishu, Kishore, and Tarun schemes (₹50,000 to ₹10 lakhs).\n3. **Stand-Up India**: Loans from ₹10 lakhs to ₹1 crore for SC/ST and women entrepreneurs.\n4. **Telangana State Women's Co-operative Development Corporation**: Offers subsidized loans.\n5. **Stree Nidhi**: Provides loans up to ₹5 lakhs with low interest rates.\n\nTo apply, you'll need a business plan, KYC documents, and business registration. Would you like specific details about any of these programs?";
    }

    return {
      content: fallbackResponse,
      error: error.message,
      model: 'fallback'
    };
  }
};
