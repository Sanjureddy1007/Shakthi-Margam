const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  businessProfileId: {
    type: String,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  activeModule: {
    type: String,
    enum: [
      'initial-assessment',
      'telangana-market-insights',
      'social-media-strategy',
      'financial-analysis',
      'customer-profiling',
      'government-schemes'
    ],
    default: 'initial-assessment'
  },
  messages: [MessageSchema],
  summary: {
    type: String
  },
  insights: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for full-text search
ConversationSchema.index({ 
  title: 'text',
  'messages.content': 'text'
});

// Add method to add a message to the conversation
ConversationSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata
  });
  
  this.lastUpdated = new Date();
  return this.save();
};

// Add method to generate a summary of the conversation
ConversationSchema.methods.generateSummary = async function() {
  // In a real implementation, this would use an LLM to generate a summary
  const messageCount = this.messages.length;
  const lastMessage = this.messages[messageCount - 1]?.content || '';
  
  this.summary = `Conversation with ${messageCount} messages. Last message: ${lastMessage.substring(0, 50)}...`;
  return this.save();
};

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
