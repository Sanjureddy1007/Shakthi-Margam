const logger = require('../utils/logger');
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const emailService = require('./email.service');

// Define Newsletter Subscriber model
const NewsletterSubscriber = sequelize.define('NewsletterSubscriber', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'unsubscribed'),
    defaultValue: 'active'
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      marketUpdates: true,
      successStories: true,
      events: true,
      governmentSchemes: true
    }
  }
}, {
  timestamps: true
});

/**
 * Save a newsletter subscriber
 * @param {Object} subscriber - Subscriber data
 * @param {string} subscriber.email - Subscriber email
 * @param {string} subscriber.name - Subscriber name (optional)
 * @returns {Promise<Object>} - The subscriber object
 */
exports.saveSubscriber = async (subscriber) => {
  try {
    // Check if subscriber already exists
    let existingSubscriber = await NewsletterSubscriber.findOne({
      where: { email: subscriber.email }
    });

    if (existingSubscriber) {
      // If subscriber exists but is unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        logger.info(`Reactivated newsletter subscription for ${subscriber.email}`);
      } else {
        logger.info(`Newsletter subscription already exists for ${subscriber.email}`);
      }

      return existingSubscriber;
    }

    // Create new subscriber
    const newSubscriber = await NewsletterSubscriber.create({
      email: subscriber.email,
      name: subscriber.name,
      status: 'active'
    });

    logger.info(`Created new newsletter subscription for ${subscriber.email}`);

    // Send welcome email
    await emailService.sendEmail({
      email: subscriber.email,
      template: 'newsletter',
      data: {
        name: subscriber.name || 'Subscriber'
      }
    });

    return newSubscriber;
  } catch (error) {
    logger.error(`Error saving newsletter subscriber: ${error.message}`);
    throw error;
  }
};

/**
 * Get all subscribers
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of subscribers to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.status - Filter by status
 * @returns {Promise<Object>} - Subscribers and count
 */
exports.getSubscribers = async (options = {}) => {
  try {
    const { limit = 100, offset = 0, status = 'active' } = options;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Get subscribers
    const { count, rows } = await NewsletterSubscriber.findAndCountAll({
      where: query,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      subscribers: rows,
      total: count,
      limit,
      offset
    };
  } catch (error) {
    logger.error(`Error getting subscribers: ${error.message}`);
    throw error;
  }
};

/**
 * Unsubscribe from newsletter
 * @param {string} email - The subscriber's email
 * @returns {Promise<boolean>} - Success status
 */
exports.unsubscribe = async (email) => {
  try {
    // Find subscriber
    const subscriber = await NewsletterSubscriber.findOne({
      where: { email }
    });

    if (!subscriber) {
      logger.warn(`Newsletter subscription not found for ${email}`);
      return false;
    }

    // Update status
    subscriber.status = 'unsubscribed';
    await subscriber.save();

    logger.info(`Unsubscribed ${email} from newsletter`);
    return true;
  } catch (error) {
    logger.error(`Error unsubscribing from newsletter: ${error.message}`);
    throw error;
  }
};

// Export the model for use in other services
exports.NewsletterSubscriber = NewsletterSubscriber;
