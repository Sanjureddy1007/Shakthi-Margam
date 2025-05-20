const mongoose = require('mongoose');

const VectorEntrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        // Validate that the embedding is an array of numbers with the correct dimension
        return Array.isArray(v) && v.length === 1536 && v.every(num => typeof num === 'number');
      },
      message: props => `${props.value} is not a valid embedding vector!`
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: [
      'telangana-market-data',
      'government-schemes',
      'business-templates',
      'financial-resources',
      'social-media-guides',
      'customer-insights',
      'success-stories',
      'wehub-resources'
    ]
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  relevanceScore: {
    type: Number,
    default: 1.0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for vector similarity search
// Note: This requires MongoDB Atlas with vector search capability
// or a separate vector database like Pinecone
VectorEntrySchema.index({ embedding: 'vector' }, {
  name: 'vector_index',
  vectorOptions: {
    dimensions: 1536,
    similarity: 'cosine'
  }
});

// Create text index for keyword search
VectorEntrySchema.index({ 
  content: 'text',
  'metadata.title': 'text',
  tags: 'text'
});

// Create compound index for filtering
VectorEntrySchema.index({ 
  source: 1,
  category: 1,
  relevanceScore: -1
});

const VectorEntry = mongoose.model('VectorEntry', VectorEntrySchema);

module.exports = VectorEntry;
